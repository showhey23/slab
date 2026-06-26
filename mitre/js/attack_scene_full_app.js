"use strict";
/* ===== MITRE ATT&CK Enterprise v19 — アーキテクチャ攻撃モデル図 エンジン =====
   雛形：ATLAS scene_full（Deep Aurora）。エンジン骨格は流用、
   §7.1 フェーズ写像 / §7.3 エンタープライズ語彙 / §7.4 戦術別レイアウトへ適応。 */
const DATA = window.__ATTACK_DATA__;
const TACTICS = DATA.tactics;
const $ = s=>document.querySelector(s);
const esc = s=>(s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function linkify(t){ if(t==null)return''; let s=esc(t);
  s=s.replace(/\[([^\]]+)\]\((\/[^)]+)\)/g,(m,l,p)=>`<a href="https://attack.mitre.org${p}" target="_blank" rel="noopener">${l}</a>`);
  s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,(m,l,u)=>`<a href="${u}" target="_blank" rel="noopener">${l}</a>`);
  return s; }
function groupTechs(tc){ const tops=[],byP={}; tc.techs.forEach(t=>{if(t.type==='Sub-Technique')(byP[t.parent]=byP[t.parent]||[]).push(t);});
  tc.techs.forEach(t=>{if(t.type==='Technique')tops.push({tech:t,subs:byP[t.id]||[]});});
  // 親が当該戦術に無いサブ（共有時）も拾う
  tc.techs.forEach(t=>{if(t.type==='Sub-Technique' && !tc.techs.some(x=>x.id===t.parent)){ if(!tops.some(o=>o.orphan&&o.tech.id===t.id)) tops.push({tech:t,subs:[],orphan:true}); }});
  return tops; }
function wrap(s,n,max){ const a=[...String(s)]; const o=[]; for(let i=0;i<a.length;i+=n){ let l=a.slice(i,i+n).join('');
  if(o.length===max-1&&i+n<a.length){ l=a.slice(i,i+n-1).join('')+'…'; o.push(l); break; } o.push(l); if(o.length===max)break; } return o.length?o:['']; }

/* ===== §7.1 フェーズ写像（15戦術／レンジではなくマップ） ===== */
const PHASES=[{k:'prep',n:'準備',hex:'#8A8FF0'},{k:'access',n:'侵入・アクセス',hex:'#34C9C0'},{k:'internal',n:'内部活動・拡大',hex:'#3FBF8F'},{k:'impact',n:'目的達成',hex:'#D8A65A'}];
const PHASE_OF={
  TA0043:0,TA0042:0,
  TA0001:1,TA0002:1,
  TA0003:2,TA0004:2,TA0005:2,TA0112:2,TA0006:2,TA0007:2,TA0008:2,TA0009:2,TA0011:2,
  TA0010:3,TA0040:3 };
function PH(tc){ return PHASES[PHASE_OF[tc.id] ?? 2]; }

/* ===== 付録A：戦術表示名の正規化（Excel JA → 標準JP） ===== */
const TACDISP={TA0043:'偵察',TA0042:'リソース開発',TA0001:'初期アクセス',TA0002:'実行',TA0003:'永続化',
  TA0004:'権限昇格',TA0005:'防御回避',TA0112:'防御機能の妨害',TA0006:'認証情報アクセス',TA0007:'探索',
  TA0008:'横展開',TA0009:'収集',TA0010:'持ち出し',TA0011:'コマンド&コントロール',TA0040:'影響'};
function tacName(tc){ return TACDISP[tc.id]||tc.name; }

