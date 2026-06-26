"use strict";
/* MITRE ATT&CK Enterprise v19 — 全体マップ(2D)。雛形：ATLAS 2D（Deep Aurora）。 */
const DATA = window.__ATTACK_DATA__;
const TACTICS = DATA.tactics;
const MITS = DATA.mitigations;

const $ = s => document.querySelector(s);
const esc = s => (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function linkify(t){ if(t==null) return ''; let s = esc(t);
  s = s.replace(/\[([^\]]+)\]\((\/[^)]+)\)/g, (m,lbl,path)=>`<a href="https://attack.mitre.org${path}" target="_blank" rel="noopener">${lbl}</a>`);
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (m,lbl,url)=>`<a href="${url}" target="_blank" rel="noopener">${lbl}</a>`);
  return s; }
function firstSentence(t){ if(!t) return '';
  const clean = String(t).replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\s+/g,' ').trim();
  const m = clean.match(/^(.*?[。．\.])\s/); return m ? m[1] : clean.slice(0,120); }

/* 付録A：表示名正規化（マッチングは raw tc.name のまま） */
const TACDISP={TA0043:'偵察',TA0042:'リソース開発',TA0001:'初期アクセス',TA0002:'実行',TA0003:'永続化',
  TA0004:'権限昇格',TA0005:'防御回避',TA0112:'防御機能の妨害',TA0006:'認証情報アクセス',TA0007:'探索',
  TA0008:'横展開',TA0009:'収集',TA0010:'持ち出し',TA0011:'コマンド&コントロール',TA0040:'影響'};
function tacName(tc){ return TACDISP[tc.id]||tc.name; }

/* §7.1 フェーズ写像（15戦術・マップ） */
const PHASE_DEF = [
  {key:'prep', name:'準備', en:'PREPARATION', c:'var(--indigo)'},
  {key:'access', name:'侵入・アクセス', en:'ACCESS', c:'var(--sky)'},
  {key:'internal', name:'内部活動・拡大', en:'INTERNAL', c:'var(--emerald)'},
  {key:'impact', name:'目的達成', en:'IMPACT', c:'var(--amber)'}];
const PHASE_OF={TA0043:0,TA0042:0,TA0001:1,TA0002:1,TA0003:2,TA0004:2,TA0005:2,TA0112:2,
  TA0006:2,TA0007:2,TA0008:2,TA0009:2,TA0011:2,TA0010:3,TA0040:3};
function phaseOf(tc){ return PHASE_DEF[PHASE_OF[tc.id] ?? 2]; }
const PHASES = PHASE_DEF;

function tacStats(tac){ let nt=0,ns=0,withMit=0,total=0,d3=0;
  tac.techs.forEach(t=>{ if(t.type==='Technique') nt++; else ns++; total++;
    if(t.mits && t.mits.length) withMit++; if(t.d3 && t.d3.length) d3++; });
  return {nt,ns,withMit,total,d3}; }
const G = (()=>{ let tech=new Set(),sub=new Set(),mitLinks=0,d3Links=0,covered=0,total=0;
  TACTICS.forEach(tc=>tc.techs.forEach(t=>{ if(t.type==='Technique')tech.add(t.id); else sub.add(t.id);
    total++; if(t.mits.length){covered++;mitLinks+=t.mits.length;} d3Links+=t.d3.length; }));
  return {tech:tech.size,sub:sub.size,mitLinks,d3Links,covered,total,mits:MITS.length,tactics:TACTICS.length}; })();

function groupTechs(tac){ const tops=[], byParent={};
  tac.techs.forEach(t=>{ if(t.type==='Sub-Technique'){ (byParent[t.parent]=byParent[t.parent]||[]).push(t); } });
  tac.techs.forEach(t=>{ if(t.type==='Technique') tops.push({tech:t, subs:byParent[t.id]||[]}); });
  tac.techs.forEach(t=>{ if(t.type==='Sub-Technique' && !tac.techs.some(x=>x.id===t.parent) && !tops.some(o=>o.tech.id===t.id)) tops.push({tech:t, subs:[]}); });
  return tops; }

