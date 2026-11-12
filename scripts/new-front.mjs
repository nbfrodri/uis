#!/usr/bin/env node
// Usage: pnpm new-front <slug> ["Título del front"]
import { cpSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [rawSlug, title] = process.argv.slice(2);
const slug = rawSlug
	?.normalize("NFD")
	.replace(/[̀-ͯ]/g, "")
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, "-")
	.replace(/^-|-$/g, "");

if (!slug) {
	console.error('Uso: pnpm new-front <slug> ["Título"]');
	process.exit(1);
}

const frontsDir = join(import.meta.dirname, "..", "src", "fronts");
const numbers = readdirSync(frontsDir)
	.map((name) => /^(\d+)-/.exec(name)?.[1])
	.filter(Boolean)
	.map(Number);
const next = String(Math.max(0, ...numbers) + 1).padStart(3, "0");
const folder = `${next}-${slug}`;
const target = join(frontsDir, folder);

cpSync(join(frontsDir, "_template"), target, {
	recursive: true,
	errorOnExist: true,
	force: false,
});

const date = new Date().toISOString().slice(0, 10);
const displayTitle =
	title ?? slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
for (const file of readdirSync(target)) {
	const path = join(target, file);
	const content = readFileSync(path, "utf8")
		.replaceAll("__TITLE__", displayTitle)
		.replaceAll("__DATE__", date);
	writeFileSync(path, content);
}

console.log(`Creado src/fronts/${folder} → /f/${folder}`);
