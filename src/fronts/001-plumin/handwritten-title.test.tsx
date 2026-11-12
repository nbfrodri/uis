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
	pause: vi.fn(),
	play: vi.fn(),
	point: vi.fn(),
	animations: [] as {
		currentTime: number;
		cancel: () => void;
		pause: () => void;
		play: () => void;
	}[],
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
			const matrix = {
				f: 0,
				inverse: () => matrix,
				multiply: (other: unknown) => other,
			};
			Object.defineProperty(this.svg, "getCTM", { value: () => matrix });
			Object.defineProperty(this.svg, "createSVGPoint", {
				value: () => ({
					matrixTransform: (transform: { f: number }) => ({
						x: 0,
						y: transform.f,
					}),
				}),
			});
			const outer = document.createElementNS("http://www.w3.org/2000/svg", "g");
			outer.setAttribute("class", "outer");
			this.svg.append(outer);
			for (const length of [100, 200]) {
				const line = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"g",
				);
				Object.defineProperty(line, "getCTM", {
					value: () => ({ ...matrix, f: length }),
				});
				outer.append(line);
				const path = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"path",
				);
				path.style.strokeDashoffset = String(length);
				Object.defineProperty(path, "animate", { value: drawing.animate });
				Object.defineProperty(path, "getCTM", { value: () => matrix });
				Object.defineProperty(path, "getTotalLength", { value: () => length });
				Object.defineProperty(path, "getPointAtLength", {
					value: drawing.point,
				});
				line.append(path);
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
	drawing.animations.length = 0;
	drawing.animate.mockImplementation(() => {
		const animation = {
			cancel: drawing.cancel,
			pause: drawing.pause,
			play: drawing.play,
			currentTime: 0,
		};
		drawing.animations.push(animation);
		return animation;
	});
	drawing.point.mockImplementation((length: number) => ({
		matrixTransform: () => ({ x: length, y: 50 }),
	}));
	mediaQuery();
});

afterEach(() => vi.unstubAllGlobals());

it("draws sequential strokes in a loop and cancels them when leaving the page", async () => {
	const { unmount, container } = render(<HandwrittenTitle color="#123456" />);
	expect(container.querySelector("[data-state]")).toHaveAttribute(
		"data-state",
		"loading",
	);
	expect(
		screen.getByRole("heading", { name: "Tinta para escribir a mano." }),
	).toBeVisible();
	await waitFor(() => expect(drawing.ready).toBeDefined());
	act(() => drawing.ready?.());
	expect(drawing.animate).toHaveBeenCalledTimes(2);
	const [first, second] = drawing.animate.mock.calls;
	expect(first?.[1]).toMatchObject({
		iterations: Number.POSITIVE_INFINITY,
		duration: 7060,
	});
	expect(first?.[0][1].offset).toBe(0);
	// The pen lifts for 60ms between strokes.
	expect((second?.[0][1].offset - first?.[0][2].offset) * 7060).toBeCloseTo(60);
	expect(second?.[0][2].offset * 7060).toBeCloseTo(5260);
	expect(container.querySelector("[data-state]")).toHaveAttribute(
		"data-state",
		"ready",
	);
	expect(container.querySelector("[data-writing-pen]")).toHaveAttribute(
		"transform",
		"translate(0 50) rotate(35)",
	);
	expect(
		Array.from(container.querySelectorAll("[data-handwriting-rule]"), (line) =>
			line.getAttribute("y1"),
		),
	).toEqual(["101", "201"]);
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

it("rewrites only the text when choosing another ink, keeping the ruled lines", async () => {
	const router = createMemoryRouter(
		[{ path: "/f/:slug/*", element: <HeroWriting /> }],
		{ initialEntries: ["/f/001-plumin"] },
	);
	const { container } = render(<RouterProvider router={router} />);
	await waitFor(() => expect(drawing.ready).toBeDefined());
	act(() => drawing.ready?.());
	for (const animation of drawing.animations) animation.currentTime = 1500;
	await userEvent.click(screen.getByRole("radio", { name: "Granada" }));
	expect(screen.getByRole("radio", { name: "Granada" })).toBeChecked();
	expect(drawing.construct).toHaveBeenCalledTimes(1);
	expect(drawing.cancel).not.toHaveBeenCalled();
	expect(drawing.animations.map((animation) => animation.currentTime)).toEqual([
		0, 0,
	]);
	expect(container.querySelectorAll("[data-handwriting-rule]")).toHaveLength(2);
});
