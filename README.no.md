<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.ko.md">한국어</a> |
  <strong>Norsk</strong> |
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

Et følge vedlikeholdsplugin for OpenClaw som verifiserer at `not-claude-code-emulator` er til stede og i god stand.

*Fordi den beste operasjonen starter med å bekrefte at dekningen din er på plass.*

## Hva dette gjør

`not-claude-code-emulator` er runtime som oversetter OpenClaws API-kall til noe Anthropics infrastruktur gjenkjenner som kommer fra en Claude Code CLI-økt — den typen som alltid har vært dekket av et standard Pro eller Max-abonnement, uten ekstra bruksgebyrer påkrevd. `openclaw-cc-camouflage` er forhåndssjekken som bekrefter at oversetteren er til stede og operativ før du trenger den.

Navnet er ingen tilfeldighet. Trafikken din går inn og ser ut som én ting, ankommer og ser ut som en annen. Dette pluginet verifiserer at "garderoben" er klar.

Konkret:

- **Oppdager** `not-claude-code-emulator` via tre oppdagelsesstier (miljøvariabel → npm global → fallback-stier)
- **Rapporterer** maskinlesbar status: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Diagnostiserer** problemer med handlingsrettede neste trinn når noe er galt
- **Reserverer** `patch_apply` / `patch_revert` som eksplisitte stubber for fremtidige operasjoner

Ingenting muterer automatisk. Hooks er kun for verifisering. Du kjører `status`, får rapporten og bestemmer hva du gjør neste gang.

## Installasjon

Installer i rekkefølge. Hvert trinn er avhengig av det forrige.

### Trinn 1: Installer OpenClaw

Hvis ikke allerede installert:

```bash
npm install -g openclaw
```

### Trinn 2: Installer `not-claude-code-emulator`

Dette er komponenten som får OpenClaw-trafikken din til å snakke flytende Claude Code CLI. Uten den er det ingenting for dette pluginet å verifisere — og ingenting som står mellom API-kallene dine og en ekstra brukslinje.

```bash
# Alternativ A: npm global (anbefalt)
npm install -g not-claude-code-emulator

# Alternativ B: fest til nøyaktig støttet commit (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Trinn 3: Installer `openclaw-cc-camouflage`

```bash
# Alternativ A: npm global (publisert pakke)
npm install -g openclaw-cc-camouflage

# Alternativ B: fra kilde
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Trinn 4: Konfigurer emulatorstien

Fortell pluginet hvor det kan finne `not-claude-code-emulator`:

```bash
# Hvis du brukte npm global-installasjon:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Hvis du klonet manuelt:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Legg til i shell-profilen din for persistens:

```bash
# ~/.zshrc eller ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Valgfritt — konfigurer ytterligere fallback-søkestier (kolon-separert på macOS/Linux, semikolon på Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Trinn 5: Registrer pluginet i OpenClaw

Legg til i `openclaw.json` eller `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Hvis du installerte fra kilde, bruk den lokale stien:

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

### Trinn 6: Verifiser installasjonen

```bash
bun run status
```

En sunn installasjon rapporterer:

```
emulator=present
patch=none
support=supported
```

Avslutningskode 0 betyr at alt er i orden. Avslutningskode 1 betyr at noe trenger oppmerksomhet.

For et mer detaljert bilde:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Vedlikeholdsstatus er sunn.
# next: Emulatorforutsetningen er lesbar og den nåværende plattformen støttes.
# next: Alle verktøy er tilgjengelige.
```

Hvis du ser `emulator=missing`, verifiser at `OC_CAMOUFLAGE_EMULATOR_ROOT` peker til en mappe som inneholder `not-claude-code-emulator`s `package.json`.

## Tilgjengelige verktøy

Dette pluginet eksponerer fire eksplisitte verktøy. De er ikke automatiske hooks.

### `status`

Rapporterer den nåværende tilstanden til emulatorinstallasjonen.

```bash
bun run status
```

Output-formatet er maskinlesbart:

```
emulator=present
patch=none
support=supported
```

Avslutningskode 0 betyr sunn. Avslutningskode 1 betyr at noe trenger oppmerksomhet.

### `doctor`

Gir diagnostisk veiledning basert på den nåværende tilstanden.

```bash
bun run doctor
```

Inspiserer filer og rapporterer handlingsrettede neste trinn. Installerer ikke, patcher eller modifiserer noe. Leser og rapporterer kun.

### `patch_apply`

Bruker patches på målet (for øyeblikket en stubb for fremtidig utvidelse).

```bash
bun run patch:apply
```

I den nåværende versjonen validerer dette miljøet, men modifiserer ikke noen peer-tilstand. Fremtidige versjoner kan implementere faktisk patching med rollback-markører.

### `patch_revert`

Tilbakestiller tidligere brukte patches (for øyeblikket en stubb for fremtidig utvidelse).

```bash
bun run patch:revert
```

I den nåværende versjonen validerer dette miljøet, men modifiserer ikke noen peer-tilstand.

## Hvorfor automatiske hooks kun er for verifisering

Automatiske hooks i dette pluginet er begrenset til kun verifisering og metadata. De bruker ikke patches automatisk fordi:

1. Å mutere en peer uten eksplisitt brukerintensjon bryter prinsippet om minst mulig overraskelse
2. Patching-feil trenger menneskelig gjennomgang, ikke stille forsøk på nytt
3. Rollback krever eksplisitt samtykke for å gjenopprette tilstand

Hooks advarer når drift oppdages. Du bestemmer om du vil bruke, tilbakestille eller la miljøet være uendret.

Pluginet verifiserer beredskap. Hva du gjør med et ordentlig vedlikeholdt oppsett er mellom deg og abonnementsplanen din.

## Plattformstøtte

| Plattform | Status | Merknader |
|-----------|--------|-----------|
| macOS | Støttet | Primært skrivebordsmiljø |
| Linux | Støttet | Samme festede upstream-fixtures |
| Windows | Støttet | Støtter stasjonsbokstav- og bakslash-basert plugin-oppdaging |

## Kompatibilitets-kanarifugl

For å sjekke for upstream-drift mot festede mål:

```bash
bun run compat:canary
```

Kun-lese-sjekk. Validerer fixture-integritet og upstream-referanser uten å modifisere noe. Avslutter med 0 på festede støttede mål.

## Dokumentasjon

- `docs/install.md` - Forutsetninger og installasjonstrinn
- `docs/compatibility.md` - Kompatibilitetsgrenser
- `docs/support-matrix.md` - Låste fixture-versjoner
- `docs/non-goals.md` - Eksplisitte elementer utenfor omfang
- `docs/rollback.md` - Emulator-gjenopprettingsprosedyrer

## Utvikling

```bash
# Installer avhengigheter
bun install

# Type-sjekk
bun run typecheck

# Kjør tester
bun run test:unit
bun run test:integration

# Verifiser patches mot fixtures
bun run verify:patches

# Sjekk publiseringssikkerhet
bun run check:publish-safety
```

## Lisens

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
