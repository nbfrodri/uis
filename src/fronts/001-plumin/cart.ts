export type CartLine = { id: string; qty: number };
export type CartState = { lines: CartLine[] };
export type CartAction =
	| { type: "add"; id: string; qty: number }
	| { type: "set"; id: string; qty: number }
	| { type: "remove"; id: string }
	| { type: "clear" };

export const MAX_QTY = 10;
export const FREE_SHIPPING_FROM = 40;
export const SHIPPING = 4.9;

const clamp = (qty: number) => Math.min(MAX_QTY, Math.max(0, Math.floor(qty)));

function setQty(lines: CartLine[], id: string, qty: number): CartLine[] {
	const next = clamp(qty);
	if (next === 0) return lines.filter((line) => line.id !== id);
	if (!lines.some((line) => line.id === id))
		return [...lines, { id, qty: next }];
	return lines.map((line) => (line.id === id ? { id, qty: next } : line));
}

export function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "add": {
			const current =
				state.lines.find((line) => line.id === action.id)?.qty ?? 0;
			return { lines: setQty(state.lines, action.id, current + action.qty) };
		}
		case "set":
			return { lines: setQty(state.lines, action.id, action.qty) };
		case "remove":
			return { lines: state.lines.filter((line) => line.id !== action.id) };
		case "clear":
			return { lines: [] };
	}
}

/** Rounds to cents so 19.1 + 4.9 never prints as 23.999999. */
const cents = (value: number) => Math.round(value * 100) / 100;

export function cartTotals(
	state: CartState,
	priceOf: (id: string) => number | undefined,
	delivery: "domicilio" | "tienda" = "domicilio",
) {
	let count = 0;
	let subtotal = 0;
	for (const line of state.lines) {
		const price = priceOf(line.id);
		if (price === undefined) continue;
		count += line.qty;
		subtotal += price * line.qty;
	}
	const shipping =
		count === 0 || delivery === "tienda" || subtotal >= FREE_SHIPPING_FROM
			? 0
			: SHIPPING;
	return {
		count,
		subtotal: cents(subtotal),
		shipping,
		total: cents(subtotal + shipping),
	};
}
