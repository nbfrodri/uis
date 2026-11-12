import {
	ComboBox,
	Description,
	FieldError,
	Input,
	Label,
	ListBox,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
	type Place,
	type PlaceKind,
	parsePhoton,
	photonUrl,
	rankCities,
} from "../places";

const DEBOUNCE_MS = 300;
const MIN_CHARACTERS = 3;
const PHOTON_TIMEOUT_MS = 5000;

type Status = "idle" | "loading" | "error";

/** Photon suggestions for `query`, debounced, with stale requests cancelled. */
export function usePlaceSuggestions(
	query: string,
	kind: PlaceKind,
	nearCity?: string,
) {
	const [places, setPlaces] = useState<Place[]>([]);
	const [status, setStatus] = useState<Status>("idle");

	useEffect(() => {
		const text = query.trim();
		if (text.length < MIN_CHARACTERS) {
			setPlaces([]);
			setStatus("idle");
			return;
		}
		const controller = new AbortController();
		const timer = window.setTimeout(async () => {
			setStatus("loading");
			try {
				// The public Photon server is sometimes slow: give up after a few seconds.
				const signal = AbortSignal.any([
					controller.signal,
					AbortSignal.timeout(PHOTON_TIMEOUT_MS),
				]);
				const response = await fetch(photonUrl(text, kind, nearCity), {
					signal,
				});
				if (!response.ok) throw new Error(`Photon ${response.status}`);
				setPlaces(parsePhoton(await response.json()));
				setStatus("idle");
			} catch (error) {
				if (controller.signal.aborted) return;
				console.warn("No se pudieron cargar sugerencias", error);
				setPlaces([]);
				setStatus("error");
			}
		}, DEBOUNCE_MS);
		return () => {
			window.clearTimeout(timer);
			controller.abort();
		};
	}, [query, kind, nearCity]);

	return { places, status };
}

type CityModule = typeof import("spanish-cities-info");

/**
 * City suggestions from the INE list of Spanish municipalities, bundled with the app:
 * instant and offline. The list (~125 kB gzip) loads the first time it is needed.
 */
export function useCitySuggestions(query: string) {
	const [cities, setCities] = useState<ReturnType<
		CityModule["getAllCities"]
	> | null>(null);
	useEffect(() => {
		let cancelled = false;
		import("spanish-cities-info").then((module) => {
			if (!cancelled) setCities(module.getAllCities());
		});
		return () => {
			cancelled = true;
		};
	}, []);
	return {
		places: cities ? rankCities(cities, query) : [],
		loading: cities === null,
	};
}

/** The postal code of a municipality, when it has only one. */
export async function singlePostalCode(
	ineCode: string,
): Promise<string | undefined> {
	const { getPostalCodes } = await import("spanish-cities-info/postal-codes");
	const codes = getPostalCodes(ineCode);
	return codes.length === 1 ? codes[0] : undefined;
}

type Item = { id: string; label: string; detail?: string };

type SuggestFieldProps<T extends Item> = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	items: T[];
	onPick: (item: T) => void;
	error?: string;
	description?: string;
	placeholder?: string;
	autoComplete?: string;
	emptyText: string;
	className?: string;
};

/**
 * A text field that suggests as you type. Any text is accepted (this is a practice checkout):
 * picking a suggestion just fills the field, and maybe others, for you.
 */
export function SuggestField<T extends Item>({
	label,
	value,
	onChange,
	items,
	onPick,
	error,
	description,
	placeholder,
	autoComplete,
	emptyText,
	className,
}: SuggestFieldProps<T>) {
	// Remember the picked suggestion so filling the field with its name doesn't reopen the list.
	const [picked, setPicked] = useState<T | null>(null);
	// Keep the picked item in the collection: React Aria matches the selection against it.
	const collection =
		picked && !items.some((item) => item.id === picked.id)
			? [picked, ...items]
			: items;

	return (
		<ComboBox
			className={className}
			inputValue={value}
			onInputChange={(text) => {
				if (picked && text !== picked.label) setPicked(null);
				onChange(text);
			}}
			items={collection}
			allowsCustomValue
			allowsEmptyCollection
			menuTrigger="input"
			selectedKey={picked?.id ?? null}
			isInvalid={Boolean(error)}
			isRequired
			validationBehavior="aria"
			onSelectionChange={(key) => {
				const item = collection.find((candidate) => candidate.id === key);
				if (!item) return;
				setPicked(item);
				onPick(item);
			}}
		>
			<Label className="font-semibold">{label}</Label>
			<ComboBox.InputGroup>
				<Input
					placeholder={placeholder}
					autoComplete={autoComplete}
					className="h-12"
				/>
				<ComboBox.Trigger
					aria-label={`Ver sugerencias de ${label.toLowerCase()}`}
				/>
			</ComboBox.InputGroup>
			{description && <Description>{description}</Description>}
			<FieldError>{error}</FieldError>
			<ComboBox.Popover>
				<ListBox
					renderEmptyState={() => (
						<p className="px-3 py-2 text-sm text-(--ink-soft)">{emptyText}</p>
					)}
				>
					{(item: T) => (
						<ListBox.Item id={item.id} textValue={item.label}>
							<span className="flex flex-col">
								<span className="font-semibold">{item.label}</span>
								{item.detail && (
									<span className="text-sm text-(--ink-soft)">
										{item.detail}
									</span>
								)}
							</span>
						</ListBox.Item>
					)}
				</ListBox>
			</ComboBox.Popover>
		</ComboBox>
	);
}

/** What the suggestion list says when it has nothing to show. */
export function emptyPlaceText(
	query: string,
	status: Status,
	what: string,
): string {
	if (query.trim().length < MIN_CHARACTERS)
		return `Escribe al menos ${MIN_CHARACTERS} letras para ver ${what}.`;
	if (status === "loading") return "Buscando…";
	if (status === "error")
		return "No se pueden cargar sugerencias ahora. Escríbela a mano.";
	return "Sin sugerencias. Puedes escribirla a mano.";
}
