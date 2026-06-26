"use strict";
/* ===================== DATA ===================== */
const DATA = window.__ATTACK_DATA__;
const TACTICS = DATA.tactics;            // 16, ordered
const MITS = DATA.mitigations;
const NTAC = TACTICS.length;
const TACDISP={TA0043:'偵察',TA0042:'リソース開発',TA0001:'初期アクセス',TA0002:'実行',TA0003:'永続化',TA0004:'権限昇格',TA0005:'防御回避',TA0112:'防御機能の妨害',TA0006:'認証情報アクセス',TA0007:'探索',TA0008:'横展開',TA0009:'収集',TA0010:'持ち出し',TA0011:'コマンド&コントロール',TA0040:'影響'};
function tacName(tc){return TACDISP[tc.id]||tc.name;}
const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ===================== TOKENS ===================== */
const AURORA = {
  bg:0x070B16, fog:0x0A101F, ground:0x121A2C, ground2:0x18233A,
  teal:0x34C9C0, emerald:0x3FBF8F, gold:0xD8A65A, rose:0xE8788C, indigo:0x8A8FF0,
  ink3:0x8A97AD, ink4:0x5C6B7F, neutral:0x3a496a
};
const MOTION = { ease:t=>1-Math.pow(1-t,3), camFly:900, pulse:2400 };

/* zone definitions (outer->inner along Z) */
const ZONES = [
  {i:0, key:'ext',     name:'外部圏・インターネット', en:'INTERNET',     color:AURORA.rose,   z: 62, y:0.0},
  {i:1, key:'edge',    name:'境界・侵入口(Edge)',    en:'EDGE',         color:AURORA.teal,   z: 37, y:1.5},
  {i:2, key:'endpoint',name:'エンドポイント',        en:'ENDPOINT',     color:AURORA.indigo, z: 13, y:3.0},
  {i:3, key:'lateral', name:'内部ネットワーク',       en:'INTERNAL',     color:AURORA.indigo, z:-12, y:1.6},
  {i:4, key:'idtier',  name:'認証基盤(AD/DC/IdP)',   en:'IDENTITY · AD',color:AURORA.gold,   z:-37, y:5.0},
  {i:5, key:'crown',   name:'クラウンジュエル/データ',en:'CROWN JEWELS', color:AURORA.gold,   z:-60, y:-1.0},
];
/* tactic order -> zone index (per spec §7) */
const ZONE_OF = {1:0,2:0,3:1,4:2,5:2,6:2,7:3,8:3,9:4,10:3,11:3,12:3,13:3,14:5,15:5};
const PHASE_BY_ORDER={1:'準備',2:'準備',3:'侵入・アクセス',4:'侵入・アクセス',5:'内部活動・拡大',6:'内部活動・拡大',7:'内部活動・拡大',8:'内部活動・拡大',9:'内部活動・拡大',10:'内部活動・拡大',11:'内部活動・拡大',12:'内部活動・拡大',13:'内部活動・拡大',14:'目的達成',15:'目的達成'};
const PHASE_OF = o => PHASE_BY_ORDER[o]||'内部活動・拡大';

/* short narration per tactic (concise, accurate) */
const NARR = {
 1:'攻撃者は標的組織の公開資産・従業員情報・技術スタックを調査し、侵入の足がかりを探す。',
 2:'攻撃インフラ（C2・ドメイン・アカウント・マルウェア）を準備・取得する。',
 3:'フィッシングや公開アプリの脆弱性を突き、境界を越えて最初の足場を得る。',
 4:'侵害したエンドポイント上で、コマンド/スクリプトや悪性コードを実行する。',
 5:'再起動や資格情報変更後も足場を維持する常駐機構を仕込む。',
 6:'より高い権限（管理者/SYSTEM）を奪い、内部での行動範囲を広げる。',
 7:'EDR/AV/ログを回避・無効化し、攻撃を隠蔽して継続する。',
 8:'セキュリティツール・ログ・バックアップを停止/改ざんし、検知と復旧を妨げる。',
 9:'LSASS/SAM や AD から認証情報を窃取する——認証基盤が狙われる。',
 10:'内部のホスト・アカウント・ネットワーク構成を列挙し、価値ある到達点を探す。',
 11:'窃取した資格情報でホスト間を渡り歩き、認証基盤やデータへ近づく。',
 12:'業務データ・資格情報・知的財産など価値ある情報をかき集める。',
 13:'内部から外部への制御チャネル（C2）を確立し、遠隔操作する。',
 14:'集めたデータを外部へ送出（Exfiltration）する。',
 15:'暗号化・破壊・改ざん・サービス妨害で、可用性／完全性に最終的な影響を与える。',
};

/* ===================== helpers ===================== */
const $ = s=>document.querySelector(s);
const esc = s=>(s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function linkify(t){ if(t==null)return''; let s=esc(t);
  s=s.replace(/\[([^\]]+)\]\((\/[^)]+)\)/g,(m,l,p)=>`<a href="https://attack.mitre.org${p}" target="_blank" rel="noopener">${l}</a>`);
  s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,(m,l,u)=>`<a href="${u}" target="_blank" rel="noopener">${l}</a>`);
  return s; }
function firstSentence(t){ if(!t)return''; const c=String(t).replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\s+/g,' ').trim();
  const m=c.match(/^(.*?[。．\.])\s/); return m?m[1]:c.slice(0,90); }
