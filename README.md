# uis

Libreta de prácticas de interfaz: webs completas inventadas (ecommerce, consultora, estudio…) y componentes sueltos. Cada front es una carpeta independiente y la galería (`/`) los lista sola.

## Arrancar

```sh
pnpm install
pnpm dev
```

## Añadir un front

```sh
pnpm new-front nombre-corto "Título visible"
```

Crea `src/fronts/NNN-nombre-corto/` a partir de `src/fronts/_template`:

- `meta.ts`: título, fecha, descripción y etiquetas que muestra la galería.
- `index.tsx`: el front. Importa aquí sus fuentes y CSS; nada se comparte con la galería salvo Tailwind.

Cada front puede tener varias páginas: define sus `<Routes>` con rutas relativas (la plantilla trae inicio, «sobre» y 404). Se abre en `/f/NNN-nombre-corto` y sus páginas cuelgan de ahí (`/f/NNN-nombre-corto/sobre`).

Usa las librerías que el front necesite (`pnpm add …`): Motion, shadcn/ui, Embla, etc. Solo se cargan al abrir ese front. Ojo: `font-sans` cae en la fuente del sistema; carga siempre una fuente propia (p. ej. `@fontsource-variable/...`).

`Esc` o el botón «Índice» vuelven a la galería. Las carpetas que empiezan por `_` no se listan.

## Comprobaciones

```sh
pnpm test     # Vitest
pnpm check    # Biome (lint + formato)
pnpm build    # tsc + build de producción
```
