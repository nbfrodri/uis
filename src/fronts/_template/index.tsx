// Each front is a whole site: it owns its fonts, CSS and pages.
// Paths are relative to /f/<slug>/, so <Link to="sobre"> opens /f/<slug>/sobre.
import { Link, Route, Routes } from "react-router";

function Home() {
	return (
		<main className="grid min-h-dvh place-items-center bg-white p-6 text-neutral-900">
			<div>
				<h1 className="text-3xl font-semibold">__TITLE__</h1>
				<Link to="sobre" className="underline">
					Sobre nosotros
				</Link>
			</div>
		</main>
	);
}

function About() {
	return (
		<main className="grid min-h-dvh place-items-center bg-white p-6 text-neutral-900">
			<div>
				<h1 className="text-3xl font-semibold">Sobre nosotros</h1>
				<Link to=".." className="underline">
					Inicio
				</Link>
			</div>
		</main>
	);
}

function Missing() {
	return (
		<main className="grid min-h-dvh place-items-center bg-white p-6 text-neutral-900">
			<p>
				Esta página no existe. <Link to="..">Volver al inicio</Link>
			</p>
		</main>
	);
}

export default function Site() {
	return (
		<Routes>
			<Route index element={<Home />} />
			<Route path="sobre" element={<About />} />
			<Route path="*" element={<Missing />} />
		</Routes>
	);
}
