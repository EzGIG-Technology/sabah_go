/* =====================================================================
   MINISTRY OF FINANCE SABAH · live TEC revenue, settlement into the
   State account, reconciliation, refunds and exemptions, audit reports
   ===================================================================== */
let FREFUNDS = [
 {ref:'TEC-58201477', name:'Kim Min-jun', m:MI.KR, why:'Duplicate charge', amt:5000, by:'Daniel Tan', at:'08:58', kind:'Refund'},
 {ref:'TEC-58199302', name:'Maria Santos', m:MI.PH, why:'Trip cancelled before arrival', amt:10000, by:'Aisyah Rahman', at:'08:31', kind:'Refund'},
 {ref:'TEC-58188215', name:'Lin Yu-ting', m:MI.TW, why:'Duplicate charge', amt:5000, by:'Daniel Tan', at:'08:12', kind:'Refund'},
 {ref:'EXM-00412', name:'Delegation of 6, Ministry of Trade (Brunei)', m:MI.BN, why:'Official delegation, protocol letter attached', amt:30000, by:'Aisyah Rahman', at:'07:58', kind:'Manual exemption'},
 {ref:'EXM-00409', name:'Medical evacuation, 1 visitor', m:MI.ID, why:'Hospital transfer from Tarakan', amt:5000, by:'Daniel Tan', at:'07:40', kind:'Manual exemption'},
];
const LIVE = {add:0, n:0, rows:[]};
function seedLive(){ if(LIVE.rows.length) return; const rs=[]; let s=4242;
  const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; };
  const L=TRAV[0]; rs.push({t:`Yesterday ${L.paidAt}`, ch:'App', m:L.m, trav:'3 (2 paid, 1 exempt)', amt:10000, pp:L.pp, lin:true});
  for(let i=0;i<9;i++){ const mm=Math.max(14*60, NOWMIN-3-i*7); const m=[MI.CN,MI.CN,MI.KR,MI.SG,MI.BN,MI.TW,MI.AU,MI.CN,MI.GB][i]; const paid=1+(r()<.4?1:0), ex=r()<.2?1:0; const ch=r()<.08?'Web':'App';
    rs.push({t:tstr(mm), ch, m, trav:`${paid+ex}${ex?` (${paid} paid, ${ex} exempt)`:''}`, amt:paid*TEC_SEN, pp:'••••'+String(1000+Math.floor(r()*8999))}); }
  rs.splice(6,0,{t:'14:05', ch:'KKIA kiosk', m:MI.OT, trav:'1', amt:5000, pp:TRAV[1].pp});
  LIVE.rows=rs; }
