import { Breadcrumbs } from "@heroui/react";
import { RouterProvider } from "react-aria-components";
import { useHref, useNavigate } from "react-router";
import { useSitePath } from "./site-link";

type Crumb = { label: string; to?: string };

/** Compact hierarchy shared by colour collections and product pages. */
export function ShopBreadcrumbs({
	items,
	color = "var(--ink)",
}: {
	items: Crumb[];
	color?: string;
}) {
	const navigate = useNavigate();
	const sitePath = useSitePath();
	return (
		<nav aria-label="Ruta">
			<RouterProvider navigate={navigate} useHref={useHref}>
				<Breadcrumbs className="shop-breadcrumbs">
					{items.map((item) => (
						<Breadcrumbs.Item
							key={item.label}
							href={item.to === undefined ? undefined : sitePath(item.to)}
						>
							{item.to === "" ? (
								<>
									<svg
										viewBox="0 0 24 24"
										className="size-4"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.6"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path d="m3 10 9-7 9 7M5 9v11h5v-6h4v6h5V9" />
									</svg>
									<span className="sr-only">{item.label}</span>
								</>
							) : (
								<>
									{item.to === undefined && (
										<span
											className="breadcrumb-ink"
											style={{ backgroundColor: color }}
											aria-hidden="true"
										/>
									)}
									{item.label}
								</>
							)}
						</Breadcrumbs.Item>
					))}
				</Breadcrumbs>
			</RouterProvider>
		</nav>
	);
}
