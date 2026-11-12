export function ArrowIcon({
	className = "studio-arrow",
}: {
	className?: string;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
		>
			<path d="M5 19 19 5M5 5h14v14" />
		</svg>
	);
}

export function StudioMark() {
	return (
		<svg
			viewBox="0 0 40 40"
			fill="none"
			className="studio-mark"
			aria-hidden="true"
		>
			<path
				d="M20 3v34M3 20h34M8 8l24 24M8 32 32 8"
				stroke="currentColor"
				strokeWidth="5"
			/>
		</svg>
	);
}
