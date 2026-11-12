import { useParams } from "react-router";
import { AddToCart } from "../components/add-to-cart";
import { ShopBreadcrumbs } from "../components/breadcrumbs";
import { Level } from "../components/level";
import { ProductCard } from "../components/product-card";
import { Swatch } from "../components/swatch";
import { families, findInk, formatPrice, inks, mix } from "../data";
import { Missing } from "./missing";

export function InkPage() {
	const { id = "" } = useParams();
	const ink = findInk(id);
	if (!ink) return <Missing />;

	const related = inks.filter(
		(other) => other.family === ink.family && other.id !== ink.id,
	);
	const family = families.find((f) => f.id === ink.family);

	return (
		<main className="mx-auto max-w-7xl px-4 pt-8 sm:px-8">
			<ShopBreadcrumbs
				color={ink.color}
				items={[
					{ label: "Inicio", to: "" },
					{ label: "Tintas", to: "tintas" },
					{
						label: family?.label ?? ink.family,
						to: `tintas?familia=${ink.family}`,
					},
					{ label: ink.name },
				]}
			/>

			<div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
				<div
					className="grid aspect-[4/5] place-items-center rounded-3xl p-10 md:self-start"
					style={{ background: mix(ink.color, "#ffffff", 0.88) }}
				>
					<Swatch
						color={ink.color}
						sheen={ink.sheen}
						seed={7}
						className="h-full w-3/5"
					/>
				</div>

				<div className="md:pt-6">
					<p className="font-semibold text-(--ink-soft)">{ink.maker}</p>
					<h1 className="mt-1 text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.045em]">
						{ink.name}
					</h1>
					<p className="mt-5 text-2xl font-bold">
						{formatPrice(ink.price)}{" "}
						<span className="text-base font-medium text-(--ink-soft)">
							el frasco de 50 ml
						</span>
					</p>
					<p className="mt-5 max-w-[50ch] text-lg">{ink.note}</p>

					<div className="mt-8 rounded-2xl border border-(--rule) p-5">
						<AddToCart id={ink.id} />
					</div>

					<figure className="mt-10">
						<div className="rounded-2xl border border-(--rule) bg-white px-6 pt-3 pb-5">
							<p
								className="ruled font-hand text-[2.1rem]"
								style={{ color: ink.color }}
							>
								El veloz murciélago hindú comía feliz cardillo y kiwi. La
								cigüeña tocaba el saxofón detrás del palenque de paja.
							</p>
						</div>
					</figure>

					<dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-(--rule) pt-6">
						<div>
							<dt className="text-sm text-(--ink-soft)">Sombreado</dt>
							<dd className="mt-1 font-semibold">
								<Level value={ink.shading} />
							</dd>
						</div>
						<div>
							<dt className="text-sm text-(--ink-soft)">Tiempo de secado</dt>
							<dd className="mt-1 font-semibold">
								<Level value={ink.drying} />
							</dd>
						</div>
						<div>
							<dt className="text-sm text-(--ink-soft)">Resistente al agua</dt>
							<dd className="mt-1 font-semibold">
								{ink.waterproof ? "Sí" : "No"}
							</dd>
						</div>
						<div>
							<dt className="text-sm text-(--ink-soft)">
								Brillo en los charcos
							</dt>
							<dd className="mt-1 flex items-center gap-2 font-semibold">
								{ink.sheen && (
									<span
										className="size-3 rounded-full"
										style={{ background: ink.sheen }}
										aria-hidden="true"
									/>
								)}
								{ink.sheen ? "Sí" : "No"}
							</dd>
						</div>
					</dl>
				</div>
			</div>

			{related.length > 0 && (
				<section aria-labelledby="mismo-color" className="mt-28">
					<h2
						id="mismo-color"
						className="text-4xl font-extrabold tracking-[-0.03em]"
					>
						Del mismo color
					</h2>
					<div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
						{related.map((other, i) => (
							<ProductCard key={other.id} ink={other} seed={i + 21} />
						))}
					</div>
				</section>
			)}
		</main>
	);
}
