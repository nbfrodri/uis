import { Badge, Button, Drawer } from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../cart-context";
import { formatPrice } from "../data";
import { CartLines } from "./cart-lines";
import { BagIcon, MenuIcon } from "./icons";
import { InkSearch } from "./ink-search";
import { Logo } from "./logo";
import { ShippingMeter } from "./shipping-meter";
import { SiteLink, SiteNavLink, useSitePath } from "./site-link";

const links = [
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
			<Badge.Anchor>
				<Button
					variant="ghost"
					isIconOnly
					aria-label={`Carrito, ${totals.count} productos`}
					onPress={() => setOpen(true)}
				>
					<BagIcon className="size-6" />
				</Button>
				{totals.count > 0 && (
					<Badge size="sm" className="bg-(--ink) text-white">
						{totals.count}
					</Badge>
				)}
			</Badge.Anchor>
			<Drawer.Backdrop>
				<Drawer.Content placement="right">
					<Drawer.Dialog className="flex h-full flex-col sm:w-[28rem]">
						<Drawer.Header className="flex items-center justify-between">
							<Drawer.Heading className="text-2xl font-extrabold tracking-tight">
								Tu carrito
							</Drawer.Heading>
							<Drawer.CloseTrigger />
						</Drawer.Header>
						<Drawer.Body className="flex-1 overflow-y-auto">
							{totals.count === 0 ? (
								<div className="py-10">
									<p className="text-lg">
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
								<Button size="lg" fullWidth onPress={() => go("carrito")}>
									Ir al carrito
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
				className="lg:hidden"
				onPress={() => setOpen(true)}
			>
				<MenuIcon className="size-6" />
			</Button>
			<Drawer.Backdrop>
				<Drawer.Content placement="left">
					<Drawer.Dialog>
						<Drawer.Header className="flex items-center justify-between">
							<Drawer.Heading>
								<Logo />
							</Drawer.Heading>
							<Drawer.CloseTrigger />
						</Drawer.Header>
						<Drawer.Body>
							<InkSearch onDone={() => setOpen(false)} />
							<nav aria-label="Menú" className="mt-6 flex flex-col">
								{links.map((link) => (
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
	return (
		<>
			<p className="bg-(--ink) px-4 py-2 text-center text-sm font-medium text-white">
				Envío gratis a partir de 40 €. Y en la tienda de Lavapiés puedes probar
				todas las tintas.
			</p>
			<header
				data-scrolled={scrolled}
				className="site-header sticky top-0 z-30"
			>
				<div
					className={`mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-8 ${scrolled ? "py-2" : "py-4"}`}
				>
					<div className="flex items-center gap-1">
						<MobileMenu />
						<SiteLink to="" aria-label="Plumín, inicio">
							<Logo />
						</SiteLink>
					</div>
					<nav
						aria-label="Principal"
						className="hidden justify-center gap-1 lg:flex"
					>
						{links.map((link) =>
							link.to.startsWith("#") || link.to.includes("?") ? (
								<SiteLink
									key={link.label}
									to={link.to}
									className="rounded-full px-4 py-2 font-semibold hover:bg-(--wash)"
								>
									{link.label}
								</SiteLink>
							) : (
								<SiteNavLink
									key={link.label}
									to={link.to}
									className={({ isActive }) =>
										`rounded-full px-4 py-2 font-semibold hover:bg-(--wash) ${isActive ? "bg-(--wash)" : ""}`
									}
								>
									{link.label}
								</SiteNavLink>
							),
						)}
					</nav>
					<div className="flex items-center gap-2">
						<div className="hidden md:block">
							<InkSearch className="w-60" />
						</div>
						<MiniCart />
					</div>
				</div>
			</header>
		</>
	);
}
