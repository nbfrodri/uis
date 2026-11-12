import { Link } from "react-router";
import { NbfHeader, pad, useSlots } from "./shared";

/** A · The monogram fills the screen and comes apart as you scroll. */
export function MonogramVariant() {
	const slots = useSlots();
	return (
		<>
			<NbfHeader />
			<main>
				<section className="mono-hero" aria-labelledby="mono-title">
					<div className="mono-stage">
						<h1 id="mono-title" className="mono-letters">
							<span className="sr-only">NBF</span>
							<span aria-hidden="true" data-letter="n">
								N
							</span>
							<span aria-hidden="true" data-letter="b">
								B
							</span>
							<span aria-hidden="true" data-letter="f">
								F
							</span>
						</h1>
						<p className="mono-claim">
							Diseño y desarrollo de interfaces.
							<br />
							Webs completas, hechas para recorrerlas.
						</p>
						<span className="mono-hint" aria-hidden="true">
							Desliza
						</span>
					</div>
				</section>

				<div className="mono-marquee" aria-hidden="true">
					<span>
						Interfaces — Interacción — Prototipos — Motion — Accesibilidad —
						Interfaces — Interacción — Prototipos — Motion — Accesibilidad —
					</span>
				</div>

				<section
					id="trabajo"
					className="mono-work"
					aria-labelledby="mono-work-title"
				>
					<header className="mono-work-head">
						<h2 id="mono-work-title">Trabajo</h2>
						<span>({pad(slots.length)})</span>
					</header>
					<ol className="mono-list">
						{slots.map((slot) =>
							slot.kind === "front" ? (
								<li key={slot.front.slug} className="mono-row">
									<Link to={`/f/${slot.front.slug}`} viewTransition>
										<span className="mono-index">{pad(slot.front.number)}</span>
										<span className="mono-name">{slot.front.title}</span>
										<span className="mono-tags">
											{slot.front.tags.join(" / ")}
										</span>
										<span className="mono-year">
											{slot.front.date.slice(0, 4)}
										</span>
										{slot.Preview && (
											<span className="mono-cover" aria-hidden="true">
												<span className="mono-cover-inner">
													<slot.Preview />
												</span>
											</span>
										)}
									</Link>
								</li>
							) : (
								<li key={slot.number} className="mono-row" data-soon>
									<div>
										<span className="mono-index">{pad(slot.number)}</span>
										<span className="mono-name">En preparación</span>
										<span className="mono-tags">Próximamente</span>
										<span className="mono-year">—</span>
									</div>
								</li>
							),
						)}
					</ol>
				</section>

				<section id="sobre" className="mono-about">
					<p>
						NBF es mi espacio para probar ideas: negocios imaginarios,
						convertidos en webs que funcionan de verdad, del primer vistazo al
						último clic.
					</p>
				</section>
			</main>
			<footer className="mono-footer">
				<span className="mono-footer-mark" aria-hidden="true">
					NBF
				</span>
				<div>
					<span>© {new Date().getFullYear()} NBF</span>
					<a href="https://github.com/nbfrodri/uis">Código en GitHub ↗</a>
				</div>
			</footer>
		</>
	);
}
