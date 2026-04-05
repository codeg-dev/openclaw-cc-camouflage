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

Pomoćni dodatak za održavanje za OpenClaw koji provjerava da li je `not-claude-code-emulator` prisutan i zdrav.

*Jer najbolja operacija počinje potvrdom da je vaša maska na mjestu.*

## Šta ovo radi

`not-claude-code-emulator` je runtime koji prevodi OpenClaw API pozive u nešto što Anthropic-ova infrastruktura prepoznaje kao dolazeće iz Claude Code CLI sesije — one vrste koja je uvijek bila pokrivena standardnom Pro ili Max pretplatom, bez dodatnih troškova korištenja. `openclaw-cc-camouflage` je preletna provjera koja potvrđuje da je prevodilac prisutan i operativan prije nego što vam zatreba.

Ime nije slučajnost. Vaš promet ulazi izgledajući kao jedna stvar, stiže izgledajući kao druga. Ovaj dodatak provjerava da li je "ormar" spreman.

Konkretno:

- **Otkriva** `not-claude-code-emulator` putem tri puta otkrivanja (env var → npm global → fallback putanje)
- **Izvještava** o statusu čitljivom za mašine: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Dijagnosticira** probleme sa djelotvornim sljedećim koracima kada nešto nije u redu
- **Rezerviše** `patch_apply` / `patch_revert` kao eksplicitne stubove za buduće operacije

Ništa se ne mijenja automatski. Hookovi su samo za provjeru. Pokrenete `status`, dobijete izvještaj i odlučite šta dalje.

## Instalacija

Instalirajte redom. Svaki korak ovisi o prethodnom.

### Korak 1: Instalirajte OpenClaw

Ako već nije instaliran:

```bash
npm install -g openclaw
```

### Korak 2: Instalirajte `not-claude-code-emulator`

Ovo je komponenta koja čini da vaš OpenClaw promet tečno govori Claude Code CLI jezik. Bez njega, nema ničeg što ovaj dodatak može provjeriti — i ništa između vaših API poziva i stavke dodatnog korištenja.

```bash
# Opcija A: npm global (preporučeno)
npm install -g not-claude-code-emulator

# Opcija B: prikačite na tačan podržani commit (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Korak 3: Instalirajte `openclaw-cc-camouflage`

```bash
# Opcija A: npm global (objavljeni paket)
npm install -g openclaw-cc-camouflage

# Opcija B: iz izvora
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Korak 4: Konfigurišite putanju emulatora

Recite dodatku gdje pronaći `not-claude-code-emulator`:

```bash
# Ako ste koristili npm global instalaciju:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Ako ste ručno klonirali:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Dodajte u vaš shell profil za perzistenciju:

```bash
# ~/.zshrc ili ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Opcionalno — konfigurišite dodatne fallback putanje pretrage (odvojene dvotačkom na macOS/Linux, tačka-zarezom na Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Korak 5: Registrujte dodatak u OpenClaw

Dodajte u vaš `openclaw.json` ili `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Ako ste instalirali iz izvora, koristite lokalnu putanju:

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

### Korak 6: Provjerite instalaciju

```bash
bun run status
```

Zdrava instalacija izvještava:

```
emulator=present
patch=none
support=supported
```

Izlazni kod 0 znači da je sve u redu. Izlazni kod 1 znači da nešto zahtijeva pažnju.

Za detaljniju sliku:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Status održavanja je zdrav.
# next: Preduvjet emulatora je čitljiv i trenutna platforma je podržana.
# next: Svi alati su dostupni.
```

Ako vidite `emulator=missing`, provjerite da li `OC_CAMOUFLAGE_EMULATOR_ROOT` pokazuje na direktorij koji sadrži `package.json` od `not-claude-code-emulator`.

## Dostupni alati

Ovaj dodatak izlaže četiri eksplicitna alata. Oni nisu automatski hookovi.

### `status`

Izvještava o trenutnom stanju instalacije emulatora.

```bash
bun run status
```

Format izlaza je čitljiv za mašine:

```
emulator=present
patch=none
support=supported
```

Izlazni kod 0 znači zdravo. Izlazni kod 1 znači da nešto zahtijeva pažnju.

### `doctor`

Pruža dijagnostičke smjernice na osnovu trenutnog stanja.

```bash
bun run doctor
```

Pregledava datoteke i izvještava o djelotvornim sljedećim koracima. Ne instalira, ne patchuje ni ne mijenja ništa. Samo čita i izvještava.

### `patch_apply`

Primjenjuje patchove na cilj (trenutno stub za buduće proširenje).

```bash
bun run patch:apply
```

U trenutnoj verziji, ovo validira okruženje ali ne mijenja nijedno stanje para. Buduće verzije mogu implementirati stvarno patchovanje sa markerima za vraćanje.

### `patch_revert`

Vraća prethodno primijenjene patchove (trenutno stub za buduće proširenje).

```bash
bun run patch:revert
```

U trenutnoj verziji, ovo validira okruženje ali ne mijenja nijedno stanje para.

## Zašto su automatski hookovi samo za provjeru

Automatski hookovi u ovom dodatku su ograničeni samo na provjeru i metapodatke. Ne primjenjuju patchove automatski jer:

1. Mijenjanje para bez eksplicitne namjere korisnika krši princip najmanjeg iznenađenja
2. Greške u patchovanju zahtijevaju ljudski pregled, a ne tihe pokušaje ponovnog pokušaja
3. Vraćanje zahtijeva eksplicitni pristanak za obnavljanje stanja

Hookovi upozoravaju kada se otkrije odstupanje. Vi odlučujete da li primijeniti, vratiti ili ostaviti okruženje nepromijenjenim.

Dodatak provjerava spremnost. Šta radite sa pravilno održavanim postavljanjem je između vas i vašeg plana pretplate.

## Podrška platformi

| Platforma | Status | Bilješke |
|-----------|--------|----------|
| macOS | Podržano | Primarno desktop okruženje |
| Linux | Podržano | Isti prikačeni upstream fixtures |
| Windows | Podržano | Podržava otkrivanje dodataka na osnovu slova pogona i obrnute kose crte |

## Kanarinci kompatibilnosti

Da biste provjerili upstream drift u odnosu na prikačene ciljeve:

```bash
bun run compat:canary
```

Provjera samo za čitanje. Validira integritet fixtures i upstream reference bez mijenjanja bilo čega. Izlazi sa 0 na prikačenim podržanim ciljevima.

## Dokumentacija

- `docs/install.md` - Preduvjeti i koraci instalacije
- `docs/compatibility.md` - Granice kompatibilnosti
- `docs/support-matrix.md` - Zaključane verzije fixtures
- `docs/non-goals.md` - Eksplicitne stavke izvan opsega
- `docs/rollback.md` - Procedure oporavka emulatora

## Razvoj

```bash
# Instalirajte zavisnosti
bun install

# Provjera tipova
bun run typecheck

# Pokrenite testove
bun run test:unit
bun run test:integration

# Provjerite patchove protiv fixtures
bun run verify:patches

# Provjerite sigurnost objavljivanja
bun run check:publish-safety
```

## Licenca

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
