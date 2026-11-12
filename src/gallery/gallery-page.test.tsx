import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import type { Front } from "../lib/fronts";
import { GalleryPage } from "./gallery-page";

const fronts: Front[] = [
	{
		slug: "002-glass",
		number: 2,
		title: "Reproductor de cristal",
		date: "2026-11-12",
		description: "Un reproductor.",
		tags: ["motion"],
	},
	{
		slug: "001-ledger",
		number: 1,
		title: "Libro de cuentas",
		date: "2026-11-10",
		description: "Una tabla densa.",
		tags: ["data"],
	},
];

function renderGallery(list: Front[], url = "/") {
	const router = createMemoryRouter(
		[{ path: "/", element: <GalleryPage fronts={list} /> }],
		{ initialEntries: [url] },
	);
	render(<RouterProvider router={router} />);
}

describe("GalleryPage", () => {
	it("presents NBF, its work and what it does", () => {
		renderGallery(fronts);
		expect(screen.getByRole("link", { name: "NBF, inicio" })).toHaveAttribute(
			"href",
			"/",
		);
		expect(
			screen.getByRole("heading", { level: 1, name: "NBF" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { level: 2, name: "Lo que hago" }),
		).toBeInTheDocument();
	});

	it("lists every front with a link to open it", () => {
		renderGallery(fronts);
		const items = within(
			screen.getByRole("region", { name: "Trabajo" }),
		).getAllByRole("listitem");
		expect(items).toHaveLength(2);
		expect(
			within(items[0] as HTMLElement).getByRole("link", {
				name: /reproductor de cristal/i,
			}),
		).toHaveAttribute("href", "/f/002-glass");
	});

	it("filters by tag from the URL and marks the active tag", async () => {
		renderGallery(fronts);
		await userEvent.click(screen.getByRole("link", { name: "data" }));
		expect(
			within(screen.getByRole("region", { name: "Trabajo" })).getAllByRole(
				"listitem",
			),
		).toHaveLength(1);
		expect(
			screen.getByRole("link", { name: /libro de cuentas/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "data" })).toHaveAttribute(
			"aria-current",
			"true",
		);
	});

	it("explains how to clear a tag that matches nothing", () => {
		renderGallery(fronts, "/?tag=brutalist");
		expect(
			screen.getByText(/ninguna web lleva la etiqueta/i),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /ver todos/i })).toHaveAttribute(
			"href",
			"/",
		);
	});

	it("tells how to create the first front when there are none", () => {
		renderGallery([]);
		expect(screen.getByText(/pnpm new-front/)).toBeInTheDocument();
	});
});