/* ===== §7.3 component kinds（エンタープライズ語彙・役割色は ATLAS と同一 rgba） ===== */
const C_rose={f:'rgba(232,120,140,.16)',s:'rgba(232,120,140,.6)',c:'#F6D6DC'};
const C_sky={f:'rgba(52,201,192,.13)',s:'rgba(52,201,192,.5)',c:'#BFEFEA'};
const C_em={f:'rgba(63,191,143,.13)',s:'rgba(63,191,143,.5)',c:'#B6EAD3'};
const C_gold={f:'rgba(216,166,90,.15)',s:'rgba(216,166,90,.55)',c:'#EBD6AF'};
const C_indigo={f:'rgba(138,143,240,.15)',s:'rgba(138,143,240,.55)',c:'#C9CCF8'};
const C_neu={f:'#18233A',s:'rgba(148,170,205,.4)',c:'#C5D0E0'};
const KIND={
 atk:{...C_rose,ic:'☠'},
 ext:{...C_neu,ic:'🌐'},
 email:{...C_sky,ic:'✉'},
 web:{...C_sky,ic:'🧭'},
 edge:{...C_sky,ic:'🛜'},
 endpoint:{...C_indigo,ic:'🖥'},
 server:{...C_indigo,ic:'🗄'},
 ad:{...C_gold,ic:'🏛'},
 cred:{...C_gold,ic:'🔑'},
 net:{...C_sky,ic:'🔀'},
 cloud:{...C_indigo,ic:'☁'},
 share:{...C_neu,ic:'📁'},
 proc:{...C_neu,ic:'⚙'},
 edr:{...C_em,ic:'🛡'},
 user:{...C_neu,ic:'👤'},
 data:{...C_gold,ic:'💎'},
 c2:{...C_rose,ic:'📡'}
};
const LEGEND=[['atk','攻撃者 / C2'],['email','メール/Office'],['web','ブラウザ/Web'],['edge','公開アプリ/境界'],
 ['endpoint','エンドポイント'],['server','サーバー'],['ad','AD/DC/IdP'],['cred','資格情報ストア'],
 ['net','ネットワーク/共有'],['cloud','クラウド'],['proc','プロセス/サービス'],['edr','EDR/監視/SIEM'],['data','データ/クラウンジュエル']];

/* ===== primitives（ATLAS流用） ===== */
function bpt(b,to){ const cx=b.x+b.w/2,cy=b.y+b.h/2; let dx=to[0]-cx,dy=to[1]-cy; if(!dx&&!dy)return[cx,cy];
  const sx=(b.w/2)/Math.abs(dx||1e-6),sy=(b.h/2)/Math.abs(dy||1e-6),t=Math.min(sx,sy); return [cx+dx*t,cy+dy*t]; }
const EK={probe:['flow','#34C9C0','ar-sky'],gain:['flow','#D8A65A','ar-amber'],attack:['flow rose','#E8788C','ar-rose'],data:['edge','#5C6B7F','ar-gray'],def:['flow em','#3FBF8F','ar-em']};
function edgeSVG(a,b,e){ if(!a||!b) return ''; const ca=[a.x+a.w/2,a.y+a.h/2],cb=[b.x+b.w/2,b.y+b.h/2];
  const pa=bpt(a,cb),pb=bpt(b,ca),K=EK[e.kind]||EK.data;
  let g=`<path class="${K[0]}" style="stroke:${K[1]}" d="M${pa[0].toFixed(1)},${pa[1].toFixed(1)} L${pb[0].toFixed(1)},${pb[1].toFixed(1)}" marker-end="url(#${K[2]})"/>`;
  if(e.label){ const mx=(pa[0]+pb[0])/2,my=(pa[1]+pb[1])/2,tw=[...e.label].length*7.2+12;
    g+=`<g class="elabel"><rect x="${(mx-tw/2).toFixed(1)}" y="${(my-9).toFixed(1)}" width="${tw.toFixed(1)}" height="18" rx="5"/><text class="t-mono" x="${mx.toFixed(1)}" y="${(my+3.5).toFixed(1)}" font-size="10" text-anchor="middle" style="fill:${K[1]}">${esc(e.label)}</text></g>`; }
  return g; }
