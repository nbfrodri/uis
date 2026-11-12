import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { NbfPrototype } from "./nbf-prototype";

it("switches between the two NBF directions and links the real project", async () => {
	const router = createMemoryRouter(
		[{ path: "/prototipo/nbf", element: <NbfPrototype /> }],
		{ initialEntries: ["/prototipo/nbf"] },
	);
	const { container } = render(<RouterProvider router={router} />);
	expect(screen.getByRole("heading", { level: 1, name: "NBF" })).toBeVisible();
	expect(container.querySelector(".nbf")).toHaveAttribute("data-variant", "a");
	expect(screen.getByRole("link", { name: /Plumín/ })).toHaveAttribute(
		"href",
		"/f/001-plumin",
	);

	await userEvent.click(screen.getByRole("link", { name: "B · Horizontal" }));
	expect(container.querySelector(".nbf")).toHaveAttribute("data-variant", "b");
	expect(
		screen.getByRole("heading", {
			level: 1,
			name: /Interfaces que se pueden recorrer/,
		}),
	).toBeVisible();
	expect(screen.getAllByText("En preparación")).toHaveLength(2);
});
