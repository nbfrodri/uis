// Each front owns its look: import its own fonts and CSS here, nothing leaks to the gallery.
export default function Front() {
	return (
		<main className="grid min-h-dvh place-items-center bg-white p-6 text-neutral-900">
			<h1 className="text-3xl font-semibold">__TITLE__</h1>
		</main>
	);
}
