const sessions = [
	{
		id: "inglesa",
		title: "Caligrafía inglesa desde cero",
		date: "Sábado 21 de noviembre, 11:00",
		seats: "Quedan 3 de 8 plazas",
		price: "35 €",
	},
	{
		id: "limpieza",
		title: "Limpiar y cuidar tu pluma",
		date: "Jueves 26 de noviembre, 18:30",
		seats: "Quedan 6 de 10 plazas",
		price: "Gratis",
	},
	{
		id: "cartas",
		title: "Cartas de Navidad a mano",
		date: "Sábado 12 de diciembre, 11:00",
		seats: "Completo",
		price: "25 €",
	},
];

export function Workshop() {
	return (
		<main className="mx-auto max-w-6xl px-4 pt-12 sm:px-8">
			<h1 className="font-display text-6xl font-medium sm:text-7xl">
				El taller
			</h1>
			<div className="mt-8 grid gap-10 md:grid-cols-2">
				<p className="max-w-[52ch] text-lg">
					Plumín empezó como una mesa en el fondo de una papelería de Lavapiés.
					Hoy es una tienda pequeña con un banco de trabajo: ajustamos plumines,
					limpiamos plumas heredadas y enseñamos a escribir con ellas.
				</p>
				<p className="font-hand text-4xl leading-tight text-(--ink)">
					Si una pluma raspa, casi nunca es culpa tuya. Tráela y la miramos.
				</p>
			</div>

			<section className="mt-20">
				<h2 className="font-display text-4xl font-medium">Próximas sesiones</h2>
				<ul className="mt-8 border-t border-(--rule)">
					{sessions.map((session) => (
						<li
							key={session.id}
							className="grid gap-1 border-b border-(--rule) py-6 sm:grid-cols-[1fr_15rem_12rem_5rem] sm:items-baseline sm:gap-6"
						>
							<p className="text-xl font-semibold">{session.title}</p>
							<p>{session.date}</p>
							<p
								className={
									session.seats === "Completo"
										? "text-(--ink-soft) line-through"
										: ""
								}
							>
								{session.seats}
							</p>
							<p className="sm:text-right">{session.price}</p>
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
