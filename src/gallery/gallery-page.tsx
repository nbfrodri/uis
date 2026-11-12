import "@fontsource-variable/archivo/wdth.css";
import "./gallery.css";
import { useState } from "react";
import { Link } from "react-router";
import type { Front } from "../lib/fronts";
import {
	Cursor,
	FooterMark,
	Magnetic,
	ParallaxShapes,
	Preloader,
	RevealLines,
	Scramble,
	ScrollDrawnLine,
	ScrollHighlight,
} from "./effects";
import { MarqueeBands } from "./marquee-bands";
import { usePrefersReducedMotion, useSmoothScroll } from "./motion-prefs";
import { NbfHero } from "./nbf-hero";
import { PracticeRail } from "./practice-rail";
import { ProjectCard } from "./project-card";
import { ArrowIcon } from "./studio-icons";

type ShapeList = Parameters<typeof ParallaxShapes>[0]["shapes"];

// Decorative layers: depth comes from speed (px travelled across the pass).
const WORK_SHAPES: ShapeList = [
	{
		kind: "ring",
		left: "62%",
		top: "-4rem",
		size: 220,
		speed: 260,
		spin: 40,
	},
	{
		kind: "plus",
		left: "8%",
		top: "70%",
		size: 44,
		speed: 420,
		spin: 180,
	},
	{
		kind: "star",
		left: "88%",
		top: "78%",
		size: 56,
		speed: 520,
		spin: 120,
		accent: true,
	},
	{
		kind: "dots",
		left: "44%",
		top: "88%",
		size: 70,
		speed: 180,
		spin: 0,
	},
];

const CTA_SHAPES: ShapeList = [
	{
		kind: "square",
		left: "70%",
		top: "10%",
		size: 140,
		speed: 300,
		spin: -60,
	},
	{
		kind: "star",
		left: "56%",
		top: "62%",
		size: 40,
		speed: 460,
		spin: 200,
		accent: true,
	},
	{
		kind: "ring",
		left: "86%",
		top: "48%",
		size: 90,
		speed: 520,
		spin: 0,
	},
];

export function GalleryPage({ fronts }: { fronts: Front[] }) {
	const reduce = usePrefersReducedMotion();
	const [introDone, setIntroDone] = useState(false);
	useSmoothScroll(!reduce);

	return (
		<div className="gallery nbf">
			<Preloader still={reduce} onDone={() => setIntroDone(true)} />
			<Cursor still={reduce} />
			<div className="nbf-grain" aria-hidden="true" />
			<a href="#contenido" className="nbf-skip">
				Saltar al contenido
			</a>
			<header className="nbf-header">
				<Link to="/" className="nbf-wordmark" aria-label="NBF, inicio">
					NBF
				</Link>
				<nav aria-label="Principal" className="nbf-nav">
					<Magnetic still={reduce}>
						<a href="#proyectos">
							<Scramble text="Trabajo" still={reduce} />
						</a>
					</Magnetic>
					<Magnetic still={reduce}>
						<a href="#estudio" className="nbf-nav-practice">
							<Scramble text="Lo que hago" still={reduce} />
						</a>
					</Magnetic>
					<Magnetic still={reduce}>
						<a href="https://github.com/nbfrodri/uis">
							<Scramble text="GitHub" still={reduce} /> <ArrowIcon />
						</a>
					</Magnetic>
				</nav>
			</header>

			<main id="contenido">
				<NbfHero still={reduce} ready={introDone} />

				<MarqueeBands still={reduce} />

				<section
					id="proyectos"
					className="nbf-work"
					aria-labelledby="nbf-work-title"
				>
					<ParallaxShapes still={reduce} shapes={WORK_SHAPES} />
					<div className="nbf-work-head">
						<h2 id="nbf-work-title" className="nbf-label">
							Trabajo
						</h2>
						<span className="nbf-count">
							({String(fronts.length).padStart(2, "0")})
						</span>
					</div>
					{fronts.length === 0 ? (
						<p className="gallery-empty">
							Todavía no hay webs. Crea la primera con{" "}
							<code>pnpm new-front nombre</code> y aparecerá aquí.
						</p>
					) : (
						<ol className="nbf-list">
							{fronts.map((front) => (
								<ProjectCard key={front.slug} front={front} still={reduce} />
							))}
						</ol>
					)}
				</section>

				<PracticeRail still={reduce} />

				<section className="nbf-about" aria-label="Sobre NBF">
					<ScrollDrawnLine still={reduce} />
					<ScrollHighlight
						still={reduce}
						text="NBF es mi espacio para probar ideas: negocios imaginarios, convertidos en webs que funcionan de verdad, del primer vistazo al último clic."
					/>
				</section>
				<section className="nbf-cta" aria-labelledby="nbf-cta-title">
					<ParallaxShapes still={reduce} shapes={CTA_SHAPES} />
					<p className="nbf-label">Siguiente paso</p>
					<RevealLines
						id="nbf-cta-title"
						lines={["¿Quieres ver", "cómo está hecho?"]}
						still={reduce}
					/>
					<Magnetic still={reduce} strength={0.25}>
						<a href="https://github.com/nbfrodri/uis" className="nbf-cta-link">
							Código en GitHub <ArrowIcon />
						</a>
					</Magnetic>
				</section>
			</main>

			<footer className="nbf-footer">
				<FooterMark still={reduce} />
				<div className="nbf-footer-bottom">
					<span>NBF · Webs ficticias, diseño y desarrollo con IA.</span>
				</div>
			</footer>
		</div>
	);
}
