# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.0.0/)
y el proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed
- El despliegue a GitHub Pages ahora es automático: cada push a `main` dispara un workflow de GitHub Actions que construye el proyecto y lo publica, sustituyendo al despliegue manual (`npm run deploy`).

### Fixed

### Removed
- Script `deploy`/`predeploy` y dependencia `gh-pages`, ya innecesarios con el despliegue automático.

### Security

---
<!-- Guía rápida:
  - Mover [Unreleased] → [X.Y.Z] — AAAA-MM-DD en cada release (lo hace Documentación)
  - Added: nuevas funcionalidades
  - Changed: cambios en funcionalidades existentes
  - Fixed: correcciones de bugs
  - Removed: funcionalidades eliminadas
  - Security: parches de seguridad
  - Nunca editar entradas ya publicadas — solo añadir al principio
-->