function compSVG(c){ const K=KIND[c.kind]||KIND.endpoint,w=c.w,h=c.h,tgt=c.state==='target';
  const lab=wrap(c.label,Math.max(6,Math.floor((w-44)/8.6)),2);
  let g=`<g><rect x="${c.x}" y="${c.y}" width="${w}" height="${h}" rx="12" style="fill:${K.f};stroke:${tgt?'var(--rose)':K.s};stroke-width:${tgt?1.9:1.4}"/>`;
  g+=`<text x="${c.x+14}" y="${c.y+26}" font-size="15">${K.ic}</text>`;
  g+=`<text class="t-lbl" font-size="12">${lab.map((l,i)=>`<tspan x="${c.x+36}" y="${c.y+(lab.length>1?20:27)+i*15}" style="fill:${K.c}">${esc(l)}</tspan>`).join('')}</text>`;
  if(c.sub) g+=`<text class="t-mono" x="${c.x+14}" y="${c.y+h-9}" font-size="9.5">${esc(c.sub)}</text>`;
  if(tgt){ g+=`<rect class="tgring" x="${c.x-4}" y="${c.y-4}" width="${w+8}" height="${h+8}" rx="15"/>`;
    g+=`<g transform="translate(${c.x+w-10},${c.y-1})"><circle r="10" fill="#E8788C"/><text x="0" y="4" text-anchor="middle" font-size="12" fill="#2A0A11" font-weight="700">⌖</text></g>`; }
  return g+`</g>`; }
function renderScene(spec){ const W=980,H=spec.h||320;
  let s=`<svg class="dgm" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(spec.aria||'攻撃モデル図')}">`;
  if(spec.boundary){ const b=spec.boundary; s+=`<rect class="bnd" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="16"/><text class="t-mono" x="${b.x+14}" y="${b.y+20}" font-size="10.5" style="fill:var(--sky)">${esc(b.label)}</text>`; }
  spec.edges.forEach(e=> s+=edgeSVG(spec.comps[e.from],spec.comps[e.to],e));
  Object.values(spec.comps).forEach(c=> s+=compSVG(c));
  return s+`</svg>`; }

/* ===== scene2: layout-assisted（ATLAS流用） ===== */
function scene2(o){
  const atk={kind:'atk',label:(o.atk&&o.atk.label)||'攻撃者 / C2',sub:(o.atk&&o.atk.sub)||'adversary',w:150,h:64};
  const L=(o.L||[]).map(n=>({kind:n.k,label:n.label,sub:n.sub,w:250,h:58}));
  const S=(o.S||[]).map(n=>({kind:n.k,label:n.label,sub:n.sub,state:n.t?'target':'',w:372,h:58}));
  const nL=L.length,nS=S.length;
  const bndH=nS?40+nS*58+(nS-1)*16+18:0, stackL=nL?nL*58+(nL-1)*16:0;
  const H=Math.max(bndH,stackL,64,196)+56, mid=H/2;
  const bnd=nS?{x:540,y:mid-bndH/2,w:420,h:bndH,label:o.bnd||'標的エンタープライズ'}:null;
  atk.x=36; atk.y=mid-32;
  let ly=mid-stackL/2; L.forEach((n,i)=>{ n.x=232; n.y=ly+i*74; });
  if(bnd){ const sy=bnd.y+38; S.forEach((n,i)=>{ n.x=566; n.y=sy+i*74; }); }
  const comps={atk}; L.forEach((n,i)=>comps['L'+i]=n); S.forEach((n,i)=>comps['S'+i]=n);
  const edges=(o.E||[]).map(e=>({from:e.a,to:e.b,kind:e.k,label:e.l}));
  return {h:H,boundary:bnd,comps,edges,note:o.note,aria:o.aria};
}

/* ===== note を公式説明文(tech.desc)から生成（機序の創作はしない） ===== */
function firstSentence(d){ if(!d) return '';
  let s=String(d).replace(/\s+/g,' ').trim();
  let parts=s.split('。'); let out='';
  for(const p of parts){ if(!p.trim()) continue; out+=p+'。'; if([...out].length>=46) break; }
  if(!out) out=s;
  let a=[...out]; if(a.length>156) out=a.slice(0,154).join('')+'…';
  return out;
}
function sn(x,max){ max=max||22; const a=[...String(x||'')]; return a.length>max? a.slice(0,max-1).join('')+'…':String(x||''); }
function mkNote(t){ return '<b>'+esc(t.name)+'</b> — '+esc(firstSentence(t.desc)); }

