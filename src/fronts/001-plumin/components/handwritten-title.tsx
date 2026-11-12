import {
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useSyncExternalStore,
} from "react";
import fontUrl from "vara/fonts/Satisfy/SatisfySL.json?url";
import {
	createHandwritingPlayback,
	type HandwritingPlayback,
} from "./handwriting-playback";

const HEADLINE = "Tinta para escribir a mano.";
const WIDE_LINES = ["Tinta para escribir", "a mano."];
// Three shorter lines let a phone draw the words larger, each on its own rule.
const NARROW_LINES = ["Tinta para", "escribir", "a mano."];
const NARROW = "(max-width: 40rem)";

function useNarrow() {
	return useSyncExternalStore(
		(onChange) => {
			const query = window.matchMedia(NARROW);
			query.addEventListener("change", onChange);
			return () => query.removeEventListener("change", onChange);
		},
		() => window.matchMedia(NARROW).matches,
		() => false,
	);
}

/** Vara builds the stroke font; native animations own its cancellable playback. */
export function HandwrittenTitle({ color }: { color: string }) {
	const mount = useRef<HTMLSpanElement>(null);
	const playback = useRef<HandwritingPlayback | null>(null);
	const id = `handwriting-${useId().replaceAll(":", "")}`;
	const lines = useNarrow() ? NARROW_LINES : WIDE_LINES;

	// The strokes use currentColor, so a new ink only needs the text rewritten.
	// Layout effect: restart before paint so the recoloured text never flashes.
	useLayoutEffect(() => {
		void color;
		playback.current?.restart();
	}, [color]);

	useEffect(() => {
		const host = mount.current;
		if (!host) return;
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		let generation = 0;
		let timeout: number | undefined;
		const reset = () => {
			generation += 1;
			window.clearTimeout(timeout);
			playback.current?.cancel();
			playback.current = null;
			host.replaceChildren();
			host.dataset.state = "loading";
		};
		const showStatic = () => {
			reset();
			host.dataset.state = "static";
		};
		const start = async () => {
			reset();
			if (query.matches) {
				showStatic();
				return;
			}
			const current = generation;
			// Restore the readable title if loading fails instead of leaving a blank sheet.
			timeout = window.setTimeout(showStatic, 5000);
			try {
				const { default: Vara } = await import("vara");
				await document.fonts?.ready;
				if (current !== generation) return;
				const writer = new Vara(
					`[id="${id}"]`,
					fontUrl,
					[{ text: lines, width: 2000 }],
					{
						fontSize: 100,
						strokeWidth: 2,
						color: "currentColor",
						autoAnimation: false,
					},
				);
				// Vara has no destroy API: stop late font callbacks before they touch removed DOM.
				for (const method of ["preCreate", "createText"] as const) {
					const original = writer[method].bind(writer);
					writer[method] = () => {
						if (current !== generation) return;
						try {
							original();
						} catch {
							showStatic();
						}
					};
				}
				writer.ready(() => {
					if (current !== generation) return;
					try {
						window.clearTimeout(timeout);
						const box = writer.svg.getBBox();
						playback.current = createHandwritingPlayback(writer.svg);
						writer.svg.setAttribute(
							"viewBox",
							`${box.x - 8} ${box.y - 8} ${box.width + 16} ${box.height + 16}`,
						);
						writer.svg.setAttribute("width", "100%");
						writer.svg.setAttribute("height", "100%");
						writer.svg.setAttribute("preserveAspectRatio", "xMinYMid meet");
						host.dataset.state = "ready";
					} catch {
						showStatic();
					}
				});
			} catch {
				if (current === generation) showStatic();
			}
		};
		void start();
		query.addEventListener("change", start);
		return () => {
			reset();
			query.removeEventListener("change", start);
		};
	}, [id, lines]);

	return (
		<div className="hero-handwriting-wrap">
			<h1 className="hero-handwriting font-hand" style={{ color }}>
				<span
					id={id}
					ref={mount}
					className="hero-handwriting-strokes"
					data-state="loading"
					aria-hidden="true"
				/>
				<span className="hero-handwriting-fallback" aria-hidden="true">
					{lines.map((line) => (
						<span key={line}>{line}</span>
					))}
				</span>
				<span className="sr-only">{HEADLINE}</span>
			</h1>
		</div>
	);
}
