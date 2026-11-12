import "maplibre-gl/dist/maplibre-gl.css";
import { Disclosure, ToggleButton } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { BookmarkIcon, PhoneIcon, RouteIcon, StarIcon } from "./icons";
import { LogoMark } from "./logo";

/** Calle del Ave María, Lavapiés (approximate: the shop is invented). */
const SHOP: [number, number] = [-3.7006, 40.4098];
const STYLE = "https://tiles.openfreemap.org/styles/positron";

const hours = [
	["Lunes", "Cerrado"],
	["Martes a viernes", "11:00–14:00 y 17:00–20:30"],
	["Sábado", "11:00–14:30"],
	["Domingo", "Cerrado"],
];

function pinElement(): HTMLElement {
	const pin = document.createElement("div");
	pin.setAttribute("aria-hidden", "true");
	pin.innerHTML = `
		<svg width="44" height="54" viewBox="0 0 44 54">
			<path d="M22 53C22 53 4 33.5 4 21a18 18 0 0 1 36 0c0 12.5-18 32-18 32Z" fill="#172058" />
			<path d="M15 12h14l1 5.2c.4 2-.3 4-1.6 5.5L22 30l-6.4-7.3c-1.3-1.5-2-3.5-1.6-5.5Z" fill="#fff"/>
			<path d="M22 15.5c1.2 1.4 1.7 2.4 1.7 3.2a1.7 1.7 0 0 1-3.4 0c0-.8.5-1.8 1.7-3.2Z" fill="#172058"/>
		</svg>`;
	return pin;
}

function useMap(container: React.RefObject<HTMLDivElement | null>) {
	const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");

	useEffect(() => {
		const element = container.current;
		if (!element) return;
		let cancelled = false;
		let map: import("maplibre-gl").Map | undefined;

		// The map library is ~800 kB: load it only when the section comes near the viewport.
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (!entry?.isIntersecting) return;
				observer.disconnect();
				try {
					const maplibre = await import("maplibre-gl");
					if (cancelled) return;
					map = new maplibre.Map({
						container: element,
						style: STYLE,
						center: SHOP,
						zoom: 15.6,
						cooperativeGestures: true,
						attributionControl: { compact: true },
					});
					map.addControl(
						new maplibre.NavigationControl({ showCompass: false }),
						"bottom-right",
					);
					new maplibre.Marker({ element: pinElement(), anchor: "bottom" })
						.setLngLat(SHOP)
						.addTo(map);
					map.once("load", () => setStatus("ready"));
					map.once("error", () =>
						setStatus((s) => (s === "ready" ? s : "error")),
					);
				} catch {
					setStatus("error");
				}
			},
			{ rootMargin: "300px" },
		);
		observer.observe(element);

		return () => {
			cancelled = true;
			observer.disconnect();
			map?.remove();
		};
	}, [container]);

	return status;
}

export function ShopMap() {
	const container = useRef<HTMLDivElement>(null);
	const status = useMap(container);

	return (
		<div className="relative overflow-hidden rounded-3xl border border-(--rule) bg-(--wash)">
			<div ref={container} className="h-[28rem] w-full sm:h-[34rem]" />
			{status !== "ready" && (
				<p className="absolute inset-0 grid place-items-center text-(--ink-soft)">
					{status === "error"
						? "No se ha podido cargar el mapa. La dirección está en la ficha."
						: "Cargando el mapa…"}
				</p>
			)}

			<PlaceCard />
		</div>
	);
}

/** The shop's place card, laid out like the one map apps show. */
function PlaceCard() {
	return (
		<section
			aria-label="Ficha de la tienda"
			className="relative m-3 rounded-2xl bg-white p-5 shadow-[0_12px_40px_-12px_rgb(23_32_88/0.35)] sm:absolute sm:top-4 sm:left-4 sm:m-0 sm:w-[22rem]"
		>
			<div className="flex items-start gap-3">
				<span className="grid size-11 shrink-0 place-items-center rounded-xl bg-(--ink) text-white">
					<LogoMark className="size-7" cutout="var(--ink)" />
				</span>
				<div>
					<h3 className="text-xl leading-tight font-extrabold">Plumín</h3>
					<p className="text-sm text-(--ink-soft)">Tienda de plumas y tintas</p>
				</div>
			</div>

			<p className="mt-3 flex items-center gap-1.5 text-sm">
				<span className="font-bold">4,8</span>
				<span className="flex text-[#e3a008]" aria-hidden="true">
					{[1, 2, 3, 4, 5].map((n) => (
						<StarIcon key={n} />
					))}
				</span>
				<span className="text-(--ink-soft)">(312 reseñas)</span>
				<span className="sr-only">4,8 de 5 estrellas</span>
			</p>
			<p className="mt-1 text-sm">
				<span className="font-bold text-[#137333]">Abierto</span>, cierra a las
				20:30
			</p>
			<p className="mt-1 text-sm text-(--ink-soft)">
				Calle del Ave María 31, 28012 Madrid
			</p>

			<div className="mt-4 flex flex-wrap gap-2">
				<a
					href={`https://www.openstreetmap.org/directions?to=${SHOP[1]}%2C${SHOP[0]}`}
					target="_blank"
					rel="noreferrer"
					className="button button--primary button--sm"
				>
					<RouteIcon />
					Cómo llegar
				</a>
				<a
					href="tel:+34910000000"
					className="button button--secondary button--sm"
				>
					<PhoneIcon />
					Llamar
				</a>
				<ToggleButton size="sm" aria-label="Guardar la tienda">
					{({ isSelected }) => (
						<>
							<BookmarkIcon
								className={`size-4 ${isSelected ? "fill-current" : ""}`}
							/>
							{isSelected ? "Guardada" : "Guardar"}
						</>
					)}
				</ToggleButton>
			</div>

			<Disclosure className="mt-4 border-t border-(--rule) pt-3">
				<Disclosure.Heading>
					<Disclosure.Trigger className="flex w-full items-center justify-between text-sm font-bold">
						Horario
						<Disclosure.Indicator />
					</Disclosure.Trigger>
				</Disclosure.Heading>
				<Disclosure.Content>
					<Disclosure.Body>
						<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 pt-2 text-sm">
							{hours.map(([day, time]) => (
								<div key={day} className="contents">
									<dt className="font-medium">{day}</dt>
									<dd className="text-(--ink-soft)">{time}</dd>
								</div>
							))}
						</dl>
					</Disclosure.Body>
				</Disclosure.Content>
			</Disclosure>
		</section>
	);
}