function tacStats(tc){ let nt=0,ns=0,wm=0; tc.techs.forEach(t=>{t.type==='Technique'?nt++:ns++; if(t.mits.length)wm++;}); return {nt,ns,wm,tot:tc.techs.length}; }
function tacHasMit(tc){ return tc.techs.some(t=>t.mits.length); }
function groupTechs(tc){ const tops=[],byP={}; tc.techs.forEach(t=>{if(t.type==='Sub-Technique')(byP[t.parent]=byP[t.parent]||[]).push(t);});
  tc.techs.forEach(t=>{if(t.type==='Technique')tops.push({tech:t,subs:byP[t.id]||[]});}); return tops; }

/* ===================== THREE setup ===================== */
let scene,camera,renderer,raycaster,clock;
let anchors=[], anchorByOrder={}, segLines=[], landmarks={}, halos=[], pulsers=[], scanRings=[];
let killTube=null, killOn=false, defenseOn=false;
let treeGroup=null, treeNodes=[], treeOn=true, treeTactic=null;
const pointer = new THREE.Vector2(-2,-2);

function initThree(){
  const canvas=$('#scene');
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth,innerHeight);
  if('outputEncoding' in renderer) renderer.outputEncoding=THREE.sRGBEncoding;
  scene=new THREE.Scene();
  scene.background=new THREE.Color(AURORA.bg);
  scene.fog=new THREE.FogExp2(AURORA.fog,0.0058);
  camera=new THREE.PerspectiveCamera(44,innerWidth/innerHeight,0.1,2000);
  raycaster=new THREE.Raycaster(); clock=new THREE.Clock();
  // lights
  scene.add(new THREE.AmbientLight(0x33405c,0.85));
  const key=new THREE.DirectionalLight(0xbfeae6,0.55); key.position.set(40,70,40); scene.add(key);
  const p1=new THREE.PointLight(AURORA.teal,0.6,200); p1.position.set(-40,26,50); scene.add(p1);
  const p2=new THREE.PointLight(AURORA.indigo,0.5,220); p2.position.set(30,40,-70); scene.add(p2);
  const p3=new THREE.PointLight(AURORA.gold,0.5,160); p3.position.set(0,30,-50); scene.add(p3);
}

/* shared halo texture (radial glow) */
let HALO_TEX=null;
function haloTex(){ if(HALO_TEX)return HALO_TEX;
  const c=document.createElement('canvas'); c.width=c.height=128; const g=c.getContext('2d');
  const gr=g.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.25,'rgba(255,255,255,.55)');
  gr.addColorStop(.55,'rgba(255,255,255,.18)'); gr.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=gr; g.fillRect(0,0,128,128); HALO_TEX=new THREE.CanvasTexture(c); return HALO_TEX; }
function addHalo(obj,color,scale,intensity){
  const m=new THREE.SpriteMaterial({map:haloTex(),color,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:intensity});
  const s=new THREE.Sprite(m); s.scale.set(scale,scale,1); obj.add(s);
  halos.push({sprite:s,base:intensity,baseScale:scale}); return s;
}

/* label sprite via canvas */
function labelSprite(text,sub,color){
  const c=document.createElement('canvas'); const W=512,H=140; c.width=W;c.height=H; const g=c.getContext('2d');
  g.clearRect(0,0,W,H);
  g.font='700 30px "Noto Sans JP",sans-serif'; g.fillStyle='#EEF2F8'; g.textAlign='center';
  g.fillText(text,W/2,56);
  g.font='600 20px "JetBrains Mono",monospace'; g.fillStyle='#'+('00000'+color.toString(16)).slice(-6);
  g.fillText(sub,W/2,92);
  const t=new THREE.CanvasTexture(c); t.minFilter=THREE.LinearFilter;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true}));
  sp.scale.set(20,5.5,1); return sp;
}

/* ===================== build zones & topology ===================== */
function buildZones(){
  ZONES.forEach(zn=>{
    // plate
    const geo=new THREE.BoxGeometry(20,0.6,16);
    const mat=new THREE.MeshStandardMaterial({color:AURORA.ground,metalness:.2,roughness:.85,emissive:AURORA.ground2,emissiveIntensity:.12});
    const plate=new THREE.Mesh(geo,mat); plate.position.set(0,zn.y-0.3,zn.z); scene.add(plate);
    // rim
    const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:zn.color,transparent:true,opacity:.35}));
    edges.position.copy(plate.position); scene.add(edges);
    // grid lines on top
    const grid=new THREE.GridHelper(16,8,AURORA.ink4,AURORA.ink4); grid.material.transparent=true; grid.material.opacity=.10;
    grid.position.set(0,zn.y+0.02,zn.z); grid.scale.x=20/16; scene.add(grid);
    // label
    const lb=labelSprite(zn.name,'Z'+zn.i+' · '+zn.en,zn.color); lb.position.set(0,zn.y+7.5,zn.z+8.6); scene.add(lb);
    zn.center=new THREE.Vector3(0,zn.y+2,zn.z);
  });
  // connecting main path tubes between zone centers
  for(let i=0;i<ZONES.length-1;i++){
    const a=ZONES[i].center, b=ZONES[i+1].center;
    const curve=new THREE.LineCurve3(a.clone(),b.clone());
    const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,1,0.12,6,false),
      new THREE.MeshBasicMaterial({color:AURORA.ink4,transparent:true,opacity:.3}));
    scene.add(tube);
  }
}

