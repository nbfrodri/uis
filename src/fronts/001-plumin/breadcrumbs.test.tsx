import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "../../app";

it("shows the complete product trail and navigates back to its colour family", async () => {
	const router = createMemoryRouter(routes, {
		basename: "/uis",
		initialEntries: ["/uis/f/001-plumin/tintas/granada"],
	});
	render(<RouterProvider router={router} />);
	await screen.findByRole(
		"heading",
		{ level: 1, name: "Granada" },
		{ timeout: 5000 },
	);
	const trail = screen.getByRole("navigation", { name: "Ruta" });
	const current = within(trail).getByText("Granada");
	expect(current).toHaveAttribute("aria-current", "page");
	expect(current).not.toHaveAttribute("href");
	const family = within(trail).getByRole("link", { name: "Rojos" });
	expect(family).toHaveAttribute(
		"href",
		"/uis/f/001-plumin/tintas?familia=rojos",
	);
	await userEvent.click(family);
	expect(router.state.location.search).toBe("?familia=rojos");
	expect(
		screen.getByRole("heading", { level: 1, name: "Rojos" }),
	).toBeInTheDocument();
	expect(
		within(screen.getByRole("navigation", { name: "Ruta" })).getByText("Rojos"),
	).toHaveAttribute("aria-current", "page");
});
