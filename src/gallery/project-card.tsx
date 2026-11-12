import { motion, useScroll, useTransform } from "motion/react";
import { type ComponentType, useRef } from "react";
import { Link } from "react-router";
import type { Front } from "../lib/fronts";
import { Tilt } from "./effects";
import { ArrowIcon } from "./studio-icons";

// Previews are lightweight compositions; the complete sites remain lazy-loaded.
const previews = import.meta.glob<{ default: ComponentType }>(
	"../fronts/*/preview.tsx",
	{ eager: true },
);

const pad = (n: number) => String(n).padStart(2, "0");

/** One row of the work index: title on the left, its preview beside it with parallax. */
export function ProjectCard({
	front,
	still,
}: {
	front: Front;
	still: boolean;
}) {
	const Preview = previews[`../fronts/${front.slug}/preview.tsx`]?.default;
	const row = useRef<HTMLLIElement>(null);
	const { scrollYProgress } = useScroll({
		target: row,
		offset: ["start end", "end start"],
	});
	// The picture moves inside its frame slower than the page: depth.
	const depth = useTransform(
		scrollYProgress,
		(v) => `translateY(${(v - 0.5) * 16}%)`,
	);

	return (
		<li ref={row} className="nbf-row">
			<Link
				to={`/f/${front.slug}`}
				viewTransition
				className="nbf-row-link"
				aria-label={`Explorar ${front.title}`}
			>
				<span className="nbf-row-index">{pad(front.number)}</span>
				<span className="nbf-row-text">
					<span className="nbf-row-name">{front.title}</span>
					<span className="nbf-row-meta">
						<span>{front.tags.join(" / ") || "Web de demostración"}</span>
						<time dateTime={front.date}>{front.date.slice(0, 4)}</time>
					</span>
				</span>
				{Preview && (
					<Tilt still={still} className="nbf-row-cover">
						<motion.span
							className="nbf-row-cover-inner"
							style={still ? undefined : { transform: depth }}
						>
							<Preview />
						</motion.span>
					</Tilt>
				)}
			</Link>
			<a
				className="nbf-row-docs"
				href={`https://github.com/nbfrodri/uis/blob/main/src/fronts/${encodeURIComponent(front.slug)}/README.md`}
			>
				Librerías y decisiones <ArrowIcon />
			</a>
		</li>
	);
}
