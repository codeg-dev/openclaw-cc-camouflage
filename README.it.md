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
  <strong>Italiano</strong> |
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

Un plugin complementare di manutenzione per OpenClaw che aiuta a verificare lo stato di not-claude-code-emulator. Questo pacchetto non è un fork di progetti upstream. Fornisce strumenti espliciti senza hook automatici.

## Cos'è questo

`openclaw-cc-camouflage` è un plugin di manutenzione che:

- Verifica la presenza e la salute dell'emulatore prima di qualsiasi operazione
- Segnala lo stato e fornisce indicazioni diagnostiche
- Fornisce implementazioni stub per operazioni di patch future

Non applica automaticamente patch durante l'installazione. Tutte le mutazioni richiedono l'invocazione esplicita dello strumento.

## Prerequisiti e ordine di installazione

L'ordine di installazione è importante. Devi avere quanto segue in posizione prima che questo plugin possa funzionare:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - Il runtime di messaggi che fornisce interfacce compatibili con Anthropic
   - Installa via npm: `npm install -g not-claude-code-emulator`
   - O clona in `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (questo pacchetto)
   - Installa per ultimo, dopo che l'emulatore è presente

Configura la variabile d'ambiente:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

O usa percorsi di fallback:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Strumenti disponibili

Questo plugin espone quattro strumenti espliciti. Non sono hook automatici.

### `status`

Segnala lo stato attuale dell'installazione dell'emulatore.

```bash
bun run status
```

Il formato di output è leggibile dalla macchina:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Il codice di uscita 0 significa sano. Il codice di uscita 1 significa che qualcosa necessita attenzione.

### `doctor`

Fornisce indicazioni diagnostiche basate sullo stato attuale.

```bash
bun run doctor
```

Questo ispeziona i file e segnala i passaggi successivi actionable. Non installa, patch o modifica nulla. Legge e segnala solo.

### `patch_apply`

Applica patch al target (attualmente uno stub per estensione futura).

```bash
bun run patch:apply
```

Nella versione attuale, questo convalida l'ambiente ma non modifica alcuno stato peer. Le versioni future potrebbero implementare patching reale con marker di rollback.

### `patch_revert`

Ripristina patch precedentemente applicate (attualmente uno stub per estensione futura).

```bash
bun run patch:revert
```

Nella versione attuale, questo convalida l'ambiente ma non modifica alcuno stato peer. Le versioni future potrebbero implementare ripristino reale utilizzando marker di rollback.

## Perché gli hook automatici sono solo di verifica

Gli hook automatici in questo plugin sono limitati a verifica e metadati solo. Non applicano automaticamente patch perché:

1. Mutare un peer senza intenzione esplicita dell'utente viola il principio della minima sorpresa
2. I fallimenti di patching necessitano di revisione umana, non di tentativi silenziosi
3. Il rollback richiede consenso esplicito per ripristinare lo stato

Gli hook avvertono quando viene rilevata deriva. Tu decidi se applicare, ripristinare o lasciare l'ambiente invariato.

## Supporto piattaforma

| Piattaforma | Stato | Note |
|----------|--------|-------|
| macOS    | Supportato | Ambiente desktop primario |
| Linux    | Supportato | Stessi fixture upstream fissati |
| Windows  | Supportato | Supporta il rilevamento plugin basato su lettera unità e backslash |

## Canarino di compatibilità

Per controllare la deriva upstream rispetto ai target fissati:

```bash
bun run compat:canary
```

Questo è un controllo di sola lettura che convalida l'integrità dei fixture e i riferimenti upstream senza modificare nulla. Esce con 0 su target fissati supportati.

## Documentazione

- `docs/install.md` - Prerequisiti e passaggi di installazione
- `docs/compatibility.md` - Limiti di compatibilità
- `docs/support-matrix.md` - Versioni di fixture bloccate
- `docs/non-goals.md` - Elementi esplicitamente fuori scope

## Sviluppo

```bash
# Installa dipendenze
bun install

# Controllo tipi
bun run typecheck

# Esegui test
bun run test:unit
bun run test:integration

# Verifica patch contro fixture
bun run verify:patches

# Controlla sicurezza pubblicazione
bun run check:publish-safety
```

## Licenza

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->