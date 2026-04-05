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

Et ledsage-vedligeholdelsesplugin til OpenClaw, der hjælper med at verificere not-claude-code-emulator-status. Denne pakke er ikke en fork af upstream-projekter. Den leverer eksplicitte værktøjer uden automatiske hooks.

## Hvad dette er

`openclaw-cc-camouflage` er et vedligeholdelsesplugin, der:

- Verificerer emulator-tilstedeværelse og -sundhed før nogen operationer
- Rapporterer status og leverer diagnostisk vejledning
- Leverer stub-implementeringer til fremtidige patch-operationer

Det anvender ikke automatisk patches under installation. Alle mutationer kræver eksplicit værktøjsinvokation.

## Forudsætninger og installationsrækkefølge

Installationsrækkefølgen betyder noget. Du skal have følgende på plads, før dette plugin kan fungere:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - Meddelelses-runtime, der leverer Anthropic-kompatible grænseflader
   - Installer via npm: `npm install -g not-claude-code-emulator`
   - Eller klon ind i `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (denne pakke)
   - Installer sidst, efter emulator er til stede

Konfigurer miljøvariablen:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Eller brug fallback-stier:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Tilgængelige værktøjer

Dette plugin eksponerer fire eksplicitte værktøjer. De er ikke automatiske hooks.

### `status`

Rapporterer den aktuelle tilstand af emulator-installationen.

```bash
bun run status
```

Outputformatet er maskinlæsbart:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Afslutningskode 0 betyder sund. Afslutningskode 1 betyder, at noget kræver opmærksomhed.

### `doctor`

Leverer diagnostisk vejledning baseret på den aktuelle tilstand.

```bash
bun run doctor
```

Dette inspicerer filer og rapporterer handlingssvarende næste trin. Det installerer, patcher eller modificerer ikke noget. Det læser kun og rapporterer.

### `patch_apply`

Anvender patches til målet (i øjeblikket en stub til fremtidig udvidelse).

```bash
bun run patch:apply
```

I den aktuelle version validerer dette miljøet, men modificerer ikke nogen peer-tilstand. Fremtidige versioner kan implementere faktisk patching med rollback-markører.

### `patch_revert`

Tilbagefører tidligere anvendte patches (i øjeblikket en stub til fremtidig udvidelse).

```bash
bun run patch:revert
```

I den aktuelle version validerer dette miljøet, men modificerer ikke nogen peer-tilstand. Fremtidige versioner kan implementere faktisk tilbageførsel ved hjælp af rollback-markører.

## Hvorfor automatiske hooks kun er verifikation

Automatiske hooks i dette plugin er begrænset til kun verifikation og metadata. De anvender ikke automatisk patches, fordi:

1. At mutere en peer uden eksplicit brugerhensigt overtræder princippet om mindste overraskelse
2. Patch-fejl har brug for menneskelig gennemgang, ikke stille forsøg igen
3. Tilbageførsel kræver eksplicit samtykke til at gendanne tilstand

Hooks advarer, når der registreres afdrift. Du beslutter, om du vil anvende, tilbageføre eller lade miljøet være uændret.

## Platformsunderstøttelse

| Platform | Status | Noter |
|----------|--------|-------|
| macOS    | Understøttet | Primært desktop-miljø |
| Linux    | Understøttet | Samme pinned upstream fixtures |
| Windows  | Understøttet | Understøtter drevbogstav- og backslash-baseret plugin-opdagelse |

## Kompatibilitetskanariefugl

For at tjekke upstream-afdrift mod pinned mål:

```bash
bun run compat:canary
```

Dette er en skrivebeskyttet kontrol, der validerer fixture-integritet og upstream-referencer uden at modificere noget. Den afslutter med 0 på pinned understøttede mål.

## Dokumentation

- `docs/install.md` - Forudsætninger og installations-trin
- `docs/compatibility.md` - Kompatibilitetsgrænser
- `docs/support-matrix.md` - Låste fixture-versioner
- `docs/non-goals.md` - Eksplicitte udenfor-scope-elementer

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

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->