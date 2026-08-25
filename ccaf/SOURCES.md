# CCAF 学習コンテンツ 出典レジストリ

このファイルは `ccaf/` 配下の教材が依拠する情報源の管理台帳である。
**教材中のすべての事実記述は、ここに登録された出典 ID を持たなければならない。**

最終更新：2026-08-26

---

## 1. 情報源の格付け

教材では出典を 3 階層で区別し、HTML 上でもバッジで可視化する。

| 階層 | 記号 | 定義 | 教材での扱い |
|---|---|---|---|
| **一次（試験）** | `P-EXAM` | Anthropic が発行する試験ガイド PDF、および Pearson VUE / Anthropic Partner Academy の試験運営ページ | **試験の正解はこれが決める。**他の情報源と矛盾する場合も試験ガイドを優先する |
| **一次（製品）** | `P-DOC` | Anthropic 公式の製品ドキュメント・ヘルプセンター・ポリシー・公式ブログ（一次発信） | 背景理解と現行仕様の確認に使う。試験ガイドと食い違う場合は**両論併記**する |
| **二次** | `S` | 個人ブログ、合格体験記、サードパーティのまとめ記事・問題集 | **事実の根拠には使わない。**受験体験の傾向としてのみ、二次であることを明示して引用する |

### 二次情報の取り扱い規則

1. 二次情報を単独の根拠として教材に書かない。必ず「二次情報」と明記する。
2. 二次情報が一次情報と矛盾する場合、**一次情報を採用し、矛盾していること自体を教材に記載する**（§4 参照）。
3. 二次情報から得た「体験談・傾向」は、事実（Fact）と筆者の意見（Opinion）を分けて記載する。
4. 二次情報の練習問題を転載しない。設問は本教材のオリジナルとする。

---

## 2. 一次情報（試験）— P-EXAM

| ID | 出典 | 版・日付 | 取得日 | 主に何を確定したか |
|---|---|---|---|---|
| `P-EXAM-01` | Claude Certified Associate – Foundations Exam Guide（PDF・全11ページ）<br>`C:\Users\showh\OneDrive\ドキュメント\Downloads\Claude_Certified_Associate_-_Foundations_-_Exam_Guide.pdf` | Version 1.0 / Effective July 2026 | 2026-08-26 | Associate の全ドメイン・配点・出題形式・採点・ポリシー・公式サンプル問題3問 |
| `P-EXAM-02` | Claude Certified Architect – Foundations Exam Guide（PDF・全37ページ）<br>`C:\Users\showh\OneDrive\ドキュメント\Downloads\Claude_Certified_Architect_-_Foundations_-_Exam_Guide.pdf` | Version 0.2 / Last Updated June 30 2026 | 2026-08-26 | Architect の全5ドメイン・26タスクステートメント・6シナリオ・公式サンプル問題12問・演習4本・In/Out of Scope |
| `P-EXAM-03` | 同上（旧版）<br>`instructor_..._Claude+Certified+Architect+–+Foundations+Certification+Exam+Guide.pdf` | Version 0.1 / Feb 10 2025 | 2026-08-26 | **差分照合用。**v0.1→v0.2 で出題範囲の変更がないことの確認に使用 |
| `P-EXAM-04` | Claude Certification Program by Anthropic — Pearson VUE<br>https://www.pearsonvue.com/us/en/anthropic.html | — | 2026-08-26 | 4試験の**正式な試験コード**、再受験待機期間、テストセンターの変更期限 |
| `P-EXAM-05` | Earn your Claude certification — Anthropic Partner Academy<br>https://anthropic-partners.skilljar.com/page/partner-certifications | — | 2026-08-26 | 4試験の対象ロール・価格・Associate はパートナー階層要件に算入されない旨 |
| `P-EXAM-06` | FAQ – Certifications — Anthropic Partner Academy<br>https://anthropic-partners.skilljar.com/page/faq-certifications | — | 2026-08-26 | **受験資格（パートナー限定）**、年齢要件、更新プロセス、階層別割引、提供言語 |

