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
