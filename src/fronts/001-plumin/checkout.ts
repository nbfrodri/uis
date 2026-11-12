// Practice checkout: validation only. Nothing is sent, charged or stored.

export type Delivery = "domicilio" | "tienda";
export type Payment = "tarjeta" | "bizum";

export type CheckoutForm = {
	email: string;
	delivery: Delivery;
	firstName: string;
	lastName: string;
	address: string;
	postalCode: string;
	city: string;
	province: string;
	phone: string;
	payment: Payment;
	cardName: string;
	cardNumber: string;
	cardExpiry: string;
	cardCvc: string;
	bizumPhone: string;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

export const emptyCheckout: CheckoutForm = {
	email: "",
	delivery: "domicilio",
	firstName: "",
	lastName: "",
	address: "",
	postalCode: "",
	city: "",
	province: "",
	phone: "",
	payment: "tarjeta",
	cardName: "",
	cardNumber: "",
	cardExpiry: "",
	cardCvc: "",
	bizumPhone: "",
};

/** Official province names, as the INE (and spanish-cities-info) write them. */
export const provinces = [
	"A Coruña",
	"Alacant",
	"Albacete",
	"Almería",
	"Araba",
	"Asturias",
	"Badajoz",
	"Barcelona",
	"Bizkaia",
	"Burgos",
	"Cantabria",
	"Castelló",
	"Ceuta",
	"Ciudad Real",
	"Cuenca",
	"Cáceres",
	"Cádiz",
	"Córdoba",
	"Gipuzkoa",
	"Girona",
	"Granada",
	"Guadalajara",
	"Huelva",
	"Huesca",
	"Illes Balears",
	"Jaén",
	"La Rioja",
	"Las Palmas",
	"León",
	"Lleida",
	"Lugo",
	"Madrid",
	"Melilla",
	"Murcia",
	"Málaga",
	"Navarra",
	"Ourense",
	"Palencia",
	"Pontevedra",
	"Salamanca",
	"Santa Cruz de Tenerife",
	"Segovia",
	"Sevilla",
	"Soria",
	"Tarragona",
	"Teruel",
	"Toledo",
	"Valladolid",
	"València",
	"Zamora",
	"Zaragoza",
	"Ávila",
];

const digits = (value: string) => value.replace(/\D/g, "");

export function formatCardNumber(value: string): string {
	return digits(value)
		.slice(0, 19)
		.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Keeps MM/AA as the user types: "082" → "08/2". */
export function formatExpiry(value: string): string {
	const d = digits(value).slice(0, 4);
	return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

/** What to say when a field is left empty. Practice mode: any non-empty value is accepted. */
const emptyMessages: Partial<Record<keyof CheckoutForm, string>> = {
	email: "Escribe un correo (vale cualquiera, es de prueba).",
	firstName: "Escribe tu nombre.",
	lastName: "Escribe tus apellidos.",
	phone: "Escribe un teléfono (vale cualquiera).",
	address: "Escribe la dirección.",
	postalCode: "Escribe el código postal.",
	city: "Escribe la ciudad.",
	province: "Escribe la provincia.",
	cardName: "Escribe el titular.",
	cardNumber: "Escribe un número de tarjeta (vale cualquiera).",
	cardExpiry: "Escribe la caducidad.",
	cardCvc: "Escribe el CVC.",
	bizumPhone: "Escribe el móvil de Bizum (vale cualquiera).",
};

function requiredFields(form: CheckoutForm): (keyof CheckoutForm)[] {
	const fields: (keyof CheckoutForm)[] = [
		"email",
		"firstName",
		"lastName",
		"phone",
	];
	if (form.delivery === "domicilio")
		fields.push("address", "postalCode", "city", "province");
	if (form.payment === "tarjeta")
		fields.push("cardNumber", "cardName", "cardExpiry", "cardCvc");
	else fields.push("bizumPhone");
	return fields;
}

export function validateCheckout(form: CheckoutForm): CheckoutErrors {
	const errors: CheckoutErrors = {};
	for (const field of requiredFields(form)) {
		if (!form[field].trim()) errors[field] = emptyMessages[field];
	}
	return errors;
}

/** A readable order reference such as PL-7K3Q9. */
export function orderNumber(random: () => number = Math.random): string {
	const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
	const code = Array.from(
		{ length: 5 },
		() => alphabet[Math.floor(random() * alphabet.length)],
	).join("");
	return `PL-${code}`;
}
