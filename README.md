# 学習サイト ポータル（AAISM・CCA-F・CISSP）— GitHub Pages 統合版

GitHub Pages は 1 リポジトリ＝1 サイトのため、**AAISM**・**CCA-F**・**CISSP** の3つの学習サイトを
1つのサイトに統合し、トップのランディングで入口を分けた構成です。
さらに、**デザイン（CSS/JS）を体系的に分離・統合**しています。

## 階層構成

```
.
├── index.html              # トップ：AAISM / CCA-F / CISSP の入口を選ぶポータル
├── .nojekyll / README.md
│
├── assets/                 # ★ 全ページ共通の土台（デザイン統合の核）
│   ├── base.css            #   共有デザイントークン（Deep Aurora :root）＋リセット ＝単一ソース
│   └── portal.css          #   トップページ専用スタイル
│
├── favicon/                # 共有ファビコン一式（.ico / .svg / PNG各サイズ / webmanifest）
│
├── aaism/                  # AAISM 学習サイト（AIガバナンス・リスク・セキュリティ）
│   ├── index.html / textbook.html / quiz.html
│   ├── css/  site.css · textbook.css · quiz.css   （:root はbase.cssへ集約済み）
│   ├── js/   textbook.js · quiz.js
│   └── data/ AAISM_Question_Bank.csv
│
├── ccaf/                   # CCA-F 学習サイト（Claude Certified Architect – Foundations）
│   ├── index.html / textbook.html / quiz.html
│   ├── css/  index.css · textbook.css · quiz.css  （インラインから分離・:root集約済み）
│   └── js/   textbook.js · quiz.js                （インラインから分離。budouxはCDN）
│
└── cissp/                  # CISSP 学習サイト（(ISC)² CBK 全8ドメイン）
    ├── index.html / textbook.html / quiz.html
    ├── css/  index.css · textbook.css · quiz.css  （インラインから分離・:root集約済み）
    └── js/   textbook.js · quiz.js                （インラインから分離・CDNなし）
```

## デザイン統合の仕組み

- **デザイントークンの単一ソース化**：両サイトが共有する `:root` 変数（色・影・モーション・
  フォント＝Deep Aurora）を `assets/base.css` に一本化。各ページの CSS から重複定義を撤去し、
  全ページが `base.css` を参照します。**`base.css` を編集すると両サイトのデザインが一括で変わります。**
- **CSS/JS の分離**：CCA-F 側はインラインだった `<style>`／`<script>` をすべて
  `ccaf/css/`・`ccaf/js/` の外部ファイルへ分離し、AAISM と同じ構成に統一。
- **レイアウト変数はローカル保持**：`--rail`／`--appbar` などページ依存の変数や、
  メディアクエリ内の上書きは各 CSS 側に残しています。
- 見た目は従来と同一（トークン値・CSS 規則の順序を保持）。

## ナビゲーション

- トップ `index.html` → AAISM / CCA-F へ
- 各サイトのランディング上部「← 学習サイト ポータル」でトップへ戻る
- 各サイト内：Textbook ⇄ Quiz ⇄ Home を相互リンク

すべて相対パスのため、リポジトリ名やサブパスが変わってもそのまま動作します。

## GitHub Pages での公開手順

1. 新規リポジトリを作成。
2. この `site_unified` フォルダの **中身すべて**（`index.html`・`assets/`・`favicon/`・
   `aaism/`・`ccaf/`・`cissp/`・`.nojekyll`）をリポジトリ直下にコピーして push。
3. **Settings → Pages** で Source を `Deploy from a branch`、Branch を `main / (root)` に設定。
4. 数十秒後 `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開（入口は `index.html`）。

> `/docs` 配下で公開する場合は中身を `docs/` に入れ、Branch を `main / docs` に設定。

## 出典・ライセンス

教育・学習用の教材です。AAISM は公開動画および NIST AI RMF 等、CCA-F は Anthropic 公式試験ガイドと
公開技術ドキュメント、CISSP は (ISC)² CBK（全8ドメイン）と公開情報に基づきます。
規格名・法令名・固有名詞は各発行体に帰属します。最新の仕様・受験要項は各公式情報で最終確認してください。
