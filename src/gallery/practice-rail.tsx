import {
	motion,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

const PRACTICE = [
	{
		title: "Interfaces",
		text: "Componentes claros, estados completos y una jerarquía que se entiende al primer vistazo.",
		tags: ["React", "TypeScript", "Tailwind", "HeroUI"],
	},
	{
		title: "Interacción",
		text: "Formularios, carritos, búsquedas y mapas que funcionan de principio a fin.",
		tags: ["React Aria", "Formularios", "MapLibre"],
	},
	{
		title: "Movimiento",
		text: "Animación con propósito: guía la atención y nunca estorba.",
		tags: ["Motion", "Lenis", "Scroll", "Parallax"],
	},
	{
		title: "Accesibilidad",
		text: "Teclado, lectores de pantalla y movimiento reducido desde el primer día.",
		tags: ["WCAG", "Teclado", "Movimiento reducido"],
	},
	{
		title: "Rendimiento",
		text: "Menos JavaScript, imágenes ligeras y transformaciones en la GPU.",
		tags: ["Vite", "Carga diferida", "GPU"],
	},
];

/**
 * Vertical scroll walks a pinned row of panels sideways. The panels hold no
 * links, so keyboard focus never lands on something that is off screen.
 */
export function PracticeRail({ still }: { still: boolean }) {
	const section = useRef<HTMLElement>(null);
	const track = useRef<HTMLOListElement>(null);
	const [distance, setDistance] = useState(0);

	useLayoutEffect(() => {
		const element = track.current;
		if (!element || typeof ResizeObserver === "undefined") return;
		const measure = () =>
			setDistance(Math.max(0, element.scrollWidth - window.innerWidth));
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		window.addEventListener("resize", measure);
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, []);

	const { scrollYProgress } = useScroll({
		target: section,
		offset: ["start start", "end end"],
	});
	const transform = useTransform(
		scrollYProgress,
		(v) => `translateX(${-v * distance}px)`,
	);
	const progress = useTransform(scrollYProgress, (v) => `scaleX(${v})`);
	// The backdrop reads left to right and drifts the same way as the panels,
	// but slower: parallax depth.
	const backdrop = useTransform(
		scrollYProgress,
		(v) => `translate(${5 - v * 35}%, -50%)`,
	);
	const [current, setCurrent] = useState(1);
	useMotionValueEvent(scrollYProgress, "change", (v) =>
		setCurrent(Math.min(PRACTICE.length, Math.floor(v * PRACTICE.length) + 1)),
	);

	return (
		<section
			ref={section}
			id="estudio"
			className="nbf-rail"
			data-still={still}
			aria-labelledby="nbf-rail-title"
			// The section is as tall as the sideways distance, plus one screen.
			style={still ? undefined : { height: `calc(${distance}px + 100dvh)` }}
		>
			<div className="nbf-rail-sticky">
				{!still && (
					<motion.span
						className="nbf-rail-backdrop"
						aria-hidden="true"
						style={{ transform: backdrop }}
					>
						Lo que hago — Lo que hago
					</motion.span>
				)}
				<div className="nbf-rail-head">
					<h2 id="nbf-rail-title" className="nbf-label">
						Lo que hago
					</h2>
					{!still && (
						<span className="nbf-rail-counter" aria-hidden="true">
							<b>{String(current).padStart(2, "0")}</b> /{" "}
							{String(PRACTICE.length).padStart(2, "0")}
						</span>
					)}
				</div>
				<motion.ol
					ref={track}
					className="nbf-rail-track"
					style={still ? undefined : { transform }}
				>
					{PRACTICE.map((item, index) => (
						<li key={item.title} className="nbf-rail-panel">
							<span className="nbf-rail-number" aria-hidden="true">
								{String(index + 1).padStart(2, "0")}
							</span>
							<h3>{item.title}</h3>
							<p>{item.text}</p>
							<ul
								className="nbf-rail-tags"
								aria-label={`Herramientas de ${item.title}`}
							>
								{item.tags.map((tag) => (
									<li key={tag}>{tag}</li>
								))}
							</ul>
						</li>
					))}
				</motion.ol>
				<div className="nbf-rail-progress" aria-hidden="true">
					<motion.span style={still ? undefined : { transform: progress }} />
				</div>
			</div>
		</section>
	);
}
