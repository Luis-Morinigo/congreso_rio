# Congreso Internacional de Energía Termodinámica

Landing del congreso de Río de Janeiro, Brasil, del 28 al 30 de abril de 2027. Formal en la superficie, con humor sutil, en español y portugués.

**Sitio publicado:** https://luis-morinigo.github.io/congreso_rio/

Hecha con Vite, React, TypeScript, Tailwind CSS v4, Framer Motion, lucide-react y Embla Carousel.

## Correrlo en local

```bash
npm install
npm run dev       # desarrollo: http://localhost:5173/congreso_rio/
npm run build     # verifica tipos con tsc y genera dist/
npm run preview   # sirve el build: http://localhost:4173/congreso_rio/
```

Cada push a `main` se publica en GitHub Pages con `.github/workflows/deploy.yml`.

## Editar textos

Todo el texto visible, incluidos errores del formulario y `aria-label`, está en los diccionarios:

- `src/i18n/es.ts`
- `src/i18n/pt.ts`

`pt.ts` se tipa a partir de `es.ts`: si falta una clave en un idioma, o sobra, `npm run build` falla. Al agregar un texto, ponelo en los dos archivos.

El idioma inicial es el del navegador (`pt` si empieza con "pt"; si no, `es`). Lo que elija el visitante en el header queda guardado en `localStorage`.

## Música

La playlist espera estos dos archivos, con estos nombres exactos:

| Tema | Archivo |
| --- | --- |
| "Ai Se Eu Te Pego", Michel Teló | `public/audio/ai_se_eu_te_pego.mp3` |
| "Magalenha", Sérgio Mendes | `public/audio/magalenha.mp3` |

**Hoy no están en el repo.** Sin ellos la página funciona igual: el botón del header muestra "Música no disponible" y no aparece el aviso para activar la música. Si falta uno solo, la playlist repite el otro.

Para activarla, copiá los mp3 a `public/audio/`, hacé commit y push.

Este repo es público y esos temas tienen derechos de autor: al subirlos quedan descargables por cualquiera. Conviene tener en cuenta eso, o usar pistas con licencia.

## Confirmaciones de asistencia

No hay backend: cada confirmación se guarda solo en el `localStorage` de quien completa el formulario (clave `congreso_rio.rsvp`), así que **los organizadores no la reciben**. Para recibirlas, integrá Formspree o similar en el `// TODO` de `src/components/Rsvp.tsx`.

## Estructura

```text
src/
  assets/       Imágenes. La foto de Ivo se usa optimizada (ivo_expositor-opt.jpeg)
  components/   Un componente por sección, más modal, aviso de música y banda del calçadão
  hooks/        useBackgroundMusic, useCountdown, usePrefersReducedMotion
  i18n/         Diccionarios y LanguageContext
public/
  audio/        Los mp3 de la playlist
  og-banner.jpeg  Recorte horizontal del póster para Open Graph y Twitter
```
