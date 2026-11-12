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
import { priceOf } from "./data";

const STORAGE_KEY = "uis.plumin.cart";

function load(): CartState {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? (JSON.parse(raw) as CartState) : null;
		return Array.isArray(parsed?.lines) ? parsed : { lines: [] };
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
