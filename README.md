# uis

Libreta de prácticas de interfaz. Cada front es una carpeta independiente y la galería (`/`) los lista solos.

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

Se abre en `/f/NNN-nombre-corto`. `Esc` o el botón «Índice» vuelven a la galería. Las carpetas que empiezan por `_` no se listan.

## Comprobaciones

```sh
pnpm test     # Vitest
pnpm check    # Biome (lint + formato)
pnpm build    # tsc + build de producción
```