### P-EXAM から確定した事実

**4試験の構成**（`P-EXAM-04`／`P-EXAM-05`）

| 試験 | コード | 価格 | 備考 |
|---|---|---|---|
| Claude Certified Associate – Foundations | `CCAO-F` | $99 | パートナー階層要件に**算入されない** |
| Claude Certified Developer – Foundations | `CCDV-F` | $125 | |
| Claude Certified Architect – Foundations | `CCAR-F` | $125 | Architect 試験ガイド PDF にコード記載なし。コードは Pearson VUE 側で確認 |
| Claude Certified Architect – Professional | `CCAR-P` | $175 | |

**全試験共通**（`P-EXAM-05`／`P-EXAM-06`）
- 60問 / 120分 / スケールドスコア 100–1,000 / 合格 720
- 有効期限 12ヶ月、期限内更新は無料・非監督のアセスメント（Partner Academy）
- 失効した場合は全額支払って本試験を再受験
- 再受験待機：1回目失敗後14日 / 2回目後30日 / 3回目後90日、ローリング12ヶ月で最大4回
- 提供言語は**英語のみ**。監督付き試験中のブラウザ翻訳ツール使用は禁止

**受験資格（重要）**（`P-EXAM-06`）
> "Certification is available to people at Claude Partner Network organizations."
- 登録には**認識された企業ドメインのパートナーメールアドレス**が必要。個人メールでは登録できない
- 18歳以上、政府発行 ID による本人確認
- 配慮申請（accommodations）は Pearson 経由、**10日以上前**に申請すること

**階層別割引**（`P-EXAM-06`）
- Registered：定価 / Select・Preferred・Global Premier：50%オフ（自動適用）
- Global Premier：2026-08-31 まで 100% 割引

---

## 3. 一次情報（製品）— P-DOC

> **注意：** `docs.claude.com` は `platform.claude.com/docs` へ 302 リダイレクトされる（2026-08-26 確認）。教材内のリンクは新ドメインを使う。

### 3.1 モデル・料金・API

| ID | 出典 | 取得日 | 確定した事実 |
|---|---|---|---|
| `P-DOC-01` | Models overview<br>https://platform.claude.com/docs/en/about-claude/models/overview | 2026-08-26 | 現行ラインナップ、コンテキスト長、レイテンシ序列、モデルID |
| `P-DOC-02` | Pricing<br>https://platform.claude.com/docs/en/about-claude/pricing | 2026-08-26 | 単価、バッチ50%割引、プロンプトキャッシュ倍率 |
| `P-DOC-03` | Batch processing<br>https://platform.claude.com/docs/en/build-with-claude/batch-processing | 2026-08-26 | バッチAPIの制限・期限・`custom_id`・結果順序 |
| `P-DOC-04` | Tool use with Claude<br>https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview | 2026-08-26 | `tool_use` / `tool_result` の往復、`tool_choice`、クライアント/サーバーツールの区別 |
| `P-DOC-05` | Prompting best practices<br>https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | 2026-08-26 | プロンプト技法の公式リファレンス（明確・文脈・例示・XML構造・ロール・思考・エージェント系） |
| `P-DOC-06` | Prompt engineering overview<br>https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview | 2026-08-26 | プロンプトエンジニアリング着手前の前提（成功基準の定義・評価の用意） |

**モデルラインナップ**（`P-DOC-01`／`P-DOC-02`、2026-08-26 時点）

| モデル | Claude API ID | コンテキスト | 最大出力 | 入力 $/MTok | 出力 $/MTok | 相対レイテンシ |
|---|---|---|---|---|---|---|
| Claude Fable 5 | `claude-fable-5` | 1M | 128K | $10 | $50 | Slower |
| Claude Opus 5 | `claude-opus-5` | 1M | 128K | $5 | $25 | Moderate |
| Claude Sonnet 5 | `claude-sonnet-5` | 1M | 128K | $2 | $10 | Fast |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200K | 64K | $1 | $5 | Fastest |

