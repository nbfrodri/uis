import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "../../app";

async function renderCatalog(query = "?familia=rojos") {
	const router = createMemoryRouter(routes, {
		initialEntries: [`/f/001-plumin/tintas${query}`],
	});
	render(<RouterProvider router={router} />);
	await screen.findByRole(
		"heading",
		{ level: 1, name: "Rojos" },
		{ timeout: 5000 },
	);
	return router;
}

describe("catalog family pages", () => {
	it("presents the selected family and only its inks", async () => {
		await renderCatalog();
		expect(screen.getByText("2 tintas")).toBeInTheDocument();
		const filters = screen.getByRole("navigation", {
			name: "Filtrar por color",
		});
		expect(
			within(filters).getByRole("link", { name: "Rojos" }),
		).toHaveAttribute("aria-current", "true");
		expect(
			screen.getByRole("heading", { name: "Granada" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "Pimentón" }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("heading", { name: "Aceituna" }),
		).not.toBeInTheDocument();
	});

	it("keeps search and sorting when changing family and clearing search", async () => {
		const router = await renderCatalog(
			"?familia=rojos&q=brillo&orden=precio-desc",
		);
		expect(screen.getByText("1 tinta")).toBeInTheDocument();
		const filters = screen.getByRole("navigation", {
			name: "Filtrar por color",
		});
		await userEvent.click(
			within(filters).getByRole("link", { name: "Verdes" }),
		);
		expect(router.state.location.search).toContain("orden=precio-desc");
		expect(router.state.location.search).toContain("q=brillo");
		expect(
			screen.getByRole("heading", { level: 1, name: "Verdes" }),
		).toBeInTheDocument();
		expect(
			screen.getByText("No hay tintas que coincidan."),
		).toBeInTheDocument();
		await userEvent.click(
			screen.getByRole("link", { name: "Quitar la búsqueda" }),
		);
		expect(router.state.location.search).toBe(
			"?familia=verdes&orden=precio-desc",
		);
		expect(screen.getByText("2 tintas")).toBeInTheDocument();
		await userEvent.click(within(filters).getByRole("link", { name: "Todas" }));
		expect(
			screen.getByRole("heading", { level: 1, name: "Tintas" }),
		).toBeInTheDocument();
		expect(screen.getByText("12 tintas")).toBeInTheDocument();
	});
});
