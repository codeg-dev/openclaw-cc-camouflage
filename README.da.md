<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.bs.md">Bosanski</a> |
  <strong>Dansk</strong> |
  <a href="README.de.md">Deutsch</a> |
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

Et ledsagende vedligeholdelsesplugin til OpenClaw, der verificerer at `not-claude-code-emulator` er til stede og sund.

*Fordi den bedste operation starter med at bekræfte at dit dække er på plads.*

## Hvad dette gør

`not-claude-code-emulator` er runtime'en, der oversætter OpenClaws API-kald til noget, som Anthropics infrastruktur genkender som kommer fra en Claude Code CLI-session — den slags der altid har været dækket af et standard Pro eller Max abonnement, uden ekstra forbrugsafgifter påkrævet. `openclaw-cc-camouflage` er forflyvningskontrollen, der bekræfter at oversætteren er til stede og operationel, før du har brug for den.

Navnet er ingen tilfældighed. Din trafik går ind og ser ud som én ting, ankommer og ser ud som en anden. Dette plugin verificerer at "garderoben" er klar.

Konkret:

- **Registrerer** `not-claude-code-emulator` via tre opdagelsesstier (miljøvariabel → npm global → fallback-stier)
- **Rapporterer** maskinlæsbar status: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Diagnosticerer** problemer med handlingsrettede næste trin, når noget er galt
- **Reserverer** `patch_apply` / `patch_revert` som eksplicitte stubs til fremtidige operationer

Intet muterer automatisk. Hooks er kun til verifikation. Du kører `status`, får rapporten og beslutter hvad du gør næste gang.

## Installation

Installer i rækkefølge. Hvert trin afhænger af det foregående.

### Trin 1: Installer OpenClaw

Hvis ikke allerede installeret:

```bash
npm install -g openclaw
```

### Trin 2: Installer `not-claude-code-emulator`

Dette er komponenten, der får din OpenClaw-trafik til at tale flydende Claude Code CLI. Uden den er der intet for dette plugin at verificere — og intet der står mellem dine API-kald og en ekstra-forbrugslinje.

```bash
# Mulighed A: npm global (anbefalet)
npm install -g not-claude-code-emulator

# Mulighed B: fastgør til det eksakte understøttede commit (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Trin 3: Installer `openclaw-cc-camouflage`

```bash
# Mulighed A: npm global (publiceret pakke)
npm install -g openclaw-cc-camouflage

# Mulighed B: fra kilde
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Trin 4: Konfigurer emulatorstien

Fortæl plugin'et hvor det kan finde `not-claude-code-emulator`:

```bash
# Hvis du brugte npm global installation:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Hvis du klonede manuelt:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Tilføj til din shell-profil for persistens:

```bash
# ~/.zshrc eller ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Valgfrit — konfigurer yderligere fallback-søgestier (kolon-separeret på macOS/Linux, semikolon på Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Trin 5: Registrer plugin'et i OpenClaw

Tilføj til din `openclaw.json` eller `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Hvis du installerede fra kilde, brug den lokale sti:

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

### Trin 6: Verificer installationen

```bash
bun run status
```

En sund installation rapporterer:

```
emulator=present
patch=none
support=supported
```

Exit-kode 0 betyder at alt er i orden. Exit-kode 1 betyder at noget kræver opmærksomhed.

For et mere detaljeret billede:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Vedligeholdelsesstatus er sund.
# next: Emulatorforudsætningen er læsbar og den aktuelle platform understøttes.
# next: Alle værktøjer er tilgængelige.
```

Hvis du ser `emulator=missing`, verificer at `OC_CAMOUFLAGE_EMULATOR_ROOT` peger på et bibliotek, der indeholder `not-claude-code-emulator`s `package.json`.

## Tilgængelige værktøjer

Dette plugin eksponerer fire eksplicitte værktøjer. De er ikke automatiske hooks.

### `status`

Rapporterer den aktuelle tilstand af emulatorinstallationen.

```bash
bun run status
```

Outputformatet er maskinlæsbart:

```
emulator=present
patch=none
support=supported
```

Exit-kode 0 betyder sund. Exit-kode 1 betyder at noget kræver opmærksomhed.

### `doctor`

Giver diagnostisk vejledning baseret på den aktuelle tilstand.

```bash
bun run doctor
```

Inspektionerer filer og rapporterer handlingsrettede næste trin. Installerer ikke, patcher eller modificerer noget. Læser og rapporterer kun.

### `patch_apply`

Anvender patches på målet (i øjeblikket en stub til fremtidig udvidelse).

```bash
bun run patch:apply
```

I den nuværende version validerer dette miljøet, men modificerer ikke nogen peer-tilstand. Fremtidige versioner kan implementere faktisk patching med rollback-markører.

### `patch_revert`

Fortryder tidligere anvendte patches (i øjeblikket en stub til fremtidig udvidelse).

```bash
bun run patch:revert
```

I den nuværende version validerer dette miljøet, men modificerer ikke nogen peer-tilstand.

## Hvorfor automatiske hooks kun er til verifikation

Automatiske hooks i dette plugin er begrænset til kun verifikation og metadata. De anvender ikke patches automatisk, fordi:

1. At mutere en peer uden eksplicit brugerintention krænker princippet om mindst mulig overraskelse
2. Patching-fejl har brug for menneskelig gennemgang, ikke tavse genforsøg
3. Rollback kræver eksplicit samtykke for at gendanne tilstand

Hooks advarer når drift registreres. Du beslutter om du vil anvende, fortryde eller lade miljøet være uændret.

Plugin'et verificerer parathed. Hvad du gør med en ordentligt vedligeholdt opsætning er mellem dig og dit abonnement.

## Platformunderstøttelse

| Platform | Status | Noter |
|----------|--------|-------|
| macOS | Understøttet | Primært desktop-miljø |
| Linux | Understøttet | Samme fastgjorte upstream fixtures |
| Windows | Understøttet | Understøtter drevbogstav- og backslash-baseret plugin-opdagelse |

## Kompatibilitets-kanariefugl

For at tjekke for upstream drift mod fastgjorte mål:

```bash
bun run compat:canary
```

Kun-læsning check. Validerer fixture-integritet og upstream referencer uden at modificere noget. Exiter med 0 på fastgjorte understøttede mål.

## Dokumentation

- `docs/install.md` - Forudsætninger og installationstrin
- `docs/compatibility.md` - Kompatibilitetsgrænser
- `docs/support-matrix.md` - Låste fixture-versioner
- `docs/non-goals.md` - Eksplicitte udenfor-scope elementer
- `docs/rollback.md` - Emulatorgendannelsesprocedurer

## Udvikling

```bash
# Installer afhængigheder
bun install

# Type check
bun run typecheck

# Kør tests
bun run test:unit
bun run test:integration

# Verificer patches mod fixtures
bun run verify:patches

# Tjek publiceringssikkerhed
bun run check:publish-safety
```

## Licens

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
