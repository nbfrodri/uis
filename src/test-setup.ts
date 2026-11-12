import "@testing-library/jest-dom/vitest";

// jsdom has no IntersectionObserver; Motion's whileInView needs one.
class NoopIntersectionObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords() {
		return [];
	}
}
if (!("IntersectionObserver" in globalThis))
	Object.assign(globalThis, { IntersectionObserver: NoopIntersectionObserver });
