import sculpture from "./assets/studio-sculpture.webp";
import { ArrowIcon } from "./studio-icons";

export function GalleryHero({
	paused,
	onToggle,
}: {
	paused: boolean;
	onToggle: () => void;
}) {
	return (
		<section className="studio-hero" aria-labelledby="studio-headline">
			<div className="studio-hero-art" aria-hidden="true">
				<img
					src={sculpture}
					alt=""
					width="1536"
					height="1024"
					fetchPriority="high"
				/>
			</div>
			<div className="studio-hero-shade" aria-hidden="true" />
			<p className="studio-hero-note">
				Diseño, interacción
				<br />y un poco de curiosidad.
			</p>
			<div className="studio-hero-copy">
				<h1 id="studio-headline">
					<span className="studio-title-line">
						<span>Ideas que se</span>
					</span>{" "}
					<span className="studio-title-line">
						<span>pueden visitar.</span>
					</span>
				</h1>
				<p>
					Exploraciones digitales convertidas en webs completas. Entra, recorre
					y descubre cada una.
				</p>
				<a href="#proyectos" className="studio-hero-cta">
					Explorar proyectos{" "}
					<span>
						<ArrowIcon />
					</span>
				</a>
			</div>
			<div className="studio-hero-bottom">
				<span className="studio-scroll-hint">
					<span aria-hidden="true">↓</span> Sigue explorando
				</span>
				<button
					type="button"
					className="studio-motion-toggle"
					aria-pressed={paused}
					onClick={onToggle}
				>
					<svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
						{paused ? (
							<path d="m5 3 8 5-8 5Z" />
						) : (
							<path d="M4 3h3v10H4zm5 0h3v10H9z" />
						)}
					</svg>
					{paused ? "Activar movimiento" : "Pausar movimiento"}
				</button>
			</div>
		</section>
	);
}
