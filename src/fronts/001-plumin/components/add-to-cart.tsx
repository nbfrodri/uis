import { Button, toast } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { cartLineKey, MAX_QTY } from "../cart";
import { useCart } from "../cart-context";
import { nameOf } from "../data";
import { QuantityField } from "./quantity-field";
import { useSitePath } from "./site-link";

type AddToCartProps = {
	id: string;
	label?: string;
	/** Singular and plural unit names, e.g. ["frasco", "frascos"]. */
	unit?: [string, string];
	samples?: string[];
	disabled?: boolean;
};

function useCartAddition(id: string, samples?: string[]) {
	const { lines, dispatch } = useCart();
	const key = cartLineKey({ id, samples });
	const [confirmedKey, setConfirmedKey] = useState<string | null>(null);
	const timer = useRef<number | undefined>(undefined);
	useEffect(() => () => window.clearTimeout(timer.current), []);
	const add = (qty: number) => {
		const current = lines.find((line) => cartLineKey(line) === key)?.qty ?? 0;
		const amount = Math.min(qty, MAX_QTY - current);
		if (amount <= 0) {
			toast.info(`Ya tienes el máximo de ${MAX_QTY} unidades en el carrito.`);
			return 0;
		}
		dispatch({ type: "add", id, qty: amount, samples });
		setConfirmedKey(key);
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setConfirmedKey(null), 1800);
		return amount;
	};
	return { added: confirmedKey === key, add };
}

function AddButtonLabel({ added, label }: { added: boolean; label: string }) {
	return (
		<span className="cart-add-content">
			<span className="cart-add-idle" aria-hidden={added}>
				{label}
			</span>
			<span className="cart-add-confirmation" aria-hidden={!added}>
				<svg
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.75"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="m3 8 3.25 3.25L13 4.5" />
				</svg>
				Añadido
			</span>
		</span>
	);
}

export function AddToCart({
	id,
	label = "Añadir al carrito",
	unit = ["frasco", "frascos"],
	samples,
	disabled = false,
}: AddToCartProps) {
	const { added, add: addLine } = useCartAddition(id, samples);
	const [qty, setQty] = useState(1);
	const navigate = useNavigate();
	const sitePath = useSitePath();

	const add = () => {
		const amount = addLine(qty);
		if (!amount) return;
		toast.success(`${nameOf(id)} en el carrito`, {
			description: `Has añadido ${amount} ${amount === 1 ? unit[0] : unit[1]}.`,
			actionProps: {
				children: "Ver carrito",
				onPress: () => navigate(sitePath("carrito")),
			},
		});
	};

	return (
		<div className="flex flex-wrap items-end gap-3">
			<QuantityField
				value={qty}
				onChange={setQty}
				label={unit[1].charAt(0).toUpperCase() + unit[1].slice(1)}
			/>
			<Button
				size="lg"
				onPress={add}
				isDisabled={disabled}
				className="cart-add-button h-11 px-7 font-semibold"
				data-added={added}
			>
				<AddButtonLabel added={added} label={label} />
			</Button>
		</div>
	);
}

/** One-tap add used on product tiles. */
export function QuickAdd({ id }: { id: string }) {
	const { added, add } = useCartAddition(id);
	return (
		<Button
			size="sm"
			variant="secondary"
			className="cart-add-button"
			data-added={added}
			aria-label={
				added ? `Añadido: ${nameOf(id)}` : `Añadir ${nameOf(id)} al carrito`
			}
			onPress={() => {
				if (!add(1)) return;
				toast.success(`${nameOf(id)} en el carrito`);
			}}
		>
			<AddButtonLabel added={added} label="Añadir" />
		</Button>
	);
}
