import { Chip } from "@heroui/react";

const sessions = [
	{
		id: "inglesa",
		title: "Caligrafía inglesa desde cero",
		date: "Sábado 21 de noviembre, 11:00",
		seats: 3,
		total: 8,
		price: "35 €",
	},
	{
		id: "limpieza",
		title: "Limpiar y cuidar tu pluma",
		date: "Jueves 26 de noviembre, 18:30",
		seats: 6,
		total: 10,
		price: "Gratis",
	},
	{
		id: "cartas",
		title: "Cartas de Navidad a mano",
		date: "Sábado 12 de diciembre, 11:00",
		seats: 0,
		total: 8,
		price: "25 €",
	},
];

export function Workshop() {
	return (
		<main className="mx-auto max-w-7xl px-4 pt-10 sm:px-8">
			<h1 className="text-5xl font-extrabold tracking-[-0.04em] sm:text-7xl">
				El taller
			</h1>
			<div className="mt-8 grid gap-10 md:grid-cols-2">
				<p className="max-w-[52ch] text-lg">
					Plumín empezó como una mesa al fondo de una papelería de Lavapiés. Hoy
					es una tienda pequeña con un banco de trabajo: ajustamos plumines,
					limpiamos plumas heredadas y enseñamos a escribir con ellas.
				</p>
				<p className="font-hand text-4xl leading-tight">
					Si una pluma raspa, casi nunca es culpa tuya. Tráela y la miramos.
				</p>
			</div>

			<section aria-labelledby="sesiones" className="mt-20">
				<h2
					id="sesiones"
					className="text-4xl font-extrabold tracking-[-0.03em]"
				>
					Próximas sesiones
				</h2>
				<ul className="mt-8 grid gap-4 md:grid-cols-3">
					{sessions.map((session) => (
						<li
							key={session.id}
							className="flex flex-col rounded-3xl bg-(--wash) p-6"
						>
							<Chip
								size="sm"
								variant="soft"
								color={session.seats === 0 ? "danger" : "accent"}
								className="self-start"
							>
								{session.seats === 0
									? "Completo"
									: `Quedan ${session.seats} de ${session.total} plazas`}
							</Chip>
							<h3 className="mt-4 text-xl leading-snug font-bold">
								{session.title}
							</h3>
							<p className="mt-1 text-(--ink-soft)">{session.date}</p>
							<p className="mt-auto pt-6 text-2xl font-bold">{session.price}</p>
						</li>
					))}
				</ul>
				<p className="mt-6 text-(--ink-soft)">
					Para apuntarte, pásate por la tienda o llama al 910 000 000.
				</p>
			</section>
		</main>
	);
}
