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

`not-claude-code-emulator` が存在し正常に動作していることを確認する OpenClaw 用のメンテナンスコンパニオンプラグイン。

*最高の操作は、カバーが整っていることを確認することから始まる。*

## 機能

`not-claude-code-emulator` は、OpenClaw の API コールを Anthropic のインフラストラクチャが Claude Code CLI セッションからのものとして認識できるものに変換するランタイムです。これは標準の Pro または Max サブスクリプションで常にカバーされており、追加の使用料は不要です。`openclaw-cc-camouflage` は必要になる前に翻訳機が存在し動作していることを確認する飛行前チェックです。

名前は偶然ではありません。トラフィックはあるものとして入り、別のものとして到着します。このプラグインは「衣装」が準備できていることを確認します。

具体的には:

- 3つの発見パス（環境変数 → npm global → フォールバックパス）で `not-claude-code-emulator` を**検出**
- 機械可読なステータスを**レポート**: `emulator=present|missing|unreachable`, `patch=none`, `support=supported|unsupported`
- 問題があるときに実行可能な次のステップで問題を**診断**
- 将来の操作のために `patch_apply` / `patch_revert` を明示的なスタブとして**予約**

何も自動的に変更されません。フックは検証のみです。`status` を実行してレポートを取得し、次に何をするか決定します。

## インストール

順序通りにインストールしてください。各ステップは前のステップに依存します。

### ステップ1: OpenClaw をインストール

まだインストールされていない場合:

```bash
npm install -g openclaw
```

### ステップ2: `not-claude-code-emulator` をインストール

これは OpenClaw トラフィックを流暢な Claude Code CLI で話すようにするコンポーネントです。これがないと、このプラグインが検証できるものは何もありません。また、API コールと追加使用項目の間にも何もありません。

```bash
# オプションA: npm global（推奨）
npm install -g not-claude-code-emulator

# オプションB: 正確なサポート対象コミット（5541e5c）に固定
cd ~/github
git clone https://github.com/code-yeongyu/not-claude-code-emulator.git
cd not-claude-code-emulator
git checkout 5541e5c1cb0895cfd4390391dc642c74fc5d0a1a
```

### ステップ3: `openclaw-cc-camouflage` をインストール

```bash
# オプションA: npm global（公開パッケージ）
npm install -g openclaw-cc-camouflage

# オプションB: ソースから
cd ~/github
git clone https://github.com/codeg-dev/openclaw-cc-camouflage.git
cd openclaw-cc-camouflage
bun install
```

### ステップ4: エミュレータパスを設定

プラグインに `not-claude-code-emulator` の場所を伝えます:

```bash
# npm global インストールを使用した場合:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"

# 手動でクローンした場合:
export OC_CAMOUFLAGE_EMULATOR_ROOT="$HOME/github/not-claude-code-emulator"
```

永続化のためにシェルプロファイルに追加:

```bash
# ~/.zshrc または ~/.bashrc
echo 'export OC_CAMOUFLAGE_EMULATOR_ROOT="$(npm root -g)/not-claude-code-emulator"' >> ~/.zshrc
```

オプション — 追加のフォールバック検索パスを設定（macOS/Linux ではコロン区切り、Windows ではセミコロン区切り）:

```bash
export OC_CAMOUFLAGE_EMULATOR_FALLBACK_PATHS="/opt/emulator:$HOME/.local/share/emulator"
```

### ステップ5: OpenClaw にプラグインを登録

`openclaw.json` または `openclaw.jsonc` に追加:

```json
{
  "plugins": ["openclaw-cc-camouflage"]
}
```

ソースからインストールした場合はローカルパスを使用:

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

### ステップ6: インストールを確認

```bash
bun run status
```

正常なインストールは以下をレポートします:

```
emulator=present
patch=none
support=supported
```

終了コード 0 はすべて順調であることを意味します。終了コード 1 は何か注意が必要であることを意味します。

より詳細な情報:

```bash
bun run doctor
# emulator=present
# patch=none
# support=supported
# doctor=healthy
#
# メンテナンスステータスは正常です。
# next: エミュレータの前提条件が読み取り可能で、現在のプラットフォームがサポートされています。
# next: すべてのツールが利用可能です。
```

`emulator=missing` が表示された場合は、`OC_CAMOUFLAGE_EMULATOR_ROOT` が `not-claude-code-emulator` の `package.json` を含むディレクトリを指していることを確認してください。

## 利用可能なツール

このプラグインは4つの明示的なツールを公開します。自動フックではありません。

### `status`

エミュレータインストールの現在の状態をレポートします。

```bash
bun run status
```

出力形式は機械可読です:

```
emulator=present
patch=none
support=supported
```

終了コード 0 は正常を意味します。終了コード 1 は何か注意が必要であることを意味します。

### `doctor`

現在の状態に基づいて診断ガイダンスを提供します。

```bash
bun run doctor
```

ファイルを検査し、実行可能な次のステップをレポートします。インストールもパッチも変更も行いません。読み取りとレポートのみです。

### `patch_apply`

ターゲットにパッチを適用します（現在は将来の拡張のためのスタブ）。

```bash
bun run patch:apply
```

現在のバージョンでは、これは環境を検証しますが、ピア状態は変更しません。将来のバージョンでは、ロールバックマーカー付きの実際のパッチングを実装する可能性があります。

### `patch_revert`

以前に適用されたパッチを元に戻します（現在は将来の拡張のためのスタブ）。

```bash
bun run patch:revert
```

現在のバージョンでは、これは環境を検証しますが、ピア状態は変更しません。

## 自動フックが検証のみである理由

このプラグインの自動フックは検証とメタデータのみに制限されています。自動的にパッチを適用しないのは以下の理由によります:

1. 明示的なユーザーの意図なしにピアを変更することは、最小驚きの原則に違反します
2. パッチングの失敗には人間のレビューが必要で、静かな再試行ではありません
3. ロールバックには状態を復元するための明示的な同意が必要です

フックはドリフトが検出されたときに警告します。適用、元に戻す、環境を変更しないかを決定します。

プラグインは準備状況を検証します。適切にメンテナンスされたセットアップで何をするかは、あなたとサブスクリプションプランの間の問題です。

## プラットフォームサポート

| プラットフォーム | ステータス | 備考 |
|-----------------|----------|------|
| macOS | サポート済み | 主要なデスクトップ環境 |
| Linux | サポート済み | 同じ固定されたアップストリームフィクスチャ |
| Windows | サポート済み | ドライブ文字とバックスラッシュベースのプラグイン検出をサポート |

## 互換性カナリア

固定されたターゲットに対するアップストリームドリフトをチェックするには:

```bash
bun run compat:canary
```

読み取り専用チェック。何も変更せずにフィクスチャの整合性とアップストリーム参照を検証します。固定されたサポート対象ターゲットで 0 で終了します。

## ドキュメント

- `docs/install.md` - 前提条件とインストール手順
- `docs/compatibility.md` - 互換性の境界
- `docs/support-matrix.md` - ロックされたフィクスチャバージョン
- `docs/non-goals.md` - 明示的なスコープ外項目
- `docs/rollback.md` - エミュレータ回復手順

## 開発

```bash
# 依存関係をインストール
bun install

# 型チェック
bun run typecheck

# テストを実行
bun run test:unit
bun run test:integration

# フィクスチャに対するパッチを検証
bun run verify:patches

# 公開安全性をチェック
bun run check:publish-safety
```

## ライセンス

MIT

<!-- i18n:source-hash:a56b7af1f4a33a4d0553898a6602fee41a701faaa9cfdc5f4e759407ff545b7d -->
