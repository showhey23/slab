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

## 攻撃モデル図の描画方式（scenes.html）

`attack_scene_full_app.js` はテクニックカードを3段階の優先順位で描画する。

```
1. BESPOKE[id]   … 手動で差し込んだ完全なHTMLブロック（最優先）
2. CURATED[id]   … 精緻な静的SVGシーン（scene2() で生成）
3. autoScene()   … 戦術別汎用レイアウト（フォールバック）
```

### インタラクティブ図解（lateral-movement テンプレート）

横展開系テクニック（T1021・T1021.002・T1550.002・T1570）は `BESPOKE` に
インタラクティブHTMLを注入している。静的なSVGとの最大の違いは以下。

| 機能 | 静的SVG（CURATED） | インタラクティブ（BESPOKE） |
|---|---|---|
| ノード構成 | 2〜4ノード | ホスト/プロセス/認証素材/ネットワーク/検知の多層 |
| アニメーション | ダッシュ流 | ステップ毎に dim/active を切替 |
| レイヤー制御 | なし | 攻撃フロー/プロセス/認証素材/ネットワーク/検知を個別ON/OFF |
| ステップ再生 | なし | 7ステップを2.2秒間隔で自動再生（▶/⏮/⏭/⟲） |
| 詳細パネル | note 1行 | 各ステップの説明文＋検知EVT番号＋緩和策ID |

**実装の場所**：`attack_scene_full_app.js` 末尾の IIFE ブロック（`LATERAL_DATA` → `buildLateralHTML()` → `BESPOKE` 注入 → `MutationObserver`）。

**新テクニックを追加する手順**：
1. `LATERAL_DATA` に `modelType:'lateral-movement'` のエントリを追加（nodes / edges / steps / lay を定義）
2. 末尾の `['T1021', ...]` 配列にIDを追加するだけで自動的に `BESPOKE` へ注入される

### modelType 分類（今後の拡張方針）

| modelType | 対象テクニック例 | 実装状態 |
|---|---|---|
| `lateral-movement` | T1021系・T1550系・T1570 | ✅ 実装済み |
| `credential-material` | T1003・T1558・T1539 | 未実装（CURATED で対応中） |
| `process-memory` | T1055・T1134・T1574 | 未実装 |
| `persistence-autostart` | T1053・T1543・T1547 | 未実装 |
| `defense-evasion` | T1562・T1070・T1036 | 未実装 |
| `discovery-enumeration` | T1018・T1087・T1069 | 未実装 |
| `collection-exfiltration` | T1005・T1041・T1048 | 未実装 |
| `cloud-identity` | T1078・T1136・T1530 | 未実装 |

## 改修の入口（どこを直すか）

- データ更新（テクニック追加・記述変更）→ `data/attack_v19_data.json` を差し替えるだけ。全ページに反映。
- 図のレイアウト／注記ロジック → `js/attack_scene_full_app.js`（戦術別レイアウト・note生成）。
- インタラクティブ図解のステップ・ノード・検知情報 → 同ファイル末尾の `LATERAL_DATA[id]` を編集。
- インタラクティブ図解のスタイル → `css/scenes.css` 末尾の `.lm-*` セレクタ群。
- 2Dの構成・文言 → `js/attack_app.js`。3Dゾーン・ナレーション → `js/attack3d_app.js`。
- 配色・タイポ（Deep Aurora）→ 各 `css/*.css` の `:root` ／ 該当セレクタ。

## 注意

- `file://` 直開きでは `fetch` がCORSで失敗する。**HTTP配信（GitHub Pages 等）で利用**すること（リポジトリ直下に `.nojekyll` あり）。
- `data/attack_v19_data.json` は約8MB（日本語のためgzipで大幅圧縮される）。GitHub Pages は自動gzipに対応。
- 完全自己完結のオフライン単体版（データ埋め込みHTML）は別途 `MITRE ATT&CK - D3FEND` 作業フォルダに保管。

> 出典：MITRE ATT&CK（attack.mitre.org・v19）／ MITRE D3FEND。ATT&CK® は The MITRE Corporation の商標。
