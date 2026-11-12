import { Breadcrumbs } from "@heroui/react";
import { RouterProvider } from "react-aria-components";
import { useHref, useNavigate } from "react-router";
import { useSitePath } from "./site-link";

type Crumb = { label: string; to?: string };

/** Compact hierarchy shared by colour collections and product pages. */
export function ShopBreadcrumbs({ items }: { items: Crumb[] }) {
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
							{item.label}
						</Breadcrumbs.Item>
					))}
				</Breadcrumbs>
			</RouterProvider>
		</nav>
	);
}
