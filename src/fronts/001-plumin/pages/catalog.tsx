import { Label, ListBox, Select } from "@heroui/react";
import { useSearchParams } from "react-router";
import { queryInks, sortOptions } from "../catalog";
import { ShopBreadcrumbs } from "../components/breadcrumbs";
import { ProductCard } from "../components/product-card";
import { SiteLink } from "../components/site-link";
import { Swatch } from "../components/swatch";
import { type Family, families, inks, mix } from "../data";

const familyNotes: Record<Family, string> = {
	azules:
		"Del azul de los primeros cuadernos al petróleo del Cantábrico. Un clásico con muchos matices.",
	verdes:
		"Oliva, musgo y notas de campo. Verdes que cambian de tono con cada trazo.",
	rojos:
		"Granates con brillo dorado y naranjas tostados. Tintas para dejar algo más que una nota al margen.",
	marrones:
		"Tabaco y sepia para cartas, diarios y palabras que apetece guardar.",
	morados:
		"De la lavanda más suave a la ciruela profunda. Pequeños cambios de luz, grandes matices.",
	negros:
		"Negros de imprenta y grises de tormenta. El carácter está en los detalles.",
};

export function Catalog() {
	const [params, setParams] = useSearchParams();
	const family = params.get("familia");
	const q = params.get("q");
	const sort = params.get("orden") ?? "destacadas";
	const visible = queryInks(inks, { family, q, sort });
	const selectedFamily = families.find((item) => item.id === family);
	const palette = selectedFamily
		? inks.filter((ink) => ink.family === selectedFamily.id)
		: inks.filter((ink) =>
				["azul-real", "musgo-de-ordesa", "granada"].includes(ink.id),
			);
	const accent = palette[0]?.color ?? "#172058";

	const hrefWith = (key: string, value: string | null) => {
		const next = new URLSearchParams(params);
		if (value) next.set(key, value);
		else next.delete(key);
		const query = next.toString();
		return query ? `tintas?${query}` : "tintas";
	};

	return (
		<main className="mx-auto max-w-7xl px-4 pt-8 sm:px-8">
			<ShopBreadcrumbs
				color={accent}
				items={[
					{ label: "Inicio", to: "" },
					...(selectedFamily
						? [
								{ label: "Tintas", to: "tintas" },
								{ label: selectedFamily.label },
							]
						: [{ label: "Tintas" }]),
				]}
			/>
			<header
				className="catalog-intro"
				style={{ backgroundColor: mix(accent, "#ffffff", 0.94) }}
			>
				<div className="catalog-intro-copy">
					<h1 className="text-5xl font-extrabold tracking-[-0.045em] sm:text-7xl">
						{selectedFamily?.label ?? "Tintas"}
					</h1>
					<p className="mt-5 max-w-[43ch] text-base text-(--ink-soft) sm:text-lg">
						{selectedFamily
							? familyNotes[selectedFamily.id]
							: "Doce tintas, tres pequeños talleres y un color para cada forma de escribir. Encuentra el tuyo."}
					</p>
					<p className="mt-6 text-sm font-semibold">
						Para pluma estilográfica · Frascos de 50 ml
					</p>
				</div>
				<div className="catalog-palette" aria-hidden="true">
					{palette.map((ink, index) => (
						<div key={ink.id} className="catalog-palette-sample">
							<Swatch
								color={ink.color}
								sheen={ink.sheen}
								seed={index + 31}
								className="h-36 w-16 sm:h-44 sm:w-20"
							/>
							<span className="font-hand text-xl" style={{ color: ink.color }}>
								{ink.name}
							</span>
						</div>
					))}
				</div>
			</header>

			<nav aria-label="Filtrar por color" className="mt-8 flex flex-wrap gap-2">
				<SiteLink
					to={hrefWith("familia", null)}
					className="catalog-family"
					aria-current={family ? undefined : "true"}
				>
					<span className="catalog-all-colors" aria-hidden="true" />
					Todas
				</SiteLink>
				{families.map((f) => (
					<SiteLink
						key={f.id}
						to={hrefWith("familia", f.id)}
						className="catalog-family"
						aria-current={family === f.id ? "true" : undefined}
					>
						<span
							className="size-3 shrink-0 rounded-full"
							style={{
								backgroundColor: inks.find((ink) => ink.family === f.id)?.color,
							}}
							aria-hidden="true"
						/>
						{f.label}
					</SiteLink>
				))}
			</nav>

			<div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b border-(--rule) pb-5">
				<output className="text-sm font-semibold">
					{visible.length} {visible.length === 1 ? "tinta" : "tintas"}
				</output>
				<Select
					className="w-full sm:w-64"
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
