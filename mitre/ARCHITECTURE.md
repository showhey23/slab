# mitre/ 構成と保守ガイド（ATT&CK Enterprise v19 ビューア）

本番（GitHub Pages・HTTP配信）向けに、**データ／コード／スタイルを分離**した構成。
旧版は HTML にデータ(8MB)を埋め込み、`viewer.html` で3重（25MB）に重複していた。現構成は共有データを `fetch()` で1回だけ取得し、ブラウザにキャッシュさせる。

## ファイル構成

```
mitre/
├─ index.html              ポータル（既存・未改変）
├─ viewer.html             統合ビューア。3ページを iframe src= で表示（約3KB）
├─ map.html                A 全体マップ(2D)
├─ topology-3d.html        B 3D攻撃トポロジー（Three.js r128 をCDN読込）
├─ scenes.html             C 全テクニック アーキ攻撃モデル図（全586）
├─ css/
│  ├─ index.css            ポータル用（既存・未改変）
│  ├─ map.css / topology.css / scenes.css / viewer.css
├─ js/
│  ├─ attack_app.js              2Dロジック
│  ├─ attack3d_app.js            3Dロジック
│  └─ attack_scene_full_app.js   586図ロジック
└─ data/
   └─ attack_v19_data.json  正規化データ（唯一の真実・全ページ共有）
```

## 読み込みフロー

各ページは `<script>` ブートストラップで `data/attack_v19_data.json` を `fetch`（`cache:"force-cache"`）し、`window.__ATTACK_DATA__` に格納してから対応する `js/*.js` を動的読込。失敗時は `#dataerr` オーバーレイで案内。
`viewer.html` は3ページを iframe `src=` で遅延ロードし、同一オリジンの `postMessage`（`goModel`／`scrollTo`）で「3D→攻撃モデル図」へ横断ジャンプ。

## 改修の入口（どこを直すか）

- データ更新（テクニック追加・記述変更）→ `data/attack_v19_data.json` を差し替えるだけ。全ページに反映。
- 図のレイアウト／注記ロジック → `js/attack_scene_full_app.js`（戦術別レイアウト・note生成）。
- 2Dの構成・文言 → `js/attack_app.js`。3Dゾーン・ナレーション → `js/attack3d_app.js`。
- 配色・タイポ（Deep Aurora）→ 各 `css/*.css` の `:root` ／ 該当セレクタ。

## 注意

- `file://` 直開きでは `fetch` がCORSで失敗する。**HTTP配信（GitHub Pages 等）で利用**すること（リポジトリ直下に `.nojekyll` あり）。
- `data/attack_v19_data.json` は約8MB（日本語のためgzipで大幅圧縮される）。GitHub Pages は自動gzipに対応。
- 完全自己完結のオフライン単体版（データ埋め込みHTML）は別途 `MITRE ATT&CK - D3FEND` 作業フォルダに保管。

> 出典：MITRE ATT&CK（attack.mitre.org・v19）／ MITRE D3FEND。ATT&CK® は The MITRE Corporation の商標。
