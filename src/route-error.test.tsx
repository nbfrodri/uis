import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { RouteError } from "./route-error";

function Boom(): never {
	throw new Error("cartTotals is broken");
}

describe("RouteError", () => {
	it("replaces the router's default screen with a way back", async () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		const router = createMemoryRouter([
			{ path: "/", element: <Boom />, errorElement: <RouteError /> },
		]);
		render(<RouterProvider router={router} />);
		expect(
			await screen.findByRole("heading", { name: /algo ha fallado/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/cartTotals is broken/)).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /volver al índice/i }),
		).toHaveAttribute("href", "/");
		spy.mockRestore();
	});
});
