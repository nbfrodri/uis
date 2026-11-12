# Plumín

Tienda ficticia de tintas para pluma estilográfica: catálogo por color, fichas de producto, caja de cinco muestras personalizables, carrito, pago simulado y mapa del taller.

[Abrir la web](https://nbfrodri.github.io/uis/f/001-plumin)

## Librerías y para qué se usan

| Librería                                       | Uso en esta web                                                                                | Dónde                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| React y TypeScript                             | Componentes, estado y contratos de datos del catálogo y carrito.                               | `index.tsx`, `cart.ts`, `cart-context.tsx`                              |
| React Router                                   | Rutas internas, enlaces y navegación entre catálogo, producto y compra.                        | `index.tsx`, `components/site-link.tsx`                                 |
| HeroUI                                         | Botones, campos de formulario, breadcrumbs, desplegables, paneles de carrito y menú, y avisos. | `components/`, `pages/checkout-page.tsx`                                |
| Base UI                                        | Megamenú de navegación de escritorio.                                                          | `components/main-nav.tsx`                                               |
| React Aria Components                          | Búsqueda accesible, selección de tinta e internacionalización de controles.                    | `components/ink-search.tsx`, `components/hero-writing.tsx`, `index.tsx` |
| [Vara.js](https://github.com/akzhy/Vara) 1.4.1 | Compone el título manuscrito con una fuente SVG de trazos, Satisfy.                            | `components/handwritten-title.tsx`                                      |
| MapLibre GL                                    | Mapa interactivo del taller; su worker se empaqueta con la build.                              | `components/shop-map.tsx`                                               |
| spanish-cities-info                            | Datos locales de municipios y códigos postales para la dirección de envío.                     | `places.ts`                                                             |
| Fontsource                                     | Fuentes alojadas con la web: Plus Jakarta Sans y Caveat.                                       | `index.tsx`, `preview.tsx`                                              |
| Tailwind CSS                                   | Estilos de composición y adaptación a móvil, junto con CSS propio.                             | `styles.css`, componentes y páginas                                     |

Vara y la fuente se sirven desde la propia build, también bajo `/uis/`; la escritura no depende de un CDN. Vara prepara las letras y la API nativa Web Animations las dibuja por orden con `stroke-dashoffset`: unos 5 segundos de trazo a velocidad constante, con una breve pausa en cada levantada de pluma. Una pluma SVG sigue el trazo y se desliza al siguiente. Al terminar, la frase se mantiene un momento, se desvanece y el ciclo se repite. Al cambiar de tinta solo se reinicia el texto; el papel pautado se mantiene. En pantallas estrechas la frase se escribe en tres líneas, cada una sobre su guía. La animación se detiene con la pestaña oculta y se cancela al salir de la página. Con movimiento reducido se muestra el título completo sin dibujarlo. Si falla la carga o la reproducción, permanece el texto estático accesible.

La integración está aislada porque Vara 1.4.1 no ofrece una API de destrucción: sus callbacks de carga dejan de modificar el DOM cuando se desmonta el componente. Licencias distribuidas con la web: [Vara, MIT](../../../public/licenses/vara.txt) y [Satisfy, Apache 2.0](../../../public/licenses/satisfy.txt).

## Diseño y código propios

- Las manchas de tinta, los iconos y la miniatura de la caja del carrito son SVG propios. La miniatura muestra los cinco colores elegidos.
- La [foto de muestras](assets/README.md) es una visualización del producto ficticio. Los colores de la selección se muestran por separado en «Tu caja».
- El parallax decorativo del hero usa animaciones CSS vinculadas al scroll y respeta movimiento reducido. El selector «Tu caja» se desplaza con la página.
- `preview.tsx` presenta una composición ligera de escritorio y móvil para Estudio digital, sin montar la tienda completa.
- En la página del carrito los productos se desplazan dentro de su propia ventana, que en móvil se ajusta para que el total y el botón de pago quepan en pantalla.
- El carrito se conserva en `localStorage`. Cada combinación de muestras se guarda como una línea independiente. El pago es simulado: no se cobran importes ni se envían datos a un proveedor de pagos.

## Herramientas de desarrollo compartidas

Vite empaqueta la web; Vitest y Testing Library verifican los recorridos y la lógica; Biome comprueba formato y lint. Los comandos se ejecutan desde la raíz: `pnpm test`, `pnpm check` y `pnpm build`.
