import { Label, NumberField } from "@heroui/react";
import { MAX_QTY } from "../cart";

type QuantityFieldProps = {
	value: number;
	onChange: (value: number) => void;
	label: string;
	hideLabel?: boolean;
};

export function QuantityField({
	value,
	onChange,
	label,
	hideLabel,
}: QuantityFieldProps) {
	return (
		<NumberField
			value={value}
			onChange={(next) => onChange(Number.isNaN(next) ? 1 : next)}
			minValue={1}
			maxValue={MAX_QTY}
			className="w-fit"
		>
			<Label
				className={
					hideLabel ? "sr-only" : "text-sm font-medium text-(--ink-soft)"
				}
			>
				{label}
			</Label>
			<NumberField.Group className="h-11">
				<NumberField.DecrementButton />
				<NumberField.Input className="w-10 text-center font-semibold" />
				<NumberField.IncrementButton />
			</NumberField.Group>
		</NumberField>
	);
}
