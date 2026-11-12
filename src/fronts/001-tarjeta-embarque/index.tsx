import "@fontsource-variable/archivo";

const details = [
	{ label: "Puerta", value: "B32" },
	{ label: "Embarque", value: "06:40" },
	{ label: "Asiento", value: "14F" },
	{ label: "Grupo", value: "3" },
];

// Decorative barcode: fixed bar positions, so x is a stable key.
const bars = Array.from({ length: 34 }, (_, i) => ({
	x: i * 3,
	width: (i * 7) % 3 === 0 ? 2 : 1,
}));

export default function BoardingPass() {
	return (
		<main className="grid min-h-dvh place-items-center bg-[#9db4c0] px-4 py-16 font-['Archivo_Variable',sans-serif] text-[#14232b]">
			<article
				aria-label="Tarjeta de embarque de Lucía Ferrer, vuelo IB 3172 de Madrid a Oporto"
				className="w-full max-w-[26rem] overflow-hidden rounded-[1.25rem] bg-[#fbfaf6] shadow-[0_24px_48px_-24px_rgb(20_35_43/0.55)]"
			>
				<header className="flex items-baseline justify-between bg-[#c8102e] px-6 py-3 text-[#fbfaf6]">
					<p className="text-sm font-semibold">IB 3172</p>
					<p className="text-sm">Jue 12 nov</p>
				</header>

				<section className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 px-6 pt-6">
					<div>
						<p className="text-[3.5rem] leading-none font-black tracking-tight">
							MAD
						</p>
						<p className="mt-1 text-sm text-[#4b5d66]">Madrid T4 · 07:15</p>
					</div>
					<svg
						viewBox="0 0 24 24"
						className="mb-7 size-6 rotate-90 fill-[#4b5d66]"
						aria-hidden="true"
					>
						<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
					</svg>
					<div className="text-right">
						<p className="text-[3.5rem] leading-none font-black tracking-tight">
							OPO
						</p>
						<p className="mt-1 text-sm text-[#4b5d66]">Oporto · 07:25</p>
					</div>
				</section>

				<p className="px-6 pt-5 text-lg font-semibold">Lucía Ferrer</p>

				<dl className="grid grid-cols-4 gap-2 px-6 pt-4 pb-6">
					{details.map(({ label, value }) => (
						<div key={label}>
							<dt className="text-xs text-[#4b5d66]">{label}</dt>
							<dd className="text-2xl font-bold tabular-nums">{value}</dd>
						</div>
					))}
				</dl>

				{/* Perforation: two notches and a dashed tear line. */}
				<div className="relative h-0 border-t-2 border-dashed border-[#d5d2c8]">
					<span className="absolute -top-3 -left-3 size-6 rounded-full bg-[#9db4c0]" />
					<span className="absolute -top-3 -right-3 size-6 rounded-full bg-[#9db4c0]" />
				</div>

				<footer className="flex items-center justify-between gap-4 px-6 py-5">
					<p className="text-sm text-[#4b5d66]">
						La puerta cierra
						<br />
						<span className="text-base font-semibold text-[#14232b]">
							20 min antes
						</span>
					</p>
					<svg viewBox="0 0 100 32" className="h-10 w-36" aria-hidden="true">
						{bars.map((bar) => (
							<rect
								key={bar.x}
								x={bar.x}
								width={bar.width}
								height="32"
								fill="#14232b"
							/>
						))}
					</svg>
				</footer>
			</article>
		</main>
	);
}
