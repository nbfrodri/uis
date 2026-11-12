import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "./app";
import Template from "./fronts/_template";

function renderAt(url: string, routeList = routes) {
	render(
		<RouterProvider
			router={createMemoryRouter(routeList, { initialEntries: [url] })}
		/>,
	);
}

describe("front routing", () => {
	it("gives a front its own sub-pages under /f/:slug/*", async () => {
		renderAt("/f/demo", [{ path: "/f/:slug/*", element: <Template /> }]);
		await userEvent.click(screen.getByRole("link", { name: "Sobre nosotros" }));
		expect(
			screen.getByRole("heading", { name: "Sobre nosotros" }),
		).toBeInTheDocument();
		await userEvent.click(screen.getByRole("link", { name: "Inicio" }));
		expect(
			screen.getByRole("heading", { name: "__TITLE__" }),
		).toBeInTheDocument();
	});

	it("opens a registered front at a nested path", async () => {
		renderAt("/f/001-tarjeta-embarque/cualquier/cosa");
		expect(
			await screen.findByRole("link", { name: /volver al índice/i }),
		).toBeInTheDocument();
	});

	it("shows the not-found page for an unknown front", () => {
		renderAt("/f/999-nada");
		expect(
			screen.getByRole("heading", { name: /no existe/i }),
		).toBeInTheDocument();
	});
});