公式のコスト最適化指針（`P-DOC-02`）:
> "Choose Haiku for simple tasks, Sonnet for most production workloads, and Opus for the most complex reasoning"

**バッチAPI**（`P-DOC-03`）
- 入力・出力とも**標準価格の50%**
- 1バッチあたり 100,000 リクエストまたは 256 MB のいずれか先に到達する方が上限
- 多くは1時間以内に完了するが、**24時間で期限切れ**。結果は作成から**29日間**取得可能
- 結果は**任意の順序**で返る → `custom_id`（1–64文字、`^[a-zA-Z0-9_-]{1,64}$`）で突合すること
- バッチで**使えない**パラメータ：`stream: true`、`speed`（Fast mode）、`store`/`previous_thread_event_id`、`cache_hint`/`context_hint`、`max_tokens: 0`

### 3.2 Claude Code

| ID | 出典 | 取得日 | 確定した事実 |
|---|---|---|---|
| `P-DOC-10` | How Claude remembers your project（memory）<br>https://code.claude.com/docs/en/memory | 2026-08-26 | CLAUDE.md 階層・`@import`・`.claude/rules/` の `paths` フロントマター・`/memory` |
| `P-DOC-11` | Extend Claude with skills<br>https://code.claude.com/docs/en/skills | 2026-08-26 | SKILL.md フロントマター全項目、`context: fork`、スキルの配置場所と優先順位 |
| `P-DOC-12` | CLI reference<br>https://code.claude.com/docs/en/cli-reference | 2026-08-26 | `-p/--print`、`--output-format`、`--json-schema`、`--resume`、`--fork-session` 等 |
| `P-DOC-13` | Connect Claude Code to tools via MCP<br>https://code.claude.com/docs/en/mcp | 2026-08-26 | MCP スコープ3種と保存先、環境変数展開、ツール名前空間 |
| `P-DOC-14` | Create custom subagents<br>https://code.claude.com/docs/en/sub-agents | 2026-08-26 | サブエージェント定義の配置と優先順位、継承するもの/しないもの、Explore サブエージェント |
| `P-DOC-15` | Hooks reference<br>https://code.claude.com/docs/en/hooks | 2026-08-26 | 全フックイベント名、ブロック・改変が可能なイベントと方法 |
| `P-DOC-16` | Configure permissions<br>https://code.claude.com/docs/en/permissions | 2026-08-26 | パーミッションモード一覧、plan モードの挙動 |
| `P-DOC-17` | Explore the context window<br>https://code.claude.com/docs/en/context-window | 2026-08-26 | セッション開始時に何がコンテキストへ載るか、`/compact` |

**CLAUDE.md 階層**（`P-DOC-10`、広い順＝読み込み順）

| スコープ | 場所 | 共有範囲 |
|---|---|---|
| Managed policy | `/Library/Application Support/ClaudeCode/CLAUDE.md`（macOS）/ `/etc/claude-code/CLAUDE.md`（Linux・WSL）/ `C:\Program Files\ClaudeCode\CLAUDE.md`（Windows） | 組織全体・**個別設定で除外不可** |
| User | `~/.claude/CLAUDE.md` | 自分のみ（全プロジェクト） |
| Project | `./CLAUDE.md` または `./.claude/CLAUDE.md` | チーム（バージョン管理経由） |
| Local | `./CLAUDE.local.md` | 自分のみ（当該プロジェクト）・`.gitignore` 推奨 |

- `@path/to/file` インポートは**最大4ホップ**まで再帰可能
- 目安サイズは**1ファイル200行未満**。4 MiB を超えるファイルはスキップされる
- `.claude/rules/*.md` は YAML フロントマターの `paths:` グロブで**条件付き読み込み**が可能。`paths` なしのルールは無条件に読み込まれる
- ユーザーレベルルール `~/.claude/rules/` はプロジェクトルールより先に読み込まれる（＝プロジェクト側が優先）

