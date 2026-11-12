import {
	createBrowserRouter,
	Outlet,
	type RouteObject,
	RouterProvider,
	ScrollRestoration,
} from "react-router";
import { FrontPage } from "./front-page";
import { fronts } from "./fronts/registry";
import { GalleryPage } from "./gallery/gallery-page";
import { NotFound } from "./not-found";
import { RouteError } from "./route-error";

export const routes: RouteObject[] = [
	{ path: "/", element: <GalleryPage fronts={fronts} /> },
	// The splat lets each front define its own pages (/f/<slug>/productos/12…).
	{ path: "/f/:slug/*", element: <FrontPage /> },
	// Temporary: compares two directions for the NBF home page.
	{
		path: "/prototipo/nbf",
		lazy: async () => ({
			Component: (await import("./prototypes/nbf/nbf-prototype")).NbfPrototype,
		}),
	},
	{ path: "*", element: <NotFound /> },
];

const router = createBrowserRouter(
	[
		{
			element: (
				<>
					<ScrollRestoration />
					<Outlet />
				</>
			),
			errorElement: <RouteError />,
			children: routes,
		},
	],
	// "/" locally, "/uis" on GitHub Pages (Vite's base, without the trailing slash).
	{ basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" },
);

export function App() {
	return <RouterProvider router={router} />;
}
