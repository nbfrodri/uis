import { NavigationMenu } from "@base-ui/react/navigation-menu";
import {
	type ReactNode,
	type RefObject,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Link, useLocation } from "react-router";
import { families, findInk, formatPrice, inks, mix, sampleBox } from "../data";
import { useSitePath } from "./site-link";
import { Swatch } from "./swatch";

const featured = ["granada", "mar-de-bizkaia", "musgo-de-ordesa"].flatMap(
	(id) => findInk(id) ?? [],
);
const vials = [
	"azul-real",
	"granada",
	"musgo-de-ordesa",
	"tabaco",
	"ciruela",
].flatMap((id) => findInk(id) ?? []);
const familyColor = Object.fromEntries(
	families.map((f) => [f.id, inks.find((ink) => ink.family === f.id)?.color]),
);

const itemClass =
	"relative z-10 flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.9375rem] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-(--ink)";

/** Thin chevron matching the stroke of the other icons; nudged 1px down to sit on the text's optical centre. */
function ChevronIcon() {
	return (
		<svg
			viewBox="0 0 12 12"
			className="size-3 translate-y-px"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M2.5 4.5 6 8l3.5-3.5"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/** A Base UI menu link that navigates with React Router inside the front. */
function MenuLink({
	to,
	className,
	children,
}: {
	to: string;
	className?: string;
	children: ReactNode;
}) {
	const sitePath = useSitePath();
	return (
		<NavigationMenu.Link
			closeOnClick
			render={<Link to={sitePath(to)} />}
			className={className}
		>
			{children}
		</NavigationMenu.Link>
	);
}

/**
 * The highlight pill that slides under the hovered item, and rests on the current page.
 * Measured from the DOM because items have different widths.
 */
function useSlidingIndicator(activeIndex: number) {
	const listRef = useRef<HTMLUListElement>(null);
	const [hovered, setHovered] = useState<number | null>(null);
	const [box, setBox] = useState<{ left: number; width: number } | null>(null);
	const target = hovered ?? activeIndex;

	useLayoutEffect(() => {
		const item =
			listRef.current?.querySelectorAll<HTMLElement>("[data-nav-item]")[target];
		setBox(item ? { left: item.offsetLeft, width: item.offsetWidth } : null);
	}, [target]);

	return { listRef, box, setHovered };
}

export function MainNav({ anchor }: { anchor: RefObject<HTMLElement | null> }) {
	const { pathname } = useLocation();
	const sitePath = useSitePath();
	const activeIndex = pathname.startsWith(sitePath("tintas"))
		? 0
		: pathname.startsWith(sitePath("taller"))
			? 1
			: -1;
	const { listRef, box, setHovered } = useSlidingIndicator(activeIndex);

	const hover = (index: number) => ({
		onPointerEnter: () => setHovered(index),
		onFocus: () => setHovered(index),
	});

	return (
		<NavigationMenu.Root aria-label="Principal" className="hidden lg:block">
			<NavigationMenu.List
				ref={listRef}
				className="relative flex items-center"
				onPointerLeave={() => setHovered(null)}
				onBlur={() => setHovered(null)}
			>
				<span
					aria-hidden="true"
					className="nav-indicator absolute top-0 left-0 h-9 rounded-full bg-(--wash)"
					style={{
						transform: `translateX(${box?.left ?? 0}px)`,
						width: box?.width ?? 0,
						opacity: box ? 1 : 0,
					}}
				/>
				<NavigationMenu.Item data-nav-item {...hover(0)}>
					<NavigationMenu.Trigger className={itemClass}>
						Tintas
						<NavigationMenu.Icon className="nav-chevron">
							<ChevronIcon />
						</NavigationMenu.Icon>
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className="nav-content grid w-[min(44rem,calc(100vw-2rem))] grid-cols-[0.8fr_1.6fr] gap-x-2 p-2">
						<div className="p-4">
							<p className="text-sm font-bold text-(--ink-soft)">Por color</p>
							<ul className="mt-3 grid gap-1">
								{families.map((family) => (
									<li key={family.id}>
										<MenuLink
											to={`tintas?familia=${family.id}`}
											className="flex items-center gap-3 rounded-xl px-2 py-1.5 font-semibold hover:bg-(--wash)"
										>
											<span
												className="size-5 rounded-full shadow-[inset_0_-3px_6px_rgb(0_0_0/0.25)]"
												style={{ background: familyColor[family.id] }}
												aria-hidden="true"
											/>
											{family.label}
										</MenuLink>
									</li>
								))}
							</ul>
						</div>
						<div className="p-4">
							<p className="text-sm font-bold text-(--ink-soft)">Destacadas</p>
							<ul className="mt-3 grid grid-cols-3 gap-3">
								{featured.map((ink, i) => (
									<li key={ink.id}>
										<MenuLink to={`tintas/${ink.id}`} className="group block">
											<span
												className="grid aspect-[3/4] place-items-center rounded-xl p-3"
												style={{ background: mix(ink.color, "#ffffff", 0.88) }}
											>
												<Swatch
													color={ink.color}
													sheen={ink.sheen}
													seed={i + 70}
													className="tile-swatch h-full w-3/5"
												/>
											</span>
											<span className="mt-2 block text-sm leading-tight font-bold group-hover:underline">
												{ink.name}
											</span>
											<span className="text-sm text-(--ink-soft)">
												{formatPrice(ink.price)}
											</span>
										</MenuLink>
									</li>
								))}
							</ul>
						</div>
						{/* Sample box: a full-width strip, so it reads as an offer rather than a squeezed column. */}
						<div className="col-span-2 flex items-center gap-5 rounded-2xl bg-(--ink) p-4 pl-5 text-white">
							<span className="flex h-12 items-end gap-1.5" aria-hidden="true">
								{vials.map((ink, i) => (
									<span
										key={ink.id}
										className="relative h-full w-3.5 rounded-t-full rounded-b-sm bg-white/15"
									>
										<span
											className="absolute inset-x-0.5 bottom-0.5 rounded-t-full rounded-b-sm"
											style={{
												background: ink.color,
												height: `${50 + i * 9}%`,
											}}
										/>
									</span>
								))}
							</span>
							<span className="min-w-0 flex-1">
								<span className="block font-extrabold">{sampleBox.name}</span>
								<span className="block text-sm text-white/75">
									Cinco viales de 4 ml para probar en casa.
								</span>
							</span>
							<span className="text-xl font-extrabold">
								{formatPrice(sampleBox.price)}
							</span>
							<MenuLink
								to="#muestras"
								className="flex h-9 items-center rounded-full bg-white px-4 text-sm font-bold text-(--ink)"
							>
								Pedir la caja
							</MenuLink>
						</div>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item data-nav-item {...hover(1)}>
					<MenuLink to="taller" className={itemClass}>
						Taller
					</MenuLink>
				</NavigationMenu.Item>
				<NavigationMenu.Item data-nav-item {...hover(2)}>
					<MenuLink to="#visitanos" className={itemClass}>
						Visítanos
					</MenuLink>
				</NavigationMenu.Item>
			</NavigationMenu.List>

			<NavigationMenu.Portal>
				{/* Anchored to the whole pill so the panel sits centred under it, not under the trigger. */}
				<NavigationMenu.Positioner
					anchor={anchor}
					sideOffset={8}
					align="center"
					className="nav-positioner z-40"
				>
					<NavigationMenu.Popup className="nav-popup rounded-3xl border border-(--rule) bg-white text-(--ink) shadow-[0_30px_60px_-30px_rgb(23_32_88/0.45)]">
						<NavigationMenu.Viewport />
					</NavigationMenu.Popup>
				</NavigationMenu.Positioner>
			</NavigationMenu.Portal>
		</NavigationMenu.Root>
	);
}
