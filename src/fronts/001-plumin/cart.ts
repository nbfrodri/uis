export type CartLine = { id: string; qty: number; samples?: string[] };
export type CartState = { lines: CartLine[] };
export type CartAction =
	| { type: "add"; id: string; qty: number; samples?: string[] }
	| { type: "set"; id: string; qty: number; samples?: string[] }
	| { type: "remove"; id: string; samples?: string[] }
	| { type: "clear" };

export const MAX_QTY = 10;
export const FREE_SHIPPING_FROM = 40;
export const SHIPPING = 4.9;

const clamp = (qty: number) => Math.min(MAX_QTY, Math.max(0, Math.floor(qty)));

export function cartLineKey(line: Pick<CartLine, "id" | "samples">): string {
	return line.samples?.length
		? `${line.id}:${[...line.samples].sort().join(",")}`
		: line.id;
}

function setQty(
	lines: CartLine[],
	id: string,
	qty: number,
	samples?: string[],
): CartLine[] {
	const next = clamp(qty);
	const key = cartLineKey({ id, samples });
	if (next === 0) return lines.filter((line) => cartLineKey(line) !== key);
	if (!lines.some((line) => cartLineKey(line) === key))
		return [
			...lines,
			{ id, qty: next, ...(samples?.length ? { samples: [...samples] } : {}) },
		];
	return lines.map((line) =>
		cartLineKey(line) === key ? { ...line, qty: next } : line,
	);
}

export function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "add": {
			const key = cartLineKey(action);
			const current =
				state.lines.find((line) => cartLineKey(line) === key)?.qty ?? 0;
			return {
				lines: setQty(
					state.lines,
					action.id,
					current + action.qty,
					action.samples,
				),
			};
		}
		case "set":
			return {
				lines: setQty(state.lines, action.id, action.qty, action.samples),
			};
		case "remove":
			return {
				lines: state.lines.filter(
					(line) => cartLineKey(line) !== cartLineKey(action),
				),
			};
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