const liveCollected = () => DAY[LAST].gr + LIVE.add;
const liveSettled = () => Math.floor(DAY[LAST].gr*SWEEP/TEC_SEN)*TEC_SEN;
PAGES.finance = {
overview(){ seedLive();
  const [a,b]=RR(), D=dsum(a,b), pr=hasPrev([a,b]), Pd=pr?dsum(...prevRange([a,b])):null, curK=dyear(LAST)*100+dmon(LAST), [ma]=monthRange(curK), mtd=dsum(ma,LAST).gr+LIVE.add, bud=BUDGET[curK]||0, y=RECON[RECON.length-1];
  const col=liveCollected(), set=liveSettled();
  return `<div class="grid g-kpi">
    ${kpi({label:'Collected today',value:`<span id="lvCol">${sen(col)}</span>`,foot:`<span id="lvN">${fmtN(DAY[LAST].col+LIVE.n)}</span> visitors paid, to ${HHMM}`,icon:'ticket',hero:true,sp:L30.map(d=>DAY[d].gr)})}
    ${kpi({label:'Settled into the State account',value:sen(set),foot:'acquirer sweeps every hour',icon:'bank',tone:'t-green'})}
    ${kpi({label:'Pending settlement',value:`<span id="lvPen">${sen(col-set)}</span>`,foot:'paid since the last sweep',icon:'clock'})}
    ${kpi({label:'Collected this month',value:senK(mtd),foot:bud?`${pct(mtd/bud*100,0)} of the ${senK(bud)} monthly target`:'',icon:'flag'})}
    ${kpi({label:'Yesterday',value:y.variance===0?'100% reconciled':'Exception',foot:y.variance===0?'0 exceptions':y.note,icon:'shield',tone:y.variance===0?'t-green':'t-red'})}
  </div>
  <div class="grid g-21 mt">
    ${card(`<span class="row"><span class="dotlive"></span>Payments as they arrive</span>`, `<div id="lvFeed">${liveTable()}</div>`, {flush:true, sub:'Every TEC payment appears the moment it is paid. Passport numbers are masked.', action:`<button class="link" onclick="go('finance','collections')">Drill down ${ic('chev')}</button>`})}
    ${card('Collected today by entry point', hbars(CP.map((C,c)=>({label:C.short,value:DAY[LAST].colCp[c]*TEC_SEN})).sort((x,y)=>y.value-x.value),{fmt:v=>senK(v)}), {sub:'Counted on the payment day; most visitors pay before they fly'})}
  </div>
  <div class="grid g-2 mt">
    ${card('Collected each month against target', barChart({labels:MONTHKEYS.map(k=>MONTHS[k%100]), every:1, yfmt:v=>'RM '+kN(v), series:[{name:'Collected',color:'#1460E0',data:MONTHKEYS.map(k=>dsum(...monthRange(k)).gr/100)}], line:{name:'Target',color:'#FF8A1F',data:MONTHKEYS.map(k=>(BUDGET[k]||0)/100)}, onbar:i=>`S.f.cm=${MONTHKEYS[i]};S.f.cd=null;go('finance','collections')`}), {sub:'Click a month to drill down', action:`<button class="link" onclick="go('finance','reports/b:fin_budget')">Forecast ${ic('chev')}</button>`})}
    ${card(rangeL(), stmt([['Collected',D.gr],[`Refunds (${fmtN(D.refCnt)})`,-D.ref],['Acquirer fees',-D.fee],['Credited to the State account',D.net,1],['Partner share payable (20%)',D.partner]])+(pr&&S.range!=='today'?`<p class="small muted" style="margin-top:8px">Collected ${delta(chg(D.gr,Pd.gr))} against the previous period</p>`:''), {sub:'Statement view'})}
  </div>`;
},
_overview(){ TIMERS.push(setInterval(()=>{ if(!$('#lvFeed')) return; const m=pick([MI.CN,MI.CN,MI.KR,MI.SG,MI.TW,MI.BN,MI.AU,MI.JP]); const paid=1+(rnd()<.35?1:0), ex=rnd()<.18?1:0; const amt=paid*TEC_SEN;
  LIVE.rows.splice(1,0,{t:HHMM, ch:rnd()<.08?'Web':'App', m, trav:`${paid+ex}${ex?` (${paid} paid, ${ex} exempt)`:''}`, amt, pp:'••••'+ri(1000,9999), fresh:true}); LIVE.rows=LIVE.rows.slice(0,12); LIVE.add+=amt; LIVE.n+=paid;
  $('#lvFeed').innerHTML=liveTable(); $('#lvCol').textContent=sen(liveCollected()); $('#lvPen').textContent=sen(liveCollected()-liveSettled()); $('#lvN').textContent=fmtN(DAY[LAST].col+LIVE.n); }, 6000)); },
collections(){
  const k=S.f.cm, d=S.f.cd;
  if(d!==null && d!==undefined) return dayDrill(d);
  if(k) { const [a,b]=monthRange(k); const days=Array.from({length:b-a+1},(_,i)=>a+i).reverse();
    return `<div class="row" style="margin-bottom:12px"><button class="btn btn-s btn-sm" onclick="S.f.cm=null;rerender()">${ic('back')}All months</button></div>`+card(mLabel(k), table([{h:'Day',v:x=>`<b>${fmtD(x,{weekday:'short',day:'numeric',month:'short'})}</b>`},{h:'Visitors paid',r:1,v:x=>fmtN(DAY[x].col)},{h:'In the app',r:1,v:x=>fmtN(DAY[x].chan.app)},{h:'Web',r:1,v:x=>fmtN(DAY[x].chan.web)},{h:'Kiosk',r:1,v:x=>fmtN(DAY[x].chan.kiosk)},{h:'Collected',r:1,v:x=>sen(DAY[x].gr)},{h:'Credited',r:1,v:x=>x===LAST?'Day open':sen(DAY[x].net)},{h:'Reconciled',v:x=>{ const r=RECON.find(z=>z.d===x); return r?badge(r.variance===0?'Yes':'Late batch',r.variance===0?'ok':'warn'):badge('Today','info'); }}],
      days, {click:x=>`S.f.cd=${x};rerender()`, foot:['Total',fmtN(sumk(days,x=>DAY[x].col)),fmtN(sumk(days,x=>DAY[x].chan.app)),fmtN(sumk(days,x=>DAY[x].chan.web)),fmtN(sumk(days,x=>DAY[x].chan.kiosk)),sen(sumk(days,x=>DAY[x].gr)),'','']}), {flush:true, sub:'Click a day to see its payments'}); }
  return phead('Drill from a month to a day to a single payment. Every ringgit can be traced from payment to the State account.')+card('Months', table([{h:'Month',v:x=>`<b>${mLabel(x)}</b>`},{h:'Visitors paid',r:1,v:x=>fmtN(dsum(...monthRange(x)).col)},{h:'Collected',r:1,v:x=>sen(dsum(...monthRange(x)).gr)},{h:'Target',r:1,v:x=>BUDGET[x]?sen(BUDGET[x]):'n/a'},{h:'Against target',r:1,v:x=>BUDGET[x]?pct(dsum(...monthRange(x)).gr/BUDGET[x]*100):'n/a'},{h:'Credited',r:1,v:x=>sen(dsum(monthRange(x)[0],Math.min(monthRange(x)[1],LAST-1)).net)}],
    MONTHKEYS.slice().reverse(), {click:x=>`S.f.cm=${x};S.f.cd=null;rerender()`}), {flush:true});
},
recon(){ const g=RECON.slice(-30).reverse(), ex=RECON.filter(r=>r.variance!==0);
  return phead('Every day the system matches three sources: TEC transactions, the acquirer\'s report and the credit in the State account. Any mismatch goes to an exceptions list.', `<button class="btn btn-s" onclick="go('finance','reports/b:fin_recon')">${ic('file')}Reconciliation report</button>`)+`<div class="grid g-kpi">
    ${kpi({label:'Days fully reconciled, 30 days',value:`${g.filter(x=>x.variance===0).length} of ${g.length}`,icon:'check',tone:'t-green'})}${kpi({label:'Open exceptions',value:'0',foot:`${ex.length/2} late batch in 30 days, cleared next day`,icon:'alert'})}
    ${kpi({label:'Today, not yet closed',value:sen(DAY[LAST].gr),foot:'reconciled tomorrow 09:30',icon:'clock'})}</div>
  ${card('Daily three-way match', table([{h:'Collection day',v:x=>`<b>${fmtD(x.d)}</b>`},{h:'Ledger',r:1,v:x=>sen(x.ledger)},{h:'Acquirer report',r:1,v:x=>sen(x.acq)},{h:'Due after refunds and fees',r:1,v:x=>sen(x.due)},{h:'Bank credit',r:1,v:x=>sen(x.credited)},{h:'Difference',r:1,v:x=>x.variance===0?sen(0):`<b style="color:var(--warn)">${sen(x.variance)}</b>`},{h:'Status',v:x=>badge(x.st,x.variance===0?'ok':'warn')}], g, {click:x=>`openRecon(${x.d})`}), {flush:true, style:'margin-top:14px'})}`; },
channels(){ const pk=S.f.cp||'mtd', [a,b]=PERIODS[pk].r(), D=dsum(a,b);
  return phead('What each payment method collected and what the acquirer charged, on each method\'s daily value.', chips([['last7','7 days'],['last30','30 days'],['mtd','Month to date'],['lastMonth','Last month'],['live','Since go-live']], pk, 'setCp'))+`<div class="grid g-2e">
    ${card('Collected by method', donut(RAIL.map((r,j)=>({label:r[0],value:D.rv[j],color:RAILC[j]})),{center:senK(D.gr),sub:PERIODS[pk].l.toLowerCase()}))}
    ${card('Fees by method', barChart({labels:RAIL.map(r=>r[0].split(' ')[0]), every:1, h:220, yfmt:v=>'RM '+kN(v), series:[{name:'Fees',color:'#1460E0',data:D.fees.map(v=>v/100)}]}), {sub:'Blended rate '+pct(D.fee/Math.max(1,D.gr)*100,3)})}</div>
  ${card('Methods', table([{h:'Method',v:(r,j)=>`<span class="row"><i style="width:10px;height:10px;border-radius:3px;background:${RAILC[j]}"></i><b>${r[0]}</b></span>`},{h:'Collected',r:1,v:(r,j)=>sen(D.rv[j])},{h:'Share',r:1,v:(r,j)=>pct(D.rv[j]/Math.max(1,D.gr)*100)},{h:'Fee rate',r:1,v:r=>pct(r[1]*100,2)},{h:'Fees',r:1,v:(r,j)=>sen(D.fees[j])}], RAIL, {foot:['Total',sen(D.gr),'100.0%',pct(D.fee/Math.max(1,D.gr)*100,3),sen(D.fee)]}), {flush:true, style:'margin-top:14px'})}`; },
refunds(){ const L14=Array.from({length:14},(_,i)=>LAST-14+i), D=dsum(L14[0],L14[13]);
  return phead('Refunds and manual exemptions need Ministry of Finance approval (maker and checker): Operations raises them, you approve or reject.')
  + card('Waiting for your approval', FREFUNDS.length?table([{h:'Reference',v:r=>`<span class="code">${r.ref}</span>`},{h:'Type',v:r=>badge(r.kind,r.kind==='Refund'?'info':'navy')},{h:'Visitor',v:r=>`${cc(r.m)} ${esc(r.name)}`},{h:'Reason',v:r=>esc(r.why)},{h:'Raised by',v:r=>`${r.by}, ${r.at}`},{h:'Amount',r:1,v:r=>sen(r.amt)},
    {h:'',r:1,v:(r,i)=>`<span class="row" style="justify-content:flex-end;gap:6px"><button class="btn btn-sm btn-r" onclick="rejectRefund(${i})">Reject</button><button class="btn btn-sm btn-g" onclick="approveRefund(${i})">${ic('check')}Approve</button></span>`}], FREFUNDS, {foot:['Total','','','','',sen(FREFUNDS.reduce((s,r)=>s+r.amt,0)),'']}):`<div class="empty">Nothing waiting</div>`, {flush:true, sub:'Refunds return to the original payment method within 3 business days'})
  + card('Refunds, last 14 complete days', barChart({labels:L14.map(fmtDs), yfmt:v=>'RM '+kN(v), series:[{name:'Refunds',color:'#22B5F0',data:L14.map(d=>DAY[d].ref/100)}]}), {style:'margin-top:14px', sub:`${plural(D.refCnt,'refund')}, ${sen(D.ref)}`, action:`<button class="link" onclick="go('finance','reports/b:fin_refunds')">Register ${ic('chev')}</button>`});
},
reports: () => reportsPage(),
};
function liveTable(){ return table([{h:'Time',v:r=>r.t},{h:'Channel',v:r=>r.ch},{h:'Nationality',v:r=>cc(r.m)},{h:'Travellers',v:r=>r.trav},{h:'Passport',v:r=>r.pp},{h:'Amount',r:1,v:r=>`<b>${sen(r.amt)}</b>`}], LIVE.rows, {hl:r=>r.lin||r.fresh}); }
function setCp(k){ S.f.cp=k; rerender(); }
function dayDrill(d){ const x=DAY[d], N=Math.min(40,x.col); let s=d*7919+13; const r=()=>{ s=(s*16807)%2147483647; return s/2147483647; };
  const rows=[]; if(d===LAST-1) rows.push({t:TRAV[0].paidAt, ch:'App', m:MI.CN, meth:'Alipay+', trav:'3 (2 paid, 1 exempt)', amt:10000, pp:TRAV[0].pp, lin:true});
  for(let i=0;rows.length<N;i++){ const m=wpick(MKT.map((_,j)=>j),j=>x.colM[j]||0); const meth=RAIL[Math.min(4,[0,1,2,3,4].reduce((best,j)=>RAILMIX[MKT[m][0]][j]>RAILMIX[MKT[m][0]][best]?j:best,0))][0]; const paid=1+(r()<.4?1:0);
    rows.push({t:tstr(23*60-Math.floor(i*(17*60)/N)), ch:r()<.07?'Web':r()<.02?'Kiosk':'App', m, meth, trav:String(paid), amt:paid*TEC_SEN, pp:'••••'+String(1000+Math.floor(r()*8999))}); }
  return `<div class="row" style="margin-bottom:12px"><button class="btn btn-s btn-sm" onclick="S.f.cd=null;rerender()">${ic('back')}${mLabel(dyear(d)*100+dmon(d))}</button></div>
  <div class="grid g-kpi">${kpi({label:'Visitors paid',value:fmtN(x.col),icon:'users'})}${kpi({label:'Collected',value:sen(x.gr),icon:'ticket'})}${kpi({label:'Refunds and fees',value:sen(x.ref+x.fee),icon:'receipt'})}${kpi({label:'Credited to the State',value:d===LAST?'Day open':sen(x.net),icon:'bank'})}</div>
  ${card(fmtD(d,{weekday:'long',day:'numeric',month:'long',year:'numeric'}), table([{h:'Time',v:q=>q.t},{h:'Channel',v:q=>q.ch},{h:'Method',v:q=>q.meth},{h:'Nationality',v:q=>cc(q.m)},{h:'Travellers',v:q=>q.trav},{h:'Passport',v:q=>q.pp},{h:'Amount',r:1,v:q=>sen(q.amt)}], rows, {hl:q=>q.lin}), {flush:true, style:'margin-top:14px', sub:`Showing the latest ${rows.length} of ${fmtN(x.col)} payments. The totals above are for the whole day. Auditors can sample any payment.`})}`; }
