import {
	animate,
	motion,
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

/** A dot that trails the pointer and grows over anything clickable. */
export function Cursor({ still }: { still: boolean }) {
	const [enabled] = useState(() => !still && finePointer());
	const x = useMotionValue(-100);
	const y = useMotionValue(-100);
	const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
	const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
	const scale = useSpring(1, { stiffness: 400, damping: 30 });
	const transform = useTransform(
		[sx, sy, scale],
		([px, py, s]) =>
			`translate(${px}px, ${py}px) translate(-50%, -50%) scale(${s})`,
	);

	useEffect(() => {
		if (!enabled) return;
		const move = (event: PointerEvent) => {
			x.set(event.clientX);
			y.set(event.clientY);
			const target = event.target as Element | null;
			scale.set(target?.closest("a, button") ? 3.2 : 1);
		};
		window.addEventListener("pointermove", move);
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

const madrid = new Intl.DateTimeFormat("es-ES", {
	hour: "2-digit",
	minute: "2-digit",
	timeZone: "Europe/Madrid",
});

/** Local time in Madrid, refreshed every 20 seconds. */
export function MadridClock() {
	const [time, setTime] = useState("");
	useEffect(() => {
		const update = () => setTime(madrid.format(new Date()));
		update();
		const id = window.setInterval(update, 20_000);
		return () => window.clearInterval(id);
	}, []);
	return (
		<span className="nbf-clock">
			Madrid <time>{time}</time>
		</span>
	);
}

/** The footer monogram: letters rise into place, staggered, when it comes into view. */
export function FooterMark({ still }: { still: boolean }) {
	return (
		<span className="nbf-footer-mark" aria-hidden="true">
			{["N", "B", "F"].map((letter, i) => (
				<span key={letter} className="nbf-footer-letter">
					<motion.span
						initial={still ? false : { transform: "translateY(100%)" }}
						whileInView={{ transform: "translateY(0%)" }}
						viewport={{ once: true, amount: 0.4 }}
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
