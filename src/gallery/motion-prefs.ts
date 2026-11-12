import Lenis from "lenis";
import { useEffect, useSyncExternalStore } from "react";
import "lenis/dist/lenis.css";

const REDUCE = "(prefers-reduced-motion: reduce)";

/** True when the visitor asked the system for less motion (false where unsupported). */
export function usePrefersReducedMotion() {
	return useSyncExternalStore(
		(onChange) => {
			const query = window.matchMedia?.(REDUCE);
			query?.addEventListener("change", onChange);
			return () => query?.removeEventListener("change", onChange);
		},
		() => window.matchMedia?.(REDUCE).matches ?? false,
		() => false,
	);
}

/**
 * Smooth, inertial page scrolling for the home page only. Lenis drives the
 * native scroll position, so Motion's scroll hooks and anchors keep working.
 */
export function useSmoothScroll(enabled: boolean) {
	useEffect(() => {
		// Lenis needs matchMedia; without it (old engines, tests) scrolling stays native.
		if (!enabled || typeof window.matchMedia !== "function") return;
		const lenis = new Lenis({ autoRaf: true, anchors: true });
		return () => lenis.destroy();
	}, [enabled]);
}
