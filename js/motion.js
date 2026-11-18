/* =====================================================================
   MOTION · tags freshly drawn charts and cards so css/glass.css can
   animate them: bars grow, lines trace, cards below the fold rise in as
   they scroll into view, and glass surfaces catch a soft light under the
   pointer. Pages are plain HTML strings, so this watches the page areas
   and decorates whatever is added. Nothing here changes any figure.
   ===================================================================== */
(function(){
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver(onSeen, {rootMargin:'0px 0px -6% 0px', threshold:.08}) : null;
  let batch = 0;

  function onSeen(entries){
    entries.filter(e=>e.isIntersecting).forEach(e=>{
      const el=e.target; io.unobserve(el);
      el.style.setProperty('--rd', (batch++ % 4) * 70 + 'ms');
      el.classList.add('rv-in');
      const done = ev => { if(ev.target!==el) return; el.classList.remove('rv','rv-in'); el.style.removeProperty('--rd'); el.removeEventListener('transitionend', done); };
      el.addEventListener('transitionend', done);
      setTimeout(()=>{ batch=0; }, 120);
    });
  }

  function charts(root){
    root.querySelectorAll('svg.ch:not([data-mo])').forEach(svg=>{
      svg.setAttribute('data-mo','');
      if(svg.closest('.donut-wrap')) return;
      const xs=[];
      svg.querySelectorAll('rect').forEach(r=>{
        if(r.getAttribute('fill')==='transparent') return;
        const x=+r.getAttribute('x')||0; if(!xs.includes(x)) xs.push(x);
        r.classList.add('bar-in');
      });
      xs.sort((a,b)=>a-b);
      svg.querySelectorAll('rect.bar-in').forEach(r=>r.style.setProperty('--ci', Math.min(40, xs.indexOf(+r.getAttribute('x')||0))));
      svg.querySelectorAll('path').forEach(p=>{
        const f=p.getAttribute('fill');
        if(f==='none' && !p.getAttribute('stroke-dasharray')){ p.setAttribute('pathLength','1'); p.classList.add('line-in'); }
        else p.classList.add('area-in');
      });
      svg.querySelectorAll('circle').forEach(c=>c.classList.add('dot-in'));
    });
    root.querySelectorAll('.kpi .sp path:not([pathLength])').forEach(p=>p.setAttribute('pathLength','1'));
  }

  function stagger(root){
    root.querySelectorAll('.grid').forEach(g=>[...g.children].forEach((c,i)=>c.style.setProperty('--si', Math.min(i,8))));
    root.querySelectorAll('.dmap').forEach(m=>[...m.children].forEach((c,i)=>c.style.setProperty('--ti', Math.min(i,30))));
    root.querySelectorAll('.heat').forEach(h=>[...h.querySelectorAll(':scope>div')].forEach((c,i)=>c.style.setProperty('--hi', i%24 + Math.floor(i/24)*3)));
  }

  function reveal(root){
    if(reduced || !io) return;
    const fold = innerHeight * .92;
    root.querySelectorAll('.fade>*:not(.grid), .fade .grid>*').forEach(el=>{
      if(el.closest('.paper') || el.classList.contains('rv')) return;
      if(el.getBoundingClientRect().top > fold){ el.classList.add('rv'); io.observe(el); }
    });
  }

  function decorate(root){ charts(root); stagger(root); requestAnimationFrame(()=>reveal(root)); }

  let q=0;
  const later = () => { if(q) return; q=requestAnimationFrame(()=>{ q=0; ['#content','#picker','#drawer','#modal'].forEach(s=>{ const el=$(s); if(el) decorate(el); }); }); };
  const mo = new MutationObserver(muts => { if(muts.some(m=>[...m.addedNodes].some(n=>n.nodeType===1))) later(); });
  ['#content','#picker','#drawer','#modal'].forEach(s=>{ const el=$(s); if(el) mo.observe(el,{childList:true,subtree:true}); });
  later();

  /* a soft light follows the pointer across glass surfaces */
  if(!reduced && matchMedia('(hover: hover)').matches){
    let raf=0, ev=null;
    document.addEventListener('pointermove', e=>{ ev=e; if(raf) return; raf=requestAnimationFrame(()=>{ raf=0;
      const el = ev.target.closest && ev.target.closest('.card,.tile,.rc,.pcard,.jsteps,.jdetail'); if(!el) return;
      const b = el.getBoundingClientRect();
      el.style.setProperty('--mx', (ev.clientX-b.left)+'px'); el.style.setProperty('--my', (ev.clientY-b.top)+'px');
    }); }, {passive:true});
    document.addEventListener('pointerout', e=>{ const el = e.target.closest && e.target.closest('.card,.tile,.rc,.pcard,.jsteps,.jdetail'); if(el && !el.contains(e.relatedTarget)){ el.style.removeProperty('--mx'); el.style.removeProperty('--my'); } }, {passive:true});
  }
})();
