import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "../../app";

const slow = { timeout: 5000 };

describe("main navigation", () => {
	it("opens the inks mega menu with colour families and featured inks", async () => {
		const router = createMemoryRouter(routes, {
			initialEntries: ["/f/001-plumin/taller"],
		});
		render(<RouterProvider router={router} />);
		const nav = await screen.findByRole(
			"navigation",
			{ name: "Principal" },
			slow,
		);
		await userEvent.click(within(nav).getByRole("button", { name: /tintas/i }));
		const azules = await screen.findByRole("link", { name: /azules/i }, slow);
		expect(azules).toHaveAttribute(
			"href",
			"/f/001-plumin/tintas?familia=azules",
		);
		expect(screen.getByRole("link", { name: /granada/i })).toHaveAttribute(
			"href",
			"/f/001-plumin/tintas/granada",
		);
		await userEvent.click(azules);
		expect(router.state.location.search).toBe("?familia=azules");
	});
});

import { within } from "@testing-library/react";
