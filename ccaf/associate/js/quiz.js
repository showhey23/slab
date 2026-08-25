/* ============================================================
   CCAO-F 演習クイズ 問題バンク
   すべて本教材のオリジナル想定問題（公式サンプル問題は出典を明記）。
   本試験の設問は守秘義務契約により非公開であり、転載していない。
   ci: 数値 = 単一選択 / 配列 = 複数回答（選択数は配列長）
   ============================================================ */
const QUESTIONS=[
/* ---------- D1 プロンプトとタスク実行（14%） ---------- */
{"sub":"D1","sj":"社内規程の要約プロンプトで、出力の構成が毎回変わる。内容の正確さには問題がない。最も効果的な対処は。","se":"A summarization prompt returns a different structure every run, though the content is accurate. Most effective fix?","opts":[{"j":"「一貫した形式で出力して」という指示を追加する","e":"Add an instruction to \"use a consistent format\""},{"j":"望ましい出力の具体例を1〜2件プロンプトに含める","e":"Include 1-2 concrete examples of the desired output"},{"j":"より高性能なモデルに切り替える","e":"Switch to a more capable model"},{"j":"入力する規程を短く分割する","e":"Split the source document into shorter chunks"}],"ci":1,"ex":"症状は<b>形式の不安定さ</b>。形式は言葉で説明するより<b>例示</b>のほうが確実に伝わる。A は抽象的で「一貫した形式」の定義がない。C はコストを上げるだけで原因（形式の未指定）に対処しない。D は入力長の問題であり症状の原因ではない。"},
{"sub":"D1","sj":"新製品の販促アイデアを依頼したが、毎回「SNSキャンペーン」など既知の案に収束する。幅を広げる最も適切な進め方は。","se":"Brainstormed promotion ideas keep converging on familiar options. Best way to widen the space?","opts":[{"j":"実現可能性が高い案に限定するよう指示を強める","e":"Instruct it to only propose highly feasible ideas"},{"j":"評価を求めず多数の案を出させ、次のターンで評価軸を与えて絞る","e":"Generate many ideas first, then apply criteria in a later turn"},{"j":"過去に成功した施策を例として与え、それに似た案を求める","e":"Provide past successful campaigns and ask for similar ideas"},{"j":"1回のプロンプトで列挙と優先順位付けを同時に依頼する","e":"Ask for the list and the ranking in a single prompt"}],"ci":1,"ex":"発想タスクでは<b>量の生成と評価を分離する</b>のが定石。A と D は生成段階に評価の制約を持ち込み探索空間を狭める。C は既知の成功例に寄せる指示で収束を強める。"},
{"sub":"D1","sj":"長い契約書を貼り付けて分析を依頼すると、指示部分まで分析対象として扱われることがある。最も適切な対処は。","se":"When a long contract is pasted in, the model sometimes treats the instructions as part of the material. Best fix?","opts":[{"j":"契約書を XML タグで囲み、そのタグ内だけを対象とすると明示する","e":"Wrap the contract in XML tags and state that only that region is the material"},{"j":"契約書を別のチャットに分けて貼る","e":"Paste the contract into a separate chat"},{"j":"指示文を契約書より前に置く","e":"Put the instruction before the contract"},{"j":"契約書を要約してから分析させる","e":"Summarize the contract first, then analyze"}],"ci":0,"ex":"公式のプロンプト指針は <b>XML タグによる構造化</b>を一般原則の一つとして挙げている。素材と指示の境界を明示するのが直接的な解決。C は順序を変えるだけで境界は依然として曖昧。B と D は分析の前提を壊す。"},
{"sub":"D1","sj":"プロンプトエンジニアリングに着手する前に整えておくべきものとして、公式ガイドが挙げる前提を<b>2つ</b>選べ。","se":"Per the official guide, which two prerequisites should be in place BEFORE prompt engineering? Select two.","opts":[{"j":"ユースケースに対する明確な成功基準の定義","e":"A clear definition of success criteria for the use case"},{"j":"利用するモデルの単価表","e":"A price table for the models in use"},{"j":"その基準に対して実証的に検証する手段","e":"Some way to empirically test against those criteria"},{"j":"チーム全員への事前トレーニング","e":"Prior training for the whole team"}],"ci":[0,2],"ex":"公式のプロンプトエンジニアリング概要は、着手の前提として (1) <b>明確な成功基準</b>、(2) <b>それを実証的に検証する手段</b>、(3) 改善対象となる初稿プロンプト、を挙げる。何をもって良い出力とするかが決まっていなければ、反復しても改善を判定できない。"},
{"sub":"D1","sj":"「創造産業への AI の影響」を調べさせたところ、報告書がデジタルアート・グラフィックデザイン・写真のみを扱い、音楽・執筆・映画が欠落した。最も可能性の高い原因は。","se":"A research report on \"AI in creative industries\" covers only visual arts, missing music, writing, and film. Most likely root cause?","opts":[{"j":"検索の質が低く、非視覚分野の資料が見つからなかった","e":"Search quality was poor and non-visual sources were not found"},{"j":"タスク分解の範囲が狭く、割り当て自体に非視覚分野が含まれていなかった","e":"Task decomposition was too narrow; the assignments never covered non-visual domains"},{"j":"出力の文字数上限に達して後半が切れた","e":"The output hit a length limit and was truncated"},{"j":"要約の段階で非視覚分野が削られた","e":"The summarization step dropped the non-visual domains"}],"ci":1,"ex":"各工程が正しく動いているのに成果物が不完全なら、原因は<b>割り当ての設計</b>にある。分解の広さは分解する側の責任であり、下流の処理は与えられた範囲を正しくこなしているにすぎない。"},
{"sub":"D1","sj":"レポート生成プロンプトに、互いに影響し合う3つの不備（トーン、構成、用語の統一）が同時にある。最も適切な進め方は。","se":"A report prompt has three interacting problems (tone, structure, terminology). Best approach?","opts":[{"j":"3つを1通のメッセージにまとめ、具体的に指摘する","e":"Address all three in a single detailed message"},{"j":"1つずつ順に直し、その都度出力を確認する","e":"Fix them one at a time, checking output after each"},{"j":"最も影響が大きい1つだけを直し、他は許容する","e":"Fix only the highest-impact one and accept the rest"},{"j":"プロンプトを破棄してゼロから書き直す","e":"Discard the prompt and rewrite from scratch"}],"ci":0,"ex":"修正点が<b>互いに絡む</b>場合は1回でまとめて伝えるほうが早い（トーンを直すと構成も変わるため、順に直すと前の修正が崩れる）。逆に<b>独立した</b>問題は順に直したほうが原因と結果の対応が保たれる。"},
{"sub":"D1","sj":"経営会議向けの資料を Claude に起草させたが、現場向けの細かい手順ばかりが並んだ。プロンプトに最も不足していたものは。","se":"A draft for an executive meeting came back full of operational detail. What was most likely missing from the prompt?","opts":[{"j":"出力の文字数指定","e":"A word-count limit"},{"j":"読者と用途の指定","e":"The audience and the purpose"},{"j":"参考資料の添付","e":"Reference material"},{"j":"役割の指定","e":"A role assignment"}],"ci":1,"ex":"同じ事実でも読者によって必要な粒度が変わる。<b>読者（経営層）と用途（意思決定）</b>を書かなければ、粒度の判断材料がない。A は症状の一部を緩和するが原因ではない。D も有効だが、この症状に最も直接効くのは読者と用途。"},
{"sub":"D1","sj":"プロンプトの反復改善を行う際の原則として適切なものを<b>2つ</b>選べ。","se":"Which two are sound principles when iterating on a prompt? Select two.","opts":[{"j":"一度に一つの変更だけを加える","e":"Change only one thing at a time"},{"j":"毎回異なる入力で試して汎用性を確かめる","e":"Use a different input each time to check generality"},{"j":"固定した代表入力で前後を比較する","e":"Compare before and after on a fixed representative input"},{"j":"効かなかった指示も残しておく","e":"Keep instructions that did not work"}],"ci":[0,2],"ex":"複数を同時に変えると何が効いたか判定できない。入力が変われば改善したのか入力が易しかったのか区別できないため、<b>検証用の入力は固定</b>する。効かない指示を残すと設定が肥大化し、他の指示の遵守率が下がる。"},

/* ---------- D2 出力評価と検証（21%） ---------- */
{"sub":"D2","sj":"Claude が新しい規制の要約で特定の条項番号を引用した。コンプライアンス部門へ送る前に取るべき最も適切な行動は。","se":"Claude cites a specific subsection number when summarizing a new regulation. Before sending to compliance, the most appropriate action?","opts":[{"j":"Claude が高い確信を示していたのでそのまま送る","e":"Send as-is, since Claude expressed high confidence"},{"j":"引用された条項を公式の規制原文と照合する","e":"Verify the cited subsection against the official regulation text"},{"j":"Claude に確信度を評価させ、高ければ送る","e":"Ask Claude to rate its own confidence and send if high"},{"j":"より格式ばった文体に書き直してから送る","e":"Reword the summary to sound more formal, then send"}],"ci":1,"ex":"<b>公式サンプル問題（試験ガイド §8 Sample 1）。</b>言語モデルは引用番号のような「具体的に見える細部」を捏造しうる。事実主張は権威ある出典で検証するのが求められる注意義務。<b>自己申告の確信度（A・C）は信頼できる精度の指標ではない。</b>体裁の修正（D）は正しさに対処していない。"},
{"sub":"D2","sj":"40ページの規程から例外条項を抽出させたところ、中盤の章の例外が2件抜けていた。再発防止に最も効果的なのは。","se":"Extracting exceptions from a 40-page policy missed two items from the middle chapters. Most effective prevention?","opts":[{"j":"「抜け漏れなく」抽出するよう指示を追加する","e":"Add an instruction to extract \"without omissions\""},{"j":"出力を読み直し、不自然な箇所を目視で探す","e":"Re-read the output and look for anything odd"},{"j":"章ごとに分けて抽出し、章立てと出力を照合する","e":"Extract chapter by chapter and reconcile against the table of contents"},{"j":"Claude に網羅性を自己評価させる","e":"Have Claude self-assess completeness"}],"ci":2,"ex":"<b>網羅性</b>の失敗であり、しかも中盤で起きている点が典型（長い入力は冒頭と末尾が安定し中間が落ちやすい）。書かれていないものは出力を読んでも見えないため B は検出手段にならない。D は自己申告で信頼できない。"},
{"sub":"D2","sj":"応募者の一次評価コメントを Claude に作らせ、合否は人事部長が決める運用を検討している。満たすべき要件を<b>2つ</b>選べ。","se":"Claude drafts first-pass candidate review comments; a director makes the final call. Which two requirements apply? Select two.","opts":[{"j":"その分野の有資格者が、確定・展開の前に内容を確認する","e":"A qualified professional reviews before finalization"},{"j":"確信度スコアが閾値を超えた案件のみ人間が確認する","e":"Humans review only where the confidence score exceeds a threshold"},{"j":"助言・判断の作成に AI を用いていることを対象者へ開示する","e":"Disclose to the affected person that AI is used"},{"j":"人間が書いたように書き直し、AI 利用が分からないようにする","e":"Rewrite so the AI involvement is not apparent"}],"ci":[0,2],"ex":"雇用判断は利用ポリシーの<b>高リスク用途</b>で、(1) 有資格専門家による事前レビューと (2) <b>AI 利用の開示</b>の両方が要件。B は自己申告の確信度に依存し精度指標にならない。D は AI 生成物を人間のものとして提示する行為で、ポリシーが明示的に禁じている。"},
{"sub":"D2","sj":"競合分析レポートで、A 社に有利な材料ばかりが厚く書かれている印象がある。偏りを最も効率よく検査する方法は。","se":"A competitive analysis seems to favor Company A. Most efficient way to test for bias?","opts":[{"j":"別のモデルで同じレポートを生成して比べる","e":"Regenerate with a different model and compare"},{"j":"反対の結論を支持する材料を同じ分量で書かせる","e":"Ask for the opposing case at the same length"},{"j":"レポートを短く要約させ、要点だけを見る","e":"Summarize the report and review only the key points"},{"j":"Claude に偏りがないか尋ねる","e":"Ask Claude whether the report is biased"}],"ci":1,"ex":"偏りの目視判定は難しい。<b>反対側を同じ分量で書かせる</b>と、材料の厚みの差が可視化される。反対側が明らかに薄ければ、元の出力は結論ありきの可能性が高い。D は自己申告であり検査にならない。"},
{"sub":"D2","sj":"Claude に長文レポートを生成させ、その直後に同じ会話で「誤りがないか点検して」と依頼した。この方法の問題点は。","se":"After generating a long report, you ask for a review in the same conversation. What is the flaw?","opts":[{"j":"会話が長くなりコストが増える","e":"The conversation gets longer and costs more"},{"j":"生成時の推論文脈を保持しているため、自らの判断を疑いにくい","e":"It retains its own generation reasoning and is less likely to question its decisions"},{"j":"レビュー用のプロンプトが最適化されていない","e":"The review prompt is not optimized"},{"j":"モデルはレビュー作業に対応していない","e":"The model does not support review tasks"}],"ci":1,"ex":"同一セッションのモデルは生成時の推論文脈を保持しており、自らの決定を疑いにくい。<b>生成過程を共有しない独立したインスタンス</b>にレビューさせるほうが、微妙な問題を検出しやすい。"},
{"sub":"D2","sj":"社内向けの短い進捗メモを Claude に書かせた。この出力の扱いとして最も適切なのは。","se":"Claude drafts a short internal progress memo. Most appropriate handling?","opts":[{"j":"Artifact として公開し、リンクを共有する","e":"Publish it as an Artifact and share the link"},{"j":"チャット本文（インライン）のまま確認して使う","e":"Keep it inline in the chat, review, and use"},{"j":"構造化データ（JSON）に変換してから配布する","e":"Convert to JSON before distributing"},{"j":"有資格者のレビューを経てから送る","e":"Route through a qualified professional first"}],"ci":1,"ex":"出力形式は<b>反復・再利用するか</b>で決める。短く一度きりのメモはインラインで足りる。A は編集・再利用が前提の形式で過剰。C は機械処理が不要なのに変換している。D は高リスク領域ではないため要件に当たらない。"},
{"sub":"D2","sj":"顧客提出用の技術資料をチームで何度も推敲する予定である。最も適した出力形式は。","se":"A customer-facing technical document will be revised repeatedly by the team. Best output format?","opts":[{"j":"チャット本文にそのまま出力する","e":"Output inline in the chat"},{"j":"Artifact として作成し、反復して編集する","e":"Create it as an Artifact and iterate on it"},{"j":"毎回新しい会話で作り直す","e":"Recreate it in a new conversation each time"},{"j":"CSV 形式で出力する","e":"Output as CSV"}],"ci":1,"ex":"Artifacts は「significant and self-contained」で、あとから<b>編集・反復・再利用</b>するコンテンツのための形式。長文を何度も直すならインライン（A）は不向き。C は履歴が分断される。D は文書に不適。"},
{"sub":"D2","sj":"Artifact に関する説明として正しいものを<b>2つ</b>選べ。","se":"Which two statements about Artifacts are correct? Select two.","opts":[{"j":"会話中に作成した Artifact は自動でサイドバーに残る","e":"Artifacts created in a conversation automatically appear in the sidebar"},{"j":"サイドバーに残すには Publish が必要である","e":"You must click Publish to add it to the sidebar"},{"j":"設定で「Code execution and file creation」が有効である必要がある","e":"Requires \"Code execution and file creation\" to be enabled in Settings"},{"j":"Artifact は Enterprise プラン専用の機能である","e":"Artifacts are an Enterprise-only feature"}],"ci":[1,2],"ex":"公式ヘルプによれば、会話中の Artifact は自動ではサイドバーに現れず <b>Publish</b> が必要。また設定で「Code execution and file creation」が有効になっている必要がある。Artifacts は Free / Pro / Max / Team / Enterprise で利用できる。"},
{"sub":"D2","sj":"Claude の出力を検証するとき、優先的に照合すべき対象として最も適切なのは。","se":"When verifying output, which content should you check first?","opts":[{"j":"文章の流れが不自然な箇所","e":"Passages that read awkwardly"},{"j":"数値・固有名詞・引用・日付などの検証可能な識別子","e":"Verifiable identifiers: figures, proper nouns, citations, dates"},{"j":"結論部分の主張","e":"The claims in the conclusion"},{"j":"見出しの構成","e":"The heading structure"}],"ci":1,"ex":"ハルシネーションは<b>具体的に見える細部</b>に現れやすい。検証コストは有限なので、まず<b>照合可能な識別子</b>に集中する。A や D は体裁の問題であり事実の正誤とは無関係。"},
{"sub":"D2","sj":"要約の網羅性を検証する方法として最も確実なのは。","se":"Most reliable way to verify a summary's completeness?","opts":[{"j":"要約を読んで違和感がないか確認する","e":"Read the summary and check that nothing feels off"},{"j":"元資料の見出し・章立てと要約を突き合わせる","e":"Reconcile the summary against the source's headings and structure"},{"j":"Claude に「重要な点は網羅されているか」と尋ねる","e":"Ask Claude whether all key points are covered"},{"j":"要約をもう一度生成し、内容が一致するか見る","e":"Regenerate the summary and check whether the two match"}],"ci":1,"ex":"書かれていないものは出力を読んでも見えない。<b>元資料の構造との照合</b>だけが網羅性の欠落を検出できる。D は同じ偏りが再現されるだけで検証にならない。"},
{"sub":"D2","sj":"高リスク領域に該当し、有資格専門家のレビューが必要になる業務として利用ポリシーが挙げているものを<b>2つ</b>選べ。","se":"Which two are named by the Usage Policy as high-risk domains requiring qualified professional review? Select two.","opts":[{"j":"社内会議の議事録作成","e":"Taking minutes for an internal meeting"},{"j":"保険の引受判断","e":"Insurance underwriting decisions"},{"j":"社内用語集の整備","e":"Maintaining an internal glossary"},{"j":"住宅に関する判断","e":"Housing decisions"}],"ci":[1,3],"ex":"利用ポリシーが挙げる高リスク領域には、法解釈、医療判断、<b>保険引受</b>、金融適格性判断、雇用・<b>住宅</b>に関する判断、学術試験、ジャーナリズム的コンテンツ生成などが含まれる。A・C は個人への直接的な影響を伴わない社内作業。"},
{"sub":"D2","sj":"Claude が生成した市場規模の推計値が、社外提出資料に含まれている。出典を確認したところ、示された調査会社のレポートは実在しなかった。最初に取るべき行動は。","se":"A market-size figure in an external deliverable cites a research report that does not exist. First action?","opts":[{"j":"別の数値を Claude に再生成させて差し替える","e":"Have Claude regenerate a different figure and swap it in"},{"j":"当該数値と出典を削除し、実在する一次資料で裏付けが取れるまで記載しない","e":"Remove the figure and its citation until a real primary source supports it"},{"j":"出典表記を「Claude による推計」に変更して残す","e":"Relabel the citation as \"estimated by Claude\" and keep it"},{"j":"社外提出を取りやめる","e":"Cancel the external submission"}],"ci":1,"ex":"存在しない出典は<b>ハルシネーション</b>であり、同じ生成手順を繰り返す A は再発を招く。C は数値の根拠がない事実を残したままの体裁変更にすぎない。D は資料全体を放棄する過剰反応で、当該箇所を除けば提出できる。"},

/* ---------- D3 製品とモデルの選択（12%） ---------- */
{"sub":"D3","sj":"短い顧客返信の下書きを大量に生成する必要があり、深い推論より速度とコストが重要である。最も適した選択は。","se":"You need many short customer-reply drafts where speed and cost matter more than deep reasoning. Best fit?","opts":[{"j":"品質最大化のため、すべてに最も高性能で高コストなモデルを使う","e":"Use the most capable, highest-cost model for every reply"},{"j":"単純で大量な作業に適した、より高速・低コストなモデルを使う","e":"Use a faster, lower-cost model suited to straightforward, high-volume tasks"},{"j":"コスト削減のためすべての製品機能を無効化する","e":"Disable all product features to reduce cost"},{"j":"別の AI プラットフォームに切り替える","e":"Switch to a different AI platform"}],"ci":1,"ex":"<b>公式サンプル問題（試験ガイド §8 Sample 2）。</b>モデル選択をタスク要件に合わせるとは、単純・大量の作業に高速で低コストなモデルを充て、最も高性能なモデルは複雑な推論のために取っておくこと。常に最上位モデルを使うこと（A）はコストとレイテンシの予算を浪費する。C・D はトレードオフに対処していない。"},
{"sub":"D3","sj":"「主要3社の直近の価格改定と、その背景にある業界動向を、社内資料と Web の両方から調べて報告してほしい」という依頼に最も適した機能は。","se":"A request to research three competitors' recent pricing changes across both internal documents and the web. Best feature?","opts":[{"j":"通常のチャットで質問を繰り返す","e":"Repeated questions in a normal chat"},{"j":"Research","e":"Research"},{"j":"Web 検索のみ","e":"Web search only"},{"j":"Extended thinking のみ","e":"Extended thinking only"}],"ci":1,"ex":"公式ヘルプの基準では、Research は<b>5回以上のツール呼び出し</b>を伴い複数ソースを統合する調査に適する。Web 検索は1〜2回で済む事実確認向け、Extended thinking は Web データが不要な複雑推論向け。"},
{"sub":"D3","sj":"「先週発表された新法の施行日はいつか」を確認したい。最も適した機能は。","se":"You need to confirm the effective date of a law announced last week. Best feature?","opts":[{"j":"Research を実行する","e":"Run Research"},{"j":"Web 検索","e":"Web search"},{"j":"Extended thinking","e":"Extended thinking"},{"j":"Project のナレッジベースを検索する","e":"Search the Project knowledge base"}],"ci":1,"ex":"1〜2回のツール呼び出しで確認できる<b>単純な事実確認</b>には Web 検索が適する。A は数分を要し過剰。C は最新の Web 情報を必要とする問いに向かない。D は先週の情報がナレッジベースにあるとは限らない。"},
{"sub":"D3","sj":"モデル階層の使い分けとして、公式ドキュメントのコスト最適化指針に沿うものは。","se":"Which matches the official cost-optimization guidance on model tiers?","opts":[{"j":"すべての業務で最上位モデルを使う","e":"Use the top model for everything"},{"j":"単純な作業には Haiku、多くの本番ワークロードには Sonnet、最も複雑な推論には Opus","e":"Haiku for simple tasks, Sonnet for most production workloads, Opus for the most complex reasoning"},{"j":"コストを最優先し、すべて最安のモデルで処理する","e":"Prioritize cost and run everything on the cheapest model"},{"j":"モデルは固定し、プロンプトだけで品質を調整する","e":"Fix the model and tune quality through prompts alone"}],"ci":1,"ex":"公式の指針は「Choose Haiku for simple tasks, Sonnet for most production workloads, and Opus for the most complex reasoning」。A はコストとレイテンシの浪費、C は誤りのコストが高い作業で品質を落とす。"},
{"sub":"D3","sj":"四半期ごとに同じ8本の規程を参照して資料を作っている。毎回 PDF を添付し、同じ書式指定を貼り直している。最も適切な改善は。","se":"Every quarter you attach the same eight policy PDFs and re-paste the same formatting instructions. Best improvement?","opts":[{"j":"より長いコンテキストを扱えるモデルへ切り替える","e":"Switch to a model with a longer context window"},{"j":"Project を作り、規程をナレッジベースに、書式指定をカスタム指示に置く","e":"Create a Project with the policies as knowledge and the formatting as custom instructions"},{"j":"過去のチャットを検索して前回の続きから再開する","e":"Search past chats and continue from last time"},{"j":"PDF を1ファイルに結合してから添付する","e":"Merge the PDFs into one file before attaching"}],"ci":1,"ex":"「毎回同じものを渡している」は <b>persist</b> の合図。Project は独立したナレッジベースとカスタム指示を持ち、以後のすべてのチャットで参照される。A はコンテキスト長の問題ではない。D は添付の手間をわずかに減らすだけ。"},
{"sub":"D3","sj":"長時間続いた会話で、Claude が前半で合意した用語定義を無視し始めた。最も適切な対処は。","se":"In a long conversation, Claude starts ignoring terminology agreed earlier. Best response?","opts":[{"j":"同じ会話で「前半の定義を守って」と繰り返す","e":"Repeat \"follow the earlier definitions\" in the same chat"},{"j":"決定事項を要約させ、その要約を持って新しい会話を始める","e":"Have it summarize decisions, then start a new conversation with that summary"},{"j":"より高性能なモデルに切り替えて同じ会話を続ける","e":"Switch to a more capable model and continue"},{"j":"用語定義を毎回のメッセージ末尾に貼り付ける","e":"Paste the definitions at the end of every message"}],"ci":1,"ex":"試験ガイドが挙げる <b>summarize → restart</b> の組み合わせがこの症状の定石。A は状況を維持したまま指示を足すだけ。C はモデルを変えても会話の肥大という原因が残る。D は手作業が増え、恒久化するなら Project 設定に置くべき。"},
{"sub":"D3","sj":"Claude のメモリ機能に関する説明として正しいものを<b>2つ</b>選べ。","se":"Which two statements about Claude's memory are correct? Select two.","opts":[{"j":"会話終了後に全体を要約する形で保存される","e":"It saves a summary of each conversation after it ends"},{"j":"チャット中にトピック単位で保存される","e":"It saves individual topics as you chat"},{"j":"各プロジェクトは独立したメモリ空間を持つ","e":"Each project has its own separate memory space"},{"j":"一度有効にすると無効化できない","e":"Once enabled it cannot be disabled"}],"ci":[1,2],"ex":"公式ヘルプによれば、メモリは会話終了後の要約ではなく<b>チャット中にトピック単位</b>で保存され、<b>各プロジェクトが独立したメモリ空間</b>を持つ。Settings &gt; Memory から無効化できる。"}
,

/* ---------- D4 ワークフロー統合とソリューション設計（16%） ---------- */
{"sub":"D4","sj":"問い合わせ対応チームの改善提案を経営層に行う。現状は担当者が過去案件を手作業で探し、返信を起草している。最も適切な提案は。","se":"Proposing an improvement for a support team that manually searches past cases and drafts replies. Best proposal?","opts":[{"j":"全案件の返信を自動生成して即時送信し、対応時間をゼロにする","e":"Auto-generate and send every reply instantly to eliminate handling time"},{"j":"起草までを Claude が担い、送信前に担当者が確認する運用を1チームで試行し、効果を測る","e":"Have Claude draft and a human review before sending; pilot with one team and measure"},{"j":"API を使った自動応答システムをアソシエイト自身が構築する","e":"Build an API-based auto-response system yourself"},{"j":"まず全社に展開し、問題が出た部署から調整する","e":"Roll out company-wide first, then adjust where problems appear"}],"ci":1,"ex":"B は<b>人間の関門</b>を設計に含み、効果を測れる範囲で試行している。A は検証工程を消している。C は API を用いたシステム構築で、試験ガイドが Architect / Developer の領域として明示的にアソシエイトの範囲外としている。D は測定なしの全社展開で影響範囲が最大。"},
{"sub":"D4","sj":"法務から「誤った内容が顧客に届いたらどうするのか」と問われた。最も適切な応答は。","se":"Legal asks what happens if incorrect content reaches a customer. Best response?","opts":[{"j":"最新モデルは精度が高いので実務上問題は起きないと説明する","e":"Explain that the latest model is accurate enough that this will not happen"},{"j":"Claude に確信度を出力させ、低い場合のみ人が確認する仕組みを説明する","e":"Describe a design where humans check only low-confidence outputs"},{"j":"誤りが起こりうる前提を認め、外部送付前の検証手順と高リスク領域での有資格者レビューを含む運用設計を示す","e":"Acknowledge that errors are possible and present the verification workflow and qualified review for high-risk areas"},{"j":"顧客向け文書には利用しない方針とし、社内限定にすると答える","e":"Restrict usage to internal documents only"}],"ci":2,"ex":"試験ガイドは「価値<b>と限界</b>を関係者に伝える」ことを達成項目としている。A は限界を否認。B は自己申告の確信度に依存する設計で信頼できない。D は検証手順を設ければ実施できる場面まで諦めている。"},
{"sub":"D4","sj":"ワークフローに Claude を組み込む設計で、必ず決めておくべき事項として適切なものを<b>2つ</b>選べ。","se":"When integrating Claude into a workflow, which two must be decided up front? Select two.","opts":[{"j":"どの条件で人間のレビューに回すか","e":"Under what conditions output goes to human review"},{"j":"使用するモデルの内部アーキテクチャ","e":"The internal architecture of the model"},{"j":"成果物の保存先と利用者","e":"Where deliverables are stored and who uses them"},{"j":"モデルの学習データの構成","e":"The composition of the model's training data"}],"ci":[0,2],"ex":"統合設計で決めるのは<b>入口・関門（人間のレビュー）・出口・記録・限界の扱い</b>。B と D はモデル内部の話でアソシエイトの範囲外であり、運用設計にも影響しない。"},
{"sub":"D4","sj":"業務プロセス改善で Claude の適用先を検討するとき、最初に行うべきことは。","se":"When looking for where to apply Claude in a process, what comes first?","opts":[{"j":"利用可能な機能の一覧を作り、使えそうな場所を探す","e":"List available features and look for places to use them"},{"j":"現状の手順・所要時間・待ち時間を書き出し、ボトルネックを特定する","e":"Map the current steps, durations, and wait times, and identify the bottleneck"},{"j":"最も時間がかかっている工程を自動化する","e":"Automate the step that takes the longest"},{"j":"他社の導入事例に合わせて設計する","e":"Copy another company's implementation"}],"ci":1,"ex":"出発点は<b>業務側の困りごと</b>であり機能一覧ではない（A は手段先行）。C は「時間がかかる工程」と「後工程を待たせている工程」の区別を欠き、局所最適化に終わる。D は自社の制約を無視している。"},
{"sub":"D4","sj":"ある定型作業を Claude で自動化する案が出た。適用の可否を判断するうえで最も重要な観点は。","se":"A routine task is proposed for automation with Claude. Most important criterion?","opts":[{"j":"作業の実施頻度が高いこと","e":"The task is performed frequently"},{"j":"出力の妥当性を人が判定できること","e":"A human can judge whether the output is valid"},{"j":"担当者が AI に前向きであること","e":"The staff are positive about AI"},{"j":"作業がテキスト中心であること","e":"The task is text-centric"}],"ci":1,"ex":"誰も正誤を判定できない領域では、検証が成立せず責任も持てない。頻度（A）とテキスト中心（D）は適性を高める要因だが、<b>検証可能性</b>が欠けると他が揃っていても適用すべきでない。"},
{"sub":"D4","sj":"社内の CRM と連携して、問い合わせ内容に応じて自動でチケットを起票する仕組みを作りたいと相談された。アソシエイトとして最も適切な対応は。","se":"You are asked to build a CRM integration that auto-creates tickets. Most appropriate action as an Associate?","opts":[{"j":"自分で API 連携を実装する","e":"Implement the API integration yourself"},{"j":"要件とユースケースを整理したうえで、Architect / Developer へエスカレーションする","e":"Clarify requirements and use cases, then escalate to an Architect or Developer"},{"j":"実現できないと回答する","e":"Reply that it cannot be done"},{"j":"チャットで手作業のまま運用するよう提案する","e":"Propose keeping the manual workflow in chat"}],"ci":1,"ex":"試験ガイドはアソシエイトの職務として「より複雑・技術的な実装のエスカレーション」を明記しており、API に対する開発は Architect / Developer の範囲としている。ただし<b>要件とユースケースの整理はアソシエイトの仕事</b>なので、B が正解。C は不正確、D は要望を検討せず却下している。"},
{"sub":"D4","sj":"導入した Claude ワークフローを他部署へ展開するとき、引き継ぐべき成果物として最も重要でないものは。","se":"When transferring a Claude workflow to another team, which is LEAST important to hand over?","opts":[{"j":"Project のカスタム指示とナレッジベース","e":"The Project's custom instructions and knowledge base"},{"j":"標準プロンプトと入出力例","e":"The standard prompt with input/output examples"},{"j":"検証手順とエスカレーション基準","e":"The verification procedure and escalation criteria"},{"j":"導入時に検討して却下した代替案の一覧","e":"The list of alternatives considered and rejected"}],"ci":3,"ex":"他人が回せる状態にするには<b>設定・標準プロンプト・検証手順・エスカレーション基準</b>の4点が要る。D は経緯の記録として価値はあるが、運用の再現には必須ではない。"},
{"sub":"D4","sj":"情報システム部門への説明で、コネクタについて必ず伝えるべき事実は。","se":"When briefing IT about connectors, which fact must be conveyed?","opts":[{"j":"コネクタは接続先サービスの権限をユーザーごとに継承する","e":"Connectors inherit each user's permissions from the connected service"},{"j":"コネクタを有効化すると全社員が同じ範囲を参照できる","e":"Enabling a connector gives all employees the same access scope"},{"j":"コネクタ経由のデータは Claude の設定画面で個別に権限指定する","e":"Connector access scope is configured per folder in Claude's settings"},{"j":"コネクタは Enterprise プラン専用である","e":"Connectors are Enterprise-only"}],"ci":0,"ex":"公式ヘルプは「Claude inherits each person's permissions from the connected service」と明記している。<b>権限の境界は接続先サービス側</b>にあり、Claude 側でフォルダ単位に指定する仕組みではない。Web コネクタは全ユーザーが利用できる。"},
{"sub":"D4","sj":"現場担当者への説明で伝えるべき「限界」として最も適切なのは。","se":"Explaining limitations to frontline staff, which point matters most?","opts":[{"j":"モデルの学習データが公開されていないこと","e":"The training data is not public"},{"j":"確認は依然として人の仕事であり、丸投げはできないこと","e":"Verification remains a human responsibility; you cannot hand it off entirely"},{"j":"利用料金が従量課金であること","e":"Usage is billed by consumption"},{"j":"英語のほうが精度が高い場合があること","e":"Accuracy can be higher in English"}],"ci":1,"ex":"現場が知りたいのは<b>自分の仕事がどう変わるか</b>。検証責任が残ることを伝えないと、無検証の出力が流れる運用になる。A・C は現場の日常判断に影響しない。"},

/* ---------- D5 設定とナレッジ管理（12%） ---------- */
{"sub":"D5","sj":"Google Drive コネクタを有効にしたところ「他部署の機密ファイルまで読めるのでは」と懸念が出た。正しい説明は。","se":"After enabling the Google Drive connector, a member worries Claude can read other teams' confidential files. Correct explanation?","opts":[{"j":"ドライブ全体を読めるため利用を停止すべきである","e":"It can read the whole drive, so usage should stop"},{"j":"各ユーザーが接続先で持つ権限を継承するため、本人が元々アクセスできないファイルには到達できない","e":"It inherits each user's permissions, so it cannot reach files the person cannot access"},{"j":"プロンプトで「他部署のファイルは見ないで」と指示すれば防げる","e":"Instructing it not to look at other teams' files prevents this"},{"j":"Claude の設定画面で参照可能なフォルダを個別指定する必要がある","e":"You must specify accessible folders in Claude's settings"}],"ci":1,"ex":"権限の境界は<b>接続先サービス側</b>にある。C はプロンプトによる依頼であり、アクセス制御の仕組みではない。統制したい場合は接続先の権限設計、または Team / Enterprise オーナーによる組織全体のアクション制限を用いる。"},
{"sub":"D5","sj":"経費精算規程の Project で、Claude が廃止済みの上限額を回答した。ナレッジベースには 2024 年版と 2026 年版の両方がある。最も適切な対処は。","se":"A Project answers with an obsolete expense cap. Both the 2024 and 2026 versions are in the knowledge base. Best fix?","opts":[{"j":"カスタム指示に「最新の規程を参照すること」と追記する","e":"Add \"refer to the latest policy\" to the custom instructions"},{"j":"2024 年版を削除し、資料名に版と発効日を含める運用にする","e":"Delete the 2024 version and include version and effective date in file names"},{"j":"回答のたびに参照した版を確認する手順を担当者に周知する","e":"Tell staff to check which version was used each time"},{"j":"より高性能なモデルに切り替える","e":"Switch to a more capable model"}],"ci":1,"ex":"原因は<b>旧版の残存</b>＝版管理の欠如。B は原因を取り除き再発防止まで含む。A は指示による緩和にすぎず、両版がある限り誤参照の余地が残る。C は人手の確認を増やすだけ。D は能力の問題ではない。"},
{"sub":"D5","sj":"Projects に関する説明として正しいものを<b>2つ</b>選べ。","se":"Which two statements about Projects are correct? Select two.","opts":[{"j":"無料プランでは作成できるプロジェクト数に上限がある","e":"Free plans have a cap on the number of projects"},{"j":"プロジェクトの共有は全プランで利用できる","e":"Project sharing is available on all plans"},{"j":"プロジェクトの共有は Team / Enterprise プランで利用できる","e":"Project sharing is available on Team and Enterprise plans"},{"j":"カスタム指示はチャットごとに毎回設定する必要がある","e":"Custom instructions must be set for each chat"}],"ci":[0,2],"ex":"公式ヘルプによれば、無料ユーザーは<b>最大5プロジェクト</b>まで作成でき、共有は <b>Team / Enterprise 限定</b>（閲覧のみ／編集可を指定可能）。カスタム指示はプロジェクト単位の設定で、全チャットに適用される。"},
{"sub":"D5","sj":"Project のカスタム指示に書くべき内容として最も適切なのは。","se":"What belongs in a Project's custom instructions?","opts":[{"j":"今回の依頼に固有の背景情報","e":"Background specific to this one request"},{"j":"すべてのチャットで常に真である役割・読者・書式・根拠の範囲","e":"Role, audience, format, and evidence scope that always hold"},{"j":"過去に出力された成果物の全文","e":"The full text of past deliverables"},{"j":"参照する資料のファイル名一覧","e":"A list of the knowledge file names"}],"ci":1,"ex":"カスタム指示は「毎回のプロンプトの前に置かれる文」であり、<b>常に真であること</b>だけを書く。A は一回限りの情報でプロンプト側に書く。C はナレッジベースの役割。D は Claude が自動的に参照するため不要。"},
{"sub":"D5","sj":"カスタム指示を書くうえで、遵守率を下げてしまう書き方は。","se":"Which style of custom instruction reduces adherence?","opts":[{"j":"検証可能な粒度で具体的に書く","e":"Write specifics that can be verified"},{"j":"「簡潔に」と「網羅的に」を優先順位なしで併記する","e":"State both \"be concise\" and \"be comprehensive\" without priority"},{"j":"根拠の範囲を明示する","e":"State the scope of allowed evidence"},{"j":"禁止事項を明記する","e":"State what must not be done"}],"ci":1,"ex":"<b>矛盾する指示</b>が同居していると、どちらが優先されるか予測できない。優先順位を明示するか、一方を削る。A・C・D はいずれも遵守率を高める書き方。"},
{"sub":"D5","sj":"ナレッジベースへのアップロードとコネクタの違いとして正しいものは。","se":"Which correctly distinguishes uploaded knowledge from connectors?","opts":[{"j":"アップロードはその時点のコピー、コネクタは接続先の生きたデータを参照する","e":"Uploads are point-in-time copies; connectors read live data from the source"},{"j":"どちらも自動的に最新状態へ更新される","e":"Both update automatically to the latest state"},{"j":"アップロードのほうが権限管理が厳密である","e":"Uploads have stricter permission control"},{"j":"コネクタは Project 内でのみ利用できる","e":"Connectors can only be used inside a Project"}],"ci":0,"ex":"アップロードは<b>手動で入れ替えないと古いまま</b>になるのに対し、コネクタは接続先の最新状態を参照する。権限はコネクタ側が接続先サービスから継承するため C も誤り。"},
{"sub":"D5","sj":"ナレッジベースと設定を更新すべきトリガーとして適切でないものは。","se":"Which is NOT a trigger for updating knowledge and configuration?","opts":[{"j":"参照している規程が改訂された","e":"A referenced policy was revised"},{"j":"同じ修正指示を2回以上出した","e":"You gave the same correction twice or more"},{"j":"担当者が交代する","e":"The owner is changing"},{"j":"一定期間、誰もエラーを報告していない","e":"Nobody has reported an error for a while"}],"ci":3,"ex":"A・B・C はいずれも更新のトリガー。D は「問題が報告されていない」だけで、旧版の残存のように<b>気づかれない誤り</b>が進行している可能性がある。無報告は更新不要の根拠にならない。"},

/* ---------- D6 ガバナンス・リスク・責任ある利用（15%） ---------- */
{"sub":"D6","sj":"顧客の氏名と口座番号を含むスプレッドシートで傾向分析をしたい。組織のポリシーは規制対象の個人データの共有を制限している。最も適切な行動は。","se":"You want trend analysis on a spreadsheet containing customer names and account numbers. Policy restricts sharing regulated personal data. Best action?","opts":[{"j":"社内分析なのでそのままアップロードする","e":"Upload the file as-is, since the analysis is internal"},{"j":"ポリシーに従い、アップロード前に個人識別情報を除去または匿名化する","e":"Remove or anonymize the personal identifiers before uploading, consistent with policy"},{"j":"アップロードしたうえで Claude に保持しないよう指示する","e":"Upload the file but instruct Claude not to retain it"},{"j":"分析を完全に取りやめる","e":"Skip the analysis entirely"}],"ci":1,"ex":"<b>公式サンプル問題（試験ガイド §8 Sample 3）。</b>データの機微性とプライバシーの保護措置を適用するとは、利用前に規制対象の識別子を秘匿または匿名化し、保護されたデータを露出させずに分析を進められるようにすること。A はポリシー違反。<b>C はモデルへの指示であり、ポリシー上の統制を満たさない。</b>匿名化すれば実施できるため D は不要。"},
{"sub":"D6","sj":"顧客向けチャットボットを Claude で構築するにあたり、「AI だと分かると利用率が下がる」として人間のオペレーター名で応答させる案が出た。評価として正しいのは。","se":"A proposal responds under a human operator name because \"users disengage if they know it's AI.\" Correct assessment?","opts":[{"j":"応答品質が十分なら表示名は運用上の裁量である","e":"If quality is adequate, the display name is an operational choice"},{"j":"初回応答でのみ AI と示せば、以降は人間名でよい","e":"Disclosing AI in the first reply is enough; a human name is fine afterwards"},{"j":"利用ポリシーに反する。消費者向けチャットボットは各セッション冒頭で AI 利用を開示する必要がある","e":"It violates the Usage Policy: consumer-facing chatbots must disclose AI at the beginning of each session"},{"j":"社内利用ではないためポリシーの適用対象外である","e":"It is external, so the policy does not apply"}],"ci":2,"ex":"利用ポリシーは、人と対話する場面で<b>結果を人間が生成したものとして提示する行為</b>を禁止し、消費者向けチャットボットに「at a minimum at the beginning of each chat session」での開示を求めている。D は誤りで、外部向けはむしろ開示義務が明確に及ぶ。"},
{"sub":"D6","sj":"高リスク用途に該当する場合に、利用ポリシーが求める要件を<b>2つ</b>選べ。","se":"Which two requirements does the Usage Policy impose on high-risk use cases? Select two.","opts":[{"j":"その分野の有資格専門家による、公開・確定前のレビュー","e":"Review by a qualified professional before dissemination or finalization"},{"j":"出力の全件を長期保管すること","e":"Long-term retention of all outputs"},{"j":"助言・判断・推奨の作成に AI を用いている旨の開示","e":"Disclosure that AI is used to help produce the advice, decision, or recommendation"},{"j":"最上位モデルの使用","e":"Use of the top-tier model"}],"ci":[0,2],"ex":"高リスク用途には <b>Human-in-the-Loop</b>（有資格専門家による事前レビュー）と<b>開示</b>の2つが課される。B・D はポリシー上の要件ではない。"},
{"sub":"D6","sj":"「モデルに指示すること」と「仕組みで統制すること」の関係について、正しい理解は。","se":"How should you view instructing the model versus enforcing controls?","opts":[{"j":"プロンプトで丁寧に指示すれば、統制の代替になる","e":"A carefully written prompt can substitute for a control"},{"j":"モデルへの指示は組織のポリシーが求める管理策の代わりにならない","e":"Instructing the model does not satisfy the control the policy requires"},{"j":"統制は不要で、出力を確認すれば足りる","e":"Controls are unnecessary if you check the output"},{"j":"モデルの指示遵守率は100%なので統制と等価である","e":"The model follows instructions 100% of the time, so it is equivalent"}],"ci":1,"ex":"公式解説の表現では「instructing the model not to retain data does not satisfy the policy control」。<b>統制はデータが Claude に届く前の段階で掛ける</b>。同じ原理は Architect 試験でも「決定論的遵守が必要なルールはプロンプトではなくフックで強制する」として問われる。"},
{"sub":"D6","sj":"規制対象データを扱うときの手順として、最初に行うべきことは。","se":"Handling regulated data, what comes first?","opts":[{"j":"データを分類し、目的に必要な最小限に絞る","e":"Classify the data and reduce it to the minimum needed"},{"j":"とりあえず投入して結果を見る","e":"Load it and see what happens"},{"j":"上長へ口頭で報告する","e":"Verbally notify your manager"},{"j":"利用を断念する","e":"Abandon the use case"}],"ci":0,"ex":"分類 → 最小化 → 匿名化、の順に進める。分析に不要な列を落とすだけで、扱うリスクの大半が消えることが多い。D は「消せるリスク」まで諦めており、試験では過剰反応として誤答になりやすい。"},
{"sub":"D6","sj":"Team / Enterprise の組織管理者がコネクタに対して行える統制として正しいものは。","se":"What can a Team/Enterprise owner control regarding connectors?","opts":[{"j":"個々のユーザーが閲覧できるファイルを Claude 側で指定する","e":"Specify which files each user can view, from within Claude"},{"j":"組織全体で、接続先サービスが取れるアクションを制限する","e":"Limit which actions a connected service can take across the organization"},{"j":"接続先サービスの権限設定を Claude から書き換える","e":"Rewrite the connected service's permissions from Claude"},{"j":"コネクタ経由のデータを学習に使うか個別に選ぶ","e":"Choose per-connector whether data is used for training"}],"ci":1,"ex":"公式ヘルプによれば、Team / Enterprise のオーナーは組織全体でコネクタを有効化し、<b>接続先サービスが取れるアクションを制限</b>できる。閲覧範囲そのものは接続先の権限に従うため A・C は誤り。"},
{"sub":"D6","sj":"利用ポリシーが禁止している行為として正しいものを<b>2つ</b>選べ。","se":"Which two are prohibited by the Usage Policy? Select two.","opts":[{"j":"人と対話する場面で、結果を人間が生成したものとして提示すること","e":"Presenting results as human-generated when communicating with people"},{"j":"社内文書の要約に利用すること","e":"Using it to summarize internal documents"},{"j":"無許可の個人データへのアクセスやなりすまし","e":"Unauthorized access to personal data, or impersonation"},{"j":"複数のモデル階層を使い分けること","e":"Using different model tiers for different tasks"}],"ci":[0,2],"ex":"「プライバシーと身元」カテゴリには、無許可の個人データアクセス、なりすまし、<b>結果を人間が生成したものとして提示する行為</b>が含まれる。B・D は通常の業務利用であり禁止事項ではない。"},
{"sub":"D6","sj":"組織の AI ポリシーと Anthropic の利用ポリシーの関係として正しいのは。","se":"How do your organization's AI policy and Anthropic's Usage Policy relate?","opts":[{"j":"Anthropic の利用ポリシーのみ守ればよい","e":"Only Anthropic's Usage Policy needs to be followed"},{"j":"両方を満たす必要があり、より厳しいほうが適用される","e":"Both must be satisfied; the stricter one governs"},{"j":"組織のポリシーが Anthropic のポリシーを上書きできる","e":"The organization's policy can override Anthropic's"},{"j":"両者は同じ内容なので区別は不要である","e":"They are identical, so no distinction is needed"}],"ci":1,"ex":"サービス提供者側の規範と利用者側の規範は<b>二層</b>で、両方を満たす必要がある。組織側は Anthropic が許容する範囲をさらに狭めることはできても、広げることはできない。"},
{"sub":"D6","sj":"採用選考の支援で Claude を使う際、公平性の観点から最も重要な確認は。","se":"Using Claude to support hiring, what fairness check matters most?","opts":[{"j":"出力の文体が統一されているか","e":"Whether the writing style is consistent"},{"j":"出力が特定の属性に不利に働いていないか","e":"Whether the output disadvantages particular attributes"},{"j":"処理速度が十分か","e":"Whether throughput is sufficient"},{"j":"コストが予算内か","e":"Whether cost is within budget"}],"ci":1,"ex":"採用・与信・評価は、出力の偏りが個人に直接不利益を与える領域。<b>バイアス検査</b>（D2）が必須になる。A・C・D は品質や運用の指標であり公平性の確認ではない。"},

/* ---------- D7 トラブルシューティングと最適化（10%） ---------- */
{"sub":"D7","sj":"当初は的確だった Project の出力が、追記を重ねたカスタム指示のもとで指示を守らなくなった。最も適切な対処は。","se":"A Project's output degraded after custom instructions were repeatedly appended. Best fix?","opts":[{"j":"守られていない指示をより強い表現で再度追記する","e":"Re-append the ignored instruction in stronger wording"},{"j":"カスタム指示を点検し、矛盾や重複を整理して短くする","e":"Audit the instructions, resolve conflicts and duplication, and shorten"},{"j":"上位のモデル階層に切り替える","e":"Switch to a higher model tier"},{"j":"指示を毎回のプロンプト末尾にも貼り付ける","e":"Also paste the instructions at the end of every prompt"}],"ci":1,"ex":"原因は<b>指示の肥大化と矛盾</b>。長い指示ほど遵守率が下がるため、対処は「足す」ではなく「整理する」。A と D は量を増やす方向で症状を悪化させる。C は能力の問題ではない。"},
{"sub":"D7","sj":"同じ Project を使う3人のうち1人だけ質の高い出力を得ている。ナレッジベースとカスタム指示は共通である。最も適切な改善策は。","se":"Three people share a Project but only one gets high-quality output. Knowledge and instructions are identical. Best improvement?","opts":[{"j":"質の低い2人に高性能なモデルを使うよう指示する","e":"Tell the other two to use a more capable model"},{"j":"質の高い担当者のプロンプトを標準化し、入出力例とともに共有する","e":"Standardize the strong performer's prompt and share it with input/output examples"},{"j":"3人それぞれに別の Project を作らせる","e":"Have each person create their own Project"},{"j":"出力を相互レビューする運用を追加する","e":"Add a peer-review step"}],"ci":1,"ex":"設定が共通で結果が違うのだから、差は<b>プロンプトの属人性</b>にある。B はその差を標準化し、入出力例という最も伝わる形で共有している。D は人手を足すだけで原因を放置している。"},
{"sub":"D7","sj":"出力品質の問題を診断するとき、最初に確認すべき3点として適切でないものは。","se":"Diagnosing an output-quality problem, which is NOT one of the first things to check?","opts":[{"j":"与えた資料が最新版か、必要な範囲が入っているか","e":"Whether the source material is current and complete"},{"j":"指示に曖昧な形容詞や矛盾が残っていないか","e":"Whether the instructions contain vague adjectives or conflicts"},{"j":"会話が長引いて前の前提を引きずっていないか","e":"Whether the conversation has grown long and is carrying stale premises"},{"j":"モデルの学習データに当該分野が含まれているか","e":"Whether the model's training data covers the domain"}],"ci":3,"ex":"診断の起点は<b>入力・指示・状態</b>の3点。D はアソシエイトが確認できず、実務上の打ち手にもつながらない。"},
{"sub":"D7","sj":"新しい会話で同じプロンプトを試したところ問題が再現しなかった。この結果から言えることは。","se":"The problem does not reproduce in a fresh conversation with the same prompt. What does this indicate?","opts":[{"j":"プロンプトの記述に原因がある","e":"The prompt wording is the cause"},{"j":"元の会話の状態（肥大化・古い前提）に原因がある可能性が高い","e":"The original conversation's state is likely the cause"},{"j":"モデルの性能が不安定である","e":"The model is unstable"},{"j":"ナレッジベースの資料が古い","e":"The knowledge base is out of date"}],"ci":1,"ex":"新しい会話で再現しないなら、プロンプトやナレッジベースは共通なので<b>会話の状態</b>が変数として残る。これは原因の切り分けとして最も基本的な手法。"},
{"sub":"D7","sj":"ワークフローの最適化にあたり、効率化の対象としてはならない工程を<b>2つ</b>選べ。","se":"Which two steps must NOT be optimized away? Select two.","opts":[{"j":"外部提出前の検証工程","e":"Verification before external delivery"},{"j":"入力資料の整形作業","e":"Formatting of input material"},{"j":"高リスク領域における有資格者のレビュー","e":"Qualified professional review in high-risk domains"},{"j":"参照資料の添付作業","e":"Attaching reference documents"}],"ci":[0,2],"ex":"検証工程（D2）と高リスク領域における有資格者レビュー（D6）は<b>効率化の対象外</b>。B・D はむしろ Project 設定へ移すことで削減すべき作業である。"},
{"sub":"D7","sj":"改善策を実施したあと、効果を正しく判定するために必要なことは。","se":"After applying a fix, what is required to judge its effect correctly?","opts":[{"j":"新しい入力で試し、汎用性を確認する","e":"Try a new input to confirm generality"},{"j":"変更前と同じ入力で比較する","e":"Compare against the same input used before"},{"j":"複数の改善を同時に適用して総合効果を見る","e":"Apply several fixes at once and look at the total effect"},{"j":"担当者の主観的な印象を集める","e":"Collect subjective impressions from staff"}],"ci":1,"ex":"入力が変われば、改善したのか入力が易しかったのか区別できない。<b>検証用の入力を固定</b>し、変更は一度に一つだけにする。C は何が効いたか判定できなくなる。"}
];

