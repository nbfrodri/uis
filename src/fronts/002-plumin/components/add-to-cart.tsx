import { useId, useState } from "react";
import { useCart } from "../cart-context";
import { SiteLink } from "./site-link";

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
	const [added, setAdded] = useState(0);
	const selectId = useId();

	return (
		<div>
			<div className="flex flex-wrap items-end gap-3">
				<div>
					<label htmlFor={selectId} className="block text-sm text-(--ink-soft)">
						{unit[1].charAt(0).toUpperCase() + unit[1].slice(1)}
					</label>
					<select
						id={selectId}
						value={qty}
						onChange={(event) => setQty(Number(event.target.value))}
						className="mt-1 h-12 rounded-md border border-(--rule) bg-(--paper) px-3"
					>
						{[1, 2, 3, 4, 5].map((n) => (
							<option key={n} value={n}>
								{n}
							</option>
						))}
					</select>
				</div>
				<button
					type="button"
					onClick={() => {
						dispatch({ type: "add", id, qty });
						setAdded((n) => n + qty);
					}}
					className="h-12 rounded-md bg-(--ink) px-6 font-semibold text-(--paper) transition-transform active:scale-[0.97]"
				>
					{label}
				</button>
			</div>
			<p aria-live="polite" className="mt-3 min-h-6 text-sm">
				{added > 0 && (
					<>
						Has añadido {added} {added === 1 ? unit[0] : unit[1]}.{" "}
						<SiteLink to="carrito" className="underline underline-offset-4">
							Ver el carrito
						</SiteLink>
					</>
				)}
			</p>
		</div>
	);
}
