/* =====================================================================
   DATA ENGINE · one simulated dataset that every screen and report reads.
   Replace with live APIs in production (see HANDOFF.md, "Data contract").

   Rules (from the Sabah GO storyboard):
   · TEC is RM 50 per international visitor; children under 12 are exempt.
   · Visitors pay in the app or on the web before travelling, or at a kiosk
     or assisted counter on arrival.
   · A licensed acquirer pays funds straight into the State collection
     account. Sabah GO never holds TEC money and has no stored-value wallet.
   Grain: arrival day × checkpoint × market. Money is held in sen (integers).
   ===================================================================== */
/* ---------- formatting ---------- */
const fmtN = n => Math.round(n).toLocaleString('en-MY');
const sen = s => { const v='RM ' + (Math.abs(s)/100).toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2}); return s<0 ? '('+v+')' : v; };
const senK = s => { const v=Math.abs(s)/100; const t = v>=1e9 ? 'RM '+(v/1e9).toFixed(2)+'B' : v>=1e6 ? 'RM '+(v/1e6).toFixed(2)+'M' : v>=1e4 ? 'RM '+(v/1e3).toFixed(1)+'k' : 'RM '+v.toLocaleString('en-MY',{maximumFractionDigits:0}); return s<0?'('+t+')':t; };
const pct = (n,d=1) => (isFinite(n)?n:0).toFixed(d) + '%';
const kN = n => n>=1e6 ? (n/1e6).toFixed(2)+'M' : n>=1e4 ? (n/1e3).toFixed(1)+'k' : n>=1000 ? (n/1e3).toFixed(1)+'k' : fmtN(n);
const chg = (a,b) => b ? (a-b)/b*100 : 0;
const plural = (n, one, many) => `${fmtN(n)} ${n===1?one:(many||one+'s')}`;

const NOW = new Date();
const GO_LIVE_UTC = Date.UTC(2027,5,1);
/* Operating clock: the viewer's calendar day in the first operating year, at a fixed 15:20 MYT
   so every screen shows the same moment whatever time the demo is opened. */
const SIM = (()=>{ const y = NOW.getMonth()>=5 ? 2027 : 2028; return { y, mo:NOW.getMonth(), d:NOW.getDate(), h:15, mi:20 }; })();
const SIM_UTC = Date.UTC(SIM.y, SIM.mo, SIM.d);
const NDAYS = Math.round((SIM_UTC-GO_LIVE_UTC)/864e5)+1;
const LAST = NDAYS-1;
const AHEAD = 14;                      // future arrival days whose visitors have already paid
const NALL = NDAYS + AHEAD;
const dayUTC = i => new Date(GO_LIVE_UTC + i*864e5);
const dow = i => dayUTC(i).getUTCDay();
const dmon = i => dayUTC(i).getUTCMonth();
const dyear = i => dayUTC(i).getUTCFullYear();
const fmtD = (i, o={day:'numeric',month:'short',year:'numeric'}) => dayUTC(i).toLocaleDateString('en-GB',{timeZone:'UTC',...o});
const fmtDs = i => fmtD(i,{day:'numeric',month:'short'});
const dayOf = (y,m,d) => Math.round((Date.UTC(y,m,d)-GO_LIVE_UTC)/864e5);
const pad2 = n => String(n).padStart(2,'0');
const HHMM = pad2(SIM.h)+':'+pad2(SIM.mi);
const NOWMIN = SIM.h*60+SIM.mi;
const HCURVE = [0,0,0,0,0,.010,.030,.050,.070,.080,.080,.070,.070,.060,.060,.060,.070,.070,.060,.050,.040,.030,.025,.015];
const PCURVE = [.01,.005,.005,.005,.005,.01,.02,.03,.045,.055,.06,.06,.06,.06,.06,.06,.06,.065,.07,.075,.075,.07,.05,.03]; // when people pay online
const cumFrac = (curve,h,mi) => { const s=curve.reduce((a,b)=>a+b,0); return (curve.slice(0,h).reduce((a,b)=>a+b,0)+curve[h]*mi/60)/s; };
const TODAY_FRAC = cumFrac(HCURVE,SIM.h,SIM.mi);
const PAY_FRAC = cumFrac(PCURVE,SIM.h,SIM.mi);

