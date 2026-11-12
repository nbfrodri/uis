import { findInk, formatPrice, inks, mix, sampleBox } from "../data";
import { AddToCart } from "./add-to-cart";
import { Swatch } from "./swatch";

export function SamplePicker({
	selected,
	onToggle,
}: {
	selected: string[];
	onToggle: (id: string) => void;
}) {
	const complete = selected.length === sampleBox.sampleCount;
	const chosen = selected.flatMap((id) => findInk(id) ?? []);
	const slots = Array.from(
		{ length: sampleBox.sampleCount },
		(_, position) => ({
			id: chosen[position]?.id ?? `selection-${position + 1}`,
			ink: chosen[position],
		}),
	);
	return (
		<div className="sample-kit-picker">
			<div className="sample-catalog">
				<fieldset>
					<legend>Encuentra tus cinco tintas</legend>
					<p className="sample-catalog-hint">
						Mira el color, elige las que te gusten y compón tu caja.
					</p>
					<div className="sample-choices">
						{inks.map((ink, index) => (
							<label className="sample-choice" key={ink.id}>
								<input
									className="sr-only"
									type="checkbox"
									aria-label={ink.name}
									checked={selected.includes(ink.id)}
									disabled={complete && !selected.includes(ink.id)}
									onChange={() => onToggle(ink.id)}
								/>
								<span
									className="sample-choice-art"
									style={{ backgroundColor: mix(ink.color, "#ffffff", 0.9) }}
									aria-hidden="true"
								>
									<Swatch
										color={ink.color}
										sheen={ink.sheen}
										seed={index + 91}
									/>
								</span>
								<span className="sample-choice-copy">
									<strong>{ink.name}</strong>
									<span>{ink.maker}</span>
								</span>
								<span className="sample-choice-check" aria-hidden="true">
									{/* Disc and mark share one SVG so every card rasterises them
									    identically. The tick sits a touch up and right of its box
									    centre: its weight is in the lower-left vertex. */}
									<svg
										aria-hidden="true"
										viewBox="0 0 16 16"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.6"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<circle cx="8" cy="8" r="7.5" stroke="none" />
										<path
											d={
												selected.includes(ink.id)
													? "M4.75 7.9l2.3 2.3 4.6-4.9"
													: "M8 4.75v6.5M4.75 8h6.5"
											}
										/>
									</svg>
								</span>
							</label>
						))}
					</div>
				</fieldset>
			</div>
			<aside
				className="sample-selection-summary"
				aria-labelledby="sample-selection-title"
			>
				<div className="sample-selection-heading">
					<h3 id="sample-selection-title">Tu caja</h3>
					<output
						aria-label="Tintas elegidas"
						className="sample-selection-status"
					>
						{selected.length}/{sampleBox.sampleCount}
					</output>
				</div>
				<div className="sample-selection-tray">
					{slots.map(({ id, ink }) => (
						<span
							className="sample-selection-slot"
							key={id}
							data-filled={Boolean(ink)}
							style={
								ink
									? { backgroundColor: mix(ink.color, "#ffffff", 0.88) }
									: undefined
							}
						>
							{ink ? (
								<>
									<span className="sample-selection-art" aria-hidden="true">
										<Swatch color={ink.color} sheen={ink.sheen} seed={101} />
									</span>
									<button
										type="button"
										className="sample-selection-remove"
										aria-label={`Quitar ${ink.name} de la caja`}
										title={ink.name}
										onClick={() => onToggle(ink.id)}
									>
										<svg
											viewBox="0 0 16 16"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											aria-hidden="true"
										>
											<path d="m4 4 8 8M12 4l-8 8" />
										</svg>
									</button>
								</>
							) : (
								<span aria-hidden="true">+</span>
							)}
						</span>
					))}
				</div>
				<div className="sample-selection-total">
					<span>Caja de 5 × 4 ml</span>
					<strong>{formatPrice(sampleBox.price)}</strong>
				</div>
				<div className="sample-kit-buy">
					<AddToCart
						id={sampleBox.id}
						label="Añadir la caja"
						unit={["caja", "cajas"]}
						samples={selected}
						disabled={!complete}
					/>
				</div>
			</aside>
		</div>
	);
}
