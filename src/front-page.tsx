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
		document.title = `${front.title} · Estudio digital`;
		return () => {
			document.title = "Estudio digital";
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
				<svg
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.3"
					aria-hidden="true"
				>
					<rect x="3" y="3" width="5" height="5" rx="1" />
					<rect x="12" y="3" width="5" height="5" rx="1" />
					<rect x="3" y="12" width="5" height="5" rx="1" />
					<rect x="12" y="12" width="5" height="5" rx="1" />
				</svg>
				<span>Índice</span>
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
	display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem; height: 2.75rem;
	font: 550 0.8125rem/1 "Archivo Variable", system-ui, sans-serif; letter-spacing: -0.015em;
	color: #fff; background: rgb(20 23 31 / 0.92); text-decoration: none;
	padding: 0 0.875rem; border: 1px solid rgb(255 255 255 / 0.15); border-radius: 999px;
	box-shadow: 0 8px 24px -10px rgb(20 23 31 / 0.45); backdrop-filter: blur(12px);
	transition: background-color 150ms ease;
}
/* Optical, not geometric: the grid is centred on the label's cap height, so it
   no longer hangs below the baseline. */
.front-back > svg { display: block; flex: none; width: 1rem; height: 1rem; transform: translateY(0.5px); }
.front-back > span { transform: translateY(1px); }
.front-back-key { transform: translateY(1px); padding: 0.25rem 0.3rem; border-radius: 4px; background: rgb(255 255 255 / 0.1); color: #c5cad5; font: 450 0.625rem/1 "Archivo Variable", system-ui, sans-serif; }
.front-back:hover { background: #254cff; }
.front-back:focus-visible { outline: 2px solid #254cff; outline-offset: 4px; }
body:has([role="dialog"][aria-modal="true"]) .front-back { visibility: hidden; }
@media (max-width: 40rem) { .front-back-key { display: none; } }
@media (prefers-reduced-motion: reduce) { .front-back { transition: none; } }
`;
