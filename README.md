# uis

Portfolio de webs de demostración: sitios completos e inventados (tiendas, estudios, consultoras…), diseñados y construidos con IA para practicar diseño web. La galería (`/`) las lista y cada una se abre como una web independiente.

**En línea:** https://nbfrodri.github.io/uis/

| Web                                                   | Qué tiene                                                                                          |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Plumín](https://nbfrodri.github.io/uis/f/001-plumin) | Tienda de tintas: hero escrito a mano, megamenú, buscador, catálogo, carrito, pago simulado y mapa |

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

Cada push a `main` pasa las comprobaciones y publica en GitHub Pages (`.github/workflows/deploy.yml`), bajo `/uis/`.