function buildStrip(){ const el = $('#tacstrip');
  el.innerHTML = TACTICS.map((tc,i)=>{ const ph=phaseOf(tc);
    return `<button class="dtab" data-tac="${i}" style="--lc:${ph.c}">
      <span class="dn" style="border-color:${ph.c};color:${ph.c}">${tc.order}</span>
      <span class="dl">${esc(tacName(tc))}</span></button>`; }).join('');
  el.querySelectorAll('.dtab').forEach(b=>b.addEventListener('click',()=>openTactic(+b.dataset.tac))); }
function markStrip(idx){ $('#tacstrip').querySelectorAll('.dtab').forEach((b,i)=>b.classList.toggle('act', i===idx)); }

function renderHome(){
  const lc = TACTICS.map((tc,i)=>{ const ph=phaseOf(tc); const st=tacStats(tc);
    return `<button class="lcstep" data-tac="${i}" style="--lc:${ph.c}">
      <div class="lcn">${esc(tc.id)} · ${ph.name}</div>
      <div class="lct">${esc(tacName(tc))}</div>
      <div class="lcid">${esc(tc.id)}</div>
      <div class="lccount"><b>${st.nt+st.ns}</b> 手法${st.withMit?` · 緩和 <b>${st.withMit}</b>`:''}</div>
    </button>`; }).join('<span class="lcarrow" style="display:flex;align-items:center;color:var(--ink4);font-family:var(--mono);flex:0 0 auto;padding:0 1px">›</span>');
  const legend = PHASES.map(p=>`<span><i class="pd" style="background:${p.c}"></i>${p.name}</span>`).join('');
  $('#view-home').innerHTML = `
  <div class="hero">
    <div class="eyebrow">MITRE ATT&CK® ENTERPRISE v19</div>
    <h1>エンタープライズを狙う攻撃手法と、その防御<span class="en">ADVERSARIAL TACTICS · TECHNIQUES · MITIGATIONS · D3FEND</span></h1>
    <p class="lead">MITRE ATT&CK は、実世界で観測された攻撃者の挙動を「戦術（目的）× テクニック（手段）」で体系化した知識ベースです。本ガイドは Enterprise v19 の全 ${G.tactics} 戦術・${G.tech} テクニック・${G.sub} サブテクニックを、対応する緩和策（Mitigation）と D3FEND 防御技術とともに日本語で参照できます。</p>
  </div>
  <div class="place">
    <div class="stat"><div class="k">TACTICS</div><div class="v">${G.tactics}<small> 戦術</small></div></div>
    <div class="stat"><div class="k">TECHNIQUES</div><div class="v">${G.tech}<small> +${G.sub} sub</small></div></div>
    <div class="stat"><div class="k">MITIGATIONS</div><div class="v">${G.mits}<small> 緩和策</small></div></div>
    <div class="stat"><div class="k">D3FEND LINKS</div><div class="v">${G.d3Links}<small> 対応</small></div></div>
  </div>
  <div class="scope"><span class="ic">▶</span><div>このガイドの<b>使い方</b>：上部タブで「<b>マトリクス</b>（全体俯瞰）」「<b>戦術別</b>（各手法の詳細と緩和策）」「<b>防御マッピング</b>（緩和策→テクニックの対応）」を切替。検索窓でテクニック名・防御策を横断検索できます。</div></div>

  <div class="sec-kicker"><span class="num">0</span><div><div class="lbl">READ FIRST · はじめに</div><h2>用語と読み方<span class="jp">Tactics・Techniques・Sub-Techniques と、防御マッピングが示すもの</span></h2></div></div>
  <p class="lead">このマップは ATT&CK を「攻撃者の目的（戦術）→ その手段（テクニック）→ 具体的な亜種（サブテクニック）」の3階層で整理し、各テクニックに防御の打ち手（Mitigation / D3FEND）を対応づけたものです。まず用語を押さえると、以降の全ビュー（マトリクス・戦術別・防御マッピング）が同じ枠組みで読めます。</p>
  <div class="intro-grid">
    <div class="idef" style="--iac:var(--sky)"><div class="ik">TACTICS / 戦術</div><h4>攻撃者の目的・段階 <small>なぜ・どの段階</small></h4><p>攻撃者が達成したい狙いを表す最上位の分類。偵察から影響まで攻撃の段階を表す。Enterprise v19 は全15戦術。</p><div class="ex">例：実行・永続化・影響 ／ ID <b>TAxxxx</b></div></div>
    <div class="idef" style="--iac:var(--indigo)"><div class="ik">TECHNIQUES / テクニック</div><h4>目的の達成手段 <small>どうやって</small></h4><p>その戦術を実現する具体的な手口。1つの戦術の下に複数ぶら下がる。</p><div class="ex">例：コマンド・スクリプトインタプリタ ／ ID <b>Txxxx</b></div></div>
    <div class="idef" style="--iac:var(--indigo)"><div class="ik">SUB-TECHNIQUES / サブテクニック</div><h4>手段の亜種・具体化 <small>どの方式で</small></h4><p>テクニックのより細かい実現方法。親テクニックIDに枝番（.001）を付けて表す。</p><div class="ex">例：PowerShell ／ ID <b>Txxxx.00n</b></div></div>
  </div>
  <div class="diagram" style="margin-top:16px"><div class="dt">階層の読み方（例）</div><div class="dd">上位＝目的、下位ほど具体的。IDの枝番で親子関係がわかる。</div>
    <div class="ichain">
      <div class="ic-step"><div class="k">TACTIC 戦術</div><div class="v">実行</div><div class="i">TA0002</div></div>
      <div class="ic-arrow">›</div>
      <div class="ic-step"><div class="k">TECHNIQUE テクニック</div><div class="v">コマンド・スクリプトインタプリタ</div><div class="i">T1059</div></div>
      <div class="ic-arrow">›</div>
      <div class="ic-step"><div class="k">SUB-TECHNIQUE サブ</div><div class="v">PowerShell</div><div class="i">T1059.001</div></div>
    </div>
  </div>
  <div class="diagram" style="margin-top:14px"><div class="dt">テクニック → 防御のマッピング（Mitigation と D3FEND）</div><div class="dd">各テクニックには「どう防ぐか」が結びついている。攻撃（赤）の理解が、そのまま防御（緑）の打ち手に変換される。</div>
    <div class="imap">
      <div class="ibox atk"><div class="bk">攻撃テクニック</div><div class="bv">T1059 ほか</div><div class="bd">攻撃者の手段</div></div>
      <div class="iarrow">対応づけ<br>→</div>
      <div class="ito">
        <div class="ibox mit"><div class="bk">🛡 Mitigation 緩和策</div><div class="bv">Mxxxx</div><div class="bd">予防・低減のための対策方針（何をすべきか）</div></div>
        <div class="ibox d3f"><div class="bk">⛨ D3FEND 防御技術</div><div class="bv">D3FEND</div><div class="bd">検知・強化・隔離・無害化などの防御機能（どの機能で対処するか）</div></div>
      </div>
    </div>
    <div class="inote"><b>この2つが示すもの：</b>あるテクニックに対し、<span class="mm">Mitigation（M…）</span>は「組織として何をすべきか（対策方針）」、<span class="dd2">D3FEND</span>は「どの防御機能で対処するか（機能分類：Harden/Detect/Isolate/Evict 等）」を表す。両者は補完関係にあり、攻撃手法ごとに“効く防御”を結びつけることで、攻撃の理解から防御の実装への橋渡しになる。マッピングが空のテクニックは「個別の緩和策が未定義＝上位の予防的統制で守る領域」を意味する。</div>
  </div>
  <div class="sec-kicker"><span class="num">1</span><div><div class="lbl">ATTACK LIFECYCLE</div><h2>攻撃ライフサイクル<span class="jp">偵察から影響まで、攻撃は15戦術で進行する（順序≠フェーズ）</span></h2></div></div>
  <p class="lead">攻撃者は「準備」から「目的達成」へと段階を進める。各戦術は到達したい目的を表し、その下に複数のテクニック（具体的手段）がぶら下がる。各カードをクリックすると、その戦術のテクニックと緩和策の詳細へ移動する。</p>
  <div class="diagram">
    <div class="dt">ATT&CK 戦術チェーン（全15戦術）</div>
    <div class="dd">フェーズ色：準備 → 侵入・アクセス → 内部活動・拡大 → 目的達成。数字は各戦術に属する手法数と、緩和策が定義された手法数。</div>
    <div class="lifecycle">${lc}</div>
    <div class="phaselegend">${legend}</div>
  </div>

  <div class="sec-kicker"><span class="num">2</span><div><div class="lbl">DEFENSE COVERAGE</div><h2>戦術ごとの緩和策カバレッジ<span class="jp">どの段階に防御策が手厚いか／手薄かを一目で把握</span></h2></div></div>
  <p class="lead">バーは各戦術内で「緩和策（Mitigation）が1つ以上定義されているテクニックの割合」。偵察・リソース開発など組織の管理外で進む段階は緩和策が手薄になりやすく、設計段階での予防的統制が重要になる。</p>
  <div class="diagram"><div class="heat">${heatRows()}</div></div>
  `;
  $('#view-home').querySelectorAll('.lcstep').forEach(b=>b.addEventListener('click',()=>openTactic(+b.dataset.tac)));
  $('#view-home').querySelectorAll('.heatrow[data-tac]').forEach(b=>b.addEventListener('click',()=>openTactic(+b.dataset.tac)));
}
function heatRows(){ return TACTICS.map((tc,i)=>{ const st=tacStats(tc); const pct = st.total? Math.round(st.withMit/st.total*100):0;
    const cls = pct>=60?'hi':pct>=30?'mid':'lo';
    return `<div class="heatrow" data-tac="${i}" style="cursor:pointer">
      <span class="hn"><span class="hi">${tc.order}</span>${esc(tacName(tc))}</span>
      <div class="heattrack"><i class="${cls}" style="width:${Math.max(pct,3)}%"></i></div>
      <span class="hp">${st.withMit}/${st.total}・${pct}%</span></div>`; }).join(''); }

