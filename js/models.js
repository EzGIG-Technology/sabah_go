/* =====================================================================
   DERIVED MODELS · destinations, districts, alerts, events, ratings,
   counter exceptions, service levels, the merchant ledger and payouts
   ===================================================================== */
const DEST = [
 {n:'Kota Kinabalu City', d:'Kota Kinabalu', sh:.300, cap:0, r:4.6, img:'d_kk'},
 {n:'Tunku Abdul Rahman Park', d:'Kota Kinabalu', sh:.080, cap:1800, r:4.6, img:'d_tarp'},
 {n:'Kinabalu Park & Kundasang', d:'Ranau', sh:.110, cap:2600, r:4.8, img:'d_kpark'},
 {n:'Mount Kinabalu summit trail', d:'Ranau', sh:.0068, cap:185, r:4.9, img:'d_summit', permit:true},
 {n:'Semporna islands', d:'Semporna', sh:.120, cap:2800, r:4.9, img:'d_semporna'},
 {n:'Sipadan Island', d:'Semporna', sh:.0066, cap:176, r:5.0, img:'d_sipadan', permit:true},
 {n:'Kinabatangan & Sukau', d:'Kinabatangan', sh:.040, cap:950, r:4.8, img:'d_kina'},
 {n:'Sepilok', d:'Sandakan', sh:.045, cap:1100, r:4.7, img:'d_sepilok'},
 {n:'Danum Valley', d:'Lahad Datu', sh:.008, cap:180, r:4.8, img:'d_danum'},
 {n:'Mari-Mari Cultural Village', d:'Penampang', sh:.022, cap:600, r:4.8, img:'d_marimari'},
 {n:'Tamu Kota Belud', d:'Kota Belud', sh:.020, cap:0, r:4.7, img:'d_tamu'},
 {n:'Kudat & Tip of Borneo', d:'Kudat', sh:.018, cap:0, r:4.6, img:'d_kudat'},
];
/* visitors on site; for permit sites this is permits used (booked ahead for future days) */
const dvis = (k,d) => { const D=DEST[k], base=STOCK[Math.min(d,LAST)]; let v=Math.round(base*D.sh*(1+.08*Math.sin(d*.9+k))); if(d===LAST&&!D.permit) v=Math.round(v*Math.min(1,TODAY_FRAC*1.4)); return D.cap?Math.min(D.cap,v):v; };
const DSHARE = DISTRICTS.map(x=>x[3]);
const dstock = d => lr(STOCK[d], DSHARE.map((s,i)=>s*(1+.06*Math.sin(d*.7+i))));
const attractionsWeek = () => DEST.map((D,k)=>{ let s=0; for(let d=LAST-6; d<=LAST; d++) s+=dvis(k,d); return {D,k,s}; }).sort((a,b)=>b.s-a.s);
/* official alerts sent through the app */
const LANGS = {CN:'Chinese',TW:'Chinese',HK:'Chinese',SG:'English',GB:'English',AU:'English',US:'English',PH:'English',JP:'Japanese',KR:'Korean',BN:'Malay',ID:'Malay',DE:'German',FR:'French',NL:'English',OT:'English'};
let ALERTS = [
 {at:`${fmtD(LAST)} 07:55`, area:'Ranau (Kinabalu Park)', type:'Weather advisory', text:'Afternoon thunderstorms expected. Start summit and park trails before 9am.', langs:['Chinese','English','Korean','Malay'], to:1924, ok:1860, by:'Nurul Aqilah'},
 {at:`${fmtD(LAST-3)} 06:40`, area:'Semporna', type:'Sea conditions', text:'Strong winds and rough seas. Island trips today are cancelled; operators will rebook you.', langs:['Chinese','English','Korean','Malay'], to:1240, ok:1198, by:'Nurul Aqilah'},
 {at:`${fmtD(LAST-9)} 18:05`, area:'Kota Kinabalu', type:'Event', text:'Road closures for KK Jazz Festival around the waterfront from 6pm.', langs:['Chinese','English','Korean','Malay','Japanese'], to:7810, ok:7542, by:'Faridah Ismail'},
];
const EVENTS = [
 {n:'Borneo Bird Festival', where:'Sepilok, Sandakan', day:LAST+6, saved:4210, chk:0, spend:0, img:'e_bird'},
 {n:'Sabah Fest', where:'Kota Kinabalu', day:LAST+19, saved:6830, chk:0, spend:0, img:'e_fest'},
 {n:'KK Jazz Festival', where:'Kota Kinabalu', day:LAST-9, saved:3120, chk:2480, spend:41260000, img:'e_jazz'},
 {n:'Mount Kinabalu Climbathon', where:'Kundasang', day:LAST-31, saved:2950, chk:1920, spend:28840000, img:'e_climb'},
 {n:'Regatta Lepa', where:'Semporna', day:dayOf(GO_LIVE_YEAR+1,3,18), saved:1840, chk:0, spend:0, img:'e_regatta'},
 {n:'Pesta Kaamatan', where:'Penampang', day:dayOf(GO_LIVE_YEAR+1,4,30), saved:2610, chk:0, spend:0, img:'e_kaamatan'},
];
let CAMPAIGNS = [['Borneo Bird Festival, early bird','All markets',82400,33949,1820,26400000],['Go Rural Sabah: Kudat and Tenom','KR, JP, AU',31600,12166,940,11850000],['Kundasang cool escape','SG, BN, HK',22100,9901,1210,9620000],['Tamu and night markets','CN, TW',58900,21263,3480,14190000]];
const RATINGS = MONTHKEYS.map((k,i)=>{ const resp=Math.round(tot(...monthRange(k)).dep*.29); return {k, c:lr(resp,[1.2,1.8,6.2,25.4+i*.3,65.4-i*.3])}; });
const ratingAvg = c => { const n=c.reduce((a,b)=>a+b,0); return n? c.reduce((a,v,i)=>a+v*(i+1),0)/n : 0; };
/* counter exceptions per 10,000 arrivals (first type = unpaid on arrival, sent to kiosk) */
const EXTYPES = [['Unpaid on arrival',0,'Sent to the kiosk, paid on site'],['Name mismatch (pass and passport)',4.1,'Corrected from a new passport scan'],['MDAC record not found',2.6,'Checked against MDAC manually'],['Party count mismatch',3.2,'Extra traveller paid at the kiosk'],['Pass already used for entry',.9,'Supervisor review']];
const exDay = (d,c) => { let n=0,ks=0; for(let m=0;m<NM;m++){ n+=F.n[ix(d,c,m)]; ks+=F.ks[ix(d,c,m)]; } return EXTYPES.map((t,j)=> j===0 ? ks : Math.round(n*t[1]/10000 + ((d*7+c*3+j)%5===0&&n>200?1:0))); };
let EXC = (()=>{ const out=[]; CP.forEach((C,c)=>{ exDay(LAST,c).slice(1).forEach((n,j)=>{ for(let k=0;k<n;k++){ const m=wpick(MKT.map((_,x)=>x),x=>CPMIX[c][x]);
  const t=mkParty(TRAV.length,{m,c,st:'In Sabah',arr:LAST,dep:LAST+4,adults:j===2?2:1,kids:0}); t.arrAt=tstr(Math.max(6*60, NOWMIN-ri(5,300))); TRAV.push(t);
  out.push({type:EXTYPES[j+1][0], how:EXTYPES[j+1][2], t, cp:C, time:t.arrAt, sev:j===3?'bad':'warn', done:null, note:''}); } }); }); return out.sort((a,b)=>b.time.localeCompare(a.time)); })();
