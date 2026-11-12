import {
	animate,
	type MotionValue,
	motion,
	useInView,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform,
} from "motion/react";
import {
	type ReactNode,
	type PointerEvent as ReactPointerEvent,
	useEffect,
	useRef,
	useState,
} from "react";

/* Showcase effects for the NBF home page. Each one is decorative: callers pass
   `still` for reduced motion and get the plain, readable version instead. */

const finePointer = () =>
	typeof window.matchMedia === "function" &&
	window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * A counter from 000 to 100 with a progress line, then the curtain lifts.
 * Once per browser session; `onDone` fires as the curtain starts to lift, so
 * the hero can reveal itself underneath it.
 */
export function Preloader({
	still,
	onDone,
}: {
	still: boolean;
	onDone: () => void;
}) {
	const [state, setState] = useState<"off" | "counting" | "lifting">(() => {
		if (still) return "off";
		try {
			return sessionStorage.getItem("nbf-intro") === "seen"
				? "off"
				: "counting";
		} catch {
			return "off";
		}
	});
	const [count, setCount] = useState(0);
	const progress = useMotionValue(0);
	const line = useTransform(progress, (v) => `scaleX(${v / 100})`);
	const done = useRef(onDone);
	useEffect(() => {
		done.current = onDone;
	});

	useEffect(() => {
		if (state === "off") done.current();
		if (state !== "counting") return;
		try {
			sessionStorage.setItem("nbf-intro", "seen");
		} catch {
			// Storage blocked (private mode): the intro simply plays again next time.
		}
		const controls = animate(progress, 100, {
			duration: 1.4,
			ease: [0.65, 0, 0.35, 1],
			onUpdate: (v) => setCount(Math.round(v)),
			onComplete: () => {
				setState("lifting");
				done.current();
			},
		});
		return () => controls.stop();
	}, [state, progress]);

	if (state === "off") return null;
	return (
		<motion.div
			className="nbf-preloader"
			aria-hidden="true"
			initial={{ transform: "translateY(0%)" }}
			animate={{
				transform: state === "lifting" ? "translateY(-100%)" : "translateY(0%)",
			}}
			transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
			onAnimationComplete={() => {
				if (state === "lifting") setState("off");
			}}
		>
			<span className="nbf-preloader-mark">NBF</span>
			<span className="nbf-preloader-note">
				Diseño y desarrollo
				<br />
				de interfaces
			</span>
			<span className="nbf-preloader-count">
				{String(count).padStart(3, "0")}
			</span>
			<span className="nbf-preloader-line">
				<motion.span style={{ transform: line }} />
			</span>
		</motion.div>
	);
}

/** A dot that follows the pointer and grows slightly over anything clickable. */
export function Cursor({ still }: { still: boolean }) {
	const [enabled] = useState(() => !still && finePointer());
	const x = useMotionValue(-100);
	const y = useMotionValue(-100);
	const scale = useSpring(1, { stiffness: 400, damping: 30 });
	const transform = useTransform(
		// Position follows the pointer directly (no lag); only the size eases.
		[x, y, scale],
		([px, py, s]) =>
			`translate(${px}px, ${py}px) translate(-50%, -50%) scale(${s})`,
	);

	useEffect(() => {
		if (!enabled) return;
		const move = (event: PointerEvent) => {
			x.set(event.clientX);
			y.set(event.clientY);
			const target = event.target as Element | null;
			scale.set(target?.closest("a, button") ? 1.6 : 1);
		};
		window.addEventListener("pointermove", move, { passive: true });
		document.documentElement.classList.add("nbf-has-cursor");
		return () => {
			window.removeEventListener("pointermove", move);
			document.documentElement.classList.remove("nbf-has-cursor");
		};
	}, [enabled, x, y, scale]);

	if (!enabled) return null;
	return (
		<motion.div
			className="nbf-cursor"
			aria-hidden="true"
			style={{ transform }}
		/>
	);
}

/** Pulls its child towards the pointer; the text inside moves half as far. */
export function Magnetic({
	children,
	still,
	strength = 0.35,
}: {
	children: ReactNode;
	still: boolean;
	strength?: number;
}) {
	const x = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
	const y = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
	const outer = useTransform([x, y], ([a, b]) => `translate(${a}px, ${b}px)`);
	const inner = useTransform(
		[x, y],
		([a, b]) => `translate(${Number(a) * 0.5}px, ${Number(b) * 0.5}px)`,
	);

	const onMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
		if (still || event.pointerType !== "mouse") return;
		const box = event.currentTarget.getBoundingClientRect();
		x.set((event.clientX - (box.left + box.width / 2)) * strength);
		y.set((event.clientY - (box.top + box.height / 2)) * strength);
	};
	const reset = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<motion.span
			className="nbf-magnetic"
			style={still ? undefined : { transform: outer }}
			onPointerMove={onMove}
			onPointerLeave={reset}
		>
			<motion.span style={still ? undefined : { transform: inner }}>
				{children}
			</motion.span>
		</motion.span>
	);
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=";

