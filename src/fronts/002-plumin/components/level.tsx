import type { Level as LevelValue } from "../data";

const words: Record<LevelValue, string> = { 1: "bajo", 2: "medio", 3: "alto" };

/** Three dots for shading/drying, with the word for screen readers and clarity. */
export function Level({ value }: { value: LevelValue }) {
	return (
		<span className="inline-flex items-center gap-2">
			<span className="flex gap-1" aria-hidden="true">
				{[1, 2, 3].map((dot) => (
					<span
						key={dot}
						className={`size-2 rounded-full border border-(--ink) ${dot <= value ? "bg-(--ink)" : ""}`}
					/>
				))}
			</span>
			{words[value]}
		</span>
	);
}
