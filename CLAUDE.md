# CLAUDE.md — slab プロジェクト

## プロジェクト概要

GitHub Pages で公開するサイバーセキュリティ学習プラットフォーム。
フレームワーク不使用のバニラ HTML/CSS/JavaScript のみで構成される。

**公開 URL**: `https://showhey23.github.io/slab/`（予定）

コンテンツは4系統：
- **aaism** — AI Security Management 資格学習（テキスト + 199問クイズ）
- **ccaf** — CCA-F 資格学習（テキスト + 120問クイズ）
- **cissp** — CISSP 資格学習（テキスト + 400問クイズ）
- **mitre** — MITRE ATT&CK 可視化学習（2D/2.5D/3D/586テクニック図解）

---

## ディレクトリ構成

```
slab/
├── index.html                 # ポータルトップ（GitHub Pages の入口）
├── assets/
│   ├── base.css               # ★全ページ共通デザイントークン（単一ソース）
│   ├── portal.css             # ポータルトップ専用スタイル
│   └── responsive.css         # 全ページ共通モバイル対応
├── favicon/                   # ブランドアイコン一式
├── aaism/
│   ├── index.html / textbook.html / quiz.html
│   ├── css/ js/
│   └── data/AAISM_Question_Bank.csv
├── ccaf/
│   ├── index.html / textbook.html / quiz.html
│   └── css/ js/
├── cissp/
│   ├── index.html / textbook.html / quiz.html
│   └── css/ js/
└── mitre/
    ├── index.html             # MITREセクション入口
    ├── viewer.html            # 統合ビューア（iframe 3画面制御）
    ├── map.html               # 2D 攻撃マトリクス
    ├── scenes.html            # 全586テクニック図解
    ├── topology-3d.html       # 2.5D キルチェーン
    ├── topology-3d-free.html  # WebGL 3D フリービュー（Three.js r128）
    ├── ARCHITECTURE.md        # MITRE サブシステム設計詳細
    ├── css/                   # ビュー別スタイル（7ファイル）
    ├── js/                    # ビュー別ロジック（5ファイル）
    └── data/attack_v19_data.json  # ATT&CK v19 完全データ（8.1MB）
```

---

## 作業時のルール

### 影響範囲を理解してから変更する

| ファイル | 影響範囲 | 注意度 |
|---|---|---|
| `assets/base.css` | 全ページのデザインが一括変更される | ★★★ 最高 |
| `assets/responsive.css` | 全ページのモバイル表示が変わる | ★★★ 最高 |
| `mitre/data/*.json` | 全MITREビューのデータソース | ★★★ 最高 |
| `mitre/js/xlink.js` | 全ビュー間のナビゲーション | ★★ 高 |
| 各コースの `textbook.css` / `quiz.css` | そのコースのみ | ★ 低 |
| 各コースのテキスト内容 | そのページのみ | ★ 低 |

### 変更前に必ず計画を提示する

作業を開始する前に、必ず以下を日本語で示す：

1. **変更対象ファイル**（パスとファイル名を列挙）
2. **変更内容の概要**（何を・なぜ変えるか）
3. **影響範囲**（他のページや機能への波及）
4. **確認手順**（変更後に何をブラウザで確認するか）

ユーザーが承認してから実装に進む。

### 大規模変更は小単位に分割する

複数ファイルにまたがる変更・新機能追加・リファクタは、以下の単位で分割して1ステップずつ実施する：

- 1コミット = 1ファイルまたは1機能の変更
- 各ステップでブラウザ確認を挟む
- 問題が出たら次ステップに進む前に修正する

### 既存のデザインと動作を壊さない

- `base.css` の CSS 変数名・値を変更する場合は、全ページへの影響を必ず確認する
- 既存の HTML 構造（class 名・id 名）を変えると CSS/JS が壊れる可能性があるため慎重に扱う
- `mitre/js/xlink.js` の postMessage フォーマットを変えるときは、送受信両側のコードを同時に更新する
- リンクパスはすべて相対パスで統一する（絶対パスにしない）

