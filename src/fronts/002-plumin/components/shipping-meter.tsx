import { Label, Meter } from "@heroui/react";
import { FREE_SHIPPING_FROM } from "../cart";
import { formatPrice } from "../data";

/** How far the cart is from free shipping. */
export function ShippingMeter({ subtotal }: { subtotal: number }) {
	const missing = Math.max(0, FREE_SHIPPING_FROM - subtotal);
	return (
		<Meter
			value={Math.min(subtotal, FREE_SHIPPING_FROM)}
			maxValue={FREE_SHIPPING_FROM}
			size="sm"
		>
			<Label className="text-sm font-medium">
				{missing > 0
					? `Te faltan ${formatPrice(missing)} para el envío gratis.`
					: "Tienes el envío gratis."}
			</Label>
			<Meter.Track>
				<Meter.Fill />
			</Meter.Track>
		</Meter>
	);
}