**MCP スコープ**（`P-DOC-13`）

| スコープ | 適用範囲 | バージョン管理で共有 | 保存先 |
|---|---|---|---|
| Local（既定） | 現在のプロジェクトのみ | いいえ | `~/.claude.json` |
| Project | 現在のプロジェクトのみ | **はい** | プロジェクトルートの `.mcp.json` |
| User | 全プロジェクト | いいえ | `~/.claude.json` |

- 優先順位：Local → Project → User
- `${VAR}` による環境変数展開に対応。`${VAR:-default}` の既定値構文も使える
- プロジェクトスコープの `.mcp.json` サーバーは**対話セッションでの承認が必要**

**SKILL.md フロントマター（抜粋）**（`P-DOC-11`）
`name` / `description` / `when_to_use` / `argument-hint` / `arguments` / `disable-model-invocation` / `user-invocable` / `allowed-tools` / `disallowed-tools` / `model` / `effort` / `context`（`fork`）/ `agent` / `background` / `hooks` / `paths` / `shell` / `metadata` / `license` / `compatibility`

### 3.3 Claude Agent SDK

| ID | 出典 | 取得日 | 確定した事実 |
|---|---|---|---|
| `P-DOC-20` | Agent SDK overview<br>https://code.claude.com/docs/en/agent-sdk/overview | 2026-08-26 | Agent SDK の位置づけ、CLI / Client SDK / Managed Agents との使い分け |
| `P-DOC-21` | Subagents in the SDK<br>https://code.claude.com/docs/en/agent-sdk/subagents | 2026-08-26 | `AgentDefinition` の全フィールド、`allowedTools` への Agent 追加、継承しないもの |
| `P-DOC-22` | Work with sessions<br>https://code.claude.com/docs/en/agent-sdk/sessions | 2026-08-26 | `resume` / `continue` / `fork_session`(`forkSession`) の違い |

**`AgentDefinition` のフィールド**（`P-DOC-21`）
必須：`description`、`prompt`
任意：`tools`、`disallowedTools`、`model`、`skills`、`memory`、`mcpServers`、`initialPrompt`、`maxTurns`、`background`、`effort`、`permissionMode`

**サブエージェントが受け取るもの／受け取らないもの**（`P-DOC-21`）

| 受け取る | 受け取らない |
|---|---|
| 自身のシステムプロンプト（`AgentDefinition.prompt`）と Agent ツールのプロンプト文字列 | 親の会話履歴・ツール結果 |
| プロジェクト CLAUDE.md（`settingSources` 経由） | 親のシステムプロンプト |
| ツール定義（親から継承、または `tools` の部分集合） | プリロードされたスキル内容（`skills` に列挙した場合を除く） |

> "The only content you pass from parent to subagent is the Agent tool's prompt string, so include any file paths, error messages, or decisions the subagent needs directly in that prompt."

### 3.4 Claude（claude.ai）製品機能 — Associate 向け

| ID | 出典 | 取得日 | 確定した事実 |
|---|---|---|---|
| `P-DOC-30` | What are Projects?<br>https://support.claude.com/en/articles/9517075-what-are-projects | 2026-08-26 | Projects の定義、ナレッジベース、カスタム指示、プラン別制限、共有 |
| `P-DOC-31` | What are artifacts and how do I use them?<br>https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them | 2026-08-26 | Artifacts の生成条件、対象コンテンツ種別、公開・共有、プラン要件 |
| `P-DOC-32` | Use connectors to extend Claude's capabilities<br>https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities | 2026-08-26 | コネクタの権限継承、プラン別可用性、組織管理者による制御 |
| `P-DOC-33` | Use Google Workspace connectors<br>https://support.claude.com/en/articles/10166901-use-google-workspace-connectors | 2026-08-26 | Gmail / Drive / Calendar 連携、コネクタデータをモデル学習に使わない旨 |
| `P-DOC-34` | Use Claude's chat search and memory<br>https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context | 2026-08-26 | メモリはトピック単位で保存、プロジェクトごとに独立したメモリ空間、設定でのオン/オフ |
| `P-DOC-35` | Use research on Claude<br>https://support.claude.com/en/articles/11088861-use-research-on-claude | 2026-08-26 | Research の適用範囲と所要時間、有料プラン限定 |
| `P-DOC-36` | When should I use web search, extended thinking, and research?<br>https://support.claude.com/en/articles/11095361-when-should-i-use-web-search-extended-thinking-and-research | 2026-08-26 | 3機能の使い分け基準（ツール呼び出し回数・所要時間・タスク性質） |

