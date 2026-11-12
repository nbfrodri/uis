import { buttonVariants } from "@heroui/react";
import { SiteLink } from "../components/site-link";

export function Missing() {
	return (
		<main className="mx-auto max-w-7xl px-4 pt-16 sm:px-8">
			<h1 className="text-5xl font-extrabold tracking-[-0.04em] sm:text-6xl">
				Esta página no existe
			</h1>
			<p className="mt-4 text-lg text-(--ink-soft)">
				Puede que la tinta ya no esté en el catálogo.
			</p>
			<SiteLink to="tintas" className={buttonVariants({ className: "mt-6" })}>
				Ver las tintas
			</SiteLink>
		</main>
	);
}
