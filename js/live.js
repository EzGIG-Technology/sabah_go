/* =====================================================================
   LIVE LAYER · keeps every dashboard moving.
   - A simulated MYT clock that starts at the operating time (HHMM) and runs
     in real time. Elements with [data-clock] show it.
   - Headline figures count up when a page opens, then keep ticking: running
     totals (money and counts) rise in small steps, rates near their target
     drift by a tenth. Changes flash briefly.
   It only touches what is on screen. Report previews, drawers, modals and
   anything marked data-static are left alone, so report arithmetic and
   signed figures never change. Replace with live API pushes later.
   ===================================================================== */
const LIVE_T0 = Date.now();
const liveNow = () => { const s = NOWMIN*60 + Math.floor((Date.now()-LIVE_T0)/1000); return {h:Math.floor(s/3600)%24, m:Math.floor(s/60)%60, s:s%60}; };
const liveHHMM = () => { const t=liveNow(); return pad2(t.h)+':'+pad2(t.m); };
const liveHHMMSS = () => { const t=liveNow(); return pad2(t.h)+':'+pad2(t.m)+':'+pad2(t.s); };

const LIVE_SEL = '.kpi .val, .lp-stat b, .pill-stat b, .cc-kpi b, .num, [data-live]';
const LIVE_SKIP = '.paper, #modal, #drawer, [data-static], .wm';
const LIVE_REG = new Map();     // element -> state
const LIVE_MEM = new Map();     // page|index|base text -> current value, so a redraw keeps the drift
const RE_NUM = /^(RM\s?)?(-?[\d,]*\.?\d+)\s?([kKM])?(%)?$/;

function liveParse(txt){
  const t = txt.replace(/\s+/g,' ').trim(), m = t.match(RE_NUM); if(!m) return null;
  const raw = m[2], dec = (raw.split('.')[1]||'').length, mult = m[3]==='M'?1e6:(m[3]?1e3:1);
  const v = parseFloat(raw.replace(/,/g,''))*mult; if(!isFinite(v)) return null;
  const kind = m[4] ? 'pct' : m[1] ? 'money' : (dec ? null : 'count');
  if(!kind) return null;
  return {kind, v, dec, suf:m[3]||'', rm:m[1]||'', comma:raw.includes(',')||(v>=1000&&!m[3])};
}
function liveFmt(o, v){
  if(o.kind==='pct') return v.toFixed(o.dec)+'%';
  const div = o.suf==='M'?1e6:(o.suf?1e3:1), n = v/div;
  const s = n.toLocaleString('en-US',{minimumFractionDigits:o.dec, maximumFractionDigits:o.dec, useGrouping:o.comma});
  return o.rm + s + o.suf;
}
function liveSet(el, st, v){ st.cur=v; el.textContent=liveFmt(st, v); LIVE_MEM.set(st.key, v); }
function liveTween(el, st, to, ms=700){
  const from=st.cur, t0=performance.now(); st.cur=to; LIVE_MEM.set(st.key, to);
  const step = now => { const k=Math.min(1,(now-t0)/ms), e=1-Math.pow(1-k,3), v=from+(to-from)*e;
    el.textContent = liveFmt(st, st.kind==='pct'||st.dec ? v : Math.round(v)); if(k<1) requestAnimationFrame(step); else el.textContent=liveFmt(st,to); };
  requestAnimationFrame(step);
}
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

function liveScan(){
  if(S.role && S.page==='reports') return;
  const root = S.role ? $('#content') : $('#picker'); if(!root) return;
  const page = location.hash || '#';
  [...root.querySelectorAll(LIVE_SEL)].forEach((el, i) => {
    if(LIVE_REG.has(el) || el.id || el.closest(LIVE_SKIP) || el.children.length) return;
    const o = liveParse(el.textContent); if(!o) return;
    const key = page+'|'+i+'|'+el.textContent.trim();
    const st = {...o, base:o.v, cur:o.v, key, drift: (o.kind==='money' && o.v>=1000) || (o.kind==='count' && o.v>=100) || (o.kind==='pct' && o.dec>0 && o.v>50 && o.v<99.95)};
    LIVE_REG.set(el, st);
    const mem = LIVE_MEM.get(key);
    if(mem!=null){ liveSet(el, st, mem); return; }
    if(!REDUCED && o.kind!=='pct' && o.v>=100){ st.cur = o.kind==='count' ? Math.round(o.v*.9) : o.v*.9; liveTween(el, st, o.v, 900); }
  });
}
function liveTick(){
  LIVE_REG.forEach((st, el) => {
    if(!el.isConnected){ LIVE_REG.delete(el); return; }
    if(!st.drift || Math.random()<.45) return;
    let to = st.cur;
    if(st.kind==='money'){ const unit = st.cur>=20000 ? 5000/100 : 5; to += unit*Math.ceil(Math.random()*Math.max(1, st.cur*.00035/unit)); }
    else if(st.kind==='count'){ to += Math.ceil(Math.random()*Math.max(1, Math.round(st.cur*.0003))); }
    else { to = Math.min(99.9, Math.max(st.base-.3, Math.min(st.base+.3, st.cur + (Math.random()<.5?-1:1)*Math.pow(10,-st.dec)))); }
    if(to===st.cur || liveFmt(st,to)===liveFmt(st,st.cur)){ st.cur=to; LIVE_MEM.set(st.key,to); return; }
    const up = to>st.cur;
    if(REDUCED) liveSet(el, st, to); else liveTween(el, st, to);
    el.classList.remove('tick-up','tick-dn'); void el.offsetWidth; el.classList.add(up?'tick-up':'tick-dn');
  });
}
function liveClock(){ const t=liveHHMMSS(), hm=liveHHMM(); document.querySelectorAll('[data-clock]').forEach(e=>{ e.textContent = e.dataset.clock==='hm' ? hm : t; }); }

/* watch the page areas and register new figures whenever a page draws */
(function(){
  let q=0; const later = () => { if(q) return; q=requestAnimationFrame(()=>{ q=0; liveScan(); }); };
  const mo = new MutationObserver(muts => { if(muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===1))) later(); });
  ['#content','#picker'].forEach(s=>{ const el=$(s); if(el) mo.observe(el,{childList:true,subtree:true}); });
  setInterval(liveTick, 2600);
  setInterval(liveClock, 1000);
})();
