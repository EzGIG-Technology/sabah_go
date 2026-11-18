/* =====================================================================
   STATE COMMAND CENTRE · the video wall: four ministries, one platform.
   Each panel shows only what that role needs.
   ===================================================================== */
function renderCommand(){
  $('#shell').style.display='none'; $('#picker').style.display='block'; document.title='State command centre · Sabah GO';
  const [ma,mb]=PERIODS.mtd.r(), MT=tot(ma,mb), MLY=lySum(ma,mb), top=grows(cube(ma,mb,{}, 'mkt'),'mkt','n').slice(0,5);
  const curK=dyear(LAST)*100+dmon(LAST), col=dsum(ma,LAST).gr, bud=BUDGET[curK]||0, settled=dsum(ma,LAST-1).net + liveSettledSafe(), y=RECON[RECON.length-1];
  const T=tot(LAST,LAST), next=FLIGHTS.filter(f=>!f.arrived&&f.ks>0).slice(0,4);
  const panel = (role, title, body, link, cls='') => `<section class="card ${cls}" style="padding:0;overflow:hidden"><div class="row" style="padding:14px 18px;gap:12px;background:var(--surface2)"><span class="agl">${agLogo(ROLES[role]||{logo:'SG',name:'Sabah GO'})}</span><div class="grow"><b style="font-size:15px">${title}</b><div class="small muted">${(ROLES[role]||{}).who||''}</div></div><button class="link" onclick="go('${role}','${link}')">Open ${ic('chev')}</button></div><div style="padding:16px 18px">${body}</div></section>`;
  $('#picker').innerHTML = `<div class="lp" style="max-width:1500px">
    <nav class="lp-nav"><span class="lp-logo"><img src="${LOGO.full}" alt="Sabah GO"><span><b>State command centre</b><small>${opDate()}</small></span></span><span class="grow"></span><span class="sample">Sample data</span><button class="btn btn-s" onclick="go()">${ic('back')}All portals</button></nav>
    <div class="row wrap" style="margin:26px 0 18px;gap:12px"><h1 class="num" style="font-size:clamp(26px,3.4vw,40px);letter-spacing:-.03em">One platform. Three ministries. Every ringgit traced.</h1></div>
    <div class="wall">
      ${panel('tourism','KePKAS', `<div class="grid g-2e"><div><div class="small muted">Arrivals this month</div><div class="num" style="font-size:34px">${fmtN(MT.n)}</div><div class="row" style="margin:4px 0 12px">${delta(chg(MT.n,MLY))}<span class="small muted">against last year</span></div></div><div><div class="small b" style="margin-bottom:8px">Top five source markets</div>${hbars(top.map(o=>({label:MKT[o.key][1],pre:cc(o.key),value:o.n})))}</div></div>
        <div class="small b" style="margin:18px 0 8px">Where pass holders are now</div>${dmap(dstock(LAST))}`, 'overview', 'w-tall')}
      ${panel('finance','Ministry of Finance Sabah', `<div class="grid g-2e"><div><div class="small muted">Collected this month</div><div class="num" style="font-size:34px">${senK(col)}</div><div class="small muted" style="margin:4px 0 10px">${bud?pct(col/bud*100,0)+' of the '+senK(bud)+' target':''}</div>${progress(bud?col/bud*100:0,'var(--cyan)',9)}</div>
          <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px;align-content:start"><div class="pill-stat"><b>${senK(settled)}</b><small>settled into the State account</small></div><div class="pill-stat"><b>${y.variance===0?'100%':'Exception'}</b><small>reconciled yesterday</small></div></div></div>
        <div class="small b" style="margin:18px 0 6px">Collected each day, last 14 days</div>${barChart({labels:Array.from({length:14},(_,i)=>fmtDs(LAST-13+i)), every:2, h:190, yfmt:v=>'RM '+kN(v), series:[{name:'Collected',color:'#1460E0',data:Array.from({length:14},(_,i)=>DAY[LAST-13+i].gr/100)}]})}
        <button class="link" style="margin-top:8px" onclick="S.role='finance';S.f={cm:${curK},cd:${LAST-1}};location.hash='finance/collections'">Month, then a day, then the Lin family's RM 100 ${ic('chev')}</button>`, 'overview')}
      ${panel('immigration','Immigration Sabah', `<div class="grid g-2e"><div><div class="small muted">Compliance at all entry points today</div><div class="num" style="font-size:34px">${pct(compl(T),1)}</div><div class="small muted" style="margin:4px 0 12px">${fmtN(T.n)} arrivals · ${fmtN(T.ex)} exempt · ${fmtN(T.ks)} unpaid on arrival</div>
          ${hbars([0,2,1].map(c=>({label:CP[c].short,value:compl(cpToday(c))})),{fmt:v=>pct(v,1),max:100})}</div>
        <div><div class="small b" style="margin-bottom:8px">Unpaid on flights still arriving</div>${next.length?table([{h:'Time',v:f=>f.time},{h:'From',v:f=>f.origin.replace(', domestic','')},{h:'Unpaid',r:1,v:f=>`<b style="color:var(--warn)">${f.ks}</b>`}], next):'<p class="note">Every expected passenger has paid.</p>'}<p class="note" style="margin-top:8px">TEC status only: no spending or location data.</p></div></div>`, 'flights')}
      ${panel('ops','Sabah GO Operations', `<div class="grid g-kpi" style="gap:10px"><div class="pill-stat"><b>${pct(UPTIME_30,1)}</b><small>uptime</small></div><div class="pill-stat"><b>${pct(PAY_SUCCESS,1)}</b><small>payment success</small></div><div class="pill-stat"><b>${fmtN(IN_SABAH)}</b><small>pass holders in Sabah</small></div><div class="pill-stat"><b>${fmtN(BELLA[LAST].conv)}</b><small>Bella AI conversations today</small></div></div>
        <div class="row wrap" style="gap:8px;margin-top:14px">${LINKS.map(l=>`<span class="badge b-ok">${l[0]}</span>`).join('')}</div>`, 'overview', 'w-full')}
    </div>
    <footer class="lp-foot"><span>Each ministry sees only what its role needs. Role-based access with two-factor sign-in; every view of personal data is logged. Hosted in Malaysia.</span><span>Dashboards refresh at least every 15 minutes; financial figures come from settled data.</span></footer>
  </div>`;
}
const liveSettledSafe = () => typeof liveSettled==='function' ? liveSettled() : 0;
