import type { ComponentType } from "react";
import { Link } from "react-router";
import type { Front } from "../lib/fronts";
import { ArrowIcon } from "./studio-icons";

// Previews are lightweight compositions; the complete sites remain lazy-loaded.
const previews = import.meta.glob<{ default: ComponentType }>(
	"../fronts/*/preview.tsx",
	{ eager: true },
);

const yearFormat = new Intl.DateTimeFormat("es-ES", {
	year: "numeric",
	timeZone: "UTC",
});

export function ProjectCard({ front }: { front: Front }) {
	const Preview = previews[`../fronts/${front.slug}/preview.tsx`]?.default;
	return (
		<li className="studio-project">
			<article>
				<Link
					to={`/f/${front.slug}`}
					viewTransition
					className="studio-project-link"
					aria-label={`Explorar ${front.title}`}
				>
					<div className="studio-project-cover" aria-hidden="true">
						{Preview ? (
							<Preview />
						) : (
							<div className="studio-project-fallback">
								<span>{String(front.number).padStart(2, "0")}</span>
								<strong>{front.title}</strong>
							</div>
						)}
						<span className="studio-project-enter">
							Entrar en la web <ArrowIcon />
						</span>
					</div>
					<div className="studio-project-info">
						<div>
							<h3>{front.title}</h3>
							<p>{front.description}</p>
						</div>
						<div className="studio-project-meta">
							<span>{front.tags.join(" / ") || "Web de demostración"}</span>
							<time dateTime={front.date}>
								{yearFormat.format(new Date(front.date))}
							</time>
						</div>
					</div>
				</Link>
				<a
					className="studio-project-docs"
					href={`https://github.com/nbfrodri/uis/blob/main/src/fronts/${encodeURIComponent(front.slug)}/README.md`}
				>
					Librerías y decisiones <ArrowIcon />
				</a>
			</article>
		</li>
	);
}
