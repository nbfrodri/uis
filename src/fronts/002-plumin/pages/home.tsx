import { buttonVariants } from "@heroui/react";
import type { CSSProperties } from "react";
import { AddToCart } from "../components/add-to-cart";
import { ProductCard } from "../components/product-card";
import { ShopMap } from "../components/shop-map";
import { SiteLink } from "../components/site-link";
import { Swatch } from "../components/swatch";
import { families, findInk, formatPrice, inks, mix, sampleBox } from "../data";

/**
 * Hero layers: position, size, tilt and how far each drifts while scrolling.
 * Far layers move little, near layers move a lot: that difference is the parallax.
 */
const heroLayers = [
	{
		id: "lavanda-de-brihuega",
		className: "left-[4%] top-[18%] h-[58%] w-[22%]",
		tilt: -8,
		drift: -40,
	},
	{
		id: "aceituna",
		className: "right-[6%] top-[6%] h-[48%] w-[20%]",
		tilt: 6,
		drift: -60,
	},
	{
		id: "mar-de-bizkaia",
		className: "left-[24%] top-[2%] h-[78%] w-[28%]",
		tilt: -3,
		drift: -120,
	},
	{
		id: "granada",
		className: "left-[50%] top-[20%] h-[76%] w-[27%]",
		tilt: 5,
		drift: -200,
	},
	{
		id: "azul-real",
		className: "right-[0%] top-[46%] h-[50%] w-[19%]",
		tilt: -6,
		drift: -260,
	},
].flatMap((layer) => {
	const ink = findInk(layer.id);
	return ink ? [{ ...layer, ink }] : [];
});

const newest = ["granada", "musgo-de-ordesa", "ciruela", "pimenton"].flatMap(
	(id) => findInk(id) ?? [],
);

/** One representative ink per colour family, for the colour browser. */
const familyColor = Object.fromEntries(
	families.map((f) => [f.id, inks.find((ink) => ink.family === f.id)?.color]),
);

