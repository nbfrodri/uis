import "@fontsource-variable/archivo/wdth.css";
import "./gallery.css";
import { Link } from "react-router";
import type { Front } from "../lib/fronts";
import { MarqueeBands } from "./marquee-bands";
import { usePrefersReducedMotion, useSmoothScroll } from "./motion-prefs";
import { NbfHero } from "./nbf-hero";
import { PracticeRail } from "./practice-rail";
import { ProjectCard } from "./project-card";
import { ArrowIcon } from "./studio-icons";

export function GalleryPage({ fronts }: { fronts: Front[] }) {
	const reduce = usePrefersReducedMotion();
	useSmoothScroll(!reduce);

	return (
		<div className="gallery nbf">
			<a href="#contenido" className="nbf-skip">
				Saltar al contenido
			</a>
			<header className="nbf-header">
				<Link to="/" className="nbf-wordmark" aria-label="NBF, inicio">
					NBF
				</Link>
				<nav aria-label="Principal" className="nbf-nav">
					<a href="#proyectos">Trabajo</a>
					<a href="#estudio">Lo que hago</a>
					<a href="https://github.com/nbfrodri/uis">
						GitHub <ArrowIcon />
					</a>
				</nav>
			</header>

			<main id="contenido">
				<NbfHero still={reduce} />

				<MarqueeBands still={reduce} />

				<section
					id="proyectos"
					className="nbf-work"
					aria-labelledby="nbf-work-title"
				>
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
					<p>
						NBF es mi espacio para probar ideas: negocios imaginarios,
						convertidos en webs que funcionan de verdad, del primer vistazo al
						último clic.
					</p>
				</section>
			</main>

			<footer className="nbf-footer">
				<span className="nbf-footer-mark" aria-hidden="true">
					NBF
				</span>
				<div className="nbf-footer-bottom">
					<span>NBF · Webs ficticias, diseño y desarrollo con IA.</span>
					<a href="https://github.com/nbfrodri/uis">
						Código en GitHub <ArrowIcon />
					</a>
				</div>
			</footer>
		</div>
	);
}
