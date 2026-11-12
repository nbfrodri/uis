import { Link } from "react-router";
import type { Front } from "../lib/fronts";

const dateFormat = new Intl.DateTimeFormat("es-ES", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone: "UTC",
});

export function FrontRow({ front }: { front: Front }) {
	return (
		<li className="front-row">
			<span className="front-number" aria-hidden="true">
				{front.number}
			</span>
			<div className="front-body">
				<h2 className="front-title">
					<Link to={`/f/${front.slug}`} viewTransition>
						<span className="front-mark">{front.title}</span>
					</Link>
				</h2>
				<p className="front-description">{front.description}</p>
			</div>
			<div className="front-meta">
				<time dateTime={front.date}>
					{dateFormat.format(new Date(front.date))}
				</time>
				{front.tags.length > 0 && (
					<span className="front-tags">{front.tags.join(", ")}</span>
				)}
			</div>
		</li>
	);
}
