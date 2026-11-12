import "@fontsource-variable/archivo/wdth.css";
import "./gallery.css";
import { motion } from "motion/react";
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
import { ABOUT_SHAPES, BANDS_SHAPES, CTA_SHAPES, WORK_SHAPES } from "./shapes";
import { ArrowIcon } from "./studio-icons";

/** Fades and rises in each time it enters view, and resets when it leaves. */
const replay = (still: boolean, delay: number) =>
	still
		? {}
		: {
				initial: { opacity: 0, transform: "translateY(1rem)" },
				whileInView: { opacity: 1, transform: "translateY(0rem)" },
				viewport: { amount: 0.6 },
				transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] as const },
			};

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

				<div className="nbf-bands-wrap">
					<ParallaxShapes still={reduce} shapes={BANDS_SHAPES} />
					<MarqueeBands still={reduce} />
				</div>

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
					<ParallaxShapes still={reduce} shapes={ABOUT_SHAPES} />
					<ScrollDrawnLine still={reduce} />
					<ScrollHighlight
						still={reduce}
						text="NBF es mi espacio para probar ideas: negocios imaginarios, convertidos en webs que funcionan de verdad, del primer vistazo al último clic."
					/>
				</section>
				<section className="nbf-cta" aria-labelledby="nbf-cta-title">
					<ParallaxShapes still={reduce} shapes={CTA_SHAPES} />
					<motion.p className="nbf-label" {...replay(reduce, 0)}>
						Siguiente paso
					</motion.p>
					<RevealLines
						id="nbf-cta-title"
						lines={["¿Quieres ver", "cómo está hecho?"]}
						still={reduce}
					/>
					<motion.div {...replay(reduce, 0.25)}>
						<Magnetic still={reduce} strength={0.25}>
							<a
								href="https://github.com/nbfrodri/uis"
								className="nbf-cta-link"
							>
								Código en GitHub <ArrowIcon />
							</a>
						</Magnetic>
					</motion.div>
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
