import { cartTotals } from "./cart";
import {
	type CheckoutForm,
	formatCardNumber,
	validateCheckout,
} from "./checkout";

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

describe("validateCheckout (practice mode: any value, but not empty)", () => {
	it("accepts a complete home delivery paid by card", () => {
		expect(validateCheckout(base)).toEqual({});
	});

	it("accepts made-up values in any format", () => {
		const anything = {
			...base,
			email: "x",
			phone: "1",
			postalCode: "abc",
			cardNumber: "1",
			cardExpiry: "ya",
			cardCvc: "?",
		};
		expect(validateCheckout(anything)).toEqual({});
	});

	it("names each empty field", () => {
		const errors = validateCheckout({
			...base,
			email: " ",
			firstName: "",
			phone: "",
			postalCode: "",
		});
		expect(Object.keys(errors).sort()).toEqual([
			"email",
			"firstName",
			"phone",
			"postalCode",
		]);
		expect(errors.email).toMatch(/correo/i);
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
		expect(validateCheckout(pickup)).toEqual({});
	});

	it("asks for the Bizum phone instead of the card", () => {
		const bizum = {
			...base,
			payment: "bizum" as const,
			cardNumber: "",
			cardExpiry: "",
			cardCvc: "",
			cardName: "",
		};
		expect(Object.keys(validateCheckout(bizum))).toEqual(["bizumPhone"]);
		expect(validateCheckout({ ...bizum, bizumPhone: "5" })).toEqual({});
	});
});

describe("formatCardNumber", () => {
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
