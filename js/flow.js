/* =====================================================================
   LANDING · "How it all works": Sabah GO at the top, the apps, agencies
   and operator beneath it, and the State command centre where the
   agencies come back together. Wires are drawn after layout (drawFlow)
   so they always meet the cards, and are redrawn on resize.
   ===================================================================== */
const FLOWTREE = [
  {g:'people', label:'Visitors and businesses', nodes:[
    {k:'app', name:'Visitor app', logo:'/img/logo_mark.webp', role:'Travellers, iOS and Android', flow:'Pays the RM 50 TEC, carries the digital pass, plans with Bella AI'},
    {k:'merchant', name:'Merchant app', logo:LOGO.emblem, role:'Shops, stalls and operators', flow:'Takes Sabah GO QR payments and pass-holder deals'}]},
  {g:'gov', label:'State agencies', nodes:[
    {k:'tourism', name:'KePKAS', logo:LOGO.KEP, role:'Ministry of Tourism, Culture and Environment', flow:'Receives arrivals, movement and spending, sends official alerts'},
    {k:'finance', name:'Ministry of Finance Sabah', logo:LOGO.MOF, role:'TEC revenue', flow:'Receives every ringgit, settled and reconciled daily'},
    {k:'immigration', name:'Immigration Sabah', logo:LOGO.IMM, role:'TEC compliance', flow:'Receives TEC status at every entry point'}]},
  {g:'ops', label:'Platform operator', nodes:[
    {k:'ops', name:'Sabah GO Operations', logo:LOGO.emblem, role:'Run by Microtek Solutions', flow:'Keeps it running: uptime, payments, merchants and support'}]},
];
const FLOWTREE_C = {people:'#14B8A6', gov:'#1460E0', ops:'#7B4DE3'};
const FLOWTREE_CHIPS = ['TEC collection','Digital tourist pass','Bella AI','Payments and settlement','Audit trail'];

const flowNode = (n, g) => `<button class="fnode" data-k="${n.k}" data-g="${g}" onclick="enter('${n.k}')" onmouseenter="flowHi('${n.k}')" onmouseleave="flowHi()" onfocus="flowHi('${n.k}')" onblur="flowHi()">
  <span class="fcrest"><img src="${n.logo}" alt=""></span><span class="fbody"><small>${n.role}</small><b>${n.name}</b><span class="fflow">${n.flow}</span></span><span class="fgo" aria-hidden="true">${ic('chev')}</span></button>`;

function flowTree(){
  return `<section class="lp-sec flow-head" id="how"><span class="flow-kick">${ic('spark')}How it all works</span><h2>One platform. Every ringgit and every check goes where it belongs.</h2>
    <p>Sabah GO sits at the top. Each app, agency and operator below it sees only its own part, and the State command centre brings the agencies back together.</p></section>
  <div class="flow" id="flow">
    <svg class="flow-wires" id="flowWires" aria-hidden="true"></svg>
    <div class="flow-root-wrap"><button class="froot" data-k="root" onclick="document.getElementById('portals').scrollIntoView({behavior:'smooth'})">
      <span class="froot-glow" aria-hidden="true"></span>
      <span class="froot-crest"><img src="${LOGO.emblem}" alt=""></span>
      <span class="froot-body"><small>The platform · hosted in Malaysia</small><b>Sabah GO</b><span class="froot-chips">${FLOWTREE_CHIPS.map(c=>`<i>${c}</i>`).join('')}</span></span>
    </button></div>
    <div class="flow-row">${FLOWTREE.map(G=>`<div class="fgroup" data-g="${G.g}" style="--n:${G.nodes.length}"><span class="glabel">${G.label}</span><div class="fnodes">${G.nodes.map(n=>flowNode(n,G.g)).join('')}</div></div>`).join('')}</div>
    <div class="flow-cc-wrap"><button class="fnode fcc" data-k="command" onclick="enter('command')" onmouseenter="flowHi('command')" onmouseleave="flowHi()" onfocus="flowHi('command')" onblur="flowHi()">
      <span class="fcrest"><img src="${LOGO.emblem}" alt=""></span><span class="fbody"><small>All agencies together</small><b>State command centre</b><span class="fflow">One wall for the State: each agency's view, live</span></span><span class="fgo" aria-hidden="true">${ic('chev')}</span></button></div>
  </div>`;
}