/* ===== §7.4 戦術別 標準レイアウト → autoScene ===== */
function autoScene(t,tc){
  const tgt=sn(t.name,22); const note=mkNote(t);
  const id=tc.id;
  let a;
  if(id==='TA0043'){ // 偵察
    a={bnd:'標的組織（公開資産）',note,L:[{k:'ext',label:'公開情報源 / OSINT',sub:'public sources'}],
       S:[{k:'web',label:'標的の公開資産・収集情報',sub:tgt,t:1}],
       E:[{a:'atk',b:'L0',k:'probe',l:'調査'},{a:'L0',b:'S0',k:'data',l:'収集'}]};
  } else if(id==='TA0042'){ // リソース開発
    a={bnd:'攻撃者の準備環境',note,L:[{k:'ext',label:'入手元 / 公開リソース',sub:'acquire'}],
       S:[{k:'c2',label:'構築した攻撃インフラ・資源',sub:tgt,t:1}],
       E:[{a:'atk',b:'L0',k:'probe',l:'取得'},{a:'L0',b:'S0',k:'data',l:'構築'}]};
  } else if(id==='TA0001'){ // 初期アクセス
    a={bnd:'標的エンタープライズ（境界）',note,L:[{k:'email',label:'配信 / 侵入ベクタ',sub:'delivery'}],
       S:[{k:'edge',label:'公開アプリ / 境界',sub:'entry point'},{k:'endpoint',label:'初期足場',sub:tgt,t:1}],
       E:[{a:'atk',b:'L0',k:'attack',l:'送付'},{a:'L0',b:'S0',k:'attack',l:'侵入'},{a:'S0',b:'S1',k:'attack',l:'実行'}]};
  } else if(id==='TA0002'){ // 実行
    a={bnd:'侵害済みエンドポイント',note,
       S:[{k:'endpoint',label:'シェル / 実行環境',sub:'interpreter'},{k:'proc',label:tgt,sub:'payload',t:1}],
       E:[{a:'atk',b:'S0',k:'attack',l:'コマンド実行'},{a:'S0',b:'S1',k:'attack'}]};
  } else if(id==='TA0003'){ // 永続化
    a={bnd:'侵害済みエンドポイント',note,
       S:[{k:'endpoint',label:'侵害ホスト',sub:'host'},{k:'proc',label:tgt,sub:'persistence',t:1}],
       E:[{a:'atk',b:'S0',k:'attack',l:'設置'},{a:'S0',b:'S1',k:'attack',l:'常駐'}]};
  } else if(id==='TA0004'){ // 権限昇格
    a={bnd:'侵害済みエンドポイント',note,
       S:[{k:'endpoint',label:'侵害ホスト（低権限）',sub:'host'},{k:'proc',label:tgt,sub:'elevation',t:1}],
       E:[{a:'atk',b:'S0',k:'attack',l:'悪用'},{a:'S0',b:'S1',k:'attack',l:'昇格'}]};
  } else if(id==='TA0005'){ // 防御回避
    a={bnd:'侵害済み環境',note,
       S:[{k:'endpoint',label:'侵害ホスト',sub:'host'},{k:'edr',label:'EDR / AV / ログ',sub:'evaded',t:1}],
       E:[{a:'atk',b:'S0',k:'attack',l:'操作'},{a:'S0',b:'S1',k:'attack',l:'回避'}]};
  } else if(id==='TA0112'){ // 防御機能の妨害
    a={bnd:'侵害済み環境',note,
       S:[{k:'endpoint',label:'侵害ホスト',sub:'host'},{k:'edr',label:'防御機構 / 監視 / ログ',sub:'impaired',t:1}],
       E:[{a:'atk',b:'S0',k:'attack',l:'操作'},{a:'S0',b:'S1',k:'attack',l:'妨害'}]};
  } else if(id==='TA0006'){ // 認証情報アクセス
    a={bnd:'認証基盤',note,
       S:[{k:'endpoint',label:'侵害ホスト',sub:'host'},{k:'cred',label:'資格情報ストア',sub:tgt,t:1},{k:'ad',label:'AD / ドメイン',sub:'domain'}],
       E:[{a:'atk',b:'S0',k:'attack',l:'操作'},{a:'S0',b:'S1',k:'attack',l:'窃取'},{a:'S1',b:'S2',k:'data',l:'横展開準備'}]};
  } else if(id==='TA0007'){ // 探索
    a={bnd:'内部ネットワーク',note,
       S:[{k:'endpoint',label:'侵害ホスト',sub:'host'},{k:'server',label:'列挙対象（資産/AD/共有）',sub:tgt,t:1}],
       E:[{a:'atk',b:'S0',k:'probe',l:'列挙'},{a:'S0',b:'S1',k:'probe',l:'探索'}]};
  } else if(id==='TA0008'){ // 横展開
    a={bnd:'被害者環境（横展開）',note,
       S:[{k:'cred',label:'窃取した資格情報',sub:'valid creds'},{k:'server',label:'リモートホスト',sub:tgt,t:1}],
       E:[{a:'atk',b:'S0',k:'attack',l:'認証'},{a:'S0',b:'S1',k:'attack',l:'横移動'}]};
  } else if(id==='TA0009'){ // 収集
    a={bnd:'内部ネットワーク',note,
       S:[{k:'endpoint',label:'侵害ホスト',sub:'host'},{k:'data',label:'収集対象データ',sub:tgt,t:1}],
       E:[{a:'atk',b:'S0',k:'attack',l:'アクセス'},{a:'S0',b:'S1',k:'data',l:'収集'}]};
  } else if(id==='TA0011'){ // C2
    a={bnd:'被害者システム ↔ 外部',note,L:[{k:'c2',label:'外部 C2 サーバー',sub:'C2'}],
       S:[{k:'endpoint',label:'被害ホスト / インプラント',sub:tgt,t:1}],
       E:[{a:'L0',b:'S0',k:'data',l:'指令'},{a:'S0',b:'L0',k:'data',l:'通信'}]};
  } else if(id==='TA0010'){ // 持ち出し
    a={bnd:'標的システム → 外部',note,L:[{k:'c2',label:'攻撃者の収集先',sub:'external'}],
       S:[{k:'endpoint',label:'侵害ホスト',sub:'host'},{k:'data',label:'集約データ',sub:tgt,t:1}],
       E:[{a:'S1',b:'S0',k:'data',l:'集約'},{a:'S0',b:'L0',k:'attack',l:'持ち出し'}]};
  } else { // TA0040 影響
    a={bnd:'標的システム（可用性 / 完全性）',note,
       S:[{k:'endpoint',label:'侵害ホスト',sub:'host'},{k:'data',label:tgt,sub:'impact',t:1}],
       E:[{a:'atk',b:'S0',k:'attack',l:'実行'},{a:'S0',b:'S1',k:'attack',l:'妨害/破壊'}]};
  }
  a.aria=t.name+' の攻撃モデル図';
  return scene2(a);
}

