import type { ComponentProps } from "react";
import { Link, NavLink, useParams } from "react-router";

/** Builds /f/<slug>/<path> so links work from any depth inside the front. */
export function useSitePath() {
	const { slug } = useParams();
	return (path = "") => `/f/${slug}/${path}`.replace(/\/$/, "");
}

export function SiteLink({
	to,
	...props
}: Omit<ComponentProps<typeof Link>, "to"> & { to: string }) {
	const sitePath = useSitePath();
	return <Link to={sitePath(to)} {...props} />;
}

export function SiteNavLink({
	to,
	...props
}: Omit<ComponentProps<typeof NavLink>, "to"> & { to: string }) {
	const sitePath = useSitePath();
	return <NavLink to={sitePath(to)} {...props} />;
}
