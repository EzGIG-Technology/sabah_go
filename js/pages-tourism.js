/* =====================================================================
   KePKAS · arrivals, source markets, visitor movement and spending,
   destination capacity, official alerts
   ===================================================================== */
const HEATC = ['#D4E4F9','#9CC3F5','#4D8EEB','#1460E0','#0A2463'];
/* District view: a real map of Sabah's 27 districts (default) or the tile map.
   Each district is coloured by a volume band; the number is the count there now. */
let DVIEW = 'map';
const DBANDS_PEOPLE = [0,250,1000,2500,5000];
function dbands(vals, unit){
  if(unit==='visitors') return DBANDS_PEOPLE;
  const s=vals.slice().sort((x,y)=>x-y), nice=v=>{ if(v<=0) return 0; const m=Math.pow(10,Math.floor(Math.log10(v))-1); return Math.round(v/m)*m; };
  const b=[0,...[.2,.4,.6,.8].map(q=>nice(s[Math.floor(q*(s.length-1))]))];
  return b.filter((v,i)=>i===0||v>b[i-1]);
}
const dband = (v, br) => { let k=0; br.forEach((t,i)=>{ if(v>=t) k=i; }); return Math.min(4, Math.round(k*(4/Math.max(1,br.length-1)))); };
function setDView(v){ DVIEW=v; document.querySelectorAll('.dview').forEach(e=>{ e.dataset.v=v; e.querySelectorAll('.dv-seg button').forEach(b=>{ const on=b.dataset.v===v; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on); }); }); }
function dsvg(vals, br, {fmt, unit, sel}){
  if(typeof SABAH_GEO==='undefined') return '';
  const G=SABAH_GEO, idx=Object.fromEntries(DISTRICTS.map((x,i)=>[x[0],i]));
  // districts too small to hold a label get a callout in the sea, west of the coast
  const CALL={'Kota Kinabalu':[168,288],'Putatan':[146,346],'Penampang':[128,396],'Kuala Penyu':[104,456]};
  let paths='', labs='', calls='';
  Object.entries(G.d).forEach(([n,d])=>{ const i=idx[n]; if(i==null) return; const k=dband(vals[i],br), dark=k>=2;
    paths+=`<path d="${d}" fill="${HEATC[k]}" class="${sel===i?'on':''}"><title>${n}: ${fmt(vals[i])} ${unit}</title></path>`;
    const [x,y,room]=G.lab[n], ink=dark?'#fff':'#0A2463';
    if(CALL[n]){ const [cx,cy]=CALL[n]; calls+=`<line x1="${x}" y1="${y}" x2="${cx+4}" y2="${cy-4}" class="ld"/><circle cx="${x}" cy="${y}" r="2.5" class="ldot"/><text x="${cx}" y="${cy-14}" text-anchor="end" class="dn ext">${n}</text><text x="${cx}" y="${cy+6}" text-anchor="end" class="dv ext">${fmt(vals[i])}</text>`; return; }
    if(room>=22) labs+=`<text x="${x}" y="${y-4}" text-anchor="middle" class="dn" fill="${ink}">${n}</text><text x="${x}" y="${y+17}" text-anchor="middle" class="dv" fill="${ink}">${fmt(vals[i])}</text>`;
    else labs+=`<text x="${x}" y="${y+6}" text-anchor="middle" class="dv" fill="${ink}"><title>${n}</title>${fmt(vals[i])}</text>`; });
  return `<svg class="dsvg" viewBox="0 0 ${G.w} ${G.h}" role="img" aria-label="Map of Sabah's districts, coloured by ${unit}">${paths}${calls}${labs}</svg>`;
}
function dmap(vals, {fmt=fmtN, unit='visitors', sel}={}){
  const br=dbands(vals,unit), k=v=>dband(v,br), tiles=Array.from({length:7*7},()=>null); DISTRICTS.forEach((x,i)=>{ tiles[x[2]*7+x[1]]=i; });
  const band=(i)=>br[i+1]!=null?`${fmt(br[i])} to ${fmt(br[i+1]-(unit==='visitors'?1:0))}`:`${fmt(br[i])} and over`;
  const legend=br.map((_,i)=>`<span><i style="background:${HEATC[Math.min(4,Math.round(i*(4/Math.max(1,br.length-1))))]}"></i>${i===0&&unit==='visitors'?'Under '+fmt(br[1]):band(i)}</span>`).join('');
  return `<div class="dview" data-v="${DVIEW}">
  <div class="dv-seg seg" role="group" aria-label="District view"><button data-v="map" class="${DVIEW==='map'?'on':''}" aria-pressed="${DVIEW==='map'}" onclick="setDView('map')">Map</button><button data-v="tiles" class="${DVIEW==='tiles'?'on':''}" aria-pressed="${DVIEW==='tiles'}" onclick="setDView('tiles')">Tiles</button></div>
  <div class="dv-map">${dsvg(vals,br,{fmt,unit,sel})}</div>
  <div class="dv-tiles"><div class="dmap" role="img" aria-label="Tile map of Sabah districts">${tiles.map(i=>i===null?'<div></div>':`<div class="dtile" title="${DISTRICTS[i][0]}: ${fmt(vals[i])} ${unit}" style="background:${HEATC[k(vals[i])]};${k(vals[i])<=1?'color:#0A2463':''};${sel===i?'outline:2px solid #FF8A1F':''}"><span>${DISTRICTS[i][0]}</span><b>${fmt(vals[i])}</b></div>`).join('')}</div></div>
  <div class="dv-legend small muted">${legend}<span class="dv-unit">${unit==='visitors'?'pass holders in each district':unit}</span></div>
  <div class="dv-note small muted"><span class="dv-mapnote">Boundaries: geoBoundaries (CC BY 3.0).</span><span class="dv-tilenote">Tile map, not to scale.</span></div></div>`; }
