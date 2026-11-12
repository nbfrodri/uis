import { HeroWriting } from "../components/hero-writing";
import { ProductCard } from "../components/product-card";
import { SampleBoxOffer } from "../components/sample-box-offer";
import { ShopMap } from "../components/shop-map";
import { SiteLink } from "../components/site-link";
import { families, findInk, inks, mix } from "../data";

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
			<HeroWriting />

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
				<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
					<h2
						id="novedades"
						className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl"
					>
						Llegadas este otoño
					</h2>
					<SiteLink to="tintas" className="button button--primary shrink-0">
						Ver el catálogo
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
						</SiteLink>
					))}
				</div>
			</section>

			<SampleBoxOffer />

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
