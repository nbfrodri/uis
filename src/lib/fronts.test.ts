import { buildFronts, collectTags, filterByTag, parseFolder } from "./fronts";

const meta = (title: string, tags: string[] = [], date = "2026-11-12") => ({
	default: { title, date, description: `${title} desc`, tags },
});

describe("parseFolder", () => {
	it("takes slug and number from a numbered folder", () => {
		expect(parseFolder("./007-glass-player/meta.ts")).toEqual({
			slug: "007-glass-player",
			number: 7,
		});
	});

	it("ignores folders starting with an underscore", () => {
		expect(parseFolder("./_template/meta.ts")).toBeNull();
	});

	it("ignores folders without a numeric prefix", () => {
		expect(parseFolder("./scratch/meta.ts")).toBeNull();
	});
});

describe("buildFronts", () => {
	it("lists the newest front first and skips ignored folders", () => {
		const fronts = buildFronts({
			"./001-first/meta.ts": meta("First"),
			"./_template/meta.ts": meta("Template"),
			"./010-tenth/meta.ts": meta("Tenth"),
			"./002-second/meta.ts": meta("Second"),
		});
		expect(fronts.map((f) => f.slug)).toEqual([
			"010-tenth",
			"002-second",
			"001-first",
		]);
		expect(fronts[0]).toMatchObject({ number: 10, title: "Tenth" });
	});
});

describe("tags", () => {
	const fronts = buildFronts({
		"./001-a/meta.ts": meta("A", ["motion", "dark"]),
		"./002-b/meta.ts": meta("B", ["Dark"]),
		"./003-c/meta.ts": meta("C"),
	});

	it("filters case-insensitively and returns all fronts without a tag", () => {
		expect(filterByTag(fronts, "dark").map((f) => f.title)).toEqual(["B", "A"]);
		expect(filterByTag(fronts, null)).toHaveLength(3);
	});

	it("collects unique lowercase tags sorted by name", () => {
		expect(collectTags(fronts)).toEqual(["dark", "motion"]);
	});
});