const REVIEWS = [['Park Ji-woo',MI.KR,5,'Semporna Island Hopping Co.','Paid the entry contribution before landing and the scan at KKIA took a second.'],['Olivia Brown',MI.AU,4,'Kinabalu Park','The climb was the highlight of our year. I wish the app showed porter availability.'],['Wang Lei',MI.CN,5,'Tamu Kota Belud','Alipay worked at every stall. Bella AI translated everything for us.'],['Lukas Weber',MI.DE,3,'Jesselton Point Ferry','The ferry was fine but the 10am queue for Manukan was long.'],['Sato Yuki',MI.JP,5,'Sepilok Orangutan Centre','Well organised. The feeding-time reminder in the app was useful.']];
PAGES.tourism = {
overview(){
  const [a,b]=RR(), T=tot(a,b), LYt=lySum(a,b), live=tot(0,LAST), mk=grows(cube(a,b,{}, 'mkt'),'mkt','n').slice(0,5), [ma,mb]=PERIODS.mtd.r(), MT=tot(ma,mb), MLY=lySum(ma,mb);
  return `<div class="grid g-kpi">
    ${kpi({label:'Arrivals this month',value:fmtN(MT.n),d:chg(MT.n,MLY),foot:'against the same days last year',icon:'plane',hero:true,sp:L30.map(d=>DAY[d].n)})}
    ${kpi({label:'Arrivals · '+rangeL(),value:fmtN(T.n),d:S.range==='mtd'?null:chg(T.n,LYt),foot:'international visitors',icon:'enter'})}
    ${kpi({label:'Progress to the 2027 target',value:pct(live.n/ARR_TARGET_2027*100,1),foot:`${fmtN(live.n)} of ${fmtN(ARR_TARGET_2027)}, June to December`,icon:'flag'})}
    ${kpi({label:'Pass holders in Sabah now',value:fmtN(IN_SABAH),icon:'pin'})}
    ${kpi({label:'Spending per visitor',value:sen(Math.round(T.sp/Math.max(1,T.n))),foot:S.range==='today'?'arrivals so far today':'through Sabah GO',icon:'wallet'})}
  </div>
  <div class="grid g-2 mt">
    ${card('Arrivals by month against last year', barChart({labels:MONTHKEYS.map(k=>MONTHS[k%100]), every:1, series:[{name:'This year',color:'#1460E0',data:MONTHKEYS.map(k=>tot(...monthRange(k)).n)},{name:'Last year',color:'#22B5F0',data:MONTHKEYS.map(k=>lySum(...monthRange(k)))}]}), {sub:MONTHS[dmon(LAST)]+' is month to date'})}
    ${card('Top five source markets', hbars(mk.map(o=>({label:MKT[o.key][1],pre:cc(o.key),value:o.n}))), {sub:rangeL(), action:`<button class="link" onclick="go('tourism','markets')">All markets ${ic('chev')}</button>`})}
  </div>
  <div class="grid g-21 mt">
    ${card('Where visitors are now', dmap(dstock(LAST)), {sub:'Pass holders by district, anonymised, from visitors who allow location', action:`<button class="link" onclick="go('tourism','movement')">Movement ${ic('chev')}</button>`})}
    ${card('Top attractions this week', attractionsWeek().slice(0,6).map(x=>`<div class="li"><span class="av" style="border-radius:10px;width:44px;height:44px;background-image:${bg(x.D.img)};background-size:cover"></span><div class="grow"><b>${x.D.n}</b><small>${x.D.d}</small></div><span class="b">${fmtN(x.s)}</span></div>`).join(''), {flush:true, sub:'Visitor-days on site, last 7 days'})}
  </div>`;
},
movement(){
  const sel=S.f.dsel??null, today=dstock(LAST), wk=Array(DISTRICTS.length).fill(0); for(let d=LAST-6; d<=LAST; d++) dstock(d).forEach((v,i)=>wk[i]+=v);
  const plans=Math.round(BELLA[LAST].conv*.103);
  return phead('Where visitors go, from visitors who allow location, shown anonymised and aggregated. No individual can be seen.')+`<div class="grid g-kpi">
    ${kpi({label:'Pass holders in Sabah now',value:fmtN(IN_SABAH),icon:'pin',hero:true})}${kpi({label:'Outside Kota Kinabalu',value:pct((IN_SABAH-today[6])/IN_SABAH*100),icon:'leaf',tone:'t-green'})}
    ${kpi({label:'Itineraries saved with Bella AI today',value:fmtN(plans),foot:'to '+HHMM,icon:'spark'})}${kpi({label:'Busiest district this week',value:DISTRICTS[wk.indexOf(Math.max(...wk))][0],icon:'mount'})}</div>
  <div class="grid g-21 mt">${card('Visitor heatmap by district', dmap(today,{sel}), {sub:'Right now · '+HHMM})}
    ${card('Top attractions this week', attractionsWeek().slice(0,8).map(x=>`<div class="li"><span class="av" style="border-radius:10px;width:44px;height:44px;background-image:${bg(x.D.img)};background-size:cover"></span><div class="grow"><b>${x.D.n}</b><small>${x.D.d}${x.D.permit?' · permits used':''}</small></div><span class="b">${fmtN(x.s)}</span></div>`).join(''), {flush:true, sub:'Visitor-days, last 7 days'})}</div>
  ${card('Average visitors per district per day, last 7 days', hbars(DISTRICTS.map((x,i)=>({label:x[0],value:wk[i]/7})).sort((x,y)=>y.value-x.value),{fmt:v=>fmtN(v)}), {style:'margin-top:14px', action:`<button class="btn btn-s btn-sm" onclick="go('tourism','reports/b:tou_movement')">${ic('file')}Report</button>`})}`;
},
markets(){
  const pk=S.f.mp||'mtd', [a,b]=PERIODS[pk].r(), T=tot(a,b), g=grows(cube(a,b,{}, 'mkt'),'mkt','n');
  const topCp = m => { let best=0,bi=0; for(let c=0;c<NC;c++){ let s=0; for(let d=a; d<=b; d++) s+=F.n[ix(d,c,m)]; if(s>best){best=s;bi=c;} } return CP[bi].short; };
  return phead('International arrivals by nationality from verified pass entries, against last year. Last year is built from the 2025 figures in the Sabah GO deck.', chips([['last7','7 days'],['last30','30 days'],['mtd','Month to date'],['lastMonth','Last month'],['live','Since go-live']], pk, 'setMp'))
  + `<div class="grid g-2e">${card('Share of arrivals', donut([...g.slice(0,6).map((o,i)=>({label:MKT[o.key][1],value:o.n,color:PAL[i]})),{label:'All other markets',value:g.slice(6).reduce((s,o)=>s+o.n,0),color:'#8592AD'}],{center:kN(T.n),sub:PERIODS[pk].l.toLowerCase()}))}
    ${card('Top three markets by month', lineChart({labels:MONTHKEYS.map(k=>MONTHS[k%100]), every:1, area:false, series:g.slice(0,3).map((o,i)=>({name:MKT[o.key][1],color:['#1460E0','#22B5F0','#0A2463'][i],data:MONTHKEYS.map(k=>tot(...monthRange(k),{mkts:[o.key]}).n)}))}))}</div>
  ${card('All source markets · '+PERIODS[pk].l, table([{h:'Market',v:o=>`<span class="row">${cc(o.key)}<b>${MKT[o.key][1]}</b></span>`},{h:'Arrivals',r:1,v:o=>fmtN(o.n)},{h:'Share',r:1,v:o=>pct(o.n/T.n*100)},{h:'Last year',r:1,v:o=>fmtN(lySum(a,b,[o.key]))},{h:'Change',r:1,v:o=>delta(chg(o.n,lySum(a,b,[o.key])))},{h:'Exempt',r:1,v:o=>fmtN(o.ex)},{h:'Average stay',r:1,v:o=>o.dep?(o.dst/o.dep).toFixed(1)+' nights':'n/a'},{h:'Main entry point',v:o=>topCp(o.key)}], g,
    {foot:['Total',fmtN(T.n),'100.0%',fmtN(lySum(a,b)),comp(T.n,lySum(a,b)),fmtN(T.ex),T.dep?(T.dst/T.dep).toFixed(1)+' nights':'','']}), {flush:true, style:'margin-top:14px', action:`<button class="btn btn-s btn-sm" onclick="openMarketsReport('${pk}')">${ic('file')}Open as report</button>`})}`;
},
destinations(){
  const alerts=DEST.map((d,k)=>({d,k,v:dvis(k,LAST+1)})).filter(x=>x.d.permit&&x.v>=x.d.cap*.95);
  return phead('Visitors on site against daily limits. Permit sites show Sabah Parks permits used, including bookings for tomorrow.')
  + `<div class="stack">${alerts.map(x=>alertBox('warn','mount',`${x.d.n}: ${fmtN(x.v)} of ${fmtN(x.d.cap)} permits booked for tomorrow`,`${pct(x.v/x.d.cap*100,0)} of the daily quota. New bookings for full days go to the waitlist.`,`<button class="btn btn-sm btn-s" onclick="toast('Notice sent to visitors on the waitlist','send')">Notify waitlist</button>`)).join('')}</div>
  <div class="tiles mt">${DEST.map((d,k)=>{ const v=d.permit?dvis(k,LAST):dvis(k,LAST), p=d.cap?v/d.cap*100:null; let pk=0; for(let x=LAST-29;x<LAST;x++) pk=Math.max(pk,dvis(k,x)); return `<div class="tile"><div class="ph" style="background-image:${bg(d.img)}"></div><div class="row between"><h4>${d.n}</h4><small class="muted">${d.r} of 5</small></div><small class="muted">${d.d} · 30-day peak ${fmtN(pk)}</small>
    <div class="row between"><span class="num" style="font-size:22px">${fmtN(v)}</span>${p!==null?badge(pct(p,0)+(d.permit?' of permits':' of limit'),p>=95?'bad':p>=80?'warn':'ok'):badge('No daily limit','mute')}</div>${p!==null?progress(p,p>=95?'var(--bad)':p>=80?'var(--warn)':''):''}<small class="muted">${d.permit?'Permits used today':'On site today, to '+HHMM}</small></div>`; }).join('')}</div>`;
},
spending(){
  const pk=S.f.sp||'last30', [a,b]=PERIODS[pk].r(), T=tot(a,b), w=DISTRICTS.map(x=>x[3]*x[4]), dist=lr(T.sp,w), C=[['Accommodation',38],['Tours and activities',24],['Food',17],['Transport',11],['Handicrafts',7],['Other',3]], cats=lr(T.sp,C.map(x=>x[1]));
  const mk=grows(cube(a,b,{}, 'mkt'),'mkt').filter(o=>o.n>200).sort((x,y)=>y.sp/y.n-x.sp/x.n).slice(0,10);
  return phead('For the first time the State can see where visitors spend: payments to Sabah GO merchants by QR and bookings in the app. It is part of all visitor spending, not the whole of it.', chips([['last7','7 days'],['last30','30 days'],['mtd','Month to date'],['live','Since go-live']], pk, 'setSp'))+`<div class="grid g-kpi">
    ${kpi({label:'Spending through Sabah GO',value:senK(T.sp),foot:PERIODS[pk].l.toLowerCase(),icon:'wallet',hero:true})}${kpi({label:'Per visitor',value:sen(Math.round(T.sp/Math.max(1,T.n))),icon:'users'})}
    ${kpi({label:'Spent outside Kota Kinabalu',value:pct((T.sp-dist[6])/Math.max(1,T.sp)*100),icon:'leaf',tone:'t-green'})}${kpi({label:'Kota Belud',value:senK(dist[2]),foot:'including Tamu Kota Belud',icon:'basket'})}</div>
  <div class="grid g-21 mt">${card('Spending by district', dmap(dist,{fmt:v=>senK(v),unit:'spent'}))}
    ${card('By category', hbars(C.map((c,i)=>({label:c[0],value:cats[i]})),{fmt:senK}), {sub:'Food and handicrafts reach small traders directly'})}</div>
  ${card('Spending per visitor by nationality', barChart({labels:mk.map(o=>MKT[o.key][0]), every:1, h:210, yfmt:v=>'RM '+kN(v), series:[{name:'Per visitor',color:'#1460E0',data:mk.map(o=>o.sp/o.n/100)}]}), {style:'margin-top:14px', sub:'Markets with more than 200 arrivals in the period'})}`;
},
events(){
  return phead('Events appear in the visitor app and can carry a targeted message and coupon.', `<button class="btn btn-p" onclick="campaignModal()">${ic('plus')}New campaign</button>`)
  + `<div class="tiles">${EVENTS.slice().sort((x,y)=>x.day-y.day).map(e=>`<div class="tile"><div class="ph" style="background-image:${bg(e.img)}"></div><div class="row between"><h4>${e.n}</h4>${e.day>LAST?badge('In '+plural(e.day-LAST,'day'),'info'):badge('Held','ok')}</div><small class="muted">${e.where} · ${fmtD(e.day)}</small>
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px"><div class="pill-stat"><b>${fmtN(e.saved)}</b><small>saved it</small></div><div class="pill-stat"><b>${e.chk?fmtN(e.chk):'n/a'}</b><small>checked in</small></div></div>${e.spend?`<small class="muted">Spending within 2 km: <b style="color:var(--ink)">${sen(e.spend)}</b></small>`:''}</div>`).join('')}</div>
  ${card('Campaigns', table([{h:'Campaign',v:c=>`<b>${esc(c[0])}</b>`},{h:'Markets',v:c=>c[1]},{h:'Sent',r:1,v:c=>fmtN(c[2])},{h:'Opened',r:1,v:c=>c[2]?pct(c[3]/c[2]*100):'n/a'},{h:'Coupons used',r:1,v:c=>fmtN(c[4])},{h:'Spending from coupons',r:1,v:c=>sen(c[5])},{h:'Status',v:c=>c[6]?badge(c[6],'warn'):badge('Sent','ok')}], CAMPAIGNS), {flush:true, style:'margin-top:14px'})}`;
},
alerts(){
  const area=S.f.aa??15, ds=dstock(LAST), to=ds[area];
  const langs = (()=>{ const w={}; for(let m=0;m<NM;m++){ let s=0; for(let c=0;c<NC;c++) s+=F.n[ix(LAST-1,c,m)]; w[LANGS[MKT[m][0]]]=(w[LANGS[MKT[m][0]]]||0)+s; } const top=Object.entries(w).sort((x,y)=>y[1]-x[1]).map(x=>x[0]); return [...new Set([...top.slice(0,3),'English','Malay'])]; })();
  return phead('Reach every pass holder in an area, in their own language. Every send and delivery is recorded.')+`<div class="grid g-12">
    ${card('New alert', `<div class="stack"><label class="field">Area<select onchange="S.f.aa=+this.value;rerender()">${DISTRICTS.map((x,i)=>`<option value="${i}" ${i===area?'selected':''}>${x[0]}</option>`).join('')}</select><span class="hint">${fmtN(to)} pass holders there now</span></label>
      <label class="field">Type<select id="alT"><option>Sea conditions</option><option>Weather advisory</option><option>Road or ferry disruption</option><option>Public health</option><option>Event</option></select></label>
      <label class="field">Message in English<textarea id="alM" rows="4" placeholder="Keep it short and say what visitors should do"></textarea><span class="hint">Translated automatically into ${langs.join(', ')}</span></label>
      <button class="btn btn-p" onclick="sendAlert(${area})">${ic('send')}Send to ${fmtN(to)} pass holders</button></div>`)}
    <div class="stack">${card('Pass holders by district now', dmap(ds,{sel:area}))}
      ${card('Sent alerts', table([{h:'Sent',v:x=>x.at},{h:'Area',v:x=>x.area},{h:'Type',v:x=>x.type},{h:'Recipients',r:1,v:x=>fmtN(x.to)},{h:'Delivered',r:1,v:x=>`${fmtN(x.ok)} <small class="muted">${pct(x.ok/x.to*100,0)}</small>`}], ALERTS, {click:(x,i)=>`openAlert(${i})`}), {flush:true})}</div></div>`;
},
sentiment(){ const all=[0,0,0,0,0]; RATINGS.forEach(o=>o.c.forEach((v,i)=>all[i]+=v)); const N=all.reduce((x,y)=>x+y,0);
  const pos=['Friendly people','Island beauty','Fast entry with the pass','Food','Wildlife'], neg=['Ferry queues','Road conditions','Taxi prices','Beach litter','Weak signal in parks'], pv=lr(Math.round(N*.42),[31,28,21,12,8]), nv=lr(Math.round(N*.09),[31,24,18,15,12]);
  return phead('Post-trip survey sent in the app 24 hours after exit. Complaints go to the agency responsible.')+`<div class="grid g-kpi">
    ${kpi({label:'Average rating',value:ratingAvg(all).toFixed(2)+' of 5',foot:'since go-live',icon:'star'})}${kpi({label:'Rated 4 or 5 stars',value:pct((all[3]+all[4])/N*100),icon:'smile',tone:'t-green'})}${kpi({label:'Responses',value:fmtN(N),icon:'msg'})}${kpi({label:'Rated 1 or 2 stars',value:fmtN(all[0]+all[1]),foot:'followed up by Operations',icon:'flag',tone:'t-red'})}</div>
  <div class="grid g-3 mt">${card('Average rating by month', lineChart({labels:RATINGS.map(r=>MONTHS[r.k%100]), every:1, yfmt:v=>v.toFixed(1), area:false, series:[{name:'Rating',color:'#22B5F0',data:RATINGS.map(r=>ratingAvg(r.c))}], h:200}))}
    ${card('What visitors praise', hbars(pos.map((l,i)=>({label:l,value:pv[i],color:'#17B26A'}))), {sub:'Mentions since go-live'})}${card('What to fix', hbars(neg.map((l,i)=>({label:l,value:nv[i],color:'#FF8A1F'}))), {sub:'Mentions since go-live'})}</div>
  ${card('Recent reviews', REVIEWS.map(r=>`<div class="rev"><div class="row between"><span class="row">${av(r[0])}<span><b>${r[0]}</b> ${cc(r[1])}<div class="small muted">${r[3]}</div></span></span><span class="b">${r[2]} of 5</span></div><p>${r[4]}</p></div>`).join(''), {flush:true, style:'margin-top:14px'})}`; },
reports: () => reportsPage(),
};
function setMp(k){ S.f.mp=k; rerender(); } function setSp(k){ S.f.sp=k; rerender(); }
function openMarketsReport(pk){ const p=params('tourism','tou_markets'); p.period=pk; p.group='mkt'; go('tourism','reports/b:tou_markets'); }
function campaignModal(){ modal('New campaign','A message and an optional coupon to visitors in the app. Campaigns need approval by the Deputy Secretary (Tourism).', `<label class="field">Title<input id="cpT" placeholder="e.g. Kaamatan harvest festival weekend"></label>
  <div class="f2"><label class="field">Audience<select id="cpA"><option>Pass holders in Sabah now (${fmtN(IN_SABAH)})</option><option>Arriving in the next 14 days</option></select></label><label class="field">Markets<select id="cpM"><option>All markets</option><option>CN, TW, HK</option><option>KR, JP</option><option>BN, SG</option></select></label></div>
  <label class="field">Message<textarea id="cpX" rows="3" placeholder="Bella AI translates it into 12 languages"></textarea></label>`,
  `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-p" onclick="saveCampaign()">${ic('send')}Submit for approval</button>`); }
function saveCampaign(){ const t=$('#cpT').value.trim(), x=$('#cpX').value.trim(); if(!t){ fieldErr('cpT','Give the campaign a title'); return; } if(!x){ fieldErr('cpX','Write the message'); return; }
  CAMPAIGNS.unshift([t,$('#cpM').value,0,0,0,0,'Waiting for approval']); closeAll(); rerender(); toast(`“${esc(t)}” sent to ${ROLES.tourism.checker[0]} for approval`,'send'); }
function sendAlert(i){ const m=$('#alM').value.trim(); if(!m){ fieldErr('alM','Write the message first'); return; } const to=dstock(LAST)[i], okc=Math.round(to*.966);
  const w={}; for(let k=0;k<NM;k++){ let s=0; for(let c=0;c<NC;c++) s+=F.n[ix(LAST-1,c,k)]; w[LANGS[MKT[k][0]]]=(w[LANGS[MKT[k][0]]]||0)+s; }
  ALERTS.unshift({at:`${fmtD(LAST)} ${HHMM}`, area:DISTRICTS[i][0], type:$('#alT').value, text:m, langs:[...new Set([...Object.entries(w).sort((x,y)=>y[1]-x[1]).slice(0,3).map(x=>x[0]),'English','Malay'])], to, ok:okc, by:me()});
  AUDIT.unshift([HHMM,me(),'KePKAS','Sent official alert',`${$('#alT').value} · ${DISTRICTS[i][0]} · ${fmtN(okc)} delivered`]); rerender(); toast(`Sent to ${fmtN(to)} pass holders in ${DISTRICTS[i][0]}. ${fmtN(okc)} delivered.`,'send'); }
function openAlert(i){ const x=ALERTS[i]; drawer(x.type, `${x.area} · ${x.at}`, `<div class="kv"><div><small>Recipients</small><b>${fmtN(x.to)}</b></div><div><small>Delivered</small><b>${fmtN(x.ok)}</b></div><div><small>Not delivered</small><b>${fmtN(x.to-x.ok)}</b></div><div><small>Sent by</small><b>${x.by}</b></div></div>
  <div><h5>Message</h5><div class="alert info"><div><b>English</b><small>${esc(x.text)}</small></div></div></div><div><h5>Languages</h5><div class="chips">${x.langs.map(l=>`<span class="chip">${l}</span>`).join('')}</div></div><p class="note">Not delivered: phones switched off or notifications turned off. They see the alert the next time they open the app.</p>`); }
