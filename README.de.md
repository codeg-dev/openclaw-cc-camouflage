<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.da.md">Dansk</a> |
  <strong>Deutsch</strong> |
  <a href="README.es.md">Español</a> |
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

Ein begleitendes Wartungsplugin für OpenClaw, das bei der Überprüfung des not-claude-code-emulator-Status hilft. Dieses Paket ist kein Fork von Upstream-Projekten. Es bietet explizite Tools ohne automatische Hooks.

## Was das ist

`openclaw-cc-camouflage` ist ein Wartungsplugin, das:

- Vor allen Operationen die Emulator-Präsenz und -Gesundheit überprüft
- Status meldet und diagnostische Anleitung bietet
- Stub-Implementierungen für zukünftige Patch-Operationen bereitstellt

Es wendet während der Installation nicht automatisch Patches an. Alle Mutationen erfordern einen expliziten Tool-Aufruf.

## Voraussetzungen und Installationsreihenfolge

Die Installationsreihenfolge ist wichtig. Sie müssen Folgendes vorhanden haben, bevor dieses Plugin funktionieren kann:

1. **`not-claude-code-emulator`** (Commit `5541e5c`)
   - Die Nachrichten-Runtime, die Anthropic-kompatible Schnittstellen bereitstellt
   - Installation via npm: `npm install -g not-claude-code-emulator`
   - Oder klonen Sie in `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (dieses Paket)
   - Zuletzt installieren, nachdem der Emulator vorhanden ist

Konfigurieren Sie die Umgebungsvariable:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Oder verwenden Sie Fallback-Pfade:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Verfügbare Tools

Dieses Plugin stellt vier explizite Tools zur Verfügung. Es sind keine automatischen Hooks.

### `status`

Meldet den aktuellen Zustand der Emulator-Installation.

```bash
bun run status
```

Das Ausgabeformat ist maschinenlesbar:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Exit-Code 0 bedeutet gesund. Exit-Code 1 bedeutet, dass etwas Aufmerksamkeit benötigt.

### `doctor`

Bietet diagnostische Anleitung basierend auf dem aktuellen Zustand.

```bash
bun run doctor
```

Dies untersucht Dateien und meldet umsetzbare nächste Schritte. Es installiert, patcht oder modifiziert nichts. Es liest nur und meldet.

### `patch_apply`

Wendet Patches auf das Ziel an (derzeit ein Stub für zukünftige Erweiterung).

```bash
bun run patch:apply
```

In der aktuellen Version validiert dies die Umgebung, modifiziert aber keinen Peer-Status. Zukünftige Versionen können tatsächliches Patching mit Rollback-Markern implementieren.

### `patch_revert`

Macht zuvor angewendete Patches rückgängig (derzeit ein Stub für zukünftige Erweiterung).

```bash
bun run patch:revert
```

In der aktuellen Version validiert dies die Umgebung, modifiziert aber keinen Peer-Status. Zukünftige Versionen können tatsächliche Rückgängig-Machung unter Verwendung von Rollback-Markern implementieren.

## Warum automatische Hooks nur Überprüfung sind

Automatische Hooks in diesem Plugin sind auf Überprüfung und Metadaten beschränkt. Sie wenden keine Patches automatisch an, weil:

1. Das Mutieren eines Peers ohne explizite Benutzerabsicht das Prinzip der geringsten Überraschung verletzt
2. Patch-Fehler benötigen menschliche Überprüfung, keine stillen Wiederholungsversuche
3. Rollback erfordert explizite Zustimmung zur Wiederherstellung des Zustands

Die Hooks warnen, wenn Drift erkannt wird. Sie entscheiden, ob Sie anwenden, zurücksetzen oder die Umgebung unverändert lassen.

## Plattformunterstützung

| Plattform | Status | Hinweise |
|----------|--------|-------|
| macOS    | Unterstützt | Primäre Desktop-Umgebung |
| Linux    | Unterstützt | Gleiche gepinnte Upstream-Fixtures |
| Windows  | Unterstützt | Unterstützt laufwerksbuchstaben- und backslash-basierte Plugin-Erkennung |

## Kompatibilitätskanarienvogel

Um Upstream-Drift gegen gepinnte Ziele zu prüfen:

```bash
bun run compat:canary
```

Dies ist ein schreibgeschützter Check, der Fixture-Integrität und Upstream-Referenzen validiert, ohne etwas zu modifizieren. Er beendet mit 0 bei gepinnten unterstützten Zielen.

## Dokumentation

- `docs/install.md` - Voraussetzungen und Installationsschritte
- `docs/compatibility.md` - Kompatibilitätsgrenzen
- `docs/support-matrix.md` - Gesperrte Fixture-Versionen
- `docs/non-goals.md` - Explizite außerhalb des Bereichs liegende Elemente

## Entwicklung

```bash
# Abhängigkeiten installieren
bun install

# Typprüfung
bun run typecheck

# Tests ausführen
bun run test:unit
bun run test:integration

# Patches gegen Fixtures verifizieren
bun run verify:patches

# Veröffentlichungssicherheit prüfen
bun run check:publish-safety
```

## Lizenz

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->