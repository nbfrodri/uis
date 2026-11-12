export type FrontMeta = {
	title: string;
	/** ISO date, YYYY-MM-DD */
	date: string;
	description: string;
	tags: string[];
};

export type Front = FrontMeta & {
	slug: string;
	/** Sequence number taken from the folder prefix ("003-foo" → 3). */
	number: number;
};

const FOLDER = /^\.\/((\d+)-[^/]+)\//;

export function parseFolder(
	path: string,
): { slug: string; number: number } | null {
	const match = FOLDER.exec(path);
	if (!match?.[1] || !match[2]) return null;
	return { slug: match[1], number: Number(match[2]) };
}

export function buildFronts(
	modules: Record<string, { default: FrontMeta }>,
): Front[] {
	return Object.entries(modules)
		.flatMap(([path, mod]) => {
			const folder = parseFolder(path);
			return folder ? [{ ...mod.default, ...folder }] : [];
		})
		.sort((a, b) => b.number - a.number);
}

export function filterByTag(fronts: Front[], tag: string | null): Front[] {
	if (!tag) return fronts;
	const wanted = tag.toLowerCase();
	return fronts.filter((front) =>
		front.tags.some((t) => t.toLowerCase() === wanted),
	);
}

export function collectTags(fronts: Front[]): string[] {
	const tags = new Set(
		fronts.flatMap((front) => front.tags.map((t) => t.toLowerCase())),
	);
	return [...tags].sort((a, b) => a.localeCompare(b));
}
