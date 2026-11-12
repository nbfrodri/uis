import {
	filterProvinces,
	matchProvince,
	parsePhoton,
	photonUrl,
	rankCities,
} from "./places";

describe("photonUrl", () => {
	it("searches Spanish streets or cities, near the chosen city when there is one", () => {
		const url = new URL(photonUrl("ave maría", "address"));
		expect(url.origin + url.pathname).toBe("https://photon.komoot.io/api/");
		expect(url.searchParams.get("q")).toBe("ave maría");
		expect(url.searchParams.getAll("layer")).toEqual(["street", "house"]);
		expect(url.searchParams.get("bbox")).toBeTruthy();
		expect(
			new URL(photonUrl("pez", "address", "Madrid")).searchParams.get("q"),
		).toBe("pez Madrid");
		expect(
			new URL(photonUrl("alcal", "city")).searchParams.getAll("layer"),
		).toEqual(["city"]);
	});
});

describe("parsePhoton", () => {
	it("keeps Spanish results with a readable label and the fields to autofill", () => {
		const json = {
			features: [
				{
					properties: {
						osm_id: 1,
						name: "Calle del Ave María",
						housenumber: "31",
						postcode: "28012",
						city: "Madrid",
						state: "Comunidad de Madrid",
						countrycode: "ES",
						type: "house",
						street: "Calle del Ave María",
					},
				},
				{
					properties: {
						osm_id: 2,
						name: "Ave Maria Street",
						city: "Lagos",
						countrycode: "PT",
						type: "street",
					},
				},
				{
					properties: {
						osm_id: 3,
						name: "León",
						county: "León",
						state: "Castilla y León",
						countrycode: "ES",
						type: "city",
					},
				},
			],
		};
		const results = parsePhoton(json);
		expect(results).toHaveLength(2);
		expect(results[0]).toMatchObject({
			label: "Calle del Ave María 31",
			detail: "28012 Madrid",
			street: "Calle del Ave María 31",
			postcode: "28012",
			city: "Madrid",
			province: "Madrid",
		});
		expect(results[1]).toMatchObject({
			label: "León",
			city: "León",
			province: "León",
		});
	});

	it("survives an unexpected response", () => {
		expect(parsePhoton(null)).toEqual([]);
		expect(parsePhoton({ features: "x" })).toEqual([]);
	});
});

describe("provinces", () => {
	it("matches a province from county or single-province regions", () => {
		expect(
			matchProvince({ county: "Toledo", state: "Castilla-La Mancha" }),
		).toBe("Toledo");
		expect(
			matchProvince({ county: undefined, state: "Comunidad de Madrid" }),
		).toBe("Madrid");
		expect(
			matchProvince({ county: "Tarazona y el Moncayo", state: "Aragón" }),
		).toBeUndefined();
	});

	it("filters the list as you type, ignoring accents", () => {
		expect(filterProvinces("avil")).toEqual(["Ávila"]);
		expect(filterProvinces("alicante")).toEqual(["Alacant"]);
		expect(filterProvinces("")).toHaveLength(52);
	});
});

describe("rankCities", () => {
	const cities = [
		{ name: "Alcalá de Henares", ineCode: "28005", province: "Madrid" },
		{ name: "Alcalá la Real", ineCode: "23003", province: "Jaén" },
		{ name: "Benalcázar", ineCode: "14002", province: "Córdoba" },
		{ name: "Madrid", ineCode: "28079", province: "Madrid" },
	];

	it("puts names that start with the text first and shows the province", () => {
		expect(rankCities(cities, "alca").map((c) => c.label)).toEqual([
			"Alcalá de Henares",
			"Alcalá la Real",
			"Benalcázar",
		]);
		expect(rankCities(cities, "madr")[0]).toMatchObject({
			id: "28079",
			label: "Madrid",
			detail: "Madrid",
			city: "Madrid",
			province: "Madrid",
		});
	});

	it("needs two letters and caps the list", () => {
		expect(rankCities(cities, "a")).toEqual([]);
		expect(rankCities(cities, "al", 2)).toHaveLength(2);
	});
});