function renderMatrix(){
  const cols = TACTICS.map((tc,i)=>{ const ph=phaseOf(tc); const tops=groupTechs(tc);
    const cells = tops.map(({tech,subs})=>{ const hasmit = tech.mits.length || subs.some(s=>s.mits.length);
      return `<button class="mcell ${hasmit?'hasmit':''}" data-tac="${i}" data-tech="${esc(tech.id)}" style="--mc:${ph.c}">
        <span class="mc-id">${esc(tech.id)}</span>${esc(tech.name)}
        ${subs.length?`<span class="subc">+${subs.length} sub-technique</span>`:''}</button>`; }).join('');
    return `<div class="mcol">
      <div class="mcolhead" style="--mc:${ph.c}">
        <div class="mh-n">${esc(tc.id)}</div>
        <div class="mh-t">${esc(tacName(tc))}</div>
        <div class="mh-c">${tops.length} techniques</div>
      </div>${cells}</div>`; }).join('');
  $('#view-matrix').innerHTML = `
    <div class="sec-kicker"><span class="num">▦</span><div><div class="lbl">ATT&CK MATRIX</div><h2>攻撃マトリクス<span class="jp">戦術（列）× テクニック（セル）の全体俯瞰</span></h2></div></div>
    <p class="mhint">列＝戦術（攻撃の目的）／セル＝テクニック。<b>●</b> の付いたセルは緩和策が定義済み。セルをクリックすると詳細へ。横スクロールで全15戦術を表示。</p>
    <div class="matrix">${cols}</div>`;
  $('#view-matrix').querySelectorAll('.mcell').forEach(b=>b.addEventListener('click',()=>openTactic(+b.dataset.tac, b.dataset.tech)));
}

