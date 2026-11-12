import { SiteLink } from "../components/site-link";

export function Missing() {
	return (
		<main className="mx-auto max-w-6xl px-4 pt-16 sm:px-8">
			<h1 className="font-display text-6xl font-medium">
				Esta página no existe
			</h1>
			<p className="mt-4 text-lg">
				Puede que la tinta ya no esté en el catálogo.{" "}
				<SiteLink to="tintas" className="underline underline-offset-4">
					Ver las tintas
				</SiteLink>
			</p>
		</main>
	);
}
