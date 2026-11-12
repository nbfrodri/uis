import {
	motion,
	useAnimationFrame,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform,
	useVelocity,
} from "motion/react";
import { useRef } from "react";

const BANDS = [
	{
		words: ["Interfaces", "Interacción", "Prototipos", "Motion"],
		direction: -1,
		speed: 3,
	},
	{
		words: ["Accesibilidad", "Rendimiento", "Diseño", "Código"],
		direction: 1,
		speed: 2.4,
	},
	{
		words: ["Webs completas", "Hechas para recorrerlas", "NBF"],
		direction: -1,
		speed: 1.8,
	},
] as const;

/** Keeps v inside [min, max), so the copy loops without a seam. */
const wrap = (min: number, max: number, v: number) => {
	const range = max - min;
	return ((((v - min) % range) + range) % range) + min;
};

function Band({
	words,
	direction,
	speed,
	still,
}: {
	words: readonly string[];
	direction: 1 | -1;
	speed: number;
	still: boolean;
}) {
	const offset = useMotionValue(0);
	const { scrollY } = useScroll();
	const velocity = useSpring(useVelocity(scrollY), {
		damping: 50,
		stiffness: 400,
	});
	const boost = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
	const heading = useRef<number>(direction);
	// Fast scrolling leans the words, like type under inertia.
	const skew = useTransform(velocity, [-2500, 0, 2500], [10, 0, -10]);
	const transform = useTransform(
		[offset, skew],
		([v, k]) =>
			`translateX(${wrap(-50, 0, Number(v))}%) skewX(${still ? 0 : k}deg)`,
	);

	// Drifts on its own; scrolling speeds it up, and scrolling back up turns it round.
	useAnimationFrame((_, delta) => {
		if (still) return;
		const push = boost.get();
		if (push < 0) heading.current = -direction;
		else if (push > 0) heading.current = direction;
		const step = heading.current * speed * (delta / 1000);
		offset.set(offset.get() + step + step * Math.abs(push));
	});

	// Two identical halves: shifting by -50% lands exactly on the second one.
	const half = (
		<span className="nbf-band-half">
			{(["a", "b"] as const).flatMap((round) =>
				words.map((word) => (
					<span key={`${round}-${word}`}>
						{word}
						<i aria-hidden="true">✦</i>
					</span>
				)),
			)}
		</span>
	);

	return (
		<div className="nbf-band" data-direction={direction}>
			<motion.div className="nbf-band-track" style={{ transform }}>
				{half}
				{half}
			</motion.div>
		</div>
	);
}

/** Three crossing bands that drift in alternate directions. Decorative. */
export function MarqueeBands({ still }: { still: boolean }) {
	return (
		<div className="nbf-bands" aria-hidden="true">
			{BANDS.map((band) => (
				<Band key={band.words[0]} {...band} still={still} />
			))}
		</div>
	);
}
