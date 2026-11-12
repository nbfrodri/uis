import type { ComponentType } from "react";
import { buildFronts, type Front, type FrontMeta } from "../lib/fronts";

const metas = import.meta.glob<{ default: FrontMeta }>(
	["./*/meta.ts", "!./_*/meta.ts"],
	{
		eager: true,
	},
);
const components = import.meta.glob<{ default: ComponentType }>(
	"./*/index.tsx",
);

export const fronts: Front[] = buildFronts(metas);

export function findFront(slug: string): Front | undefined {
	return fronts.find((front) => front.slug === slug);
}

export function loadFront(
	slug: string,
): (() => Promise<{ default: ComponentType }>) | undefined {
	return components[`./${slug}/index.tsx`];
}
