import "@fontsource-variable/archivo";
import "./gallery.css";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { collectTags, type Front, filterByTag } from "../lib/fronts";
import { GalleryHero } from "./gallery-hero";
import { ProjectCard } from "./project-card";
import { ArrowIcon, StudioMark } from "./studio-icons";

export function GalleryPage({ fronts }: { fronts: Front[] }) {
	const [params] = useSearchParams();
	const [paused, setPaused] = useState(false);
	const activeTag = params.get("tag");
	const tags = collectTags(fronts);
	const visible = filterByTag(fronts, activeTag);

	return (
		<div className="gallery" data-motion-paused={paused}>
			<a href="#contenido" className="studio-skip">
				Saltar al contenido
			</a>
			<header className="studio-header">
				<Link
					to="/"
					className="studio-wordmark"
					aria-label="Estudio digital, inicio"
				>
					<StudioMark />
					<span>
						Estudio
						<br />
						digital
					</span>
				</Link>
				<nav aria-label="Principal" className="studio-nav">
					<a href="#proyectos">Proyectos</a>
					<a href="#estudio">El estudio</a>
				</nav>
				<a href="https://github.com/nbfrodri/uis" className="studio-code-link">
					Ver código <ArrowIcon />
				</a>
			</header>

			<main id="contenido">
				<GalleryHero
					paused={paused}
					onToggle={() => setPaused((value) => !value)}
				/>

				<section
					id="estudio"
					className="studio-intro"
					aria-labelledby="studio-intro-title"
				>
					<p className="studio-section-note">
						Un espacio para
						<br />
						probar otras ideas.
					</p>
					<div>
						<h2 id="studio-intro-title">
							Cada web,
							<br />
							un mundo propio.
						</h2>
						<p>
							Negocios imaginarios, experiencias que funcionan. Del primer
							vistazo al último clic, cada proyecto explora una forma distinta
							de diseñar la web.
						</p>
					</div>
					<span className="studio-intro-symbol" aria-hidden="true">
						<StudioMark />
					</span>
				</section>

				<section
					id="proyectos"
					className="studio-work"
					aria-labelledby="studio-projects-title"
				>
					<div className="studio-work-heading">
						<h2 id="studio-projects-title">
							Proyectos para entrar<span aria-hidden="true">.</span>
						</h2>
						<span className="studio-project-count">
							({String(fronts.length).padStart(2, "0")})
						</span>
					</div>
					{tags.length > 0 && (
						<nav aria-label="Filtrar por etiqueta" className="studio-filters">
							<Link
								to="/"
								className="studio-filter"
								aria-current={activeTag ? undefined : "true"}
							>
								todos
							</Link>
							{tags.map((tag) => (
								<Link
									key={tag}
									to={`/?tag=${encodeURIComponent(tag)}`}
									className="studio-filter"
									aria-current={
										activeTag?.toLowerCase() === tag ? "true" : undefined
									}
								>
									{tag}
								</Link>
							))}
						</nav>
					)}
					{fronts.length === 0 ? (
						<p className="studio-empty">
							Todavía no hay webs. Crea la primera con{" "}
							<code>pnpm new-front nombre</code> y aparecerá aquí.
						</p>
					) : visible.length === 0 ? (
						<p className="studio-empty">
							Ninguna web lleva la etiqueta «{activeTag}».{" "}
							<Link to="/">Ver todos</Link>
						</p>
					) : (
						<ol className="studio-projects">
							{visible.map((front) => (
								<ProjectCard key={front.slug} front={front} />
							))}
						</ol>
					)}
				</section>
			</main>

			<footer className="studio-footer">
				<div className="studio-footer-top">
					<p>
						Hecho para explorar.
						<br />
						Pensado hasta el último clic.
					</p>
					<a
						href="#proyectos"
						className="studio-back-top"
						aria-label="Volver a los proyectos"
					>
						<ArrowIcon />
					</a>
				</div>
				<div className="studio-footer-bottom">
					<span>Estudio digital</span>
					<p>Webs ficticias. Diseño y desarrollo con IA.</p>
					<a href="https://github.com/nbfrodri/uis">
						GitHub <ArrowIcon />
					</a>
				</div>
			</footer>
		</div>
	);
}
