import "./gallery/gallery.css";
import { Link } from "react-router";

export function NotFound() {
	return (
		<div className="gallery">
			<h1 className="gallery-title">Esta página no existe</h1>
			<p className="gallery-empty" style={{ marginTop: "1.5rem" }}>
				Puede que esa web se haya renombrado.{" "}
				<Link to="/">Volver al índice</Link>
			</p>
		</div>
	);
}
