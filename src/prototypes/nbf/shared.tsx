import type { ComponentType } from "react";
import { Link } from "react-router";
import { fronts } from "../../fronts/registry";
import type { Front } from "../../lib/fronts";

const previews = import.meta.glob<{ default: ComponentType }>(
	"../../fronts/*/preview.tsx",
	{ eager: true },
);

export type Slot =
	| { kind: "front"; front: Front; Preview?: ComponentType }
	| { kind: "soon"; number: number };

/** The real projects plus «en preparación» slots, so the layout reads complete. */
export function useSlots(minimum = 3): Slot[] {
	const real: Slot[] = fronts.map((front) => ({
		kind: "front",
		front,
		Preview: previews[`../../fronts/${front.slug}/preview.tsx`]?.default,
	}));
	const soon: Slot[] = Array.from(
		{ length: Math.max(0, minimum - real.length) },
		(_, i) => ({ kind: "soon", number: real.length + i + 1 }),
	);
	return [...real, ...soon];
}

export const pad = (n: number) => String(n).padStart(2, "0");

export function NbfHeader() {
	return (
		<header className="nbf-header">
			<Link to="/" className="nbf-wordmark" aria-label="NBF, inicio">
				NBF
			</Link>
			<nav aria-label="Principal" className="nbf-nav">
				<a href="#trabajo">Trabajo</a>
				<a href="#sobre">Sobre</a>
				<a href="https://github.com/nbfrodri/uis">GitHub ↗</a>
			</nav>
		</header>
	);
}
