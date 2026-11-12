import {
	type ComponentType,
	createElement,
	lazy,
	type ReactElement,
} from "react";
import { buildFronts, type Front, type FrontMeta } from "../lib/fronts";

const metas = import.meta.glob<{ default: FrontMeta }>(
	["./*/meta.ts", "!./_*/meta.ts"],
	{
		eager: true,
	},
);
const components = import.meta.glob<{ default: ComponentType }>([
	"./*/index.tsx",
	"!./_*/index.tsx",
]);

export const fronts: Front[] = buildFronts(metas);

export function findFront(slug: string): Front | undefined {
	return fronts.find((front) => front.slug === slug);
}

// One lazy component per front, created once so React never sees a new component type.
const frontComponents = new Map(
	Object.entries(components).map(([path, loader]) => [path, lazy(loader)]),
);

/** The element for a front, or null if no front has that slug. */
export function frontElement(slug: string): ReactElement | null {
	const component = frontComponents.get(`./${slug}/index.tsx`);
	return component ? createElement(component) : null;
}