function renderTactic(idx, focusId){
  const tc = TACTICS[idx]; const ph=phaseOf(tc); const tops=groupTechs(tc); const st=tacStats(tc);
  const nav = tops.map(({tech,subs})=>`<a href="#" data-tech="${esc(tech.id)}"><span class="n">${esc(tech.id)}</span><span>${esc(tech.name)}</span></a>`).join('');
  const cards = tops.map(({tech,subs})=>techCard(tech,subs,ph,tc.id)).join('');
  $('#view-tactic').innerHTML = `
  <div class="shell" style="--accent:${ph.c}">
    <aside class="rail">
      <span class="badge" style="color:${ph.c};border-color:${ph.c}">${esc(tc.id)}</span>
      <div class="rtitle">${esc(tacName(tc))}</div>
      <div class="rsub">${esc(tc.id)} · ${ph.name}フェーズ</div>
      <div class="rsub" style="color:var(--ink4);margin-bottom:12px">${st.nt} テクニック / ${st.ns} サブ / 緩和 ${st.withMit}</div>
      <nav class="rnav">${nav}</nav>
    </aside>
    <div class="tacmain">
      <div class="thero">
        <div class="eyebrow" style="color:${ph.c}">${esc(tc.id)}</div>
        <h1>${esc(tacName(tc))}<span class="en">${ph.en} TACTIC</span></h1>
        <p class="tacdesc">${linkify(tc.desc)}</p>
      </div>
      <div class="subhead">TECHNIQUES ／ この戦術のテクニックと緩和策（${tops.length}）</div>
      ${cards}
    </div>
  </div>`;
  $('#view-tactic').querySelectorAll('.rnav a').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault(); const id=a.dataset.tech;
    const card=$('#view-tactic').querySelector(`details[data-tech="${cssEsc(id)}"]`);
    if(card){ card.open=true; card.scrollIntoView({behavior:'smooth',block:'start'}); markRail(id); } }));
  $('#view-tactic').querySelectorAll('.tech').forEach(t=>t.style.setProperty('--accent',ph.c));
  if(focusId){ const card=$('#view-tactic').querySelector(`details[data-tech="${cssEsc(focusId)}"]`);
    if(card){ card.open=true; setTimeout(()=>{card.scrollIntoView({behavior:'smooth',block:'center'});},60); markRail(focusId); }
  } else { markRail(tops[0]?.tech.id); }
}
function cssEsc(s){ return (window.CSS&&CSS.escape)?CSS.escape(s):s.replace(/\./g,'\\.'); }
function markRail(id){ $('#view-tactic').querySelectorAll('.rnav a').forEach(a=>a.classList.toggle('active', a.dataset.tech===id)); }
function platChips(tech){ if(!tech.platforms) return '';
  return String(tech.platforms).split(/[,、]/).map(p=>p.trim()).filter(Boolean).map(p=>`<span class="chip in">${esc(p)}</span>`).join(''); }