/* ============================================================
   CCAO-F クイズエンジン
   Architect 版（4択1正解のみ）を拡張し、本試験と同じ
   複数回答（multiple-response）形式に対応する。
   本試験は部分点の有無を公表していないため、採点は全一致のみ正解とする。
   ============================================================ */
const $=id=>document.getElementById(id);
const LET='ABCD';
const SUBLBL={D1:'D1 プロンプト',D2:'D2 出力評価',D3:'D3 製品/モデル',D4:'D4 ワークフロー',D5:'D5 設定/知識',D6:'D6 ガバナンス',D7:'D7 改善/最適化'};
const SUBS=['D1','D2','D3','D4','D5','D6','D7'];
let cat='all',count=10,mode='learn',shuf=true,pool=[],idx=0,ans=[],graded=[],started=false;

/* ---------- 設問ヘルパ ---------- */
const isMulti=q=>Array.isArray(q.ci);
const needN=q=>isMulti(q)?q.ci.length:1;
function correctSet(q){return isMulti(q)?q.ci.slice().sort((a,b)=>a-b):[q.ci];}
function pickedArr(a){if(a==null)return[];return Array.isArray(a)?a.slice().sort((x,y)=>x-y):[a];}
function isAnswered(q,a){if(a==null)return false;return pickedArr(a).length===needN(q);}
function isCorrect(q,a){
  if(!isAnswered(q,a))return false;
  const p=pickedArr(a),c=correctSet(q);
  return p.length===c.length&&p.every((v,i)=>v===c[i]);
}
function letters(list){return list.map(i=>LET[i]).join('・');}

