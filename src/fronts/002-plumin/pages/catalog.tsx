import { Label, ListBox, Select } from "@heroui/react";
import { useSearchParams } from "react-router";
import { queryInks, sortOptions } from "../catalog";
import { ProductCard } from "../components/product-card";
import { SiteLink } from "../components/site-link";
import { families, inks } from "../data";

export function Catalog() {
	const [params, setParams] = useSearchParams();
	const family = params.get("familia");
	const q = params.get("q");
	const sort = params.get("orden") ?? "destacadas";
	const visible = queryInks(inks, { family, q, sort });

	const hrefWith = (key: string, value: string | null) => {
		const next = new URLSearchParams(params);
		if (value) next.set(key, value);
		else next.delete(key);
		const query = next.toString();
		return query ? `tintas?${query}` : "tintas";
	};

	const chip = (active: boolean) =>
		`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? "bg-(--ink) text-white" : "bg-(--wash) hover:bg-(--rule)"}`;

	return (
		<main className="mx-auto max-w-7xl px-4 pt-10 sm:px-8">
			<h1 className="text-5xl font-extrabold tracking-[-0.04em] sm:text-7xl">
				Tintas
			</h1>
			<p className="mt-3 max-w-[52ch] text-lg text-(--ink-soft)">
				Frascos de 50 ml. Cada muestra es una pasada de bastoncillo sobre papel
				blanco.
			</p>

			<div className="mt-8 flex flex-wrap items-end justify-between gap-4">
				<nav aria-label="Filtrar por color" className="flex flex-wrap gap-2">
					<SiteLink
						to={hrefWith("familia", null)}
						className={chip(!family)}
						aria-current={family ? undefined : "true"}
					>
						Todas
					</SiteLink>
					{families.map((f) => (
						<SiteLink
							key={f.id}
							to={hrefWith("familia", f.id)}
							className={chip(family === f.id)}
							aria-current={family === f.id ? "true" : undefined}
						>
							{f.label}
						</SiteLink>
					))}
				</nav>

				<Select
					className="w-64"
					value={sort}
					onChange={(key) => {
						const next = new URLSearchParams(params);
						next.set("orden", String(key));
						setParams(next, { replace: true });
					}}
				>
					<Label className="text-sm font-medium text-(--ink-soft)">
						Ordenar por
					</Label>
					<Select.Trigger>
						<Select.Value />
						<Select.Indicator />
					</Select.Trigger>
					<Select.Popover>
						<ListBox>
							{sortOptions.map((option) => (
								<ListBox.Item
									key={option.id}
									id={option.id}
									textValue={option.label}
								>
									{option.label}
									<ListBox.ItemIndicator />
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>
			</div>

			{q && (
				<p className="mt-6">
					Resultados para «{q}».{" "}
					<SiteLink
						to={hrefWith("q", null)}
						className="font-semibold underline underline-offset-4"
					>
						Quitar la búsqueda
					</SiteLink>
				</p>
			)}

			{visible.length === 0 ? (
				<div className="mt-12 rounded-2xl bg-(--wash) p-8">
					<p className="text-lg font-semibold">No hay tintas que coincidan.</p>
					<SiteLink
						to="tintas"
						className="mt-2 inline-block underline underline-offset-4"
					>
						Ver las doce tintas
					</SiteLink>
				</div>
			) : (
				<div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
					{visible.map((ink, i) => (
						<ProductCard key={ink.id} ink={ink} seed={i + 11} />
					))}
				</div>
			)}
		</main>
	);
}
