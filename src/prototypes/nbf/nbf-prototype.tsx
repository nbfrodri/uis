import "@fontsource-variable/archivo/wdth.css";
import "./nbf.css";
import { Link, useSearchParams } from "react-router";
import { HorizontalVariant } from "./horizontal-variant";
import { MonogramVariant } from "./monogram-variant";

/*
 * Temporary route to compare two directions for the NBF home page.
 * Production (src/gallery) is untouched; delete this folder once one is chosen.
 */

const VARIANTS = {
	a: { label: "A · Monograma", Component: MonogramVariant },
	b: { label: "B · Horizontal", Component: HorizontalVariant },
} as const;

export function NbfPrototype() {
	const [params] = useSearchParams();
	const key = params.get("v") === "b" ? "b" : "a";
	const { Component } = VARIANTS[key];
	return (
		<div className="nbf" data-variant={key}>
			<nav className="nbf-switch" aria-label="Variantes del prototipo">
				{(Object.keys(VARIANTS) as (keyof typeof VARIANTS)[]).map((k) => (
					<Link
						key={k}
						to={`?v=${k}`}
						replace
						aria-current={k === key ? "page" : undefined}
					>
						{VARIANTS[k].label}
					</Link>
				))}
			</nav>
			<Component />
		</div>
	);
}
