import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "../../app";
import type { CartLine } from "./cart";
import { nameOf } from "./data";

const slow = { timeout: 5000 };

async function renderCheckout(lines: CartLine[] = [{ id: "granada", qty: 1 }]) {
	localStorage.setItem("uis.plumin.cart", JSON.stringify({ lines }));
	const router = createMemoryRouter(routes, {
		initialEntries: ["/f/001-plumin/pago"],
	});
	render(<RouterProvider router={router} />);
	await screen.findByRole("heading", { name: "Finalizar compra" }, slow);
}

afterEach(() => localStorage.clear());

describe("checkout", () => {
	it("shows the ink selection for each distinct sample box in the order summary", async () => {
		const first = ["azul-real", "granada", "tabaco", "ciruela", "aceituna"];
		const second = [
			"mar-de-bizkaia",
			"tormenta",
			"negro-imprenta",
			"musgo-de-ordesa",
			"pimenton",
		];
		await renderCheckout([
			{ id: "caja-muestras", qty: 1, samples: first },
			{ id: "caja-muestras", qty: 1, samples: second },
		]);
		const summary = screen.getByRole("complementary", {
			name: "Resumen del pedido",
		});
		expect(within(summary).getAllByText("Caja de muestras")).toHaveLength(2);
		expect(
			within(summary).getByText(first.map(nameOf).join(", ")),
		).toBeInTheDocument();
		expect(
			within(summary).getByText(second.map(nameOf).join(", ")),
		).toBeInTheDocument();
	});

	it("explains what is missing instead of submitting", async () => {
		await renderCheckout();
		await userEvent.click(screen.getByRole("button", { name: /pagar/i }));
		expect(await screen.findByText(/escribe un correo/i)).toBeInTheDocument();
		expect(screen.getByText(/escribe el código postal/i)).toBeInTheDocument();
		expect(screen.queryByText(/pedido confirmado/i)).not.toBeInTheDocument();
	});

	it("completes a pick-up order paid with Bizum and empties the cart", async () => {
		const user = userEvent.setup();
		await renderCheckout();
		await user.type(
			screen.getByLabelText("Correo electrónico"),
			"lucia@example.com",
		);
		await user.click(
			screen.getByRole("radio", { name: /recoger en la tienda/i }),
		);
		expect(screen.queryByLabelText("Dirección")).not.toBeInTheDocument();
		await user.type(screen.getByLabelText("Nombre"), "Lucía");
		await user.type(screen.getByLabelText("Apellidos"), "Ferrer");
		await user.type(screen.getByLabelText("Teléfono"), "612345678");
		await user.click(screen.getByRole("radio", { name: /bizum/i }));
		await user.type(screen.getByLabelText("Móvil de Bizum"), "612345678");
		await user.click(screen.getByRole("button", { name: /pagar 19,00/i }));
		expect(
			await screen.findByRole("heading", { name: /pedido confirmado/i }, slow),
		).toBeInTheDocument();
		expect(screen.getByText(/PL-[A-Z0-9]{5}/)).toBeInTheDocument();
		expect(
			JSON.parse(localStorage.getItem("uis.plumin.cart") ?? "{}").lines,
		).toEqual([]);
	});

	it("picking a city fills the province and, when there is only one, the postal code", async () => {
		const user = userEvent.setup();
		await renderCheckout();
		const city = screen.getByRole("combobox", { name: "Ciudad" });
		await user.type(city, "chinch");
		await user.click(
			await screen.findByRole("option", { name: /chinchón/i }, slow),
		);
		await waitFor(
			() => expect(screen.getByLabelText("Código postal")).toHaveValue("28370"),
			slow,
		);
		expect(city).toHaveValue("Chinchón");
		expect(screen.getByRole("combobox", { name: "Provincia" })).toHaveValue(
			"Madrid",
		);
	});
});
