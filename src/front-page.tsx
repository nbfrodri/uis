import { Suspense, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { findFront, getFrontComponent } from "./fronts/registry";
import { NotFound } from "./not-found";

/** Esc belongs to the front while the user is in a field or a dialog is open. */
function isBusy(target: EventTarget | null): boolean {
	if (document.querySelector("dialog[open]")) return true;
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
	const Component = getFrontComponent(slug);

	useEffect(() => {
		if (!front) return;
		document.title = `${front.title} · uis`;
		return () => {
			document.title = "uis";
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

	if (!front || !Component) return <NotFound />;

	return (
		<>
			<Suspense fallback={null}>
				<Component />
			</Suspense>
			<Link
				to="/"
				viewTransition
				className="front-back"
				aria-label="Volver al índice (Esc)"
			>
				Índice
			</Link>
			<style>{backStyles}</style>
		</>
	);
}

/* Self-contained so it looks the same over any front's styles. */
const backStyles = `
.front-back {
	position: fixed; left: 1rem; bottom: 1rem; z-index: 2147483647;
	font: 600 0.875rem/1 "Funnel Sans Variable", system-ui, sans-serif; letter-spacing: 0;
	color: #1c2b4a; background: #f2e45c; text-decoration: none;
	padding: 0.6rem 0.9rem; border-radius: 999px;
	box-shadow: 0 1px 0 rgb(28 43 74 / 0.35);
	opacity: 0.55; transition: opacity 150ms ease;
}
.front-back:hover, .front-back:focus-visible { opacity: 1; }
.front-back:focus-visible { outline: 2px solid #1c2b4a; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .front-back { transition: none; } }
`;