### コードスタイル

- コメントは「なぜそうするか（WHY）」が自明でない場合のみ書く
- 変数名・関数名は既存の命名規則（camelCase）に合わせる
- インデントはファイルごとの既存スタイルに従う（混在させない）
- 新しい外部ライブラリ（CDN）を追加する場合はユーザーに事前確認する

---

## Git 操作ルール

### コミット前の確認

```powershell
git status    # 変更ファイルの確認
git diff      # 変更内容の確認
```

### コミットメッセージの形式

```
<type>: <日本語で1行の説明>

例:
fix: cissp クイズの正誤判定ロジックを修正
feat: mitre scenes に検索ハイライト機能を追加
style: aaism textbook のモバイルレイアウトを調整
refactor: 共通クイズCSS を assets/ に抽出
```

### 絶対に禁止する操作

- `git push --force` / `git push -f`（main ブランチへの force push）
- `git reset --hard`（確認なしの実行）
- `git commit --no-verify`（フック無効化）
- ステージング対象の確認なしに `git add .` や `git add -A` を実行すること

### Secrets・機密情報の取り扱い

**いかなる場合も以下をコミットしてはならない：**

- API キー・トークン（例: `sk-`, `ghp_`, `Bearer ...`）
- パスワード・認証情報
- `.env` ファイルやその内容
- 個人情報（メールアドレス、氏名を除く公開情報）

疑わしいファイルが `git status` に表示された場合は、コミット前にユーザーに確認する。

---

## テスト・確認手順

### ローカル HTTP サーバーの起動（必須）

`fetch()` を使う MITRE ビューはファイル直接開き（`file://`）では動かない。
必ず以下のいずれかで HTTP サーバーを起動してから確認する：

```powershell
# Python（追加インストール不要）
python -m http.server 8080

# Node.js
npx serve .
```

ブラウザで `http://localhost:8080` を開く。

### 変更後の確認チェックリスト

**CSS を変更した場合：**
- [ ] 変更したページをブラウザで表示し、崩れがないか確認
- [ ] `base.css` を変更した場合は全コース（aaism/ccaf/cissp/mitre）のトップページも確認
- [ ] ブラウザ幅を 375px 程度に縮めてモバイル表示を確認

**JavaScript を変更した場合：**
- [ ] ブラウザの開発者ツール（F12）でコンソールエラーがないか確認
- [ ] 変更した機能を実際に操作して動作確認
- [ ] 関連する他ページへの影響がないか確認

**HTML を変更した場合：**
- [ ] ページ内の全リンクが正しく機能するか確認
- [ ] class 名・id 名の変更をした場合は対応する CSS/JS も更新済みか確認

**MITRE ビューを変更した場合：**
- [ ] `viewer.html` でタブ切替が正常に動作するか確認
- [ ] `map.html` / `scenes.html` / `topology-3d.html` を単独で開いても動作するか確認
- [ ] ブラウザコンソールに fetch エラーや postMessage エラーがないか確認

**新しいコースやページを追加した場合：**
- [ ] `index.html` のポータルカードにリンクを追加したか確認
- [ ] 相対パスが正しいか確認（`../index.html` で親に戻れるか）
- [ ] `favicon/head-snippet.html` の記述をページ `<head>` に含めたか確認

---

## 既知の制約・注意事項

- **MITRE データ**: `mitre/data/attack_v19_data.json` は 8.1MB のため、GitHub の 100MB 制限に余裕はあるが直接編集は避ける
- **Three.js**: `topology-3d-free.html` は CDN から r128 をロード。CDN 障害時はこのページのみ影響を受ける
- **`file://` 非対応**: `fetch()` を使う全 MITRE ページはローカルサーバー必須
- **ブラウザキャッシュ**: データ更新後に表示が変わらない場合は `Ctrl+Shift+R` で強制リロード
