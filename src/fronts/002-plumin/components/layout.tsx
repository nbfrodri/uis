import { Outlet } from "react-router";
import { useCart } from "../cart-context";
import { SiteLink, SiteNavLink } from "./site-link";

const navClass = ({ isActive }: { isActive: boolean }) =>
	`py-2 underline-offset-[6px] decoration-1 hover:underline ${isActive ? "underline" : ""}`;

export function Layout() {
	const { totals } = useCart();
	return (
		<div className="plumin">
			<header className="sticky top-0 z-10 border-b border-(--rule) bg-(--paper)/95 backdrop-blur-sm">
				<div className="mx-auto flex max-w-6xl items-baseline justify-between gap-4 px-4 py-3 sm:px-8">
					<SiteLink
						to=""
						className="font-display text-3xl italic leading-none font-semibold"
					>
						Plumín
					</SiteLink>
					<nav
						aria-label="Principal"
						className="flex items-baseline gap-5 text-base sm:gap-8"
					>
						<SiteNavLink to="tintas" className={navClass}>
							Tintas
						</SiteNavLink>
						<SiteNavLink to="taller" className={navClass}>
							Taller
						</SiteNavLink>
						<SiteNavLink to="carrito" className={navClass}>
							Carrito
							{totals.count > 0 && <span> ({totals.count})</span>}
						</SiteNavLink>
					</nav>
				</div>
			</header>
			<Outlet />
			<footer className="mt-24 border-t border-(--rule)">
				<div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-4 py-8 text-sm text-(--ink-soft) sm:px-8">
					<p>Plumín, tintas para pluma. Calle del Ave María 31, Madrid.</p>
					<p>Tienda inventada para practicar interfaces: no se vende nada.</p>
				</div>
			</footer>
		</div>
	);
}
