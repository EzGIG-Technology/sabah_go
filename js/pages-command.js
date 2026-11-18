/* =====================================================================
   STATE COMMAND CENTRE · the video wall: four ministries, one platform.
   Each panel shows only what that role needs. Headline figures, the clock
   and the activity stream are live (see live.js).
   ===================================================================== */
let CC_FEED = [];
function renderCommand(){
  $('#shell').style.display='none'; $('#picker').style.display='block'; document.title='State command centre · Sabah GO';
  if(typeof seedLive==='function' && !LIVE.rows) seedLive();
  const [ma,mb]=PERIODS.mtd.r(), MT=tot(ma,mb), MLY=lySum(ma,mb), top=grows(cube(ma,mb,{}, 'mkt'),'mkt','n').slice(0,5);
  const curK=dyear(LAST)*100+dmon(LAST), col=dsum(ma,LAST).gr+(LIVE.add||0), bud=BUDGET[curK]||0, settled=dsum(ma,LAST-1).net + liveSettledSafe(), y=RECON[RECON.length-1];
  const T=tot(LAST,LAST), next=FLIGHTS.filter(f=>!f.arrived&&f.ks>0).slice(0,5), today=liveCollectedSafe();
  const hr = MODES.map(m=>({name:MODE[m].l,color:MODEC[m],data:hourly(CP.reduce((s,C,c)=>C.mode===m?s+tot(LAST,LAST,{cps:[c]}).n:s,0))}));
  if(!CC_FEED.length) CC_FEED = Array.from({length:8}, feedItem);
  const pctBud = bud ? col/bud*100 : 0;

  const panel = (role, title, body, link, cls='') => `<section class="card cc-panel ${cls}"><div class="cc-ph"><span class="agl">${agLogo(ROLES[role]||{logo:'SG',name:'Sabah GO'})}</span><div class="grow"><b>${title}</b><small>${(ROLES[role]||{}).who||''}</small></div><button class="btn btn-s btn-sm" onclick="enter('${role}','${link}')">Open ${ic('chev')}</button></div><div class="cc-pb">${body}</div></section>`;
  const tile = (icon, label, value, foot, cls='') => `<div class="cc-kpi ${cls}"><div class="lab">${ic(icon)}${label}</div><b>${value}</b><small>${foot}</small></div>`;
  const big = (label, value, foot) => `<div class="cc-big"><small>${label}</small><b class="num">${value}</b>${foot?`<div class="foot">${foot}</div>`:''}</div>`;

  $('#picker').innerHTML = `<div class="ccw">
  <header class="cc-top" style="--heroimg:${bg('p_command')}"><div class="cc-in">
    <nav class="cc-nav"><span class="lp-logo"><img src="${LOGO.full}" alt="Sabah GO"><span><b>State command centre</b><small>Sabah State Government</small></span></span>
      <span class="grow"></span>
      <div class="cc-clock"><span class="cc-live"><span class="dotlive"></span>Live</span><div><b data-clock>${HHMM}:00</b><small>${fmtD(LAST,{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · MYT</small></div></div>
      <span class="sample hide-sm">Sample data</span>
      <button class="btn btn-glass" onclick="go()">${ic('back')}All portals</button></nav>
    <h1>One platform. Three ministries. Every ringgit traced.</h1>
    <div class="cc-kpis">
      ${tile('ticket','TEC collected today',`<span data-live>${sen(today)}</span>`,'RM 50 per paying visitor','hero')}
      ${tile('enter','Arrivals today',fmtN(T.n),`${fmtN(T.ex)} exempt · under 12`)}
      ${tile('pin','Pass holders in Sabah',fmtN(IN_SABAH),'right now')}
      ${tile('shield','Compliance today',pct(compl(T),1),'arrived with TEC paid')}
      ${tile('bank','Collected this month',senK(col),bud?pct(pctBud,0)+' of the monthly target':'')}
      ${tile('card','Payment success',pct(PAY_SUCCESS,1),'last 24 hours')}
    </div>
  </div></header>

  <div class="cc-in cc-wall">
    ${panel('tourism','KePKAS', `<div class="cc-split">${big('Arrivals this month', fmtN(MT.n), `${delta(chg(MT.n,MLY))}<span>against last year</span>`)}<div class="grow"><h5>Top five source markets</h5>${hbars(top.map(o=>({label:MKT[o.key][1],pre:cc(o.key),value:o.n})))}</div></div>
      <h5 style="margin-top:18px">Where pass holders are now</h5>${dmap(dstock(LAST))}`, 'overview', 'cc-a')}

    ${panel('finance','Ministry of Finance Sabah', `<div class="cc-split">${big('Collected this month', senK(col), bud?`<span>${senK(bud)} target</span>`:'')}
        <div class="cc-ring">${donut([{label:'Collected',value:Math.min(col,bud||col),color:'#1460E0'},{label:'To target',value:Math.max(0,(bud||0)-col),color:'#E3EAF5'}],{size:124,th:14,center:pct(pctBud,0),sub:'of target',fmt:()=>''})}</div></div>
      <div class="cc-pills"><div class="pill-stat"><b>${senK(settled)}</b><small>settled into the State account</small></div><div class="pill-stat"><b data-static>${y.variance===0?'100%':'Exception'}</b><small>reconciled yesterday</small></div></div>
      <h5 style="margin-top:16px">Collected each day, last 14 days</h5>${barChart({labels:Array.from({length:14},(_,i)=>fmtDs(LAST-13+i)), every:2, h:170, yfmt:v=>'RM '+kN(v), series:[{name:'Collected',color:'#1460E0',data:Array.from({length:14},(_,i)=>DAY[LAST-13+i].gr/100)}]})}
      <button class="link" style="margin-top:6px" onclick="S.role='finance';S.f={cm:${curK},cd:${LAST-1}};enter('finance','collections')">Month, then a day, then the Lin family's RM 100 ${ic('chev')}</button>`, 'overview', 'cc-b')}

    <section class="card cc-panel cc-c"><div class="cc-ph"><span class="ic">${ic('spark')}</span><div class="grow"><b class="row" style="gap:8px"><span class="dotlive"></span>Live across Sabah</b><small>Payments, pass checks, merchants and Bella AI</small></div></div>
      <div class="cc-feed" id="ccFeed">${ccFeedHtml()}</div></section>

    ${panel('immigration','Immigration Sabah', `<div class="cc-split">${big('Compliance at all entry points today', pct(compl(T),1), `<span>${fmtN(T.n)} arrivals · ${fmtN(T.ks)} unpaid on arrival</span>`)}<div class="grow"><h5>Airports</h5>${hbars([0,2,1].map(c=>({label:CP[c].short,value:compl(cpToday(c))})),{fmt:v=>pct(v,1),max:100})}</div></div>
      <div class="cc-split" style="margin-top:16px;align-items:flex-start"><div class="grow" style="flex:1.3"><h5>Arrivals by hour today</h5>${barChart({labels:Array.from({length:24},(_,h)=>pad2(h)), every:3, stacked:true, h:170, series:hr})}</div>
        <div class="grow"><h5>Unpaid on flights still arriving</h5>${next.length?table([{h:'Time',v:f=>f.time},{h:'From',v:f=>f.origin.replace(', domestic','')},{h:'Unpaid',r:1,v:f=>`<b style="color:var(--warn)">${f.ks}</b>`}], next):'<p class="note">Every expected passenger has paid.</p>'}<p class="note" style="margin-top:8px">TEC status only: no spending or location data.</p></div></div>`, 'flights', 'cc-d')}

    ${panel('ops','Sabah GO Operations', `<div class="cc-pills cc-pills4"><div class="pill-stat"><b>${pct(UPTIME_30,2)}</b><small>uptime, 30 days</small></div><div class="pill-stat"><b>${pct(PAY_SUCCESS,1)}</b><small>payment success</small></div><div class="pill-stat"><b>${fmtN(BELLA[LAST].conv)}</b><small>Bella AI conversations today</small></div><div class="pill-stat"><b>${fmtN(TICKETS.filter(t=>t.st!=='Resolved').length)}</b><small>open support tickets</small></div></div>
      <h5 style="margin-top:16px">Connected systems</h5><div class="cc-sys">${LINKS.map(l=>`<div><span class="badge b-ok">${l[1]}</span><b>${l[0]}</b><small>${l[2]?l[2]+' ms':'batch feed'}</small></div>`).join('')}</div>`, 'overview', 'cc-e')}
  </div>
  <footer class="cc-in lp-foot" style="margin-top:8px;padding-bottom:40px"><span>Each ministry sees only what its role needs. Role-based access with two-factor sign-in; every view of personal data is logged. Hosted in Malaysia.</span><span>Live figures stream from the platform; financial statements use settled data.</span></footer>
  </div>`;
  TIMERS.push(setInterval(()=>{ const f=$('#ccFeed'); if(!f) return; CC_FEED.unshift(feedItem()); CC_FEED=CC_FEED.slice(0,8); CC_STAMP.unshift(liveHHMMSS()); CC_STAMP=CC_STAMP.slice(0,8); f.innerHTML=ccFeedHtml(); f.firstElementChild.classList.add('feedrow'); }, 3500));
}
let CC_STAMP = [];
const ccFeedHtml = () => CC_FEED.map((x,i)=>li(...x,`<small class="muted">${CC_STAMP[i]?CC_STAMP[i].slice(0,5):'earlier'}</small>`)).join('');
const liveSettledSafe = () => typeof liveSettled==='function' ? liveSettled() : 0;
const liveCollectedSafe = () => typeof liveCollected==='function' ? liveCollected() : DAY[LAST].gr;
