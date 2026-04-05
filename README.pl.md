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

Wtyczka towarzysząca do konserwacji dla OpenClaw, która pomaga weryfikować status not-claude-code-emulator. Ten pakiet nie jest forkiem projektów upstream. Zapewnia jawne narzędzia bez automatycznych hooków.

## Co to jest

`openclaw-cc-camouflage` to wtyczka do konserwacji, która:

- Weryfikuje obecność i stan emulatora przed jakimikolwiek operacjami
- Raportuje status i zapewnia wskazówki diagnostyczne
- Zapewnia implementacje stub dla przyszłych operacji patchowania

Nie stosuje automatycznie patchy podczas instalacji. Wszystkie mutacje wymagają jawnego wywołania narzędzia.

## Wymagania wstępne i kolejność instalacji

Kolejność instalacji ma znaczenie. Musisz mieć następujące elementy na miejscu, zanim ta wtyczka będzie mogła działać:

1. **`not-claude-code-emulator`** (commit `5541e5c`)
   - Środowisko uruchomieniowe wiadomości, które zapewnia interfejsy kompatybilne z Anthropic
   - Zainstaluj przez npm: `npm install -g not-claude-code-emulator`
   - Lub sklonuj do `~/github/not-claude-code-emulator`

2. **`openclaw-cc-camouflage`** (ten pakiet)
   - Zainstaluj na końcu, po pojawieniu się emulatora

Skonfiguruj zmienną środowiskową:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Lub użyj ścieżek awaryjnych:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## Dostępne narzędzia

Ta wtyczka eksponuje cztery jawne narzędzia. Nie są to automatyczne hooki.

### `status`

Raportuje aktualny stan instalacji emulatora.

```bash
bun run status
```

Format wyjścia jest czytelny dla maszyny:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

Kod wyjścia 0 oznacza zdrowy. Kod wyjścia 1 oznacza, że coś wymaga uwagi.

### `doctor`

Zapewnia wskazówki diagnostyczne na podstawie aktualnego stanu.

```bash
bun run doctor
```

To sprawdza pliki i raportuje kolejne kroki do podjęcia. Nie instaluje, nie patchuje ani nie modyfikuje niczego. Tylko czyta i raportuje.

### `patch_apply`

Stosuje patche do celu (obecnie stub dla przyszłego rozszerzenia).

```bash
bun run patch:apply
```

W aktualnej wersji to waliduje środowisko, ale nie modyfikuje żadnego stanu peer. Przyszłe wersje mogą zaimplementować rzeczywiste patchowanie z markerami rollback.

### `patch_revert`

Cofa wcześniej zastosowane patche (obecnie stub dla przyszłego rozszerzenia).

```bash
bun run patch:revert
```

W aktualnej wersji to waliduje środowisko, ale nie modyfikuje żadnego stanu peer. Przyszłe wersje mogą zaimplementować rzeczywiste cofanie przy użyciu markerów rollback.

## Dlaczego automatyczne hooki są tylko do weryfikacji

Automatyczne hooki w tej wtyczce są ograniczone tylko do weryfikacji i metadanych. Nie stosują automatycznie patchy, ponieważ:

1. Mutowanie peera bez wyraźnej intencji użytkownika narusza zasadę najmniejszego zaskoczenia
2. Niepowodzenia patchowania wymagają przeglądu przez człowieka, a nie cichych ponownych prób
3. Cofanie wymaga wyraźnej zgody na przywrócenie stanu

Hooki ostrzegają, gdy wykryte zostanie odchylenie. Ty decydujesz, czy zastosować, cofnąć, czy pozostawić środowisko bez zmian.

## Wsparcie platformy

| Platforma | Status | Uwagi |
|----------|--------|-------|
| macOS    | Wspierane | Główne środowisko desktopowe |
| Linux    | Wspierane | Te same przypięte fixture upstream |
| Windows  | Wspierane | Obsługuje wykrywanie wtyczek oparte na literze dysku i ukośniku odwrotnym |

## Kanarek kompatybilności

Aby sprawdzić odchylenie upstream w stosunku do przypiętych celów:

```bash
bun run compat:canary
```

To jest kontrola tylko do odczytu, która weryfikuje integralność fixture i referencje upstream bez modyfikowania czegokolwiek. Kończy się kodem 0 na przypiętych wspieranych celach.

## Dokumentacja

- `docs/install.md` - Wymagania wstępne i kroki instalacji
- `docs/compatibility.md` - Granice kompatybilności
- `docs/support-matrix.md` - Zablokowane wersje fixture
- `docs/non-goals.md` - Jawne elementy poza zakresem

## Rozwój

```bash
# Zainstaluj zależności
bun install

# Sprawdzenie typów
bun run typecheck

# Uruchom testy
bun run test:unit
bun run test:integration

# Weryfikuj patche w stosunku do fixture
bun run verify:patches

# Sprawdź bezpieczeństwo publikacji
bun run check:publish-safety
```

## Licencja

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->