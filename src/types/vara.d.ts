declare module "vara" {
	interface TextBlock {
		text: string | string[];
		width?: number;
	}
	interface Options {
		fontSize?: number;
		strokeWidth?: number;
		color?: string;
		autoAnimation?: boolean;
	}
	export default class Vara {
		constructor(
			selector: string,
			fontUrl: string,
			blocks: TextBlock[],
			options?: Options,
		);
		svg: SVGSVGElement;
		preCreate(): void;
		createText(): void;
		ready(callback: () => void): void;
	}
}
