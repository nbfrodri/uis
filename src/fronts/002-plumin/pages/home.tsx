import { AddToCart } from "../components/add-to-cart";
import { SiteLink } from "../components/site-link";
import { Swatch } from "../components/swatch";
import { findInk, formatPrice, inks, sampleBox } from "../data";

const featured = ["mar-de-bizkaia", "granada", "musgo-de-ordesa"].flatMap(
	(id) => findInk(id) ?? [],
);

export function Home() {
	return (
		<main>
			<section className="mx-auto max-w-6xl px-4 pt-14 sm:px-8 sm:pt-20">
				<h1 className="font-display max-w-[12ch] text-[clamp(3.25rem,10vw,8.5rem)] leading-[0.92] font-medium tracking-[-0.02em]">
					Tinta para escribir a mano.
				</h1>
				<div className="mt-8 flex flex-wrap items-end justify-between gap-6">
					<p className="max-w-[44ch] text-lg text-(--ink-soft)">
						Doce tintas de tres talleres pequeños. Las probamos en papel antes
						de traerlas, y aquí ves cómo quedan.
					</p>
					<SiteLink
						to="tintas"
						className="rounded-md bg-(--ink) px-6 py-3 font-semibold text-(--paper)"
					>
						Ver las doce tintas
					</SiteLink>
				</div>
			</section>

			{/* The shelf: one swab per ink, labelled like book spines. */}
			<section aria-label="Estantería de tintas" className="mt-14">
				<ul className="mx-auto flex max-w-6xl snap-x gap-2 overflow-x-auto px-4 pb-4 sm:px-8 lg:overflow-visible">
					{inks.map((ink, i) => (
						<li
							key={ink.id}
							className="w-20 shrink-0 snap-start lg:w-auto lg:flex-1"
						>
							<SiteLink to={`tintas/${ink.id}`} className="block">
								<Swatch
									color={ink.color}
									sheen={ink.sheen}
									seed={i + 3}
									className="lift h-56 w-full sm:h-72"
								/>
								<span className="spine mx-auto mt-3 block w-fit text-sm leading-tight">
									{ink.name}
								</span>
							</SiteLink>
						</li>
					))}
				</ul>
			</section>

			<section className="mx-auto mt-20 max-w-6xl px-4 sm:px-8">
				<h2 className="font-display text-4xl font-medium sm:text-5xl">
					Esta semana en el mostrador
				</h2>
				<ul className="mt-10 grid gap-10 md:grid-cols-3">
					{featured.map((ink) => (
						<li key={ink.id} className="border-t border-(--rule) pt-6">
							<p
								className="font-hand text-4xl leading-tight"
								style={{ color: ink.color }}
							>
								Querida Elena, te escribo con {ink.name}.
							</p>
							<p className="mt-5 font-semibold">{ink.name}</p>
							<p className="text-(--ink-soft)">{ink.note}</p>
							<p className="mt-3 flex items-baseline justify-between">
								<span>{formatPrice(ink.price)} el frasco</span>
								<SiteLink
									to={`tintas/${ink.id}`}
									className="underline underline-offset-4"
								>
									Ver la tinta
								</SiteLink>
							</p>
						</li>
					))}
				</ul>
			</section>

			<section className="mx-auto mt-20 max-w-6xl px-4 sm:px-8">
				<div className="grid gap-8 rounded-2xl bg-(--wash) p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-end">
					<div>
						<h2 className="font-display text-4xl font-medium">
							¿No te decides?
						</h2>
						<p className="mt-3 max-w-[48ch] text-lg">
							{sampleBox.note} Si luego compras un frasco, te descontamos la
							caja.
						</p>
						<p className="mt-2 text-(--ink-soft)">
							{formatPrice(sampleBox.price)}
						</p>
					</div>
					<AddToCart
						id={sampleBox.id}
						label="Añadir la caja"
						unit={["caja", "cajas"]}
					/>
				</div>
			</section>

			<section className="mx-auto mt-20 grid max-w-6xl gap-8 px-4 sm:px-8 md:grid-cols-2">
				<h2 className="font-display text-4xl font-medium sm:text-5xl">
					Ven a probarlas
				</h2>
				<div className="text-lg">
					<p>
						En la tienda hay un frasco abierto de cada tinta y plumas para
						mojar. Trae tu cuaderno si quieres ver cómo se comportan en tu
						papel.
					</p>
					<p className="mt-4 text-(--ink-soft)">
						Calle del Ave María 31, Madrid. De martes a sábado, de 11:00 a 14:00
						y de 17:00 a 20:30.
					</p>
					<SiteLink
						to="taller"
						className="mt-4 inline-block underline underline-offset-4"
					>
						Talleres de caligrafía
					</SiteLink>
				</div>
			</section>
		</main>
	);
}