function buildLandmarks(){
  const mk=(geo,color,emi,pos,emiI)=>{ const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,emissive:emi,emissiveIntensity:emiI||.5,metalness:.35,roughness:.5})); m.position.copy(pos); scene.add(m); return m; };
  // Z0 attacker (octahedron, rose)
  const atk=mk(new THREE.OctahedronGeometry(1.6,0),AURORA.rose,AURORA.rose,new THREE.Vector3(-6,ZONES[0].y+2.4,ZONES[0].z),1.0);
  addHalo(atk,AURORA.rose,8,.7); landmarks.attacker=atk;
  // small OSINT satellites
  for(let k=0;k<4;k++){ const s=mk(new THREE.BoxGeometry(.7,.7,.7),AURORA.ink4,AURORA.rose,new THREE.Vector3(-9+k*2.2,ZONES[0].y+4.5+Math.sin(k)*.6,ZONES[0].z-3),.2); }
  // Z1 gateway (rounded box, teal)
  const gw=mk(new THREE.BoxGeometry(3,3.4,1.4),AURORA.ground2,AURORA.teal,new THREE.Vector3(0,ZONES[1].y+2.2,ZONES[1].z),.6);
  addHalo(gw,AURORA.teal,7,.5); landmarks.gateway=gw;
  // Z2 AI model/agent (icosahedron, indigo, transparent + inner core)
  const ag=mk(new THREE.IcosahedronGeometry(2.4,0),AURORA.indigo,AURORA.indigo,new THREE.Vector3(0,ZONES[2].y+2.6,ZONES[2].z),.5);
  ag.material.transparent=true; ag.material.opacity=.5; ag.material.depthWrite=false;
  const core=mk(new THREE.IcosahedronGeometry(.9,0),AURORA.indigo,AURORA.indigo,ag.position.clone(),1.2);
  addHalo(ag,AURORA.indigo,9,.45); landmarks.agent=ag; pulsers.push({mesh:core,base:1.0,amp:.5});
  // Z3 host cluster (InstancedMesh of cubes, neutral)
  const hostGeo=new THREE.BoxGeometry(1,1,1);
  const hostMat=new THREE.MeshStandardMaterial({color:AURORA.neutral,emissive:AURORA.indigo,emissiveIntensity:.12,metalness:.3,roughness:.6});
  const N=14; const inst=new THREE.InstancedMesh(hostGeo,hostMat,N); const dummy=new THREE.Object3D();
  for(let k=0;k<N;k++){ const gx=(k%5-2)*2.6, gz=(Math.floor(k/5)-1)*3; dummy.position.set(gx,ZONES[3].y+1+ (k%3)*1.1,ZONES[3].z+gz); dummy.rotation.y=k*.4; dummy.scale.setScalar(.8+ (k%3)*.25); dummy.updateMatrix(); inst.setMatrixAt(k,dummy.matrix);}
  inst.instanceMatrix.needsUpdate=true; scene.add(inst); landmarks.hosts=inst; landmarks.hostsCenter=new THREE.Vector3(0,ZONES[3].y+2.5,ZONES[3].z);
  // Z4 AD tower (cylinder polygon, gold, pulsing)
  const tower=mk(new THREE.CylinderGeometry(1.5,2.1,7,6),AURORA.ground2,AURORA.gold,new THREE.Vector3(0,ZONES[4].y+3.5,ZONES[4].z),.7);
  addHalo(tower,AURORA.gold,10,.6); landmarks.adTower=tower; pulsers.push({mesh:tower,base:.7,amp:.4});
  const cap=mk(new THREE.IcosahedronGeometry(1.1,0),AURORA.gold,AURORA.gold,new THREE.Vector3(0,ZONES[4].y+7.6,ZONES[4].z),1.1); pulsers.push({mesh:cap,base:1.1,amp:.5});
  // Z5 crown jewel (gem core gold + emerald shell ring)
  const gem=mk(new THREE.IcosahedronGeometry(2.2,1),AURORA.gold,AURORA.gold,new THREE.Vector3(0,ZONES[5].y+2.6,ZONES[5].z),1.0);
  addHalo(gem,AURORA.gold,13,.75); landmarks.crown=gem; pulsers.push({mesh:gem,base:1.0,amp:.45});
  const ring=new THREE.Mesh(new THREE.TorusGeometry(3.6,.12,8,48),new THREE.MeshStandardMaterial({color:AURORA.emerald,emissive:AURORA.emerald,emissiveIntensity:.5,metalness:.4,roughness:.4}));
  ring.position.copy(gem.position); ring.rotation.x=Math.PI/2.4; scene.add(ring); landmarks.crownRing=ring;
}