/** Text that scrambles through random glyphs and settles, left to right, when
 *  its link is hovered or focused. Assistive tech reads the real text. */
export function Scramble({ text, still }: { text: string; still: boolean }) {
	const [shown, setShown] = useState(text);
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const trigger = ref.current?.closest("a, button");
		if (still || !trigger) return;
		let frame = 0;
		const run = () => {
			cancelAnimationFrame(frame);
			const start = performance.now();
			const tick = (now: number) => {
				const settled = Math.floor(((now - start) / 420) * text.length);
				setShown(
					[...text]
						.map((char, i) =>
							i < settled || char === " "
								? char
								: (GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? char),
						)
						.join(""),
				);
				if (settled < text.length) frame = requestAnimationFrame(tick);
			};
			frame = requestAnimationFrame(tick);
		};
		trigger.addEventListener("pointerenter", run);
		trigger.addEventListener("focus", run);
		return () => {
			cancelAnimationFrame(frame);
			trigger.removeEventListener("pointerenter", run);
			trigger.removeEventListener("focus", run);
		};
	}, [still, text]);

	return (
		<span ref={ref} className="nbf-scramble">
			<span className="sr-only">{text}</span>
			<span aria-hidden="true">{shown}</span>
		</span>
	);
}

/** Words light up one after another as the paragraph scrolls through view. */
export function ScrollHighlight({
	text,
	still,
}: {
	text: string;
	still: boolean;
}) {
	const ref = useRef<HTMLParagraphElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 0.85", "end 0.45"],
	});
	const words = text.split(" ");
	if (still) return <p>{text}</p>;
	return (
		<p ref={ref}>
			<span className="sr-only">{text}</span>
			{words.map((word, i) => (
				<Word
					// Words repeat ("de", "que"); their position is their identity here.
					// biome-ignore lint/suspicious/noArrayIndexKey: static text, never reordered.
					key={i}
					progress={scrollYProgress}
					range={[i / words.length, (i + 1) / words.length]}
				>
					{word}
				</Word>
			))}
		</p>
	);
}

function Word({
	children,
	progress,
	range,
}: {
	children: string;
	progress: ReturnType<typeof useScroll>["scrollYProgress"];
	range: [number, number];
}) {
	const opacity = useTransform(progress, range, [0.18, 1]);
	return (
		<>
			<motion.span aria-hidden="true" style={{ opacity }}>
				{children}
			</motion.span>{" "}
		</>
	);
}

/** Tilts its content in 3D towards the pointer. */
export function Tilt({
	children,
	still,
	className,
}: {
	children: ReactNode;
	still: boolean;
	className?: string;
}) {
	const rx = useSpring(0, { stiffness: 200, damping: 20 });
	const ry = useSpring(0, { stiffness: 200, damping: 20 });
	const transform = useTransform(
		[rx, ry],
		([a, b]) => `perspective(900px) rotateX(${a}deg) rotateY(${b}deg)`,
	);
	const onMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
		if (still || event.pointerType !== "mouse") return;
		const box = event.currentTarget.getBoundingClientRect();
		const px = (event.clientX - box.left) / box.width - 0.5;
		const py = (event.clientY - box.top) / box.height - 0.5;
		rx.set(-py * 10);
		ry.set(px * 12);
	};
	return (
		<motion.span
			className={className}
			style={still ? undefined : { transform }}
			onPointerMove={onMove}
			onPointerLeave={() => {
				rx.set(0);
				ry.set(0);
			}}
		>
			{children}
		</motion.span>
	);
}

/** The footer monogram: letters rise into place, staggered, when it comes into view. */
export function FooterMark({ still }: { still: boolean }) {
	const ref = useRef<HTMLSpanElement>(null);
	// Watch the wrapper: the letters start clipped by their masks, so watching
	// them directly would never report them as visible.
	// Replays: hides again when scrolled away, rises again on return.
	const inView = useInView(ref, { amount: 0.3 });
	const shown = still || inView;
	return (
		<span ref={ref} className="nbf-footer-mark" aria-hidden="true">
			{["N", "B", "F"].map((letter, i) => (
				<span key={letter} className="nbf-footer-letter">
					<motion.span
						initial={still ? false : { transform: "translateY(100%)" }}
						animate={{
							transform: shown ? "translateY(0%)" : "translateY(100%)",
						}}
						transition={{
							duration: 0.9,
							delay: i * 0.08,
							ease: [0.23, 1, 0.32, 1],
						}}
					>
						{letter}
					</motion.span>
				</span>
			))}
		</span>
	);
}

