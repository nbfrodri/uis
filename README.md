# uis

Portfolio de sitios web completos de demostración: tiendas, estudios, consultoras y otros negocios inventados. Cada proyecto tiene su propia identidad visual, navegación y páginas, con recorridos interactivos para explorar el sitio como una web independiente.

La portada (`/`) es el índice del portfolio. Los proyectos muestran experiencias completas, desde la página de inicio hasta las páginas de detalle y los flujos de cada negocio.

**En línea:** https://nbfrodri.github.io/uis/

| Web                                                   | Qué tiene                                                                                          |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Plumín](https://nbfrodri.github.io/uis/f/001-plumin) | Tienda de tintas: hero escrito a mano, megamenú, buscador, catálogo, carrito, pago simulado y mapa |

### Plumín

Tienda ficticia de tintas para pluma estilográfica, con doce tintas de tres talleres. Incluye catálogo por familias de color, fichas de producto con muestras de escritura, carrito, proceso de compra simulado y página del taller.

- [Explorar todas las tintas](https://nbfrodri.github.io/uis/f/001-plumin/tintas)
- [Ver la colección de rojos](https://nbfrodri.github.io/uis/f/001-plumin/tintas?familia=rojos)
- [Abrir la ficha de Granada](https://nbfrodri.github.io/uis/f/001-plumin/tintas/granada)

Los negocios y productos son inventados; el pago es una demostración y no se realizan compras reales.

## Arrancar

```sh
pnpm install
pnpm dev
```

## Añadir una web

```sh
pnpm new-front nombre-corto "Título visible"
```

Crea `src/fronts/NNN-nombre-corto/` a partir de `src/fronts/_template`:

- `meta.ts`: título, fecha, descripción y etiquetas que muestra la galería.
- `index.tsx`: la web. Importa aquí sus fuentes y CSS; nada se comparte con la galería salvo Tailwind y los estilos base de HeroUI.

Cada web tiene sus propias páginas: define sus `<Routes>` con rutas relativas (la plantilla trae inicio, «sobre» y 404). Se abre en `/f/NNN-nombre-corto` y sus páginas cuelgan de ahí (`/f/NNN-nombre-corto/sobre`).

Usa las librerías que necesite (`pnpm add …`): HeroUI, Base UI, Motion, MapLibre… Solo se cargan al abrir esa web. Ojo: `font-sans` cae en la fuente del sistema; carga siempre una fuente propia (p. ej. `@fontsource-variable/...`).

`Esc` o el botón «Índice» vuelven a la galería. Las carpetas que empiezan por `_` no se listan.

## Comprobaciones

```sh
pnpm test     # Vitest
pnpm check    # Biome (lint + formato)
pnpm build    # tsc + build de producción
```

## Publicación

Las pull requests a `main` pasan el lint, los tests y la build sin publicar. Cada push a `main` repite las comprobaciones y publica en GitHub Pages (`.github/workflows/deploy.yml`), bajo `/uis/`. La publicación manual también queda limitada a `main`.
