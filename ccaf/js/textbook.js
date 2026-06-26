
document.addEventListener('click',function(e){
  var bt=e.target.closest('.scn-toggle'); if(!bt)return;
  var scn=bt.closest('.scn'); if(scn){scn.classList.toggle('done');
    bt.textContent=scn.classList.contains('done')?'解説を閉じる':'解答・解説を見る';}
});
(function(){
  var bar=document.getElementById('bar');
  var tabs=[].slice.call(document.querySelectorAll('.dtab'));
  var domains=[].slice.call(document.querySelectorAll('.domain'));
  function appbarH(){return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--appbar'))||64;}
  function activeDomain(){for(var i=0;i<domains.length;i++){if(domains[i].classList.contains('active'))return domains[i];}return null;}
  function onScroll(){
    var dom=activeDomain(); if(!dom)return;
    var h=document.documentElement.scrollHeight-window.innerHeight;
    var pct=h>0?Math.min(1,window.scrollY/h):0;
    if(bar)bar.style.width=(pct*100)+'%';
    var progi=dom.querySelector('.rprog .track>i');
    var progtxt=dom.querySelector('.rprog>span');
    if(progi)progi.style.width=(pct*100)+'%';
    if(progtxt)progtxt.textContent='読了 '+Math.round(pct*100)+'%';
    var navlinks=[].slice.call(dom.querySelectorAll('.rnav a'));
    var mid=window.scrollY+window.innerHeight*0.32;var idx=0;
    navlinks.forEach(function(a,i){var s=document.querySelector(a.getAttribute('href'));if(s){var top=s.getBoundingClientRect().top+window.scrollY;if(top<=mid)idx=i;}});
    navlinks.forEach(function(a,i){a.classList.toggle('active',i===idx);});
    try{localStorage.setItem('ccaf-scroll-'+dom.dataset.domain,window.scrollY);}catch(e){}
  }
  function activate(n,restore){
    domains.forEach(function(d){d.classList.toggle('active',+d.dataset.domain===n);});
    tabs.forEach(function(t){t.classList.toggle('active',+t.dataset.go===n);});
    try{localStorage.setItem('ccaf-domain',n);}catch(e){}
    var y=0;if(restore){try{y=+localStorage.getItem('ccaf-scroll-'+n)||0;}catch(e){}}
    window.scrollTo(0,y);onScroll();
    var at=tabs.filter(function(t){return +t.dataset.go===n;})[0];
    if(at&&at.scrollIntoView)try{at.scrollIntoView({inline:'center',block:'nearest'});}catch(e){}
  }
  tabs.forEach(function(t){t.addEventListener('click',function(){activate(+t.dataset.go,false);});});
  document.addEventListener('click',function(e){
    var a=e.target.closest('.domain.active .rnav a, .domain.active footer .next a, .domain.active .next a');
    if(!a)return;var href=a.getAttribute('href');
    if(href&&href.charAt(0)==='#'){var t=document.querySelector(href);if(t){e.preventDefault();var top=t.getBoundingClientRect().top+window.scrollY-appbarH()-14;window.scrollTo({top:top,behavior:'smooth'});}}
  });
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  var start=1;try{start=+localStorage.getItem('ccaf-domain')||1;}catch(e){}
  var hm=(location.hash||'').match(/^#d(\d+)-/);if(hm)start=+hm[1];
  if(start<1||start>12)start=1;
  activate(start,true);
})();



window.addEventListener('load',function(){
  try{
    if(!window.budoux)return;
    var p=budoux.loadDefaultJapaneseParser();
    var sel='h1,h2,.lead,.def,.dd,.dt,.km p,.scope div,.point p,.minibox li,.qa .ans,.axis .a p,.cv,.cap-note,td,th';
    document.querySelectorAll(sel).forEach(function(el){
      el.style.wordBreak='keep-all'; el.style.overflowWrap='anywhere';
      var walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null);
      var nodes=[],n; while(n=walk.nextNode()) nodes.push(n);
      nodes.forEach(function(tn){
        var t=tn.nodeValue; if(!t||t.trim().length<6) return;
        var segs=p.parse(t); if(segs.length<2) return;
        tn.nodeValue=segs.join('\u200B');
      });
    });
  }catch(e){}
});



(function(){
document.addEventListener("click",function(e){
  var a=e.target.closest('a[href^="#"]'); if(!a) return;
  var href=a.getAttribute("href"); if(!href||href==="#") return;
  var t=document.querySelector(href); if(!t) return;
  var dom=t.closest(".domain"); if(!dom||dom.classList.contains("active")) return;
  var go=dom.getAttribute("data-domain");
  var tab=document.querySelector('.dtab[data-go="'+go+'"]');
  if(tab){ e.preventDefault(); tab.click();
    setTimeout(function(){ var el=document.querySelector(href);
      if(el){ var ab=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--appbar"))||64;
        var top=el.getBoundingClientRect().top+window.scrollY-ab-14; window.scrollTo({top:top,behavior:"smooth"}); } },70);
  }
});
})();

