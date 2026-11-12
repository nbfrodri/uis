import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/caveat";
import "./styles.css";
import { I18nProvider } from "react-aria-components";
import { Route, Routes } from "react-router";
import { CartProvider } from "./cart-context";
import { Layout } from "./components/layout";
import { CartPage } from "./pages/cart-page";
import { Catalog } from "./pages/catalog";
import { Home } from "./pages/home";
import { InkPage } from "./pages/ink";
import { Missing } from "./pages/missing";
import { Workshop } from "./pages/workshop";

export default function Plumin() {
	return (
		// Spanish labels for React Aria controls (number steppers, search clear, dialogs).
		<I18nProvider locale="es-ES">
			<CartProvider>
				<Routes>
					<Route element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="tintas" element={<Catalog />} />
						<Route path="tintas/:id" element={<InkPage />} />
						<Route path="carrito" element={<CartPage />} />
						<Route path="taller" element={<Workshop />} />
						<Route path="*" element={<Missing />} />
					</Route>
				</Routes>
			</CartProvider>
		</I18nProvider>
	);
}
