<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.de.md">Deutsch</a> |
  <strong>Español</strong> |
  <a href="README.fr.md">Français</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

Un plugin complementario de mantenimiento para OpenClaw que ayuda a verificar el estado del not-claude-code-emulator. Este paquete no es un fork de proyectos upstream. Proporciona herramientas explícitas sin hooks automáticos.

## Qué es esto

`openclaw-cc-camouflage` es un plugin de mantenimiento que:

- Verifica la presencia y salud del emulador antes de cualquier operación
- Reporta el estado y proporciona orientación de diagnóstico
- Proporciona implementaciones stub para operaciones de parche futuras

No aplica parches automáticamente durante la instalación. Todas las mutaciones requieren invocación explícita de herramienta.

## Prerrequisitos y orden de instalación

El orden de instalación importa. Debes tener lo siguiente en su lugar antes de que este plugin pueda funcionar:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - El runtime de mensajes que proporciona interfaces compatibles con Anthropic
   - Instalar vía npm: `npm install -g not-claude-code-emulator`
   - O clonar en `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (este paquete)
   - Instalar último, después de que el emulador esté presente

Configura la variable de entorno:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

O usa rutas de respaldo:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Herramientas disponibles

Este plugin expone cuatro herramientas explícitas. No son hooks automáticos.

### `status`

Reporta el estado actual de la instalación del emulador.

```bash
bun run status
```

El formato de salida es legible por máquina:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

El código de salida 0 significa saludable. El código de salida 1 significa que algo necesita atención.

### `doctor`

Proporciona orientación de diagnóstico basada en el estado actual.

```bash
bun run doctor
```

Esto inspecciona archivos y reporta pasos siguientes accionables. No instala, aplica parche o modifica nada. Solo lee y reporta.

### `patch_apply`

Aplica parches al objetivo (actualmente un stub para extensión futura).

```bash
bun run patch:apply
```

En la versión actual, esto valida el entorno pero no modifica ningún estado de peer. Las versiones futuras pueden implementar parcheo real con marcadores de rollback.

### `patch_revert`

Revierte parches aplicados previamente (actualmente un stub para extensión futura).

```bash
bun run patch:revert
```

En la versión actual, esto valida el entorno pero no modifica ningún estado de peer. Las versiones futuras pueden implementar reversión real usando marcadores de rollback.

## Por qué los hooks automáticos son solo de verificación

Los hooks automáticos en este plugin están limitados a verificación y metadatos únicamente. No aplican parches automáticamente porque:

1. Mutar un peer sin intención explícita del usuario viola el principio de la menor sorpresa
2. Los fallos de parcheo necesitan revisión humana, no reintentos silenciosos
3. El rollback requiere consentimiento explícito para restaurar el estado

Los hooks advierten cuando se detecta desviación. Tú decides si aplicar, revertir o dejar el entorno sin cambios.

## Soporte de plataforma

| Plataforma | Estado | Notas |
|----------|--------|-------|
| macOS    | Soportado | Entorno de escritorio principal |
| Linux    | Soportado | Mismos fixtures upstream fijados |
| Windows  | Soportado | Soporta descubrimiento de plugin basado en letra de unidad y barra invertida |

## Canario de compatibilidad

Para verificar la desviación upstream contra objetivos fijados:

```bash
bun run compat:canary
```

Esta es una verificación de solo lectura que valida la integridad de fixtures y referencias upstream sin modificar nada. Sale con 0 en objetivos fijados soportados.

## Documentación

- `docs/install.md` - Prerrequisitos y pasos de instalación
- `docs/compatibility.md` - Límites de compatibilidad
- `docs/support-matrix.md` - Versiones de fixtures bloqueadas
- `docs/non-goals.md` - Elementos explícitamente fuera de alcance

## Desarrollo

```bash
# Instalar dependencias
bun install

# Verificación de tipos
bun run typecheck

# Ejecutar pruebas
bun run test:unit
bun run test:integration

# Verificar parches contra fixtures
bun run verify:patches

# Verificar seguridad de publicación
bun run check:publish-safety
```

## Licencia

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->