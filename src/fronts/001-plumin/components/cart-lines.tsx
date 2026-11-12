import { Button } from "@heroui/react";
import { useCart } from "../cart-context";
import { findInk, formatPrice, nameOf, priceOf } from "../data";
import { QuantityField } from "./quantity-field";
import { Swatch } from "./swatch";

/** The cart's lines, shared by the side drawer and the cart page. */
export function CartLines({ compact }: { compact?: boolean }) {
	const { lines, dispatch } = useCart();
	const visible = lines.filter((line) => priceOf(line.id) !== undefined);

	return (
		<ul className="divide-y divide-(--rule)">
			{visible.map((line) => {
				const ink = findInk(line.id);
				const price = priceOf(line.id) ?? 0;
				return (
					<li key={line.id} className="flex gap-4 py-4">
						<div
							className={`grid shrink-0 place-items-center rounded-xl bg-(--wash) ${compact ? "h-20 w-16" : "h-28 w-22"}`}
						>
							{ink ? (
								<Swatch
									color={ink.color}
									sheen={ink.sheen}
									className="h-4/5 w-3/5"
								/>
							) : (
								<span className="text-sm font-bold">5×4 ml</span>
							)}
						</div>
						<div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
							<div className="flex items-start justify-between gap-3">
								<div>
									<p className="leading-snug font-bold">{nameOf(line.id)}</p>
									<p className="text-sm text-(--ink-soft)">
										{formatPrice(price)} la unidad
									</p>
								</div>
								<p className="font-semibold">{formatPrice(price * line.qty)}</p>
							</div>
							<div className="flex items-center justify-between gap-3">
								<QuantityField
									value={line.qty}
									onChange={(qty) =>
										dispatch({ type: "set", id: line.id, qty })
									}
									label={`Cantidad de ${nameOf(line.id)}`}
									hideLabel
								/>
								<Button
									size="sm"
									variant="ghost"
									onPress={() => dispatch({ type: "remove", id: line.id })}
									aria-label={`Quitar ${nameOf(line.id)}`}
								>
									Quitar
								</Button>
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
