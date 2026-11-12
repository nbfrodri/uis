import { Button, Drawer } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../cart-context";
import { formatPrice } from "../data";
import { CartLines } from "./cart-lines";
import { BagIcon, MenuIcon } from "./icons";
import { InkSearch } from "./ink-search";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { ShippingMeter } from "./shipping-meter";
import { SiteLink, useSitePath } from "./site-link";

const mobileLinks = [
	{ to: "tintas", label: "Tintas" },
	{ to: "#muestras", label: "Muestras" },
	{ to: "taller", label: "Taller" },
	{ to: "#visitanos", label: "Visítanos" },
];

function useScrolled(threshold = 8) {
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const update = () => setScrolled(window.scrollY > threshold);
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, [threshold]);
	return scrolled;
}

function MiniCart() {
	const { totals } = useCart();
	const [open, setOpen] = useState(false);
	const sitePath = useSitePath();
	const navigate = useNavigate();
	const go = (path: string) => {
		setOpen(false);
		navigate(sitePath(path));
	};

	return (
		<Drawer isOpen={open} onOpenChange={setOpen}>
			<span className="cart-anchor">
				<Button
					variant="ghost"
					isIconOnly
					className="cart-trigger"
					aria-label={`Carrito, ${totals.count} productos`}
					onPress={() => setOpen(true)}
				>
					<BagIcon className="size-5" />
				</Button>
				{totals.count > 0 && (
					<span className="cart-count" aria-hidden="true">
						{totals.count}
					</span>
				)}
			</span>
			<Drawer.Backdrop>
				<Drawer.Content placement="right" className="shop-drawer-viewport">
					<Drawer.Dialog className="shop-drawer">
						<Drawer.Header
							className={`flex-row items-center ${totals.count === 0 ? "justify-end" : "justify-between"}`}
						>
							{totals.count > 0 && (
								<Drawer.Heading className="text-2xl font-extrabold tracking-tight">
									Tu carrito
								</Drawer.Heading>
							)}
							<Drawer.CloseTrigger />
						</Drawer.Header>
						<Drawer.Body
							className={`flex-1 overflow-y-auto ${totals.count === 0 ? "grid place-items-center" : ""}`}
						>
							{totals.count === 0 ? (
								<div className="py-10 text-center">
									<Drawer.Heading className="text-2xl font-extrabold tracking-tight">
										Tu carrito
									</Drawer.Heading>
									<p className="mt-3 text-lg">
										Todavía no has elegido ninguna tinta.
									</p>
									<Button className="mt-4" onPress={() => go("tintas")}>
										Ver las tintas
									</Button>
								</div>
							) : (
								<>
									<ShippingMeter subtotal={totals.subtotal} />
									<CartLines compact />
								</>
							)}
						</Drawer.Body>
						{totals.count > 0 && (
							<Drawer.Footer className="flex-col items-stretch gap-3 border-t border-(--rule) pt-4">
								<p className="flex justify-between text-lg font-bold">
									<span>Subtotal</span>
									<span>{formatPrice(totals.subtotal)}</span>
								</p>
								<Button size="lg" fullWidth onPress={() => go("pago")}>
									Tramitar pedido
								</Button>
								<Button
									size="lg"
									variant="secondary"
									fullWidth
									onPress={() => go("carrito")}
								>
									Ver el carrito
								</Button>
							</Drawer.Footer>
						)}
					</Drawer.Dialog>
				</Drawer.Content>
			</Drawer.Backdrop>
		</Drawer>
	);
}

function MobileMenu() {
	const [open, setOpen] = useState(false);
	return (
		<Drawer isOpen={open} onOpenChange={setOpen}>
			<Button
				variant="ghost"
				isIconOnly
				aria-label="Abrir menú"
				className="size-8 min-w-8 lg:hidden"
				onPress={() => setOpen(true)}
			>
				<MenuIcon className="size-6" />
			</Button>
			<Drawer.Backdrop>
				<Drawer.Content placement="left" className="shop-drawer-viewport">
					<Drawer.Dialog className="shop-drawer">
						<Drawer.Header className="flex-row items-center justify-between">
							<Drawer.Heading>
								<Logo />
							</Drawer.Heading>
							<Drawer.CloseTrigger />
						</Drawer.Header>
						<Drawer.Body className="mobile-menu-body">
							<InkSearch className="w-full" onDone={() => setOpen(false)} />
							<nav aria-label="Menú" className="flex flex-col">
								{mobileLinks.map((link) => (
									<SiteLink
										key={link.label}
										to={link.to}
										onClick={() => setOpen(false)}
										className="border-b border-(--rule) py-4 text-xl font-bold"
									>
										{link.label}
									</SiteLink>
								))}
							</nav>
						</Drawer.Body>
					</Drawer.Dialog>
				</Drawer.Content>
			</Drawer.Backdrop>
		</Drawer>
	);
}

export function Header() {
	const scrolled = useScrolled();
	const pillRef = useRef<HTMLDivElement>(null);
	return (
		<>
			<p className="bg-(--ink) px-4 py-1.5 text-center text-[0.8125rem] font-medium text-white">
				Envío gratis desde 40 €
			</p>
			{/* Floating pill. The side columns share the free space equally, so the menu sits on the true centre.
			    Inset is 8px all round so round controls nest concentrically in the pill's curve. */}
			<header
				data-scrolled={scrolled}
				className="site-header sticky top-2 z-30 px-3 pt-2 sm:px-6"
			>
				<div
					ref={pillRef}
					className="site-pill mx-auto grid h-[50px] max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full border border-(--rule) p-2 pl-3 lg:pl-5"
				>
					<div className="flex items-center gap-1 justify-self-start">
						<MobileMenu />
						<SiteLink
							to=""
							aria-label="Plumín, inicio"
							// The font sits high in its line box: 2px down centres the lowercase wordmark and nib for the eye.
							className="translate-y-[2px] rounded-full"
						>
							<Logo />
						</SiteLink>
					</div>
					<MainNav anchor={pillRef} />
					<div className="col-start-3 flex items-center gap-2 justify-self-end">
						<div className="hidden md:block">
							<InkSearch className="w-40" variant="filled" />
						</div>
						<MiniCart />
					</div>
				</div>
			</header>
		</>
	);
}
