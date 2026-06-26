# mitre/ 構成と保守ガイド（ATT&CK Enterprise v19 ビューア）

本番（GitHub Pages・HTTP配信）向けに、**データ／コード／スタイルを分離**した構成。
旧版は HTML にデータ(8MB)を埋め込み、`viewer.html` で3重（25MB）に重複していた。現構成は共有データを `fetch()` で1回だけ取得し、ブラウザにキャッシュさせる。

## ファイル構成

```
mitre/
├─ index.html              ポータル
├─ viewer.html             統合ビューア。3ページを iframe src= で表示（約3KB）
├─ map.html                A 全体マップ(2D)
├─ topology-3d.html        B 攻撃ストーリー（2.5D俯瞰）= 主表示
├─ topology-3d-free.html   B-副次 3D自由視点（Three.js r128・WebGL）
├─ scenes.html             C 全テクニック アーキ攻撃モデル図（全586）
├─ css/
│  ├─ index.css            ポータル用
│  ├─ map.css / scenes.css / viewer.css
│  ├─ story.css            攻撃ストーリー(2.5D)用
│  └─ topology.css         3D自由視点(副次)用
├─ js/
│  ├─ attack_app.js              2Dロジック
│  ├─ attack_story_app.js        攻撃ストーリー2.5D（レイヤー/攻撃パス/防御ゲート/フェーズ/最短路）
│  ├─ attack3d_app.js            3D自由視点(副次)ロジック
│  └─ attack_scene_full_app.js   586図ロジック
└─ data/
   └─ attack_v19_data.json  正規化データ（唯一の真実・全ページ共有）
```

## 攻撃ストーリービュー（topology-3d.html）

「外部圏→境界→エンドポイント→内部NW→認証基盤(AD/DC/IdP)→クラウンジュエル」の6レイヤーを2.5D俯瞰で固定表示。
15戦術ピンを各レイヤー上に配置し、赤い攻撃パス（侵害済み/現在地/未到達で色・透明度を変化）で接続。
レイヤー間には防御ゲート（緩和被覆%で緑/黄/赤）。右ペインは選択戦術の「何が起きているか／攻撃者の狙い／見えるログ・テレメトリ／有効な防御」。
下部タイムラインは6フェーズ（準備/侵入/端末支配/ID侵害/内部探索・横展開/目的達成）でグルーピング。
「クラウンジュエルへの最短路」で主攻撃パスと最弱の防御ゲートを提示。3D自由視点・階層ツリー・技術詳細は副次（上部ボタン／右ペイン折りたたみ）。

## 3ビューの独立＋相互連関（xlink）

`map.html`／`scenes.html`／`topology-3d.html` は**それぞれ単体で動作する独立ページ**。共有の `js/xlink.js`＋`css/xlink.css` が相互連関を担う。

- **ビュー切替バー**：各ページ上部の `.xswitch`（全体マップ／攻撃モデル図／攻撃ストーリー＋ポータル）。`js/xlink.js` が描画。
- **文脈付きディープリンク**：
  - マップの技術カード → 「🖼 攻撃モデル図」「🛰 ストーリー」
  - モデル図カード → 「🗺 マップで詳細」「🛰 ストーリー」
  - ストーリー右ペイン → 「🗺 マップ」「🖼 モデル図」、技術行クリックで該当モデル図へ
- **動作の二系統**：単体表示時は `location`（`#<ID>` でジャンプ）、統合ビューア内では `postMessage`（`goView{view,id}` / `gotoId`）で**タブ切替＋対象へジャンプ**。各ページは `window.__gotoId(id)` を実装し、`XLINK.ready()` で初期ハッシュ/保留ジャンプを適用。
- 後方互換：3D自由視点(`topology-3d-free.html`)→モデル図の `goModel` も従来どおり動作。

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
