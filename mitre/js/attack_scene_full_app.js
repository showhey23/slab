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

/* ===================================================================
   LATERAL MOVEMENT INTERACTIVE SCENES
   =================================================================== */
(function(){
'use strict';
const LATERAL_DATA={
'T1021':{
  title:'Remote Services',
  purpose:'正規のリモート管理経路（RDP/SSH/WinRM/SMB）を使って別ホストへ横移動する',
  watch:['認証素材(パスワード/ハッシュ/チケット)','リモートサービスポート','移動先プロセス生成','認証ログ(EVT4624/4648)'],
  nodes:{
    atk:       {k:'atk',     lb:'攻撃者/C2',          sb:'adversary',        lyr:'attack'},
    srchost:   {k:'endpoint',lb:'侵害済みホスト',        sb:'compromised host',  lyr:'attack'},
    srcproc:   {k:'proc',    lb:'攻撃ツール/シェル',     sb:'adversary tool',    lyr:'process'},
    cred:      {k:'cred',    lb:'認証素材',              sb:'password/hash/ticket',lyr:'cred'},
    remotesvc: {k:'net',     lb:'リモートサービス',       sb:'RDP/SMB/WinRM/SSH', lyr:'network'},
    dsthost:   {k:'server',  lb:'移動先ホスト',           sb:'lateral target',    lyr:'attack',tgt:1},
    dstproc:   {k:'proc',    lb:'生成プロセス/セッション', sb:'remote session',    lyr:'process'},
    'det-auth':{k:'edr',    lb:'認証ログ',               sb:'EVT 4624 / 4648',   lyr:'detection'},
    'det-proc':{k:'edr',    lb:'プロセス生成',            sb:'EVT 4688 / 7045',   lyr:'detection'},
    'det-net': {k:'edr',    lb:'ネットワークフロー',       sb:'firewall / NDR',    lyr:'detection'},
  },
  edges:[
    {f:'atk',      t:'srchost',  k:'attack',lb:'C2'},
    {f:'srchost',  t:'srcproc',  k:'attack',lb:'起動',  lyr:'process'},
    {f:'srcproc',  t:'cred',     k:'gain',  lb:'読取',  lyr:'cred'},
    {f:'cred',     t:'remotesvc',k:'attack',lb:'認証',  lyr:'network'},
    {f:'remotesvc',t:'dsthost',  k:'attack',lb:'接続'},
    {f:'dsthost',  t:'dstproc',  k:'attack',lb:'生成',  lyr:'process'},
    {f:'det-auth', t:'remotesvc',k:'def',   lb:'検知',  lyr:'detection'},
    {f:'det-proc', t:'dstproc',  k:'def',   lb:'検知',  lyr:'detection'},
    {f:'det-net',  t:'remotesvc',k:'def',   lb:'検知',  lyr:'detection'},
  ],
  steps:[
    {n:1,title:'ターゲット選定・足場確認',
     desc:'C2経由で侵害済みホストを操作し、内部探索で移動先ホストとリモートサービスのポートを確認する。',
     active:['atk','srchost'],flowing:['atk→srchost'],detect:[],mit:[]},
    {n:2,title:'攻撃ツール起動・認証素材取得',
     desc:'侵害ホスト上で攻撃ツールを起動し、LSASS/SAM/Kerberosから資格情報（パスワード/ハッシュ/チケット）を取得する。',
     active:['srchost','srcproc','cred'],flowing:['srchost→srcproc','srcproc→cred'],
     detect:[],mit:['M1027 パスワード管理','M1026 権限管理（最小権限）']},
    {n:3,title:'リモートサービスへ接続',
     desc:'窃取した認証素材でターゲットのリモートサービス（RDP/SMB/WinRM/SSH）へ接続する。',
     active:['cred','remotesvc'],flowing:['cred→remotesvc'],
     detect:['det-net'],mit:['M1037 ネットワークフィルタリング']},
    {n:4,title:'認証・セッション確立',
     desc:'リモートサービスに正規ユーザーとして認証し、移動先ホストでセッションを確立する。',
     active:['remotesvc','dsthost'],flowing:['remotesvc→dsthost'],
     detect:['det-auth'],mit:['M1032 多要素認証']},
    {n:5,title:'移動先でプロセス・セッション生成',
     desc:'移動先ホスト上でシェル/サービス/セッションが生成される。攻撃者はここを新たな足場とする。',
     active:['dsthost','dstproc'],flowing:['dsthost→dstproc'],
     detect:['det-auth','det-proc'],mit:['M1026 最小権限','M1018 ユーザー管理']},
    {n:6,title:'ツール転送・次ホストへ連鎖',
     desc:'移動先で追加ツール/バックドアを展開し、さらなる横展開や目的達成フェーズへ移行する。',
     active:['atk','srchost','srcproc','cred','remotesvc','dsthost','dstproc'],
     flowing:['atk→srchost','srchost→srcproc','srcproc→cred','cred→remotesvc','remotesvc→dsthost','dsthost→dstproc'],
     detect:['det-net','det-auth','det-proc'],mit:[]},
    {n:7,title:'検知・防御ポイント',
     desc:'ネットワークフロー（リモートポートへの不審接続）、認証ログ（EVT4624/4648）、プロセス/サービス生成（EVT7045/4688）が主要な検知機会。',
     active:['det-auth','det-proc','det-net'],
     flowing:['det-auth→remotesvc','det-proc→dstproc','det-net→remotesvc'],
     detect:['det-net','det-auth','det-proc'],
     mit:['M1018 ユーザーアカウント管理','M1032 多要素認証','M1037 ネットワークフィルタリング']},
  ],
  lay:{
    atk:       {x:10, y:160,w:130,h:56},
    srchost:   {x:185,y:80, w:160,h:56},
    srcproc:   {x:185,y:200,w:160,h:56},
    cred:      {x:400,y:140,w:160,h:56},
    remotesvc: {x:608,y:140,w:165,h:56},
    dsthost:   {x:820,y:80, w:150,h:56},
    dstproc:   {x:820,y:200,w:150,h:56},
    'det-auth':{x:558,y:324,w:178,h:50},
    'det-proc':{x:762,y:324,w:195,h:50},
    'det-net': {x:354,y:324,w:178,h:50},
  }
},
'T1021.002':{
  title:'SMB / Windows Admin Shares',
  purpose:'窃取した資格情報でSMB管理共有(ADMIN$/C$)へ接続しファイル転送・SCMコマンド実行で横移動する',
  watch:['NT Hash/パスワード','TCP 445','管理共有アクセス(ADMIN$/C$)','SCMサービス作成','EVT4624/4776/7045'],
  nodes:{
    atk:       {k:'atk',     lb:'攻撃者/C2',         sb:'adversary',          lyr:'attack'},
    srchost:   {k:'endpoint',lb:'侵害済みホスト',       sb:'compromised host',   lyr:'attack'},
    srcproc:   {k:'proc',    lb:'net.exe / impacket', sb:'attacker tool',      lyr:'process'},
    cred:      {k:'cred',    lb:'NT Hash / Password', sb:'credential material', lyr:'cred'},
    smb:       {k:'net',     lb:'SMB (TCP 445)',       sb:'network channel',    lyr:'network'},
    admshare:  {k:'share',   lb:'管理共有 ADMIN$/C$',  sb:'remote service',     lyr:'attack',tgt:1},
    dsthost:   {k:'server',  lb:'移動先ホスト',          sb:'lateral target',    lyr:'attack',tgt:1},
    dstproc:   {k:'proc',    lb:'サービス生成 (SCM)',    sb:'SYSTEM context',    lyr:'process'},
    'det-auth':{k:'edr',    lb:'認証ログ',              sb:'EVT4624/4648/4776', lyr:'detection'},
    'det-proc':{k:'edr',    lb:'プロセス/サービス生成', sb:'EVT4688/7045',       lyr:'detection'},
    'det-net': {k:'edr',    lb:'SMBフロー',             sb:'tcp/445 NDR/FW',    lyr:'detection'},
  },
  edges:[
    {f:'atk',     t:'srchost',  k:'attack',lb:'C2'},
    {f:'srchost', t:'srcproc',  k:'attack',lb:'起動',    lyr:'process'},
    {f:'srcproc', t:'cred',     k:'gain',  lb:'Hash取得',lyr:'cred'},
    {f:'cred',    t:'smb',      k:'attack',lb:'Pass',    lyr:'network'},
    {f:'smb',     t:'admshare', k:'attack',lb:'接続'},
    {f:'admshare',t:'dsthost',  k:'attack',lb:'書込/実行'},
    {f:'dsthost', t:'dstproc',  k:'attack',lb:'SCM起動', lyr:'process'},
    {f:'det-auth',t:'admshare', k:'def',   lb:'検知',    lyr:'detection'},
    {f:'det-proc',t:'dstproc',  k:'def',   lb:'検知',    lyr:'detection'},
    {f:'det-net', t:'smb',      k:'def',   lb:'検知',    lyr:'detection'},
  ],
  steps:[
    {n:1,title:'ターゲット選定・SMBポート確認',
     desc:'攻撃者はC2経由で侵害済みホストを操作し、SMB(445)が開いている移動先ホストと管理共有を探索する。',
     active:['atk','srchost'],flowing:['atk→srchost'],detect:[],mit:[]},
    {n:2,title:'NT Hash取得（Pass the Hash準備）',
     desc:'LSASS/SAMから移動先ユーザーのNTハッシュを窃取する。パスワードの平文は不要——これがPtHの準備段階。',
     active:['srchost','srcproc','cred'],flowing:['srchost→srcproc','srcproc→cred'],
     detect:[],mit:['M1027 パスワード管理（Credential Guard）','M1026 LSASS保護']},
    {n:3,title:'SMB接続・管理共有アクセス',
     desc:'NTハッシュを使ってSMBでNTLM認証し、管理共有（ADMIN$・C$）へアクセスする。',
     active:['cred','smb','admshare'],flowing:['cred→smb','smb→admshare'],
     detect:['det-net','det-auth'],mit:['M1037 SMBポートフィルタリング','M1035 管理共有の無効化']},
    {n:4,title:'ファイル転送・ペイロード書き込み',
     desc:'管理共有経由で実行ファイル/ペイロードを移動先ホストへ転送する。',
     active:['admshare','dsthost'],flowing:['admshare→dsthost'],
     detect:['det-auth'],mit:['M1035 管理共有の制限']},
    {n:5,title:'SCMでサービスを作成・実行',
     desc:'SCM（サービスコントロールマネージャ）でリモートサービスを作成し、SYSTEM権限でペイロードを実行する。',
     active:['dsthost','dstproc'],flowing:['dsthost→dstproc'],
     detect:['det-auth','det-proc'],mit:['M1026 最小権限','M1018 ユーザー管理']},
    {n:6,title:'横移動完了・次展開',
     desc:'移動先ホスト上でバックドアが起動しC2との通信が確立される。全攻撃パスがアクティブ。',
     active:['atk','srchost','srcproc','cred','smb','admshare','dsthost','dstproc'],
     flowing:['atk→srchost','srchost→srcproc','srcproc→cred','cred→smb','smb→admshare','admshare→dsthost','dsthost→dstproc'],
     detect:['det-net','det-auth','det-proc'],mit:[]},
    {n:7,title:'検知・防御ポイント',
     desc:'SMBポート445へのアクセス（NDR/FW）、NTLM認証（EVT4624/4776）、管理共有書き込み、サービス作成（EVT7045）が検知機会。',
     active:['det-auth','det-proc','det-net'],
     flowing:['det-auth→admshare','det-proc→dstproc','det-net→smb'],
     detect:['det-net','det-auth','det-proc'],
     mit:['M1018 ユーザーアカウント管理','M1035 管理共有制限','M1037 ネットワークフィルタリング']},
  ],
  lay:{
    atk:       {x:10, y:155,w:130,h:56},
    srchost:   {x:185,y:75, w:160,h:56},
    srcproc:   {x:185,y:195,w:160,h:56},
    cred:      {x:390,y:135,w:165,h:56},
    smb:       {x:600,y:75, w:155,h:56},
    admshare:  {x:600,y:195,w:155,h:56},
    dsthost:   {x:812,y:75, w:158,h:56},
    dstproc:   {x:812,y:195,w:158,h:56},
    'det-auth':{x:548,y:320,w:182,h:50},
    'det-proc':{x:762,y:320,w:195,h:50},
    'det-net': {x:334,y:320,w:182,h:50},
  }
},
'T1550.002':{
  title:'Pass the Hash',
  purpose:'NT HashをパスワードなしでNTLM認証に直接使用し移動先ホストへの認証を成立させる',
  watch:['LSSASSアクセス(Sysmon EVT10)','NTLM Type3(EVT4624/4776)','ハッシュリレー','横展開連鎖'],
  nodes:{
    atk:        {k:'atk',     lb:'攻撃者/C2',          sb:'adversary',             lyr:'attack'},
    srchost:    {k:'endpoint',lb:'侵害済みホスト',        sb:'compromised host',      lyr:'attack'},
    srcproc:    {k:'proc',    lb:'Mimikatz / PtH tool', sb:'attacker tool',         lyr:'process'},
    lsass:      {k:'cred',    lb:'LSASS / SAMハイブ',   sb:'credential store',      lyr:'cred'},
    hash:       {k:'cred',    lb:'NT Hash',             sb:'no password needed',    lyr:'cred'},
    ntlm:       {k:'net',     lb:'NTLM Challenge/Resp', sb:'Type1/2/3 no plaintext',lyr:'network'},
    dsthost:    {k:'server',  lb:'移動先ホスト/サービス',  sb:'lateral target',        lyr:'attack',tgt:1},
    dstproc:    {k:'proc',    lb:'生成セッション/プロセス',sb:'authenticated session', lyr:'process'},
    'det-lsass':{k:'edr',    lb:'LSSASSアクセス',        sb:'Sysmon/EDR EVT10',     lyr:'detection'},
    'det-auth': {k:'edr',    lb:'NTLM認証ログ',           sb:'EVT4624(type3)/4776',  lyr:'detection'},
    'det-proc': {k:'edr',    lb:'プロセス/セッション生成', sb:'EVT4688/4768',          lyr:'detection'},
  },
  edges:[
    {f:'atk',      t:'srchost', k:'attack',lb:'C2'},
    {f:'srchost',  t:'srcproc', k:'attack',lb:'起動',        lyr:'process'},
    {f:'srcproc',  t:'lsass',   k:'attack',lb:'ダンプ',      lyr:'cred'},
    {f:'lsass',    t:'hash',    k:'gain',  lb:'Hash抽出',    lyr:'cred'},
    {f:'hash',     t:'ntlm',    k:'attack',lb:'inject',      lyr:'network'},
    {f:'ntlm',     t:'dsthost', k:'attack',lb:'NTLM auth'},
    {f:'dsthost',  t:'dstproc', k:'attack',lb:'セッション確立',lyr:'process'},
    {f:'det-lsass',t:'lsass',   k:'def',   lb:'検知',        lyr:'detection'},
    {f:'det-auth', t:'ntlm',    k:'def',   lb:'検知',        lyr:'detection'},
    {f:'det-proc', t:'dstproc', k:'def',   lb:'検知',        lyr:'detection'},
  ],
  steps:[
    {n:1,title:'侵害済みホストへのアクセス',
     desc:'攻撃者はC2経由で既に侵害したホスト上で操作権を持つ。NT Hashがあればパスワードを知らなくてもよい——これがPtHの前提。',
     active:['atk','srchost'],flowing:['atk→srchost'],detect:[],mit:[]},
    {n:2,title:'LSASS/SAMからNT Hashを窃取',
     desc:'Mimikatz等でLSASSメモリやSAMレジストリハイブからNTハッシュを抽出する。これが「パスザハッシュ」の核心。',
     active:['srchost','srcproc','lsass','hash'],flowing:['srchost→srcproc','srcproc→lsass','lsass→hash'],
     detect:['det-lsass'],mit:['M1043 Credential Guard','M1028 OS設定強化（LSASS保護）']},
    {n:3,title:'NT HashをNTLM認証に直接注入',
     desc:'ハッシュをそのままNTLM Challenge/Response（Type1/2/3）に使用する。平文パスワードは不要——これがPtHの本質。',
     active:['hash','ntlm'],flowing:['hash→ntlm'],
     detect:['det-auth'],mit:['M1052 NTLM制限（NTLMv2強制/Kerberos優先）']},
    {n:4,title:'移動先ホストで認証成立',
     desc:'NTLMで認証が通り、移動先ホスト/サービスへのアクセスが確立する。正規認証と外見上は区別困難。',
     active:['ntlm','dsthost'],flowing:['ntlm→dsthost'],
     detect:['det-auth'],mit:['M1032 多要素認証']},
    {n:5,title:'セッション・プロセスが生成',
     desc:'移動先でシェル/サービス/セッションが生成される。攻撃者は新たな足場を得る。',
     active:['dsthost','dstproc'],flowing:['dsthost→dstproc'],
     detect:['det-auth','det-proc'],mit:['M1026 最小権限']},
    {n:6,title:'連鎖・フォレスト横断も可能',
     desc:'新たな足場から再びLSASSをダンプし別ホストへPtHで移動——ドメイン/フォレスト横断まで連鎖しうる。',
     active:['atk','srchost','srcproc','lsass','hash','ntlm','dsthost','dstproc'],
     flowing:['atk→srchost','srchost→srcproc','srcproc→lsass','lsass→hash','hash→ntlm','ntlm→dsthost','dsthost→dstproc'],
     detect:['det-lsass','det-auth','det-proc'],mit:[]},
    {n:7,title:'検知・防御ポイント',
     desc:'LSSASSアクセス（Sysmon/EDR EVT10）、NTLM Type3ログイン（EVT4624/4776）、横展開先のプロセス生成（EVT4688）が主要な検知機会。',
     active:['det-lsass','det-auth','det-proc'],
     flowing:['det-lsass→lsass','det-auth→ntlm','det-proc→dstproc'],
     detect:['det-lsass','det-auth','det-proc'],
     mit:['M1043 Credential Guard','M1052 NTLM制限','M1026 最小権限','M1032 MFA']},
  ],
  lay:{
    atk:        {x:10, y:155,w:130,h:56},
    srchost:    {x:185,y:75, w:155,h:56},
    srcproc:    {x:185,y:200,w:155,h:56},
    lsass:      {x:385,y:75, w:155,h:56},
    hash:       {x:385,y:200,w:155,h:56},
    ntlm:       {x:590,y:135,w:155,h:56},
    dsthost:    {x:800,y:75, w:165,h:56},
    dstproc:    {x:800,y:200,w:165,h:56},
    'det-lsass':{x:340,y:322,w:178,h:50},
    'det-auth': {x:548,y:322,w:182,h:50},
    'det-proc': {x:762,y:322,w:195,h:50},
  }
},
'T1570':{
  title:'Lateral Tool Transfer',
  purpose:'侵害済みシステム間でツール・マルウェア・ペイロードを転送して感染範囲を広げ攻撃能力を展開する',
  watch:['管理共有/SMB書込み','ファイル転送コマンド(copy/SCP/BITS)','署名なし実行ファイル','異常なネットワーク転送'],
  nodes:{
    atk:       {k:'atk',     lb:'攻撃者/C2',              sb:'adversary',          lyr:'attack'},
    srchost:   {k:'endpoint',lb:'侵害済みホスト（転送元）',  sb:'source host',        lyr:'attack'},
    srcproc:   {k:'proc',    lb:'転送プロセス',              sb:'copy/scp/bitsadmin', lyr:'process'},
    payload:   {k:'cred',    lb:'ツール/ペイロード',          sb:'malware/RAT/script', lyr:'cred'},
    channel:   {k:'net',     lb:'転送チャネル',               sb:'SMB/HTTP/SCP/BITS', lyr:'network'},
    dstshare:  {k:'share',   lb:'書込み先（共有/Dir）',        sb:'remote path',       lyr:'attack',tgt:1},
    dsthost:   {k:'server',  lb:'移動先ホスト',               sb:'lateral target',    lyr:'attack',tgt:1},
    dstproc:   {k:'proc',    lb:'実行プロセス（ペイロード）',   sb:'payload execution', lyr:'process'},
    'det-file':{k:'edr',    lb:'ファイル転送/書込み',          sb:'Sysmon/EDR FIM',    lyr:'detection'},
    'det-net': {k:'edr',    lb:'転送ネットワークフロー',        sb:'NDR/FW/proxy',      lyr:'detection'},
    'det-proc':{k:'edr',    lb:'署名なし実行',                 sb:'EVT4688/AppLocker', lyr:'detection'},
  },
  edges:[
    {f:'atk',     t:'srchost',  k:'attack',lb:'C2指令'},
    {f:'srchost', t:'srcproc',  k:'attack',lb:'起動',    lyr:'process'},
    {f:'srcproc', t:'payload',  k:'data',  lb:'準備',    lyr:'cred'},
    {f:'payload', t:'channel',  k:'attack',lb:'送出',    lyr:'network'},
    {f:'channel', t:'dstshare', k:'attack',lb:'書込み'},
    {f:'dstshare',t:'dsthost',  k:'attack',lb:'配置'},
    {f:'dsthost', t:'dstproc',  k:'attack',lb:'実行',    lyr:'process'},
    {f:'det-file',t:'dstshare', k:'def',   lb:'検知',    lyr:'detection'},
    {f:'det-net', t:'channel',  k:'def',   lb:'検知',    lyr:'detection'},
    {f:'det-proc',t:'dstproc',  k:'def',   lb:'検知',    lyr:'detection'},
  ],
  steps:[
    {n:1,title:'転送先選定・チャネル確認',
     desc:'攻撃者はC2経由で侵害済みホストを操作し、ツール転送先と利用可能なチャネル（SMB/HTTP/SCP/BITS）を確認する。',
     active:['atk','srchost'],flowing:['atk→srchost'],detect:[],mit:[]},
    {n:2,title:'転送プロセス起動・ペイロード準備',
     desc:'侵害ホスト上で転送プロセス（copy/scp/bitsadmin/PowerShell WebClient等）を起動しペイロードを準備する。',
     active:['srchost','srcproc','payload'],flowing:['srchost→srcproc','srcproc→payload'],
     detect:[],mit:['M1038 AppLocker/ソフトウェア制限']},
    {n:3,title:'転送チャネルでペイロード送出',
     desc:'SMB管理共有・HTTP・SCP・BITSジョブ等の転送チャネルを経由してペイロードを移動先へ送出する。',
     active:['payload','channel'],flowing:['payload→channel'],
     detect:['det-net'],mit:['M1037 ネットワークフィルタリング']},
    {n:4,title:'移動先ホストへ書き込み・配置',
     desc:'転送されたペイロードが移動先ホストのファイルシステム（管理共有・Temp/AppData等）へ書き込まれる。',
     active:['channel','dstshare','dsthost'],flowing:['channel→dstshare','dstshare→dsthost'],
     detect:['det-net','det-file'],mit:['M1035 管理共有の制限']},
    {n:5,title:'ペイロード実行・感染展開',
     desc:'移動先ホスト上でペイロード（マルウェア/RAT/スクリプト）が実行され、新たな侵害足場が確立する。',
     active:['dsthost','dstproc'],flowing:['dsthost→dstproc'],
     detect:['det-file','det-proc'],mit:['M1038 AppLocker','M1022 ファイルシステム保護']},
    {n:6,title:'C2確立・次展開の連鎖',
     desc:'移動先でC2通信が確立し、そこから再び別ホストへのツール転送・横展開が連鎖する。',
     active:['atk','srchost','srcproc','payload','channel','dstshare','dsthost','dstproc'],
     flowing:['atk→srchost','srchost→srcproc','srcproc→payload','payload→channel','channel→dstshare','dstshare→dsthost','dsthost→dstproc'],
     detect:['det-net','det-file','det-proc'],mit:[]},
    {n:7,title:'検知・防御ポイント',
     desc:'管理共有への書き込み（EDR/FIM）、異常なネットワーク転送フロー（NDR）、署名なし実行ファイルの起動（EVT4688/AppLocker）が検知機会。',
     active:['det-file','det-net','det-proc'],
     flowing:['det-file→dstshare','det-net→channel','det-proc→dstproc'],
     detect:['det-file','det-net','det-proc'],
     mit:['M1038 AppLocker/Whitelisting','M1022 ファイルシステム保護','M1035 管理共有制限','M1037 ネットワークフィルタリング']},
  ],
  lay:{
    atk:       {x:10, y:155,w:130,h:56},
    srchost:   {x:185,y:75, w:155,h:56},
    srcproc:   {x:185,y:200,w:155,h:56},
    payload:   {x:385,y:135,w:160,h:56},
    channel:   {x:592,y:75, w:155,h:56},
    dstshare:  {x:592,y:200,w:155,h:56},
    dsthost:   {x:802,y:75, w:165,h:56},
    dstproc:   {x:802,y:200,w:165,h:56},
    'det-file':{x:548,y:322,w:178,h:50},
    'det-net': {x:340,y:322,w:178,h:50},
    'det-proc':{x:758,y:322,w:195,h:50},
  }
},
}; /* end LATERAL_DATA */

const LM_EK={
  attack:{cls:'flow rose',stroke:'var(--rose)',   mk:'ar-rose'},
  gain:  {cls:'flow',     stroke:'var(--amber)',  mk:'ar-amber'},
  data:  {cls:'edge',     stroke:'#5C6B7F',       mk:'ar-gray'},
  def:   {cls:'flow em',  stroke:'var(--emerald)',mk:'ar-em'},
};
function lmBpt(pos,toXY){
  const cx=pos.x+pos.w/2,cy=pos.y+pos.h/2;
  let dx=toXY[0]-cx,dy=toXY[1]-cy;
  if(!dx&&!dy)return[cx,cy];
  const sx=(pos.w/2)/Math.abs(dx||1e-9),sy=(pos.h/2)/Math.abs(dy||1e-9);
  return[cx+dx*Math.min(sx,sy),cy+dy*Math.min(sx,sy)];
}
function lmNodeSVG(id,nd,lay,lid){
  const pos=lay[id];if(!pos)return'';
  const K=KIND[nd.k]||KIND.endpoint;
  const {x,y,w,h}=pos,lyr=nd.lyr||'attack';
  const lb=wrap(nd.lb,Math.max(6,Math.floor((w-42)/8.2)),2);
  let g=`<g class="lm-node dim lm-layer-${lyr}" data-nid="${id}" id="${lid}_n_${id.replace(/\W/g,'_')}">`;
  g+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="11" style="fill:${K.f};stroke:${nd.tgt?'var(--rose)':K.s};stroke-width:${nd.tgt?1.9:1.4}"/>`;
  if(nd.tgt){
    g+=`<rect class="tgring" x="${x-4}" y="${y-4}" width="${w+8}" height="${h+8}" rx="14"/>`;
    g+=`<g transform="translate(${x+w-9},${y-1})"><circle r="9" fill="var(--rose)"/><text x="0" y="3.5" text-anchor="middle" font-size="11" fill="#2A0A11" font-weight="700">⌖</text></g>`;
  }
  g+=`<text x="${x+13}" y="${y+25}" font-size="14">${K.ic}</text>`;
  g+=`<text class="t-lbl" font-size="11.5">${lb.map((l,i)=>`<tspan x="${x+34}" y="${y+(lb.length>1?18:25)+i*14}" style="fill:${K.c}">${esc(l)}</tspan>`).join('')}</text>`;
  if(nd.sb)g+=`<text class="t-mono" x="${x+13}" y="${y+h-9}" font-size="9">${esc(nd.sb)}</text>`;
  return g+`</g>`;
}
function lmEdgeSVG(e,lay,lid){
  const fp=lay[e.f],tp=lay[e.t];if(!fp||!tp)return'';
  const K=LM_EK[e.k]||LM_EK.data,lyr=e.lyr||'attack';
  const ca=[fp.x+fp.w/2,fp.y+fp.h/2],cb=[tp.x+tp.w/2,tp.y+tp.h/2];
  const pa=lmBpt(fp,cb),pb=lmBpt(tp,ca);
  const eid=`${e.f}→${e.t}`;
  let g=`<g class="lm-edge dim lm-layer-${lyr}" data-eid="${eid}" id="${lid}_e_${eid.replace(/\W/g,'_')}">`;
  g+=`<path class="${K.cls}" style="stroke:${K.stroke}" d="M${pa[0].toFixed(1)},${pa[1].toFixed(1)} L${pb[0].toFixed(1)},${pb[1].toFixed(1)}" marker-end="url(#${K.mk})"/>`;
  if(e.lb){
    const mx=(pa[0]+pb[0])/2,my=(pa[1]+pb[1])/2,tw=[...e.lb].length*7+12;
    g+=`<g class="elabel"><rect x="${(mx-tw/2).toFixed(1)}" y="${(my-9).toFixed(1)}" width="${tw.toFixed(1)}" height="17" rx="4"/><text class="t-mono" x="${mx.toFixed(1)}" y="${(my+3).toFixed(1)}" font-size="9.5" text-anchor="middle" style="fill:${K.stroke}">${esc(e.lb)}</text></g>`;
  }
  return g+`</g>`;
}
const LM_DET_LBL={'det-auth':'認証ログ','det-proc':'プロセス生成','det-net':'ネットワークフロー','det-lsass':'LSSASSアクセス','det-file':'ファイル書込み'};
function buildDetMit(step){
  let h='';
  (step.detect||[]).forEach(d=>{h+=`<span class="lm-dtag em">🛡 ${esc(LM_DET_LBL[d]||d)}</span>`;});
  (step.mit||[]).forEach(m=>{h+=`<span class="lm-dtag amber">🔒 ${esc(m)}</span>`;});
  return h||`<span class="lm-dtag" style="color:var(--ink4)">観測困難なステップ（事前防御が鍵）</span>`;
}
let lmCnt=0;
function buildLateralHTML(tid){
  const d=LATERAL_DATA[tid];if(!d)return null;
  const lid='lm'+(++lmCnt),lay=d.lay,ns=d.nodes;
  let svg=`<svg class="dgm" viewBox="0 0 980 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(d.title)} 攻撃モデル図" id="${lid}_svg">`;
  d.edges.forEach(e=>svg+=lmEdgeSVG(e,lay,lid));
  Object.entries(ns).forEach(([id,nd])=>svg+=lmNodeSVG(id,nd,lay,lid));
  svg+=`</svg>`;
  const LYRS=[['attack','攻撃フロー'],['process','プロセス'],['cred','認証素材'],['network','ネットワーク'],['detection','検知']];
  const layerBtns=LYRS.map(([l,lb])=>`<button class="lm-layer on" data-l="${l}" onclick="lmToggleLayer('${lid}','${l}',this)">${esc(lb)}</button>`).join('');
  const pips=d.steps.map((_,i)=>`<span class="lm-pip${i===0?' on':''}" id="${lid}_pip${i}"></span>`).join('');
  const watchTags=(d.watch||[]).map(w=>`<span class="lm-wtag">${esc(w)}</span>`).join('');
  const s0=d.steps[0];
  return `<div class="lm-wrap" data-lm-tid="${esc(tid)}" id="${lid}">
<div class="lm-hdr"><div class="lm-hdr-purpose"><div class="lm-hdr-lbl">攻撃目的</div><div class="lm-hdr-txt">${esc(d.purpose)}</div></div><div><div class="lm-hdr-lbl">見るべきポイント</div><div class="lm-watches">${watchTags}</div></div></div>
<div class="lm-layers">${layerBtns}</div>
<div class="lm-svgwrap">${svg}</div>
<div class="lm-playbar">
  <button class="lm-pbtn" onclick="lmStep('${lid}',-1)" title="前へ">⏮</button>
  <button class="lm-pbtn" id="${lid}_pb" onclick="lmTogglePlay('${lid}')" title="再生">▶</button>
  <button class="lm-pbtn" onclick="lmStep('${lid}',1)" title="次へ">⏭</button>
  <button class="lm-pbtn" onclick="lmGoto('${lid}',0)" title="最初へ" style="font-size:11px">⟲</button>
  <div class="lm-step-info"><div class="lm-stl" id="${lid}_stl">Step 1 · ${esc(s0.title)}</div><div class="lm-sts" id="${lid}_sts">${d.steps.length} ステップ ／ ▶ で攻撃フローを再生</div></div>
  <div class="lm-pips">${pips}</div>
</div>
<div class="lm-detail">
  <div class="lm-dblk"><h4>何が起きているか</h4><div class="lm-desc" id="${lid}_desc">${esc(s0.desc)}</div></div>
  <div class="lm-dblk"><h4><b>検知 / 緩和策</b></h4><div class="lm-dmt" id="${lid}_dmt">${buildDetMit(s0)}</div></div>
</div></div>`;
}

/* ---- コントローラ ------------------------------------------------ */
const LM_STATE={};
function lmApplyStep(lid,idx){
  const st=LM_STATE[lid];if(!st)return;
  const d=LATERAL_DATA[st.tid];if(!d)return;
  const step=d.steps[idx];if(!step)return;
  const svg=document.getElementById(lid+'_svg');if(!svg)return;
  svg.querySelectorAll('.lm-node').forEach(el=>{el.classList.remove('active');el.classList.add('dim');});
  svg.querySelectorAll('.lm-edge').forEach(el=>{el.classList.remove('active','flowing');el.classList.add('dim');});
  step.active.forEach(nid=>{const el=svg.querySelector(`[data-nid="${nid}"]`);if(el){el.classList.remove('dim');el.classList.add('active');}});
  step.flowing.forEach(eid=>{const el=svg.querySelector(`[data-eid="${eid}"]`);if(el){el.classList.remove('dim');el.classList.add('flowing');}});
  d.steps.forEach((_,i)=>{const pip=document.getElementById(`${lid}_pip${i}`);if(pip)pip.classList.toggle('on',i===idx);});
  const stl=document.getElementById(lid+'_stl');if(stl)stl.textContent=`Step ${step.n} · ${step.title}`;
  const sts=document.getElementById(lid+'_sts');if(sts)sts.textContent=`${idx+1} / ${d.steps.length}`;
  const descEl=document.getElementById(lid+'_desc');if(descEl)descEl.textContent=step.desc;
  const dmtEl=document.getElementById(lid+'_dmt');if(dmtEl)dmtEl.innerHTML=buildDetMit(step);
  st.step=idx;
}
function lmEnsureInit(lid){
  if(LM_STATE[lid])return;
  const el=document.getElementById(lid);if(!el)return;
  const tid=el.dataset.lmTid;if(!tid||!LATERAL_DATA[tid])return;
  LM_STATE[lid]={step:0,playing:false,timer:null,tid};
  lmApplyStep(lid,0);
}
window.lmStep=function(lid,dir){
  lmEnsureInit(lid);
  const st=LM_STATE[lid];if(!st)return;
  const d=LATERAL_DATA[st.tid];
  const next=Math.max(0,Math.min(d.steps.length-1,st.step+dir));
  lmApplyStep(lid,next);
  if(st.playing&&next===d.steps.length-1)window.lmStopPlay(lid);
};
window.lmGoto=function(lid,idx){lmEnsureInit(lid);window.lmStopPlay(lid);lmApplyStep(lid,idx);};
window.lmTogglePlay=function(lid){
  lmEnsureInit(lid);
  const st=LM_STATE[lid];if(!st)return;
  if(st.playing){window.lmStopPlay(lid);return;}
  const d=LATERAL_DATA[st.tid];
  if(st.step>=d.steps.length-1)lmApplyStep(lid,0);
  st.playing=true;
  const btn=document.getElementById(lid+'_pb');if(btn)btn.textContent='⏸';
  st.timer=setInterval(()=>{const ns=st.step+1;if(ns>=d.steps.length){window.lmStopPlay(lid);return;}lmApplyStep(lid,ns);},2200);
};
window.lmStopPlay=function(lid){
  const st=LM_STATE[lid];if(!st)return;
  st.playing=false;clearInterval(st.timer);
  const btn=document.getElementById(lid+'_pb');if(btn)btn.textContent='▶';
};
window.lmToggleLayer=function(lid,layer,btn){
  const svg=document.getElementById(lid+'_svg');if(!svg)return;
  const on=btn.classList.toggle('on');
  svg.querySelectorAll(`.lm-layer-${layer}`).forEach(el=>{el.classList.toggle('lm-hidden',!on);});
};

/* ---- BESPOKE 注入 + MutationObserver ---------------------------- */
['T1021','T1021.002','T1550.002','T1570'].forEach(tid=>{
  if(LATERAL_DATA[tid])BESPOKE[tid]=buildLateralHTML(tid);
});
function lmInitVisible(){
  document.querySelectorAll('.lm-wrap[data-lm-tid]').forEach(el=>{
    const lid=el.id;
    if(lid&&!LM_STATE[lid]){
      const tid=el.dataset.lmTid;
      if(tid&&LATERAL_DATA[tid]){LM_STATE[lid]={step:0,playing:false,timer:null,tid};lmApplyStep(lid,0);}
    }
  });
}
const _lmObs=new MutationObserver(lmInitVisible);
['stage','searchview'].forEach(id=>{const el=document.getElementById(id);if(el)_lmObs.observe(el,{childList:true,subtree:false});});
})();
