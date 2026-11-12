import { useEffect, useId, useRef } from "react";
import fontUrl from "vara/fonts/Satisfy/SatisfySL.json?url";

const HEADLINE = "Tinta para escribir a mano.";
const WRITING_DURATION = 2600;

/** Vara lays out a stroke font; WAAPI owns playback so React can cancel it. */
export function HandwrittenTitle({ color }: { color: string }) {
	const mount = useRef<HTMLSpanElement>(null);
	const id = `handwriting-${useId().replaceAll(":", "")}`;

	useEffect(() => {
		const host = mount.current;
		if (!host) return;
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		let generation = 0;
		const animations: Animation[] = [];
		const reset = () => {
			generation += 1;
			for (const animation of animations) animation.cancel();
			animations.length = 0;
			host.replaceChildren();
			delete host.dataset.ready;
		};
		const start = async () => {
			reset();
			if (query.matches) return;
			const current = generation;
			try {
				const { default: Vara } = await import("vara");
				await document.fonts?.ready;
				if (current !== generation) return;
				const writer = new Vara(
					`[id="${id}"]`,
					fontUrl,
					[{ text: ["Tinta para escribir", "a mano."], width: 2000 }],
					{
						fontSize: 100,
						strokeWidth: 2,
						color: "currentColor",
						autoAnimation: false,
					},
				);
				// Vara has no destroy API. Guard its asynchronous font callbacks before
				// they measure or mutate DOM that React has already removed.
				const prepare = writer.preCreate.bind(writer);
				const create = writer.createText.bind(writer);
				writer.preCreate = () => {
					if (current !== generation) return;
					try {
						prepare();
					} catch {
						reset();
					}
				};
				writer.createText = () => {
					if (current !== generation) return;
					try {
						create();
					} catch {
						reset();
					}
				};
				writer.ready(() => {
					if (current !== generation) return;
					const box = writer.svg.getBBox();
					writer.svg.setAttribute(
						"viewBox",
						`${box.x - 8} ${box.y - 8} ${box.width + 16} ${box.height + 16}`,
					);
					writer.svg.setAttribute("width", "100%");
					writer.svg.setAttribute("height", "100%");
					writer.svg.setAttribute("preserveAspectRatio", "xMinYMid meet");
					const paths = Array.from(writer.svg.querySelectorAll("path")).filter(
						(path) => path.getAttribute("stroke") !== "transparent",
					);
					const total = paths.reduce(
						(sum, path) => sum + Number.parseFloat(path.style.strokeDashoffset),
						0,
					);
					let delay = 0;
					for (const path of paths) {
						const length = Number.parseFloat(path.style.strokeDashoffset);
						const duration = (WRITING_DURATION * length) / total;
						animations.push(
							path.animate(
								[
									{ strokeDashoffset: String(length), opacity: 1 },
									{ strokeDashoffset: "0", opacity: 1 },
								],
								{ duration, delay, easing: "linear", fill: "both" },
							),
						);
						delay += duration;
					}
					host.dataset.ready = "true";
				});
			} catch {
				if (current === generation) reset();
			}
		};
		void start();
		query.addEventListener("change", start);
		return () => {
			reset();
			query.removeEventListener("change", start);
		};
	}, [id]);

	return (
		<h1 className="hero-handwriting ruled font-hand" style={{ color }}>
			<span
				id={id}
				ref={mount}
				className="hero-handwriting-strokes"
				aria-hidden="true"
			/>
			<span className="hero-handwriting-fallback" aria-hidden="true">
				<span>Tinta para escribir</span>
				<span>a mano.</span>
			</span>
			<span className="sr-only">{HEADLINE}</span>
		</h1>
	);
}
