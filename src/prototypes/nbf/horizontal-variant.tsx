import { Link } from "react-router";
import { NbfHeader, pad, useSlots } from "./shared";

/** B · Vertical scroll walks a pinned rail of projects sideways. */
export function HorizontalVariant() {
	const slots = useSlots();
	return (
		<>
			<NbfHeader />
			<main>
				<section className="rail-intro" aria-labelledby="rail-title">
					<h1 id="rail-title">
						<span className="rail-mark">NBF</span>
						<span className="rail-lede">
							Interfaces que se pueden recorrer.
						</span>
					</h1>
					<p>
						Webs completas de negocios imaginarios. Baja y recorre la
						exposición.
					</p>
				</section>

				<section
					id="trabajo"
					className="rail"
					aria-labelledby="rail-work-title"
					style={{ "--panels": slots.length + 1 } as React.CSSProperties}
				>
					<div className="rail-sticky">
						<h2 id="rail-work-title" className="rail-label">
							Trabajo <span>({pad(slots.length)})</span>
						</h2>
						<ol className="rail-track">
							{slots.map((slot) =>
								slot.kind === "front" ? (
									<li key={slot.front.slug} className="rail-panel">
										<Link
											to={`/f/${slot.front.slug}`}
											viewTransition
											className="rail-card"
										>
											<span className="rail-media" aria-hidden="true">
												<span className="rail-media-inner">
													{slot.Preview && <slot.Preview />}
												</span>
											</span>
											<span className="rail-caption">
												<span className="rail-index">
													{pad(slot.front.number)}
												</span>
												<span className="rail-name">{slot.front.title}</span>
												<span className="rail-desc">
													{slot.front.description}
												</span>
											</span>
										</Link>
									</li>
								) : (
									<li key={slot.number} className="rail-panel" data-soon>
										<div className="rail-card">
											<span className="rail-media" aria-hidden="true">
												<span className="rail-soon-mark">
													{pad(slot.number)}
												</span>
											</span>
											<span className="rail-caption">
												<span className="rail-index">{pad(slot.number)}</span>
												<span className="rail-name">En preparación</span>
												<span className="rail-desc">Próximamente.</span>
											</span>
										</div>
									</li>
								),
							)}
							<li className="rail-panel rail-end">
								<p>
									¿Quieres ver cómo está hecho?
									<a href="https://github.com/nbfrodri/uis">
										Código en GitHub ↗
									</a>
								</p>
							</li>
						</ol>
						<div className="rail-progress" aria-hidden="true">
							<span />
						</div>
					</div>
				</section>

				<section id="sobre" className="rail-about">
					<p>
						NBF es mi espacio para probar ideas: negocios imaginarios,
						convertidos en webs que funcionan de verdad.
					</p>
				</section>
			</main>
			<footer className="rail-footer">
				<span>© {new Date().getFullYear()} NBF</span>
				<a href="https://github.com/nbfrodri/uis">GitHub ↗</a>
			</footer>
		</>
	);
}
