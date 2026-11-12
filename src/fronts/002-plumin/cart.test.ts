import { type CartState, cartReducer, cartTotals } from "./cart";

const empty: CartState = { lines: [] };

describe("cartReducer", () => {
	it("adds a product and merges repeated adds into one line", () => {
		let state = cartReducer(empty, { type: "add", id: "granada", qty: 1 });
		state = cartReducer(state, { type: "add", id: "granada", qty: 2 });
		expect(state.lines).toEqual([{ id: "granada", qty: 3 }]);
	});

	it("caps a line at 10 units and drops it when set to zero", () => {
		let state = cartReducer(empty, { type: "add", id: "tabaco", qty: 15 });
		expect(state.lines[0]?.qty).toBe(10);
		state = cartReducer(state, { type: "set", id: "tabaco", qty: 0 });
		expect(state.lines).toEqual([]);
	});

	it("removes a line and clears everything", () => {
		let state = cartReducer(empty, { type: "add", id: "a", qty: 1 });
		state = cartReducer(state, { type: "add", id: "b", qty: 1 });
		expect(cartReducer(state, { type: "remove", id: "a" }).lines).toEqual([
			{ id: "b", qty: 1 },
		]);
		expect(cartReducer(state, { type: "clear" }).lines).toEqual([]);
	});
});

describe("cartTotals", () => {
	const prices = { granada: 19, muestras: 9 };
	const priceOf = (id: string) => prices[id as keyof typeof prices];

	it("charges shipping below 40 €", () => {
		expect(cartTotals({ lines: [{ id: "granada", qty: 1 }] }, priceOf)).toEqual(
			{ count: 1, subtotal: 19, shipping: 4.9, total: 23.9 },
		);
	});

	it("ships free from 40 € and nothing for an empty cart", () => {
		expect(
			cartTotals(
				{
					lines: [
						{ id: "granada", qty: 2 },
						{ id: "muestras", qty: 1 },
					],
				},
				priceOf,
			),
		).toMatchObject({ count: 3, subtotal: 47, shipping: 0, total: 47 });
		expect(cartTotals(empty, priceOf)).toEqual({
			count: 0,
			subtotal: 0,
			shipping: 0,
			total: 0,
		});
	});

	it("ignores lines whose product no longer exists", () => {
		expect(
			cartTotals({ lines: [{ id: "gone", qty: 2 }] }, () => undefined).count,
		).toBe(0);
	});
});
