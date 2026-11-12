/**
 * Plumín's mark: a fountain-pen nib whose breather hole is an ink drop.
 * The slit runs from the drop to the tip, the way ink actually flows.
 */
type LogoMarkProps = {
	className?: string;
	/** Colour of the drop and slit cut out of the nib: the background it sits on. */
	cutout?: string;
};

export function LogoMark({
	className = "size-8",
	cutout = "var(--paper, #fff)",
}: LogoMarkProps) {
	return (
		<svg viewBox="0 0 32 32" className={className} aria-hidden="true">
			<path
				d="M7 3h18l1.6 8.4c.6 3.2-.4 6.4-2.6 8.8L16 30l-8-9.8c-2.2-2.4-3.2-5.6-2.6-8.8Z"
				fill="currentColor"
			/>
			<path
				d="M16 9.2c1.9 2.3 2.8 3.9 2.8 5.2a2.8 2.8 0 0 1-5.6 0c0-1.3.9-2.9 2.8-5.2Z"
				fill={cutout}
			/>
			<path
				d="M16 17.4V28"
				stroke={cutout}
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function Logo({ className }: { className?: string }) {
	return (
		<span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
			<LogoMark className="size-8 text-(--ink)" />
			<span className="text-[1.6rem] leading-none font-extrabold tracking-[-0.04em]">
				plumín
			</span>
		</span>
	);
}
