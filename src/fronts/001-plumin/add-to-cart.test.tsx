import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "react-aria-components";
import { createMemoryRouter, RouterProvider } from "react-router";
import { CartProvider, useCart } from "./cart-context";
import { AddToCart, QuickAdd } from "./components/add-to-cart";

function CartCount() {
	const { totals } = useCart();
	return <output aria-label="Productos">{totals.count}</output>;
}

function renderButtons() {
	const router = createMemoryRouter(
		[
			{
				path: "/f/:slug/*",
				element: (
					<I18nProvider locale="es-ES">
						<CartProvider>
							<QuickAdd id="granada" />
							<AddToCart id="azul-real" />
							<CartCount />
						</CartProvider>
					</I18nProvider>
				),
			},
		],
		{ initialEntries: ["/f/001-plumin"] },
	);
	render(<RouterProvider router={router} />);
}

afterEach(() => {
	vi.useRealTimers();
	localStorage.clear();
});

it("confirms additions independently on the tile and product buttons", async () => {
	renderButtons();
	await userEvent.click(
		screen.getByRole("button", { name: "Añadir Granada al carrito" }),
	);
	expect(
		screen.getByRole("button", { name: "Añadido: Granada" }),
	).toHaveTextContent("Añadido");
	expect(
		screen.getByRole("button", { name: "Añadir al carrito" }),
	).toBeEnabled();
	await userEvent.click(
		screen.getByRole("button", { name: "Añadir al carrito" }),
	);
	expect(screen.getAllByRole("button", { name: /Añadido/ })).toHaveLength(2);
	expect(screen.getByRole("status", { name: "Productos" })).toHaveTextContent(
		"2",
	);
});

it("renews confirmation for another press, then restores the action label", () => {
	renderButtons();
	vi.useFakeTimers();
	const button = screen.getByRole("button", {
		name: "Añadir Granada al carrito",
	});
	fireEvent.click(button);
	act(() => vi.advanceTimersByTime(1200));
	fireEvent.click(button);
	act(() => vi.advanceTimersByTime(1200));
	expect(button).toHaveAccessibleName("Añadido: Granada");
	act(() => vi.advanceTimersByTime(700));
	expect(button).toHaveAccessibleName("Añadir Granada al carrito");
	expect(screen.getByRole("status", { name: "Productos" })).toHaveTextContent(
		"2",
	);
});

it("does not confirm an addition when the cart is already at its quantity limit", async () => {
	localStorage.setItem(
		"uis.plumin.cart",
		JSON.stringify({ lines: [{ id: "granada", qty: 10 }] }),
	);
	renderButtons();
	await userEvent.click(
		screen.getByRole("button", { name: "Añadir Granada al carrito" }),
	);
	expect(
		screen.queryByRole("button", { name: "Añadido: Granada" }),
	).not.toBeInTheDocument();
	expect(screen.getByRole("status", { name: "Productos" })).toHaveTextContent(
		"10",
	);
});