function techCard(tech, subs, ph, tacId){
  const subBadge = subs.length? `<span class="chip sub">+${subs.length} sub</span>`:'';
  const mitBadge = tech.mits.length? `<span class="chip em">緩和 ${tech.mits.length}</span>`:'';
  const d3Badge = tech.d3.length? `<span class="chip in">D3FEND ${tech.d3.length}</span>`:'';
  const mitBlock = renderMits(tech.mits); const d3Block = renderD3(tech.d3);
  const subBlock = subs.length? `<div class="subwrap"><div class="sublbl">サブテクニック</div>${subs.map(s=>subItem(s,tacId)).join('')}</div>`:'';
  return `<details class="tech" data-tech="${esc(tech.id)}" data-name="${esc(tech.name)}">
    <summary>
      <span class="tk-id">${esc(tech.id)}</span>
      <div class="tk-main">
        <div class="tk-name">${esc(tech.name)}</div>
        <div class="tk-tease">${esc(firstSentence(tech.desc))}</div>
        <div class="tk-meta">${platChips(tech)}${subBadge}${mitBadge||'<span class="chip am">緩和策の定義なし</span>'}${d3Badge}</div>
      </div>
      <span class="tk-tw">＋</span>
    </summary>
    <div class="tk-body">
      <div class="tk-def">${linkify(tech.desc)}</div>
      <div class="xjumprow"><button class="xjump toModel" onclick="XLINK.go('models','${tech.id}')">🖼 攻撃モデル図</button><button class="xjump toStory" onclick="XLINK.go('td','${tacId}')">🛰 ストーリーで戦術を見る</button></div>
      ${subBlock}${mitBlock}${d3Block}
    </div>
  </details>`;
}
function subItem(s, tacId){ const mit = s.mits.length? renderMits(s.mits):''; const d3 = s.d3.length? renderD3(s.d3):'';
  return `<details class="subitem" data-tech="${esc(s.id)}" data-name="${esc(s.name)}">
    <summary><span class="sn">${esc(s.id)}</span><span class="snm">${esc(s.name)}</span><span class="sx">＋</span></summary>
    <div class="sbody">${linkify(s.desc)}<div class="xjumprow"><button class="xjump toModel" onclick="XLINK.go('models','${s.id}')">🖼 攻撃モデル図</button></div>${mit}${d3}</div></details>`; }
