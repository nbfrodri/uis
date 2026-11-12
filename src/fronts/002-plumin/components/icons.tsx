// Small stroke icons drawn for Plumín, so the shop doesn't need an icon package.
type IconProps = { className?: string };

const base = {
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.8,
	strokeLinecap: "round",
	strokeLinejoin: "round",
} as const;

export const BagIcon = ({ className = "size-5" }: IconProps) => (
	<svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
		<path d="M5 8h14l-1.2 12H6.2Z" />
		<path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
	</svg>
);

export const MenuIcon = ({ className = "size-5" }: IconProps) => (
	<svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
		<path d="M4 7h16M4 12h16M4 17h10" />
	</svg>
);

export const StarIcon = ({ className = "size-4" }: IconProps) => (
	<svg viewBox="0 0 24 24" className={className} aria-hidden="true">
		<path
			fill="currentColor"
			d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7Z"
		/>
	</svg>
);

export const RouteIcon = ({ className = "size-4" }: IconProps) => (
	<svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
		<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
		<circle cx="12" cy="9.5" r="2.5" />
	</svg>
);

export const PhoneIcon = ({ className = "size-4" }: IconProps) => (
	<svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
		<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
	</svg>
);

export const BookmarkIcon = ({ className = "size-4" }: IconProps) => (
	<svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
		<path d="M6 4h12v17l-6-4-6 4Z" />
	</svg>
);
