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
  <a href="README.no.md">Norsk</a> |
  <strong>Polski</strong> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

Wtyczka towarzysząca do konserwacji dla OpenClaw, która weryfikuje, czy `not-claude-code-emulator` jest obecny i zdrowy.

*Ponieważ najlepsza operacja zaczyna się od potwierdzenia, że twoje przykrycie jest na miejscu.*

## Co to robi

`not-claude-code-emulator` to środowisko uruchomieniowe, które tłumaczy wywołania API OpenClaw na coś, co infrastruktura Anthropic rozpoznaje jako pochodzące z sesji Claude Code CLI — tego rodzaju, który zawsze był objęty standardową subskrypcją Pro lub Max, bez dodatkowych opłat za użycie. `openclaw-cc-camouflage` to kontrola przedlotowa, która potwierdza, że tłumacz jest obecny i działa zanim go potrzebujesz.

Nazwa nie jest przypadkiem. Twój ruch wchodzi wyglądając na jedną rzecz, dociera wyglądając na inną. Ta wtyczka weryfikuje, czy "szafa" jest gotowa.

Konkretnie:

- **Wykrywa** `not-claude-code-emulator` poprzez trzy ścieżki odkrywania (zmienna środowiskowa → npm global → ścieżki zapasowe)
- **Raportuje** status czytelny dla maszyn: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Diagnozuje** problemy z wykonalnymi kolejnymi krokami, gdy coś jest nie tak
- **Rezerwuje** `patch_apply` / `patch_revert` jako jawne stuby dla przyszłych operacji

Nic nie mutuje się automatycznie. Hooki są tylko do weryfikacji. Uruchamiasz `status`, otrzymujesz raport i decydujesz, co zrobić dalej.

## Instalacja

Instaluj w kolejności. Każdy krok zależy od poprzedniego.

### Krok 1: Zainstaluj OpenClaw

Jeśli jeszcze nie zainstalowany:

```bash
npm install -g openclaw
```

### Krok 2: Zainstaluj `not-claude-code-emulator`

To jest komponent, który sprawia, że twój ruch OpenClaw płynnie mówi w CLI Claude Code. Bez niego nie ma niczego, co ta wtyczka mogłaby zweryfikować — i niczego między twoimi wywołaniami API a pozycją dodatkowego użycia.

```bash
# Opcja A: npm global (zalecane)
npm install -g not-claude-code-emulator

# Opcja B: przypnij do dokładnego wspieranego commitu (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Krok 3: Zainstaluj `openclaw-cc-camouflage`

```bash
# Opcja A: npm global (opublikowany pakiet)
npm install -g openclaw-cc-camouflage

# Opcja B: ze źródła
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Krok 4: Skonfiguruj ścieżkę emulatora

Powiedz wtyczce, gdzie znaleźć `not-claude-code-emulator`:

```bash
# Jeśli użyłeś instalacji npm global:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Jeśli sklonowałeś ręcznie:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Dodaj do swojego profilu shella dla trwałości:

```bash
# ~/.zshrc lub ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Opcjonalnie — skonfiguruj dodatkowe zapasowe ścieżki wyszukiwania (rozdzielone dwukropkiem na macOS/Linux, średnikiem na Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Krok 5: Zarejestruj wtyczkę w OpenClaw

Dodaj do swojego `openclaw.json` lub `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Jeśli zainstalowałeś ze źródła, użyj lokalnej ścieżki:

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

### Krok 6: Zweryfikuj instalację

```bash
bun run status
```

Zdrowa instalacja raportuje:

```
emulator=present
patch=none
support=supported
```

Kod wyjścia 0 oznacza, że wszystko jest w porządku. Kod wyjścia 1 oznacza, że coś wymaga uwagi.

Dla bardziej szczegółowego obrazu:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Status konserwacji jest zdrowy.
# next: Wymaganie wstępne emulatora jest czytelne, a bieżąca platforma jest wspierana.
# next: Wszystkie narzędzia są dostępne.
```

