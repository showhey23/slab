/* ===== xlink.js — 3ビュー(マップ/モデル図/トポロジー)の相互連関 =====
   独立した各ページを「ビュー切替」+「文脈付きディープリンク」で相互接続する。
   - 単体表示：location 遷移（#id で対象へジャンプ）
   - 統合ビューア(viewer.html)内：top へ postMessage してタブ切替+ジャンプ */
(function(){
  "use strict";
  var FILES={map:'map.html', models:'scenes.html', td:'topology-3d.html'};
  var LABELS=[['map','🗺 全体マップ'],['models','🖼 攻撃モデル図'],['td','🛰 攻撃ストーリー']];
  var inViewer=false; try{ inViewer = window.top!==window; }catch(e){ inViewer=true; }
  var curView=null, pending=null;
  function apply(id){ if(!id) return;
    if(typeof window.__gotoId==='function'){ try{ window.__gotoId(id); }catch(e){} pending=null; }
    else { pending=id; } }
  function go(view,id){ if(!FILES[view]) return;
    if(inViewer){ try{ window.top.postMessage({type:'goView',view:view,id:id||null},'*'); }catch(e){} return; }
    if(view===curView){ if(id){ try{location.hash='#'+encodeURIComponent(id);}catch(e){} apply(id); } return; }
    location.href=FILES[view]+(id?('#'+encodeURIComponent(id)):''); }
  function fromHash(){ var h=(location.hash||'').replace(/^#/,''); if(h){ try{h=decodeURIComponent(h);}catch(e){} apply(h); } }
  window.XLINK={ go:go, ready:function(){ fromHash(); if(pending) apply(pending); },
                 applyHash:fromHash, inViewer:inViewer, current:function(){return curView;} };
  window.addEventListener('message',function(e){ var d=e.data||{}; if(d&&d.type==='gotoId') apply(d.id); });
  window.addEventListener('hashchange',fromHash);
  function buildSwitch(){
    var nodes=document.querySelectorAll('.xswitch'); if(!nodes.length) return;
    nodes.forEach(function(el){
      curView=el.getAttribute('data-cur'); el.innerHTML='';
      LABELS.forEach(function(v){ var b=document.createElement('button'); b.type='button';
        b.className='xbtn'+(v[0]===curView?' on':''); b.textContent=v[1];
        b.addEventListener('click',function(){ if(v[0]!==curView) go(v[0]); }); el.appendChild(b); });
      var p; if(inViewer){ p=document.createElement('button'); p.type='button'; p.addEventListener('click',function(){ try{window.top.location.href='index.html';}catch(e){} }); }
      else { p=document.createElement('a'); p.href='index.html'; }
      p.className='xbtn xportal'; p.textContent='⌂ ポータル'; el.appendChild(p);
    });
  }
  if(document.readyState!=='loading') buildSwitch(); else document.addEventListener('DOMContentLoaded',buildSwitch);
})();
