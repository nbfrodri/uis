import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "react-aria-components";
import { createMemoryRouter, RouterProvider } from "react-router";
import { CartProvider, useCart } from "./cart-context";
import { SampleBoxOffer } from "./components/sample-box-offer";

function CartSnapshot() {
	const { lines } = useCart();
	return (
		<output aria-label="Contenido del carrito">{JSON.stringify(lines)}</output>
	);
}

function renderOffer() {
	const router = createMemoryRouter(
		[
			{
				path: "/f/:slug/*",
				element: (
					<I18nProvider locale="es-ES">
						<CartProvider>
							<SampleBoxOffer />
							<CartSnapshot />
						</CartProvider>
					</I18nProvider>
				),
			},
		],
		{ initialEntries: ["/f/001-plumin"] },
	);
	render(<RouterProvider router={router} />);
}

afterEach(() => localStorage.clear());

it("requires five choices, allows replacing one and saves those inks with the box", async () => {
	renderOffer();
	const add = screen.getByRole("button", { name: "Añadir la caja" });
	expect(add).toBeDisabled();
	for (const name of [
		"Azul real escolar",
		"Mar de Bizkaia",
		"Tormenta",
		"Negro imprenta",
		"Musgo de Ordesa",
	]) {
		await userEvent.click(screen.getByRole("checkbox", { name }));
	}
	expect(add).toBeEnabled();
	expect(screen.getByRole("checkbox", { name: "Aceituna" })).toBeDisabled();
	await userEvent.click(
		screen.getByRole("button", { name: "Quitar Musgo de Ordesa de la caja" }),
	);
	expect(add).toBeDisabled();
	await userEvent.click(screen.getByRole("checkbox", { name: "Aceituna" }));
	await userEvent.click(add);
	expect(
		JSON.parse(localStorage.getItem("uis.plumin.cart") ?? "{}").lines,
	).toEqual([
		{
			id: "caja-muestras",
			qty: 1,
			samples: [
				"azul-real",
				"mar-de-bizkaia",
				"tormenta",
				"negro-imprenta",
				"aceituna",
			],
		},
	]);
});

it("restores selected and legacy boxes while rejecting malformed sample data", () => {
	const samples = ["azul-real", "granada", "tabaco", "ciruela", "aceituna"];
	localStorage.setItem(
		"uis.plumin.cart",
		JSON.stringify({
			lines: [
				{ id: "caja-muestras", qty: 2 },
				{ id: "caja-muestras", qty: 1, samples },
				{ id: "caja-muestras", qty: 1, samples: "granada" },
				{
					id: "caja-muestras",
					qty: 1,
					samples: ["granada", "granada", "granada", "granada", "granada"],
				},
				{
					id: "caja-muestras",
					qty: 1,
					samples: ["gone", "granada", "tabaco", "ciruela", "aceituna"],
				},
			],
		}),
	);
	renderOffer();
	expect(
		JSON.parse(
			screen.getByRole("status", { name: "Contenido del carrito" })
				.textContent ?? "[]",
		),
	).toEqual([
		{ id: "caja-muestras", qty: 2 },
		{ id: "caja-muestras", qty: 1, samples },
	]);
});
