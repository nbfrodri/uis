import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "react-aria-components";
import { createMemoryRouter, RouterProvider } from "react-router";
import { CartProvider } from "./cart-context";
import { CartLines } from "./components/cart-lines";

afterEach(() => localStorage.clear());

it("opens the product page when a cart line's name is clicked", async () => {
	localStorage.setItem(
		"uis.plumin.cart",
		JSON.stringify({ lines: [{ id: "granada", qty: 1 }] }),
	);
	const onNavigate = vi.fn();
	const router = createMemoryRouter(
		[
			{
				path: "/f/:slug/*",
				element: (
					<I18nProvider locale="es-ES">
						<CartProvider>
							<CartLines onNavigate={onNavigate} />
						</CartProvider>
					</I18nProvider>
				),
			},
		],
		{ initialEntries: ["/f/001-plumin/carrito"] },
	);
	render(<RouterProvider router={router} />);
	await userEvent.click(screen.getByRole("link", { name: "Granada" }));
	expect(router.state.location.pathname).toBe("/f/001-plumin/tintas/granada");
	expect(onNavigate).toHaveBeenCalledOnce();
});
