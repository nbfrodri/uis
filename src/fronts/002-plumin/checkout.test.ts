import { cartTotals } from "./cart";
import {
	type CheckoutForm,
	formatCardNumber,
	isValidCardNumber,
	validateCheckout,
} from "./checkout";

const now = new Date("2026-11-12T10:00:00Z");

const base: CheckoutForm = {
	email: "lucia@example.com",
	delivery: "domicilio",
	firstName: "Lucía",
	lastName: "Ferrer",
	address: "Calle del Pez 14",
	postalCode: "28004",
	city: "Madrid",
	province: "madrid",
	phone: "612345678",
	payment: "tarjeta",
	cardName: "Lucía Ferrer",
	cardNumber: "4242 4242 4242 4242",
	cardExpiry: "08/28",
	cardCvc: "123",
	bizumPhone: "",
};

describe("validateCheckout", () => {
	it("accepts a complete home delivery paid by card", () => {
		expect(validateCheckout(base, now)).toEqual({});
	});

	it("explains each wrong or missing field", () => {
		const errors = validateCheckout(
			{
				...base,
				email: "lucia@",
				postalCode: "2800",
				phone: "12345",
				firstName: " ",
			},
			now,
		);
		expect(Object.keys(errors).sort()).toEqual([
			"email",
			"firstName",
			"phone",
			"postalCode",
		]);
		expect(errors.postalCode).toMatch(/5 cifras/);
	});

	it("only asks for name and phone when collecting in the shop", () => {
		const pickup = {
			...base,
			delivery: "tienda" as const,
			address: "",
			postalCode: "",
			city: "",
			province: "",
		};
		expect(validateCheckout(pickup, now)).toEqual({});
	});

	it("rejects an invalid card, an expired date and a short CVC", () => {
		const errors = validateCheckout(
			{
				...base,
				cardNumber: "4242 4242 4242 4241",
				cardExpiry: "10/26",
				cardCvc: "12",
			},
			now,
		);
		expect(Object.keys(errors).sort()).toEqual([
			"cardCvc",
			"cardExpiry",
			"cardNumber",
		]);
	});

	it("needs a Spanish mobile for Bizum and ignores the card fields", () => {
		const bizum = {
			...base,
			payment: "bizum" as const,
			cardNumber: "",
			cardExpiry: "",
			cardCvc: "",
			cardName: "",
		};
		expect(
			validateCheckout({ ...bizum, bizumPhone: "912345678" }, now),
		).toHaveProperty("bizumPhone");
		expect(
			validateCheckout({ ...bizum, bizumPhone: "612 345 678" }, now),
		).toEqual({});
	});
});

describe("card helpers", () => {
	it("checks the Luhn digit", () => {
		expect(isValidCardNumber("4242424242424242")).toBe(true);
		expect(isValidCardNumber("4242424242424241")).toBe(false);
	});

	it("groups digits in fours and drops anything else", () => {
		expect(formatCardNumber("4242-4242x42424242 99")).toBe(
			"4242 4242 4242 4242 99",
		);
	});
});

describe("cartTotals with delivery", () => {
	it("never charges shipping when collecting in the shop", () => {
		const totals = cartTotals(
			{ lines: [{ id: "a", qty: 1 }] },
			() => 10,
			"tienda",
		);
		expect(totals).toMatchObject({ shipping: 0, total: 10 });
	});
});