/* ===== §7.4 作例：CURATED（公式説明文に準拠した精緻シーン） ===== */
const CURATED={
 'T1566':scene2({bnd:'標的エンタープライズ（境界）',aria:'フィッシングの攻撃モデル図',
   note:'<b>フィッシングメール</b>で悪性添付/リンクをユーザーに開かせ、初期アクセスを得る。',
   L:[{k:'email',label:'フィッシングメール',sub:'attachment/link'},{k:'user',label:'被害者ユーザー',sub:'opens'}],
   S:[{k:'endpoint',label:'ユーザーのエンドポイント',sub:'foothold',t:1}],
   E:[{a:'atk',b:'L0',k:'attack',l:'送信'},{a:'L0',b:'L1',k:'data'},{a:'L1',b:'S0',k:'attack',l:'実行'}]}),
 'T1059':scene2({bnd:'侵害済みエンドポイント',aria:'コマンド/スクリプト実行の攻撃モデル図',
   note:'<b>コマンド/スクリプトインタプリタ</b>（PowerShell/cmd/bash等）でコードを実行する。',
   S:[{k:'endpoint',label:'シェル/インタプリタ',sub:'PowerShell · bash',t:1},{k:'proc',label:'子プロセス/ペイロード',sub:'payload'}],
   E:[{a:'atk',b:'S0',k:'attack',l:'コマンド実行'},{a:'S0',b:'S1',k:'attack'}]}),
 'T1003':scene2({bnd:'認証基盤',aria:'OS資格情報ダンプの攻撃モデル図',
   note:'<b>OS資格情報をダンプ</b>（LSASS/SAM等）し、横移動・権限昇格に用いる。',
   S:[{k:'endpoint',label:'侵害ホスト',sub:'host'},{k:'cred',label:'LSASS / SAM',sub:'credential store',t:1},{k:'ad',label:'AD / ドメイン',sub:'domain'}],
   E:[{a:'atk',b:'S0',k:'attack',l:'ダンプ'},{a:'S0',b:'S1',k:'attack'},{a:'S1',b:'S2',k:'data',l:'横展開準備'}]}),
 'T1021':scene2({bnd:'被害者環境（横展開）',aria:'リモートサービス横移動の攻撃モデル図',
   note:'窃取した資格情報で<b>リモートサービス</b>（RDP/SMB/SSH/WinRM）を使い横移動する。',
   S:[{k:'cred',label:'窃取した資格情報',sub:'valid creds'},{k:'server',label:'リモートホスト/サーバー',sub:'remote host',t:1}],
   E:[{a:'atk',b:'S0',k:'attack',l:'認証'},{a:'S0',b:'S1',k:'attack',l:'横移動'}]}),
 'T1486':scene2({bnd:'標的システム（可用性）',aria:'データ暗号化インパクトの攻撃モデル図',
   note:'<b>データを暗号化</b>してシステム/ネットワークの可用性を妨げる（ランサムウェア）。',
   S:[{k:'endpoint',label:'侵害ホスト',sub:'host'},{k:'data',label:'業務データ/共有',sub:'encrypted',t:1}],
   E:[{a:'atk',b:'S0',k:'attack',l:'暗号化実行'},{a:'S0',b:'S1',k:'attack',l:'可用性喪失'}]})
};

