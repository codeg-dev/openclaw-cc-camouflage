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

Un plugin di manutenzione companion per OpenClaw che verifica che `not-claude-code-emulator` sia presente e in salute.

*Perché la migliore operazione inizia confermando che la tua copertura è al suo posto.*

## Cosa fa questo

`not-claude-code-emulator` è il runtime che traduce le chiamate API di OpenClaw in qualcosa che l'infrastruttura di Anthropic riconosce come proveniente da una sessione Claude Code CLI — il tipo che è sempre stata coperta da un abbonamento standard Pro o Max, senza costi extra di utilizzo richiesti. `openclaw-cc-camouflage` è il controllo pre-volo che conferma che il traduttore è presente e operativo prima che ne abbia bisogno.

Il nome non è una coincidenza. Il tuo traffico entra sembrando una cosa, arriva sembrando un'altra. Questo plugin verifica che il "guardaroba" sia pronto.

Concretamente:

- **Rileva** `not-claude-code-emulator` tramite tre percorsi di scoperta (variabile d'ambiente → npm global → percorsi di fallback)
- **Riporta** stato leggibile dalla macchina: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Diagnostica** problemi con passaggi successivi attuabili quando qualcosa va storto
- **Riserva** `patch_apply` / `patch_revert` come stub espliciti per operazioni future

Nulla muta automaticamente. Gli hook sono solo per verifica. Esegui `status`, ottieni il rapporto e decidi cosa fare dopo.

## Installazione

Installa in ordine. Ogni passaggio dipende dal precedente.

### Passo 1: Installa OpenClaw

Se non è già installato:

```bash
npm install -g openclaw
```

### Passo 2: Installa `not-claude-code-emulator`

Questo è il componente che fa parlare fluentemente il tuo traffico OpenClaw in CLI di Claude Code. Senza di esso, non c'è nulla che questo plugin possa verificare — e nulla tra le tue chiamate API e una voce di utilizzo extra.

```bash
# Opzione A: npm global (consigliato)
npm install -g not-claude-code-emulator

# Opzione B: fissa al commit supportato esatto (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Passo 3: Installa `openclaw-cc-camouflage`

```bash
# Opzione A: npm global (pacchetto pubblicato)
npm install -g openclaw-cc-camouflage

# Opzione B: dal codice sorgente
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Passo 4: Configura il percorso dell'emulatore

Di' al plugin dove trovare `not-claude-code-emulator`:

```bash
# Se hai usato l'installazione npm global:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Se hai clonato manualmente:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Aggiungi al tuo profilo shell per la persistenza:

```bash
# ~/.zshrc o ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Opzionale — configura percorsi di ricerca di fallback aggiuntivi (separati da due punti su macOS/Linux, punto e virgola su Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Passo 5: Registra il plugin in OpenClaw

Aggiungi al tuo `openclaw.json` o `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Se hai installato dal codice sorgente, usa il percorso locale:

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

### Passo 6: Verifica l'installazione

```bash
bun run status
```

Un'installazione sana riporta:

```
emulator=present
patch=none
support=supported
```

Il codice di uscita 0 significa che tutto è in ordine. Il codice di uscita 1 significa che qualcosa richiede attenzione.

Per un'immagine più dettagliata:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Lo stato di manutenzione è sano.
# next: Il prerequisito dell'emulatore è leggibile e la piattaforma corrente è supportata.
# next: Tutti gli strumenti sono disponibili.
```

Se vedi `emulator=missing`, verifica che `OC_CAMOUFLAGE_EMULATOR_ROOT` punti a una directory contenente il `package.json` di `not-claude-code-emulator`.

## Strumenti disponibili

Questo plugin espone quattro strumenti espliciti. Non sono hook automatici.

### `status`

Riporta lo stato attuale dell'installazione dell'emulatore.

```bash
bun run status
```

Il formato di output è leggibile dalla macchina:

```
emulator=present
patch=none
support=supported
```

Il codice di uscita 0 significa sano. Il codice di uscita 1 significa che qualcosa richiede attenzione.

### `doctor`

Fornisce orientamento diagnostico basato sullo stato attuale.

```bash
bun run doctor
```

Ispeziona i file e riporta passaggi successivi attuabili. Non installa, non patcha, non modifica nulla. Solo legge e riporta.

### `patch_apply`

Applica patch al target (attualmente uno stub per estensione futura).

```bash
bun run patch:apply
```

Nella versione corrente, questo valida l'ambiente ma non modifica alcuno stato peer. Le versioni future possono implementare patching reale con marker di rollback.

### `patch_revert`

Ripristina patch precedentemente applicate (attualmente uno stub per estensione futura).

```bash
bun run patch:revert
```

Nella versione corrente, questo valida l'ambiente ma non modifica alcuno stato peer.

## Perché gli hook automatici sono solo per verifica

Gli hook automatici in questo plugin sono limitati solo a verifica e metadati. Non applicano patch automaticamente perché:

1. Mutare un peer senza intenzione esplicita dell'utente viola il principio della minima sorpresa
2. I fallimenti di patching necessitano di revisione umana, non di tentativi silenziosi
3. Il rollback richiede consenso esplicito per ripristinare lo stato

Gli hook avvertono quando viene rilevata deriva. Tu decidi se applicare, ripristinare o lasciare l'ambiente invariato.

Il plugin verifica la prontezza. Cosa fai con una configurazione correttamente mantenuta è tra te e il tuo piano di abbonamento.

## Supporto piattaforma

| Piattaforma | Stato | Note |
|-------------|-------|------|
| macOS | Supportato | Ambiente desktop principale |
| Linux | Supportato | Stessi fixtures upstream fissati |
| Windows | Supportato | Supporta il rilevamento dei plugin basato su lettera di unità e backslash |

## Canarino di compatibilità

Per verificare la deriva upstream rispetto ai target fissati:

```bash
bun run compat:canary
```

Controllo di sola lettura. Valida l'integrità dei fixtures e i riferimenti upstream senza modificare nulla. Esce con 0 sui target supportati fissati.

## Documentazione

- `docs/install.md` - Prerequisiti e passaggi di installazione
- `docs/compatibility.md` - Limiti di compatibilità
- `docs/support-matrix.md` - Versioni dei fixtures bloccate
- `docs/non-goals.md` - Elementi esplicitamente fuori dallo scope
- `docs/rollback.md` - Procedure di recupero dell'emulatore

## Sviluppo

```bash
# Installa le dipendenze
bun install

# Type check
bun run typecheck

# Esegui i test
bun run test:unit
bun run test:integration

# Verifica le patch contro i fixtures
bun run verify:patches

# Verifica la sicurezza di pubblicazione
bun run check:publish-safety
```

## Licenza

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