function renderMits(mits){
  if(!mits||!mits.length) return `<div class="nomit"><span class="ni">i</span><div>このテクニックには個別の緩和策（Mitigation）が紐づいていません。上位の予防的統制（最小権限・多層防御・入力検証・監視・パッチ適用）で対応します。</div></div>`;
  const rows = mits.map(m=>`<div class="mitrow">
    <div class="mr-h"><span class="mr-id">${esc(m.id)}</span><span class="mr-n">${esc(m.name)}</span></div>
    ${m.usage?`<p class="mr-u">${linkify(m.usage)}</p>`:''}
    ${m.gen?`<p class="mr-g">${linkify(m.gen)}</p>`:''}</div>`).join('');
  return `<div class="mitblock"><div class="mbh">🛡 Mitigation ／ 緩和策<span class="mc">${mits.length} 件</span></div>${rows}</div>`; }
function renderD3(d3){ if(!d3||!d3.length) return '';
  const rows = d3.map(d=>`<div class="d3row"><a href="${esc(d.url)}" target="_blank" rel="noopener"><span class="d3-id">${esc(d.id)}</span> <span class="d3-n">${esc(d.name)}</span></a><span class="d3-t">${esc(d.tactic||'')}</span></div>`).join('');
  return `<div class="d3block"><div class="d3h">⛨ D3FEND ／ 対応する防御技術<span class="mc">${d3.length} 件</span></div>${rows}</div>`; }

function renderDefense(){
  const sorted = [...MITS].sort((a,b)=>b.techs.length-a.techs.length);
  const cards = sorted.map(m=>{
    const cov = m.techs.map(t=>{ const idx = TACTICS.findIndex(tc=>tc.name===t.tac);
      return `<button class="covchip" data-tac="${idx}" data-tech="${esc(t.id)}"><span class="cc-id">${esc(t.id)}</span>${esc(t.name)}</button>`; }).join('');
    return `<div class="mitcard">
      <div class="mch"><div class="mc-id">${esc(m.id)}</div><div class="mc-n">${esc(m.name)}</div></div>
      ${m.gen?`<div class="mc-g">${linkify(m.gen)}</div>`:''}
      <div class="mc-cov"><div class="mc-covh">対応テクニック <b>${m.techs.length}</b> 件</div><div class="covchips">${cov}</div></div></div>`; }).join('');
  $('#view-defense').innerHTML = `
    <div class="sec-kicker"><span class="num">🛡</span><div><div class="lbl">MITIGATIONS → TECHNIQUES</div><h2>防御マッピング<span class="jp">各緩和策がどの攻撃テクニックを抑止するか</span></h2></div></div>
    <p class="lead">ATT&CK の緩和策（Mitigation）は攻撃テクニックに対する予防・検知・対応策の集合です。下のカードは緩和策ごとに「カバーするテクニック」を対応件数順に並べています。チップをクリックすると該当テクニックの詳細へ移動します。多くのテクニックには D3FEND の防御技術も別途対応づけられています（戦術別ビューで確認）。</p>
    <div class="mapnote"><span class="nic">i</span><div class="ntxt"><b>読み方：</b>対応テクニック数が多い緩和策ほど「広く効く土台的な防御」。少数精鋭の緩和策は特定の攻撃に対するピンポイントな統制です。両者を組み合わせて多層防御を構成します。</div></div>
    <div class="mitgrid">${cards}</div>`;
  $('#view-defense').querySelectorAll('.covchip').forEach(b=>b.addEventListener('click',()=>{ const idx=+b.dataset.tac; if(idx>=0) openTactic(idx,b.dataset.tech); }));
}

