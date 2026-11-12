import { families, type Ink } from "./data";

const familyLabel = Object.fromEntries(families.map((f) => [f.id, f.label]));

export const sortOptions = [
	{ id: "destacadas", label: "Destacadas" },
	{ id: "precio-asc", label: "Precio: de menor a mayor" },
	{ id: "precio-desc", label: "Precio: de mayor a menor" },
	{ id: "nombre", label: "Nombre" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];

const normalize = (text: string) =>
	text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const comparators: Partial<Record<SortId, (a: Ink, b: Ink) => number>> = {
	"precio-asc": (a, b) => a.price - b.price,
	"precio-desc": (a, b) => b.price - a.price,
	nombre: (a, b) => a.name.localeCompare(b.name, "es"),
};

/** Lower is a better match: name first, then maker or colour, then the description. */
function relevance(ink: Ink, needle: string): number | null {
	const name = normalize(ink.name);
	if (name.startsWith(needle)) return 0;
	if (name.includes(needle)) return 1;
	if (normalize(`${ink.maker} ${familyLabel[ink.family]}`).includes(needle))
		return 2;
	if (normalize(ink.note).includes(needle)) return 3;
	return null;
}

export function queryInks(
	inks: Ink[],
	{
		family,
		q,
		sort,
	}: { family?: string | null; q?: string | null; sort?: string | null },
): Ink[] {
	const needle = q ? normalize(q.trim()) : "";
	const inFamily = family ? inks.filter((ink) => ink.family === family) : inks;
	const matches = needle
		? inFamily
				.map((ink) => ({ ink, score: relevance(ink, needle) }))
				.filter(
					(match): match is { ink: Ink; score: number } => match.score !== null,
				)
				.sort((a, b) => a.score - b.score)
				.map((match) => match.ink)
		: inFamily;
	const compare = comparators[sort as SortId];
	return compare ? [...matches].sort(compare) : matches;
}
