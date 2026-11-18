/* =====================================================================
   REPORT DEFINITIONS · each run(params) returns kpis, chart, table,
   totals, definitions and arithmetic checks computed from the engine.
   Flags: monthly (whole months only), fixed (no period choice),
   closedOnly (cannot be submitted while the period includes today).
   ===================================================================== */
const rng = p => { let a,b; if(String(p.period).startsWith('month:')){ [a,b]=monthRangeFull(+p.period.slice(6)); }
  else if(p.period==='custom'){ a=p.from; b=p.to; } else [a,b]=PERIODS[p.period].r(); a=Math.max(0,Math.min(a,LAST)); b=Math.max(a,Math.min(b,LAST)); return [a,b]; };
const flt = p => ({cps:p.cps, mkts:p.mkts, modes:p.modes});
const filtered = p => (p.cps&&p.cps.length)||(p.modes&&p.modes.length)||(p.mkts&&p.mkts.length);
const GH = {day:'Day',week:'Week',month:'Month',cp:'Entry point',mkt:'Market',mode:'Mode',cat:'Category',district:'District',method:'Payment method'};
const glabel = (by,k) => by==='day'?fmtD(k,{weekday:'short',day:'numeric',month:'short',year:'numeric'}) : by==='week'?'Week from '+fmtD(k*7) : by==='month'?mLabel(k) : by==='cp'?CP[k].name : by==='mkt'?MKT[k][1] : by==='mode'?MODE[k].l : String(k);
const grows = (map, by, sortBy) => { const r=[...map.values()]; return sortBy ? r.sort((a,b)=>b[sortBy]-a[sortBy]) : r.sort((a,b)=> by==='mode' ? MODES.indexOf(a.key)-MODES.indexOf(b.key) : a.key-b.key); };
const sumk = (rows,k) => rows.reduce((a,r)=>a+(typeof k==='function'?k(r):r[k]),0);
const ok = (label, cond, detail='') => [label, !!cond, detail];
const hash = s => { let h=0x811c9dc5; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return ('00000000'+(h>>>0).toString(16)).slice(-8).toUpperCase(); };
const filterNote = (p,d) => { if(!d.filters||!d.filters.length) return ''; const f=[]; if(p.cps&&p.cps.length) f.push('Entry points: '+p.cps.map(c=>CP[c].short).join(', ')); if(p.modes&&p.modes.length) f.push('Modes: '+p.modes.map(m=>MODE[m].l).join(', ')); if(p.mkts&&p.mkts.length) f.push('Markets: '+p.mkts.map(m=>MKT[m][1]).join(', ')); return f.length?f.join(' · '):'All entry points and markets'; };
const comp = (a,b) => b ? ((a>=b?'+':'')+pct(chg(a,b))) : 'n/a';
const DEF_ARRIVAL = 'Arrival: a verified entry of a Digital Tourist Pass holder at a checkpoint. Everyone is counted, including children under 12 who are exempt.';
const DEF_TEC = 'TEC: RM 50.00 for each international visitor aged 12 or over; children under 12 are exempt automatically from their date of birth.';
const DEF_COL = 'Collections are counted on the day the visitor paid, which is usually before they arrive. Arrivals are counted on the day of entry.';
const DEF_NET = 'Credited to the State account = collected, less refunds, less the acquirer fee (MDR) for each channel, charged on its daily value. The acquirer pays straight into the State collection account; Sabah GO never holds TEC money. The concession partner share (20% of the amount credited) is payable by the State.';
const lastClosedMonth = () => MONTHKEYS.filter(k=>monthRangeFull(k)[1]<LAST).slice(-1)[0];

