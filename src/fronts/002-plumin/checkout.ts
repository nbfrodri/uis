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

export const provinces = [
	"A Coruña",
	"Álava",
	"Albacete",
	"Alicante",
	"Almería",
	"Asturias",
	"Ávila",
	"Badajoz",
	"Barcelona",
	"Bizkaia",
	"Burgos",
	"Cáceres",
	"Cádiz",
	"Cantabria",
	"Castellón",
	"Ceuta",
	"Ciudad Real",
	"Córdoba",
	"Cuenca",
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
	"Málaga",
	"Melilla",
	"Murcia",
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
	"Valencia",
	"Valladolid",
	"Zamora",
	"Zaragoza",
].map((name) => ({ id: name.toLowerCase(), name }));

const digits = (value: string) => value.replace(/\D/g, "");

export function isValidCardNumber(value: string): boolean {
	const number = digits(value);
	if (number.length < 13 || number.length > 19) return false;
	let sum = 0;
	for (let i = 0; i < number.length; i++) {
		let digit = Number(number[number.length - 1 - i]);
		if (i % 2 === 1) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}
		sum += digit;
	}
	return sum % 10 === 0;
}

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

function expiryError(value: string, now: Date): string | undefined {
	const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
	if (!match) return "Escribe la fecha como MM/AA.";
	const month = Number(match[1]);
	const year = 2000 + Number(match[2]);
	if (month < 1 || month > 12) return "El mes va de 01 a 12.";
	// A card is valid until the last day of its month.
	if (new Date(year, month, 1) <= now) return "Esta tarjeta ha caducado.";
	return undefined;
}

const isSpanishPhone = (value: string) => /^[6789]\d{8}$/.test(digits(value));
const isSpanishMobile = (value: string) => /^[67]\d{8}$/.test(digits(value));
const required = (value: string) => value.trim().length > 0;

export function validateCheckout(
	form: CheckoutForm,
	now: Date = new Date(),
): CheckoutErrors {
	const errors: CheckoutErrors = {};

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
		errors.email = "Escribe un correo válido, como nombre@ejemplo.com.";
	if (!required(form.firstName)) errors.firstName = "Escribe tu nombre.";
	if (!required(form.lastName)) errors.lastName = "Escribe tus apellidos.";
	if (!isSpanishPhone(form.phone))
		errors.phone = "Escribe un teléfono de 9 cifras.";

	if (form.delivery === "domicilio") {
		if (!required(form.address))
			errors.address = "Escribe la calle y el número.";
		if (!/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(form.postalCode.trim()))
			errors.postalCode = "El código postal tiene 5 cifras, como 28012.";
		if (!required(form.city)) errors.city = "Escribe la ciudad.";
		if (!required(form.province)) errors.province = "Elige la provincia.";
	}

	if (form.payment === "tarjeta") {
		if (!required(form.cardName))
			errors.cardName = "Escribe el nombre tal como aparece en la tarjeta.";
		if (!isValidCardNumber(form.cardNumber))
			errors.cardNumber = "Revisa el número de la tarjeta.";
		const expiry = expiryError(form.cardExpiry, now);
		if (expiry) errors.cardExpiry = expiry;
		if (!/^\d{3,4}$/.test(form.cardCvc.trim()))
			errors.cardCvc = "El código tiene 3 o 4 cifras.";
	} else if (!isSpanishMobile(form.bizumPhone)) {
		errors.bizumPhone = "Bizum necesita un móvil español de 9 cifras.";
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
