// Records README media: scroll-through GIFs and still screenshots of the NBF
// home page and Plumín, using headless Chromium (DevTools protocol) and ffmpeg.
//
//   pnpm dev --port 5288 &   # in another terminal
//   node scripts/capture-demo.mjs [http://localhost:5288]
//
// Needs `chromium` and `ffmpeg` on PATH. Writes to docs/media/.
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

// The only input: a page origin for the browser to open, never part of a command.
const BASE = (() => {
	const url = new URL(process.argv[2] ?? "http://localhost:5288");
	if (url.protocol !== "http:" && url.protocol !== "https:")
		throw new Error("The base must be an http(s) URL");
	return url.origin;
})();
const OUT = new URL("../docs/media/", import.meta.url).pathname;
const WIDTH = 1280;
const HEIGHT = 720;
const PORT = 9333;

// A fixed binary with an argument array and no shell: nothing is interpreted.
const ffmpeg = (args) =>
	new Promise((resolve, reject) => {
		const child = spawn("ffmpeg", args, { stdio: "ignore", shell: false });
		child.on("exit", (code) =>
			code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)),
		);
	});

const profile = await mkdtemp(join(tmpdir(), "nbf-capture-"));
const browser = spawn(
	"chromium",
	[
		"--headless=new",
		`--remote-debugging-port=${PORT}`,
		`--user-data-dir=${profile}`,
		`--window-size=${WIDTH},${HEIGHT}`,
		"--hide-scrollbars",
		"--no-first-run",
		"about:blank",
	],
	// Argument array, no shell; the only interpolations are a temp dir and constants.
	{ stdio: "ignore", shell: false },
);

async function connect() {
	for (let i = 0; i < 50; i++) {
		try {
			const pages = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
			const page = pages.find((p) => p.type === "page");
			if (page) return new WebSocket(page.webSocketDebuggerUrl);
		} catch {
			// Browser still starting.
		}
		await sleep(200);
	}
	throw new Error("Chromium did not open a debugging port");
}

const socket = await connect();
await new Promise((resolve) => socket.addEventListener("open", resolve));
let nextId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
	const message = JSON.parse(event.data);
	if (message.id && pending.has(message.id)) {
		pending.get(message.id)(message);
		pending.delete(message.id);
	}
});
const send = (method, params = {}) =>
	new Promise((resolve, reject) => {
		const id = ++nextId;
		pending.set(id, (message) =>
			message.error
				? reject(new Error(`${method}: ${message.error.message}`))
				: resolve(message.result),
		);
		socket.send(JSON.stringify({ id, method, params }));
	});
const evaluate = async (expression) =>
	(await send("Runtime.evaluate", { expression, awaitPromise: true })).result
		.value;

await send("Emulation.setDeviceMetricsOverride", {
	width: WIDTH,
	height: HEIGHT,
	deviceScaleFactor: 1,
	mobile: false,
});

async function open(path, settle = 3500) {
	await send("Page.navigate", { url: BASE + path });
	await sleep(settle);
	// The film grain is random noise in every frame: it would triple the GIF size.
	await evaluate(
		"document.head.insertAdjacentHTML('beforeend','<style>.nbf-grain{display:none}</style>')",
	);
}

async function shot(file) {
	const { data } = await send("Page.captureScreenshot", { format: "png" });
	await writeFile(join(OUT, file), Buffer.from(data, "base64"));
	console.log("wrote", file);
}

/** Scrolls from `from` to `to` (fractions of the page) capturing frames, then encodes a GIF. */
async function recordScroll(name, { from = 0, to = 1, seconds = 9, fps = 10 }) {
	const frames = await mkdtemp(join(tmpdir(), `nbf-${name}-`));
	const total = Math.round(seconds * fps);
	const max = await evaluate(
		"document.documentElement.scrollHeight - innerHeight",
	);
	for (let i = 0; i <= total; i++) {
		const t = i / total;
		// Ease in and out so the start and end of the tour linger a little.
		const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
		const y = Math.round((from + (to - from) * eased) * max);
		await evaluate(`window.scrollTo(0, ${y})`);
		await sleep(1000 / fps);
		const { data } = await send("Page.captureScreenshot", {
			format: "jpeg",
			quality: 85,
		});
		await writeFile(
			join(frames, `${String(i).padStart(4, "0")}.jpg`),
			Buffer.from(data, "base64"),
		);
	}
	const filter = `fps=${fps},scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`;
	await ffmpeg([
		"-y",
		"-loglevel",
		"error",
		"-framerate",
		String(fps),
		"-i",
		join(frames, "%04d.jpg"),
		"-vf",
		filter,
		"-loop",
		"0",
		join(OUT, `${name}.gif`),
	]);
	await rm(frames, { recursive: true, force: true });
	console.log("wrote", `${name}.gif`);
}

try {
	await mkdir(OUT, { recursive: true });

	// NBF home: the intro plays first (fresh profile), then the scroll tour.
	await open("/", 4500);
	await shot("nbf-hero.png");
	await recordScroll("nbf-tour", { seconds: 14 });
	await open("/#proyectos", 2500);
	await shot("nbf-work.png");

	// Plumín: home tour, plus the catalogue and a product page.
	await open("/f/001-plumin", 4000);
	await shot("plumin-home.png");
	await recordScroll("plumin-tour", { to: 0.75, seconds: 9 });
	await open("/f/001-plumin/tintas", 3000);
	await shot("plumin-catalogue.png");
	await open("/f/001-plumin/tintas/granada", 3000);
	await shot("plumin-product.png");
} finally {
	socket.close();
	browser.kill();
	await rm(profile, { recursive: true, force: true });
}
