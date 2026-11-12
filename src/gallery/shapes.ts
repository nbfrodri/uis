import type { Shape } from "./effects";

/** [kind, left, top, size, speed, spin, accent?] — compact rows for decorative layers. */
type Row = [Shape["kind"], string, string, number, number, number, boolean?];
const rows = (list: Row[]): Shape[] =>
	list.map(([kind, left, top, size, speed, spin, accent]) => ({
		kind,
		left,
		top,
		size,
		speed,
		spin,
		accent,
	}));

// Depth comes from speed: pixels travelled across the section's pass.
export const WORK_SHAPES = rows([
	["ring", "62%", "-4rem", 220, 260, 40],
	["plus", "8%", "70%", 44, 420, 180],
	["star", "88%", "78%", 56, 520, 120, true],
	["dots", "44%", "88%", 70, 180, 0],
	["arc", "30%", "2rem", 110, 340, -30],
	["half", "94%", "30%", 60, 600, 90],
]);

export const CTA_SHAPES = rows([
	["square", "70%", "10%", 140, 300, -60],
	["star", "56%", "62%", 40, 460, 200, true],
	["ring", "86%", "48%", 90, 520, 0],
	["wave", "40%", "84%", 100, 380, 0],
	["diamond", "92%", "8%", 24, 700, 180, true],
]);

export const ABOUT_SHAPES = rows([
	["triangle", "52%", "70%", 70, 420, -120],
	["plus", "4%", "8%", 32, 560, 90, true],
	["dots", "58%", "6%", 56, 260, 0],
]);

export const BANDS_SHAPES = rows([
	["half", "6%", "4%", 70, 360, 180],
	["star", "80%", "86%", 44, 500, 160, true],
	["arc", "90%", "0%", 90, 300, 40],
]);

// Behind «Lo que hago»: these travel sideways with the rail.
export const RAIL_SHAPES = rows([
	["ring", "18%", "14%", 180, 700, 60],
	["triangle", "46%", "70%", 90, 1100, 140],
	["star", "72%", "12%", 48, 1500, 220, true],
	["wave", "86%", "78%", 120, 900, 0],
	["dots", "4%", "80%", 70, 500, 0],
	["diamond", "60%", "40%", 28, 1800, 180, true],
]);
