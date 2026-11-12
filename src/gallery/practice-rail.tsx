import { motion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

const PRACTICE = [
	{
		title: "Interfaces",
		text: "Componentes claros, estados completos y una jerarquía que se entiende al primer vistazo.",
	},
	{
		title: "Interacción",
		text: "Formularios, carritos, búsquedas y mapas que funcionan de principio a fin.",
	},
	{
		title: "Movimiento",
		text: "Animación con propósito: guía la atención y nunca estorba.",
	},
	{
		title: "Accesibilidad",
		text: "Teclado, lectores de pantalla y movimiento reducido desde el primer día.",
	},
	{
		title: "Rendimiento",
		text: "Menos JavaScript, imágenes ligeras y transformaciones en la GPU.",
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
				<h2 id="nbf-rail-title" className="nbf-label">
					Lo que hago
				</h2>
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