/* ---------- 出題範囲 ---------- */
function catsList(){
  const list=[{id:'all',label:'全体'},{id:'single',label:'単一選択'},{id:'multi',label:'複数回答'}];
  SUBS.forEach(s=>list.push({id:s,label:SUBLBL[s]}));
  return list;
}
function filterCat(c){
  if(c==='all')return QUESTIONS.slice();
  if(c==='single')return QUESTIONS.filter(q=>!isMulti(q));
  if(c==='multi')return QUESTIONS.filter(q=>isMulti(q));
  return QUESTIONS.filter(q=>q.sub===c);
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* ---------- 設定画面 ---------- */
function buildSetup(){
  const co=$('catOpts');co.innerHTML='';
  catsList().forEach(c=>{const n=filterCat(c.id).length;
    const b=document.createElement('button');b.className='pill'+(c.id===cat?' on':'');
    b.type='button';
    b.innerHTML=c.label+'<span class="ct">'+n+'</span>';
    b.onclick=()=>{cat=c.id;buildSetup();};co.appendChild(b);});
  renderCount();updateMeta();
}
function renderCount(){
  const max=filterCat(cat).length;const seg=$('countSeg');seg.innerHTML='';
  let opts=[10,20,30].filter(v=>v<max);opts.push(max);
  opts=[...new Set(opts)];
  if(!opts.includes(count))count=opts.includes(10)?10:opts[opts.length-1];
  opts.forEach(v=>{const b=document.createElement('button');b.type='button';
    b.textContent=(v===max?('全部 '+v):v)+'問';b.className=(v===count?'on':'');
    b.onclick=()=>{count=v;renderCount();updateMeta();};seg.appendChild(b);});
}
function updateMeta(){
  const src=filterCat(cat);const max=src.length;const n=Math.min(count,max);
  const nm=src.filter(isMulti).length;
  $('startMeta').textContent=`${n}問・${mode==='learn'?'学習モード':'試験モード'}・${shuf?'シャッフル':'順番どおり'}（この範囲の複数回答問題：${nm}問）`;
}

$('modeSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;mode=b.dataset.m;
  [...$('modeSeg').children].forEach(x=>x.classList.toggle('on',x===b));updateMeta();};
$('shufSeg').onclick=e=>{const b=e.target.closest('button');if(!b)return;shuf=b.dataset.s==='1';
  [...$('shufSeg').children].forEach(x=>x.classList.toggle('on',x===b));updateMeta();};

function show(id){['setup','quiz','result'].forEach(s=>$(s).classList.toggle('active',s===id));
  $('toSetupTop').hidden=(id==='setup');window.scrollTo(0,0);}

/* ---------- 出題 ---------- */
function start(src){
  pool=src?src.slice():filterCat(cat).slice();
  if(shuf)shuffle(pool);
  if(!src)pool=pool.slice(0,Math.min(count,pool.length));
  ans=Array(pool.length).fill(null);graded=Array(pool.length).fill(false);idx=0;started=true;
  $('qTotal').textContent=pool.length;show('quiz');render();
}
$('startBtn').onclick=()=>start(null);

function render(){
  const q=pool[idx],a=ans[idx];
  const multi=isMulti(q),n=needN(q);
  const picked=pickedArr(a);
  const answered=isAnswered(q,a);
  const reveal=(mode==='learn'&&graded[idx]);

  $('qNum').textContent=idx+1;
  $('qProg').style.width=(idx/pool.length*100)+'%';
  $('bar').style.width=(idx/pool.length*100)+'%';
  $('qMeta').innerHTML=(SUBLBL[q.sub]||q.sub)
    +' · '+(multi?'<b style="color:var(--amber)">複数回答：'+n+'つ選択</b>':'単一選択');
  $('qStem').innerHTML=q.sj+(q.se?'<span class="en">'+q.se+'</span>':'');

  $('qChoices').innerHTML=q.opts.map((o,i)=>{
    let cls='choice';
    if(reveal){cls+=' lock';
      if(correctSet(q).includes(i))cls+=' correct';
      else if(picked.includes(i))cls+=' wrong';
    }else if(picked.includes(i))cls+=' sel';
    return `<button type="button" class="${cls}" data-i="${i}"><span class="lt">${LET[i]}</span><span>${o.j}${o.e?`<span class="cen">${o.e}</span>`:''}</span></button>`;
  }).join('');
  [...$('qChoices').children].forEach(b=>b.onclick=()=>choose(+b.dataset.i));

  const rv=$('qReveal');
  if(reveal){
    const ok=isCorrect(q,a);
    rv.className='reveal show '+(ok?'ok':'ng');
    rv.innerHTML=`<div class="rh">${ok?'✓ 正解':'✕ 不正解（正解: '+letters(correctSet(q))+'）'}</div><div class="rx">${q.ex}</div>`;
  }else if(multi){
    rv.className='reveal show';
    rv.innerHTML=`<div class="rx" style="color:var(--ink3)">${n}つ選んでください（現在 ${picked.length} / ${n}）。選んだ項目をもう一度押すと解除できます。</div>`
      +(answered&&mode==='learn'?'<button type="button" id="gradeBtn" class="gradebtn">この解答で採点する</button>':'');
    const gb=document.getElementById('gradeBtn');
    if(gb)gb.onclick=gradeCurrent;
  }else{rv.className='reveal';rv.innerHTML='';}

  $('qScore').textContent=(mode==='learn')?('正解 '+pool.filter((qq,i)=>graded[i]&&isCorrect(qq,ans[i])).length):'';
  $('prevBtn').disabled=(idx===0);
  $('nextBtn').textContent=(idx===pool.length-1)?(mode==='exam'?'採点する':'結果を見る'):'次へ →';
}

function choose(i){
  const q=pool[idx];
  if(mode==='learn'&&graded[idx])return;              /* 採点後はロック */
  if(!isMulti(q)){
    ans[idx]=i;
    if(mode==='learn')graded[idx]=true;               /* 単一選択は選んだ時点で採点 */
    render();return;
  }
  /* 複数回答は「採点する」を押すまで選び直せる（誤クリックで確定しない） */
  const cur=pickedArr(ans[idx]);
  const at=cur.indexOf(i);
  if(at>=0)cur.splice(at,1);
  else{if(cur.length>=needN(q))return;cur.push(i);}
  ans[idx]=cur.slice().sort((a,b)=>a-b);
  render();
}
function gradeCurrent(){
  const q=pool[idx];
  if(!isAnswered(q,ans[idx]))return;
  graded[idx]=true;render();
}

$('nextBtn').onclick=()=>{if(idx<pool.length-1){idx++;render();}else finish();};
$('prevBtn').onclick=()=>{if(idx>0){idx--;render();}};

/* ---------- 採点 ---------- */
function finish(){
  const correct=pool.filter((q,i)=>isCorrect(q,ans[i])).length;
  const total=pool.length,pct=Math.round(correct/total*100);
  $('resMode').textContent=(mode==='learn'?'学習モード':'試験モード')+' · RESULT';
  $('resFrac').textContent=correct+' / '+total+' 問 正解';
  $('ringPct').textContent=pct+'%';
  const C=414.7;$('ring').style.stroke=pct>=72?'var(--emerald)':pct>=50?'var(--amber)':'var(--rose)';
  setTimeout(()=>{$('ring').style.strokeDashoffset=C*(1-pct/100);},60);
  let head,tip;
  if(pct>=90){head='素晴らしい';tip='この教材の範囲では十分な理解に達しています。ただし本試験の予測ではありません。間違えた論点だけ最終確認しましょう。';}
  else if(pct>=72){head='合格ラインに到達';tip='本試験の合格基準は 1000 点満点で 720 点。ただしスケールドスコアであり、正答率そのものではない点に注意してください。';}
  else if(pct>=50){head='もう一歩';tip='間違えた問題の「症状と対処の対応」を Textbook で確認しましょう。とくに D2（出力評価）と D6（ガバナンス）は配点合計 36% です。';}
  else{head='基礎を固めましょう';tip='Textbook の該当ドメインに戻り、「試験エッセンス」の判断軸を確認してから再挑戦してください。';}
  $('resHead').textContent=head;$('resTip').textContent=tip;

  const wrong=pool.map((q,i)=>({q,a:ans[i]})).filter(x=>!isCorrect(x.q,x.a));
  const rw=$('reviewWrap');
  if(wrong.length){rw.style.display='block';
    $('reviewList').innerHTML=wrong.map(x=>{
      const p=pickedArr(x.a);
      const you=p.length?p.map(i=>LET[i]+'. '+x.q.opts[i].j).join('<br>'):'未回答';
      const cs=correctSet(x.q);
      const ok=cs.map(i=>LET[i]+'. '+x.q.opts[i].j).join('<br>');
      return `<div class="rev"><div class="rq">${isMulti(x.q)?'<span style="color:var(--amber);font-size:11px">［複数回答］</span> ':''}${x.q.sj}</div>
      <div class="rl"><span class="k">あなた</span><span class="ra">${you}</span></div>
      <div class="rl"><span class="k">正解</span><span class="rb">${ok}</span></div>
      <div class="rex">${x.q.ex}</div></div>`;}).join('');
  }else{rw.style.display='none';}
  $('bar').style.width='100%';show('result');
}

$('retryBtn').onclick=()=>start(pool);
$('wrongBtn').onclick=()=>{const w=pool.filter((q,i)=>!isCorrect(q,ans[i]));if(!w.length)return;start(w);};
$('toSetup').onclick=()=>{$('bar').style.width='0';show('setup');};
$('toSetupTop').onclick=()=>{$('bar').style.width='0';show('setup');};

buildSetup();