/* ===== bespoke（任意） ===== */
const BESPOKE={}; document.querySelectorAll('#bespoke template').forEach(t=>{ BESPOKE[t.dataset.id]=t.innerHTML; });

/* ===== SCENES：全586件をロード時に生成（図 準備中 0件） ===== */
const SCENES={};
TACTICS.forEach(tc=>tc.techs.forEach(t=>{ if(!SCENES[t.id]) SCENES[t.id]=CURATED[t.id]||autoScene(t,tc); }));

/* ===== platform chips ===== */
function platChips(t){ if(!t.platforms) return '';
  return String(t.platforms).split(/[,、]/).map(p=>p.trim()).filter(Boolean)
    .map(p=>`<span class="chip plat">${esc(p)}</span>`).join(''); }

/* ===== columns ===== */
function mitCol(t){ if(!t.mits||!t.mits.length) return `<div class="blk"><h3>🛡 Mitigation</h3><div class="nomit">本テクニックに個別の緩和策は紐づきません。上位の予防的統制（最小権限・多層防御・監視・パッチ適用）で対応します。</div></div>`;
  return `<div class="blk"><h3>🛡 Mitigation <b>${t.mits.length}</b></h3><div class="mits">${t.mits.map(m=>`<div class="mitc"><span class="mid">${esc(m.id)}</span><span class="mnm">${esc(m.name)}</span>${m.usage?`<div class="mu">${linkify(m.usage)}</div>`:''}</div>`).join('')}</div></div>`; }
function defCol(t){ let h=`<div class="blk"><h3>🛡 D3FEND${t.d3&&t.d3.length?` <b>${t.d3.length}</b>`:''}</h3>`;
  if(t.d3&&t.d3.length){ h+=t.d3.map(d=>`<div class="d3c"><a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.id)} ${esc(d.name)}</a>${d.tactic?`<span class="d3t">${esc(d.tactic)}</span>`:''}</div>`).join(''); }
  else h+=`<div class="d3c">対応する D3FEND 防御技術は本データに紐づきません。検知(Detect)・強化(Harden)・隔離(Isolate)・無害化(Evict) 等の機能面で補完します。</div>`;
  return h+`</div>`; }

