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

Ein begleitendes Wartungs-Plugin für OpenClaw, das überprüft, ob `not-claude-code-emulator` vorhanden und funktionsfähig ist.

*Denn die beste Operation beginnt damit, zu bestätigen, dass Ihre Tarnung einsatzbereit ist.*

## Was dies tut

`not-claude-code-emulator` ist die Laufzeitumgebung, die OpenClaws API-Aufrufe in etwas übersetzt, das Anthropics Infrastruktur als von einer Claude Code CLI-Sitzung kommend erkennt — die Art, die schon immer von einem Standard-Pro- oder Max-Abonnement abgedeckt wurde, ohne zusätzliche Nutzungsgebühren. `openclaw-cc-camouflage` ist die Vorflugkontrolle, die bestätigt, dass der Übersetzer vorhanden und betriebsbereit ist, bevor Sie ihn brauchen.

Der Name ist kein Zufall. Ihr Traffic geht als eine Sache hinein, kommt als eine andere an. Dieses Plugin überprüft, ob der "Kleiderschrank" bereit ist.

Konkret:

- **Erkennt** `not-claude-code-emulator` über drei Erkennungspfade (Umgebungsvariable → npm global → Fallback-Pfade)
- **Meldet** maschinenlesbaren Status: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Diagnostiziert** Probleme mit umsetzbaren nächsten Schritten, wenn etwas nicht stimmt
- **Reserviert** `patch_apply` / `patch_revert` als explizite Stubs für zukünftige Operationen

Nichts mutiert automatisch. Die Hooks sind nur zur Überprüfung. Sie führen `status` aus, erhalten den Bericht und entscheiden, was als Nächstes zu tun ist.

## Installation

Installieren Sie in Reihenfolge. Jeder Schritt hängt vom vorherigen ab.

### Schritt 1: OpenClaw installieren

Falls noch nicht installiert:

```bash
npm install -g openclaw
```

### Schritt 2: `not-claude-code-emulator` installieren

Dies ist die Komponente, die Ihren OpenClaw-Traffic fließend Claude Code CLI sprechen lässt. Ohne sie gibt es nichts, das dieses Plugin überprüfen könnte — und nichts, das zwischen Ihren API-Aufrufen und einem zusätzlichen Nutzungsposten steht.

```bash
# Option A: npm global (empfohlen)
npm install -g not-claude-code-emulator

# Option B: Auf den genauen unterstützten Commit pinnen (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Schritt 3: `openclaw-cc-camouflage` installieren

```bash
# Option A: npm global (veröffentlichtes Paket)
npm install -g openclaw-cc-camouflage

# Option B: Aus Quelle
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Schritt 4: Den Emulator-Pfad konfigurieren

Sagen Sie dem Plugin, wo es `not-claude-code-emulator` finden kann:

```bash
# Wenn Sie npm global installiert haben:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Wenn Sie manuell geklont haben:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Fügen Sie es Ihrem Shell-Profil für Persistenz hinzu:

```bash
# ~/.zshrc oder ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Optional — konfigurieren Sie zusätzliche Fallback-Suchpfade (durch Doppelpunkt getrennt auf macOS/Linux, Semikolon auf Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Schritt 5: Das Plugin in OpenClaw registrieren

Fügen Sie es Ihrer `openclaw.json` oder `openclaw.jsonc` hinzu:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Wenn Sie aus der Quelle installiert haben, verwenden Sie den lokalen Pfad:

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

### Schritt 6: Die Installation überprüfen

```bash
bun run status
```

Eine funktionsfähige Installation meldet:

```
emulator=present
patch=none
support=supported
```

Exit-Code 0 bedeutet, dass alles in Ordnung ist. Exit-Code 1 bedeutet, dass etwas Aufmerksamkeit erfordert.

Für ein detaillierteres Bild:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Der Wartungsstatus ist funktionsfähig.
# next: Die Emulator-Voraussetzung ist lesbar und die aktuelle Plattform wird unterstützt.
# next: Alle Tools sind verfügbar.
```

Wenn Sie `emulator=missing` sehen, überprüfen Sie, ob `OC_CAMOUFLAGE_EMULATOR_ROOT` auf ein Verzeichnis zeigt, das die `package.json` von `not-claude-code-emulator` enthält.

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
patch=none
support=supported
```

Exit-Code 0 bedeutet funktionsfähig. Exit-Code 1 bedeutet, dass etwas Aufmerksamkeit erfordert.

### `doctor`

Bietet diagnostische Anleitungen basierend auf dem aktuellen Zustand.

```bash
bun run doctor
```

Überprüft Dateien und meldet umsetzbare nächste Schritte. Installiert, patcht oder modifiziert nichts. Liest und meldet nur.

### `patch_apply`

Wendet Patches auf das Ziel an (derzeit ein Stub für zukünftige Erweiterung).

```bash
bun run patch:apply
```

In der aktuellen Version validiert dies die Umgebung, modifiziert aber keinen Peer-Status. Zukünftige Versionen könnten tatsächliches Patching mit Rollback-Markern implementieren.

### `patch_revert`

Macht zuvor angewendete Patches rückgängig (derzeit ein Stub für zukünftige Erweiterung).

```bash
bun run patch:revert
```

In der aktuellen Version validiert dies die Umgebung, modifiziert aber keinen Peer-Status.

## Warum automatische Hooks nur zur Überprüfung sind

Automatische Hooks in diesem Plugin sind auf Überprüfung und Metadaten beschränkt. Sie wenden keine Patches automatisch an, weil:

1. Das Mutieren eines Peers ohne explizite Benutzerabsicht das Prinzip der geringsten Überraschung verletzt
2. Patching-Fehler benötigen menschliche Überprüfung, keine stillen Wiederholungsversuche
3. Rollback erfordert explizite Zustimmung zur Wiederherstellung des Zustands

Die Hooks warnen, wenn Drift erkannt wird. Sie entscheiden, ob Sie anwenden, rückgängig machen oder die Umgebung unverändert lassen.

Das Plugin überprüft die Bereitschaft. Was Sie mit einer ordnungsgemäß gewarteten Einrichtung tun, liegt zwischen Ihnen und Ihrem Abonnement.

## Plattformunterstützung

| Plattform | Status | Hinweise |
|-----------|--------|----------|
| macOS | Unterstützt | Primäre Desktop-Umgebung |
| Linux | Unterstützt | Gleiche gepinnte Upstream-Fixtures |
| Windows | Unterstützt | Unterstützt laufwerksbuchstaben- und rückwärtsstrichbasierte Plugin-Erkennung |

## Kompatibilitäts-Kanarienvogel

Um auf Upstream-Drift gegen gepinnte Ziele zu prüfen:

```bash
bun run compat:canary
```

Nur-Lesen-Prüfung. Validiert Fixture-Integrität und Upstream-Referenzen ohne etwas zu modifizieren. Beendet mit 0 auf gepinnten unterstützten Zielen.

## Dokumentation

- `docs/install.md` - Voraussetzungen und Installationsschritte
- `docs/compatibility.md` - Kompatibilitätsgrenzen
- `docs/support-matrix.md` - Gesperrte Fixture-Versionen
- `docs/non-goals.md` - Explizite Out-of-Scope-Elemente
- `docs/rollback.md` - Emulator-Wiederherstellungsverfahren

## Entwicklung

```bash
# Abhängigkeiten installieren
bun install

# Typprüfung
bun run typecheck

# Tests ausführen
bun run test:unit
bun run test:integration

# Patches gegen Fixtures überprüfen
bun run verify:patches

# Veröffentlichungssicherheit prüfen
bun run check:publish-safety
```

## Lizenz

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
