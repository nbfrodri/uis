import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/caveat";
import "./preview.css";
import { BagIcon, MenuIcon } from "./components/icons";
import { Logo } from "./components/logo";
import { Swatch } from "./components/swatch";
import { findInk, formatPrice, mix } from "./data";

const samples = ["azul-real", "granada", "musgo-de-ordesa", "ciruela"].flatMap(
	(id) => findInk(id) ?? [],
);

/** A static, code-native composition of the shop; no second app or live iframe. */
export default function PluminPreview() {
	const granada = findInk("granada");
	if (!granada) return null;
	return (
		<div className="plumin-preview">
			<span className="preview-caption">Plumín / Tintas para pluma</span>
			<div className="preview-browser">
				<div className="preview-browser-bar">
					<span>
						<i />
						<i />
						<i />
					</span>
					<span>plumin.tienda</span>
					<span />
				</div>
				<div className="preview-shop-nav">
					<Logo />
					<span>Tintas　 Taller　 Visítanos</span>
					<BagIcon />
				</div>
				<div className="preview-shop-hero">
					<Swatch
						color="#7a68b0"
						seed={61}
						className="preview-loose-swatch preview-loose-left"
					/>
					<Swatch
						color="#4f6b2e"
						seed={62}
						className="preview-loose-swatch preview-loose-right"
					/>
					<div className="preview-paper">
						Tinta para
						<br />
						escribir a mano.
					</div>
					<div className="preview-shop-colors">
						<span>
							{samples.map((ink) => (
								<i key={ink.id} style={{ backgroundColor: ink.color }} />
							))}
						</span>
						<span>Azul real escolar</span>
						<strong>Ver las doce tintas</strong>
					</div>
				</div>
				<div className="preview-shop-products">
					<strong>Llegadas este otoño</strong>
					<div>
						{samples.map((ink, index) => (
							<div key={ink.id}>
								<div
									style={{ backgroundColor: mix(ink.color, "#ffffff", 0.9) }}
								>
									<Swatch
										color={ink.color}
										sheen={ink.sheen}
										seed={index + 71}
									/>
								</div>
								<span>{ink.name}</span>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="preview-phone">
				<div className="preview-phone-island" />
				<div className="preview-phone-nav">
					<MenuIcon />
					<Logo />
					<BagIcon />
				</div>
				<div className="preview-phone-content">
					<span>Tintas / Rojos</span>
					<strong>{granada.name}</strong>
					<div
						className="preview-phone-swatch"
						style={{ backgroundColor: mix(granada.color, "#ffffff", 0.9) }}
					>
						<Swatch color={granada.color} sheen={granada.sheen} seed={78} />
					</div>
					<span>Casa Ordóñez</span>
					<b>{formatPrice(granada.price)}</b>
					<span className="preview-phone-button">Añadir al carrito</span>
				</div>
			</div>
		</div>
	);
}