export function Home() {
	return (
		<main>
			<section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-16 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:pt-16">
				<div>
					<h1 className="max-w-[11ch] text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.95] font-extrabold tracking-[-0.045em]">
						Tinta para escribir a mano.
					</h1>
					<p className="mt-6 max-w-[42ch] text-lg text-(--ink-soft) sm:text-xl">
						Doce tintas de tres talleres pequeños. Las probamos en papel antes
						de traerlas, y aquí ves cómo quedan.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<SiteLink
							to="tintas"
							className={buttonVariants({
								size: "lg",
								className: "px-7 font-semibold",
							})}
						>
							Ver las tintas
						</SiteLink>
						<SiteLink
							to="#muestras"
							className={buttonVariants({
								size: "lg",
								variant: "secondary",
								className: "px-7 font-semibold",
							})}
						>
							Pedir muestras
						</SiteLink>
					</div>
				</div>

				<div
					aria-hidden="true"
					className="relative h-[24rem] sm:h-[32rem] lg:h-[38rem]"
				>
					{heroLayers.map((layer, i) => (
						<div
							key={layer.id}
							className={`parallax-layer absolute ${layer.className}`}
							style={
								{
									"--tilt": `${layer.tilt}deg`,
									"--drift": `${layer.drift}px`,
								} as CSSProperties
							}
						>
							<Swatch
								color={layer.ink.color}
								sheen={layer.ink.sheen}
								seed={i + 30}
								className="size-full"
							/>
						</div>
					))}
				</div>
			</section>

			<section
				aria-labelledby="por-color"
				className="mx-auto max-w-7xl px-4 sm:px-8"
			>
				<h2 id="por-color" className="text-2xl font-extrabold tracking-tight">
					Busca por color
				</h2>
				<ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
					{families.map((family) => (
						<li key={family.id}>
							<SiteLink
								to={`tintas?familia=${family.id}`}
								className="flex flex-col items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-(--wash)"
							>
								<span
									className="size-16 rounded-full shadow-[inset_0_-10px_20px_rgb(0_0_0/0.25)] sm:size-20"
									style={{ background: familyColor[family.id] }}
								/>
								<span className="text-center text-sm font-semibold">
									{family.label}
								</span>
							</SiteLink>
						</li>
					))}
				</ul>
			</section>

			<section
				aria-labelledby="novedades"
				className="mx-auto mt-24 max-w-7xl px-4 sm:px-8"
			>
				<div className="flex items-end justify-between gap-4">
					<h2
						id="novedades"
						className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl"
					>
						Llegadas este otoño
					</h2>
					<SiteLink
						to="tintas"
						className="font-semibold underline underline-offset-4"
					>
						Ver las doce
					</SiteLink>
				</div>
				<div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
					{newest.map((ink, i) => (
						<ProductCard key={ink.id} ink={ink} seed={i + 40} />
					))}
				</div>
			</section>

			<section
				aria-labelledby="asi-escribe"
				className="mx-auto mt-28 max-w-7xl px-4 sm:px-8"
			>
				<h2
					id="asi-escribe"
					className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl"
				>
					Así escribe cada una
				</h2>
				<div className="mt-10 grid gap-5 md:grid-cols-3">
					{newest.slice(0, 3).map((ink) => (
						<SiteLink
							key={ink.id}
							to={`tintas/${ink.id}`}
							className="block rounded-2xl p-6"
							style={{ background: mix(ink.color, "#ffffff", 0.92) }}
						>
							<p
								className="ruled font-hand text-[2.1rem]"
								style={{ color: ink.color }}
							>
								Querida Elena, te escribo con {ink.name}.
							</p>
							<p className="mt-4 font-bold">{ink.name}</p>
							<p className="text-sm text-(--ink-soft)">
								Plumín medio sobre papel de 90 g
							</p>
						</SiteLink>
					))}
				</div>
			</section>

			<section
				id="muestras"
				className="mx-auto mt-28 max-w-7xl scroll-mt-28 px-4 sm:px-8"
			>
				<div className="grid gap-10 overflow-hidden rounded-3xl bg-(--ink) p-8 text-white sm:p-12 md:grid-cols-[1.2fr_1fr] md:items-center">
					<div>
						<h2 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
							¿No te decides?
						</h2>
						<p className="mt-4 max-w-[46ch] text-lg text-white/85">
							{sampleBox.note} Si luego compras un frasco, te descontamos la
							caja.
						</p>
						<p className="mt-3 text-2xl font-bold">
							{formatPrice(sampleBox.price)}
						</p>
						<div className="mt-6 rounded-2xl bg-white p-4 text-(--ink)">
							<AddToCart
								id={sampleBox.id}
								label="Añadir la caja"
								unit={["caja", "cajas"]}
							/>
						</div>
					</div>
					<div
						aria-hidden="true"
						className="flex h-56 items-end justify-center gap-3"
					>
						{[
							"azul-real",
							"granada",
							"musgo-de-ordesa",
							"tabaco",
							"ciruela",
						].map((id, i) => {
							const ink = findInk(id);
							return ink ? (
								<div
									key={id}
									className="relative h-full w-12 rounded-t-full rounded-b-lg bg-white/15 p-1.5"
								>
									<div
										className="absolute inset-x-1.5 bottom-1.5 rounded-t-full rounded-b-md"
										style={{ background: ink.color, height: `${55 + i * 7}%` }}
									/>
								</div>
							) : null;
						})}
					</div>
				</div>
			</section>

			<section
				id="visitanos"
				aria-labelledby="visitanos-titulo"
				className="mx-auto mt-28 max-w-7xl scroll-mt-28 px-4 sm:px-8"
			>
				<div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
					<h2
						id="visitanos-titulo"
						className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl"
					>
						Ven a probarlas
					</h2>
					<p className="text-lg text-(--ink-soft)">
						Cada tinta tiene un frasco abierto para que la pruebes.
					</p>
				</div>
				<div className="mt-10">
					<ShopMap />
				</div>
			</section>
		</main>
	);
}