/* tactic anchors: small pins placed in their zone, spread by index-within-zone */
function buildAnchors(){
  const perZone={};
  TACTICS.forEach(tc=>{ const zi=ZONE_OF[tc.order]; (perZone[zi]=perZone[zi]||[]).push(tc); });
  TACTICS.forEach(tc=>{
    const zi=ZONE_OF[tc.order]; const zn=ZONES[zi]; const grp=perZone[zi]; const k=grp.indexOf(tc); const n=grp.length;
    const x = n===1?0 : (k/(n-1)-0.5)*13;
    const y = zn.y + 4 + (k%2)*1.4;
    const z = zn.z + (n>1?((k%2)?2.4:-2.4):0);
    const pos=new THREE.Vector3(x,y,z);
    const geo=new THREE.OctahedronGeometry(0.85,0);
    const mat=new THREE.MeshStandardMaterial({color:AURORA.ground2,emissive:zn.color,emissiveIntensity:.35,metalness:.3,roughness:.5});
    const m=new THREE.Mesh(geo,mat); m.position.copy(pos);
    m.userData={kind:'anchor',order:tc.order,tac:tc};
    scene.add(m);
    // ring outline (selection / targeted)
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.4,.06,6,28),new THREE.MeshBasicMaterial({color:AURORA.teal,transparent:true,opacity:0}));
    ring.position.copy(pos); ring.rotation.x=Math.PI/2; scene.add(ring);
    // shield (defense) hidden by default
    let shield=null;
    if(tacHasMit(tc)){
      shield=new THREE.Mesh(new THREE.SphereGeometry(1.7,16,16),new THREE.MeshStandardMaterial({color:AURORA.emerald,emissive:AURORA.emerald,emissiveIntensity:.5,transparent:true,opacity:0,depthWrite:false,metalness:.2,roughness:.3,side:THREE.DoubleSide}));
      shield.position.copy(pos); shield.visible=false; scene.add(shield);
    }
    // small id label
    const lb=labelSprite(tacName(tc), tc.id, zn.color); lb.scale.set(11,3,1); lb.position.set(pos.x,pos.y+2.0,pos.z); lb.material.opacity=.9; scene.add(lb);
    const A={order:tc.order,tac:tc,mesh:m,ring:ring,shield:shield,label:lb,pos:pos,zone:zi,baseEmi:.35,color:zn.color,state:'idle'};
    anchors.push(A); anchorByOrder[tc.order]=A;
  });
  // path segments connecting consecutive tactic anchors (1->2->...->16)
  for(let o=1;o<NTAC;o++){
    const a=anchorByOrder[o].pos, b=anchorByOrder[o+1].pos;
    const g=new THREE.BufferGeometry().setFromPoints([a,b]);
    const ln=new THREE.Line(g,new THREE.LineBasicMaterial({color:AURORA.ink4,transparent:true,opacity:.45}));
    scene.add(ln);
    // traveling spark sprite (hidden until active)
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:haloTex(),color:AURORA.rose,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0}));
    sp.scale.set(3,3,1); scene.add(sp);
    segLines.push({from:o,to:o+1,line:ln,a,b,spark:sp});
  }
}

/* ===================== tactic→technique hierarchy tree ===================== */
function disposeTree(){
  if(treeGroup){ scene.remove(treeGroup);
    treeGroup.traverse(o=>{ if(o.geometry)o.geometry.dispose();
      if(o.material){ const ms=Array.isArray(o.material)?o.material:[o.material]; ms.forEach(m=>{ if(m.map)m.map.dispose(); m.dispose(); }); } });
  }
  treeGroup=null; treeNodes=[];
}
function treeLine(a,b,color,opacity,dashed){
  const geo=new THREE.BufferGeometry().setFromPoints([a,b]);
  const mat=dashed?new THREE.LineDashedMaterial({color,transparent:true,opacity,dashSize:.7,gapSize:.5})
                  :new THREE.LineBasicMaterial({color,transparent:true,opacity});
  const ln=new THREE.Line(geo,mat); if(dashed)ln.computeLineDistances(); return ln;
}
function truncName(str,n){ const a=[...str]; return a.length>n? a.slice(0,n).join('')+'…': str; }
function buildTacticTree(tc){
  if(!treeOn){ disposeTree(); treeTactic=tc; return; }
  if(treeGroup && treeTactic===tc) return;          // already shown
  disposeTree(); treeTactic=tc;
  const zi=ZONE_OF[tc.order], zn=ZONES[zi], A=anchorByOrder[tc.order];
  const worldRoot=new THREE.Vector3(A.pos.x, zn.y+9, zn.z+3);
  const g=new THREE.Group(); g.position.copy(worldRoot); g.userData.t=0; scene.add(g); treeGroup=g;
  const tops=groupTechs(tc), n=tops.length;
  const dx=Math.min(7.5, 84/Math.max(1,n));
  // root marker + count label (local coords; group sits at worldRoot)
  const rootMesh=new THREE.Mesh(new THREE.IcosahedronGeometry(1.0,0),
    new THREE.MeshStandardMaterial({color:AURORA.ground2,emissive:zn.color,emissiveIntensity:1.0,metalness:.3,roughness:.4}));
  g.add(rootMesh);
  const nsubs=tops.reduce((acc,t)=>acc+t.subs.length,0);
  const rlab=labelSprite(tacName(tc), n+' techniques · '+nsubs+' sub', zn.color); rlab.scale.set(17,4.4,1); rlab.position.set(0,2.9,0); g.add(rlab);
  tops.forEach((tt,i)=>{
    const tx=(i-(n-1)/2)*dx, ty=7+(i%2?1.8:0), tz=5;
    const tp=new THREE.Vector3(tx,ty,tz);
    g.add(treeLine(new THREE.Vector3(0,0,0),tp,AURORA.indigo,.55));
    const tnode=new THREE.Mesh(new THREE.IcosahedronGeometry(.74,0),
      new THREE.MeshStandardMaterial({color:AURORA.ground2,emissive:AURORA.indigo,emissiveIntensity:.7,metalness:.3,roughness:.45}));
    tnode.position.copy(tp); tnode.userData={kind:'treetech',tac:tc,tech:tt.tech}; g.add(tnode); treeNodes.push(tnode);
    const lbl=labelSprite(truncName(tt.tech.name,10), tt.tech.id, AURORA.indigo);
    lbl.scale.set(10.5,2.9,1); lbl.position.set(tx,ty+1.7,tz); lbl.material.opacity=.95; g.add(lbl);
    const subs=tt.subs, m=subs.length, cols=Math.min(m,3);
    subs.forEach((su,j)=>{
      const col=j%3, row=Math.floor(j/3);
      const sx=tx+(col-(cols-1)/2)*2.0, sy=ty+3.7+row*2.0, sz=tz+2;
      const sp=new THREE.Vector3(sx,sy,sz);
      g.add(treeLine(tp,sp,AURORA.ink4,.4,true));
      const sn=new THREE.Mesh(new THREE.OctahedronGeometry(.4,0),
        new THREE.MeshStandardMaterial({color:AURORA.ground,emissive:AURORA.indigo,emissiveIntensity:.5,metalness:.2,roughness:.5}));
      sn.position.copy(sp); sn.userData={kind:'treesub',tac:tc,tech:su,parent:tt.tech}; g.add(sn); treeNodes.push(sn);
    });
  });
  flyTo(new THREE.Vector3(worldRoot.x, worldRoot.y+5, zn.z+8), 74);
}
function expandTech(id){ const el=$('#pnBody').querySelector('details.tk[data-tid="'+id+'"]'); if(el){ el.open=true; if(el.scrollIntoView)el.scrollIntoView({block:'center',behavior:REDUCED?'auto':'smooth'}); } }
function toggleTree(){ treeOn=!treeOn; const b=$('#btnTree'); if(b){ b.classList.toggle('on',treeOn); b.textContent=treeOn?'🌳 階層ツリー ON':'🌳 階層ツリー OFF'; }
  if(treeOn){ const tc=treeTactic||(curStep?anchorByOrder[curStep].tac:TACTICS[0]); treeTactic=null; buildTacticTree(tc); } else { disposeTree(); } }

