import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * The monogram fills the first screen and comes apart while the hero is pinned:
 * N and F drift out at different speeds, B thins and sinks, the claim appears.
 */
export function NbfHero({ still }: { still: boolean }) {
	const ref = useRef<HTMLElement>(null);
	const { scrollYProgress: p } = useScroll({
		target: ref,
		offset: ["start start", "end end"],
	});

	// Full transform strings: Motion composites them on the GPU.
	const n = useTransform(
		p,
		(v) => `translate(${-22 * v}vw, ${-14 * v}vh) rotate(${-6 * v}deg)`,
	);
	const b = useTransform(
		p,
		(v) => `translateY(${-4 * v}vh) scale(${1 - 0.5 * v})`,
	);
	const f = useTransform(
		p,
		(v) => `translate(${24 * v}vw, ${10 * v}vh) rotate(${5 * v}deg)`,
	);
	const thin = useTransform(
		p,
		(v) => `"wght" ${900 - 600 * v}, "wdth" ${125 - 63 * v}`,
	);
	const thinner = useTransform(p, (v) => `"wght" ${900 - 800 * v}, "wdth" 125`);
	const claim = useTransform(p, [0.35, 0.7], [0, 1]);
	const claimY = useTransform(p, (v) => {
		const t = Math.min(1, Math.max(0, (v - 0.35) / 0.35));
		return `translateY(${(1 - t) * 1.5}rem)`;
	});
	const hint = useTransform(p, [0, 0.15], [1, 0]);

	const letter = (style: object, char: string) => (
		<motion.span aria-hidden="true" style={still ? undefined : style}>
			{char}
		</motion.span>
	);

	return (
		<section
			ref={ref}
			className="nbf-hero"
			data-still={still}
			aria-labelledby="nbf-title"
		>
			<div className="nbf-hero-stage">
				<h1 id="nbf-title" className="nbf-hero-letters">
					<span className="sr-only">NBF</span>
					{letter({ transform: n, fontVariationSettings: thin }, "N")}
					{letter({ transform: b, fontVariationSettings: thinner }, "B")}
					{letter({ transform: f, fontVariationSettings: thin }, "F")}
				</h1>
				<motion.p
					className="nbf-hero-claim"
					style={still ? undefined : { opacity: claim, transform: claimY }}
				>
					Diseño y desarrollo de interfaces.
					<br />
					Webs completas, hechas para recorrerlas.
				</motion.p>
				<motion.span
					className="nbf-hero-hint"
					aria-hidden="true"
					style={still ? undefined : { opacity: hint }}
				>
					Desliza
				</motion.span>
			</div>
		</section>
	);
}