**主要な確定事実**

- **Projects**（`P-DOC-30`）：独立したチャット履歴とナレッジベースを持つワークスペース。カスタム指示を設定可能。**無料プランは最大5プロジェクト**。有料プランは RAG により容量が最大10倍。共有は **Team / Enterprise 限定**（閲覧のみ／編集可）
- **Artifacts**（`P-DOC-31`）：「significant and self-contained, typically over 15 lines」の自己完結コンテンツで自動生成。対象＝ドキュメント（Markdown/テキスト）、コード、HTML、SVG、図表、React コンポーネント。サイドバーに残すには **Publish** が必要。設定で「Code execution and file creation」が有効である必要がある
- **コネクタ**（`P-DOC-32`）：**接続先サービスの権限をユーザーごとに継承する**。「If someone can't access a specific file, channel, or record in the source system, the connector can't reach it from Claude either.」Team/Enterprise のオーナーは組織全体でアクション制限が可能
- **メモリ**（`P-DOC-34`）：会話終了後の要約ではなく**チャット中にトピック単位**で保存。**プロジェクトごとに独立したメモリ空間**を持つ。Settings > Memory で無効化可能。過去チャット検索は有料プラン限定
- **使い分け**（`P-DOC-36`）：Web search＝1–2ツール呼び出しの事実確認／Extended thinking＝Web データ不要の複雑な推論／Research＝5回以上のツール呼び出しを伴う1–3分の包括的調査（上位モードは最大45分）

### 3.5 ポリシー — Associate ドメイン6 向け

| ID | 出典 | 取得日 | 確定した事実 |
|---|---|---|---|
| `P-DOC-40` | Anthropic Usage Policy<br>https://www.anthropic.com/legal/aup | 2026-08-26 | 禁止用途カテゴリ、高リスク用途要件、AI 利用開示義務 |

**高リスク用途の2要件**（`P-DOC-40`）— Associate ドメイン6 の中核
1. **Human-in-the-Loop**：「A qualified professional in that field must review the content or decision prior to dissemination or finalization」
2. **開示**：「You must disclose to them that you are using AI to help produce your advice, decisions, or recommendations」

対象領域：法解釈、医療判断、保険引受、金融適格性判断、雇用・住宅に関する判断、学術試験、ジャーナリズム的コンテンツ生成など。
消費者向けチャットボットは**各チャットセッションの冒頭で**最低限 AI 利用を開示すること。

---

## 4. 一次情報どうしの差分・注意点

教材ではこれらを「**試験ガイドの記述**」と「**現行ドキュメントの記述**」として両論併記する。
**試験の解答は必ず試験ガイド側を採る。**

