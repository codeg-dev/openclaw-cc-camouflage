<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <strong>Bosanski</strong> |
  <a href="README.da.md">Dansk</a> |
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

Pomoćni dodatak za održavanje za OpenClaw koji pomaže u provjeri statusa not-claude-code-emulator. Ovaj paket nije fork upstream projekata. Pruža eksplicitne alate bez automatskih hook-ova.

## Šta je ovo

`openclaw-cc-camouflage` je dodatak za održavanje koji:

- Provjerava prisustvo i zdravlje emulatora prije bilo kakvih operacija
- Izvještava o statusu i pruža dijagnostičke smjernice
- Pruža stub implementacije za buduće operacije zakrpa

Ne primjenjuje zakrpe automatski tijekom instalacije. Sve mutacije zahtijevaju eksplicitni poziv alata.

## Preduvjeti i redoslijed instalacije

Redoslijed instalacije je važan. Morate imati sljedeće na mjestu prije nego što ovaj dodatak može funkcionirati:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - Runtime poruka koji pruža Anthropic-kompatibilne interfejse
   - Instalirajte putem npm-a: `npm install -g not-claude-code-emulator`
   - Ili klonirajte u `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (ovaj paket)
   - Instalirajte posljednji, nakon što je emulator prisutan

Konfigurirajte varijablu okruženja:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Ili koristite rezervne putanje:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Dostupni alati

Ovaj dodatak izlaže četiri eksplicitna alata. Oni nisu automatski hook-ovi.

### `status`

Izvještava o trenutnom stanju instalacije emulatora.

```bash
bun run status
```

Format izlaza je čitljiv stroju:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Izlazni kod 0 znači zdravo. Izlazni kod 1 znači da nešto zahtijeva pažnju.

### `doctor`

Pruža dijagnostičke smjernice na osnovu trenutnog stanja.

```bash
bun run doctor
```

Ovo pregledava datoteke i izvještava o mjerama koje se mogu poduzeti. Ne instalira, ne zakrpa niti mijenja bilo šta. Samo čita i izvještava.

### `patch_apply`

Primjenjuje zakrpe na cilj (trenutno stub za buduće proširenje).

```bash
bun run patch:apply
```

U trenutnoj verziji, ovo validira okruženje ali ne mijenja nijedno stanje peer-a. Buduće verzije mogu implementirati stvarno zakrpanje s markerima za povratak.

### `patch_revert`

Vraća prethodno primijenjene zakrpe (trenutno stub za buduće proširenje).

```bash
bun run patch:revert
```

U trenutnoj verziji, ovo validira okruženje ali ne mijenja nijedno stanje peer-a. Buduće verzije mogu implementirati stvarno vraćanje koristeći markere za povratak.

## Zašto su automatski hook-ovi samo za provjeru

Automatski hook-ovi u ovom dodatku su ograničeni samo na provjeru i metapodatke. Oni ne primjenjuju zakrpe automatski jer:

1. Mutiranje peer-a bez eksplicitne namjere korisnika krši princip najmanjeg iznenađenja
2. Neuspjesi zakrpanja zahtijevaju ljudski pregled, ne tihu ponovnu probu
3. Povratak zahtijeva eksplicitni pristanak za vraćanje stanja

Hook-ovi upozoravaju kada se otkrije odstupanje. Vi odlučujete da li ćete primijeniti, vratiti ili ostaviti okruženje nepromijenjenim.

## Podrška za platforme

| Platforma | Status | Napomene |
|----------|--------|-------|
| macOS    | Podržano | Primarno desktop okruženje |
| Linux    | Podržano | Isti pričvršćeni upstream fixture-i |
| Windows  | Podržano | Podržava otkrivanje dodataka na osnovu slova diska i obrnutih kosa crta |

## Kompatibilnost kanarinac

Za provjeru upstream odstupanja u odnosu na pričvršćene ciljeve:

```bash
bun run compat:canary
```

Ovo je provjera samo za čitanje koja validira integritet fixture-a i upstream reference bez mijenjanja bilo čega. Izlazi s kodom 0 na pričvršćenim podržanim ciljevima.

## Dokumentacija

- `docs/install.md` - Preduvjeti i koraci instalacije
- `docs/compatibility.md` - Granice kompatibilnosti
- `docs/support-matrix.md` - Zaključane verzije fixture-a
- `docs/non-goals.md` - Eksplicitne stavke izvan opsega

## Razvoj

```bash
# Instalirajte zavisnosti
bun install

# Provjera tipova
bun run typecheck

# Pokrenite testove
bun run test:unit
bun run test:integration

# Provjerite zakrpe u odnosu na fixture-e
bun run verify:patches

# Provjerite sigurnost objavljivanja
bun run check:publish-safety
```

## Licenca

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->