import { Toast } from "@heroui/react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "./header";
import { Logo } from "./logo";
import { SiteLink } from "./site-link";

/** Scrolls to #anchors (e.g. «Visítanos») after navigating to them. */
function useHashScroll() {
	const { hash } = useLocation();
	useEffect(() => {
		if (!hash) return;
		let cancelled = false;
		// Wait for web fonts: they change line heights and would leave the scroll short.
		document.fonts.ready.then(() => {
			// One frame later, so the router's own scroll handling has finished first.
			requestAnimationFrame(() => {
				if (cancelled) return;
				document
					.getElementById(hash.slice(1))
					?.scrollIntoView({ block: "start" });
			});
		});
		return () => {
			cancelled = true;
		};
	}, [hash]);
}

export function Layout() {
	useHashScroll();
	return (
		<div className="plumin">
			<Header />
			<Outlet />
			<footer className="mt-32 bg-(--wash)">
				<div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
					<div>
						<Logo />
						<p className="mt-4 max-w-[36ch] text-(--ink-soft)">
							Tintas para pluma de tres talleres pequeños. Calle del Ave María
							31, Madrid.
						</p>
					</div>
					<nav aria-label="Tienda" className="flex flex-col gap-2">
						<p className="font-bold">Tienda</p>
						<SiteLink to="tintas" className="hover:underline">
							Todas las tintas
						</SiteLink>
						<SiteLink to="#muestras" className="hover:underline">
							Caja de muestras
						</SiteLink>
						<SiteLink to="carrito" className="hover:underline">
							Carrito
						</SiteLink>
					</nav>
					<nav aria-label="Plumín" className="flex flex-col gap-2">
						<p className="font-bold">Plumín</p>
						<SiteLink to="taller" className="hover:underline">
							El taller
						</SiteLink>
						<SiteLink to="#visitanos" className="hover:underline">
							Cómo llegar
						</SiteLink>
					</nav>
				</div>
				<p className="mx-auto max-w-7xl border-t border-(--rule) px-4 py-6 text-sm text-(--ink-soft) sm:px-8">
					Tienda inventada para practicar interfaces: no se vende nada.
				</p>
			</footer>
			<Toast.Provider placement="bottom end" />
		</div>
	);
}
