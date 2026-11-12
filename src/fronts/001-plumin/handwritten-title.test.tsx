import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { HandwrittenTitle } from "./components/handwritten-title";
import { HeroWriting } from "./components/hero-writing";

const drawing = vi.hoisted(() => ({
	ready: undefined as (() => void) | undefined,
	construct: vi.fn(),
	animate: vi.fn(),
	cancel: vi.fn(),
}));

vi.mock("vara", () => ({
	default: class {
		svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		preCreate() {}
		createText() {}
		constructor(selector: string, ...args: unknown[]) {
			drawing.construct(selector, ...args);
			Object.defineProperty(this.svg, "getBBox", {
				value: () => ({ x: 0, y: 0, width: 800, height: 250 }),
			});
			for (const length of [100, 200]) {
				const path = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"path",
				);
				path.style.strokeDashoffset = String(length);
				Object.defineProperty(path, "animate", { value: drawing.animate });
				this.svg.append(path);
			}
			document.querySelector(selector)?.append(this.svg);
		}
		ready(callback: () => void) {
			drawing.ready = callback;
		}
	},
}));

function mediaQuery(reduced = false) {
	const query = {
		matches: reduced,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	};
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => query),
	);
	return query;
}

beforeEach(() => {
	vi.clearAllMocks();
	drawing.ready = undefined;
	drawing.animate.mockReturnValue({ cancel: drawing.cancel });
	mediaQuery();
});

afterEach(() => vi.unstubAllGlobals());

it("draws sequential SVG strokes and cancels them when leaving the page", async () => {
	const { unmount } = render(<HandwrittenTitle color="#123456" />);
	expect(
		screen.getByRole("heading", { name: "Tinta para escribir a mano." }),
	).toBeVisible();
	await waitFor(() => expect(drawing.ready).toBeDefined());
	act(() => drawing.ready?.());
	expect(drawing.animate).toHaveBeenCalledTimes(2);
	const timings = drawing.animate.mock.calls.map((call) => call[1]);
	expect(timings[0].delay).toBe(0);
	expect(timings[1].delay).toBe(timings[0].duration);
	expect(timings[0].duration + timings[1].duration).toBeCloseTo(2600);
	unmount();
	expect(drawing.cancel).toHaveBeenCalledTimes(2);
});

it("keeps the complete static title for reduced motion without loading Vara", async () => {
	mediaQuery(true);
	render(<HandwrittenTitle color="#123456" />);
	await act(async () => {});
	expect(
		screen.getByRole("heading", { name: "Tinta para escribir a mano." }),
	).toBeVisible();
	expect(drawing.construct).not.toHaveBeenCalled();
});

it("ignores a font that finishes loading after unmount", async () => {
	const { unmount } = render(<HandwrittenTitle color="#123456" />);
	await waitFor(() => expect(drawing.ready).toBeDefined());
	unmount();
	act(() => drawing.ready?.());
	expect(drawing.animate).not.toHaveBeenCalled();
});

it("stops drawing when reduced motion is enabled during playback", async () => {
	const query = mediaQuery();
	const { container } = render(<HandwrittenTitle color="#123456" />);
	await waitFor(() => expect(drawing.ready).toBeDefined());
	act(() => drawing.ready?.());
	query.matches = true;
	const listener = query.addEventListener.mock.calls[0]?.[1];
	await act(async () => listener());
	expect(drawing.cancel).toHaveBeenCalledTimes(2);
	expect(container.querySelector("svg")).toBeNull();
	expect(
		screen.getByRole("heading", { name: "Tinta para escribir a mano." }),
	).toBeVisible();
});

it("redraws the headline from its first stroke when choosing another ink", async () => {
	const router = createMemoryRouter(
		[{ path: "/f/:slug/*", element: <HeroWriting /> }],
		{ initialEntries: ["/f/001-plumin"] },
	);
	render(<RouterProvider router={router} />);
	await waitFor(() => expect(drawing.ready).toBeDefined());
	act(() => drawing.ready?.());
	const previousReady = drawing.ready;
	await userEvent.click(screen.getByRole("radio", { name: "Granada" }));
	await waitFor(() => expect(drawing.ready).not.toBe(previousReady));
	expect(drawing.cancel).toHaveBeenCalledTimes(2);
	act(() => drawing.ready?.());
	expect(drawing.animate).toHaveBeenCalledTimes(4);
	expect(drawing.animate.mock.calls[2]?.[1].delay).toBe(0);
	expect(screen.getByRole("radio", { name: "Granada" })).toBeChecked();
});
