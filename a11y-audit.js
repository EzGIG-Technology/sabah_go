/* Dev-only accessibility scan. Load in the console: run a11yAudit() after the app has loaded. */
function a11yAudit(){
  const lum = c => { const [r,g,b]=c.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}); return .2126*r+.7152*g+.0722*b; };
  const parse = s => { const m=s.match(/rgba?\(([^)]+)\)/); if(!m) return null; const p=m[1].split(',').map(x=>parseFloat(x)); return {rgb:p.slice(0,3), a:p[3]===undefined?1:p[3]}; };
  const ratio = (a,b) => { const L1=lum(a), L2=lum(b); return (Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05); };
  const firstGradColor = s => { const m=s.match(/#[0-9a-f]{6}|rgba?\([^)]+\)/i); if(!m) return null; if(m[0][0]==='#'){ const h=m[0]; return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16)); } return parse(m[0]).rgb; };
  function bgOf(el){
    let e=el;
    while(e && e!==document.documentElement){
      const cs=getComputedStyle(e);
      if(cs.backgroundImage && cs.backgroundImage!=='none'){ if(cs.backgroundImage.includes('url(')) return {img:true}; const g=firstGradColor(cs.backgroundImage); if(g) return {rgb:g, grad:true}; }
      const p=parse(cs.backgroundColor); if(p && p.a>0.85) return {rgb:p.rgb};
      if(e.tagName==='IMG') return {img:true};
      // positioned over an image sibling (heroes)
      if(e.parentElement && [...e.parentElement.children].some(s=>s!==e && s.tagName==='IMG' && getComputedStyle(e).position==='absolute')) return {img:true};
      e=e.parentElement;
    }
    return {rgb:[255,255,255]};
  }
  const out={contrast:[], overImage:[], targets:[], names:[], labels:[], alt:[], nested:[], roleNoTab:[]};
  const app=document.querySelector('#phone');
  // contrast
  const walker=document.createTreeWalker(app, NodeFilter.SHOW_TEXT);
  const seen=new Set();
  while(walker.nextNode()){
    const n=walker.currentNode; if(!n.nodeValue.trim()) continue;
    const el=n.parentElement; if(seen.has(el)) continue; seen.add(el);
    if(el.closest('[aria-hidden="true"],.statusbar,button:disabled')) continue;
    const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)===0) continue;
    const r=el.getBoundingClientRect(); if(!r.width||!r.height) continue;
    const fg=parse(cs.color); if(!fg) continue;
    if(cs.webkitTextFillColor && cs.webkitTextFillColor.includes('0, 0, 0, 0')) continue; // gradient text (logo)
    const bg=bgOf(el);
    const size=parseFloat(cs.fontSize), bold=parseInt(cs.fontWeight)>=700;
    const need=(size>=24||(size>=18.66&&bold))?3:4.5;
    const txt=n.nodeValue.trim().slice(0,28);
    if(bg.img){ out.overImage.push(txt); continue; }
    const rr=ratio(fg.rgb,bg.rgb);
    if(rr<need) out.contrast.push(`${txt} — ${rr.toFixed(2)}:1 (need ${need}) fg rgb(${fg.rgb}) bg rgb(${bg.rgb})${bg.grad?' [gradient]':''}`);
  }
  // targets, names, nesting
  app.querySelectorAll('button,a,input,select,textarea,[role=button],[role=switch],[role=checkbox]').forEach(el=>{
    if(el.closest('.statusbar')||el.disabled) return;
    const r=el.getBoundingClientRect(); if(!r.width) return;
    const isInline = el.matches('.btn-ghost') && r.height>=24;
    if((r.width<44||r.height<44) && !isInline && !el.matches('input,select,textarea')) out.targets.push(`${(el.getAttribute('aria-label')||el.textContent.trim()).slice(0,24)} ${Math.round(r.width)}×${Math.round(r.height)}`);
    const name=(el.getAttribute('aria-label')||el.textContent||el.getAttribute('placeholder')||el.title||'').trim();
    if(!name && !el.matches('input,select,textarea')) out.names.push(el.outerHTML.slice(0,80));
    if(el.matches('input,select,textarea')){ const lab=el.closest('label')||el.getAttribute('aria-label')||(el.id&&document.querySelector(`label[for="${el.id}"]`)); if(!lab) out.labels.push(el.outerHTML.slice(0,80)); }
    if(el.matches('[role=button],button,a') && el.parentElement.closest('button,[role=button],a')) out.nested.push((el.getAttribute('aria-label')||el.textContent.trim()).slice(0,30));
    if(el.matches('[role=button]') && !el.hasAttribute('tabindex')) out.roleNoTab.push(el.textContent.trim().slice(0,30));
  });
  app.querySelectorAll('img').forEach(i=>{ if(!i.hasAttribute('alt')) out.alt.push(i.src.split('/').pop()); });
  return out;
}
