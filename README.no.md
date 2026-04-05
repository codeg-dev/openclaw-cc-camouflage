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

Et følge-vedlikeholdsprogramtillegg for OpenClaw som hjelper med å verifisere not-claude-code-emulator-status. Denne pakken er ikke en fork av upstream-prosjekter. Den gir eksplisitte verktøy uten automatiske hooks.

## Hva dette er

`openclaw-cc-camouflage` er et vedlikeholdsprogramtillegg som:

- Verifiserer emulator-tilstedeværelse og -helse før noen operasjoner
- Rapporterer status og gir diagnostisk veiledning
- Gir stub-implementeringer for fremtidige patch-operasjoner

Den bruker ikke automatisk patcher under installasjon. Alle mutasjoner krever eksplisitt verktøy-invokasjon.

## Forutsetninger og installasjonsrekkefølge

Installasjonsrekkefølgen betyr noe. Du må ha følgende på plass før dette programtillegget kan fungere:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - Meldings-runtime som gir Anthropic-kompatible grensesnitt
   - Installer via npm: `npm install -g not-claude-code-emulator`
   - Eller klon inn i `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (denne pakken)
   - Installer sist, etter at emulatoren er til stede

Konfigurer miljøvariabelen:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Eller bruk reserve-stier:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Tilgjengelige verktøy

Dette programtillegget eksponerer fire eksplisitte verktøy. De er ikke automatiske hooks.

### `status`

Rapporterer den nåværende tilstanden til emulator-installasjonen.

```bash
bun run status
```

Utdataformatet er maskinlesbart:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Avslutningskode 0 betyr sunn. Avslutningskode 1 betyr at noe trenger oppmerksomhet.

### `doctor`

Gir diagnostisk veiledning basert på nåværende tilstand.

```bash
bun run doctor
```

Dette inspiserer filer og rapporterer handlingssvarende neste trinn. Det installerer, patcher eller modifiserer ingenting. Det leser og rapporterer kun.

### `patch_apply`

Bruker patcher på målet (for øyeblikket en stub for fremtidig utvidelse).

```bash
bun run patch:apply
```

I gjeldende versjon validerer dette miljøet, men modifiserer ingen peer-tilstand. Fremtidige versjoner kan implementere faktisk patching med rollback-markører.

### `patch_revert`

Tilbakefører tidligere brukte patcher (for øyeblikket en stub for fremtidig utvidelse).

```bash
bun run patch:revert
```

I gjeldende versjon validerer dette miljøet, men modifiserer ingen peer-tilstand. Fremtidige versjoner kan implementere faktisk tilbakeføring ved hjelp av rollback-markører.

## Hvorfor automatiske hooks kun er verifisering

Automatiske hooks i dette programtillegget er begrenset til kun verifisering og metadata. De bruker ikke automatisk patcher fordi:

1. Å mutere en peer uten eksplisitt brukerhensikt bryter prinsippet om minst overraskelse
2. Patch-feil trenger menneskelig gjennomgang, ikke stille forsøk på nytt
3. Tilbakeføring krever eksplisitt samtykke for å gjenopprette tilstand

Hooks advarer når drift oppdages. Du bestemmer om du vil bruke, tilbakeføre, eller la miljøet være uendret.

## Plattformstøtte

| Plattform | Status | Notater |
|----------|--------|-------|
| macOS    | Støttet | Primært desktop-miljø |
| Linux    | Støttet | Samme fastlåste upstream-fixtures |
| Windows  | Støttet | Støtter stasjonsbokstav- og bakslash-basert plugin-oppdagelse |

## Kompatibilitetskanarifugl

For å sjekke upstream-drift mot fastlåste mål:

```bash
bun run compat:canary
```

Dette er en skrivebeskyttet kontroll som validerer fixture-integritet og upstream-referanser uten å modifisere noe. Den avslutter med 0 på fastlåste støttede mål.

## Dokumentasjon

- `docs/install.md` - Forutsetninger og installasjonstrinn
- `docs/compatibility.md` - Kompatibilitetsgrenser
- `docs/support-matrix.md` - Låste fixture-versjoner
- `docs/non-goals.md` - Eksplisitte utenfor-scope-elementer

## Utvikling

```bash
# Installer avhengigheter
bun install

# Typekontroll
bun run typecheck

# Kjør tester
bun run test:unit
bun run test:integration

# Verifiser patcher mot fixtures
bun run verify:patches

# Sjekk publiseringssikkerhet
bun run check:publish-safety
```

## Lisens

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->