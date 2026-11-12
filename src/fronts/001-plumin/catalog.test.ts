import { queryInks, sortOptions } from "./catalog";
import { inks } from "./data";

describe("queryInks", () => {
	it("returns every ink in shop order without filters", () => {
		expect(queryInks(inks, {}).map((ink) => ink.id)).toEqual(
			inks.map((ink) => ink.id),
		);
	});

	it("searches name, maker and note ignoring accents and case", () => {
		expect(queryInks(inks, { q: "PIMENTON" }).map((ink) => ink.id)).toEqual([
			"pimenton",
		]);
		expect(
			queryInks(inks, { q: "ordóñez" }).every(
				(ink) => ink.maker === "Casa Ordóñez",
			),
		).toBe(true);
	});

	it("lists name matches before matches in the description", () => {
		const ids = queryInks(inks, { q: "gra" }).map((ink) => ink.id);
		expect(ids[0]).toBe("granada");
		expect(ids).toContain("azul-real"); // «caligrafía» in its note
	});

	it("finds inks by colour family name", () => {
		expect(queryInks(inks, { q: "verde" }).map((ink) => ink.id)).toEqual(
			expect.arrayContaining(["musgo-de-ordesa", "aceituna"]),
		);
		expect(queryInks(inks, { q: "gris" }).map((ink) => ink.id)).toContain(
			"tormenta",
		);
	});

	it("combines family and search", () => {
		expect(queryInks(inks, { family: "azules", q: "brillo" })).toEqual([]);
		expect(
			queryInks(inks, { family: "rojos", q: "brillo" }).map((ink) => ink.id),
		).toEqual(["granada"]);
	});

	it("sorts by price and name", () => {
		const cheap = queryInks(inks, { sort: "precio-asc" });
		expect(cheap[0]?.price).toBeLessThanOrEqual(cheap.at(-1)?.price ?? 0);
		expect(queryInks(inks, { sort: "precio-desc" })[0]?.price).toBe(19);
		expect(queryInks(inks, { sort: "nombre" })[0]?.id).toBe("aceituna");
	});

	it("ignores an unknown sort", () => {
		expect(queryInks(inks, { sort: "raro" })).toHaveLength(inks.length);
		expect(sortOptions.map((o) => o.id)).toContain("destacadas");
	});
});
