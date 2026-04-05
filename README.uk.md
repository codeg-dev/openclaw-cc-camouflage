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
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <strong>Українська</strong> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

Супутній плагін обслуговування для OpenClaw, який перевіряє наявність та працездатність `not-claude-code-emulator`.

*Тому що найкраща операція починається з підтвердження, що ваше прикриття на місці.*

## Що це робить

`not-claude-code-emulator` — це середовище виконання, яке перетворює виклики API OpenClaw на щось, що інфраструктура Anthropic розпізнає як що надходить із сеансу Claude Code CLI — того типу, який завжди покривався стандартною підпискою Pro або Max без додаткових зборів за використання. `openclaw-cc-camouflage` — це передпольотна перевірка, яка підтверджує, що перекладач присутній і працює до того, як він вам знадобиться.

Назва не випадкова. Ваш трафік входить, виглядаючи як одне, прибуває, виглядаючи як інше. Цей плагін перевіряє, чи "шафа" готова.

Конкретно:

- **Виявляє** `not-claude-code-emulator` через три шляхи виявлення (змінна середовища → npm global → резервні шляхи)
- **Повідомляє** про стан у машиночитабельному форматі: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Діагностує** проблеми з виконуваними наступними кроками, коли щось не так
- **Резервує** `patch_apply` / `patch_revert` як явні заглушки для майбутніх операцій

Ніщо не змінюється автоматично. Хуки лише для перевірки. Ви запускаєте `status`, отримуєте звіт і вирішуєте, що робити далі.

## Встановлення

Встановлюйте по порядку. Кожен крок залежить від попереднього.

### Крок 1: Встановіть OpenClaw

Якщо ще не встановлено:

```bash
npm install -g openclaw
```

### Крок 2: Встановіть `not-claude-code-emulator`

Це компонент, який змушує ваш трафік OpenClaw вільно говорити CLI Claude Code. Без нього цьому плагіну нема чого перевіряти — і ніщо не стоїть між вашими викликами API та додатковим пунктом використання.

```bash
# Варіант А: npm global (рекомендовано)
npm install -g not-claude-code-emulator

# Варіант Б: закріпити на точному підтримуваному коміті (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Крок 3: Встановіть `openclaw-cc-camouflage`

```bash
# Варіант А: npm global (опублікований пакет)
npm install -g openclaw-cc-camouflage

# Варіант Б: з джерела
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Крок 4: Налаштуйте шлях емулятора

Скажіть плагіну, де знайти `not-claude-code-emulator`:

```bash
# Якщо ви використовували встановлення npm global:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Якщо ви клонували вручну:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Додайте до свого профілю shell для збереження:

```bash
# ~/.zshrc або ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Опціонально — налаштуйте додаткові резервні шляхи пошуку (розділені двокрапкою на macOS/Linux, крапкою з комою на Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Крок 5: Зареєструйте плагін у OpenClaw

Додайте до свого `openclaw.json` або `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Якщо ви встановили з джерела, використовуйте локальний шлях:

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

### Крок 6: Перевірте встановлення

```bash
bun run status
```

Здорова установка повідомляє:

```
emulator=present
patch=none
support=supported
```

Код виходу 0 означає, що все в порядку. Код виходу 1 означає, що щось потребує уваги.

Для більш детальної картини:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Статус обслуговування здоровий.
# next: Передумова емулятора читабельна і поточна платформа підтримується.
# next: Всі інструменти доступні.
```

Якщо ви бачите `emulator=missing`, перевірте, що `OC_CAMOUFLAGE_EMULATOR_ROOT` вказує на каталог, який містить `package.json` `not-claude-code-emulator`.

## Доступні інструменти

Цей плагін надає чотири явні інструменти. Це не автоматичні хуки.

### `status`

Повідомляє про поточний стан встановлення емулятора.

```bash
bun run status
```

Формат виводу читається машиною:

```
emulator=present
patch=none
support=supported
```

Код виходу 0 означає здоровий. Код виходу 1 означає, що щось потребує уваги.

### `doctor`

Надає діагностичні вказівки на основі поточного стану.

```bash
bun run doctor
```

Перевіряє файли та повідомляє про виконувані наступні кроки. Не встановлює, не патчить і не модифікує нічого. Тільки читає та повідомляє.

### `patch_apply`

Застосовує патчі до цілі (наразі заглушка для майбутнього розширення).

```bash
bun run patch:apply
```

У поточній версії це перевіряє середовище, але не змінює стан peer. Майбутні версії можуть реалізувати фактичне патчинг з маркерами відкату.

### `patch_revert`

Відкочує раніше застосовані патчі (наразі заглушка для майбутнього розширення).

```bash
bun run patch:revert
```

У поточній версії це перевіряє середовище, але не змінює стан peer.

## Чому автоматичні хуки лише для перевірки

Автоматичні хуки в цьому плагіні обмежені лише перевіркою та метаданими. Вони не застосовують патчі автоматично, тому що:

1. Мутування peer без явного наміру користувача порушує принцип найменшого здивування
2. Помилки патчингу потребують людського перегляду, а не тихих повторних спроб
3. Відкат потребує явної згоди на відновлення стану

Хуки попереджають, коли виявлено відхилення. Ви вирішуєте, застосувати, відкотити або залишити середовище незмінним.

Плагін перевіряє готовність. Що ви робите з правильно обслуговуваною установкою, між вами та вашим планом підписки.

## Підтримка платформ

| Платформа | Статус | Примітки |
|-----------|--------|----------|
| macOS | Підтримується | Основне середовище робочого столу |
| Linux | Підтримується | Ті ж закріплені upstream fixtures |
| Windows | Підтримується | Підтримує виявлення плагінів на основі літери диска та зворотної косої риски |

## Канарейка сумісності

Щоб перевірити відхилення upstream відносно закріплених цілей:

```bash
bun run compat:canary
```

Перевірка лише для читання. Перевіряє цілісність fixtures та посилання upstream без зміни чогось. Виходить з 0 на закріплених підтримуваних цілях.

## Документація

- `docs/install.md` - Передумови та кроки встановлення
- `docs/compatibility.md` - Межі сумісності
- `docs/support-matrix.md` - Заблоковані версії fixtures
- `docs/non-goals.md` - Явні елементи поза межами
- `docs/rollback.md` - Процедури відновлення емулятора

## Розробка

```bash
# Встановіть залежності
bun install

# Перевірка типів
bun run typecheck

# Запустіть тести
bun run test:unit
bun run test:integration

# Перевірте патчі проти fixtures
bun run verify:patches

# Перевірте безпеку публікації
bun run check:publish-safety
```

## Ліцензія

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
