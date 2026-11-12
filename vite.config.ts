import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	// MapLibre loads its worker relative to its own file; pre-bundling moves that file and breaks the worker.
	optimizeDeps: { exclude: ["maplibre-gl"] },
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test-setup.ts"],
		css: false,
	},
});
