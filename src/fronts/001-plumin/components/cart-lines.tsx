import { Button } from "@heroui/react";
import sampleBoxPhoto from "../assets/sample-box.webp";
import { cartLineKey } from "../cart";
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
					<li key={cartLineKey(line)} className="flex gap-4 py-4">
						<div
							className={`grid shrink-0 content-center place-items-center gap-2 overflow-hidden rounded-xl ${ink ? "bg-(--wash)" : "bg-[#f4ede2]"} ${compact ? "h-20 w-16" : "h-28 w-22"}`}
						>
							{ink ? (
								<Swatch
									color={ink.color}
									sheen={ink.sheen}
									className="h-4/5 w-3/5"
								/>
							) : (
								<>
									<img
										src={sampleBoxPhoto}
										alt="Caja de muestras Plumín"
										width={1200}
										height={800}
										className="h-auto w-full"
									/>
									{line.samples && (
										<span className="flex gap-1" aria-hidden="true">
											{line.samples.map((id) => (
												<span
													key={id}
													className="size-1.5 rounded-full"
													style={{ backgroundColor: findInk(id)?.color }}
												/>
											))}
										</span>
									)}
								</>
							)}
						</div>
						<div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
							<div className="flex items-start justify-between gap-3">
								<div>
									<p className="leading-snug font-bold">{nameOf(line.id)}</p>
									<p className="text-sm text-(--ink-soft)">
										{formatPrice(price)} la unidad
									</p>
									{line.samples && (
										<p className="mt-1 text-xs text-(--ink-soft)">
											{line.samples.map(nameOf).join(", ")}
										</p>
									)}
								</div>
								<p className="font-semibold">{formatPrice(price * line.qty)}</p>
							</div>
							<div className="flex items-center justify-between gap-3">
								<QuantityField
									value={line.qty}
									onChange={(qty) =>
										dispatch({
											type: "set",
											id: line.id,
											qty,
											samples: line.samples,
										})
									}
									label={`Cantidad de ${nameOf(line.id)}`}
									hideLabel
								/>
								<Button
									size="sm"
									variant="ghost"
									onPress={() =>
										dispatch({
											type: "remove",
											id: line.id,
											samples: line.samples,
										})
									}
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