const SLA = MONTHKEYS.map((k,i)=>({k, avail:[99.97,99.99,99.95,99.98,99.99,99.98,99.98][i]??99.98, inc:[1,0,2,1,0,1,0][i]??0, pay:[99.31,99.42,99.38,99.44,99.40,99.41,99.39][i]??99.4, supp:[96.8,97.4,95.9,97.1,97.9,97.6,97.2][i]??97, ai:[85.1,86.0,86.4,86.9,87.3,87.2,87.2][i]??87 }));

/* ---------- Puan Aminah's ledger (last 90 days) ---------- */
const MPAY = [['Alipay+',.014,['CN','HK','KR','PH']],['WeChat Pay',.014,['CN']],['Card',.015,['GB','AU','US','JP','DE','FR','TW','SG']],['DuitNow QR',0,['MY','BN','SG']]];
const MITEMS = [['Kuih box (6 pieces)',889,'pr_kuih'],['Woven basket, small',3000,'pr_basket'],['Kuih cincin (pack)',600,'pr_cincin'],['Dastar headcloth',12000,'pr_dastar'],['Woven placemat',1500,'pr_mat'],['Beaded bracelet',1200,'pr_beads'],['Hinava (portion)',800,'pr_hinava'],['Sabah tea, bottled',500,'pr_tea']];
const MTXS = (()=>{ const out=[]; for(let d=LAST-89; d<=LAST; d++){ const w=dow(d); let n = w===0 ? 34+((d*13)%9) : w===6 ? 14+((d*5)%5) : 8+((d*7)%5);
  if(d===LAST) n=Math.max(1,Math.round(n*TODAY_FRAC*1.05));
  for(let j=0;j<n;j++){ const p=wpick(MPAY,x=>({'Alipay+':38,'WeChat Pay':14,'Card':26,'DuitNow QR':22})[x[0]]);
    const items=[pick(MITEMS)]; if(rnd()<.5) items.push(pick(MITEMS.filter(x=>x[1]<1300))); if(rnd()<.18) items.push(pick(MITEMS));
    const gross=items.reduce((a,x)=>a+x[1],0), pass=p[0]!=='DuitNow QR'&&rnd()<.62, disc=pass?Math.round(gross*.10):0, amt=gross-disc, fee=Math.round(amt*p[1]);
    const end = d===LAST ? NOWMIN-5 : (w===0?13*60:18*60); const t = d===LAST ? Math.round(7*60+(end-7*60)*(j+.5)/n) : (w===0? 6*60+30+ri(0,end-6*60-30) : 9*60+ri(0,end-9*60));
    out.push({d, t:tstr(t), ref:'MP-'+code(7), m:p[0], cc:pick(p[2]), items:items.map(x=>x[0]), gross, disc, amt, fee, net:amt-fee, pass, st:'Paid'}); } }
  /* the Lin family's purchase from the storyboard */
  out.push({d:LAST, t:'15:02', ref:'MP-LIN35K', m:'Alipay+', cc:'CN', items:['Kuih box (6 pieces)','Woven basket, small'], gross:3889, disc:389, amt:3500, fee:49, net:3451, pass:true, st:'Paid', lin:true});
  return out.sort((a,b)=>b.d-a.d||b.t.localeCompare(a.t)); })();
