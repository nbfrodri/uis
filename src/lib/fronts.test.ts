import { buildFronts, parseFolder } from "./fronts";

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
