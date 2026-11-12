import { useId } from "react";
import { mix } from "../data";

type SwatchProps = {
	color: string;
	sheen?: string;
	/** Varies the brush shape so a row of swatches doesn't look stamped. */
	seed?: number;
	className?: string;
};

/**
 * A swab of ink as it looks on paper: lighter where the stroke thins,
 * pooled and darker at the bottom, with the sheen showing on the pooled edge.
 */
export function Swatch({ color, sheen, seed = 1, className }: SwatchProps) {
	const id = useId().replace(/:/g, "");
	return (
		<svg
			viewBox="0 0 100 160"
			preserveAspectRatio="none"
			className={className}
			aria-hidden="true"
		>
			<defs>
				<linearGradient id={`g${id}`} x1="0" y1="0" x2="0.15" y2="1">
					<stop offset="0" stopColor={mix(color, "#ffffff", 0.55)} />
					<stop offset="0.35" stopColor={mix(color, "#ffffff", 0.2)} />
					<stop offset="0.8" stopColor={color} />
					<stop offset="1" stopColor={mix(color, "#000000", 0.35)} />
				</linearGradient>
				<filter id={`f${id}`} x="-5%" y="-5%" width="110%" height="110%">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.035 0.09"
						numOctaves="2"
						seed={seed}
					/>
					<feDisplacementMap in="SourceGraphic" scale="9" />
				</filter>
			</defs>
			<g filter={`url(#f${id})`}>
				<path
					d="M14 10 Q50 2 86 9 L90 140 Q52 156 10 146 Z"
					fill={`url(#g${id})`}
				/>
				{sheen && (
					<path
						d="M12 138 Q52 150 89 134"
						fill="none"
						stroke={sheen}
						strokeWidth="5"
						strokeLinecap="round"
						opacity="0.75"
					/>
				)}
			</g>
		</svg>
	);
}