| # | 論点 | 試験ガイド（P-EXAM） | 現行ドキュメント（P-DOC） | 教材での扱い |
|---|---|---|---|---|
| D-1 | サブエージェント起動ツール名 | `Task` ツール。`allowedTools` に `"Task"` を含める必要がある（`P-EXAM-02` TS 1.3） | **v2.1.63 で `"Task"` から `"Agent"` へ改名**。現行 SDK は `tool_use` に `"Agent"` を出すが、`system:init` のツール一覧と `permission_denials[].tool_name` では今も `"Task"` を使う（`P-DOC-21`） | 試験では **Task** を選ぶ。実務では両方を照合する必要がある旨を注記 |
| D-2 | カスタムスラッシュコマンド | `.claude/commands/`（プロジェクト）と `~/.claude/commands/`（個人）（`P-EXAM-02` TS 3.2） | **カスタムコマンドはスキルに統合済み。**`.claude/commands/deploy.md` と `.claude/skills/deploy/SKILL.md` はどちらも `/deploy` を作る。既存の `.claude/commands/` はそのまま動作する（`P-DOC-11`） | 試験では `.claude/commands/` が正解。統合の事実は補足として記載 |
| D-3 | バッチAPIとツール呼び出し | 「The batch API does not support multi-turn tool calling within a single request（リクエスト中にツールを実行して結果を返せない）」（`P-EXAM-02` TS 4.5） | 「Tool use, including all server tools」「Multi-turn conversations」はバッチ可能（`P-DOC-03`） | **矛盾ではない。**バッチ不可なのは*クライアント側*ツールの往復。サーバーツールは Anthropic 側で実行されるため可。この読み分けを明示 |
| D-4 | バッチの処理時間 | 「up to 24-hour processing window, no guaranteed latency SLA」（`P-EXAM-02`） | 「most batches finishing in less than 1 hour」だが**24時間で期限切れ**（`P-DOC-03`） | 設計判断の根拠は「SLA がないこと」。試験ガイドの記述と整合 |
| D-5 | MCP スコープの数 | プロジェクト（`.mcp.json`）と ユーザー（`~/.claude.json`）の**2つ**を提示（`P-EXAM-02` TS 2.4） | **Local / Project / User の3つ。**Local が既定（`P-DOC-13`） | 試験の設問は2択構造で問われる。3つ目（Local）の存在は補足 |
| D-6 | スケジュール変更期限 | 「You may cancel or reschedule up to **24 hours** before your appointment」（`P-EXAM-01` §10） | Pearson VUE：テストセンター予約は「rescheduled or cancelled up to **48 hours** prior」（`P-EXAM-04`） | **実務上は48時間前を安全側として案内。**両方を併記 |
| D-7 | 結果通知の粒度 | Associate：合否＋スケールドスコア＋**ドメイン別正答率**（`P-EXAM-01` §5・§9）／Architect：「Result reporting: Pass or fail」（`P-EXAM-02`） | — | 試験ごとに異なる。Architect でドメイン別内訳が出るという二次情報は §5 の S-02 参照 |
| D-8 | モデル階層 | 「Differentiate between Claude model types (Haiku, Sonnet, Opus)」の3階層のみ（`P-EXAM-01` D3） | 現行は **Fable 5 / Opus 5 / Sonnet 5 / Haiku 4.5**（`P-DOC-01`） | 試験は Haiku/Sonnet/Opus の**役割分担の考え方**を問う。現行ラインナップは参考情報として別掲 |

### Architect 試験ガイド v0.1 → v0.2 の差分（`P-EXAM-02` vs `P-EXAM-03`）

機械照合の結果、**出題範囲に変更なし**。
- 5ドメイン・26タスクステートメント（1.1–1.7 / 2.1–2.5 / 3.1–3.6 / 4.1–4.6 / 5.1–5.6）が完全一致
- v0.2 の箇条書き 301 件すべてが v0.1 に存在
- v0.2 で新規追加されたのは **「Exam Details at a Glance」表（受験ロジスティクス）**のみ。v0.1 は "Anthropic, PBC · Confidential" 表記の内部ドラフトで、この表を持たなかった

---

## 5. 二次情報 — S

**以下はいずれも Anthropic の公式見解ではない。**教材では「二次情報」バッジを付し、事実の根拠には用いない。

