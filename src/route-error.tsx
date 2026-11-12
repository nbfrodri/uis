import "./gallery/gallery.css";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

function describe(error: unknown): string {
	if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
	if (error instanceof Error) return error.message;
	return String(error);
}

/** Shown when a page or front throws, instead of the router's developer screen. */
export function RouteError() {
	const error = useRouteError();
	return (
		<div className="gallery">
			<h1 className="gallery-title">Algo ha fallado en esta página</h1>
			<p className="gallery-empty" style={{ marginTop: "1.5rem" }}>
				Recarga para intentarlo de nuevo. <Link to="/">Volver al índice</Link>
			</p>
			{/* The message helps while practising; this is a local learning project. */}
			<pre
				style={{ marginTop: "1.5rem", whiteSpace: "pre-wrap", opacity: 0.75 }}
			>
				{describe(error)}
			</pre>
		</div>
	);
}
