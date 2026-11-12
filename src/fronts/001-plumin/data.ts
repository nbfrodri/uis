export type Family =
	| "azules"
	| "verdes"
	| "rojos"
	| "marrones"
	| "morados"
	| "negros";
export type Level = 1 | 2 | 3;

export type Ink = {
	id: string;
	name: string;
	maker: string;
	family: Family;
	color: string;
	/** Metallic edge some inks leave when they pool. */
	sheen?: string;
	shading: Level;
	drying: Level;
	waterproof: boolean;
	price: number;
	note: string;
};

export const families: { id: Family; label: string }[] = [
	{ id: "azules", label: "Azules" },
	{ id: "verdes", label: "Verdes" },
	{ id: "rojos", label: "Rojos" },
	{ id: "marrones", label: "Marrones" },
	{ id: "morados", label: "Morados" },
	{ id: "negros", label: "Negros y grises" },
];

export const inks: Ink[] = [
	{
		id: "azul-real",
		name: "Azul real escolar",
		maker: "Casa Ordóñez",
		family: "azules",
		color: "#2a3fa0",
		shading: 2,
		drying: 1,
		waterproof: false,
		price: 14,
		note: "La de los cuadernos de caligrafía. Fluye bien en cualquier pluma y se limpia con agua.",
	},
	{
		id: "mar-de-bizkaia",
		name: "Mar de Bizkaia",
		maker: "Tintas del Cantábrico",
		family: "azules",
		color: "#1d5c73",
		sheen: "#b0303a",
		shading: 3,
		drying: 2,
		waterproof: false,
		price: 18.5,
		note: "Azul petróleo que deja un filo rojizo donde la tinta se acumula. Mejor con plumín ancho.",
	},
	{
		id: "tormenta",
		name: "Tormenta",
		maker: "Atelier Nube",
		family: "negros",
		color: "#3e4a5c",
		shading: 2,
		drying: 2,
		waterproof: true,
		price: 16,
		note: "Gris azulado resistente al agua. Para sobres y cuadernos de campo.",
	},
	{
		id: "negro-imprenta",
		name: "Negro imprenta",
		maker: "Casa Ordóñez",
		family: "negros",
		color: "#1b1b1f",
		shading: 1,
		drying: 1,
		waterproof: true,
		price: 12,
		note: "Negro denso y plano. Seca rápido incluso en papel satinado.",
	},
	{
		id: "musgo-de-ordesa",
		name: "Musgo de Ordesa",
		maker: "Atelier Nube",
		family: "verdes",
		color: "#4f6b2e",
		shading: 3,
		drying: 2,
		waterproof: false,
		price: 17,
		note: "Verde oliva oscuro con mucho sombreado: cada trazo tiene dos tonos.",
	},
	{
		id: "aceituna",
		name: "Aceituna",
		maker: "Tintas del Cantábrico",
		family: "verdes",
		color: "#7a7a2a",
		shading: 2,
		drying: 1,
		waterproof: false,
		price: 15,
		note: "Amarillo verdoso apagado. Bonita para subrayar y para notas al margen.",
	},
	{
		id: "granada",
		name: "Granada",
		maker: "Casa Ordóñez",
		family: "rojos",
		color: "#9b1d2e",
		sheen: "#c9a646",
		shading: 2,
		drying: 3,
		waterproof: false,
		price: 19,
		note: "Rojo granate con brillo dorado. Tarda en secar: dale unos segundos.",
	},
	{
		id: "pimenton",
		name: "Pimentón",
		maker: "Atelier Nube",
		family: "rojos",
		color: "#c2461f",
		shading: 3,
		drying: 2,
		waterproof: false,
		price: 16,
		note: "Naranja tostado y cálido. Para corregir sin que parezca un examen.",
	},
	{
		id: "tabaco",
		name: "Tabaco",
		maker: "Tintas del Cantábrico",
		family: "marrones",
		color: "#6b4325",
		shading: 2,
		drying: 2,
		waterproof: false,
		price: 15,
		note: "Marrón de hoja curada. Envejece bien en papel crema.",
	},
	{
		id: "sepia-de-archivo",
		name: "Sepia de archivo",
		maker: "Casa Ordóñez",
		family: "marrones",
		color: "#8a6a45",
		shading: 3,
		drying: 1,
		waterproof: true,
		price: 14,
		note: "El color de las cartas antiguas, pero resistente al agua.",
	},
	{
		id: "lavanda-de-brihuega",
		name: "Lavanda de Brihuega",
		maker: "Atelier Nube",
		family: "morados",
		color: "#7a68b0",
		shading: 2,
		drying: 1,
		waterproof: false,
		price: 17,
		note: "Lila suave y legible. Pierde algo de color con la luz directa.",
	},
	{
		id: "ciruela",
		name: "Ciruela",
		maker: "Tintas del Cantábrico",
		family: "morados",
		color: "#5a2350",
		sheen: "#3a7a4a",
		shading: 2,
		drying: 3,
		waterproof: false,
		price: 19,
		note: "Morado profundo con brillo verde en los charcos de tinta.",
	},
];

export const sampleBox = {
	id: "caja-muestras",
	name: "Caja de muestras",
	price: 9,
	sampleCount: 5,
	mlPerSample: 4,
	note: "Cinco viales de 4 ml con las tintas que tú elijas.",
};

export function findInk(id: string): Ink | undefined {
	return inks.find((ink) => ink.id === id);
}

export function priceOf(id: string): number | undefined {
	return id === sampleBox.id ? sampleBox.price : findInk(id)?.price;
}

export function nameOf(id: string): string {
	return id === sampleBox.id ? sampleBox.name : (findInk(id)?.name ?? id);
}

export const formatPrice = (value: number) =>
	new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
		value,
	);

/** Mixes two #rrggbb colours; t = 0 → a, t = 1 → b. */
export function mix(a: string, b: string, t: number): string {
	const channel = (hex: string, i: number) =>
		Number.parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
	const out = [0, 1, 2].map((i) =>
		Math.round(channel(a, i) * (1 - t) + channel(b, i) * t),
	);
	return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
