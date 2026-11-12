/** Time spent inking strokes; lifts between strokes are added on top. */
const INKING_MS = 5200;
/** Pen travel between strokes, so the nib glides instead of teleporting. */
const LIFT_MS = 60;
const HOLD_MS = 1600;
const FADE_MS = 200;
const SVG_NS = "http://www.w3.org/2000/svg";

function node(tag: string, attributes: Record<string, string>) {
	const element = document.createElementNS(SVG_NS, tag);
	for (const [name, value] of Object.entries(attributes))
		element.setAttribute(name, value);
	return element;
}

export type HandwritingPlayback = {
	cancel: () => void;
	/** Clears the text and writes it again; the ruled lines stay. */
	restart: () => void;
};

/** Uses one loop clock for all strokes and the nib. */
export function createHandwritingPlayback(
	svg: SVGSVGElement,
): HandwritingPlayback {
	const box = svg.getBBox();
	const left = box.x - 8;
	const right = box.x + box.width + 8;
	const svgMatrix = svg.getCTM();
	if (!svgMatrix)
		throw new Error("The handwriting SVG must be mounted before playback.");
	const toSvg = (element: SVGGraphicsElement) => {
		const matrix = element.getCTM();
		if (!matrix) throw new Error("Missing handwriting transform.");
		return svgMatrix.inverse().multiply(matrix);
	};

	// Vara's line groups start on their typographic baselines. Drawing the rules
	// in that coordinate space keeps them aligned through responsive scaling.
	const rules = node("g", {
		stroke: "#cdd1e3",
		"stroke-width": "1.5",
		"aria-hidden": "true",
	});
	for (const line of svg.querySelectorAll<SVGGElement>(".outer > g")) {
		const origin = svg.createSVGPoint().matrixTransform(toSvg(line));
		rules.append(
			node("line", {
				x1: String(left),
				x2: String(right),
				y1: String(origin.y + 1),
				y2: String(origin.y + 1),
				"vector-effect": "non-scaling-stroke",
				"data-handwriting-rule": "",
			}),
		);
	}
	svg.prepend(rules);

	const paths = Array.from(svg.querySelectorAll("path")).filter(
		(path) => path.getAttribute("stroke") !== "transparent",
	);
	const lengths = paths.map((path) => path.getTotalLength());
	const total = lengths.reduce((sum, length) => sum + length, 0);
	if (total <= 0)
		throw new Error("The handwriting font has no drawable strokes.");
	let elapsed = 0;
	const strokes = paths.map((path, index) => {
		const length = lengths[index] ?? 0;
		if (index > 0) elapsed += LIFT_MS;
		const start = elapsed;
		elapsed += (INKING_MS * length) / total;
		const matrix = toSvg(path);
		return {
			path,
			length,
			start,
			end: elapsed,
			matrix,
			from: path.getPointAtLength(0).matrixTransform(matrix),
			to: path.getPointAtLength(length).matrixTransform(matrix),
		};
	});
	const writingMs = elapsed;
	const cycleMs = writingMs + HOLD_MS + FADE_MS;

	const animations: Animation[] = [];
	try {
		for (const stroke of strokes) {
			const offset = stroke.path.style.strokeDashoffset;
			animations.push(
				stroke.path.animate(
					[
						{ offset: 0, strokeDashoffset: offset, opacity: 1 },
						{
							offset: stroke.start / cycleMs,
							strokeDashoffset: offset,
							opacity: 1,
						},
						{
							offset: stroke.end / cycleMs,
							strokeDashoffset: "0",
							opacity: 1,
						},
						{
							offset: (writingMs + HOLD_MS) / cycleMs,
							strokeDashoffset: "0",
							opacity: 1,
						},
						{ offset: 1, strokeDashoffset: "0", opacity: 0 },
					],
					{
						duration: cycleMs,
						iterations: Number.POSITIVE_INFINITY,
						easing: "linear",
						fill: "both",
					},
				),
			);
		}
	} catch (error) {
		for (const animation of animations) animation.cancel();
		throw error;
	}
	const startTime = document.timeline?.currentTime;
	if (startTime != null)
		for (const animation of animations) animation.startTime = startTime;

	// The nib tip is (0, 0), driven by the actual path rather than character widths.
	const pen = node("g", {
		"data-writing-pen": "",
		"aria-hidden": "true",
		visibility: "hidden",
	});
	pen.append(
		node("path", { d: "M-7-34v-39a7 7 0 0 1 14 0v39Z", fill: "#172058" }),
		node("path", {
			d: "M-7-36H7L9-23 0 0-9-23Z",
			fill: "#d9b574",
			stroke: "#a98341",
			"stroke-width": ".8",
		}),
		node("path", {
			d: "M0-16V0M-4-65v20",
			stroke: "#fff",
			"stroke-opacity": ".65",
			"stroke-width": "1.5",
			"stroke-linecap": "round",
		}),
		node("path", {
			d: "M0-21a2 2 0 1 0 0 4 2 2 0 0 0 0-4M0-16V0",
			fill: "#172058",
			stroke: "#172058",
			"stroke-width": ".8",
		}),
	);
	svg.append(pen);
	let frame: number | undefined;
	let cancelled = false;
	const movePen = (x: number, y: number) =>
		pen.setAttribute("transform", `translate(${x} ${y}) rotate(35)`);
	const drawPen = () => {
		if (cancelled) return;
		const time = Number(animations[0]?.currentTime ?? 0) % cycleMs;
		const index = strokes.findIndex((part) => time < part.end);
		const stroke = time < writingMs ? strokes[index] : undefined;
		pen.setAttribute("visibility", stroke ? "visible" : "hidden");
		if (stroke && time >= stroke.start) {
			const fraction = (time - stroke.start) / (stroke.end - stroke.start);
			const point = stroke.path
				.getPointAtLength(stroke.length * fraction)
				.matrixTransform(stroke.matrix);
			movePen(point.x, point.y);
		} else if (stroke) {
			// Lifted between strokes: glide from the previous end to this start.
			const previous = strokes[index - 1] ?? stroke;
			const t = (time - previous.end) / LIFT_MS;
			movePen(
				previous.to.x + (stroke.from.x - previous.to.x) * t,
				previous.to.y + (stroke.from.y - previous.to.y) * t,
			);
		}
		frame = window.requestAnimationFrame(drawPen);
	};
	const syncPlayback = () => {
		window.cancelAnimationFrame(frame ?? 0);
		const paused = document.hidden;
		for (const animation of animations)
			paused ? animation.pause() : animation.play();
		if (!paused) drawPen();
	};
	document.addEventListener("visibilitychange", syncPlayback);
	syncPlayback();
	return {
		restart() {
			for (const animation of animations) animation.currentTime = 0;
		},
		cancel() {
			cancelled = true;
			window.cancelAnimationFrame(frame ?? 0);
			document.removeEventListener("visibilitychange", syncPlayback);
			for (const animation of animations) animation.cancel();
		},
	};
}
