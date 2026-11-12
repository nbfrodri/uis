import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from "react";
import {
	type CartAction,
	type CartState,
	cartReducer,
	cartTotals,
} from "./cart";
import { findInk, priceOf, sampleBox } from "./data";

const STORAGE_KEY = "uis.plumin.cart";

function load(): CartState {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed: unknown = raw ? JSON.parse(raw) : null;
		if (
			!parsed ||
			typeof parsed !== "object" ||
			!("lines" in parsed) ||
			!Array.isArray(parsed.lines)
		)
			return { lines: [] };
		return parsed.lines.reduce<CartState>(
			(state, line: unknown) => {
				if (
					!line ||
					typeof line !== "object" ||
					!("id" in line) ||
					typeof line.id !== "string" ||
					priceOf(line.id) === undefined ||
					!("qty" in line) ||
					typeof line.qty !== "number" ||
					!Number.isFinite(line.qty) ||
					line.qty <= 0
				)
					return state;
				const rawSamples =
					line.id === sampleBox.id && "samples" in line
						? line.samples
						: undefined;
				let samples: string[] | undefined;
				if (rawSamples !== undefined) {
					if (!Array.isArray(rawSamples)) return state;
					const valid = rawSamples.filter(
						(id): id is string =>
							typeof id === "string" && findInk(id) !== undefined,
					);
					if (
						valid.length !== sampleBox.sampleCount ||
						valid.length !== rawSamples.length ||
						new Set(valid).size !== sampleBox.sampleCount
					)
						return state;
					samples = valid;
				}
				return cartReducer(state, {
					type: "add",
					id: line.id,
					qty: line.qty,
					samples,
				});
			},
			{ lines: [] },
		);
	} catch {
		return { lines: [] };
	}
}

type CartValue = CartState & {
	dispatch: (action: CartAction) => void;
	totals: ReturnType<typeof cartTotals>;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, undefined, load);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch {
			// Storage can be unavailable (private mode); the cart still works for this visit.
		}
	}, [state]);

	const value = useMemo(
		() => ({ ...state, dispatch, totals: cartTotals(state, priceOf) }),
		[state],
	);
	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
	const cart = useContext(CartContext);
	if (!cart) throw new Error("useCart must be used inside <CartProvider>");
	return cart;
}