function openRecon(d){ const x=RECON.find(r=>r.d===d);
  drawer('Reconciliation for '+fmtD(d), x.ref_, `<div class="kv"><div><small>TEC ledger</small><b>${sen(x.ledger)}</b></div><div><small>Acquirer report</small><b>${sen(x.acq)}</b></div><div><small>Refunds</small><b>${sen(-x.ref)}</b></div><div><small>Acquirer fees</small><b>${sen(-x.fees)}</b></div><div><small>Due</small><b>${sen(x.due)}</b></div><div><small>Bank credit</small><b>${sen(x.credited)}</b></div><div><small>Difference</small><b style="color:${x.variance?'var(--warn)':'var(--ok)'}">${sen(x.variance)}</b></div></div>
    ${x.variance? alertBox('warn','alert',x.st,x.note)+`<div><h5>How it was cleared</h5><div class="tl"><div class="st done"><b>Exception detected</b><small>Daily match, ${fmtD(d+1)} 07:30</small></div><div class="st done"><b>Acquirer confirmed the late batch</b><small>Sabah GO Operations, ${fmtD(d+1)} 08:20</small></div><div class="st done"><b>Carried forward and cleared</b><small>${x.resolved||'Credited with the next day'}</small></div></div></div>`
      : x.note ? alertBox('ok','check',x.st,x.note) : alertBox('ok','check','Fully reconciled','Ledger, acquirer report and bank credit agree to the sen.')}`); }