/* ===================== custom orbit camera ===================== */
const cam={ radius:118, theta:0.62, phi:0.92, target:new THREE.Vector3(0,2,2),
  goalRadius:118, goalTarget:new THREE.Vector3(0,2,2), autoTarget:true, lastUser:0 };
function applyCamera(){
  const r=cam.radius, t=cam.theta, p=cam.phi;
  camera.position.set(cam.target.x + r*Math.sin(p)*Math.sin(t),
                      cam.target.y + r*Math.cos(p),
                      cam.target.z + r*Math.sin(p)*Math.cos(t));
  camera.lookAt(cam.target);
}
function setupOrbit(){
  const el=$('#scene'); let dragging=false,px=0,py=0,pinch=0;
  el.addEventListener('pointerdown',e=>{dragging=true;px=e.clientX;py=e.clientY;cam.lastUser=performance.now();el.setPointerCapture(e.pointerId);});
  el.addEventListener('pointermove',e=>{
    if(dragging){ const dx=e.clientX-px,dy=e.clientY-py;px=e.clientX;py=e.clientY;
      cam.theta-=dx*0.005; cam.phi=Math.max(0.16,Math.min(1.5,cam.phi-dy*0.005)); cam.lastUser=performance.now(); cam.autoTarget=false; }
    updateHover(e.clientX,e.clientY);
  });
  el.addEventListener('pointerup',e=>{dragging=false;});
  el.addEventListener('pointerleave',()=>{dragging=false;hideTip();});
  el.addEventListener('wheel',e=>{e.preventDefault();cam.goalRadius=Math.max(34,Math.min(180,cam.goalRadius+e.deltaY*0.05));cam.lastUser=performance.now();},{passive:false});
  // touch pinch
  let touches=[];
  el.addEventListener('touchstart',e=>{touches=[...e.touches];},{passive:true});
  el.addEventListener('touchmove',e=>{ if(e.touches.length===2&&touches.length===2){
    const d0=Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
    const d1=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    cam.goalRadius=Math.max(34,Math.min(180,cam.goalRadius-(d1-d0)*0.12)); touches=[...e.touches]; cam.lastUser=performance.now(); } },{passive:true});
  el.addEventListener('click',e=>{ onPick(e.clientX,e.clientY); });
}
function flyTo(pos,radius){ cam.goalTarget.copy(pos); if(radius)cam.goalRadius=radius; cam.autoTarget=true; }

/* ===================== picking / tooltip ===================== */
function pickObjects(){ return anchors.map(a=>a.mesh).concat([landmarks.attacker,landmarks.gateway,landmarks.agent,landmarks.adTower,landmarks.crown,landmarks.hosts].filter(Boolean)).concat(treeNodes); }
function raycastAt(cx,cy){ pointer.x=(cx/innerWidth)*2-1; pointer.y=-(cy/innerHeight)*2+1; raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(pickObjects(),false); return hits.length?hits[0].object:null; }
function updateHover(cx,cy){ const o=raycastAt(cx,cy); const el=$('#scene'); const u=o&&o.userData;
  if(u&&u.kind==='anchor'){ el.style.cursor='pointer'; showTip(cx,cy,u.tac.id,u.tac.name); }
  else if(u&&(u.kind==='treetech'||u.kind==='treesub')){ el.style.cursor='pointer'; showTip(cx,cy,u.tech.id,u.tech.name); }
  else if(o){ el.style.cursor='pointer'; const nm=landmarkName(o); showTip(cx,cy,nm.id,nm.name); }
  else { el.style.cursor='grab'; hideTip(); } }