| ID | 出典 | 取得日 | 引用する範囲 |
|---|---|---|---|
| `S-01` | re:cinq Blog「Claude Certified Architect (Foundations) Exam: A Study Guide and How I Passed」<br>https://re-cinq.com/blog/claude-certified-architect-foundations-exam | 2026-08-26 | 受験体験（設問の言い回し、CI/CD の出題感） |
| `S-02` | Very Good Ventures「Passing the Claude Certified Architect Exam: A 738 Story」<br>https://verygood.ventures/blog/passing-the-claude-certified-architect-exam/ | 2026-08-26 | 受験体験（スコア内訳、ブロック構造） |

### S-01 からの引用（二次）

- *事実主張*：Git および CI/CD パイプラインのコマンドが、練習問題から想像するより高頻度で出題された
- *事実主張*：スコア返却は「公式には5日以上」だが、筆者の場合はより早く返ってきた
- *意見*：「模擬試験と本番の最大の差は難易度ではなく**言い回し**だった」。修飾語が長文中に埋め込まれるため、選択肢を選ぶ前に修飾語を特定すること
- *意見*：練習試験で 900/1000 を安定して超えるまで本番を予約しないほうがよい
- *意見*：読むだけでなく、実際に動かして壊す演習のほうが定着する

### S-02 からの引用（二次）

- *事実主張*：筆者のスコアは 738（合格 720）。60問中44問正解（73%）
- *事実主張*：**4ブロック × 15問**の構成で、各ブロックが6本のシナリオプールから抽選された1本に紐づく
- *事実主張*：ドメイン別内訳が返却された（Agentic Architecture 78% / Context Management 73% / Tool Design 70% / Claude Code Configuration 69%）
- *事実主張*：結果は通常7〜10日で届く
- *意見*：「練習ツールが問題を使い回すなら、上がっていくスコアは理解ではなく**その問題プールの記憶**を測っている」

### 二次情報のうち、一次情報と矛盾するもの（教材で採用しない）

| 二次情報の主張 | 出典 | 一次情報 | 判定 |
|---|---|---|---|
| 「Certification expires **six months** after passing（認定は6ヶ月で失効）」 | `S-02` | **12ヶ月**（`P-EXAM-01` §14 / `P-EXAM-02` / `P-EXAM-06`） | **誤り。**教材では 12ヶ月を採用し、この誤情報が流通していること自体を注意喚起する |
| 「partial grading for some questions（一部の設問で部分点がある）」 | 検索結果の要約（出典不特定） | Architect：「Multiple choice; one correct answer and three incorrect options」（`P-EXAM-02`）／Associate：「each item states how many responses to select」（`P-EXAM-01`） | **裏付けなし。**Associate の複数回答形式を部分点と誤認した可能性。教材には採らない |
| Architect でドメイン別正答率が返却される | `S-02` | Architect 試験ガイドは「Result reporting: Pass or fail」のみ（`P-EXAM-02`） | **一次情報と不一致。**運用が変わった可能性はあるが確認できないため、教材では「二次情報による報告」と明示 |

---

## 6. 使用しなかった情報源

以下は検索で発見したが、**教材の根拠には使用しない**。

- Udemy の対策コース・模擬試験パック（商用サードパーティ、内容の検証不能）
- `claudecertificationguide.com`、`claudecertifiedarchitects.com`、`certificationpractice.com`、`spectrumailab.com`、`flashgenius.net`、`cloud-authority.com`、各種 Medium 記事等のまとめサイト
  - 理由：一次情報の再掲であり独自の検証価値がない、または出典が明示されていない
  - 例外的に、受験体験として固有の情報を持つ `S-01`・`S-02` のみを二次情報として採用した

---

## 7. 再検証のルール

- Anthropic の製品仕様は変化が速い。**`P-DOC` 系は3ヶ月ごとに再確認**する
- `P-EXAM-02`（Architect）は Version 0.2 のため、**改版時は §4 の差分照合を再実行**する
- 教材 HTML には出典 ID と取得日を埋め込み、再検証時にどのページを直すべきかを追跡可能にする