/* ===== card ===== */
function card(tech, tac, subs, parent){
  const P=PH(tac);
  const isSub=tech.type==='Sub-Technique';
  const bsp=BESPOKE[tech.id]; const sc=SCENES[tech.id];
  const chips=[`<span class="chip tac">${esc(tacName(tac))} (${esc(tac.id)})</span>`,
    `<span class="chip ph" style="color:${P.hex}">${esc(P.n)}</span>`,
    isSub?`<span class="chip sub">サブテクニック</span>`:`<span class="chip">テクニック</span>`,
    (subs&&subs.length)?`<span class="chip sub">+${subs.length} sub</span>`:'',
    (tech.mits&&tech.mits.length)?`<span class="chip em">緩和 ${tech.mits.length}</span>`:'',
    (tech.d3&&tech.d3.length)?`<span class="chip em">D3FEND ${tech.d3.length}</span>`:'',
    platChips(tech)].join('');
  const subnote=isSub&&(parent||tech.parentName)?`<div class="subnote">親テクニック <span class="pn">${esc(tech.parent||(parent&&parent.id))} ${esc((parent&&parent.name)||tech.parentName||'')}</span> の具体的手法</div>`:'';
  const svg = bsp || (sc?renderScene(sc):'<div style="padding:26px;color:var(--ink4);font-family:var(--mono);font-size:11px">図 準備中</div>');
  const note = sc?sc.note:'';
  return `<article class="card" data-id="${esc(tech.id)}" style="--accent:${P.hex}">
    <div class="chead"><span class="cnum">${esc(tech.id)}</span><div class="cttl"><h2>${esc(tech.name)}</h2><div class="chips">${chips}</div></div></div>
    ${subnote}
    <div class="dgmwrap">${svg}</div>
    ${note?`<p class="scap"><b>この攻撃がなすこと：</b>${note}</p>`:''}
    <p class="adesc">${linkify(tech.desc)}</p>
    <div class="xjumprow"><button class="xjump toMap" onclick="XLINK.go('map','${tech.id}')">🗺 マップで詳細</button><button class="xjump toStory" onclick="XLINK.go('td','${tac.id}')">🛰 ストーリーで戦術を見る</button></div>
    <div class="cols">${mitCol(tech)}${defCol(tech)}</div></article>`;
}
function legendHTML(){ return LEGEND.map(([k,n])=>`<span><i style="background:${KIND[k].f};box-shadow:inset 0 0 0 1.4px ${KIND[k].s}"></i>${KIND[k].ic} ${esc(n)}</span>`).join('')+`<span style="color:var(--rose)">⌖ 標的コンポーネント</span><span style="color:var(--sky)">━ 探索</span><span style="color:var(--rose)">━ 攻撃</span><span style="color:#5C6B7F">━ データ</span><span style="color:var(--emerald)">━ 防御</span>`; }
function buildStrip(){ $('#tacstrip').innerHTML=TACTICS.map((tc,i)=>{ const P=PH(tc);
  return `<button class="dtab" data-tac="${i}" style="--lc:${P.hex}"><span class="dn" style="border-color:${P.hex};color:${P.hex}">${tc.order}</span><span class="dl">${esc(tacName(tc))}</span></button>`; }).join('');
  $('#tacstrip').querySelectorAll('.dtab').forEach(b=>b.addEventListener('click',()=>openTactic(+b.dataset.tac))); }