function landmarkName(o){
  if(o===landmarks.attacker)return{id:'ADVERSARY',name:'攻撃者拠点 / C2（外部圏）'};
  if(o===landmarks.gateway)return{id:'EDGE',name:'公開アプリ/VPN/メール（侵入口）'};
  if(o===landmarks.agent)return{id:'ENDPOINT',name:'エンドポイント/ワークステーション'};
  if(o===landmarks.hosts)return{id:'INTERNAL',name:'内部ネットワーク（サーバー/共有）'};
  if(o===landmarks.adTower)return{id:'IDENTITY',name:'認証基盤 AD/DC/IdP'};
  if(o===landmarks.crown)return{id:'CROWN JEWELS',name:'業務データ・クラウンジュエル'};
  return{id:'',name:''};
}
function showTip(x,y,id,name){ const t=$('#tip'); $('#tipId').textContent=id; $('#tipName').textContent=name;
  t.style.left=Math.min(x+14,innerWidth-250)+'px'; t.style.top=(y+14)+'px'; t.style.opacity='1'; }
function hideTip(){ $('#tip').style.opacity='0'; }
function onPick(cx,cy){ const o=raycastAt(cx,cy); if(!o)return; const u=o.userData||{};
  if(u.kind==='anchor'){ openPanel(u.tac); }
  else if(u.kind==='treetech'){ openPanel(u.tac); expandTech(u.tech.id); }
  else if(u.kind==='treesub'){ openPanel(u.tac); expandTech(u.parent.id); }
  else { const lz={'ADVERSARY':0,'EDGE':1,'ENDPOINT':2,'INTERNAL':3,'IDENTITY':4,'CROWN JEWELS':5}[landmarkName(o).id];
    const tc=TACTICS.find(t=>ZONE_OF[t.order]===lz); if(tc)openPanel(tc); } }

/* ===================== side panel ===================== */
function postModel(id){ try{ if(window.parent && window.parent!==window) window.parent.postMessage({type:'goModel',id:id},'*'); }catch(e){} }
function openPanel(tc){
  const zn=ZONES[ZONE_OF[tc.order]]; const st=tacStats(tc);
  const col='#'+('00000'+zn.color.toString(16)).slice(-6);
  $('#panel').style.setProperty('--accent',col);
  $('#pnEyebrow').textContent=`${tc.id} · ${PHASE_OF(tc.order)} · ${zn.name}`;
  $('#pnTitle').textContent=tacName(tc);
  $('#pnSub').textContent=`${tc.id} ／ ${st.nt} テクニック・${st.ns} サブ・緩和 ${st.wm}`;
  const tops=groupTechs(tc);
  let html=`<div class="pdesc">${linkify(tc.desc)}</div>`;
  html+=`<div class="psub-h">テクニックと緩和策 <b>${tops.length}</b></div>`;
  tops.forEach(({tech,subs})=>{
    const mit=renderMit(tech.mits); const d3=renderD3(tech.d3);
    const subHtml=subs.length?`<div class="sub">${subs.map(s=>`<div style="margin-bottom:6px"><span class="sn">${esc(s.id)}</span> <span class="snm">${esc(s.name)}</span>${s.mits.length?renderMit(s.mits):''}</div>`).join('')}</div>`:'';
    html+=`<details class="tk" data-tid="${esc(tech.id)}"><summary><span class="tkid">${esc(tech.id)}</span><span class="tknm">${esc(tech.name)}</span><span class="tkx">＋</span></summary>
      <div class="tkbody"><button class="modelbtn" data-mid="${esc(tech.id)}">🖼 攻撃モデル図を見る →</button>${linkify(tech.desc)}
      ${subs.length?`<div style="margin-top:8px"><span class="chip">サブ ${subs.length}</span></div>`:''}
      ${subHtml}${mit}${d3}</div></details>`;
  });
  $('#pnBody').innerHTML=html;
  $('#pnBody').querySelectorAll('.modelbtn').forEach(b=>b.onclick=()=>postModel(b.dataset.mid));
  $('#pnBody').scrollTop=0;
  $('#panel').classList.add('open');
  buildTacticTree(tc);
}
function renderMit(mits){ if(!mits||!mits.length)return `<div class="mit" style="border-color:rgba(216,166,90,.3);background:var(--amber-d)"><div class="mh" style="color:var(--amber)">緩和策の定義なし</div><div style="font-size:11.5px;color:#EBD6AF">上位の予防的統制（提供面の最小化・入力検証・監視）で対応。</div></div>`;
  return `<div class="mit"><div class="mh">🛡 Mitigation ／ 緩和策（${mits.length}）</div>${mits.map(m=>`<div style="margin-bottom:7px"><span class="mid">${esc(m.id)}</span> <span class="mnm">${esc(m.name)}</span>${m.usage?`<div class="mu">${linkify(m.usage)}</div>`:''}</div>`).join('')}</div>`; }
function renderD3(d3){ if(!d3||!d3.length)return''; return `<div class="d3"><div class="d3h">⛨ D3FEND 防御技術</div>${d3.map(d=>`<div><a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.id)} ${esc(d.name)}</a></div>`).join('')}</div>`; }

