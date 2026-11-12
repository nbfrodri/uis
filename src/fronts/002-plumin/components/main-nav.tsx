import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { families, findInk, formatPrice, inks, mix, sampleBox } from "../data";
import { useSitePath } from "./site-link";
import { Swatch } from "./swatch";

const featured = ["granada", "mar-de-bizkaia", "musgo-de-ordesa"].flatMap(
	(id) => findInk(id) ?? [],
);
const familyColor = Object.fromEntries(
	families.map((f) => [f.id, inks.find((ink) => ink.family === f.id)?.color]),
);

const itemClass =
	"relative z-10 flex h-10 items-center gap-1 rounded-full px-4 font-semibold outline-none focus-visible:ring-2 focus-visible:ring-(--ink)";

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

export function MainNav() {
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
					className="nav-indicator absolute top-0 left-0 h-10 rounded-full bg-(--wash)"
					style={{
						transform: `translateX(${box?.left ?? 0}px)`,
						width: box?.width ?? 0,
						opacity: box ? 1 : 0,
					}}
				/>
				<NavigationMenu.Item data-nav-item {...hover(0)}>
					<NavigationMenu.Trigger className={itemClass}>
						Tintas
						<NavigationMenu.Icon className="nav-chevron text-xs">
							▾
						</NavigationMenu.Icon>
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className="nav-content grid w-[min(46rem,calc(100vw-2rem))] grid-cols-[1fr_1.4fr_0.9fr] gap-6 p-6">
						<div>
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
						<div>
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
						<div className="flex flex-col justify-between rounded-2xl bg-(--ink) p-5 text-white">
							<div>
								<p className="text-lg leading-tight font-extrabold">
									{sampleBox.name}
								</p>
								<p className="mt-1 text-sm text-white/80">
									Cinco viales para probar.
								</p>
							</div>
							<MenuLink
								to="#muestras"
								className="mt-4 font-semibold underline underline-offset-4"
							>
								{formatPrice(sampleBox.price)}, pedirla
							</MenuLink>
							<MenuLink
								to="tintas"
								className="mt-2 text-sm text-white/80 hover:text-white"
							>
								Ver las doce tintas
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
				<NavigationMenu.Positioner
					sideOffset={14}
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
