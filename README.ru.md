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
  <strong>Русский</strong> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a>
</p>

# openclaw-cc-camouflage

Вспомогательный плагин обслуживания для OpenClaw, который проверяет наличие и работоспособность `not-claude-code-emulator`.

*Потому что лучшая операция начинается с подтверждения, что ваше прикрытие на месте.*

## Что это делает

`not-claude-code-emulator` — это среда выполнения, которая переводит вызовы API OpenClaw во что-то, что инфраструктура Anthropic распознает как исходящее из сеанса Claude Code CLI — того типа, который всегда покрывался стандартной подпиской Pro или Max без дополнительных сборов за использование. `openclaw-cc-camouflage` — это предполетная проверка, подтверждающая, что переводчик присутствует и работает до того, как он вам понадобится.

Название не случайно. Ваш трафик входит, выглядя как одно, прибывает, выглядя как другое. Этот плагин проверяет, что "гардероб" готов.

Конкретно:

- **Обнаруживает** `not-claude-code-emulator` через три пути обнаружения (переменная среды → npm global → резервные пути)
- **Сообщает** о состоянии в машиночитаемом формате: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- **Диагностирует** проблемы с выполнимыми следующими шагами, когда что-то не так
- **Резервирует** `patch_apply` / `patch_revert` как явные заглушки для будущих операций

Ничто не изменяется автоматически. Хуки только для проверки. Вы запускаете `status`, получаете отчет и решаете, что делать дальше.

## Установка

Устанавливайте по порядку. Каждый шаг зависит от предыдущего.

### Шаг 1: Установите OpenClaw

Если еще не установлен:

```bash
npm install -g openclaw
```

### Шаг 2: Установите `not-claude-code-emulator`

Это компонент, который заставляет ваш трафик OpenClaw бегло говорить на CLI Claude Code. Без него этому плагину нечего проверять — и ничего не стоит между вашими вызовами API и дополнительной строкой использования.

```bash
# Вариант А: npm global (рекомендуется)
npm install -g not-claude-code-emulator

# Вариант Б: закрепить на точном поддерживаемом коммите (5541e5c)
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### Шаг 3: Установите `openclaw-cc-camouflage`

```bash
# Вариант А: npm global (опубликованный пакет)
npm install -g openclaw-cc-camouflage

# Вариант Б: из исходников
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### Шаг 4: Настройте путь к эмулятору

Скажите плагину, где найти `not-claude-code-emulator`:

```bash
# Если вы использовали установку npm global:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# Если вы клонировали вручную:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

Добавьте в свой профиль оболочки для сохранения:

```bash
# ~/.zshrc или ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

Опционально — настройте дополнительные резервные пути поиска (разделенные двоеточием на macOS/Linux, точкой с запятой на Windows):

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### Шаг 5: Зарегистрируйте плагин в OpenClaw

Добавьте в свой `openclaw.json` или `openclaw.jsonc`:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

Если вы установили из исходников, используйте локальный путь:

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

### Шаг 6: Проверьте установку

```bash
bun run status
```

Здоровая установка сообщает:

```
emulator=present
patch=none
support=supported
```

Код выхода 0 означает, что все в порядке. Код выхода 1 означает, что что-то требует внимания.

Для более подробной картины:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# Состояние обслуживания здорово.
# next: Предварительное условие эмулятора читаемо и текущая платформа поддерживается.
# next: Все инструменты доступны.
```

Если вы видите `emulator=missing`, проверьте, что `OC_CAMOUFLAGE_EMULATOR_ROOT` указывает на каталог, содержащий `package.json` `not-claude-code-emulator`.

## Доступные инструменты

Этот плагин предоставляет четыре явных инструмента. Это не автоматические хуки.

### `status`

Сообщает о текущем состоянии установки эмулятора.

```bash
bun run status
```

Формат вывода машиночитаемый:

```
emulator=present
patch=none
support=supported
```

Код выхода 0 означает здоровое состояние. Код выхода 1 означает, что что-то требует внимания.

### `doctor`

Предоставляет диагностические рекомендации на основе текущего состояния.

```bash
bun run doctor
```

Проверяет файлы и сообщает о выполнимых следующих шагах. Не устанавливает, не патчит и не модифицирует ничего. Только читает и сообщает.

### `patch_apply`

Применяет патчи к цели (в настоящее время заглушка для будущего расширения).

```bash
bun run patch:apply
```

В текущей версии это проверяет среду, но не модифицирует состояние пира. Будущие версии могут реализовать фактическое патчирование с маркерами отката.

### `patch_revert`

Откатывает ранее примененные патчи (в настоящее время заглушка для будущего расширения).

```bash
bun run patch:revert
```

В текущей версии это проверяет среду, но не модифицирует состояние пира.

## Почему автоматические хуки только для проверки

Автоматические хуки в этом плагине ограничены только проверкой и метаданными. Они не применяют патчи автоматически, потому что:

1. Модификация пира без явного намерения пользователя нарушает принцип наименьшего удивления
2. Сбои патчирования требуют человеческого рассмотрения, а не тихих повторных попыток
3. Откат требует явного согласия для восстановления состояния

Хуки предупреждают, когда обнаруживается дрейф. Вы решаете, применять, откатывать или оставлять среду неизменным.

Плагин проверяет готовность. То, что вы делаете с правильно поддерживаемой настройкой, между вами и вашим планом подписки.

## Поддержка платформ

| Платформа | Статус | Примечания |
|-----------|--------|------------|
| macOS | Поддерживается | Основная среда рабочего стола |
| Linux | Поддерживается | Те же закрепленные upstream fixtures |
| Windows | Поддерживается | Поддерживает обнаружение плагинов на основе буквы диска и обратной косой черты |

## Канарейка совместимости

Чтобы проверить дрейф upstream относительно закрепленных целей:

```bash
bun run compat:canary
```

Проверка только для чтения. Проверяет целостность fixtures и ссылки upstream без модификации чего-либо. Выходит с 0 на закрепленных поддерживаемых целях.

## Документация

- `docs/install.md` - Предварительные условия и шаги установки
- `docs/compatibility.md` - Границы совместимости
- `docs/support-matrix.md` - Заблокированные версии fixtures
- `docs/non-goals.md` - Явные элементы вне области
- `docs/rollback.md` - Процедуры восстановления эмулятора

## Разработка

```bash
# Установите зависимости
bun install

# Проверка типов
bun run typecheck

# Запустите тесты
bun run test:unit
bun run test:integration

# Проверьте патчи против fixtures
bun run verify:patches

# Проверьте безопасность публикации
bun run check:publish-safety
```

## Лицензия

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
