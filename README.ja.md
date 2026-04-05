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
  <strong>日本語</strong> |
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

not-claude-code-emulator のステータスを確認する OpenClaw 用のコンパニオン メンテナンス プラグイン。このパッケージはアップストリーム プロジェクトのフォークではありません。自動フックなしで明示的なツールを提供します。

## これは何か

`openclaw-cc-camouflage` は以下を行うメンテナンス プラグインです。

- すべての操作の前にエミュレータの存在と正常性を確認する
- ステータスを報告し、診断ガイダンスを提供する
- 将来のパッチ操作のためのスタブ実装を提供する

インストール時に自動的にパッチを適用しません。すべての変更には明示的なツール呼び出しが必要です。

## 前提条件とインストール順序

インストール順序は重要です。このプラグインが機能する前に、以下が整っている必要があります。

1. **`not-claude-code-emulator`** (コミット `5541e5c`)
   - Anthropic 互換インターフェースを提供するメッセージ ランタイム
   - npm でインストール: `npm install -g not-claude-code-emulator`
   - または `~/github/not-claude-code-emulator` にクローン

2. **`openclaw-cc-camouflage`** (このパッケージ)
   - エミュレータが存在した後に最後にインストール

環境変数を設定:

```bash
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

またはフォールバック パスを使用:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

## 利用可能なツール

このプラグインは 4 つの明示的なツールを公開します。自動フックではありません。

### `status`

エミュレータ インストールの現在の状態を報告します。

```bash
bun run status
```

出力形式は機械可読です:

```
emulator=present
emulator_version=5541e5c
emulator_path=/Users/you/github/not-claude-code-emulator
install_mode=local-folder
support=supported
```

終了コード 0 は正常を意味します。終了コード 1 は何かに注意が必要であることを意味します。

### `doctor`

現在の状態に基づいて診断ガイダンスを提供します。

```bash
bun run doctor
```

これはファイルを調査し、実行可能な次のステップを報告します。インストール、パッチ、または変更は行いません。読み取りと報告のみです。

### `patch_apply`

ターゲットにパッチを適用します (現在は将来の拡張用のスタブ)。

```bash
bun run patch:apply
```

現在のバージョンでは、これは環境を検証しますが、ピアの状態は変更しません。将来のバージョンでは、ロールバック マーカーを使用して実際のパッチングを実装する可能性があります。

### `patch_revert`

以前に適用されたパッチを元に戻します (現在は将来の拡張用のスタブ)。

```bash
bun run patch:revert
```

現在のバージョンでは、これは環境を検証しますが、ピアの状態は変更しません。将来のバージョンでは、ロールバック マーカーを使用して実際の復元を実装する可能性があります。

## 自動フックが検証のみである理由

このプラグインの自動フックは検証とメタデータのみに制限されています。自動的にパッチを適用しない理由:

1. 明示的なユーザーの意図なしにピアを変更することは、最小驚きの原則に違反します
2. パッチの失敗には、静かな再試行ではなく人間によるレビューが必要です
3. ロールバックには、状態を復元するための明示的な同意が必要です

フックはドリフトが検出されたときに警告します。適用、元に戻す、または環境を変更せずに残すかを決定します。

## プラットフォームサポート

| プラットフォーム | ステータス | 備考 |
|----------|--------|-------|
| macOS    | サポート | プライマリ デスクトップ環境 |
| Linux    | サポート | 同じ固定アップストリーム フィクスチャ |
| Windows  | サポート | ドライブ文字とバックスラッシュベースのプラグイン検出をサポート |

## 互換性カナリア

固定ターゲットに対するアップストリーム ドリフトを確認するには:

```bash
bun run compat:canary
```

これは読み取り専用チェックであり、何も変更せずにフィクスチャの整合性とアップストリーム参照を検証します。固定サポート対象ターゲットで 0 で終了します。

## ドキュメント

- `docs/install.md` - 前提条件とインストール手順
- `docs/compatibility.md` - 互換性の境界
- `docs/support-matrix.md` - ロックされたフィクスチャ バージョン
- `docs/non-goals.md` - 明示的なスコープ外アイテム

## 開発

```bash
# 依存関係をインストール
bun install

# 型チェック
bun run typecheck

# テストを実行
bun run test:unit
bun run test:integration

# フィクスチャに対してパッチを検証
bun run verify:patches

# 公開安全性をチェック
bun run check:publish-safety
```

## ライセンス

MIT

<!-- i18n:source-hash:5f30ef48aef04d659e3bd2e705b8b9250abb30ea042f84797e5d8997182de1af -->