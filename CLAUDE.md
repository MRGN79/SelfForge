# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cuestiones de usuario

### Accesibilidad
- Toda la aplicación debe cumplir los criterios de accesibilidad AA (WCAG 2.2).

### Tests
- Nunca des una tarea por terminada sin haber pasado todos los tests.
- Tras cualquier cambio de código, ejecuta `--coverage` y verifica que la cobertura sigue por encima del 95%.
- Los tests nuevos deben cubrir siempre el caso feliz y al menos un caso de error.

### UX / i18n
- Las cadenas nuevas deben añadirse en los dos idiomas (`en` y `es`) en `src/i18n.js` antes de usarlas.
- Nunca hardcodees texto visible al usuario fuera de `src/i18n.js`.

### Rendimiento
- Avísame si una operación puede ser O(n²) o peor sobre la lista de contactos antes de implementarla.

### SEO
- Se debe cuidar el SEO, actualizando los ficheros correspondientes cuando sea necesario: `robots.txt`, `sitemap.xml`.

### Legal
- Si alguna modificación pudiera tener implicaciones legales, avísame antes de proceder.

## Stack y arquitectura

- Vite + React (SPA, sin router de servidor)
- Despliegue en GitHub Pages: base `/SelfForge/` configurada en `vite.config.js`
- Almacenamiento: solo `localStorage`, sin backend ni cuentas de usuario
- Claves de localStorage: `selfforge_habits`, `selfforge_logs`, `selfforge_profile`
- Deploy: `npm run deploy` (gh-pages sobre la carpeta `dist`)

## Modelo de datos

- No modificar los nombres de las claves de localStorage ni la forma de los objetos sin avisar al usuario, ya que los usuarios existentes perderían sus datos.
- Esquema `selfforge_habits`: `{ id, name, description, type, frequency, targetDays, category, color, startDate, endDate, active, createdAt }`
- Esquema `selfforge_logs`: `{ id, habitId, date, completed, note }`
- Esquema `selfforge_profile`: `{ name, createdAt }`

## Versionado

- Se sigue **semver estricto** (`MAJOR.MINOR.PATCH`):
  - `PATCH`: correcciones de bugs sin cambio de API ni modelo de datos.
  - `MINOR`: nuevas funcionalidades retrocompatibles.
  - `MAJOR`: cambios que rompen el modelo de datos, la API pública o requieren migración de datos del usuario.
- La única fuente de verdad de la versión es el campo `version` de `package.json`.
- Vite expone la versión como `__APP_VERSION__` (definido en `vite.config.js`) para que el código fuente no importe `package.json` directamente.
- La versión se muestra de forma discreta en el pie de página de la aplicación.

## Gamificación

- Racha: días consecutivos completados hasta hoy (hábitos diarios) o semanas consecutivas (hábitos semanales)
- % consistencia: completados / esperados en los últimos 30 días
- Mostrar siempre racha actual y racha máxima por hábito
