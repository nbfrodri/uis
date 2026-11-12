import { buttonVariants } from "@heroui/react";
import { useCart } from "../cart-context";
import { CartLines } from "../components/cart-lines";
import { ShippingMeter } from "../components/shipping-meter";
import { SiteLink } from "../components/site-link";
import { formatPrice } from "../data";

export function CartPage() {
	const { totals } = useCart();
	if (totals.count === 0) {
		return (
			<main className="mx-auto max-w-3xl px-4 pt-16 sm:px-8">
				<h1 className="text-5xl font-extrabold tracking-[-0.04em]">Carrito</h1>
				<p className="mt-4 text-lg">Todavía no has elegido ninguna tinta.</p>
				<SiteLink to="tintas" className={buttonVariants({ className: "mt-6" })}>
					Ver las tintas
				</SiteLink>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-6xl px-4 pt-6 sm:px-8 sm:pt-10">
			<h1 className="text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
				Carrito
			</h1>
			<div className="mt-6 grid gap-6 sm:mt-10 md:grid-cols-[1fr_22rem] md:gap-12">
				<div className="cart-window flex min-h-0 flex-col self-start overflow-hidden rounded-xl border border-(--rule) bg-white">
					<header className="flex items-baseline justify-between border-b border-(--rule) px-4 py-3 sm:px-6">
						<h2 className="font-bold">Tus productos</h2>
						<p className="text-sm text-(--ink-soft)">
							{totals.count} {totals.count === 1 ? "artículo" : "artículos"}
						</p>
					</header>
					<section
						aria-label="Productos del carrito"
						// biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard-reachable.
						tabIndex={0}
						className="cart-window-scroll relative overflow-y-auto overscroll-contain px-4 sm:px-6"
					>
						<CartLines />
					</section>
				</div>
				<aside
					aria-label="Resumen del pedido"
					className="self-start rounded-3xl bg-(--wash) p-5 sm:p-6"
				>
					<ShippingMeter subtotal={totals.subtotal} />
					<dl className="mt-4 grid grid-cols-[1fr_auto] gap-y-2 sm:mt-6">
						<dt>Subtotal</dt>
						<dd className="text-right">{formatPrice(totals.subtotal)}</dd>
						<dt>Envío</dt>
						<dd className="text-right">
							{totals.shipping === 0 ? "Gratis" : formatPrice(totals.shipping)}
						</dd>
						<dt className="mt-3 border-t border-(--rule) pt-3 text-lg font-bold">
							Total
						</dt>
						<dd className="mt-3 border-t border-(--rule) pt-3 text-right text-lg font-bold">
							{formatPrice(totals.total)}
						</dd>
					</dl>
					<SiteLink
						to="pago"
						className={buttonVariants({
							size: "lg",
							fullWidth: true,
							className: "mt-4 font-semibold sm:mt-6",
						})}
					>
						Tramitar pedido
					</SiteLink>
				</aside>
			</div>
		</main>
	);
}
