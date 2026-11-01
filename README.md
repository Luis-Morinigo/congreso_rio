# Congreso Internacional de Energía Termodinámica

Landing del congreso de Río de Janeiro, Brasil, del 28 al 30 de abril de 2027. Formal en la superficie, con humor sutil, en español y portugués.

**Sitio publicado:** https://luis-morinigo.github.io/congreso_rio/

Hecha con Vite, React, TypeScript, Tailwind CSS v4, Framer Motion, lucide-react, Embla Carousel y la IFrame Player API de YouTube.

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

Suena "Ai Se Eu Te Pego", de Michel Teló, en loop, desde el [video oficial de YouTube](https://www.youtube.com/watch?v=hcm55lU9knw). El ID se cambia en `VIDEO_ID`, en `src/hooks/useBackgroundMusic.ts`.

- YouTube exige un reproductor visible, así que aparece un mini reproductor flotante de 200×200 px. No se puede ocultar mientras suena.
- Los navegadores bloquean el autoplay con sonido: la música arranca con la primera interacción. En iPhone puede hacer falta tocar el propio reproductor.
- Cerrar el reproductor o silenciar desde el header detiene la música y se recuerda al recargar. Mientras esté silenciada, la página no se conecta con YouTube.
- YouTube puede mostrar anuncios. Si el video deja de admitir el embed o un bloqueador impide cargarlo, el botón del header muestra "Música no disponible" y la página sigue funcionando.

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
  og-banner.jpeg  Recorte horizontal del póster para Open Graph y Twitter
```
