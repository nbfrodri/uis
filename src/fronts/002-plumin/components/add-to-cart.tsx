import { Button, toast } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../cart-context";
import { nameOf } from "../data";
import { QuantityField } from "./quantity-field";
import { useSitePath } from "./site-link";

type AddToCartProps = {
	id: string;
	label?: string;
	/** Singular and plural unit names, e.g. ["frasco", "frascos"]. */
	unit?: [string, string];
};

export function AddToCart({
	id,
	label = "Añadir al carrito",
	unit = ["frasco", "frascos"],
}: AddToCartProps) {
	const { dispatch } = useCart();
	const [qty, setQty] = useState(1);
	const navigate = useNavigate();
	const sitePath = useSitePath();

	const add = () => {
		dispatch({ type: "add", id, qty });
		toast.success(`${nameOf(id)} en el carrito`, {
			description: `Has añadido ${qty} ${qty === 1 ? unit[0] : unit[1]}.`,
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
			<Button size="lg" onPress={add} className="h-11 px-7 font-semibold">
				{label}
			</Button>
		</div>
	);
}

/** One-tap add used on product tiles. */
export function QuickAdd({ id }: { id: string }) {
	const { dispatch } = useCart();
	return (
		<Button
			size="sm"
			variant="secondary"
			aria-label={`Añadir ${nameOf(id)} al carrito`}
			onPress={() => {
				dispatch({ type: "add", id, qty: 1 });
				toast.success(`${nameOf(id)} en el carrito`);
			}}
		>
			Añadir
		</Button>
	);
}
