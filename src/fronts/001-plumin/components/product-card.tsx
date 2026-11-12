import { formatPrice, type Ink, mix } from "../data";
import { QuickAdd } from "./add-to-cart";
import { SiteLink } from "./site-link";
import { Swatch } from "./swatch";

/** Product tile: the swatch on a pale tint of its own ink, like a colour card. */
export function ProductCard({ ink, seed }: { ink: Ink; seed: number }) {
	return (
		<article className="group">
			<SiteLink to={`tintas/${ink.id}`} className="block">
				<div
					className="grid aspect-[4/5] place-items-center rounded-2xl p-8"
					style={{ background: mix(ink.color, "#ffffff", 0.88) }}
				>
					<Swatch
						color={ink.color}
						sheen={ink.sheen}
						seed={seed}
						className="tile-swatch h-full w-3/5"
					/>
				</div>
				<h3 className="mt-4 text-lg leading-snug font-bold">{ink.name}</h3>
			</SiteLink>
			<p className="text-sm text-(--ink-soft)">{ink.maker}</p>
			<div className="mt-2 flex flex-wrap items-center justify-between gap-2">
				<p className="font-semibold">{formatPrice(ink.price)}</p>
				<QuickAdd id={ink.id} />
			</div>
		</article>
	);
}
