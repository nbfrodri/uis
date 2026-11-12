import { useParams } from "react-router";
import { AddToCart } from "../components/add-to-cart";
import { Level } from "../components/level";
import { SiteLink } from "../components/site-link";
import { Swatch } from "../components/swatch";
import { findInk, formatPrice, inks } from "../data";
import { Missing } from "./missing";

export function InkPage() {
	const { id = "" } = useParams();
	const ink = findInk(id);
	if (!ink) return <Missing />;

	const related = inks.filter(
		(other) => other.family === ink.family && other.id !== ink.id,
	);

	return (
		<main className="mx-auto max-w-6xl px-4 pt-10 sm:px-8">
			<SiteLink
				to="tintas"
				className="text-sm text-(--ink-soft) underline underline-offset-4"
			>
				Todas las tintas
			</SiteLink>

			<div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
				<div className="md:sticky md:top-24 md:self-start">
					<Swatch
						color={ink.color}
						sheen={ink.sheen}
						seed={7}
						className="aspect-[3/4] w-full"
					/>
				</div>

				<div>
					<p className="text-(--ink-soft)">{ink.maker}</p>
					<h1 className="font-display mt-1 text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] font-medium tracking-[-0.015em]">
						{ink.name}
					</h1>
					<p className="mt-4 text-2xl">
						{formatPrice(ink.price)}{" "}
						<span className="text-base text-(--ink-soft)">
							el frasco de 50 ml
						</span>
					</p>
					<p className="mt-6 max-w-[52ch] text-lg">{ink.note}</p>

					<div className="mt-8">
						<AddToCart id={ink.id} />
					</div>

					<figure className="mt-10">
						<div className="lined rounded-lg border border-(--rule) bg-white px-6 py-4">
							<p className="font-hand text-[2rem]" style={{ color: ink.color }}>
								El veloz murciélago hindú comía feliz cardillo y kiwi. La
								cigüeña tocaba el saxofón detrás del palenque de paja.
							</p>
						</div>
						<figcaption className="mt-2 text-sm text-(--ink-soft)">
							Prueba de escritura con plumín medio sobre papel de 90 g.
						</figcaption>
					</figure>

					<dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-(--rule) pt-6">
						<div>
							<dt className="text-sm text-(--ink-soft)">Sombreado</dt>
							<dd className="mt-1">
								<Level value={ink.shading} />
							</dd>
						</div>
						<div>
							<dt className="text-sm text-(--ink-soft)">Tiempo de secado</dt>
							<dd className="mt-1">
								<Level value={ink.drying} />
							</dd>
						</div>
						<div>
							<dt className="text-sm text-(--ink-soft)">Resistente al agua</dt>
							<dd className="mt-1">{ink.waterproof ? "Sí" : "No"}</dd>
						</div>
						<div>
							<dt className="text-sm text-(--ink-soft)">
								Brillo en los charcos
							</dt>
							<dd className="mt-1 flex items-center gap-2">
								{ink.sheen ? (
									<>
										<span
											className="size-3 rounded-full"
											style={{ background: ink.sheen }}
											aria-hidden="true"
										/>
										Sí
									</>
								) : (
									"No"
								)}
							</dd>
						</div>
					</dl>
				</div>
			</div>

			{related.length > 0 && (
				<section className="mt-24">
					<h2 className="font-display text-4xl font-medium">Del mismo color</h2>
					<ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
						{related.map((other, i) => (
							<li key={other.id}>
								<SiteLink to={`tintas/${other.id}`} className="block">
									<Swatch
										color={other.color}
										sheen={other.sheen}
										seed={i + 21}
										className="lift aspect-[4/3] w-full"
									/>
									<p className="mt-3 font-semibold">{other.name}</p>
									<p className="text-sm text-(--ink-soft)">
										{formatPrice(other.price)}
									</p>
								</SiteLink>
							</li>
						))}
					</ul>
				</section>
			)}
		</main>
	);
}