Jeśli widzisz `emulator=missing`, zweryfikuj, czy `OC_CAMOUFLAGE_EMULATOR_ROOT` wskazuje na katalog zawierający `package.json` `not-claude-code-emulator`.

## Dostępne narzędzia

Ta wtyczka udostępnia cztery jawne narzędzia. Nie są to automatyczne hooki.

### `status`

Raportuje bieżący stan instalacji emulatora.

```bash
bun run status
```

Format wyjścia jest czytelny dla maszyn:

```
emulator=present
patch=none
support=supported
```

Kod wyjścia 0 oznacza zdrowy. Kod wyjścia 1 oznacza, że coś wymaga uwagi.

### `doctor`

Zapewnia wskazówki diagnostyczne na podstawie bieżącego stanu.

```bash
bun run doctor
```

Sprawdza pliki i raportuje wykonalne kolejne kroki. Nie instaluje, nie łata ani nie modyfikuje niczego. Tylko czyta i raportuje.

### `patch_apply`

Stosuje łatki do celu (obecnie stub dla przyszłego rozszerzenia).

```bash
bun run patch:apply
```

W bieżącej wersji waliduje środowisko, ale nie modyfikuje żadnego stanu peera. Przyszłe wersje mogą zaimplementować faktyczne łatanie ze znacznikami rollbacku.

### `patch_revert`

Cofa wcześniej zastosowane łatki (obecnie stub dla przyszłego rozszerzenia).

```bash
bun run patch:revert
```

W bieżącej wersji waliduje środowisko, ale nie modyfikuje żadnego stanu peera.

## Dlaczego automatyczne hooki są tylko do weryfikacji

Automatyczne hooki w tej wtyczce są ograniczone tylko do weryfikacji i metadanych. Nie stosują automatycznie łatek, ponieważ:

1. Mutywowanie peera bez wyraźnej intencji użytkownika narusza zasadę najmniejszego zaskoczenia
2. Błędy łatania wymagają przeglądu ludzkiego, a nie cichych ponownych prób
3. Rollback wymaga wyraźnej zgody na przywrócenie stanu

Hooki ostrzegają, gdy wykryte jest odchylenie. Ty decydujesz, czy zastosować, cofnąć czy pozostawić środowisko niezmienione.

Wtyczka weryfikuje gotowość. To, co robisz z prawidłowo utrzymanym zestawem, zależy od ciebie i twojego planu subskrypcji.

## Wsparcie platformy

| Platforma | Status | Uwagi |
|-----------|--------|-------|
| macOS | Wspierane | Główne środowisko desktopowe |
| Linux | Wspierane | Te same przypięte upstream fixtures |
| Windows | Wspierane | Obsługuje wykrywanie wtyczek oparte na literze dysku i backslashu |

## Kanarek kompatybilności

Aby sprawdzić odchylenie upstream względem przypiętych celów:

```bash
bun run compat:canary
```

Sprawdzenie tylko do odczytu. Weryfikuje integralność fixtures i referencje upstream bez modyfikowania czegokolwiek. Kończy się 0 na przypiętych wspieranych celach.

## Dokumentacja

- `docs/install.md` - Wymagania wstępne i kroki instalacji
- `docs/compatibility.md` - Granice kompatybilności
- `docs/support-matrix.md` - Zablokowane wersje fixtures
- `docs/non-goals.md` - Jawne elementy poza zakresem
- `docs/rollback.md` - Procedury odzyskiwania emulatora

## Rozwój

```bash
# Zainstaluj zależności
bun install

# Sprawdzenie typów
bun run typecheck

# Uruchom testy
bun run test:unit
bun run test:integration

# Weryfikuj łatki względem fixtures
bun run verify:patches

# Sprawdź bezpieczeństwo publikacji
bun run check:publish-safety
```

## Licencja

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
