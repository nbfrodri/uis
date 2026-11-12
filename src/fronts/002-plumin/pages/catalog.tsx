import { useSearchParams } from "react-router";
import { SiteLink } from "../components/site-link";
import { Swatch } from "../components/swatch";
import { families, formatPrice, inks } from "../data";

export function Catalog() {
	const [params] = useSearchParams();
	const family = params.get("familia");
	const visible = family ? inks.filter((ink) => ink.family === family) : inks;

	const chip = (active: boolean) =>
		`rounded-full border px-4 py-1.5 ${active ? "border-(--ink) bg-(--ink) text-(--paper)" : "border-(--rule) hover:border-(--ink)"}`;

	return (
		<main className="mx-auto max-w-6xl px-4 pt-12 sm:px-8">
			<h1 className="font-display text-6xl font-medium sm:text-7xl">Tintas</h1>
			<p className="mt-3 max-w-[50ch] text-lg text-(--ink-soft)">
				Frascos de 50 ml. La muestra pintada es real: así queda una pasada de
				bastoncillo sobre papel blanco.
			</p>

			<nav
				aria-label="Filtrar por color"
				className="mt-8 flex flex-wrap gap-2 text-sm"
			>
				<SiteLink
					to="tintas"
					className={chip(!family)}
					aria-current={family ? undefined : "true"}
				>
					Todas
				</SiteLink>
				{families.map((f) => (
					<SiteLink
						key={f.id}
						to={`tintas?familia=${f.id}`}
						className={chip(family === f.id)}
						aria-current={family === f.id ? "true" : undefined}
					>
						{f.label}
					</SiteLink>
				))}
			</nav>

			{visible.length === 0 ? (
				<p className="mt-12 text-lg">
					No hay tintas en ese color.{" "}
					<SiteLink to="tintas" className="underline underline-offset-4">
						Ver todas
					</SiteLink>
				</p>
			) : (
				<ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
					{visible.map((ink, i) => (
						<li key={ink.id}>
							<SiteLink to={`tintas/${ink.id}`} className="group block">
								<Swatch
									color={ink.color}
									sheen={ink.sheen}
									seed={i + 11}
									className="lift aspect-[3/4] w-full"
								/>
								<p className="mt-4 font-semibold group-hover:underline group-hover:underline-offset-4">
									{ink.name}
								</p>
								<p className="text-sm text-(--ink-soft)">{ink.maker}</p>
								<p className="mt-1">{formatPrice(ink.price)}</p>
							</SiteLink>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
