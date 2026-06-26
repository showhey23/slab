"use strict";
/* ===== MITRE ATT&CK Enterprise v19 — 攻撃ストーリー 2.5D俯瞰ビュー =====
   外部→境界→端末→内部→認証基盤→クラウンジュエル の攻撃経路を、
   レイヤー・攻撃パス・防御ゲート・フェーズで初見理解できるようにする。 */
const DATA = window.__ATTACK_DATA__;
const TACTICS = DATA.tactics.slice().sort((a,b)=>a.order-b.order);
const byOrder = {}; TACTICS.forEach(t=>byOrder[t.order]=t);
const N = TACTICS.length;                 // 15
const $ = s=>document.querySelector(s);
const esc = s=>(s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const TACDISP={TA0043:'偵察',TA0042:'リソース開発',TA0001:'初期アクセス',TA0002:'実行',TA0003:'永続化',
 TA0004:'権限昇格',TA0005:'防御回避',TA0112:'防御機能の妨害',TA0006:'認証情報アクセス',TA0007:'探索',
 TA0008:'横展開',TA0009:'収集',TA0010:'持ち出し',TA0011:'コマンド&コントロール',TA0040:'影響'};
const tn = tc => TACDISP[tc.id]||tc.name;

/* 6レイヤー（外→内）。色は Deep Aurora 役割色 */
const LAYERS=[
 {i:0,name:'外部圏・インターネット',en:'INTERNET',col:'#E8788C'},
 {i:1,name:'境界・侵入口',en:'EDGE / PERIMETER',col:'#34C9C0'},
 {i:2,name:'エンドポイント',en:'ENDPOINT',col:'#8A8FF0'},
 {i:3,name:'内部ネットワーク',en:'INTERNAL NETWORK',col:'#7C9CF0'},
 {i:4,name:'認証基盤 (AD/DC/IdP)',en:'IDENTITY',col:'#D8A65A'},
 {i:5,name:'クラウンジュエル / 業務データ',en:'CROWN JEWELS',col:'#E7B24a'},
];
/* tactic order -> layer index */
const LAYER_OF={1:0,2:0,3:1,4:2,5:2,6:2,7:3,8:3,9:4,10:3,11:3,12:3,13:3,14:5,15:5};

/* 6フェーズ・グルーピング（時間軸） */
const PHASES=[
 {key:'prep', name:'準備',          col:'#8A8FF0', orders:[1,2]},
 {key:'intr', name:'侵入',          col:'#34C9C0', orders:[3]},
 {key:'ep',   name:'端末支配',      col:'#7C9CF0', orders:[4,5,6,7,8]},
 {key:'id',   name:'ID侵害',        col:'#D8A65A', orders:[9]},
 {key:'lat',  name:'内部探索・横展開',col:'#3FBF8F', orders:[10,11,12,13]},
 {key:'obj',  name:'目的達成',      col:'#E8788C', orders:[14,15]},
];
const PHASE_OF={}; PHASES.forEach(p=>p.orders.forEach(o=>PHASE_OF[o]=p));

/* 各戦術の物語（公式知識に基づく簡潔記述） */
const NARR={
 TA0043:{now:'攻撃者が標的の公開資産・従業員・技術スタックを外部から調査している。',goal:'侵入口と狙うべき人・システムを特定する。',tel:'公開資産へのスキャン痕跡、OSINT検索、WHOIS/DNS照会、SNS収集（多くは組織の可視範囲外）。'},
 TA0042:{now:'攻撃インフラ（C2・ドメイン・アカウント・マルウェア）を準備・取得している。',goal:'攻撃を実行するための足場と道具立てを整える。',tel:'新規登録ドメイン、フィッシングキット、なりすましアカウント作成（外部脅威インテリで検知）。'},
 TA0001:{now:'フィッシングや公開アプリの脆弱性を突き、境界を越えて最初の足場を得ている。',goal:'標的環境内に最初の実行拠点を確立する。',tel:'メールGWの添付/リンク検知、Web/VPN/Exchangeの認証ログ・例外、初回プロセス生成。'},
 TA0002:{now:'侵害端末上でコマンド/スクリプトや悪性コードを実行している。',goal:'ペイロードを動かし後続の支配につなげる。',tel:'プロセス生成(PowerShell/cmd/wscript)、コマンドライン、親子プロセス、Scriptブロックログ。'},
 TA0003:{now:'再起動や資格情報変更後も足場を維持する常駐機構を仕込んでいる。',goal:'アクセスを失わないよう常駐化する。',tel:'自動起動(Run/サービス/タスク)の作成・変更、レジストリ改変、新規アカウント。'},
 TA0004:{now:'より高い権限（管理者/SYSTEM）を奪い、行動範囲を広げている。',goal:'制限を外し、防御無効化や横展開を可能にする。',tel:'トークン操作、UACバイパス、脆弱ドライバ/サービス悪用、権限付与イベント。'},
 TA0005:{now:'EDR/AV/ログを回避・難読化し、活動を隠蔽している。',goal:'検知されずに活動を継続する。',tel:'セキュリティサービス停止、署名済バイナリ悪用(LOLBins)、難読化、不自然なログ欠落。'},
 TA0112:{now:'セキュリティツール・ログ・バックアップを停止/改ざんしている。',goal:'検知と復旧の能力そのものを奪う。',tel:'AV/EDR無効化、イベントログ消去(ID1102)、シャドウコピー/バックアップ削除、防御設定改変。'},
 TA0006:{now:'LSASS/SAM や AD から資格情報を窃取している。',goal:'正規資格情報を得て横展開とID基盤の支配につなげる。',tel:'LSASSアクセス、Mimikatz挙動、DCSync/レプリケーション要求、Kerberoast、異常認証。'},
 TA0007:{now:'内部のホスト・アカウント・ネットワーク構成を列挙している。',goal:'価値ある到達点と経路を把握する。',tel:'大量の列挙(net/whoami/AdFind/BloodHound)、LDAP/SMB照会の急増。'},
 TA0008:{now:'窃取資格情報でホスト間を渡り歩いている。',goal:'認証基盤や目的データへ近づく。',tel:'RDP/SMB/WinRM/PsExecの遠隔ログオン、横方向認証、リモートサービス作成。'},
 TA0009:{now:'業務データ・資格情報・知的財産を集約している。',goal:'持ち出しに備え価値ある情報をまとめる。',tel:'大量ファイルアクセス、アーカイブ作成(zip/rar)、共有・メール・クリップボード収集。'},
 TA0011:{now:'内部から外部への制御チャネルを確立し遠隔操作している。',goal:'継続的な指令と段階的攻撃を可能にする。',tel:'既知C2通信、ビーコン周期、DNS/HTTPSトンネル、異常な外向き接続。'},
 TA0010:{now:'集めたデータを外部へ送出している。',goal:'情報を窃取し外部へ移送する。',tel:'大量アップロード/DLP検知、クラウドストレージ送信、異常な外向きデータ量。'},
 TA0040:{now:'暗号化・破壊・改ざん・サービス妨害で可用性/完全性に影響を与えている。',goal:'金銭・妨害・破壊といった最終目的を達成する。',tel:'大量ファイル改名/暗号化、シャドウコピー削除、ランサムノート、サービス停止。'},
};

/* ===== 防御集計 ===== */
function tacDefenses(tc){
  const mit={}, d3={};
  tc.techs.forEach(t=>{ (t.mits||[]).forEach(m=>{ mit[m.id]=mit[m.id]||{id:m.id,name:m.name,n:0}; mit[m.id].n++; });
                        (t.d3||[]).forEach(d=>{ d3[d.id]=d3[d.id]||{id:d.id,name:d.name}; }); });
  const mits=Object.values(mit).sort((a,b)=>b.n-a.n);
  const d3s=Object.values(d3);
  let cov=0; tc.techs.forEach(t=>{ if(t.mits&&t.mits.length) cov++; });
  return {mits,d3s,covPct:tc.techs.length?Math.round(cov/tc.techs.length*100):0,tot:tc.techs.length};
}
/* レイヤーの防御強度（その層に属する戦術の緩和被覆%） */
function layerCoverage(li){
  let cov=0,tot=0;
  TACTICS.forEach(tc=>{ if(LAYER_OF[tc.order]===li) tc.techs.forEach(t=>{ tot++; if(t.mits&&t.mits.length)cov++; }); });
  return tot?Math.round(cov/tot*100):0;
}

/* ===== ジオメトリ ===== */
const VW=1180, VH=720, BAND_H=96, GAP=22, Y0=20, LBLW=168;
const PX0=LBLW+58, PX1=VW-40;
const px = o => PX0 + (o-1)/(N-1)*(PX1-PX0);
const bandY = li => Y0 + li*(BAND_H+GAP);
const layerCY = li => bandY(li)+BAND_H/2;
const py = o => layerCY(LAYER_OF[o]);

/* ===== 状態 ===== */
let curStep=0;          // 0=未開始, 1..N=到達済みの最終戦術
let killOn=false, playing=false, selOrder=null, speed=1, playTimer=null;

/* ===== SVG 構築 ===== */
function buildSVG(){
  const s=[];
  s.push(`<svg id="story" viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="攻撃ストーリー 2.5D俯瞰ビュー">`);
  s.push(`<defs>
    <marker id="ah-red" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L6.5,3 L0,6 Z" fill="#E8788C"/></marker>
    <marker id="ah-dim" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L6.5,3 L0,6 Z" fill="#5C6B7F"/></marker>
    <linearGradient id="bandg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18233A" stop-opacity=".55"/><stop offset="1" stop-color="#0d1525" stop-opacity=".25"/></linearGradient>
  </defs>`);
  /* layers (2.5D: band + left depth face) */
  LAYERS.forEach(L=>{
    const y=bandY(L.i), x=LBLW+10, w=VW-30-x;
    s.push(`<g class="layerband" data-layer="${L.i}">`);
    // depth face (left isometric strip)
    s.push(`<path d="M${x},${y} l-14,10 l0,${BAND_H} l14,-10 Z" fill="${L.col}" opacity=".14"/>`);
    s.push(`<rect x="${x}" y="${y}" width="${w}" height="${BAND_H}" rx="14" fill="url(#bandg)" stroke="${L.col}" stroke-opacity=".34"/>`);
    s.push(`<rect x="${x}" y="${y}" width="5" height="${BAND_H}" rx="2.5" fill="${L.col}" opacity=".75"/>`);
    // label block
    s.push(`<text x="14" y="${y+34}" font-size="14" font-weight="700" fill="${L.col}">${esc(L.name)}</text>`);
    s.push(`<text x="14" y="${y+54}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="9.5" fill="#8A97AD" letter-spacing="1">L${L.i} · ${L.en}</text>`);
    const cov=layerCoverage(L.i);
    s.push(`<text x="14" y="${y+74}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="9.5" fill="#8A97AD">緩和被覆 ${cov}%</text>`);
    s.push(`</g>`);
  });
  /* defense gates between layers (0-1 .. 4-5) */
  for(let g=0; g<5; g++){
    const yMid=bandY(g)+BAND_H+GAP/2;
    const gx0=LBLW+30, gx1=VW-50;
    const cov=layerCoverage(g+1);  // gate protects the inner layer below
    const strong=cov>=50, mid=cov>=25;
    const col=strong?'#3FBF8F':mid?'#D8A65A':'#E8788C';
    s.push(`<g class="gate" data-gate="${g}" style="cursor:pointer">`);
    s.push(`<line x1="${gx0}" y1="${yMid}" x2="${gx1}" y2="${yMid}" stroke="${col}" stroke-width="2" stroke-dasharray="${strong?'0':'7 5'}" opacity=".5"/>`);
    // shield emblem + bar
    const ex=gx1-150;
    s.push(`<g transform="translate(${ex},${yMid})">
      <rect x="0" y="-11" width="150" height="22" rx="11" fill="#0d1525" stroke="${col}" stroke-opacity=".5"/>
      <text x="11" y="4" font-size="12">🛡</text>
      <rect x="30" y="-4" width="74" height="8" rx="4" fill="rgba(148,170,205,.16)"/>
      <rect x="30" y="-4" width="${(74*cov/100).toFixed(1)}" height="8" rx="4" fill="${col}"/>
      <text x="112" y="4" font-family="JetBrains Mono, ui-monospace, monospace" font-size="10" fill="#C5D0E0">${cov}%</text></g>`);
    s.push(`<text x="${gx0+4}" y="${yMid-7}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="9.5" fill="${col}">防御ゲート G${g} → L${g+1}</text>`);
    s.push(`</g>`);
  }
  /* attack path segments (order o -> o+1) */
  s.push(`<g id="paths"></g>`);
  /* kill-chain spine overlay (hidden until toggled) */
  s.push(`<path id="spine" d="" fill="none" stroke="#E8788C" stroke-width="7" stroke-linecap="round" opacity="0"/>`);
  /* pins */
  s.push(`<g id="pins"></g>`);
  s.push(`</svg>`);
  $('#scanvas').insertAdjacentHTML('afterbegin', s.join(''));
  drawPathsAndPins();
  buildSpine();
  // gate clicks
  document.querySelectorAll('#story .gate').forEach(g=>g.addEventListener('click',()=>showGate(+g.dataset.gate)));
  document.querySelectorAll('#story .layerband').forEach(g=>g.addEventListener('click',()=>showGate(Math.max(0,+g.dataset.layer-1))));
}

function segState(o2){ // state of segment whose head is order o2
  if(curStep===0) return 'preview';
  if(o2<=curStep) return 'done';
  if(o2===curStep+1) return 'cur';
  return 'future';
}
function pinState(o){
  if(curStep===0) return 'idle';
  if(o<curStep) return 'done';
  if(o===curStep) return 'cur';
  return 'future';
}
function drawPathsAndPins(){
  // paths
  let pg='';
  for(let o=1;o<N;o++){
    const a=[px(o),py(o)], b=[px(o+1),py(o+1)];
    const st=segState(o+1);
    let col='#E8788C',op=.5,w=2.4,dash='0',mk='url(#ah-red)';
    if(st==='preview'){ op=.42; w=2.2; }
    else if(st==='done'){ op=.9; w=3; }
    else if(st==='cur'){ op=1; w=4.4; }
    else { col='#5C6B7F'; op=.35; w=1.8; dash='6 6'; mk='url(#ah-dim)'; }
    // gentle curve via quadratic for readability
    const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2 - Math.min(26,Math.abs(b[1]-a[1])*0.25);
    pg+=`<path class="seg${o}" d="M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}" fill="none" stroke="${col}" stroke-width="${w}" stroke-opacity="${op}" stroke-dasharray="${dash}" stroke-linecap="round" marker-end="${mk}"/>`;
  }
  $('#paths').innerHTML=pg;
  // pins
  let pn='';
  TACTICS.forEach(tc=>{
    const o=tc.order, x=px(o), y=py(o), st=pinState(o), ph=PHASE_OF[o];
    let fill='#121A2C', stroke=ph.col, r=15, ring='';
    if(st==='done'){ fill='rgba(232,120,140,.20)'; stroke='#E8788C'; }
    else if(st==='cur'){ fill='rgba(232,120,140,.30)'; stroke='#E8788C'; ring=`<circle cx="${x}" cy="${y}" r="${r+6}" fill="none" stroke="#E8788C" stroke-width="1.6"><animate attributeName="r" values="${r+4};${r+9};${r+4}" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite"/></circle>`; }
    else if(st==='future'){ stroke='#3a496a'; }
    const sel=selOrder===o?`<circle cx="${x}" cy="${y}" r="${r+4}" fill="none" stroke="#34C9C0" stroke-width="1.6"/>`:'';
    pn+=`<g class="pin" data-order="${o}" style="cursor:pointer">${ring}${sel}
      <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      <text x="${x}" y="${y+4}" text-anchor="middle" font-family="JetBrains Mono, ui-monospace, monospace" font-size="10" fill="${st==='future'?'#5C6B7F':'#EEF2F8'}">${o}</text>
      <text x="${x}" y="${y-22}" text-anchor="middle" font-size="11" font-weight="700" fill="${st==='future'?'#7C8088':'#EEF2F8'}">${esc(tn(tc))}</text>
      <text x="${x}" y="${y+30}" text-anchor="middle" font-family="JetBrains Mono, ui-monospace, monospace" font-size="8.5" fill="#8A97AD">${tc.id}</text></g>`;
  });
  $('#pins').innerHTML=pn;
  document.querySelectorAll('#story .pin').forEach(p=>p.addEventListener('click',()=>{ selectTactic(+p.dataset.order); }));
}
function buildSpine(){
  // canonical shortest route to crown jewels (one representative per traversed layer)
  const route=[3,4,9,11,15]; // 初期アクセス→実行→認証情報→横展開→影響
  window.__SPINE_ROUTE__=route;
  let d=`M${px(route[0])},${py(route[0])}`;
  for(let i=1;i<route.length;i++){ const o=route[i],p=route[i-1];
    const mx=(px(p)+px(o))/2, my=(py(p)+py(o))/2 - 30;
    d+=` Q${mx},${my} ${px(o)},${py(o)}`; }
  $('#spine').setAttribute('d',d);
}

/* ===== 右ペイン ===== */
function selectTactic(o){ selOrder=o; renderPane(o); drawPathsAndPins(); markTimeline(); }
function renderPane(o){
  const tc=byOrder[o], ph=PHASE_OF[o], L=LAYERS[LAYER_OF[o]], d=tacDefenses(tc), nr=NARR[tc.id]||{};
  const _rep=tc.techs.find(t=>t.type==='Technique')||tc.techs[0]; const repId=_rep?_rep.id:'';
  const st=pinState(o);
  const stTxt=st==='done'?'侵害済み':st==='cur'?'現在地':st==='future'?'未到達':'—';
  let h=`<div class="pe" style="--accent:${ph.col}">${tc.id} · ${esc(ph.name)}フェーズ · ${esc(L.name)}</div>
   <h2>${esc(tn(tc))}</h2>
   <div class="psub">状態：<b style="color:${st==='cur'?'#E8788C':st==='done'?'#F6D6DC':'var(--ink2)'}">${stTxt}</b> ／ ${tc.techs.length} 技術 ・ 緩和被覆 ${d.covPct}%</div>
   <div class="sect now"><h3><span class="ic">⚡</span>何が起きているか</h3><p>${esc(nr.now||tc.desc||'')}</p></div>
   <div class="sect goal"><h3><span class="ic">🎯</span>攻撃者の狙い</h3><p>${esc(nr.goal||'')}</p></div>
   <div class="sect tel"><h3><span class="ic">📡</span>見えるログ・テレメトリ</h3><p>${esc(nr.tel||'')}</p></div>
   <div class="sect def"><h3><span class="ic">🛡</span>有効な防御・緩和策</h3>`;
  if(d.mits.length){ h+=`<div class="deflist">`+d.mits.slice(0,6).map(m=>`<div class="defrow"><span class="id">${esc(m.id)}</span><span class="nm">${esc(m.name)}</span></div>`).join('')+`</div>`; }
  else h+=`<p>個別の緩和策は未紐付け。上位の予防的統制（最小権限・多層防御・監視・パッチ）で対応。</p>`;
  if(d.d3s.length){ h+=`<div class="d3wrap"><div class="lbl">D3FEND 防御技術（抜粋）</div><div class="chiprow">`+d.d3s.slice(0,6).map(x=>`<span class="chip">${esc(x.id)} ${esc(x.name)}</span>`).join('')+`</div></div>`; }
  h+=`</div>`;
  h+=`<div class="xjumprow"><button class="xjump toMap" onclick="XLINK.go('map','${tc.id}')">🗺 マップで戦術を見る</button>${repId?`<button class="xjump toModel" onclick="XLINK.go('models','${repId}')">🖼 攻撃モデル図</button>`:''}</div>`;
  // secondary: technique list
  h+=`<details class="techs"><summary>この戦術の技術一覧（${tc.techs.filter(t=>t.type==='Technique').length} 技術／副次）</summary><div class="tlist">`+
     tc.techs.filter(t=>t.type==='Technique').map(t=>`<div class="ti" onclick="XLINK.go('models','${t.id}')" style="cursor:pointer;display:flex;align-items:center;gap:6px" title="攻撃モデル図を見る"><span class="tid">${esc(t.id)}</span><b>${esc(t.name)}</b><span style="margin-left:auto;opacity:.6">🖼</span></div>`).join('')+
     `</div></details>`;
  $('#spane').innerHTML=h;
}
function showGate(g){
  const protectedLayer=LAYERS[g+1], cov=layerCoverage(g+1);
  // tactics in that protected layer
  const tacs=TACTICS.filter(tc=>LAYER_OF[tc.order]===g+1);
  const mitAgg={};
  tacs.forEach(tc=>tc.techs.forEach(t=>(t.mits||[]).forEach(m=>{mitAgg[m.id]=mitAgg[m.id]||{id:m.id,name:m.name,n:0};mitAgg[m.id].n++;})));
  const mits=Object.values(mitAgg).sort((a,b)=>b.n-a.n).slice(0,7);
  const col=cov>=50?'#3FBF8F':cov>=25?'#D8A65A':'#E8788C';
  let h=`<div class="pe" style="--accent:${col}">DEFENSE GATE G${g} → L${g+1}</div>
   <h2>防御ゲート：${esc(protectedLayer.name)}</h2>
   <div class="psub">この境界を越える攻撃に対する緩和被覆 <b style="color:${col}">${cov}%</b></div>
   <div class="weakbox"><h3>${cov>=50?'🛡 比較的堅牢な境界':cov>=25?'⚠ 防御が手薄な境界':'⛔ 弱点となりやすい境界'}</h3>
     <div class="gate"><span>被覆</span><div class="bar"><i style="width:${cov}%;background:${col}"></i></div><span>${cov}%</span></div>
     <div class="reach">この層に属する戦術：${tacs.map(t=>esc(tn(t))).join(' / ')}</div></div>
   <div class="sect def"><h3><span class="ic">🛡</span>この境界で効く主な緩和策</h3>`;
  h+= mits.length?`<div class="deflist">`+mits.map(m=>`<div class="defrow"><span class="id">${esc(m.id)}</span><span class="nm">${esc(m.name)}</span></div>`).join('')+`</div>`:`<p>個別緩和策が乏しい層。設計段階の予防的統制とセグメンテーションが重要。</p>`;
  h+=`</div><div class="hintline">レイヤー間の「ゲート」は、その境界を守る防御の厚みを表します。被覆が低いゲートほど、攻撃者がそのレイヤーへ侵入・通過しやすい弱点です。</div>`;
  $('#spane').innerHTML=h; selOrder=null; drawPathsAndPins();
}

/* ===== 最短路（クラウンジュエルへ） ===== */
function toggleKill(){
  killOn=!killOn; const b=$('#btnKill'); b.classList.toggle('on',killOn);
  $('#spine').setAttribute('opacity',killOn?'0.95':'0');
  if(killOn) renderShortest(); else if(selOrder) renderPane(selOrder);
}
function renderShortest(){
  const route=window.__SPINE_ROUTE__||[3,4,9,11,15];
  // gates crossed by spine: from layer of route[i] to route[i+1]
  const crossed=new Set();
  for(let i=0;i<route.length-1;i++){ const la=LAYER_OF[route[i]], lb=LAYER_OF[route[i+1]];
    const lo=Math.min(la,lb), hi=Math.max(la,lb); for(let g=lo;g<hi;g++) crossed.add(g); }
  const gates=[...crossed].map(g=>({g,cov:layerCoverage(g+1),layer:LAYERS[g+1].name})).sort((a,b)=>a.cov-b.cov);
  const weakest=gates[0];
  const steps=route.map(o=>`${byOrder[o].id} ${tn(byOrder[o])}`).join(' → ');
  let h=`<div class="pe" style="--accent:#E8788C">SHORTEST PATH TO CROWN JEWELS</div>
   <h2>クラウンジュエルへの最短路</h2>
   <div class="psub">外部足場から業務データ到達まで <b style="color:#E8788C">${route.length} ホップ</b></div>
   <div class="weakbox"><h3>⛔ 到達可能性と防御上の弱点</h3>
     <div class="reach"><b style="color:#F6D6DC">到達可能</b>：${esc(steps)}。<br>境界(L1)からエンドポイント(L2)で実行権を得て、認証基盤(L4)で資格情報を奪取、横展開(L3)を経てデータ層(L5)へ到達する主経路。</div>`;
  gates.forEach(g=>{ const col=g.cov>=50?'#3FBF8F':g.cov>=25?'#D8A65A':'#E8788C';
    h+=`<div class="gate"><span style="min-width:128px">G${g.g}→L${g.g+1} ${esc(g.layer)}</span><div class="bar"><i style="width:${g.cov}%;background:${col}"></i></div><span>${g.cov}%</span></div>`; });
  h+=`</div>`;
  if(weakest) h+=`<div class="sect now"><h3><span class="ic">⚠</span>最弱の防御ゲート</h3><p><b>G${weakest.g} → L${weakest.g+1}（${esc(weakest.layer)}）</b>：緩和被覆 ${weakest.cov}%。この境界の強化（多要素認証・セグメンテーション・特権アクセス管理・EDR強制）が、最短路を断つ最優先点です。</p></div>`;
  h+=`<div class="hintline">太い赤線が主攻撃パス。各ゲートのバーが防御の厚み。被覆が最も低いゲートが、攻撃者にとっての通り道＝防御側の優先補強点です。</div>`;
  $('#spane').innerHTML=h;
}

/* ===== タイムライン（フェーズ・グルーピング） ===== */
function buildTimeline(){
  let h='';
  PHASES.forEach(p=>{
    h+=`<div class="phase" style="--pc:${p.col}"><div class="ph-h"><span class="pn"></span>${esc(p.name)}</div><div class="tacs">`;
    p.orders.forEach(o=>{ const tc=byOrder[o];
      h+=`<button class="tac-chip" data-order="${o}"><span class="tid">${tc.id}</span><span class="tnm">${esc(tn(tc))}</span></button>`; });
    h+=`</div></div>`;
  });
  $('#stimeline').innerHTML=h;
  document.querySelectorAll('#stimeline .tac-chip').forEach(b=>b.addEventListener('click',()=>{ pause(); focusStep(+b.dataset.order); selectTactic(+b.dataset.order); }));
}
function markTimeline(){
  document.querySelectorAll('#stimeline .tac-chip').forEach(b=>{ const o=+b.dataset.order;
    b.classList.toggle('done', curStep>0 && o<curStep);
    b.classList.toggle('cur', o===curStep || o===selOrder);
  });
}

/* ===== 再生・ステップ ===== */
function focusStep(o){ curStep=o; selOrder=o; drawPathsAndPins(); renderPane(o); markTimeline(); updateNow(); }
function updateNow(){ if(curStep===0){ $('#snow').innerHTML='<span class="ph">READY</span> 再生ボタンで攻撃シナリオを開始'; return; }
  const tc=byOrder[curStep], ph=PHASE_OF[curStep];
  $('#snow').innerHTML=`<span class="ph">${tc.id} · ${esc(ph.name)}</span> <b>${esc(tn(tc))}</b>`; }
function play(){ if(curStep>=N){ rewind(); } playing=true; $('#btnPlay').textContent='⏸'; if(curStep<1) focusStep(1);
  clearInterval(playTimer); playTimer=setInterval(()=>{ if(curStep<N){ focusStep(curStep+1); } else { pause(); } }, 2200/speed); }
function pause(){ playing=false; $('#btnPlay').textContent='▶'; clearInterval(playTimer); }
function togglePlay(){ playing?pause():play(); }
function stepFwd(){ pause(); focusStep(Math.min(N,(curStep||0)+1)); }
function stepBack(){ pause(); focusStep(Math.max(1,(curStep||1)-1)); }
function rewind(){ pause(); curStep=0; selOrder=null; drawPathsAndPins(); markTimeline(); updateNow();
  $('#spane').innerHTML=introPane(); }

/* ===== 3D 自由視点（副次） ===== */
function open3D(){ const o=$('#free3d'); if(!$('#free3dFrame').src) $('#free3dFrame').src='topology-3d-free.html'; o.classList.add('show'); }
function close3D(){ $('#free3d').classList.remove('show'); }

function introPane(){
  return `<div class="pe" style="--accent:#34C9C0">ATT&CK ENTERPRISE v19 · ATTACK STORY</div>
   <h2>攻撃ストーリーを読む</h2>
   <div class="psub">外部 → 境界 → 端末 → 内部 → 認証基盤 → クラウンジュエル</div>
   <div class="sect tel"><h3><span class="ic">▶</span>使い方</h3><p>赤い<b style="color:#E8788C">攻撃パス</b>が攻撃者の進行を表します。下部タイムライン（フェーズ別）か各ピンをクリックすると、その戦術で「何が起きているか／狙い／見えるログ／効く防御」が右に表示されます。<b>▶ 再生</b>で侵害の進行（侵害済み・現在地・未到達）を順に追えます。</p></div>
   <div class="sect goal"><h3><span class="ic">🛡</span>防御ゲート</h3><p>レイヤー間の<b style="color:#3FBF8F">緑/黄/赤のゲート</b>は、その境界を守る防御の厚み（緩和被覆%）。赤いゲートほど通過されやすい弱点です。クリックで詳細を表示。</p></div>
   <div class="sect now"><h3><span class="ic">⚡</span>最短路</h3><p><b>クラウンジュエルへの最短路</b>ボタンで、業務データへ到達する主攻撃パスと、その経路上で最も弱い防御ゲートを表示します。</p></div>
   <div class="hintline">3D自由視点・階層ツリー・技術詳細は副次機能です（上部「🧊 3D自由視点」）。まずは攻撃経路の理解を優先してください。</div>`;
}

function init(){
  buildSVG(); buildTimeline(); updateNow();
  $('#spane').innerHTML=introPane();
  $('#btnKill').onclick=toggleKill;
  $('#btn3D').onclick=open3D; $('#free3dClose').onclick=close3D;
  $('#btnPlay').onclick=togglePlay; $('#btnFwd').onclick=stepFwd; $('#btnBack').onclick=stepBack; $('#btnRewind').onclick=rewind;
  document.querySelectorAll('#sxport .seg button').forEach(b=>b.onclick=()=>{ speed=+b.dataset.s;
    document.querySelectorAll('#sxport .seg button').forEach(x=>x.classList.toggle('on',x===b)); if(playing){pause();play();} });
  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){stepFwd();e.preventDefault();}
    else if(e.key==='ArrowLeft'){stepBack();e.preventDefault();}
    else if(e.key===' '){togglePlay();e.preventDefault();}
    else if(e.key==='Escape'){ close3D(); }
    else if(e.key.toLowerCase()==='k'){ toggleKill(); }
  });

  // 統合ビューア内では、入れ子の3D自由視点が送る goModel を上位(viewer)へ転送し横断ジャンプを維持
  window.addEventListener('message',function(e){ var d=e.data||{};
    if(d&&d.type==='goModel'&&window.parent&&window.parent!==window){ try{ window.parent.postMessage(d,'*'); }catch(_){} } });
  // 相互連関：ディープリンク受領フック（戦術ID/技術ID → 該当戦術を選択）
  window.__gotoId=function(id){
    for(var i=0;i<TACTICS.length;i++){ if(TACTICS[i].id===id){ selectTactic(TACTICS[i].order); return; } }
    for(var j=0;j<TACTICS.length;j++){ if(TACTICS[j].techs.some(function(t){return t.id===id;})){ selectTactic(TACTICS[j].order); return; } }
  };
  if(window.XLINK) XLINK.ready();
}
if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded',init);