function markStrip(i){ $('#tacstrip').querySelectorAll('.dtab').forEach((b,j)=>b.classList.toggle('act',i===j)); }
let curTac=0;
function openTactic(i){ curTac=i; const tc=TACTICS[i]; const P=PH(tc); const tops=groupTechs(tc);
  let nt=0,ns=0; tc.techs.forEach(t=>t.type==='Technique'?nt++:ns++);
  let html=`<div class="tac-hero"><div class="eyebrow" style="color:${P.hex}">TACTIC ${String(tc.order).padStart(2,'0')} · ${esc(P.n)}</div>
    <h1>${esc(tacName(tc))}<span class="en">${esc(tc.id)}</span></h1><p class="desc">${linkify(tc.desc)}</p>
    <div class="meta">${nt} テクニック ／ ${ns} サブ ・ この戦術の全 ${tc.techs.length} 図</div>
    <div class="complegend">${legendHTML()}</div></div>`;
  tops.forEach(({tech,subs})=>{ html+=card(tech,tc,subs,null); subs.forEach(su=>html+=card(su,tc,null,tech)); });
  $('#searchview').style.display='none'; $('#stage').style.display=''; $('#stage').innerHTML=html;
  markStrip(i); window.scrollTo({top:0,behavior:'smooth'}); }
let IDX=null;
function buildIndex(){ IDX=[]; TACTICS.forEach((tc,i)=>{ const tops=groupTechs(tc);
  tops.forEach(({tech,subs})=>{ IDX.push({tech,tac:tc,subs,parent:null,hay:hay(tech)}); (subs||[]).forEach(su=>IDX.push({tech:su,tac:tc,subs:null,parent:tech,hay:hay(su)})); }); }); }
function hay(t){ return (t.id+' '+t.name+' '+(t.desc||'')+' '+(t.platforms||'')+' '+(t.mits||[]).map(m=>m.id+m.name).join(' ')+' '+(t.d3||[]).map(d=>d.id+d.name).join(' ')).toLowerCase(); }
function runSearch(q){ if(!IDX)buildIndex(); q=q.trim().toLowerCase();
  if(!q){ $('#searchview').style.display='none'; $('#stage').style.display=''; markStrip(curTac); return; }
  const terms=q.split(/\s+/); const hits=IDX.filter(it=>terms.every(t=>it.hay.includes(t)));
  let html=`<div class="tac-hero"><div class="eyebrow">SEARCH</div><h1>検索結果<span class="en">"${esc(q)}"</span></h1><div class="meta"><b style="color:var(--sky)">${hits.length}</b> 件${hits.length>80?'（先頭80件）':''}</div></div>`;
  hits.slice(0,80).forEach(it=>html+=card(it.tech,it.tac,it.subs,it.parent));
  if(!hits.length) html+=`<div class="empty">該当なし。</div>`;
  $('#stage').style.display='none'; $('#searchview').style.display=''; $('#searchview').innerHTML=html;
  $('#tacstrip').querySelectorAll('.dtab').forEach(b=>b.classList.remove('act')); window.scrollTo({top:0,behavior:'smooth'}); }
function jumpToId(id){ for(let i=0;i<TACTICS.length;i++){ if(TACTICS[i].techs.some(t=>t.id===id)){ openTactic(i);
  setTimeout(()=>{ const el=document.querySelector('.card[data-id="'+id+'"]'); if(el&&el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'start'}); },80); return; } } }
function init(){ let total=0; const uniq=new Set(); TACTICS.forEach(tc=>tc.techs.forEach(t=>{total++;uniq.add(t.id);}));
  $('#cnt').innerHTML=`<b>${uniq.size}</b> テクニック · ${SCENES&&Object.keys(SCENES).length} 図`;
  buildStrip(); openTactic(0);
  const si=$('#search'); let tmr=null; si.addEventListener('input',()=>{clearTimeout(tmr);tmr=setTimeout(()=>runSearch(si.value),200);});
  si.addEventListener('keydown',e=>{ if(e.key==='Escape'){ si.value=''; runSearch(''); } });
  window.addEventListener('message',e=>{ const d=e.data||{}; if(d.type==='scrollTo'&&d.id) jumpToId(d.id); });
  if(location.hash) jumpToId(location.hash.slice(1));
  window.__gotoId=function(id){ for(let i=0;i<TACTICS.length;i++){ if(TACTICS[i].id===id){ openTactic(i); return; } } jumpToId(id); };
  if(window.XLINK) XLINK.ready();
}
if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded',init);
