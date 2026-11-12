import { buttonVariants } from "@heroui/react";
import { type CSSProperties, useEffect, useState } from "react";
import { Label, Radio, RadioGroup } from "react-aria-components";
import { findInk, formatPrice, type Ink } from "../data";
import { LogoMark } from "./logo";
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

/** Swatches peeking out behind the paper, drifting at different speeds as the page scrolls. */
const backdrop = [
	{
		id: "lavanda-de-brihuega",
		className: "-left-6 top-6 h-64 w-28",
		tilt: -10,
		drift: -50,
	},
	{
		id: "aceituna",
		className: "-right-4 -top-6 h-56 w-24",
		tilt: 8,
		drift: -140,
	},
	{
		id: "tabaco",
		className: "right-10 -bottom-10 h-48 w-24",
		tilt: -4,
		drift: -220,
	},
].flatMap((layer) => {
	const ink = findInk(layer.id);
	return ink ? [{ ...layer, ink }] : [];
});

const MS_PER_CHARACTER = 38;

const sentence = (ink: Ink) =>
	`Querida Elena: te escribo con ${ink.name}. Fíjate en cómo cambia el trazo.`;

function usePrefersReducedMotion() {
	const [reduced, setReduced] = useState(
		() => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
	);
	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduced(query.matches);
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	}, []);
	return reduced;
}

/** Reveals `text` one character at a time; restarts whenever the text changes. */
function useHandwriting(text: string, enabled: boolean) {
	const [shown, setShown] = useState(enabled ? 0 : text.length);
	useEffect(() => {
		if (!enabled) {
			setShown(text.length);
			return;
		}
		setShown(0);
		const timer = window.setInterval(() => {
			setShown((count) => {
				if (count >= text.length) {
					window.clearInterval(timer);
					return count;
				}
				return count + 1;
			});
		}, MS_PER_CHARACTER);
		return () => window.clearInterval(timer);
	}, [text, enabled]);
	return text.slice(0, shown);
}

export function HeroWriting() {
	const [inkId, setInkId] = useState(choices[0]?.id ?? "");
	const ink = choices.find((choice) => choice.id === inkId) ?? choices[0];
	const reduced = usePrefersReducedMotion();
	const full = ink ? sentence(ink) : "";
	const written = useHandwriting(full, !reduced);
	if (!ink) return null;
	const done = written.length === full.length;

	return (
		<section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-10 pb-20 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:pt-16">
			<div>
				<h1 className="max-w-[11ch] text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-extrabold tracking-[-0.045em]">
					Tinta para escribir a mano.
				</h1>
				<p className="mt-6 max-w-[40ch] text-lg text-(--ink-soft) sm:text-xl">
					Doce tintas de tres talleres pequeños. Elige una y mira cómo escribe
					antes de comprarla.
				</p>
				<div className="mt-8 flex flex-wrap gap-3">
					<SiteLink
						to="tintas"
						className={buttonVariants({
							size: "lg",
							className: "px-7 font-semibold",
						})}
					>
						Ver las tintas
					</SiteLink>
					<SiteLink
						to="#muestras"
						className={buttonVariants({
							size: "lg",
							variant: "secondary",
							className: "px-7 font-semibold",
						})}
					>
						Pedir muestras
					</SiteLink>
				</div>
			</div>

			<div>
				<div className="relative">
					<div aria-hidden="true">
						{backdrop.map((layer, i) => (
							<div
								key={layer.id}
								className={`parallax-layer absolute ${layer.className}`}
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

					<figure className="relative rotate-[-1.5deg] rounded-2xl bg-white px-7 pt-6 pb-8 shadow-[0_30px_60px_-30px_rgb(23_32_88/0.45),0_0_0_1px_rgb(23_32_88/0.06)] sm:px-10">
						<div className="flex items-center justify-between text-sm text-(--ink-soft)">
							<span>Hoja de prueba</span>
							<span>Plumín medio, papel de 90 g</span>
						</div>
						<p
							className="ruled font-hand mt-3 min-h-[8.25rem] text-[clamp(1.9rem,3.2vw,2.4rem)]"
							style={{ color: ink.color, transition: "color 300ms ease" }}
						>
							<span aria-hidden="true">
								{written}
								{!done && (
									<LogoMark
										className="ml-0.5 inline-block size-6 -translate-y-1 rotate-[200deg] align-baseline"
										cutout="#fff"
									/>
								)}
							</span>
							<span className="sr-only">{full}</span>
						</p>
						<figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
							<span className="text-lg font-bold">{ink.name}</span>
							<span className="text-(--ink-soft)">
								{formatPrice(ink.price)}{" "}
								<SiteLink
									to={`tintas/${ink.id}`}
									className="ml-2 font-semibold text-(--ink) underline underline-offset-4"
								>
									Ver la tinta
								</SiteLink>
							</span>
						</figcaption>
					</figure>
				</div>

				<RadioGroup
					value={ink.id}
					onChange={setInkId}
					orientation="horizontal"
					className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3"
				>
					<Label className="mr-1 font-semibold">Prueba otra tinta</Label>
					{choices.map((choice) => (
						<Radio
							key={choice.id}
							value={choice.id}
							aria-label={choice.name}
							className="size-10 cursor-pointer rounded-full ring-offset-2 ring-offset-white outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-(--ink) data-[selected]:ring-2 data-[selected]:ring-(--ink)"
							style={{ background: choice.color }}
						/>
					))}
				</RadioGroup>
			</div>
		</section>
	);
}