/** A heading whose lines rise from under a mask, one after another, on view. */
export function RevealLines({
	id,
	lines,
	still,
}: {
	id: string;
	lines: string[];
	still: boolean;
}) {
	const ref = useRef<HTMLHeadingElement>(null);
	// Replays: hides again when scrolled away, rises again on return.
	const inView = useInView(ref, { amount: 0.5 });
	return (
		<h2 ref={ref} id={id} aria-label={lines.join(" ")}>
			{lines.map((line, i) => (
				<span key={line} className="nbf-reveal-line" aria-hidden="true">
					<motion.span
						initial={still ? false : { transform: "translateY(105%)" }}
						animate={{
							transform:
								still || inView ? "translateY(0%)" : "translateY(105%)",
						}}
						transition={{
							duration: 0.9,
							delay: i * 0.1,
							ease: [0.23, 1, 0.32, 1],
						}}
					>
						{line}
					</motion.span>
				</span>
			))}
		</h2>
	);
}

type Shape = {
	kind:
		| "ring"
		| "plus"
		| "star"
		| "dots"
		| "square"
		| "triangle"
		| "wave"
		| "arc"
		| "diamond"
		| "half";
	/** Position inside the section, as CSS lengths. */
	left: string;
	top: string;
	size: number;
	/** Pixels travelled across the section's pass: larger = nearer. */
	speed: number;
	/** Degrees turned across the pass. */
	spin: number;
	accent?: boolean;
};

const SHAPE_PATHS: Record<Shape["kind"], ReactNode> = {
	ring: <circle cx="50" cy="50" r="46" fill="none" strokeWidth="2" />,
	plus: <path d="M50 8v84M8 50h84" fill="none" strokeWidth="6" />,
	star: (
		<path
			d="M50 0C53 30 70 47 100 50 70 53 53 70 50 100 47 70 30 53 0 50 30 47 47 30 50 0Z"
			stroke="none"
		/>
	),
	dots: (
		<g stroke="none">
			{[15, 50, 85].flatMap((x) =>
				[15, 50, 85].map((y) => (
					<circle key={`${x}-${y}`} cx={x} cy={y} r="5" />
				)),
			)}
		</g>
	),
	square: (
		<rect
			x="6"
			y="6"
			width="88"
			height="88"
			rx="4"
			fill="none"
			strokeWidth="2"
		/>
	),
	triangle: (
		<path
			d="M50 8 94 88H6Z"
			fill="none"
			strokeWidth="2"
			strokeLinejoin="round"
		/>
	),
	wave: (
		<path
			d="M2 50c12-24 24-24 32 0s20 24 32 0 20-24 32 0"
			fill="none"
			strokeWidth="5"
			strokeLinecap="round"
		/>
	),
	arc: (
		<path
			d="M10 90A80 80 0 0 1 90 10"
			fill="none"
			strokeWidth="3"
			strokeLinecap="round"
		/>
	),
	diamond: <path d="M50 4 96 50 50 96 4 50Z" stroke="none" />,
	half: <path d="M4 60a46 46 0 0 1 92 0Z" stroke="none" />,
};

/**
 * Decorative SVG shapes that drift and turn at their own depth while a section
 * scrolls by. Pass `progress` to drive them from another timeline (a pinned
 * section), and `axis="x"` to make them travel sideways.
 */
export type { Shape };

export function ParallaxShapes({
	shapes,
	still,
	progress,
	axis = "y",
}: {
	shapes: Shape[];
	still: boolean;
	progress?: MotionValue<number>;
	axis?: "x" | "y";
}) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});
	return (
		<div ref={ref} className="nbf-shapes" aria-hidden="true">
			{shapes.map((shape) => (
				<ShapeItem
					key={`${shape.kind}-${shape.left}-${shape.top}`}
					shape={shape}
					progress={progress ?? scrollYProgress}
					axis={axis}
					still={still}
				/>
			))}
		</div>
	);
}

function ShapeItem({
	shape,
	progress,
	axis,
	still,
}: {
	shape: Shape;
	progress: MotionValue<number>;
	axis: "x" | "y";
	still: boolean;
}) {
	const transform = useTransform(
		progress,
		(v) =>
			`translate${axis === "x" ? "X" : "Y"}(${(0.5 - v) * shape.speed}px) rotate(${v * shape.spin}deg)`,
	);
	return (
		<motion.svg
			viewBox="0 0 100 100"
			className="nbf-shape"
			data-accent={shape.accent ? "" : undefined}
			style={{
				left: shape.left,
				top: shape.top,
				width: shape.size,
				height: shape.size,
				...(still ? {} : { transform }),
			}}
		>
			{SHAPE_PATHS[shape.kind]}
		</motion.svg>
	);
}

/** A loose hand-drawn line that draws itself as its section scrolls through view. */
export function ScrollDrawnLine({ still }: { still: boolean }) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 0.9", "end 0.35"],
	});
	return (
		<div ref={ref} className="nbf-drawn-line" aria-hidden="true">
			<svg viewBox="0 0 400 600" fill="none" aria-hidden="true">
				<motion.path
					d="M330 10C380 120 120 140 160 250S390 330 300 430 60 470 120 590"
					strokeWidth="2"
					strokeLinecap="round"
					style={{ pathLength: still ? 1 : scrollYProgress }}
				/>
				<motion.circle
					cx="120"
					cy="590"
					r="7"
					style={{ opacity: still ? 1 : scrollYProgress }}
				/>
			</svg>
		</div>
	);
}
