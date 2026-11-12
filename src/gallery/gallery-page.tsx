import "@fontsource-variable/funnel-display";
import "@fontsource-variable/funnel-sans";
import "./gallery.css";
import { Link, useSearchParams } from "react-router";
import { collectTags, type Front, filterByTag } from "../lib/fronts";
import { FrontRow } from "./front-row";

export function GalleryPage({ fronts }: { fronts: Front[] }) {
	const [params] = useSearchParams();
	const activeTag = params.get("tag");
	const tags = collectTags(fronts);
	const visible = filterByTag(fronts, activeTag);

	return (
		<div className="gallery">
			<header className="gallery-header">
				<h1 className="gallery-title">Libreta de interfaces</h1>
				<p className="gallery-lede">
					Webs de demostración diseñadas y construidas con IA, de la más
					reciente a la primera.{" "}
					{fronts.length === 1 ? "1\u00a0web" : `${fronts.length}\u00a0webs`}.
				</p>
				{tags.length > 0 && (
					<nav aria-label="Filtrar por etiqueta" className="gallery-tags">
						<Link
							to="/"
							className="gallery-tag"
							aria-current={activeTag ? undefined : "true"}
						>
							todos
						</Link>
						{tags.map((tag) => (
							<Link
								key={tag}
								to={`/?tag=${encodeURIComponent(tag)}`}
								className="gallery-tag"
								aria-current={
									activeTag?.toLowerCase() === tag ? "true" : undefined
								}
							>
								{tag}
							</Link>
						))}
					</nav>
				)}
			</header>

			<main>
				{fronts.length === 0 ? (
					<p className="gallery-empty">
						Todavía no hay webs. Crea la primera con{" "}
						<code>pnpm new-front nombre</code> y aparecerá aquí.
					</p>
				) : visible.length === 0 ? (
					<p className="gallery-empty">
						Ninguna web lleva la etiqueta «{activeTag}».{" "}
						<Link to="/">Ver todos</Link>
					</p>
				) : (
					<ol className="gallery-list">
						{visible.map((front) => (
							<FrontRow key={front.slug} front={front} />
						))}
					</ol>
				)}
			</main>
		</div>
	);
}
