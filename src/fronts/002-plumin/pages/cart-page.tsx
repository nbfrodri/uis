import { useState } from "react";
import { FREE_SHIPPING_FROM, MAX_QTY } from "../cart";
import { useCart } from "../cart-context";
import { SiteLink } from "../components/site-link";
import { Swatch } from "../components/swatch";
import { findInk, formatPrice, nameOf, priceOf } from "../data";

export function CartPage() {
	const { lines, totals, dispatch } = useCart();
	const [ordered, setOrdered] = useState(false);

	if (ordered) {
		return (
			<main className="mx-auto max-w-3xl px-4 pt-16 sm:px-8">
				<h1 className="font-display text-6xl font-medium">Pedido recibido</h1>
				<p className="mt-4 text-lg">
					Es una tienda de práctica: no se ha cobrado nada y no llegará ningún
					paquete. El carrito se ha vaciado.
				</p>
				<SiteLink
					to="tintas"
					className="mt-6 inline-block underline underline-offset-4"
				>
					Seguir mirando tintas
				</SiteLink>
			</main>
		);
	}

	const visibleLines = lines.filter((line) => priceOf(line.id) !== undefined);

	if (visibleLines.length === 0) {
		return (
			<main className="mx-auto max-w-3xl px-4 pt-16 sm:px-8">
				<h1 className="font-display text-6xl font-medium">Carrito</h1>
				<p className="mt-4 text-lg">
					Todavía no has elegido ninguna tinta.{" "}
					<SiteLink to="tintas" className="underline underline-offset-4">
						Ver las doce tintas
					</SiteLink>
				</p>
			</main>
		);
	}

	const missing = Math.max(0, FREE_SHIPPING_FROM - totals.subtotal);

	return (
		<main className="mx-auto max-w-5xl px-4 pt-12 sm:px-8">
			<h1 className="font-display text-6xl font-medium">Carrito</h1>
			<div className="mt-10 grid gap-12 md:grid-cols-[1fr_20rem]">
				<ul className="border-t border-(--rule)">
					{visibleLines.map((line) => {
						const ink = findInk(line.id);
						const price = priceOf(line.id) ?? 0;
						return (
							<li
								key={line.id}
								className="flex items-center gap-4 border-b border-(--rule) py-5"
							>
								{ink ? (
									<Swatch
										color={ink.color}
										sheen={ink.sheen}
										className="h-16 w-12 shrink-0"
									/>
								) : (
									<span className="grid h-16 w-12 shrink-0 place-items-center rounded bg-(--wash) text-xs">
										5×
									</span>
								)}
								<div className="min-w-0 flex-1">
									<p className="font-semibold">{nameOf(line.id)}</p>
									<p className="text-sm text-(--ink-soft)">
										{formatPrice(price)} la unidad
									</p>
									<button
										type="button"
										onClick={() => dispatch({ type: "remove", id: line.id })}
										className="mt-1 text-sm underline underline-offset-4"
									>
										Quitar
									</button>
								</div>
								<label className="sr-only" htmlFor={`qty-${line.id}`}>
									Cantidad de {nameOf(line.id)}
								</label>
								<select
									id={`qty-${line.id}`}
									value={line.qty}
									onChange={(event) =>
										dispatch({
											type: "set",
											id: line.id,
											qty: Number(event.target.value),
										})
									}
									className="h-11 rounded-md border border-(--rule) bg-(--paper) px-2"
								>
									{Array.from({ length: MAX_QTY }, (_, i) => i + 1).map((n) => (
										<option key={n} value={n}>
											{n}
										</option>
									))}
								</select>
								<p className="w-20 text-right">
									{formatPrice(price * line.qty)}
								</p>
							</li>
						);
					})}
				</ul>

				<aside
					aria-label="Resumen"
					className="self-start rounded-2xl bg-(--wash) p-6"
				>
					<dl className="grid grid-cols-[1fr_auto] gap-y-2">
						<dt>Subtotal</dt>
						<dd className="text-right">{formatPrice(totals.subtotal)}</dd>
						<dt>Envío</dt>
						<dd className="text-right">
							{totals.shipping === 0 ? "Gratis" : formatPrice(totals.shipping)}
						</dd>
						<dt className="mt-3 border-t border-(--rule) pt-3 font-semibold">
							Total
						</dt>
						<dd className="mt-3 border-t border-(--rule) pt-3 text-right font-semibold">
							{formatPrice(totals.total)}
						</dd>
					</dl>
					{missing > 0 && (
						<p className="mt-4 text-sm text-(--ink-soft)">
							Te faltan {formatPrice(missing)} para el envío gratis.
						</p>
					)}
					<button
						type="button"
						onClick={() => {
							dispatch({ type: "clear" });
							setOrdered(true);
						}}
						className="mt-6 h-12 w-full rounded-md bg-(--ink) font-semibold text-(--paper) transition-transform active:scale-[0.97]"
					>
						Hacer el pedido de prueba
					</button>
					<p className="mt-3 text-xs text-(--ink-soft)">
						Tienda de práctica: no se pide ningún dato ni se cobra nada.
					</p>
				</aside>
			</div>
		</main>
	);
}
