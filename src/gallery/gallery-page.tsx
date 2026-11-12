import "@fontsource-variable/bricolage-grotesque/wdth.css";
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
					Ejercicios de UI, del más reciente al primero.{" "}
					{fronts.length === 1 ? "1 front" : `${fronts.length} fronts`}.
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
						Todavía no hay fronts. Crea el primero con{" "}
						<code>pnpm new-front nombre</code> y aparecerá aquí.
					</p>
				) : visible.length === 0 ? (
					<p className="gallery-empty">
						Ningún front lleva la etiqueta «{activeTag}».{" "}
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
