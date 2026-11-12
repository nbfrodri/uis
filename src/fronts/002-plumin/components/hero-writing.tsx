import { buttonVariants } from "@heroui/react";
import { type CSSProperties, useEffect, useState } from "react";
import { Radio, RadioGroup } from "react-aria-components";
import { findInk, formatPrice } from "../data";
import { LogoMark } from "./logo";
import { SiteLink } from "./site-link";
import { Swatch } from "./swatch";

const HEADLINE = "Tinta para escribir a mano.";
const MS_PER_CHARACTER = 70;

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

/** Reveals `text` one character at a time; restarts whenever `restartKey` changes. */
function useHandwriting(text: string, restartKey: string, enabled: boolean) {
	const [shown, setShown] = useState(enabled ? 0 : text.length);
	// biome-ignore lint/correctness/useExhaustiveDependencies: restartKey is the trigger to write again.
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
	}, [text, restartKey, enabled]);
	return text.slice(0, shown);
}

/**
 * The headline is the product demo: it writes itself, by hand, in the chosen ink.
 */
export function HeroWriting() {
	const [inkId, setInkId] = useState(choices[0]?.id ?? "");
	const ink = choices.find((choice) => choice.id === inkId) ?? choices[0];
	const reduced = usePrefersReducedMotion();
	const written = useHandwriting(HEADLINE, inkId, !reduced);
	if (!ink) return null;
	const done = written.length === HEADLINE.length;

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
					<h1
						className="ruled font-hand min-h-[2.62em] text-[clamp(3.25rem,9vw,7.5rem)] font-semibold"
						style={{ color: ink.color, transition: "color 300ms ease" }}
					>
						<span aria-hidden="true">
							{written}
							{!done && (
								<LogoMark
									className="ml-1 inline-block size-[0.45em] -translate-y-[0.15em] rotate-[200deg]"
									cutout="#fff"
								/>
							)}
						</span>
						<span className="sr-only">{HEADLINE}</span>
					</h1>
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
