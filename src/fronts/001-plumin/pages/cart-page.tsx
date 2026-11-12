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
		<main className="mx-auto max-w-6xl px-4 pt-10 sm:px-8">
			<h1 className="text-5xl font-extrabold tracking-[-0.04em]">Carrito</h1>
			<div className="mt-10 grid gap-12 md:grid-cols-[1fr_22rem]">
				<CartLines />
				<aside
					aria-label="Resumen del pedido"
					className="self-start rounded-3xl bg-(--wash) p-6 md:sticky md:top-28"
				>
					<ShippingMeter subtotal={totals.subtotal} />
					<dl className="mt-6 grid grid-cols-[1fr_auto] gap-y-2">
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
							className: "mt-6 font-semibold",
						})}
					>
						Tramitar pedido
					</SiteLink>
				</aside>
			</div>
		</main>
	);
}
