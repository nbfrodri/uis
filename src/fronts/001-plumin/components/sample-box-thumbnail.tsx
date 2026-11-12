import { findInk } from "../data";

/** A compact drawing keeps the five selected inks legible at cart-thumbnail size. */
export function SampleBoxThumbnail({ samples }: { samples?: string[] }) {
	return (
		<svg viewBox="0 0 88 112" className="size-full" aria-hidden="true">
			<g transform="rotate(-6 44 56)">
				<rect
					x="5"
					y="12"
					width="78"
					height="95"
					rx="7"
					fill="#172058"
					opacity=".08"
				/>
				<rect x="5" y="8" width="78" height="95" rx="7" fill="#e7decc" />
				<rect x="9" y="12" width="70" height="87" rx="4" fill="#f8f4eb" />
				<path d="M15 29h58" stroke="#d5ccbb" />
				<path d="m40 20 4-6 4 6-4 5z" fill="#172058" />
				{Array.from({ length: 5 }, (_, position) => {
					const id = samples?.[position];
					const color = findInk(id ?? "")?.color ?? "#c3c4ce";
					const x = 11 + position * 14;
					return (
						<g key={`vial-${x}`}>
							<rect x={x} y="40" width="10" height="47" rx="3" fill="#e5dfd3" />
							<rect
								x={x + 1}
								y="50"
								width="8"
								height="35"
								rx="2"
								fill={color}
							/>
							<path d={`M${x + 3} 44v36`} stroke="white" strokeOpacity=".35" />
							<rect
								x={x - 0.5}
								y="36"
								width="11"
								height="10"
								rx="2"
								fill="#172058"
							/>
							<rect
								x={x + 1}
								y="63"
								width="8"
								height="10"
								rx="1"
								fill="#f8f4eb"
							/>
							<path
								d={`M${x + 3} 67h4m-4 3h3`}
								stroke="#b9af9d"
								strokeWidth=".8"
							/>
						</g>
					);
				})}
			</g>
		</svg>
	);
}
