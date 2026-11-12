// Address and city suggestions from Photon, a free OpenStreetMap geocoder (photon.komoot.io).
// Fair use: callers debounce, need 3+ characters and cancel stale requests.
import { provinces } from "./checkout";

export type PlaceKind = "address" | "city";

export type Place = {
	id: string;
	label: string;
	detail: string;
	street?: string;
	postcode?: string;
	city?: string;
	province?: string;
};

/** Mainland Spain plus the Balearic and Canary Islands. */
const SPAIN_BBOX = "-18.2,27.6,4.4,43.9";

export function photonUrl(
	query: string,
	kind: PlaceKind,
	nearCity?: string,
): string {
	const url = new URL("https://photon.komoot.io/api/");
	url.searchParams.set("q", nearCity ? `${query} ${nearCity}` : query);
	url.searchParams.set("limit", "6");
	url.searchParams.set("bbox", SPAIN_BBOX);
	for (const layer of kind === "address" ? ["street", "house"] : ["city"])
		url.searchParams.append("layer", layer);
	return url.toString();
}

const normalize = (text: string) =>
	text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Regions with a single province, as Photon names them. */
const singleProvinceRegions: Record<string, string> = {
	"comunidad de madrid": "Madrid",
	"region de murcia": "Murcia",
	"comunidad foral de navarra": "Navarra",
	navarra: "Navarra",
	"la rioja": "La Rioja",
	asturias: "Asturias",
	"principado de asturias": "Asturias",
	cantabria: "Cantabria",
	"illes balears": "Illes Balears",
	ceuta: "Ceuta",
	melilla: "Melilla",
};

/** Spanish or older names people (and Photon) use for provinces with an official co-official name. */
const provinceAliases: Record<string, string> = {
	alicante: "Alacant",
	valencia: "València",
	castellon: "Castelló",
	"castellon de la plana": "Castelló",
	alava: "Araba",
	"araba/alava": "Araba",
	vizcaya: "Bizkaia",
	guipuzcoa: "Gipuzkoa",
	"la coruna": "A Coruña",
	gerona: "Girona",
	lerida: "Lleida",
	orense: "Ourense",
	baleares: "Illes Balears",
	"islas baleares": "Illes Balears",
};

const provinceByName = new Map<string, string>([
	...provinces.map((name): [string, string] => [normalize(name), name]),
	...Object.entries(provinceAliases),
]);

export function matchProvince({
	county,
	state,
}: {
	county?: string;
	state?: string;
}): string | undefined {
	return (
		(county && provinceByName.get(normalize(county))) ||
		(state && singleProvinceRegions[normalize(state)]) ||
		undefined
	);
}

/** Provinces whose official name or common Spanish name contains the text. */
export function filterProvinces(query: string): string[] {
	const needle = normalize(query);
	const matches = new Set<string>();
	for (const [name, official] of provinceByName)
		if (name.includes(needle)) matches.add(official);
	return provinces.filter((name) => matches.has(name));
}

type CityRecord = { name: string; ineCode: string; province: string };

/** Local city suggestions: names starting with the text first, then names containing it. */
export function rankCities(
	cities: CityRecord[],
	query: string,
	limit = 8,
): Place[] {
	const needle = normalize(query);
	if (needle.length < 2) return [];
	const starts: CityRecord[] = [];
	const contains: CityRecord[] = [];
	for (const city of cities) {
		const name = normalize(city.name);
		if (name.startsWith(needle)) starts.push(city);
		else if (name.includes(needle)) contains.push(city);
	}
	return [...starts, ...contains].slice(0, limit).map((city) => ({
		id: city.ineCode,
		label: city.name,
		detail: city.province,
		city: city.name,
		province: city.province,
	}));
}

type PhotonProperties = {
	osm_id?: number;
	osm_type?: string;
	name?: string;
	street?: string;
	housenumber?: string;
	postcode?: string;
	city?: string;
	county?: string;
	state?: string;
	countrycode?: string;
	type?: string;
};

export function parsePhoton(json: unknown): Place[] {
	const features = (json as { features?: unknown } | null)?.features;
	if (!Array.isArray(features)) return [];
	const places: Place[] = [];
	for (const feature of features) {
		const p = (feature as { properties?: PhotonProperties })?.properties;
		if (!p?.name || p.countrycode !== "ES") continue;
		const province = matchProvince(p);
		if (p.type === "city") {
			places.push({
				id: `${p.osm_type ?? ""}${p.osm_id ?? p.name}`,
				label: p.name,
				detail: [p.postcode, province ?? p.state].filter(Boolean).join(" "),
				city: p.name,
				postcode: p.postcode,
				province,
			});
			continue;
		}
		const street = [p.street ?? p.name, p.housenumber]
			.filter(Boolean)
			.join(" ");
		places.push({
			id: `${p.osm_type ?? ""}${p.osm_id ?? street}-${p.postcode ?? ""}`,
			label: street,
			detail: [p.postcode, p.city].filter(Boolean).join(" "),
			street,
			postcode: p.postcode,
			city: p.city,
			province,
		});
	}
	// Photon can return the same street once per segment: keep the first of each.
	const seen = new Set<string>();
	return places.filter((place) => {
		const key = `${place.label}|${place.detail}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
