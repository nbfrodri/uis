import { createBrowserRouter, RouterProvider } from "react-router";
import { FrontPage } from "./front-page";
import { fronts } from "./fronts/registry";
import { GalleryPage } from "./gallery/gallery-page";
import { NotFound } from "./not-found";

const router = createBrowserRouter([
	{ path: "/", element: <GalleryPage fronts={fronts} /> },
	{ path: "/f/:slug", element: <FrontPage /> },
	{ path: "*", element: <NotFound /> },
]);

export function App() {
	return <RouterProvider router={router} />;
}