/* wires: root to every node, and the agencies and operator down to the command centre */
function drawFlow(){
  const box=document.getElementById('flow'), svg=document.getElementById('flowWires'); if(!box||!svg) return;
  if(getComputedStyle(svg).display==='none'){ svg.innerHTML=''; return; }
  const B=box.getBoundingClientRect(), R=el=>{ const r=el.getBoundingClientRect(); return {x:r.left-B.left, y:r.top-B.top, w:r.width, h:r.height}; };
  svg.setAttribute('viewBox',`0 0 ${B.width} ${B.height}`);
  const root=R(box.querySelector('.froot')), cc=R(box.querySelector('.fcc')), rx=root.x+root.w/2, ry=root.y+root.h;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let defs=`<defs>${['people','gov','ops'].map(g=>`<linearGradient id="fg-${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22B5F0"/><stop offset="1" stop-color="${FLOWTREE_C[g]}"/></linearGradient>`).join('')}
    <filter id="fglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>`, out='';
  const wire=(d,g,k,i,dur)=>{ out+=`<g class="fw" data-k="${k}" data-g="${g}"><path d="${d}" class="fw-base"/><path d="${d}" class="fw-line" stroke="url(#fg-${g})"/><path d="${d}" class="fw-flow" stroke="${FLOWTREE_C[g]}"/>`
    +(reduced?'':`<circle r="4" class="fw-dot" fill="${FLOWTREE_C[g]}" filter="url(#fglow)"><animateMotion dur="${dur}s" begin="${(i*.45).toFixed(2)}s" repeatCount="indefinite" path="${d}" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .25 1"/></circle><circle r="2.4" fill="#fff"><animateMotion dur="${dur}s" begin="${(i*.45).toFixed(2)}s" repeatCount="indefinite" path="${d}" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .25 1"/></circle>`)+`</g>`; };
  let i=0;
  box.querySelectorAll('.flow-row .fnode').forEach(el=>{ const n=R(el), x=n.x+n.w/2, y=n.y, my=ry+(y-ry)*.55;
    wire(`M${rx},${ry} C${rx},${my} ${x},${ry+(y-ry)*.45} ${x},${y}`, el.dataset.g, el.dataset.k, i++, 2.6); });
  const cx=cc.x+cc.w/2, cy=cc.y;
  box.querySelectorAll('.flow-row .fnode[data-g="gov"],.flow-row .fnode[data-g="ops"]').forEach(el=>{ const n=R(el), x=n.x+n.w/2, y=n.y+n.h, my=y+(cy-y)*.5;
    wire(`M${x},${y} C${x},${my} ${cx},${my} ${cx},${cy}`, el.dataset.g, 'command '+el.dataset.k, i++, 2.2); });
  svg.innerHTML=defs+out;
}
function flowHi(k){ const svg=document.getElementById('flowWires'), box=document.getElementById('flow'); if(!svg) return;
  box.classList.toggle('hi', !!k);
  svg.querySelectorAll('.fw').forEach(w=>w.classList.toggle('on', !!k && (w.dataset.k===k || w.dataset.k.split(' ').includes(k))));
  box.querySelectorAll('.fnode').forEach(n=>n.classList.toggle('on', n.dataset.k===k)); }
(function(){ let t=0; const later=()=>{ cancelAnimationFrame(t); t=requestAnimationFrame(drawFlow); };
  window.addEventListener('resize', later);
  if('ResizeObserver' in window){ const ro=new ResizeObserver(later); const watch=()=>{ const f=document.getElementById('flow'); if(f&&!f._ro){ f._ro=1; ro.observe(f); } };
    new MutationObserver(()=>{ watch(); later(); }).observe(document.getElementById('picker'),{childList:true}); }
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(later);
})();