/* ===================== playback state machine ===================== */
let curStep=0, playing=false, lastAdvance=0, speed=1, stepDur=2600;
function setAnchorState(A,state){
  A.state=state;
  const emi = state==='compromised'?1.5 : state==='targeted'?1.0 : state==='dim'?.12 : .35;
  A.mesh.material.emissiveIntensity=emi;
  A.mesh.material.color.setHex(state==='compromised'?AURORA.rose: AURORA.ground2);
  A.mesh.material.emissive.setHex(state==='compromised'?AURORA.rose: A.color);
  A.ring.material.opacity = state==='targeted'?.9:0;
  A.label.material.opacity = (state==='dim')?.25:.9;
}
function focusStep(idx,instant){
  curStep=idx;
  anchors.forEach(A=>{
    if(A.order<idx) setAnchorState(A,'compromised');
    else if(A.order===idx) setAnchorState(A,'targeted');
    else setAnchorState(A,'dim');
  });
  // segments
  segLines.forEach(s=>{
    const reached = s.to<=idx;
    s.line.material.color.setHex(reached?AURORA.rose:AURORA.ink4);
    s.line.material.opacity = reached?.85:.4;
    s.spark.material.opacity = (s.to===idx)?1:0;
  });
  const A=anchorByOrder[idx];
  // defense block effect
  let blocked = defenseOn && tacHasMit(A.tac);
  flyTo(A.pos.clone().add(new THREE.Vector3(0,0,0)), 56);
  if(instant){ cam.target.copy(cam.goalTarget); cam.radius=cam.goalRadius; }
  // narration
  const tc=A.tac; const zn=ZONES[ZONE_OF[idx]];
  $('#narration').classList.add('show');
  $('#narTac').textContent=`${tc.id} · ${tacName(tc)}`;
  const rep=groupTechs(tc)[0];
  $('#narTech').textContent=rep?`代表: ${rep.tech.id} ${rep.tech.name}`:'';
  $('#narTitle').textContent=`${PHASE_OF(idx)}フェーズ — ${zn.name}`;
  $('#narBody').innerHTML = esc(NARR[idx]||'') + (blocked?` <span style="color:var(--emerald)">🛡 この段階には緩和策が定義されています（防御で抑止可能）。</span>`:(tacHasMit(tc)?'':` <span style="color:var(--amber)">⚠ 個別の緩和策が手薄な領域です。</span>`));
  // shield flash
  if(blocked && A.shield){ A.shield.visible=true; A.shield.userData.flash=1; }
  // timeline
  document.querySelectorAll('#timeline .tldot').forEach(d=>{ const o=+d.dataset.o; d.classList.toggle('cur',o===idx); d.classList.toggle('done',o<idx); });
  const cd=document.querySelector(`#timeline .tldot[data-o="${idx}"]`); if(cd&&cd.scrollIntoView)cd.scrollIntoView({inline:'center',block:'nearest',behavior:REDUCED?'auto':'smooth'});
  // nowtac
  $('#nowtac').innerHTML=`<span class="ph">${tc.id} · ${PHASE_OF(idx)}</span> <b>${esc(tacName(tc))}</b>`;
}
function play(){ playing=true; $('#btnPlay').textContent='⏸'; lastAdvance=performance.now(); if(curStep<1)focusStep(1,REDUCED); }
function pause(){ playing=false; $('#btnPlay').textContent='▶'; }
function togglePlay(){ playing?pause():play(); }
function stepFwd(){ pause(); focusStep(Math.min(NTAC,curStep+1||1),REDUCED); }
function stepBack(){ pause(); focusStep(Math.max(1,(curStep||1)-1),REDUCED); }
function rewind(){ pause(); anchors.forEach(A=>setAnchorState(A,'idle')); segLines.forEach(s=>{s.line.material.color.setHex(AURORA.ink4);s.line.material.opacity=.4;s.spark.material.opacity=0;});
  curStep=0; $('#narration').classList.remove('show'); $('#nowtac').innerHTML='<span class="ph">READY</span> <b>再生ボタンで攻撃シナリオを開始</b>';
  document.querySelectorAll('#timeline .tldot').forEach(d=>{d.classList.remove('cur','done');}); flyTo(new THREE.Vector3(0,2,2),118); }

/* ===================== defense / kill chain ===================== */
function toggleDefense(){ defenseOn=!defenseOn; $('#btnDefense').classList.toggle('on',defenseOn);
  $('#btnDefense').textContent = defenseOn?'🛡 防御を表示中':'🛡 防御を表示';
  anchors.forEach(A=>{ if(A.shield){ A.shield.visible=defenseOn; A.shield.material.opacity=defenseOn?.22:0; } });
  if(landmarks.crownRing) landmarks.crownRing.material.emissiveIntensity=defenseOn?1.0:.5;
}
function buildKillTube(){
  const pts=[landmarks.gateway.position, landmarks.hostsCenter, landmarks.adTower.position.clone().add(new THREE.Vector3(0,-1,0)), landmarks.crown.position];
  const curve=new THREE.CatmullRomCurve3(pts);
  killTube=new THREE.Mesh(new THREE.TubeGeometry(curve,60,0.34,8,false),
    new THREE.MeshBasicMaterial({color:AURORA.rose,transparent:true,opacity:0}));
  scene.add(killTube);
}
function toggleKill(){ killOn=!killOn; $('#btnKill').classList.toggle('on',killOn);
  killTube.material.opacity=killOn?.9:0;
  if(killOn){ flyTo(landmarks.hostsCenter.clone(),120); }
}