function approveRefund(i){ const r=FREFUNDS[i]; modal(`Approve ${r.kind.toLowerCase()}`, `${r.ref} · ${esc(r.name)}`, alertBox('info','shield',`${sen(r.amt)} · ${esc(r.why)}`, `Raised by ${r.by} at ${r.at}. ${r.kind==='Refund'?'Money returns to the original payment method.':'The visitors are marked exempt and no TEC is collected.'}`),
  `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-g" onclick="doRefund(${i},1)">${ic('check')}Approve</button>`); }
function rejectRefund(i){ const r=FREFUNDS[i]; modal(`Reject ${r.kind.toLowerCase()}`, `${r.ref} · ${esc(r.name)}`, `<label class="field">Reason sent to Operations<textarea id="rfX" rows="2" placeholder="e.g. no proof of cancellation"></textarea></label>`,
  `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-r" onclick="const v=$('#rfX').value.trim();if(!v){fieldErr('rfX','Give a reason');return;}doRefund(${i},0,v)">Reject</button>`); }
function doRefund(i, okk, why){ const r=FREFUNDS[i]; FREFUNDS.splice(i,1); if(okk) REFUNDED.add(r.ref); AUDIT.unshift([HHMM,me(),'Finance',okk?`Approved ${r.kind.toLowerCase()}`:`Rejected ${r.kind.toLowerCase()}`,`${r.ref} · ${sen(r.amt)}${why?' · '+why:''}`]); closeAll(); renderShell(); toast(okk?`${r.kind} of ${sen(r.amt)} approved`:`${r.kind} rejected and returned to Operations`, okk?'check':'x'); }
