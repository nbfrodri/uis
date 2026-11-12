import { buttonVariants } from "@heroui/react";
import { type CSSProperties, useState } from "react";
import { Radio, RadioGroup } from "react-aria-components";
import { findInk, formatPrice } from "../data";
import { HandwrittenTitle } from "./handwritten-title";
import { SiteLink } from "./site-link";
import { Swatch } from "./swatch";

const choices = [
	"azul-real",
	"mar-de-bizkaia",
	"granada",
	"musgo-de-ordesa",
	"pimenton",
	"ciruela",
].flatMap((id) => findInk(id) ?? []);

/** Swatches peeking out around the sheet, drifting at different speeds as the page scrolls. */
const backdrop = [
	{
		id: "lavanda-de-brihuega",
		className: "-left-10 top-10 h-72 w-32",
		tilt: -12,
		drift: -60,
	},
	{
		id: "aceituna",
		className: "-right-8 -top-8 h-64 w-28",
		tilt: 9,
		drift: -150,
	},
	{
		id: "tabaco",
		className: "right-24 -bottom-16 h-56 w-28",
		tilt: -5,
		drift: -240,
	},
	{
		id: "pimenton",
		className: "left-1/3 -bottom-12 h-40 w-24",
		tilt: 6,
		drift: -100,
	},
].flatMap((layer) => {
	const ink = findInk(layer.id);
	return ink ? [{ ...layer, ink }] : [];
});

/**
 * The headline is the product demo: it writes itself, by hand, in the chosen ink.
 */
export function HeroWriting() {
	const [inkId, setInkId] = useState(choices[0]?.id ?? "");
	const ink = choices.find((choice) => choice.id === inkId) ?? choices[0];
	if (!ink) return null;

	return (
		<section className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-8 lg:pt-14">
			<div className="relative">
				<div aria-hidden="true">
					{backdrop.map((layer, i) => (
						<div
							key={layer.id}
							className={`parallax-layer absolute hidden sm:block ${layer.className}`}
							style={
								{
									"--tilt": `${layer.tilt}deg`,
									"--drift": `${layer.drift}px`,
								} as CSSProperties
							}
						>
							<Swatch
								color={layer.ink.color}
								sheen={layer.ink.sheen}
								seed={i + 50}
								className="size-full"
							/>
						</div>
					))}
				</div>

				<div className="relative mx-auto max-w-5xl rotate-[-1deg] rounded-3xl bg-white px-6 pt-8 pb-12 shadow-[0_40px_80px_-40px_rgb(23_32_88/0.5),0_0_0_1px_rgb(23_32_88/0.06)] sm:px-14 sm:pt-12 sm:pb-16">
					<HandwrittenTitle color={ink.color} />
				</div>
			</div>

			<div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-between gap-6">
				<RadioGroup
					aria-label="Elige la tinta con la que se escribe"
					value={ink.id}
					onChange={setInkId}
					orientation="horizontal"
					className="flex flex-wrap items-center gap-3"
				>
					{choices.map((choice) => (
						<Radio
							key={choice.id}
							value={choice.id}
							aria-label={choice.name}
							className="size-11 cursor-pointer rounded-full ring-offset-2 ring-offset-white outline-none transition-transform data-[focus-visible]:ring-2 data-[focus-visible]:ring-(--ink) data-[selected]:scale-110 data-[selected]:ring-2 data-[selected]:ring-(--ink)"
							style={{ background: choice.color }}
						/>
					))}
				</RadioGroup>

				<p className="flex items-baseline gap-3 text-lg">
					<SiteLink
						to={`tintas/${ink.id}`}
						className="font-bold underline-offset-4 hover:underline"
					>
						{ink.name}
					</SiteLink>
					<span className="text-(--ink-soft)">{formatPrice(ink.price)}</span>
				</p>

				<SiteLink
					to="tintas"
					className={buttonVariants({
						size: "lg",
						className: "px-7 font-semibold",
					})}
				>
					Ver las doce tintas
				</SiteLink>
			</div>
		</section>
	);
}
