import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource-variable/caveat";
import "./styles.css";
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
	);
}
