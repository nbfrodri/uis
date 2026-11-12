import { Badge, Button, Drawer } from "@heroui/react";
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
			<Badge.Anchor>
				<Button
					variant="ghost"
					isIconOnly
					className="size-9 min-w-9"
					aria-label={`Carrito, ${totals.count} productos`}
					onPress={() => setOpen(true)}
				>
					<BagIcon className="size-[1.375rem]" />
				</Button>
				{totals.count > 0 && (
					<Badge
						size="sm"
						className="top-1! right-1! min-w-[1.125rem] bg-(--ink) px-1 text-[0.6875rem] text-white"
					>
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
				className="size-9 min-w-9 lg:hidden"
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
			    Inset is 6px all round so round controls nest concentrically in the pill's curve. */}
			<header
				data-scrolled={scrolled}
				className="site-header sticky top-2 z-30 px-3 pt-2 sm:px-6"
			>
				<div
					ref={pillRef}
					className="site-pill mx-auto grid h-12 max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-full border border-(--rule) p-1.5 pl-2.5 lg:pl-4"
				>
					<div className="flex items-center gap-1 justify-self-start">
						<MobileMenu />
						<SiteLink
							to=""
							aria-label="Plumín, inicio"
							className="rounded-full"
						>
							<Logo />
						</SiteLink>
					</div>
					<MainNav anchor={pillRef} />
					<div className="flex items-center gap-1.5 justify-self-end">
						<div className="hidden md:block">
							<InkSearch className="w-44" variant="filled" />
						</div>
						<MiniCart />
					</div>
				</div>
			</header>
		</>
	);
}
