import { CloseButton, ComboBox, Input, ListBox } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { queryInks } from "../catalog";
import { formatPrice, inks } from "../data";
import { useSitePath } from "./site-link";

const MAX_SUGGESTIONS = 6;

function SearchIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			className="size-4"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="6.5" />
			<path d="m16 16 4 4" strokeLinecap="round" />
		</svg>
	);
}

/**
 * Header search: suggestions while typing (pick one to open it),
 * Enter with nothing highlighted to see every match in the catalogue.
 */
export function InkSearch({
	onDone,
	className,
	variant = "outlined",
}: {
	onDone?: () => void;
	className?: string;
	/** "filled" drops the border so the field sits inside another outline (the header pill). */
	variant?: "outlined" | "filled";
}) {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();
	const sitePath = useSitePath();
	const trimmed = query.trim();
	const suggestions = trimmed
		? queryInks(inks, { q: trimmed }).slice(0, MAX_SUGGESTIONS)
		: [];

	const finish = (path: string) => {
		navigate(sitePath(path));
		setQuery("");
		onDone?.();
	};

	return (
		<ComboBox
			aria-label="Buscar tintas"
			className={className}
			inputValue={query}
			onInputChange={setQuery}
			items={suggestions}
			allowsCustomValue
			allowsEmptyCollection
			menuTrigger="input"
			selectedKey={null}
			onSelectionChange={(key) => {
				if (key != null) finish(`tintas/${key}`);
			}}
		>
			<ComboBox.InputGroup className="relative flex items-center">
				<span className="pointer-events-none absolute left-2.5 z-10 text-(--ink-soft)">
					<SearchIcon />
				</span>
				<Input
					placeholder="Buscar tintas"
					className={`h-8 w-full rounded-full pr-8 pl-8 text-sm ${variant === "filled" ? "border-transparent! bg-(--wash)! shadow-none!" : ""}`}
					onKeyDown={(event) => {
						// No suggestion highlighted: Enter searches the whole catalogue.
						if (
							event.key === "Enter" &&
							trimmed &&
							!event.currentTarget.getAttribute("aria-activedescendant")
						) {
							finish(`tintas?q=${encodeURIComponent(trimmed)}`);
						}
					}}
				/>
				{query && (
					<CloseButton
						slot={null}
						aria-label="Borrar búsqueda"
						onPress={() => setQuery("")}
						className="absolute! right-1 z-10 size-6!"
					/>
				)}
				{/* Suggestions open as you type; the trigger stays for the combobox contract but is not shown. */}
				<ComboBox.Trigger aria-label="Ver sugerencias" className="sr-only" />
			</ComboBox.InputGroup>
			<ComboBox.Popover className="min-w-72">
				<ListBox
					renderEmptyState={() => (
						<p className="px-3 py-2 text-sm text-(--ink-soft)">
							{trimmed
								? `Ninguna tinta coincide con «${trimmed}».`
								: "Escribe un nombre o un color."}
						</p>
					)}
				>
					{(ink: (typeof inks)[number]) => (
						<ListBox.Item id={ink.id} textValue={ink.name}>
							<span className="flex w-full items-center gap-3">
								<span
									className="size-5 shrink-0 rounded-full"
									style={{ background: ink.color }}
									aria-hidden="true"
								/>
								<span className="flex-1 font-semibold">{ink.name}</span>
								<span className="text-sm text-(--ink-soft)">
									{formatPrice(ink.price)}
								</span>
							</span>
						</ListBox.Item>
					)}
				</ListBox>
			</ComboBox.Popover>
		</ComboBox>
	);
}