/* ===================== timeline build ===================== */
function buildTimeline(){
  const tl=$('#timeline');
  tl.innerHTML=TACTICS.map(tc=>`<button class="tldot" data-o="${tc.order}"><span class="tn">${esc(tc.id)}</span><span class="tj">${esc(tacName(tc))}</span></button>`).join('');
  tl.querySelectorAll('.tldot').forEach(d=>d.addEventListener('click',()=>{pause();focusStep(+d.dataset.o,REDUCED);}));
}

/* ===================== animation loop ===================== */
function animate(){ requestAnimationFrame(animate);
  const dt=clock.getDelta(), tms=performance.now();
  // camera damping
  cam.radius += (cam.goalRadius-cam.radius)*Math.min(1,dt*6);
  if(cam.autoTarget){ cam.target.lerp(cam.goalTarget,Math.min(1,dt*(REDUCED?60:3.2))); }
  applyCamera();
  // pulse high-value
  if(!REDUCED){ const ph=(Math.sin(tms/MOTION.pulse*Math.PI*2)+1)/2;
    pulsers.forEach(p=>p.mesh.material.emissiveIntensity=p.base+p.amp*ph);
    halos.forEach(h=>{ h.sprite.material.opacity=h.base*(0.78+0.22*ph); });
    if(landmarks.crownRing) landmarks.crownRing.rotation.z+=dt*0.3;
    if(landmarks.agent) landmarks.agent.rotation.y+=dt*0.25;
  }
  // anchor idle spin + targeted ring spin
  anchors.forEach(A=>{ if(!REDUCED){A.mesh.rotation.y+=dt*0.6;} if(A.state==='targeted'&&!REDUCED){A.ring.rotation.z+=dt*1.4;} });
  // shield flash decay
  anchors.forEach(A=>{ if(A.shield&&A.shield.userData.flash){ A.shield.userData.flash=Math.max(0,A.shield.userData.flash-dt*1.2);
    const f=A.shield.userData.flash; A.shield.material.opacity=(defenseOn?.22:0)+f*.5; A.shield.material.emissiveIntensity=.5+f*1.5;
    if(!defenseOn&&f<=0)A.shield.visible=false; } });
  // moving spark on active segment
  segLines.forEach(s=>{ if(s.spark.material.opacity>0.01){ const u=(tms/ (1200/ Math.max(.5,speed)) %1); s.spark.position.lerpVectors(s.a,s.b,u);} });
  // kill tube dash pulse
  if(killOn&&killTube&&!REDUCED){ killTube.material.opacity=0.6+0.3*((Math.sin(tms/500)+1)/2); }
  // hierarchy tree entrance + idle spin
  if(treeGroup){ if(!REDUCED){ if(treeGroup.userData.t<1){ treeGroup.userData.t=Math.min(1,treeGroup.userData.t+dt*2.4); treeGroup.scale.setScalar(0.02+0.98*MOTION.ease(treeGroup.userData.t)); } treeNodes.forEach(nd=>nd.rotation.y+=dt*0.8); } else { treeGroup.scale.setScalar(1); } }
  // playback advance
  if(playing){ if(tms-lastAdvance > stepDur/speed){ lastAdvance=tms; if(curStep<NTAC){ focusStep(curStep+1,false); } else { pause(); } } }
  renderer.render(scene,camera);
}

/* ===================== keyboard / resize ===================== */
function setupKeys(){
  window.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){stepFwd();e.preventDefault();}
    else if(e.key==='ArrowLeft'){stepBack();e.preventDefault();}
    else if(e.key===' '){togglePlay();e.preventDefault();}
    else if(e.key==='Escape'){ $('#panel').classList.remove('open'); }
    else if(e.key.toLowerCase()==='d'){toggleDefense();}
    else if(e.key.toLowerCase()==='r'){rewind();}
    else if(e.key.toLowerCase()==='t'){toggleTree();}
  });
}
function onResize(){ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); }

/* ===================== wire UI ===================== */
function wireUI(){
  $('#btnPlay').onclick=togglePlay; $('#btnStepFwd').onclick=stepFwd; $('#btnStepBack').onclick=stepBack; $('#btnRewind').onclick=rewind;
  $('#btnDefense').onclick=toggleDefense; $('#btnKill').onclick=toggleKill; $('#btnTree').onclick=toggleTree;
  $('#btnReset').onclick=()=>{ cam.theta=0.62;cam.phi=0.92;cam.goalRadius=118;flyTo(new THREE.Vector3(0,2,2),118); };
  $('#panelClose').onclick=()=>$('#panel').classList.remove('open');
  $('#legendToggle').onclick=()=>$('#legend').classList.toggle('closed');
  $('#speedSeg').querySelectorAll('button').forEach(b=>b.onclick=()=>{ speed=+b.dataset.s; $('#speedSeg').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); });
  window.addEventListener('resize',onResize);
}

/* ===================== boot ===================== */
function boot(){
  try{
    if(!window.THREE||!document.createElement('canvas').getContext('webgl')){ throw new Error('no webgl'); }
    initThree(); buildZones(); buildLandmarks(); buildAnchors(); buildKillTube();
    buildTimeline(); setupOrbit(); setupKeys(); wireUI();
    applyCamera(); animate();
    // intro camera
    if(!REDUCED){ cam.radius=170; cam.goalRadius=118; cam.theta=0.9; }
    $('#loading').style.display='none';
  }catch(err){ console.error(err); $('#loading').style.display='none'; $('#fallback').style.display='flex'; }
}
if(document.readyState==='complete'||document.readyState==='interactive') setTimeout(boot,60); else window.addEventListener('DOMContentLoaded',boot);

