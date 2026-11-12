import { Suspense, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { findFront, frontElement } from "./fronts/registry";
import { NotFound } from "./not-found";

/** Esc belongs to the front while the user is in a field or a dialog is open. */
function isBusy(target: EventTarget | null): boolean {
	if (
		document.querySelector("dialog[open], [role='dialog'][aria-modal='true']")
	)
		return true;
	return (
		target instanceof HTMLElement &&
		(target.isContentEditable ||
			/^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName))
	);
}

export function FrontPage() {
	const { slug = "" } = useParams();
	const navigate = useNavigate();
	const front = findFront(slug);
	const element = frontElement(slug);

	useEffect(() => {
		if (!front) return;
		document.title = `${front.title} · NBF`;
		return () => {
			document.title = "NBF";
		};
	}, [front]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (
				event.key === "Escape" &&
				!event.defaultPrevented &&
				!isBusy(event.target)
			)
				navigate("/", { viewTransition: true });
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [navigate]);

	if (!front || !element) return <NotFound />;

	return (
		<>
			<Suspense fallback={null}>{element}</Suspense>
			<Link
				to="/"
				viewTransition
				className="front-back"
				aria-label="Volver al índice (Esc)"
			>
				<span className="front-back-mark">NBF</span>
				<span className="front-back-label">Índice</span>
				<kbd className="front-back-key">Esc</kbd>
			</Link>
			<style>{backStyles}</style>
		</>
	);
}

/* Self-contained so it looks the same over any front's styles. */
const backStyles = `
.front-back {
	position: fixed; left: 1rem; bottom: max(1rem, env(safe-area-inset-bottom)); z-index: 40;
	display: inline-flex; align-items: center; gap: 0.625rem; height: 2.75rem; padding: 0 0.75rem 0 0.875rem;
	font: 500 0.8125rem/1 "Archivo Variable", system-ui, sans-serif; letter-spacing: -0.01em;
	color: #f0eee9; background: rgb(17 18 20 / 0.92); text-decoration: none;
	border: 1px solid rgb(240 238 233 / 0.14); border-radius: 0.5rem;
	box-shadow: 0 10px 30px -12px rgb(0 0 0 / 0.5); backdrop-filter: blur(12px);
	transition: background-color 150ms ease, border-color 150ms ease;
}
.front-back-mark { font-weight: 800; font-stretch: 125%; letter-spacing: -0.02em; }
.front-back-label { padding-left: 0.625rem; border-left: 1px solid rgb(240 238 233 / 0.2); }
.front-back-key { padding: 0.25rem 0.35rem; border-radius: 0.25rem; background: rgb(240 238 233 / 0.1); color: rgb(240 238 233 / 0.7); font: 500 0.625rem/1 "Archivo Variable", system-ui, sans-serif; }
.front-back:focus-visible { outline: 2px solid #3d5afe; outline-offset: 3px; }
@media (hover: hover) and (pointer: fine) {
	.front-back:hover { background: #3d5afe; border-color: #3d5afe; }
	.front-back:hover .front-back-label { border-color: rgb(240 238 233 / 0.4); }
}
body:has([role="dialog"][aria-modal="true"]) .front-back { visibility: hidden; }
@media (max-width: 40rem) { .front-back-key { display: none; } }
@media (prefers-reduced-motion: reduce) { .front-back { transition: none; } }
`;