const MREFUNDS = [];   // {ref, amt, fee, day}
const mPaid = x => x.st==='Paid';
function payouts(){ const out=[]; let pend=[];
  for(let d=LAST-89; d<=LAST+1; d++){ if(isBiz(d) && pend.length){ const tx=MTXS.filter(x=>pend.includes(x.d)&&mPaid(x)); const rf=MREFUNDS.filter(r=>pend.includes(r.day)&&r.afterPayout);
      out.push({d, covers:pend.slice(), n:tx.length, amt:tx.reduce((a,x)=>a+x.amt,0), fee:tx.reduce((a,x)=>a+x.fee,0), refunds:rf.reduce((a,r)=>a+r.amt-r.fee,0), net:tx.reduce((a,x)=>a+x.net,0)-rf.reduce((a,r)=>a+r.amt-r.fee,0), ref:'PO-'+String(880000+d*11), st:d>LAST?'Scheduled':'Paid'}); pend=[]; }
    if(d<=LAST) pend.push(d); }
  return out.reverse(); }
function isBiz(d){ const w=dow(d); return w!==0 && w!==6; }
const nextPayout = () => payouts()[0];
const MRATE = [2,3,9,36,162];   // 1 to 5 stars
const mRating = () => (MRATE.reduce((a,v,i)=>a+v*(i+1),0)/MRATE.reduce((a,b)=>a+b,0));
let MREV = [['Chen Jing',MI.CN,5,'2 hours ago','The kuih was still warm. Paying with Alipay was easy.',''],['Jack Wilson',MI.AU,4,'Yesterday','Beautiful baskets. Wish there were more sizes.',''],['Lee Seo-yeon',MI.KR,5,'2 days ago','Found the stall through Bella AI. Lovely dastar.','Terima kasih! Come back on Sunday for the tamu.'],['Camille Martin',MI.FR,5,'4 days ago','Kind owner, fair prices, real handicrafts.','Merci beaucoup!']];
/* Puan Aminah in the platform directory, from her own ledger */
(()=>{ const a=MERCH[0]; const tx=MTXS.filter(x=>x.d>LAST-30&&mPaid(x)); a.gmv=tx.reduce((s,x)=>s+x.amt,0); a.tx=tx.length; a.r=mRating().toFixed(1); a.joined=LAST-89; })();
