import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "../../app";

// The front is lazy-loaded; under a full parallel test run that can take over a second.
const slow = { timeout: 5000 };

async function renderShop(url = "/f/001-plumin/tintas") {
	const router = createMemoryRouter(routes, { initialEntries: [url] });
	render(<RouterProvider router={router} />);
	const input = await screen.findByRole(
		"combobox",
		{ name: "Buscar tintas" },
		slow,
	);
	return { router, input };
}

describe("ink search", () => {
	it("suggests inks while typing and opens the chosen one", async () => {
		const { router, input } = await renderShop();
		await userEvent.type(input, "gran");
		const listbox = await screen.findByRole("listbox", {}, slow);
		await userEvent.click(
			within(listbox).getByRole("option", { name: /granada/i }),
		);
		expect(router.state.location.pathname).toBe("/f/001-plumin/tintas/granada");
	});

	it("shows every match when pressing Enter", async () => {
		const { router, input } = await renderShop();
		await userEvent.type(input, "verde{Enter}");
		expect(router.state.location.search).toBe("?q=verde");
		expect(
			await screen.findByText(/resultados para «verde»/i, {}, slow),
		).toBeInTheDocument();
	});

	it("clears the text with the clear button", async () => {
		const { input } = await renderShop();
		expect(
			screen.queryByRole("button", { name: "Borrar búsqueda" }),
		).not.toBeInTheDocument();
		await userEvent.type(input, "azul");
		// While suggestions are open, React Aria marks everything but the field and the list
		// aria-hidden, so the button is found by its label instead of its role.
		await userEvent.click(screen.getByLabelText("Borrar búsqueda"));
		expect(input).toHaveValue("");
	});
});
