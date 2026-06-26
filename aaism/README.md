# AAISM 学習サイト (Textbook & Quiz)

AAISM（AIセキュリティマネジメント）の学習教材を GitHub Pages 用の静的サイトとして構成したものです。

## 構成
```
.
├── index.html            # ランディングページ
├── textbook.html         # 統合学習ノート（4ドメイン・インタラクティブ）
├── quiz.html             # 演習クイズ（199問）
├── css/
│   ├── site.css          # ランディング用
│   ├── textbook.css      # ノート用
│   └── quiz.css          # クイズ用
├── js/
│   ├── textbook.js       # ノートの挙動（タブ切替・スクロール進捗・折り返し）
│   └── quiz.js           # クイズエンジン＋問題データ
├── data/
│   └── AAISM_Question_Bank.csv
└── .nojekyll
```

## GitHub Pages での公開手順
1. このフォルダの中身をリポジトリのルート（または `docs/`）に配置して push。
2. リポジトリの **Settings → Pages** で、Source を `Deploy from a branch` にし、Branch を `main` / フォルダを `/ (root)`（または `/docs`）に設定。
3. 数十秒後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。

`.nojekyll` を含めているため、Jekyll の処理はスキップされます。フォント（Google Fonts）と日本語改行（BudouX）は CDN から読み込みます。

## ライセンス/出典
公開動画および NIST AI RMF 等の公開情報に基づく教育・学習用。規格名・法令名は各発行体に帰属します。
