import { useState } from "react";
import sampleBoxPhoto from "../assets/sample-box.webp";
import { formatPrice, sampleBox } from "../data";
import { SamplePicker } from "./sample-picker";

export function SampleBoxOffer() {
	const [selected, setSelected] = useState<string[]>([]);
	const toggle = (id: string) =>
		setSelected((current) =>
			current.includes(id)
				? current.filter((value) => value !== id)
				: current.length < sampleBox.sampleCount
					? [...current, id]
					: current,
		);
	return (
		<section
			id="muestras"
			aria-labelledby="muestras-titulo"
			className="mx-auto mt-28 max-w-7xl scroll-mt-28 px-4 sm:px-8"
		>
			<div className="sample-kit">
				<div className="sample-kit-art">
					<img
						src={sampleBoxPhoto}
						alt="Caja de muestras Plumín abierta con cinco viales de tinta"
						width={1200}
						height={800}
						loading="lazy"
						decoding="async"
					/>
				</div>
				<div className="sample-kit-copy">
					<h2 id="muestras-titulo">¿No te decides?</h2>
					<p>
						Prueba antes de elegir tu frasco. Preparamos una caja con cinco de
						nuestras doce tintas: tú eliges los colores.
					</p>
					<div className="sample-kit-details">
						<span>5 viales de 4 ml</span>
						<span>El importe se descuenta de tu próximo frasco</span>
					</div>
					<p className="sample-kit-price">
						<strong>{formatPrice(sampleBox.price)}</strong>
						<span>la caja de cinco tintas</span>
					</p>
				</div>
				<SamplePicker selected={selected} onToggle={toggle} />
			</div>
		</section>
	);
}
