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

Un plugin de mantenimiento complementario para OpenClaw que verifica que `not-claude-code-emulator` esté presente y funcione correctamente.

*Porque la mejor operación comienza confirmando que tu cobertura está en su lugar.*

## Qué hace esto

`not-claude-code-emulator` es el runtime que traduce las llamadas API de OpenClaw en algo que la infraestructura de Anthropic reconoce como proveniente de una sesión de Claude Code CLI — del tipo que siempre ha estado cubierta por una suscripción estándar Pro o Max, sin cargos extra por uso requeridos. `openclaw-cc-camouflage` es la verificación pre-vuelo que confirma que el traductor está presente y operativo antes de que lo necesites.

El nombre no es una coincidencia. Tu tráfico entra pareciendo una cosa, llega pareciendo otra. Este plugin verifica que el "guardarropa" esté listo.

Concretamente:

- **Detecta** `not-claude-code-emulator` mediante tres rutas de descubrimiento (variable de entorno → npm global → rutas de respaldo)
- **Reporta** estado legible por máquina: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Diagnostica** problemas con pasos siguientes accionables cuando algo está mal
- **Reserva** `patch_apply` / `patch_revert` como stubs explícitos para operaciones futuras

Nada muta automáticamente. Los hooks son solo de verificación. Ejecutas `status`, obtienes el reporte y decides qué hacer a continuación.

## Instalación

Instala en orden. Cada paso depende del anterior.

### Paso 1: Instalar OpenClaw

Si aún no está instalado:

```bash
npm install -g openclaw
```

### Paso 2: Instalar `not-claude-code-emulator`

Este es el componente que hace que tu tráfico de OpenClaw hable fluentemente la CLI de Claude Code. Sin él, no hay nada que este plugin pueda verificar — y nada entre tus llamadas API y un elemento de línea de uso extra.

```bash
# Opción A: npm global (recomendado)
npm install -g not-claude-code-emulator

# Opción B: fijar al commit soportado exacto (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Paso 3: Instalar `openclaw-cc-camouflage`

```bash
# Opción A: npm global (paquete publicado)
npm install -g openclaw-cc-camouflage

# Opción B: desde el código fuente
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Paso 4: Configurar la ruta del emulador

Dile al plugin dónde encontrar `not-claude-code-emulator`:

```bash
# Si usaste la instalación global de npm:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Si clonaste manualmente:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Añade a tu perfil de shell para persistencia:

```bash
# ~/.zshrc o ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Opcional — configura rutas de búsqueda de respaldo adicionales (separadas por dos puntos en macOS/Linux, punto y coma en Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Paso 5: Registrar el plugin en OpenClaw

Añade a tu `openclaw.json` o `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Si instalaste desde el código fuente, usa la ruta local:

```json
{
  "plugins": [
    {
      "name": "openclaw-cc-camouflage",
      "path": "~/github/openclaw-cc-camouflage"
    }
  ]
}
```

### Paso 6: Verificar la instalación

```bash
bun run status
```

Una instalación saludable reporta:

```
emulator=present
patch=none
support=supported
```

Código de salida 0 significa que todo está en orden. Código de salida 1 significa que algo necesita atención.

Para una imagen más detallada:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# El estado de mantenimiento es saludable.
# next: El prerrequisito del emulador es legible y la plataforma actual está soportada.
# next: Todas las herramientas están disponibles.
```

Si ves `emulator=missing`, verifica que `OC_CAMOUFLAGE_EMULATOR_ROOT` apunte a un directorio que contenga el `package.json` de `not-claude-code-emulator`.

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
patch=none
support=supported
```

Código de salida 0 significa saludable. Código de salida 1 significa que algo necesita atención.

### `doctor`

Proporciona orientación diagnóstica basada en el estado actual.

```bash
bun run doctor
```

Inspecciona archivos y reporta pasos siguientes accionables. No instala, parchea ni modifica nada. Solo lee y reporta.

### `patch_apply`

Aplica parches al objetivo (actualmente un stub para extensión futura).

```bash
bun run patch:apply
```

En la versión actual, esto valida el entorno pero no modifica ningún estado del par. Las versiones futuras pueden implementar parcheado real con marcadores de reversión.

### `patch_revert`

Revierte parches previamente aplicados (actualmente un stub para extensión futura).

```bash
bun run patch:revert
```

En la versión actual, esto valida el entorno pero no modifica ningún estado del par.

## Por qué los hooks automáticos son solo de verificación

Los hooks automáticos en este plugin están limitados a verificación y metadatos únicamente. No aplican parches automáticamente porque:

1. Mutar un par sin intención explícita del usuario viola el principio de menor sorpresa
2. Los fallos de parcheado necesitan revisión humana, no reintentos silenciosos
3. La reversión requiere consentimiento explícito para restaurar el estado

Los hooks advierten cuando se detecta desviación. Tú decides si aplicar, revertir o dejar el entorno sin cambios.

El plugin verifica la preparación. Lo que haces with a properly-maintained setup es entre tú y tu plan de suscripción.

## Soporte de plataforma

| Plataforma | Estado | Notas |
|------------|--------|-------|
| macOS | Soportado | Entorno de escritorio principal |
| Linux | Soportado | Mismos fixtures upstream fijados |
| Windows | Soportado | Soporta descubrimiento de plugins basado en letra de unidad y barra invertida |

## Canario de compatibilidad

Para verificar la desviación upstream contra objetivos fijados:

```bash
bun run compat:canary
```

Verificación de solo lectura. Valida la integridad de fixtures y referencias upstream sin modificar nada. Sale con 0 en objetivos soportados fijados.

## Documentación

- `docs/install.md` - Prerrequisitos y pasos de instalación
- `docs/compatibility.md` - Límites de compatibilidad
- `docs/support-matrix.md` - Versiones de fixtures bloqueadas
- `docs/non-goals.md` - Elementos explícitamente fuera de alcance
- `docs/rollback.md` - Procedimientos de recuperación del emulador

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

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