let eseed = 777001;
const er = () => { eseed |= 0; eseed = eseed + 0x6D2B79F5 | 0; let t = Math.imul(eseed ^ eseed >>> 15, 1 | eseed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
function lr(total, weights){ const s = weights.reduce((a,b)=>a+b,0); if(!s||!total) return weights.map(()=>0);
  const raw = weights.map(w=>total*w/s), fl = raw.map(Math.floor); let rem = total - fl.reduce((a,b)=>a+b,0);
  raw.map((v,i)=>[v-fl[i],i]).sort((a,b)=>b[0]-a[0]).slice(0,rem).forEach(([,i])=>fl[i]++); return fl; }

/* ---------- reference ----------
   code, name, 2025 international arrivals (deck figure where known), growth 2027 vs 2025,
   average stay (nights), in-app spend per visitor (RM), share under 12 (exempt), real 2025 deck figure? */
const DECK_TOTAL_2025 = 1498709;
const MKT = [
 ['CN','China',657528,1.18,5.2,1650,.090,1],['SG','Singapore',38638,1.06,3.9,1240,.070,1],['GB','UK & Ireland',34704,1.10,10.4,3100,.060,1],
 ['TW','Taiwan',34342,1.12,5.8,1720,.080,1],['AU','Australia',22571,1.14,9.2,2950,.070,1],['JP','Japan',16980,1.09,6.1,2100,.080,1],
 ['KR','South Korea',14210,1.15,5.6,1880,.100,1],['PH','Philippines',11540,1.08,4.1,980,.080,1],
 ['BN','Brunei',134884,1.04,2.4,620,.120,0],['ID','Indonesia',97416,1.07,3.6,760,.100,0],['HK','Hong Kong',47959,1.05,4.9,1550,.070,0],
 ['US','United States',23979,1.12,9.6,3050,.050,0],['DE','Germany',13488,1.10,12.8,3300,.050,0],['FR','France',10491,1.10,11.6,3200,.050,0],['NL','Netherlands',7494,1.07,12.1,3150,.050,0],
 ['OT','Other markets',0,1.08,7.0,1900,.070,0],
];
MKT[15][2] = DECK_TOTAL_2025 - MKT.slice(0,15).reduce((a,m)=>a+m[2],0);
const NM = MKT.length, MI = Object.fromEntries(MKT.map((m,i)=>[m[0],i]));
const CP = [
 {id:'KKIA',name:'Kota Kinabalu International Airport',short:'KKIA',mode:'air',share:.790,kiosks:24,unpaid:.012,district:'Kota Kinabalu'},
 {id:'TWU', name:'Tawau Airport',short:'Tawau Airport',mode:'air',share:.045,kiosks:6,unpaid:.014,district:'Tawau'},
 {id:'SDK', name:'Sandakan Airport',short:'Sandakan Airport',mode:'air',share:.035,kiosks:6,unpaid:.014,district:'Sandakan'},
 {id:'TFT', name:'Tawau Ferry Terminal',short:'Tawau Ferry',mode:'sea',share:.050,kiosks:0,unpaid:.030,district:'Tawau'},
 {id:'SFT', name:'Sandakan Ferry Terminal',short:'Sandakan Ferry',mode:'sea',share:.020,kiosks:0,unpaid:.030,district:'Sandakan'},
 {id:'MNB', name:'Menumbok Ferry Terminal',short:'Menumbok Ferry',mode:'sea',share:.020,kiosks:0,unpaid:.030,district:'Beaufort'},
 {id:'KKP', name:'Kota Kinabalu Cruise Terminal',short:'KK Cruise Terminal',mode:'cruise',share:.015,kiosks:0,unpaid:.010,district:'Kota Kinabalu'},
 {id:'SDM', name:'Sindumin ICQS (land, from Sarawak)',short:'Sindumin ICQS',mode:'land',share:.025,kiosks:0,unpaid:.050,district:'Sipitang'},
];
const NC = CP.length;
const MODE = {air:{l:'Air',icon:'plane'}, sea:{l:'Sea (ferry)',icon:'ship'}, cruise:{l:'Cruise',icon:'anchor'}, land:{l:'Land',icon:'bus'}};
const MODES = ['air','sea','cruise','land'];
const TEC_SEN = 5000;
const RAIL = [['Card (Visa, Mastercard, UnionPay)',.015],['Alipay+',.014],['WeChat Pay',.014],['DuitNow QR',.005],['FPX online banking',.008],['Kiosk or counter card',.015]];
const NR = RAIL.length;
const RAILMIX = { CN:[12,55,33,0,0], SG:[55,10,0,35,0], GB:[95,5,0,0,0], TW:[75,25,0,0,0], AU:[95,5,0,0,0], JP:[85,15,0,0,0], KR:[60,40,0,0,0], PH:[55,45,0,0,0],
 BN:[45,0,0,45,10], ID:[45,40,0,15,0], HK:[50,45,5,0,0], US:[95,5,0,0,0], DE:[95,5,0,0,0], FR:[95,5,0,0,0], NL:[95,5,0,0,0], OT:[80,15,0,5,0] };
const SEASON = [92,88,101,98,96,112,128,121,104,99,103,118];   // monthly pattern of international arrivals
const SSUM = SEASON.reduce((a,b)=>a+b,0);
const LEADW = [.16,.24,.15,.10,.07,.06,.05,.04,.03,.03,.02,.02,.01,.01,.01]; // days paid before arrival
const CPMIX = (()=>{ const base=MKT.map(m=>m[2]); const adj=mul=>base.map((v,i)=>v*(mul[MKT[i][0]]??1)); const fixed=o=>MKT.map(m=>o[m[0]]||0);
  return [ adj({BN:.35,ID:.3,PH:.6}), adj({ID:1.6,PH:1.2,BN:.5}), adj({PH:1.6,BN:.5}),
    fixed({ID:75,CN:5,OT:20}), fixed({PH:70,CN:8,OT:22}), fixed({BN:60,CN:15,SG:5,OT:20}),
    fixed({CN:20,AU:18,GB:12,US:12,DE:8,JP:10,SG:10,OT:10}), fixed({BN:85,ID:3,OT:12}) ].map(a=>{ const s=a.reduce((x,y)=>x+y,0); return a.map(v=>v/s); }); })();
const growth = (m,d) => MKT[m][3]*(1+.035*Math.sin(d/11+m*1.7));
const STAYW = MKT.map(m=>{ const mu=m[4], th=mu/3; const t=[]; let s=0; for(let k=1;k<=24;k++){ const v=Math.pow(k,2)*Math.exp(-k/th); t.push(v); s+=v; } return [.008].concat(t.map(v=>v/s*.992)); });

/* ---------- today's flights (air checkpoints) ---------- */
const ROUTES = {
 KKIA:[['Shanghai (PVG)',['CN'],3],['Guangzhou (CAN)',['CN'],2],['Shenzhen (SZX)',['CN'],1.5],['Chengdu (TFU)',['CN'],1],['Hangzhou (HGH)',['CN'],1],['Beijing (PKX)',['CN'],1],
   ['Seoul (ICN)',['KR'],2],['Busan (PUS)',['KR'],1],['Tokyo (NRT)',['JP'],1],['Taipei (TPE)',['TW'],1],['Hong Kong (HKG)',['HK'],1],['Singapore (SIN)',['SG','OT'],1],
   ['Bandar Seri Begawan (BWN)',['BN'],1],['Manila (MNL)',['PH'],1],['Perth (PER)',['AU'],1],['Kuala Lumpur (KUL), domestic',['GB','US','DE','FR','NL','ID','OT','AU','JP'],1]],
 TWU:[['Kuala Lumpur (KUL), domestic',null,1]], SDK:[['Kuala Lumpur (KUL), domestic',null,1]],
};
const FLIGHTS = [];
/* ---------- cell store (arrivals) ---------- */
const NCELL = NALL*NC*NM;
const ix = (d,c,m) => (d*NC + c)*NM + m;
const F = {}; ['n','pay','ex','ks','sp','dep','dst','fn','fpay','fks'].forEach(k=>F[k]=new Float64Array(NCELL));
(function generate(){
  for(let d=0; d<NALL; d++){
    const mo=dmon(d), y=dyear(d), dim=new Date(Date.UTC(y,mo+1,0)).getUTCDate();
    const wd={0:1.04,1:.97,2:.94,3:.97,4:1.0,5:1.10,6:1.10}[dow(d)];
    const day25 = DECK_TOTAL_2025*SEASON[mo]/SSUM/dim*wd*(1+(er()-.5)*.08);
    for(let c=0;c<NC;c++) for(let m=0;m<NM;m++){
      const exp = day25*CP[c].share*CPMIX[c][m]*growth(m,d)*(1+(er()-.5)*.18);
      const n = Math.max(0,Math.round(exp)); if(!n) continue; const k=ix(d,c,m);
      const ex=Math.round(n*MKT[m][6]), pay=n-ex, ks=Math.round(pay*CP[c].unpaid);
      F.fn[k]=n; F.fpay[k]=pay; F.fks[k]=ks;                       // full-day expected (used for payments)
      if(d<LAST){ F.n[k]=n; F.pay[k]=pay; F.ex[k]=ex; F.ks[k]=ks; F.sp[k]=Math.round(n*MKT[m][5]*100*(.9+er()*.2)); }
    }
  }
  /* today: air checkpoints from the flight schedule, other checkpoints pro-rata to the time of day */
  CP.forEach((C,c)=>{
    if(C.mode!=='air'){ for(let m=0;m<NM;m++){ const k=ix(LAST,c,m); const n=Math.floor(F.fn[k]*TODAY_FRAC); if(!n) continue; const ex=Math.round(n*MKT[m][6]), pay=n-ex; F.n[k]=n; F.pay[k]=pay; F.ex[k]=ex; F.ks[k]=Math.round(pay*C.unpaid); F.sp[k]=Math.round(n*MKT[m][5]*100); } return; }
    const routes = ROUTES[C.id].map(r=>({o:r[0], mk:r[1]?r[1].map(x=>MI[x]):MKT.map((_,i)=>i), w:r[2], pax:Array(NM).fill(0)}));
    for(let m=0;m<NM;m++){ const full=F.fn[ix(LAST,c,m)]; const rs=routes.filter(r=>r.mk.includes(m)); if(!rs.length) continue; lr(full, rs.map(r=>r.w)).forEach((v,i)=>rs[i].pax[m]+=v); }
    const fl=[];
    routes.forEach(r=>{ const tot=r.pax.reduce((a,b)=>a+b,0); if(!tot) return; const lin = r.o.startsWith('Shanghai') && C.id==='KKIA';
      let nf=Math.max(1,Math.round(tot/(lin?186:175))); let sizes = lin && tot>=186 ? [186, ...lr(tot-186, Array(Math.max(1,nf-1)).fill(1))] : lr(tot, Array(nf).fill(1)); sizes=sizes.filter(Boolean);
      const left=r.pax.slice(); sizes.forEach((sz,j)=>{ const comp = j===sizes.length-1 ? left.slice() : lr(sz, left); comp.forEach((v,m)=>left[m]-=v); fl.push({cp:c, origin:r.o, comp, lin:lin&&j===0}); }); });
    const order = fl.map((f,i)=>[er(),i]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
    const csum = []; let acc=0; const hs=HCURVE.reduce((a,b)=>a+b,0); HCURVE.forEach(v=>{ acc+=v/hs; csum.push(acc); });
    order.forEach((fi,pos)=>{ const q=(pos+.5)/order.length; let h=csum.findIndex(v=>v>=q); const prev=h>0?csum[h-1]:0; const mi=Math.min(55,Math.floor((q-prev)/(csum[h]-prev)*60/5)*5); fl[fi].t=h*60+mi; });
    const lf=fl.find(f=>f.lin); if(lf) lf.t=13*60+5;
    fl.forEach((f,i)=>{ f.id=`${C.id}-${pad2(i+1)}`; f.pax=f.comp.reduce((a,b)=>a+b,0); f.ex=0; f.pay=0; f.ks=0;
      f.comp.forEach((n,m)=>{ if(!n) return; const ex=Math.round(n*MKT[m][6]), pay=n-ex, ks=f.lin?0:Math.round(pay*C.unpaid); f.ex+=ex; f.pay+=pay; f.ks+=ks;
        if(f.t<=NOWMIN){ const k=ix(LAST,c,m); F.n[k]+=n; F.pay[k]+=pay; F.ex[k]+=ex; F.ks[k]+=ks; F.sp[k]+=Math.round(n*MKT[m][5]*100); } });
      f.arrived = f.t<=NOWMIN; f.time = pad2(Math.floor(f.t/60))+':'+pad2(f.t%60); FLIGHTS.push(f); });
  });
  FLIGHTS.sort((a,b)=>a.t-b.t);
  /* departures: each arrival cohort split by length of stay */
  for(let d=0; d<=LAST; d++) for(let c=0;c<NC;c++) for(let m=0;m<NM;m++){ const n=F.n[ix(d,c,m)]; if(!n) continue;
    lr(n, STAYW[m]).forEach((cnt,s)=>{ if(!cnt) return; const dd=d+s; if(dd>LAST) return; const cc=(dd===LAST&&d<LAST)?Math.floor(cnt*TODAY_FRAC):cnt; if(!cc) return; const kk=ix(dd,c,m); F.dep[kk]+=cc; F.dst[kk]+=cc*s; }); }
})();
/* travellers who reached a counter unpaid in the last few minutes and have not yet paid at the kiosk */
const STILL_UNPAID = CP.map((C,c)=>{ let ks=0; for(let m=0;m<NM;m++) ks+=F.ks[ix(LAST,c,m)]; return C.mode==='air'? Math.min(ks, Math.round(ks*.08)) : Math.min(ks, Math.round(ks*.12)); });

/* ---------- payment ledger (by payment date) ---------- */
const LED = new Float64Array(NDAYS*NC*NM);          // paying travellers whose TEC was paid that day
const lix = (d,c,m) => (d*NC+c)*NM+m;
const DAYRAIL = Array.from({length:NDAYS},()=>Array(NR).fill(0));
const DAYCHAN = Array.from({length:NDAYS},()=>({app:0,web:0,kiosk:0}));
(function payments(){
  for(let d=0; d<NALL; d++) for(let c=0;c<NC;c++) for(let m=0;m<NM;m++){ const k=ix(d,c,m); const P=F.fpay[k]; if(!P) continue;
    let K = F.fks[k]; if(d===LAST){ K = F.ks[k]; } if(d>LAST) K=0;
    const pre = P - F.fks[k];
    lr(pre, LEADW).forEach((cnt,L)=>{ if(!cnt) return; let pd=d-L; if(pd<0) pd=d; if(pd>LAST) return; let v=cnt; if(pd===LAST) v=Math.floor(cnt*PAY_FRAC); if(!v) return;
      LED[lix(pd,c,m)]+=v; const rails=lr(v, RAILMIX[MKT[m][0]]); rails.forEach((x,j)=>DAYRAIL[pd][j]+=x); const web=Math.round(v*.07); DAYCHAN[pd].web+=web; DAYCHAN[pd].app+=v-web; });
    if(d<=LAST && K){ const paid = d===LAST ? Math.max(0, K - Math.round(K*STILL_UNPAID[c]/Math.max(1,CP.reduce((s,_,cc)=>s,0)||1)*0) ) : K; if(paid){ LED[lix(d,c,m)]+=paid; DAYRAIL[d][5]+=paid; DAYCHAN[d].kiosk+=paid; } }
  }
  /* remove today's still-unpaid travellers from kiosk payments (they have not paid yet) */
  CP.forEach((C,c)=>{ let left=STILL_UNPAID[c]; for(let m=0;m<NM&&left>0;m++){ const k=lix(LAST,c,m); const take=Math.min(left, F.ks[ix(LAST,c,m)]); LED[k]-=take; DAYRAIL[LAST][5]-=take; DAYCHAN[LAST].kiosk-=take; left-=take; } });
})();

/* ---------- daily rollup ---------- */
const DAY = Array.from({length:NDAYS},(_,d)=>{
  const o={n:0,pay:0,ex:0,ks:0,sp:0,dep:0,dst:0, col:0, colCp:Array(NC).fill(0), colM:Array(NM).fill(0), modeGr:{air:0,sea:0,cruise:0,land:0}};
  for(let c=0;c<NC;c++) for(let m=0;m<NM;m++){ const k=ix(d,c,m); o.n+=F.n[k]; o.pay+=F.pay[k]; o.ex+=F.ex[k]; o.ks+=F.ks[k]; o.sp+=F.sp[k]; o.dep+=F.dep[k]; o.dst+=F.dst[k];
    const v=LED[lix(d,c,m)]; o.col+=v; o.colCp[c]+=v; o.colM[m]+=v; o.modeGr[CP[c].mode]+=v*TEC_SEN; }
  o.gr = o.col*TEC_SEN; o.rv = DAYRAIL[d].map(x=>x*TEC_SEN); o.chan = DAYCHAN[d];
  o.fees = o.rv.map((v,j)=>Math.round(v*RAIL[j][1])); o.fee = o.fees.reduce((a,b)=>a+b,0);
  o.refCnt = d===LAST ? 0 : Math.round(o.col*.0011); o.ref = o.refCnt*TEC_SEN;
  o.net = o.gr - o.ref - o.fee;                 // credited to the State collection account
  o.partner = Math.round(o.net*.2);             // concession partner share, payable by the State
  return o;
});
let _st=0; const STOCK = DAY.map(o=>(_st += o.n - o.dep));
const IN_SABAH = STOCK[LAST];

/* ---------- settlement & reconciliation (daily, three-way) ---------- */
const SWEEP = (()=>{ const settledFrac = cumFrac(PCURVE,Math.max(0,SIM.h-1),0)/PAY_FRAC; return Math.min(1,settledFrac); })();
const RECON = (()=>{ const out=[]; const XD=LAST-6;
  let kv=0; for(let m=0;m<NM;m++) kv+=0; kv = Math.round(DAY[XD].rv[5]*0.18/TEC_SEN)*TEC_SEN;  // a late kiosk batch from Tawau Airport
  const lateNet = kv - Math.round(kv*RAIL[5][1]);
  for(let d=0; d<LAST; d++){ const x=DAY[d]; let credited=x.net, acq=x.gr, note='', st='Reconciled';
    if(d===XD){ credited-=lateNet; acq-=kv; st='Late batch, cleared next day'; note=`Kiosk TWU-03 (Tawau Airport) uploaded ${fmtN(kv/TEC_SEN)} card payments after the acquirer cut-off.`; }
    if(d===XD+1){ credited+=lateNet; acq+=kv; st='Reconciled, includes carry-forward'; note=`Includes ${sen(lateNet)} from ${fmtD(XD)}.`; }
    out.push({d, ledger:x.gr, acq, fees:x.fee, ref:x.ref, due:x.net, credited, variance:credited-x.net, st, note, ref_:'SA-'+String(271000+d*3).padStart(6,'0'), resolved: d===XD ? 'Siti Mariam Yusof, '+fmtD(XD+1)+' 10:12' : '' }); }
  return out; })();

/* ---------- baselines ---------- */
/* Last year (2026): the deck's 2025 international arrivals by market, grown 6%, spread by month and weekday. */
const LY = Array.from({length:NDAYS},(_,d)=>{ const mo=dmon(d), y=dyear(d), dim=new Date(Date.UTC(y,mo+1,0)).getUTCDate(); const wd={0:1.04,1:.97,2:.94,3:.97,4:1.0,5:1.10,6:1.10}[dow(d)];
  return MKT.map((m,i)=>{ const v=m[2]*1.06*SEASON[mo]/SSUM/dim*wd; return d===LAST?Math.round(v*TODAY_FRAC):Math.round(v); }); });

/* ---------- aggregation ---------- */
const FIELDS = ['n','pay','ex','ks','sp','dep','dst'];
function cube(from, to, {cps, mkts, modes}={}, by){
  const cs=(cps&&cps.length?cps:CP.map((_,i)=>i)).filter(c=>!modes||!modes.length||modes.includes(CP[c].mode)); const ms=mkts&&mkts.length?mkts:MKT.map((_,i)=>i);
  const out=new Map();
  for(let d=Math.max(0,from); d<=Math.min(LAST,to); d++) for(const c of cs) for(const m of ms){ const k=ix(d,c,m); const l=LED[lix(d,c,m)]; if(!F.n[k]&&!F.dep[k]&&!l) continue;
    const key = by==='day'?d : by==='month'?dyear(d)*100+dmon(d) : by==='week'?Math.floor(d/7) : by==='cp'?c : by==='mkt'?m : by==='mode'?CP[c].mode : 'all';
    let o=out.get(key); if(!o){ o={key,col:0}; FIELDS.forEach(f=>o[f]=0); out.set(key,o); }
    for(const f of FIELDS) o[f]+=F[f][k]; o.col+=l; }
  out.forEach(o=>{ o.gr=o.col*TEC_SEN; o.tecDue=o.pay*TEC_SEN; });
  return out;
}
const ZERO = () => Object.assign({key:'all',col:0,gr:0,tecDue:0},Object.fromEntries(FIELDS.map(f=>[f,0])));
const tot = (from,to,flt) => cube(from,to,flt,null).get('all') || ZERO();
function dsum(from, to){ const o={col:0,gr:0,ref:0,refCnt:0,fee:0,net:0,partner:0,fees:Array(NR).fill(0),rv:Array(NR).fill(0),modeGr:{air:0,sea:0,cruise:0,land:0},chan:{app:0,web:0,kiosk:0},colCp:Array(NC).fill(0)};
  for(let d=Math.max(0,from); d<=Math.min(LAST,to); d++){ const x=DAY[d]; ['col','gr','ref','refCnt','fee','net','partner'].forEach(k=>o[k]+=x[k]); x.fees.forEach((v,j)=>o.fees[j]+=v); x.rv.forEach((v,j)=>o.rv[j]+=v); MODES.forEach(md=>o.modeGr[md]+=x.modeGr[md]); ['app','web','kiosk'].forEach(k=>o.chan[k]+=x.chan[k]); x.colCp.forEach((v,c)=>o.colCp[c]+=v); }
  return o; }
const lySum = (from,to,mkts) => { let s=0; for(let d=Math.max(0,from); d<=Math.min(LAST,to); d++) (mkts&&mkts.length?mkts:MKT.map((_,i)=>i)).forEach(m=>s+=LY[d][m]); return s; };

/* ---------- periods ---------- */
const monthStart = d => dayOf(dyear(d), dmon(d), 1);
const PERIODS = {
  today:{l:'Today', r:()=>[LAST,LAST]}, yesterday:{l:'Yesterday', r:()=>[LAST-1,LAST-1]},
  last7:{l:'Last 7 days', r:()=>[LAST-6,LAST]}, last30:{l:'Last 30 days', r:()=>[LAST-29,LAST]},
  mtd:{l:'Month to date', r:()=>[Math.max(0,monthStart(LAST)),LAST]},
  lastMonth:{l:'Last month', r:()=>{ const s=monthStart(LAST); return [Math.max(0,monthStart(s-1)), s-1]; }},
  qtd:{l:'Quarter to date', r:()=>[Math.max(0,dayOf(dyear(LAST), Math.floor(dmon(LAST)/3)*3, 1)), LAST]},
  ytd:{l:'Year to date', r:()=>[Math.max(0,dayOf(dyear(LAST),0,1)), LAST]},
  live:{l:'Since go-live', r:()=>[0,LAST]},
};
const prdLabel = (a,b) => a===b ? fmtD(a) : `${fmtD(a,{day:'numeric',month:'short'})} to ${fmtD(b)}`;
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const monthsInRange = (a,b) => { const s=new Set(); for(let d=Math.max(0,a); d<=Math.min(LAST,b); d++) s.add(dyear(d)*100+dmon(d)); return [...s]; };
const mLabel = k => MONTHS[k%100]+' '+Math.floor(k/100);
const daysInMonthKey = k => new Date(Date.UTC(Math.floor(k/100), k%100+1, 0)).getUTCDate();
function monthRange(k){ const y=Math.floor(k/100), m=k%100; return [Math.max(0,dayOf(y,m,1)), Math.min(LAST,dayOf(y,m+1,0))]; }
function monthRangeFull(k){ const y=Math.floor(k/100), m=k%100; return [dayOf(y,m,1), dayOf(y,m+1,0)]; }
const MONTHKEYS = monthsInRange(0, LAST);

/* ---------- budget: State TEC revenue estimate by month (rounded to RM 50,000) ---------- */
const BUDGET = {};
for(let y=2027;y<=2028;y++) for(let mo=0;mo<12;mo++){ if(y===2027&&mo<5) continue; BUDGET[y*100+mo] = Math.round(DECK_TOTAL_2025*SEASON[mo]/SSUM*1.10*.92*50/50000)*50000*100; }
const ARR_TARGET_2027 = 920000;   // June to December 2027 international arrivals (sample target)

/* ---------- districts (tile map, not to scale) ---------- */
const DISTRICTS = [ // name, col, row, share of visitors in Sabah, spend weight
 ['Kudat',2,0,4,1],['Kota Marudu',3,1,1,.6],['Kota Belud',1,1,3,.9],['Tuaran',1,2,4,1],['Ranau',2,2,11,1.1],['Sandakan',5,2,8,1],
 ['Kota Kinabalu',0,3,30,1.2],['Penampang',1,3,3,.9],['Kinabatangan',4,3,5,1.1],['Lahad Datu',5,4,2,1],['Papar',0,4,2,.8],['Keningau',1,4,1.5,.7],
 ['Beaufort',0,5,2,.7],['Tenom',1,5,1.5,.7],['Tawau',4,5,6,.9],['Semporna',5,5,13,1.3],['Sipitang',0,6,1,.6]];