const RDEF = {
/* ============================== OPERATIONS ============================== */
ops:[
 {id:'ops_daily', cat:'Operations', name:'Daily operations summary', freq:'Daily · 08:00', flow:'signoff', closedOnly:true, to:['tourism','finance','immigration'],
  desc:'Arrivals, exemptions, unpaid on arrival, departures and TEC collected by entry point, for circulation to every ministry.', defaults:{period:'yesterday', group:'cp'}, filters:['cp','mode'], groups:['cp','mode','day'],
  run(p){ const [a,b]=rng(p), f=flt(p), g=grows(cube(a,b,f,p.group),p.group), T=tot(a,b,f);
    return { kpis:[['Arrivals',fmtN(T.n)],['Exempt (under 12)',fmtN(T.ex)],['Unpaid on arrival',fmtN(T.ks)],['TEC collected',sen(T.gr)],['Pass holders in Sabah at end',fmtN(STOCK[b])]],
      chart: p.group==='day'?lineChart({labels:g.map(o=>fmtDs(o.key)),series:[{name:'Arrivals',color:'#1460E0',data:g.map(o=>o.n)},{name:'Departures',color:'#22B5F0',data:g.map(o=>o.dep),dash:true}]}):null,
      cols:[{h:GH[p.group]},{h:'Arrivals',r:1},{h:'Exempt',r:1},{h:'Paying',r:1},{h:'Unpaid on arrival',r:1},{h:'Paid ahead',r:1},{h:'Departures',r:1},{h:'TEC collected',r:1}],
      rows:g.map(o=>[glabel(p.group,o.key),fmtN(o.n),fmtN(o.ex),fmtN(o.pay),fmtN(o.ks),pct(o.pay?(o.pay-o.ks)/o.pay*100:0,2),fmtN(o.dep),sen(o.gr)]),
      foot:['Total',fmtN(T.n),fmtN(T.ex),fmtN(T.pay),fmtN(T.ks),pct(T.pay?(T.pay-T.ks)/T.pay*100:0,2),fmtN(T.dep),sen(T.gr)],
      notes:[DEF_ARRIVAL, DEF_TEC, DEF_COL, 'Paid ahead: paying visitors who arrived with TEC already paid, as a share of all paying visitors.'],
      checks:[ok('Exempt + paying = arrivals', T.ex+T.pay===T.n, fmtN(T.n)), ok('Rows add up to arrivals and collections', sumk(g,'n')===T.n && sumk(g,'gr')===T.gr), ...(filtered(p)?[]:[ok('Collections match the Finance ledger', dsum(a,b).gr===T.gr, sen(T.gr)), ok('Stock moves by arrivals less departures', STOCK[b]-(a>0?STOCK[a-1]:0)===T.n-T.dep)])] }; } },
 {id:'ops_register', cat:'Payments', name:'TEC payment register', freq:'On demand', flow:'none',
  desc:'TEC paid by day, entry point, mode or market, counted on the payment date, with the collection channel.', defaults:{period:'last7', group:'day'}, filters:['cp','mode','mkt'], groups:['day','week','month','cp','mode','mkt'],
  run(p){ const [a,b]=rng(p), f=flt(p), g=grows(cube(a,b,f,p.group),p.group, p.group==='mkt'||p.group==='cp'?'col':null), T=tot(a,b,f), timeG=['day','week','month'].includes(p.group)&&!filtered(p);
    const ch = o => { let s={app:0,web:0,kiosk:0}; for(let d=a; d<=b; d++){ const k=p.group==='day'?d:p.group==='week'?Math.floor(d/7):dyear(d)*100+dmon(d); if(k!==o.key) continue; ['app','web','kiosk'].forEach(x=>s[x]+=DAY[d].chan[x]); } return s; };
    return { kpis:[['Visitors paid',fmtN(T.col)],['TEC collected',sen(T.gr)],['Days',b-a+1]],
      cols:[{h:GH[p.group]},{h:'Visitors paid',r:1},...(timeG?[{h:'In the app',r:1},{h:'On the web',r:1},{h:'At a kiosk or counter',r:1}]:[]),{h:'Collected',r:1},{h:'Share',r:1}],
      rows:g.map(o=>{ const c=timeG?ch(o):null; return [glabel(p.group,o.key),fmtN(o.col),...(timeG?[fmtN(c.app),fmtN(c.web),fmtN(c.kiosk)]:[]),sen(o.gr),pct(T.gr?o.gr/T.gr*100:0)]; }),
      foot:['Total',fmtN(T.col),...(timeG?[fmtN(dsum(a,b).chan.app),fmtN(dsum(a,b).chan.web),fmtN(dsum(a,b).chan.kiosk)]:[]),sen(T.gr),'100.0%'],
      notes:[DEF_TEC, DEF_COL, 'Channel split is only available for unfiltered views by day, week or month.'],
      checks:[ok('Collected = visitors paid × RM 50', T.gr===T.col*TEC_SEN), ok('Rows add up to the total', sumk(g,'gr')===T.gr, sen(T.gr)), ...(timeG?[ok('Channels add up to visitors paid', ['app','web','kiosk'].reduce((s,x)=>s+dsum(a,b).chan[x],0)===T.col)]:[])] }; } },
 {id:'ops_funnel', cat:'Travellers', name:'Visitor journey funnel', freq:'Weekly · Monday', flow:'none',
  desc:'For visitors who arrived in the period: registered, entered, exempt, paid ahead or on arrival, exited and still in Sabah.', defaults:{period:'last30', group:'mkt'}, filters:['cp','mode','mkt'], groups:['mkt','cp','mode'],
  run(p){ const [a,b]=rng(p); const cs=CP.map((_,i)=>i).filter(c=>(!p.cps||!p.cps.length||p.cps.includes(c))&&(!p.modes||!p.modes.length||p.modes.includes(CP[c].mode))), ms=p.mkts&&p.mkts.length?p.mkts:MKT.map((_,i)=>i);
    const G=new Map(); for(let d=a; d<=b; d++) for(const c of cs) for(const m of ms){ const k=ix(d,c,m), n=F.n[k]; if(!n) continue; const key=p.group==='cp'?c:p.group==='mode'?CP[c].mode:m;
      let o=G.get(key); if(!o){ o={key,n:0,pay:0,ex:0,ks:0,reg:0,exd:0}; G.set(key,o); } o.n+=n; o.pay+=F.pay[k]; o.ex+=F.ex[k]; o.ks+=F.ks[k]; o.reg+=n+Math.round(n*.031); lr(n,STAYW[m]).forEach((cnt,s)=>{ if(d+s<LAST) o.exd+=cnt; }); }
    const g=grows(G,p.group,'n'), T=g.reduce((t,o)=>{ ['n','pay','ex','ks','reg','exd'].forEach(k=>t[k]+=o[k]); return t; },{n:0,pay:0,ex:0,ks:0,reg:0,exd:0});
    return { kpis:[['Registered',fmtN(T.reg)],['Entered',fmtN(T.n)],['Paid ahead',fmtN(T.pay-T.ks)],['Unpaid on arrival',fmtN(T.ks)],['Exited by today',fmtN(T.exd)]],
      chart: hbars([['Registered',T.reg],['Entered',T.n],['Paying',T.pay],['Paid ahead',T.pay-T.ks],['Exited',T.exd]].map(([l,v])=>({label:l,value:v}))),
      cols:[{h:GH[p.group]},{h:'Registered',r:1},{h:'Entered',r:1},{h:'Did not travel',r:1},{h:'Exempt',r:1},{h:'Paying',r:1},{h:'Unpaid on arrival',r:1},{h:'Exited',r:1},{h:'Still in Sabah',r:1}],
      rows:g.map(o=>[glabel(p.group,o.key),fmtN(o.reg),fmtN(o.n),fmtN(o.reg-o.n),fmtN(o.ex),fmtN(o.pay),fmtN(o.ks),fmtN(o.exd),fmtN(o.n-o.exd)]),
      foot:['Total',fmtN(T.reg),fmtN(T.n),fmtN(T.reg-T.n),fmtN(T.ex),fmtN(T.pay),fmtN(T.ks),fmtN(T.exd),fmtN(T.n-T.exd)],
      notes:['Cohort view: visitors are grouped by the day they arrived in the period and followed to today.','Did not travel: registered (MDAC and pass) for a date in the period with no verified entry.'],
      checks:[ok('Entered matches the arrivals register', T.n===tot(a,b,flt(p)).n, fmtN(T.n)), ok('Exempt + paying = entered', T.ex+T.pay===T.n)] }; } },
 {id:'ops_rails', cat:'Payments', name:'Payment channel performance', freq:'Monthly · 3rd', flow:'none', monthly:true,
  desc:'Value, share, acquirer fee and success rate for each payment method, and the app, web and kiosk split.', defaults:{}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), d=dsum(a,b), okr=[99.3,99.5,99.4,99.7,99.2,98.9];
    return { kpis:[['TEC collected',sen(d.gr)],['Acquirer fees',sen(d.fee)],['Blended fee rate',pct(d.fee/Math.max(1,d.gr)*100,3)],['Paid in the app',pct(d.chan.app/Math.max(1,d.col)*100)]],
      chart: donut(RAIL.map((r,j)=>({label:r[0],value:d.rv[j],color:RAILC[j]})),{center:senK(d.gr),sub:'collected'}),
      cols:[{h:'Payment method'},{h:'Value',r:1},{h:'Share',r:1},{h:'Fee rate',r:1},{h:'Fees',r:1},{h:'Success rate',r:1}],
      rows:RAIL.map((r,j)=>[r[0],sen(d.rv[j]),pct(d.rv[j]/Math.max(1,d.gr)*100),pct(r[1]*100,2),sen(d.fees[j]),pct(okr[j])]),
      foot:['Total',sen(d.gr),'100.0%','',sen(d.fee),''],
      notes:['Fees are charged by the licensed acquirer on each method\'s daily value and rounded to the sen per day.','Success rate: approved payments as a share of attempts, reported by the acquirer.'],
      checks:[ok('Methods add up to the amount collected', d.rv.reduce((x,y)=>x+y,0)===d.gr, sen(d.gr)), ok('Fees add up', d.fees.reduce((x,y)=>x+y,0)===d.fee, sen(d.fee))] }; } },
 {id:'ops_merchants', cat:'Ecosystem', name:'Merchant onboarding & network', freq:'Monthly · 1st', flow:'none', fixed:'Since go-live, by month',
  desc:'Applications, approvals, rejections, suspensions and active merchants by month.', defaults:{period:'live'}, filters:[], groups:[],
  run(p){ const g=MNET; const T=g.reduce((t,o)=>{ ['apps','appr','rej','pend','susp','closed'].forEach(k=>t[k]=(t[k]||0)+o[k]); return t; },{});
    return { kpis:[['Applications',fmtN(T.apps)],['Approved',fmtN(T.appr)],['Approval rate',pct(T.appr/T.apps*100)],['Active merchants now',fmtN(g[g.length-1].active)]],
      chart: barChart({labels:g.map(o=>mLabel(o.k)),series:[{name:'Approved',color:'#1460E0',data:g.map(o=>o.appr)},{name:'Rejected',color:'#22B5F0',data:g.map(o=>o.rej)}],every:1}),
      cols:[{h:'Month'},{h:'Applications',r:1},{h:'Approved',r:1},{h:'Rejected',r:1},{h:'Waiting',r:1},{h:'Suspended',r:1},{h:'Closed',r:1},{h:'Active at month end',r:1}],
      rows:g.map(o=>[mLabel(o.k),fmtN(o.apps),fmtN(o.appr),fmtN(o.rej),fmtN(o.pend),fmtN(o.susp),fmtN(o.closed),fmtN(o.active)]),
      foot:['Total',fmtN(T.apps),fmtN(T.appr),fmtN(T.rej),fmtN(T.pend),fmtN(T.susp),fmtN(T.closed),fmtN(g[g.length-1].active)],
      notes:['Active at go-live: 2,640 (pilot). Active at month end = previous month + approved, less suspended and closed.','Micro traders without SSM registration are verified with MyKad and a bank account in their name.'],
      checks:[ok('Approved + rejected + waiting = applications', T.appr+T.rej+T.pend===T.apps), ok('Active count rolls forward', 2640+T.appr-T.susp-T.closed===g[g.length-1].active), ok('Waiting matches the onboarding queue', g[g.length-1].pend===APPS.length, fmtN(APPS.length))] }; } },
 {id:'ops_support', cat:'Service', name:'Bella AI & support service levels', freq:'Weekly · Monday', flow:'none',
  desc:'Conversations, AI resolution, handoffs to agents and satisfaction by day.', defaults:{period:'last7'}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), g=BELLA.slice(a,b+1).map((o,i)=>({...o,d:a+i})); const C=sumk(g,'conv'), R=sumk(g,'resolved'), H=sumk(g,'handoff'), N=sumk(g,'csatN'), S_=g.reduce((x,o)=>x+o.csat*o.csatN,0);
    return { kpis:[['Conversations',fmtN(C)],['Resolved by Bella AI',pct(R/C*100)],['Handed to agents',fmtN(H)],['Satisfaction',(S_/N).toFixed(2)+' of 5']],
      cols:[{h:'Day'},{h:'Conversations',r:1},{h:'Resolved by AI',r:1},{h:'To agents',r:1},{h:'AI resolution',r:1},{h:'Ratings',r:1},{h:'Average rating',r:1}],
      rows:g.map(o=>[fmtD(o.d),fmtN(o.conv),fmtN(o.resolved),fmtN(o.handoff),pct(o.resolved/o.conv*100),fmtN(o.csatN),o.csat.toFixed(2)]),
      foot:['Total',fmtN(C),fmtN(R),fmtN(H),pct(R/C*100),fmtN(N),(S_/N).toFixed(2)],
      notes:['Bella AI answers only from official content approved by KePKAS and the list of registered merchants.','Average rating is weighted by the number of ratings each day.'], checks:[ok('Resolved + to agents = conversations', R+H===C)] }; } },
 {id:'ops_refunds', cat:'Payments', name:'Refunds register', freq:'Daily · 08:00', flow:'none', to:['finance'],
  desc:'Refunds approved by the Ministry of Finance, by day.', defaults:{period:'last7'}, filters:[], groups:[], run: p => RUN_REFUNDS(p) },
 {id:'ops_sla', cat:'Service', name:'Monthly service level report', freq:'Monthly · 5th', flow:'signoff', monthly:true, to:['finance','tourism'],
  desc:'Contract KPIs reported to the State: uptime, incidents, payment success and support targets.', defaults:{}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), ks=monthsInRange(a,b), g=SLA.filter(x=>ks.includes(x.k));
    return { kpis:[['Uptime',g.length?pct(Math.min(...g.map(x=>x.avail)),2):'n/a'],['Payment success',g.length?pct(g[0].pay,2):'n/a'],['Major incidents',fmtN(sumk(g,'inc'))],['Targets','99.90% uptime, 99.0% payments']],
      cols:[{h:'Month'},{h:'Uptime',r:1},{h:'Major incidents',r:1},{h:'Payment success',r:1},{h:'Support within target',r:1},{h:'Bella AI resolution',r:1},{h:'Result'}],
      rows:g.map(o=>[mLabel(o.k),pct(o.avail,2),o.inc,pct(o.pay,2),pct(o.supp),pct(o.ai),o.avail>=99.9&&o.inc<=2&&o.pay>=99&&o.supp>=95?badge('Met','ok'):badge('Missed','bad')]),
      notes:['Uptime excludes maintenance announced 72 hours ahead.','Support within target: answered within 30 minutes (high), 4 hours (medium) or 8 hours (low).'], checks:[ok('Every month meets the uptime target', g.every(o=>o.avail>=99.9))] }; } },
],
/* ============================== KePKAS ============================== */
tourism:[
 {id:'tou_bulletin', cat:'Publications', name:'Monthly tourism bulletin', freq:'Monthly · 7th', flow:'publish', monthly:true, to:['finance','ops'],
  desc:'Official monthly figures: international arrivals against last year, top markets, entry mode, stay and spending. Published after approval.', defaults:{}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), T=tot(a,b), LYt=lySum(a,b), g=grows(cube(a,b,{}, 'mkt'),'mkt','n'), md=grows(cube(a,b,{}, 'mode'),'mode');
    return { kpis:[['International arrivals',fmtN(T.n)],['Against last year',comp(T.n,LYt)],['Average stay',T.dep?(T.dst/T.dep).toFixed(1)+' nights':'n/a'],['Visitor spending in the app',senK(T.sp)],['Spending per visitor',sen(Math.round(T.sp/Math.max(1,T.n)))]],
      chart: donut(md.map(o=>({label:MODE[o.key].l,value:o.n,color:MODEC[o.key]})),{center:kN(T.n),sub:'arrivals'}),
      cols:[{h:'Market'},{h:'Arrivals',r:1},{h:'Share',r:1},{h:'Last year',r:1},{h:'Change',r:1}],
      rows:g.map(o=>{ const l=lySum(a,b,[o.key]); return [MKT[o.key][1],fmtN(o.n),pct(o.n/T.n*100),fmtN(l),comp(o.n,l)]; }),
      foot:['Total',fmtN(T.n),'100.0%',fmtN(LYt),comp(T.n,LYt)],
      notes:[DEF_ARRIVAL,'Last year: 2025 international arrivals by market from the Sabah GO deck (1,498,709 in total), grown 6% for 2026 and spread by month and day of week. China, Singapore, UK and Ireland, Taiwan, Australia, Japan, South Korea and the Philippines are deck figures; other markets are estimates.'],
      checks:[ok('Markets add up to arrivals', sumk(g,'n')===T.n, fmtN(T.n)), ok('Modes add up to arrivals', sumk(md,'n')===T.n)] }; } },
 {id:'tou_markets', cat:'Arrivals', name:'Arrivals by source market', freq:'Weekly · Monday', flow:'none',
  desc:'Arrivals by market with share, exemptions and comparison with last year.', defaults:{period:'mtd', group:'mkt'}, filters:['cp','mode','mkt'], groups:['mkt','month','week','day'],
  run(p){ const [a,b]=rng(p), f=flt(p), byM=p.group==='mkt', g=grows(cube(a,b,f,p.group),p.group, byM?'n':null), T=tot(a,b,f), allCp=!(p.cps&&p.cps.length)&&!(p.modes&&p.modes.length);
    return { kpis:[['Arrivals',fmtN(T.n)],['Paying',fmtN(T.pay)],['Exempt (under 12)',fmtN(T.ex)],...(allCp?[['Against last year',comp(T.n,lySum(a,b,p.mkts))]]:[])],
      chart: byM ? hbars(g.slice(0,10).map(o=>({label:MKT[o.key][1],pre:cc(o.key),value:o.n}))) : barChart({labels:g.map(o=>glabel(p.group,o.key).replace(/^Week from /,'')),series:[{name:'Arrivals',color:'#1460E0',data:g.map(o=>o.n)}]}),
      cols:[{h:GH[p.group]},{h:'Arrivals',r:1},{h:'Share',r:1},{h:'Paying',r:1},{h:'Exempt',r:1},...(byM&&allCp?[{h:'Last year',r:1},{h:'Change',r:1}]:[])],
      rows:g.map(o=>[glabel(p.group,o.key),fmtN(o.n),pct(o.n/T.n*100),fmtN(o.pay),fmtN(o.ex),...(byM&&allCp?[fmtN(lySum(a,b,[o.key])),comp(o.n,lySum(a,b,[o.key]))]:[])]),
      foot:['Total',fmtN(T.n),'100.0%',fmtN(T.pay),fmtN(T.ex),...(byM&&allCp?[fmtN(lySum(a,b,p.mkts)),comp(T.n,lySum(a,b,p.mkts))]:[])],
      notes:[DEF_ARRIVAL, allCp?'Last year: 2026 estimate built from the Sabah GO deck\'s 2025 figures.':'Comparison with last year needs all entry points (the baseline has no entry-point split).'],
      checks:[ok('Rows add up to arrivals', sumk(g,'n')===T.n, fmtN(T.n)), ok('Paying + exempt = arrivals', T.pay+T.ex===T.n)] }; } },
 {id:'tou_entry', cat:'Arrivals', name:'Arrivals & departures by entry point', freq:'Weekly · Monday', flow:'none',
  desc:'Arrivals, departures and net change by entry point, mode, day or month.', defaults:{period:'last30', group:'cp'}, filters:['cp','mode','mkt'], groups:['cp','mode','day','week','month'],
  run(p){ const [a,b]=rng(p), f=flt(p), g=grows(cube(a,b,f,p.group),p.group, p.group==='cp'?'n':null), T=tot(a,b,f);
    return { kpis:[['Arrivals',fmtN(T.n)],['Departures',fmtN(T.dep)],['Net change',(T.n-T.dep>=0?'+':'')+fmtN(T.n-T.dep)]],
      chart: ['day','week','month'].includes(p.group)&&g.length ? lineChart({labels:g.map(o=>glabel(p.group,o.key).replace(/^Week from /,'')),series:[{name:'Arrivals',color:'#1460E0',data:g.map(o=>o.n)},{name:'Departures',color:'#22B5F0',data:g.map(o=>o.dep),dash:true}]}) : null,
      cols:[{h:GH[p.group]},{h:'Arrivals',r:1},{h:'Departures',r:1},{h:'Net change',r:1},{h:'Share of arrivals',r:1}],
      rows:g.map(o=>[glabel(p.group,o.key),fmtN(o.n),fmtN(o.dep),(o.n-o.dep>=0?'+':'')+fmtN(o.n-o.dep),pct(T.n?o.n/T.n*100:0)]),
      foot:['Total',fmtN(T.n),fmtN(T.dep),(T.n-T.dep>=0?'+':'')+fmtN(T.n-T.dep),'100.0%'],
      notes:[DEF_ARRIVAL,'Departures are recorded at the entry point the visitor used, until exit scanning is in place.'], checks:[ok('Rows add up to the totals', sumk(g,'n')===T.n && sumk(g,'dep')===T.dep)] }; } },
 {id:'tou_movement', cat:'Destinations', name:'Visitor movement by district', freq:'Weekly · Monday', flow:'none', to:['ops'],
  desc:'Average pass holders present in each district per day, from visitors who allow location, anonymised.', defaults:{period:'last7'}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), nd=b-a+1, acc=Array(DISTRICTS.length).fill(0); for(let d=a; d<=b; d++) dstock(d).forEach((v,i)=>acc[i]+=v); const tt=acc.reduce((x,y)=>x+y,0);
    const rows=DISTRICTS.map((x,i)=>({n:x[0],v:acc[i]})).sort((x,y)=>y.v-x.v);
    return { kpis:[['Visitor-days',fmtN(tt)],['Average in Sabah per day',fmtN(tt/nd)],['Busiest district',rows[0].n]],
      chart: hbars(rows.slice(0,10).map(r=>({label:r.n,value:r.v/nd})),{fmt:v=>fmtN(v)}),
      cols:[{h:'District'},{h:'Visitor-days',r:1},{h:'Average per day',r:1},{h:'Share',r:1}],
      rows:rows.map(r=>[r.n,fmtN(r.v),fmtN(r.v/nd),pct(r.v/tt*100)]), foot:['Total',fmtN(tt),fmtN(tt/nd),'100.0%'],
      notes:['Pass holders in Sabah each day are placed in districts using anonymised location from visitors who allow it, scaled to all pass holders. No individual is shown.'],
      checks:[ok('Districts add up to pass holders in Sabah', tt===STOCK.slice(a,b+1).reduce((x,y)=>x+y,0), fmtN(tt))] }; } },
 {id:'tou_dest', cat:'Destinations', name:'Destination visitation & capacity', freq:'Daily · 07:00', flow:'none', to:['ops'],
  desc:'Visitors on site per destination, peak day and days at 95% or more of the daily limit or permit quota.', defaults:{period:'last30'}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), nd=b-a+1; const rows=DEST.map((D,k)=>{ const v=[]; for(let d=a; d<=b; d++) v.push(dvis(k,d)); const sum=v.reduce((x,y)=>x+y,0), mx=Math.max(...v), at=D.cap?v.filter(x=>x>=D.cap*.95).length:0; return {D,sum,mx,peak:a+v.indexOf(mx),avg:sum/nd,at}; });
    return { kpis:[['Visitor-days on site',fmtN(sumk(rows,'sum'))],['Sites reaching 95% or more',fmtN(rows.filter(r=>r.at).length)],['Days in period',nd]],
      cols:[{h:'Destination'},{h:'District'},{h:'Visitor-days',r:1},{h:'Daily average',r:1},{h:'Peak day',r:1},{h:'Daily limit',r:1},{h:'Days at 95% or more',r:1}],
      rows:rows.map(r=>[r.D.n,r.D.d,fmtN(r.sum),fmtN(r.avg),`${fmtN(r.mx)} on ${fmtDs(r.peak)}`,r.D.cap?fmtN(r.D.cap)+(r.D.permit?' permits':''):'No limit',r.D.cap?fmtN(r.at):'n/a']),
      foot:['Total','',fmtN(sumk(rows,'sum')),fmtN(sumk(rows,'sum')/nd),'','',fmtN(sumk(rows,'at'))],
      notes:['Permit sites (Sipadan 176 a day, Kinabalu summit 185 a day, Sabah Parks quotas) show permits used. Other sites show visitors on site from anonymised location, scaled to all pass holders.'], checks:[ok('No site exceeds its daily limit', rows.every(r=>!r.D.cap||r.mx<=r.D.cap))] }; } },
 {id:'tou_spend', cat:'Economy', name:'Visitor spending', freq:'Monthly · 7th', flow:'none', to:['finance'],
  desc:'Spending through Sabah GO merchants by category, district or nationality.', defaults:{period:'last30', group:'cat'}, filters:['mkt'], groups:['cat','district','mkt'],
  run(p){ const [a,b]=rng(p), f=flt(p), T=tot(a,b,f); let rows;
    if(p.group==='district'){ const w=DISTRICTS.map(x=>x[3]*x[4]); rows=DISTRICTS.map((x,i)=>[x[0], lr(T.sp,w)[i]]); }
    else if(p.group==='mkt'){ rows=grows(cube(a,b,f,'mkt'),'mkt').map(o=>[MKT[o.key][1],o.sp,o.n]); }
    else { const C=[['Accommodation',38],['Tours and activities',24],['Food',17],['Transport',11],['Handicrafts',7],['Other',3]]; rows=C.map((c,i)=>[c[0], lr(T.sp,C.map(x=>x[1]))[i]]); }
    rows.sort((x,y)=>y[1]-x[1]);
    return { kpis:[['Spending through Sabah GO',sen(T.sp)],['Visitors',fmtN(T.n)],['Per visitor',sen(Math.round(T.sp/Math.max(1,T.n)))]],
      chart: donut(rows.slice(0,7).map((r,i)=>({label:r[0],value:r[1],color:PAL[i]})),{center:senK(T.sp),sub:'spending'}),
      cols:[{h:GH[p.group]},{h:'Spending',r:1},{h:'Share',r:1},...(p.group==='mkt'?[{h:'Per visitor',r:1}]:[])],
      rows:rows.map(r=>[r[0],sen(r[1]),pct(T.sp?r[1]/T.sp*100:0),...(p.group==='mkt'?[sen(Math.round(r[1]/Math.max(1,r[2])))]:[])]), foot:['Total',sen(T.sp),'100.0%',...(p.group==='mkt'?[sen(Math.round(T.sp/Math.max(1,T.n)))]:[])],
      notes:['Spending: payments to Sabah GO merchants by QR and bookings made in the app, attributed to the visitor\'s arrival day. It is a part of total visitor spending, not all of it.'], checks:[ok('Rows add up to spending', sumk(rows,r=>r[1])===T.sp, sen(T.sp))] }; } },
 {id:'tou_events', cat:'Destinations', name:'Events impact', freq:'After each event', flow:'none',
  desc:'Saves, check-ins and spending near each event held in the period, with upcoming events listed.', defaults:{period:'last30'}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), g=EVENTS.filter(e=>e.day>=a&&e.day<=b).sort((x,y)=>x.day-y.day), up=EVENTS.filter(e=>e.day>LAST);
    return { kpis:[['Events held',g.length],['Check-ins',fmtN(sumk(g,'chk'))],['Spending within 2 km',sen(sumk(g,'spend'))]],
      cols:[{h:'Event'},{h:'Where'},{h:'Date'},{h:'Saved',r:1},{h:'Check-ins',r:1},{h:'Spending nearby',r:1}],
      rows:g.map(e=>[e.n,e.where,fmtD(e.day),fmtN(e.saved),fmtN(e.chk),sen(e.spend)]), foot:['Total','','',fmtN(sumk(g,'saved')),fmtN(sumk(g,'chk')),sen(sumk(g,'spend'))],
      notes:['Spending nearby: app payments within 2 km of the venue during the event.', 'Upcoming: '+(up.map(e=>`${e.n} (${fmtD(e.day)}, ${fmtN(e.saved)} saved)`).join('; ')||'none')+'.'], checks:[] }; } },
 {id:'tou_alerts', cat:'Reach', name:'Official alerts log', freq:'Monthly · 7th', flow:'none', to:['ops'],
  desc:'Every alert sent through the app: area, languages, recipients and deliveries.', defaults:{period:'last30'}, filters:[], groups:[],
  run(p){ const g=ALERTS;
    return { kpis:[['Alerts sent',g.length],['Recipients',fmtN(sumk(g,'to'))],['Delivered',pct(sumk(g,'ok')/Math.max(1,sumk(g,'to'))*100)]],
      cols:[{h:'Sent'},{h:'Area'},{h:'Type'},{h:'Languages'},{h:'Recipients',r:1},{h:'Delivered',r:1},{h:'Sent by'}],
      rows:g.map(x=>[x.at,x.area,x.type,x.langs.join(', '),fmtN(x.to),fmtN(x.ok),x.by]), foot:['Total','','','',fmtN(sumk(g,'to')),fmtN(sumk(g,'ok')),''],
      notes:['Recipients: pass holders in the area at the time of sending, in the languages their apps use. Every send and delivery is logged.'], checks:[ok('Delivered never exceeds recipients', g.every(x=>x.ok<=x.to))] }; } },
 {id:'tou_sentiment', cat:'Quality', name:'Visitor satisfaction', freq:'Monthly · 7th', flow:'none', monthly:true,
  desc:'Post-trip survey responses and star ratings for a month.', defaults:{}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), ks=monthsInRange(a,b), g=RATINGS.filter(x=>ks.includes(x.k)); const all=[0,0,0,0,0]; g.forEach(o=>o.c.forEach((v,i)=>all[i]+=v)); const N=all.reduce((x,y)=>x+y,0);
    return { kpis:[['Responses',fmtN(N)],['Average rating',ratingAvg(all).toFixed(2)+' of 5'],['Rated 4 or 5 stars',pct(N?(all[3]+all[4])/N*100:0)]],
      cols:[{h:'Month'},{h:'1 star',r:1},{h:'2 stars',r:1},{h:'3 stars',r:1},{h:'4 stars',r:1},{h:'5 stars',r:1},{h:'Responses',r:1},{h:'Average',r:1}],
      rows:g.map(o=>[mLabel(o.k),...o.c.map(fmtN),fmtN(o.c.reduce((x,y)=>x+y,0)),ratingAvg(o.c).toFixed(2)]), foot:['Total',...all.map(fmtN),fmtN(N),ratingAvg(all).toFixed(2)],
      notes:['Survey sent in the app 24 hours after a recorded exit. Average: total stars divided by responses.'], checks:[] }; } },
],
/* ============================== FINANCE ============================== */
finance:[
 {id:'fin_daily', cat:'Collections', name:'Daily TEC collection report', freq:'Daily · 10:00', flow:'signoff', closedOnly:true,
  desc:'TEC collected on a business date by entry point, mode or channel, with refunds, fees, the amount credited and the partner share.', defaults:{period:'yesterday', group:'cp'}, filters:['cp','mode'], groups:['cp','mode','day'],
  run(p){ const [a,b]=rng(p), f=flt(p), g=grows(cube(a,b,f,p.group),p.group,p.group==='cp'?'col':null), T=tot(a,b,f), d=dsum(a,b), fl=filtered(p);
    return { kpis:[['Collected',sen(T.gr)],['Credited to State',fl?'Whole State only':sen(d.net)],['Refunds',fl?'Whole State only':sen(d.ref)],['Partner share payable',fl?'Whole State only':sen(d.partner)]],
      cols:[{h:GH[p.group]},{h:'Visitors paid',r:1},{h:'Collected',r:1},{h:'Share',r:1}],
      rows:g.map(o=>[glabel(p.group,o.key),fmtN(o.col),sen(o.gr),pct(T.gr?o.gr/T.gr*100:0)]), foot:['Total',fmtN(T.col),sen(T.gr),'100.0%'],
      extra: fl?'<p class="note">The statement below needs all entry points; refunds and fees are recorded for the State as a whole.</p>':stmt([['TEC collected',d.gr],[`Refunds (${fmtN(d.refCnt)})`,-d.ref],['Acquirer fees (MDR)',-d.fee],['Credited to the State collection account',d.net,1],['Concession partner share payable (20%)',d.partner]]),
      notes:[DEF_TEC, DEF_COL, DEF_NET], checks:[ok('Rows add up to the amount collected', sumk(g,'gr')===T.gr, sen(T.gr)), ...(fl?[]:[ok('Collected less refunds and fees = credited', d.gr-d.ref-d.fee===d.net, sen(d.net)), (()=>{ const R=RECON.filter(r=>r.d>=a&&r.d<=b), df=sumk(R,'variance'); return ok('Bank credits equal the amount due over the period', df===0||(R.length&&R[R.length-1].st.startsWith('Late')), df===0?'No difference':sen(df)+', late batch cleared next day'); })()])] }; } },
 {id:'fin_statement', cat:'Statements', name:'Monthly TEC revenue statement', freq:'Monthly · 5th', flow:'signoff', monthly:true, to:['ops'],
  desc:'Signed monthly statement for the State Treasury: collections by mode and channel, refunds, fees, the amount credited, bank receipts and the partner share.', defaults:{}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), d=dsum(a,b), R=RECON.filter(r=>r.d>=a&&r.d<=b), cred=sumk(R,'credited'), due=sumk(R,'due');
    return { kpis:[['Collected',sen(d.gr)],['Credited (due)',sen(d.net)],['Received in the State account',sen(cred)],['Partner share payable',sen(d.partner)]],
      cols:[{h:'Statement line'},{h:'Amount',r:1}],
      rows:[...MODES.map(m=>['Collected · '+MODE[m].l,sen(d.modeGr[m])]),...['app','web','kiosk'].map(k=>[`of which ${({app:'in the app',web:'on the web',kiosk:'at kiosks and counters'})[k]} (${fmtN(d.chan[k])} visitors)`,sen(d.chan[k]*TEC_SEN)]),
        [`Refunds (${fmtN(d.refCnt)})`,sen(-d.ref)],...RAIL.map((r,j)=>['Acquirer fees · '+r[0],sen(-d.fees[j])]),['<b>Credited to the State collection account</b>','<b>'+sen(d.net)+'</b>'],
        ['Received in the State account (bank statement)',sen(cred)],['<b>Difference</b>','<b>'+sen(cred-due)+'</b>'],['Concession partner share payable (20%)',sen(d.partner)]],
      notes:[DEF_TEC, DEF_COL, DEF_NET, 'Bank receipts come from the daily three-way reconciliation. A late batch on one day is cleared the next day, so the month nets to zero.'],
      checks:[ok('Collected by mode = total collected', MODES.reduce((s,m)=>s+d.modeGr[m],0)===d.gr, sen(d.gr)), ok('Channels add up to collected', (d.chan.app+d.chan.web+d.chan.kiosk)*TEC_SEN===d.gr), ok('Collected less refunds and fees = credited', d.gr-d.ref-d.fee===d.net), ok('Bank receipts equal the amount due for the month', cred===due, cred===due?'No difference':sen(cred-due))] }; } },
 {id:'fin_recon', cat:'Settlement', name:'Reconciliation report', freq:'Daily · 10:00', flow:'signoff', closedOnly:true,
  desc:'Three-way match for each day: TEC ledger, acquirer report and bank credit, with any exception and how it was cleared.', defaults:{period:'last30'}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), g=RECON.filter(x=>x.d>=a&&x.d<=b), D=sumk(g,'due'), C=sumk(g,'credited');
    return { kpis:[['Days',g.length],['Fully reconciled',fmtN(g.filter(x=>x.variance===0).length)],['Due',sen(D)],['Credited',sen(C)]],
      cols:[{h:'Collection day'},{h:'Ledger',r:1},{h:'Acquirer report',r:1},{h:'Refunds',r:1},{h:'Fees',r:1},{h:'Due',r:1},{h:'Bank credit',r:1},{h:'Difference',r:1},{h:'Status'}],
      rows:g.map(x=>[fmtD(x.d),sen(x.ledger),sen(x.acq),sen(-x.ref),sen(-x.fees),sen(x.due),sen(x.credited),sen(x.variance),x.variance===0?badge(x.st,'ok'):badge(x.st,'warn')]),
      foot:['Total',sen(sumk(g,'ledger')),sen(sumk(g,'acq')),sen(-sumk(g,'ref')),sen(-sumk(g,'fees')),sen(D),sen(C),sen(C-D),''],
      notes:['Ledger: TEC payments recorded by Sabah GO. Acquirer report: the acquirer\'s settlement file. Bank credit: the State collection account statement.', ...g.filter(x=>x.note).map(x=>`${fmtD(x.d)}: ${x.note}${x.resolved?' Cleared by '+x.resolved+'.':''}`)],
      checks:[ok('Due = ledger less refunds and fees', g.every(x=>x.due===x.ledger-x.ref-x.fees)), ok('Every difference is explained and cleared', g.every(x=>x.variance===0||x.note)), ok('Period nets to zero', g.length===0||C===D||g[g.length-1].st.startsWith('Late'), sen(C-D))] }; } },
 {id:'fin_mode', cat:'Collections', name:'Collections by entry point & mode', freq:'Monthly · 5th', flow:'none',
  desc:'TEC collected by entry point, mode, month or market.', defaults:{period:'mtd', group:'cp'}, filters:['cp','mode','mkt'], groups:['cp','mode','month','mkt'], run: p => RDEF.ops[1].run(p) },
 {id:'fin_channels', cat:'Settlement', name:'Payment channel fees', freq:'Monthly · 5th', flow:'none', monthly:true,
  desc:'Value collected and acquirer fees for each payment method.', defaults:{}, filters:[], groups:[], run: p => RDEF.ops[3].run(p) },
 {id:'fin_refunds', cat:'Controls', name:'Refunds register', freq:'Monthly · 5th', flow:'none',
  desc:'Refunds approved under maker and checker control, by day.', defaults:{period:'mtd'}, filters:[], groups:[], run: p => RUN_REFUNDS(p) },
 {id:'fin_budget', cat:'Planning', name:'Budget against actual & forecast', freq:'Monthly · 10th', flow:'signoff', fixed:'Calendar year of the operating date',
  desc:'Collections against the State budget by month, with a run-rate forecast to year end.', defaults:{period:'ytd'}, filters:[], groups:[],
  run(p){ const y=dyear(LAST), curK=y*100+dmon(LAST); const ks=[]; for(let m=0;m<12;m++) if(BUDGET[y*100+m]) ks.push(y*100+m);
    const rr = dsum(LAST-28,LAST-1).gr/28;
    const rows=ks.map(k=>{ const [fa,fb]=monthRangeFull(k); const act = k<=curK ? dsum(fa,Math.min(fb,LAST)).gr : 0; let fc;
      if(k<curK) fc=act; else if(k===curK){ fc = act - DAY[LAST].gr + Math.round(rr*(fb-LAST+1)*SEASON[k%100]/SEASON[dmon(LAST)]); } else fc=Math.round(rr*daysInMonthKey(k)*SEASON[k%100]/SEASON[dmon(LAST)]);
      return {k, bud:BUDGET[k], act, fc}; });
    const B=sumk(rows,'bud'), A=sumk(rows,'act'), FC=sumk(rows,'fc'), cl=rows.filter(r=>r.k<curK), BY=sumk(cl,'bud'), AY=sumk(cl,'act');
    return { kpis:[['Budget '+y,sen(B)],['Collected to date',sen(A)],['Closed months against budget',BY?pct(AY/BY*100):'n/a'],['Forecast '+y,sen(FC)],['Forecast against budget',comp(FC,B)]],
      chart: barChart({labels:rows.map(r=>MONTHS[r.k%100]),series:[{name:'Actual, then forecast',color:'#1460E0',data:rows.map(r=>r.fc/100)}],line:{name:'Budget',color:'#FF8A1F',data:rows.map(r=>r.bud/100)},yfmt:v=>'RM '+kN(v),every:1}),
      cols:[{h:'Month'},{h:'Budget',r:1},{h:'Collected',r:1},{h:'Difference',r:1},{h:'Forecast',r:1},{h:'Basis'}],
      rows:rows.map(r=>[mLabel(r.k),sen(r.bud),r.act?sen(r.act):'n/a',r.k<curK?sen(r.act-r.bud):'n/a',sen(r.fc),r.k<curK?'Actual':r.k===curK?'Collected to date + run-rate for the rest of the month':'Run-rate × seasonality']),
      foot:['Total',sen(B),sen(A),sen(AY-BY),sen(FC),''],
      notes:['Budget: State TEC revenue estimate for '+y+(y===2027?' (June to December, from go-live)':'')+', sample figures.','Run-rate: average daily collections over the last 28 complete days ('+sen(Math.round(rr))+' a day), adjusted by monthly seasonality.'],
      checks:[ok('Closed months match the ledger', cl.every(r=>r.act===dsum(...monthRangeFull(r.k)).gr))] }; } },
 {id:'fin_partner', cat:'Statements', name:'Concession partner share certificate', freq:'Monthly · 5th', flow:'signoff', monthly:true, to:['ops'],
  desc:'The 20% partner share for a month, any service-level deductions, and the amount certified for payment.', defaults:{}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), k=dyear(a)*100+dmon(a), d=dsum(a,b), sla=SLA.find(x=>x.k===k)||{avail:100,inc:0,pay:100}; const met=sla.avail>=99.9&&sla.inc<=2&&sla.pay>=99; const ded=met?0:Math.round(d.partner*.05);
    return { kpis:[['Credited to State',sen(d.net)],['Partner share (20%)',sen(d.partner)],['Service-level deduction',sen(-ded)],['Certified for payment',sen(d.partner-ded)]],
      cols:[{h:'Line'},{h:'Amount',r:1}],
      rows:[['TEC collected',sen(d.gr)],['Refunds',sen(-d.ref)],['Acquirer fees',sen(-d.fee)],['<b>Credited to the State collection account</b>','<b>'+sen(d.net)+'</b>'],['Partner share at 20%, computed daily',sen(d.partner)],[`Service levels: uptime ${pct(sla.avail,2)}, payment success ${pct(sla.pay,2)}, incidents ${sla.inc}`,met?'Met, no deduction':sen(-ded)],['<b>Certified for payment by the State</b>','<b>'+sen(d.partner-ded)+'</b>']],
      notes:[DEF_NET,'The share is computed each day and summed, so it can differ from 20% of the monthly total by a few sen.','A 5% deduction applies if any monthly service level is missed.'],
      checks:[ok('Daily shares add up', d.partner===DAY.slice(a,b+1).reduce((s,x)=>s+x.partner,0)), ok('Within 1 sen a day of 20%', Math.abs(d.partner-d.net*.2)<=(b-a+1))] }; } },
 {id:'fin_audit', cat:'Statements', name:'Audit extract (National Audit Department)', freq:'On request', flow:'none',
  desc:'Day-by-day ledger totals with counts, refunds, fees and a hash per day for sampling.', defaults:{period:'mtd'}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), g=[]; for(let d=a; d<=Math.min(b,LAST-1); d++) g.push(d); const x=d=>DAY[d];
    return { kpis:[['Days',g.length],['Payments',fmtN(sumk(g,d=>x(d).col))],['Collected',sen(sumk(g,d=>x(d).gr))]],
      cols:[{h:'Day'},{h:'Payments',r:1},{h:'Collected',r:1},{h:'Refunds',r:1},{h:'Fees',r:1},{h:'Credited',r:1},{h:'Day hash'}],
      rows:g.map(d=>[fmtD(d),fmtN(x(d).col),sen(x(d).gr),sen(-x(d).ref),sen(-x(d).fee),sen(x(d).net),hash(JSON.stringify([d,x(d).col,x(d).gr,x(d).ref,x(d).fee]))]),
      foot:['Total',fmtN(sumk(g,d=>x(d).col)),sen(sumk(g,d=>x(d).gr)),sen(-sumk(g,d=>x(d).ref)),sen(-sumk(g,d=>x(d).fee)),sen(sumk(g,d=>x(d).net)),''],
      notes:['Each financial transaction is written to an append-only audit ledger. Auditors get read-only access and can sample individual payments from any day.','Today is excluded until the day closes.'], checks:[ok('Every day: collected less refunds and fees = credited', g.every(d=>x(d).gr-x(d).ref-x(d).fee===x(d).net))] }; } },
],
/* ============================== IMMIGRATION ============================== */
immigration:[
 {id:'imm_daily', cat:'Daily', name:'Daily checkpoint return', freq:'Daily · 23:59', flow:'signoff', closedOnly:true, to:['ops'],
  desc:'For each entry point: arrivals, paid, exempt, unpaid on arrival and paid at the kiosk, compliance, departures and exceptions.', defaults:{period:'yesterday', group:'cp'}, filters:['cp','mode'], groups:['cp','day'],
  run(p){ const [a,b]=rng(p), f=flt(p), g=grows(cube(a,b,f,p.group),p.group,p.group==='cp'?'n':null), T=tot(a,b,f);
    const exc = o => { let s=0; for(let d=a; d<=b; d++) for(let c=0;c<NC;c++){ if(p.group==='cp'&&c!==o.key) continue; if(p.group==='day'&&d!==o.key) continue; if(f.cps&&f.cps.length&&!f.cps.includes(c)) continue; if(f.modes&&f.modes.length&&!f.modes.includes(CP[c].mode)) continue; s+=exDay(d,c).slice(1).reduce((x,y)=>x+y,0); } return s; };
    const E=g.map(exc), still = o => b===LAST && p.group==='cp' ? STILL_UNPAID[o.key] : 0;
    return { kpis:[['Arrivals',fmtN(T.n)],['Paid',fmtN(T.pay-T.ks)],['Exempt',fmtN(T.ex)],['Unpaid on arrival',fmtN(T.ks)],['Compliance',pct(T.pay?(T.pay-T.ks)/T.pay*100:0,2)]],
      cols:[{h:GH[p.group]},{h:'Arrivals',r:1},{h:'Paid ahead',r:1},{h:'Exempt',r:1},{h:'Unpaid on arrival',r:1},{h:'Paid at kiosk',r:1},{h:'Compliance',r:1},{h:'Departures',r:1},{h:'Other exceptions',r:1}],
      rows:g.map((o,i)=>[glabel(p.group,o.key),fmtN(o.n),fmtN(o.pay-o.ks),fmtN(o.ex),fmtN(o.ks),fmtN(o.ks-still(o)),pct(o.pay?(o.pay-o.ks)/o.pay*100:0,2),fmtN(o.dep),fmtN(E[i])]),
      foot:['Total',fmtN(T.n),fmtN(T.pay-T.ks),fmtN(T.ex),fmtN(T.ks),fmtN(T.ks-sumk(g,still)),pct(T.pay?(T.pay-T.ks)/T.pay*100:0,2),fmtN(T.dep),fmtN(sumk(E,x=>x))],
      notes:[DEF_ARRIVAL,'Compliance: paying visitors who reached the counter with TEC paid, as a share of all paying visitors. Unpaid visitors pay at a kiosk or assisted counter before clearance.','Kiosks operate at KKIA, Sandakan Airport and Tawau Airport; seaports and land entry use assisted counters until kiosks arrive in the next phase.','Other exceptions: name mismatch, MDAC not found, party count mismatch, pass already used.'],
      checks:[ok('Paid ahead + exempt + unpaid on arrival = arrivals', (T.pay-T.ks)+T.ex+T.ks===T.n, fmtN(T.n)), ok('Rows add up to arrivals', sumk(g,'n')===T.n)] }; } },
 {id:'imm_flights', cat:'Daily', name:'TEC status by flight', freq:'Daily · 23:59', flow:'none', fixed:'Today, all air entry points',
  desc:'Each international flight today: passengers, paid, exempt and unpaid, including flights still to arrive.', defaults:{period:'today'}, filters:[], groups:[],
  run(p){ const g=FLIGHTS; const A=g.filter(f=>f.arrived);
    return { kpis:[['Flights today',g.length],['Arrived',A.length],['Passengers arrived',fmtN(sumk(A,'pax'))],['Unpaid on arrival',fmtN(sumk(A,'ks'))]],
      cols:[{h:'Time'},{h:'From'},{h:'Entry point'},{h:'Passengers',r:1},{h:'Paid',r:1},{h:'Exempt',r:1},{h:'Unpaid',r:1},{h:'Status'}],
      rows:g.map(f=>[f.time,f.origin,CP[f.cp].short,fmtN(f.pax),fmtN(f.pay-f.ks),fmtN(f.ex),fmtN(f.ks),f.arrived?badge('Arrived','ok'):badge('Expected','info')]),
      foot:['Total','','',fmtN(sumk(g,'pax')),fmtN(sumk(g,f=>f.pay-f.ks)),fmtN(sumk(g,'ex')),fmtN(sumk(g,'ks')),''],
      notes:['Passenger lists come from MDAC and airline data. For flights still to arrive, unpaid is the number registered without TEC paid yet.','Flights from Kuala Lumpur are domestic but carry international visitors, who are checked by Sabah immigration on arrival.'],
      checks:[ok('Arrived flights = KKIA, Tawau and Sandakan arrivals today', sumk(A,'pax')===[0,1,2].reduce((s,c)=>s+tot(LAST,LAST,{cps:[c]}).n,0), fmtN(sumk(A,'pax')))] }; } },
 {id:'imm_compliance', cat:'Compliance', name:'TEC compliance by entry point', freq:'Weekly · Monday', flow:'none', to:['finance','ops'],
  desc:'Share of paying visitors who arrived with TEC paid, by entry point, mode, market, day or month.', defaults:{period:'last30', group:'cp'}, filters:['cp','mode','mkt'], groups:['cp','mode','mkt','day','month'],
  run(p){ const [a,b]=rng(p), f=flt(p), g=grows(cube(a,b,f,p.group),p.group), T=tot(a,b,f); const tgt=k=>p.group==='cp'?(CP[k].mode==='air'?98.5:96):null;
    return { kpis:[['Paying visitors',fmtN(T.pay)],['Arrived paid',fmtN(T.pay-T.ks)],['Compliance',pct(T.pay?(T.pay-T.ks)/T.pay*100:0,2)]],
      chart: hbars(g.map(o=>({label:glabel(p.group,o.key),value:o.pay?(o.pay-o.ks)/o.pay*100:0,color:tgt(o.key)&&(o.pay-o.ks)/o.pay*100<tgt(o.key)?'#FF8A1F':null})),{fmt:v=>pct(v,1),max:100}),
      cols:[{h:GH[p.group]},{h:'Paying',r:1},{h:'Arrived paid',r:1},{h:'Unpaid on arrival',r:1},{h:'Compliance',r:1},...(p.group==='cp'?[{h:'Target',r:1},{h:'Result'}]:[])],
      rows:g.map(o=>{ const c=o.pay?(o.pay-o.ks)/o.pay*100:0; return [glabel(p.group,o.key),fmtN(o.pay),fmtN(o.pay-o.ks),fmtN(o.ks),pct(c,2),...(p.group==='cp'?[pct(tgt(o.key),1),c>=tgt(o.key)?badge('On target','ok'):badge('Below target','warn')]:[])]; }),
      foot:['Total',fmtN(T.pay),fmtN(T.pay-T.ks),fmtN(T.ks),pct(T.pay?(T.pay-T.ks)/T.pay*100:0,2),...(p.group==='cp'?['','']:[])],
      notes:['Targets: 98.5% at airports, 96% at seaports and land entry.'], checks:[ok('Rows add up to paying visitors', sumk(g,'pay')===T.pay)] }; } },
 {id:'imm_nat', cat:'Arrivals', name:'Arrivals by nationality and entry point', freq:'Monthly · 3rd', flow:'none', monthly:true,
  desc:'Matrix of arrivals by nationality (rows) and entry point (columns).', defaults:{}, filters:['mkt'], groups:[],
  run(p){ const [a,b]=rng(p), ms=p.mkts&&p.mkts.length?p.mkts:MKT.map((_,i)=>i); const M=ms.map(m=>CP.map((_,c)=>{ let s=0; for(let d=a; d<=b; d++) s+=F.n[ix(d,c,m)]; return s; }));
    const colT=CP.map((_,c)=>M.reduce((s,r)=>s+r[c],0)), T=colT.reduce((x,y)=>x+y,0);
    return { kpis:[['Arrivals',fmtN(T)],['Nationalities',ms.length],['Entry points',NC]],
      cols:[{h:'Nationality'},...CP.map(c=>({h:c.id,r:1})),{h:'Total',r:1}],
      rows:ms.map((m,i)=>[MKT[m][1],...M[i].map(fmtN),'<b>'+fmtN(M[i].reduce((x,y)=>x+y,0))+'</b>']), foot:['Total',...colT.map(fmtN),fmtN(T)],
      notes:[DEF_ARRIVAL,'Entry point codes: '+CP.map(c=>c.id+', '+c.name).join('; ')+'.'],
      checks:[ok('Matches the arrivals register', T===tot(a,b,{mkts:p.mkts}).n, fmtN(T))] }; } },
 {id:'imm_exc', cat:'Compliance', name:'Counter exceptions log', freq:'Daily · 23:59', flow:'none', to:['ops'],
  desc:'Exceptions raised at counters by type and entry point, with how each type is resolved.', defaults:{period:'last7', group:'cp'}, filters:['cp'], groups:['cp','day'],
  run(p){ const [a,b]=rng(p); const cs=p.cps&&p.cps.length?p.cps:CP.map((_,i)=>i); const keys=p.group==='day'?Array.from({length:b-a+1},(_,i)=>a+i):cs;
    const rows=keys.map(k=>{ const v=Array(EXTYPES.length).fill(0); for(let d=a; d<=b; d++) for(const c of cs){ if(p.group==='day'&&d!==k) continue; if(p.group==='cp'&&c!==k) continue; exDay(d,c).forEach((x,j)=>v[j]+=x); } return {k,v}; });
    const T=EXTYPES.map((_,j)=>sumk(rows,r=>r.v[j]));
    return { kpis:EXTYPES.slice(0,4).map((t,j)=>[t[0],fmtN(T[j])]),
      cols:[{h:p.group==='day'?'Day':'Entry point'},...EXTYPES.map(t=>({h:t[0].replace(' (pass and passport)',''),r:1})),{h:'Total',r:1}],
      rows:rows.map(r=>[p.group==='day'?fmtD(r.k):CP[r.k].name,...r.v.map(fmtN),'<b>'+fmtN(r.v.reduce((x,y)=>x+y,0))+'</b>']), foot:['Total',...T.map(fmtN),fmtN(T.reduce((x,y)=>x+y,0))],
      notes:EXTYPES.map(t=>`${t[0]}: ${t[2]}.`), checks:[ok('Unpaid on arrival matches the arrivals register', T[0]===tot(a,b,{cps:p.cps}).ks, fmtN(T[0]))] }; } },
 {id:'imm_over', cat:'Compliance', name:'Past declared departure', freq:'Daily · 07:00', flow:'signoff', fixed:'As at the operating date and time',
  desc:'Pass holders still in Sabah after the departure date on their MDAC, by nationality or entry point and days past.', defaults:{period:'today', group:'mkt'}, filters:['cp','mkt'], groups:['mkt','cp'],
  run(p){ const cs=p.cps&&p.cps.length?p.cps:CP.map((_,i)=>i), ms=p.mkts&&p.mkts.length?p.mkts:MKT.map((_,i)=>i); const G=new Map();
    for(let d=Math.max(0,LAST-60); d<LAST; d++) for(const c of cs) for(const m of ms){ const n=F.n[ix(d,c,m)]; if(!n) continue; const decl=Math.round(MKT[m][4])+2, age=LAST-d; if(age<=decl) continue;
      lr(n,STAYW[m]).forEach((cnt,s)=>{ if(!cnt||d+s<=LAST) return; const past=age-decl, key=p.group==='cp'?c:m; let o=G.get(key); if(!o){ o={key,b1:0,b2:0,b3:0}; G.set(key,o); } if(past<=3) o.b1+=cnt; else if(past<=7) o.b2+=cnt; else o.b3+=cnt; }); }
    const g=grows(G,p.group).filter(o=>o.b1+o.b2+o.b3).sort((x,y)=>(y.b1+y.b2+y.b3)-(x.b1+x.b2+x.b3)), T={b1:sumk(g,'b1'),b2:sumk(g,'b2'),b3:sumk(g,'b3')};
    return { kpis:[['Past declared departure',fmtN(T.b1+T.b2+T.b3)],['1 to 3 days',fmtN(T.b1)],['4 to 7 days',fmtN(T.b2)],['8 days or more',fmtN(T.b3)]],
      cols:[{h:GH[p.group]},{h:'1 to 3 days',r:1},{h:'4 to 7 days',r:1},{h:'8 days or more',r:1},{h:'Total',r:1}],
      rows:g.map(o=>[glabel(p.group,o.key),fmtN(o.b1),fmtN(o.b2),fmtN(o.b3),fmtN(o.b1+o.b2+o.b3)]), foot:['Total',fmtN(T.b1),fmtN(T.b2),fmtN(T.b3),fmtN(T.b1+T.b2+T.b3)],
      notes:['As at '+opDate()+'. Most cases are changed flights; the app asks the visitor to update their plan before any follow-up.','Counts only. Named records are in Stay & departures for authorised officers.'],
      checks:[ok('Within pass holders in Sabah', T.b1+T.b2+T.b3<=IN_SABAH, 'of '+fmtN(IN_SABAH))] }; } },
 {id:'imm_kiosk', cat:'Daily', name:'Kiosk and counter payments', freq:'Weekly · Monday', flow:'none', to:['ops','finance'],
  desc:'Visitors who paid on arrival, by entry point, with kiosk uptime where kiosks are installed.', defaults:{period:'last7'}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), g=grows(cube(a,b,{}, 'cp'),'cp'); const up=[99.6,99.1,98.9]; const kv=c=>{ let s=0; for(let d=a; d<=b; d++) s+=DAY[d].colCp[c]; return s; };
    let paid=0; for(let d=a; d<=b; d++) paid+=DAY[d].chan.kiosk;
    return { kpis:[['Kiosks',fmtN(CP.reduce((s,c)=>s+c.kiosks,0))],['Unpaid on arrival',fmtN(sumk(g,'ks'))],['Paid at kiosks and counters',fmtN(paid)]],
      cols:[{h:'Entry point'},{h:'Kiosks',r:1},{h:'Uptime',r:1},{h:'Unpaid on arrival',r:1},{h:'Value',r:1}],
      rows:g.map(o=>[CP[o.key].name,CP[o.key].kiosks||'Assisted counter',CP[o.key].kiosks?pct(up[o.key]):'n/a',fmtN(o.ks),sen(o.ks*TEC_SEN)]), foot:['Total',CP.reduce((s,c)=>s+c.kiosks,0),'',fmtN(sumk(g,'ks')),sen(sumk(g,'ks')*TEC_SEN)],
      notes:['Uptime: minutes a kiosk accepted payments divided by minutes the arrival hall was open.', b===LAST?`${fmtN(STILL_UNPAID.reduce((x,y)=>x+y,0))} visitor(s) sent to a kiosk in the last few minutes have not paid yet.`:''].filter(Boolean),
      checks:[ok('Kiosk payments + still unpaid = unpaid on arrival', paid + (b===LAST?STILL_UNPAID.reduce((x,y)=>x+y,0):0) === sumk(g,'ks'), fmtN(sumk(g,'ks')))] }; } },
],
/* ============================== MERCHANT ============================== */
merchant:[
 {id:'m_sales', cat:'Sales', name:'Sales report', freq:'On demand', flow:'none',
  desc:'Payments, sales, pass-holder discounts, fees and the amount you receive, by day, week, month or payment method.', defaults:{period:'last30', group:'day'}, filters:[], groups:['day','week','month','method'],
  run(p){ const [a,b]=rng(p), tx=MTXS.filter(x=>x.d>=a&&x.d<=b&&mPaid(x)); const key=x=>p.group==='day'?x.d:p.group==='week'?Math.floor(x.d/7):p.group==='month'?dyear(x.d)*100+dmon(x.d):x.m;
    const G=new Map(); tx.forEach(x=>{ const k=key(x); let o=G.get(k); if(!o){ o={key:k,n:0,gross:0,disc:0,amt:0,fee:0,net:0}; G.set(k,o); } o.n++; o.gross+=x.gross; o.disc+=x.disc; o.amt+=x.amt; o.fee+=x.fee; o.net+=x.net; });
    const g=[...G.values()].sort((x,y)=>p.group==='method'?y.amt-x.amt:x.key-y.key), T=g.reduce((t,o)=>{ ['n','gross','disc','amt','fee','net'].forEach(k=>t[k]+=o[k]); return t; },{n:0,gross:0,disc:0,amt:0,fee:0,net:0});
    return { kpis:[['Payments',fmtN(T.n)],['Sales',sen(T.amt)],['Pass-holder discounts',sen(T.disc)],['Fees',sen(T.fee)],['You receive',sen(T.net)]],
      chart: p.group==='day'&&g.length?lineChart({labels:g.map(o=>fmtDs(o.key)),series:[{name:'Sales',color:'#1460E0',data:g.map(o=>o.amt/100)}],yfmt:v=>'RM '+kN(v)}):null,
      cols:[{h:GH[p.group]},{h:'Payments',r:1},{h:'Price',r:1},{h:'Discount',r:1},{h:'Paid by customers',r:1},{h:'Fees',r:1},{h:'You receive',r:1}],
      rows:g.map(o=>[p.group==='method'?o.key:glabel(p.group,o.key),fmtN(o.n),sen(o.gross),sen(-o.disc),sen(o.amt),sen(-o.fee),sen(o.net)]), foot:['Total',fmtN(T.n),sen(T.gross),sen(-T.disc),sen(T.amt),sen(-T.fee),sen(T.net)],
      notes:['Paid by customers: price less the pass-holder discount. You receive: paid by customers less acquirer fees. DuitNow QR has no fee for micro merchants. Refunded payments are left out.'],
      checks:[ok('Price less discount = paid', T.gross-T.disc===T.amt), ok('Paid less fees = you receive', T.amt-T.fee===T.net, sen(T.net))] }; } },
 {id:'m_payout', cat:'Money', name:'Payout statement', freq:'Monthly · 1st', flow:'none',
  desc:'Every payout to your bank, the sales days it covers and the amounts.', defaults:{period:'last30'}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), g=payouts().filter(x=>x.d>=a&&x.d<=b+1).reverse(); const T={n:sumk(g,'n'),amt:sumk(g,'amt'),fee:sumk(g,'fee'),rf:sumk(g,'refunds'),net:sumk(g,'net')};
    return { kpis:[['Payouts',g.length],['To your bank',sen(T.net)],['Fees',sen(T.fee)]],
      cols:[{h:'Payout date'},{h:'Reference'},{h:'Sales days'},{h:'Payments',r:1},{h:'Sales',r:1},{h:'Fees',r:1},{h:'Refunds deducted',r:1},{h:'Paid',r:1},{h:'Status'}],
      rows:g.map(x=>[fmtD(x.d),x.ref,x.covers.map(fmtDs).join(', '),fmtN(x.n),sen(x.amt),sen(-x.fee),sen(-x.refunds),sen(x.net),badge(x.st,x.st==='Paid'?'ok':'info')]),
      foot:['Total','','',fmtN(T.n),sen(T.amt),sen(-T.fee),sen(-T.rf),sen(T.net),''],
      notes:['Payouts are made on business days for every sales day since the last payout, to your bank account ending 3301. A refund after a payout is taken from the next one.'],
      checks:[ok('Each payout equals its sales days less refunds', g.every(x=>x.net===MTXS.filter(t=>x.covers.includes(t.d)&&mPaid(t)).reduce((s,t)=>s+t.net,0)-x.refunds))] }; } },
 {id:'m_methods', cat:'Sales', name:'Sales by payment method', freq:'Monthly · 1st', flow:'none',
  desc:'How customers paid: payments, value, fees and fee rate by method.', defaults:{period:'last30', group:'method'}, filters:[], groups:['method'], run: p => RDEF.merchant[0].run(Object.assign({},p,{group:'method'})) },
 {id:'m_origin', cat:'Customers', name:'Customers by country', freq:'Monthly · 1st', flow:'none',
  desc:'Where paying customers come from, from the country of their wallet or card.', defaults:{period:'last30'}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), tx=MTXS.filter(x=>x.d>=a&&x.d<=b&&mPaid(x)); const G={}; tx.forEach(x=>{ G[x.cc]=G[x.cc]||{n:0,amt:0}; G[x.cc].n++; G[x.cc].amt+=x.amt; }); const g=Object.entries(G).sort((x,y)=>y[1].amt-x[1].amt), T=sumk(tx,'amt');
    const nm = c => c==='MY'?'Malaysia':(MKT[MI[c]]||[0,c])[1];
    return { kpis:[['Payments',fmtN(tx.length)],['Countries',g.length],['Paid by visitors',T?pct((T-sumk(tx.filter(x=>x.cc==='MY'),'amt'))/T*100):'n/a']],
      cols:[{h:'Country'},{h:'Payments',r:1},{h:'Sales',r:1},{h:'Share',r:1},{h:'Average',r:1}],
      rows:g.map(([c,o])=>[nm(c),fmtN(o.n),sen(o.amt),pct(o.amt/T*100),sen(Math.round(o.amt/o.n))]), foot:['Total',fmtN(tx.length),sen(T),tx.length?'100.0%':'',tx.length?sen(Math.round(T/tx.length)):'n/a'],
      notes:['Country of the paying wallet or card.'], checks:[ok('Rows add up to sales', g.reduce((s,[,o])=>s+o.amt,0)===T)] }; } },
 {id:'m_promo', cat:'Customers', name:'Pass deal performance', freq:'Monthly · 1st', flow:'none',
  desc:'Use of your 10% Digital Tourist Pass deal: payments, discount given and average spend.', defaults:{period:'last30'}, filters:[], groups:[],
  run(p){ const [a,b]=rng(p), tx=MTXS.filter(x=>x.d>=a&&x.d<=b&&mPaid(x)), ps=tx.filter(x=>x.pass), np=tx.filter(x=>!x.pass);
    const r=(l,x)=>[l,fmtN(x.length),sen(sumk(x,'gross')),sen(-sumk(x,'disc')),sen(sumk(x,'amt')),x.length?sen(Math.round(sumk(x,'amt')/x.length)):'n/a'];
    return { kpis:[['Deal used',fmtN(ps.length)],['Discount given',sen(sumk(ps,'disc'))],['Average with the pass',ps.length?sen(Math.round(sumk(ps,'amt')/ps.length)):'n/a'],['Average without',np.length?sen(Math.round(sumk(np,'amt')/np.length)):'n/a']],
      cols:[{h:'Customers'},{h:'Payments',r:1},{h:'Price',r:1},{h:'Discount',r:1},{h:'Paid',r:1},{h:'Average',r:1}],
      rows:[r('Pass holders, 10% off',ps),r('Others',np)], foot:['Total',fmtN(tx.length),sen(sumk(tx,'gross')),sen(-sumk(tx,'disc')),sen(sumk(tx,'amt')),''],
      notes:['Discount: 10% of the price, rounded to the sen.'], checks:[ok('Discounts are exactly 10%', ps.every(x=>x.disc===Math.round(x.gross*.1)))] }; } },
 {id:'m_acct', cat:'Money', name:'Monthly summary for your records', freq:'Monthly · 1st', flow:'none', fixed:'Last 90 days, by month',
  desc:'Sales, refunds, discounts, fees and payouts per month, ready for bookkeeping or a consolidated e-invoice.', defaults:{period:'live'}, filters:[], groups:[],
  run(p){ const ks=monthsInRange(Math.max(0,LAST-89),LAST), PO=payouts(); const rows=ks.map(k=>{ const [a,b]=monthRange(k); const tx=MTXS.filter(x=>x.d>=a&&x.d<=b); const pd=tx.filter(mPaid), rf=tx.filter(x=>!mPaid(x)); const po=PO.filter(x=>x.d>=a&&x.d<=b&&x.st==='Paid');
      return {k,n:pd.length,amt:sumk(pd,'amt'),ref:sumk(rf,'amt'),disc:sumk(pd,'disc'),fee:sumk(pd,'fee'),paid:sumk(po,'net')}; });
    return { kpis:[['Months',rows.length],['Sales',sen(sumk(rows,'amt'))],['Fees',sen(sumk(rows,'fee'))]],
      cols:[{h:'Month'},{h:'Payments',r:1},{h:'Sales',r:1},{h:'Refunded',r:1},{h:'Discounts',r:1},{h:'Fees',r:1},{h:'Paid to your bank',r:1}],
      rows:rows.map(r=>[mLabel(r.k)+(r.k===dyear(LAST)*100+dmon(LAST)?' (to date)':''),fmtN(r.n),sen(r.amt),sen(r.ref),sen(r.disc),sen(r.fee),sen(r.paid)]),
      foot:['Total',fmtN(sumk(rows,'n')),sen(sumk(rows,'amt')),sen(sumk(rows,'ref')),sen(sumk(rows,'disc')),sen(sumk(rows,'fee')),sen(sumk(rows,'paid'))],
      notes:['Payouts in a month can include sales from the last days of the month before. Scheduled payouts are not counted until paid.'], checks:[] }; } },
],
};
function RUN_REFUNDS(p){ const [a,b]=rng(p); const g=DAY.slice(a,Math.min(b,LAST-1)+1).map((o,i)=>({d:a+i,...o})); const T={c:sumk(g,'refCnt'),v:sumk(g,'ref'),gr:sumk(g,'gr')};
  return { kpis:[['Refunds',fmtN(T.c)],['Value',sen(T.v)],['Share of collections',pct(T.gr?T.v/T.gr*100:0,2)]],
    cols:[{h:'Day'},{h:'Refunds',r:1},{h:'Value',r:1},{h:'Share of the day',r:1}],
    rows:g.map(o=>[fmtD(o.d),fmtN(o.refCnt),sen(o.ref),pct(o.gr?o.ref/o.gr*100:0,2)]), foot:['Total',fmtN(T.c),sen(T.v),pct(T.gr?T.v/T.gr*100:0,2)],
    notes:['Refunds: duplicate charges, trips cancelled before arrival and wrong traveller counts. Raised by Operations, approved by the Ministry of Finance, returned to the original payment method.','Today is excluded until the day closes.'],
    checks:[ok('Value = refunds × RM 50', T.v===T.c*TEC_SEN)] }; }
function stmt(lines){ return `<table class="t" style="max-width:600px"><tbody>${lines.map(([l,v,b])=>`<tr><td style="${b?'font-weight:700':''}">${l}</td><td class="r" style="${b?'font-weight:700':''}">${sen(v)}</td></tr>`).join('')}</tbody></table>`; }