let SEARCH_INDEX=null;
function buildIndex(){ SEARCH_INDEX=[];
  TACTICS.forEach((tc,i)=>tc.techs.forEach(t=>{
    SEARCH_INDEX.push({tacIdx:i, tac:tacName(tc), id:t.id, name:t.name, type:t.type, desc:t.desc,
      hay:(t.id+' '+t.name+' '+(t.desc||'')+' '+(t.platforms||'')+' '+t.mits.map(m=>m.name+' '+(m.usage||'')).join(' ')+' '+t.d3.map(d=>d.id+d.name).join(' ')).toLowerCase()}); })); }
function runSearch(q){ if(!SEARCH_INDEX) buildIndex(); q=q.trim().toLowerCase();
  if(!q){ showView(currentView==='search'?'home':currentView); return; }
  const terms=q.split(/\s+/); const hits=SEARCH_INDEX.filter(it=>terms.every(t=>it.hay.includes(t)));
  const items=hits.slice(0,200).map(h=>`<button class="sritem" data-tac="${h.tacIdx}" data-tech="${esc(h.id)}">
    <div class="sr-top"><span class="sr-id">${esc(h.id)}</span><span class="sr-tac">${esc(h.tac)}</span>${h.type==='Sub-Technique'?'<span class="chip sub">sub</span>':''}<span class="sr-n">${esc(h.name)}</span></div>
    <div class="sr-d">${esc(firstSentence(h.desc))}</div></button>`).join('');
  $('#view-search').innerHTML = `
    <div class="sec-kicker"><span class="num">⌕</span><div><div class="lbl">SEARCH</div><h2>検索結果<span class="jp">「${esc(q)}」にマッチするテクニック・緩和策</span></h2></div></div>
    ${hits.length?`<p class="srcount"><b>${hits.length}</b> 件ヒット${hits.length>200?'（先頭200件を表示）':''}</p><div class="sresults">${items}</div>`:`<div class="empty">該当する項目が見つかりませんでした。別のキーワードでお試しください。</div>`}`;
  $('#view-search').querySelectorAll('.sritem').forEach(b=>b.addEventListener('click',()=>openTactic(+b.dataset.tac,b.dataset.tech)));
  showView('search', true); }

let currentView='home', currentTac=0;
function showView(v, fromSearch){ ['home','matrix','tactic','defense','search'].forEach(x=>{ $('#view-'+x).classList.toggle('on', x===v); });
  $('.viewtabs').querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.view===v));
  if(v!=='search') currentView=v; if(v!=='tactic') markStrip(-1); else markStrip(currentTac);
  if(!fromSearch) window.scrollTo({top:0,behavior:'smooth'}); }
function openTactic(idx, focusId){ currentTac=idx; renderTactic(idx, focusId); showView('tactic'); markStrip(idx);
  if(!focusId) window.scrollTo({top:0,behavior:'smooth'}); }

function init(){ buildStrip(); renderHome(); renderMatrix(); renderDefense();
  $('.viewtabs').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ const v=b.dataset.view;
    if(v==='tactic'){ openTactic(currentTac); } else showView(v); }));
  const si=$('#search'); let tmr=null;
  si.addEventListener('input',()=>{ clearTimeout(tmr); tmr=setTimeout(()=>runSearch(si.value),180); });
  si.addEventListener('keydown',e=>{ if(e.key==='Escape'){ si.value=''; showView(currentView); } });
  window.addEventListener('message',e=>{ const d=e.data||{}; if(d.type==='scrollTo'&&d.id){ for(let i=0;i<TACTICS.length;i++){ if(TACTICS[i].techs.some(t=>t.id===d.id)){ openTactic(i,d.id); break; } } } });
  window.__gotoId=function(id){ for(let i=0;i<TACTICS.length;i++){ if(TACTICS[i].id===id){ openTactic(i); return; } if(TACTICS[i].techs.some(t=>t.id===id)){ openTactic(i,id); return; } } };
  if(window.XLINK) XLINK.ready();
}
if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded',init);
