import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * The monogram fills the first screen and comes apart while the hero is pinned:
 * N and F drift out at different speeds, B thins and sinks, the claim appears.
 */
export function NbfHero({ still, ready }: { still: boolean; ready: boolean }) {
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

	// Outer span: scroll transform. Mask: clips the bottom edge. Inner span:
	// the load-in, rising from below the mask, one letter after another.
	// Pointer parallax: each letter sits at its own depth.
	const px = useSpring(0, { stiffness: 120, damping: 20 });
	const py = useSpring(0, { stiffness: 120, damping: 20 });
	const depth = [
		useTransform(
			[px, py],
			([a, b]) => `translate(${Number(a) * 18}px, ${Number(b) * 14}px)`,
		),
		useTransform(
			[px, py],
			([a, b]) => `translate(${Number(a) * -10}px, ${Number(b) * -8}px)`,
		),
		useTransform(
			[px, py],
			([a, b]) => `translate(${Number(a) * 26}px, ${Number(b) * 20}px)`,
		),
	];
	const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (still || event.pointerType !== "mouse") return;
		px.set(event.clientX / window.innerWidth - 0.5);
		py.set(event.clientY / window.innerHeight - 0.5);
	};

	const letter = (style: object, char: string, index: number) => (
		<motion.span aria-hidden="true" style={still ? undefined : style}>
			<motion.span
				className="nbf-hero-depth"
				style={still ? undefined : { transform: depth[index] }}
			>
				<span className="nbf-hero-mask">
					<motion.span
						initial={still ? false : { transform: "translateY(110%)" }}
						animate={
							still || ready ? { transform: "translateY(0%)" } : undefined
						}
						transition={{
							duration: 1,
							delay: 0.1 + index * 0.09,
							ease: [0.23, 1, 0.32, 1],
						}}
					>
						{char}
					</motion.span>
				</span>
			</motion.span>
		</motion.span>
	);

	return (
		<section
			ref={ref}
			className="nbf-hero"
			data-still={still}
			aria-labelledby="nbf-title"
		>
			<div className="nbf-hero-stage" onPointerMove={onPointerMove}>
				<h1 id="nbf-title" className="nbf-hero-letters">
					<span className="sr-only">NBF</span>
					{letter({ transform: n, fontVariationSettings: thin }, "N", 0)}
					{letter({ transform: b, fontVariationSettings: thinner }, "B", 1)}
					{letter({ transform: f, fontVariationSettings: thin }, "F", 2)}
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
