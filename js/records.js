/* =====================================================================
   RECORDS · travellers, merchants, support, audit · roles · shell · landing
   ===================================================================== */
const MYT = 'MYT';
const opDate = () => `${fmtD(LAST,{weekday:'short',day:'numeric',month:'short',year:'numeric'})}, ${HHMM} ${MYT}`;
const tstr = m => pad2(Math.floor(m/60))+':'+pad2(m%60);
const agLogo = (r,sz=32) => `<img src="${r.logo==='SG'?LOGO.emblem:LOGO[r.logo]}" alt="${esc(r.name)} logo" style="max-width:${sz}px;max-height:${sz}px">`;

/* ---------- traveller parties (one Digital Tourist Pass per party, one status per member) ---------- */
const NAMES = {CN:['Wang Lei','Li Na','Zhang Wei','Chen Jing','Liu Yang','Zhao Min','Huang Xin'],KR:['Kim Min-jun','Park Ji-woo','Lee Seo-yeon','Choi Hyun-woo'],BN:['Awang Hj Ismail','Siti Nurhayati','Mohd Hafiz','Nur Amalina'],PH:['Maria Santos','Jose Reyes','Angela Cruz'],TW:['Lin Yu-ting','Huang Chih-wei','Chang Mei'],ID:['Putri Ayu','Budi Santoso','Rina Wijaya'],JP:['Sato Yuki','Tanaka Haruto','Suzuki Aoi'],HK:['Wong Ka-ho','Chan Wing-yan'],SG:['Tan Wei Ming','Lim Hui Ling'],AU:['Olivia Brown','Jack Wilson','Chloe Taylor'],GB:['Emma Johnson','Oliver Smith','Amelia Clarke'],US:['Ava Miller','Noah Davis'],DE:['Lukas Weber','Lena Fischer'],NL:['Sanne de Vries','Daan Bakker'],FR:['Camille Martin','Hugo Bernard'],OT:['Sofia Rossi','Arjun Mehta','Mateo Silva']};
const CHILD = ['Mei','Leo','Ana','Yuki','Sam','Noor','Min','Ella'];
const flightsOf = c => FLIGHTS.filter(f=>f.cp===c);
function mkParty(i, o){
  const m=o.m, M=MKT[m], C=CP[o.c], lead=o.name||pick(NAMES[M[0]]);
  const members=[{n:lead, age:ri(26,60)}]; const adults=o.adults??(1+(rnd()<.4?1:0)), kids=o.kids??(rnd()<.22?ri(1,2):0);
  for(let a=1;a<adults;a++) members.push({n:pick(NAMES[M[0]]).split(' ')[0]+' '+lead.split(' ').slice(-1)[0], age:ri(24,60)});
  for(let k=0;k<kids;k++) members.push({n:pick(CHILD)+' '+lead.split(' ').slice(-1)[0], age:ri(2,11)});
  const paying=members.filter(x=>x.age>=12).length;
  const st=o.st, unpaid=st==='Unpaid';
  members.forEach(x=>x.st = x.age<12 ? 'Exempt' : unpaid ? 'Unpaid' : 'Paid');
  const fl = C.mode==='air' && o.arr===LAST ? (o.flight || pick(flightsOf(o.c).filter(f=>f.arrived)) ) : null;
  return Object.assign({ i, pass:'SGP-'+code(6), name:lead, members, paying, m, cc:M[0], ctry:M[1], cp:C, c:o.c, flight:fl, arr:o.arr, dep:o.dep, st,
    due:paying*TEC_SEN, amt:unpaid?0:paying*TEC_SEN, rail: unpaid?null:o.rail||RAIL[wpick([0,1,2,3,4],j=>RAILMIX[M[0]][j])][0], chan: o.chan||(rnd()<.07?'Web':'App'),
    pp: '••••'+ri(1000,9999), mdac:'MDAC-'+code(8), tec:'TEC-'+ri(10000000,99999999), paidOn:o.paidOn??(o.arr-ri(1,6)), paidAt:o.paidAt||tstr(ri(8*60,23*60)),
    arrAt: fl ? fl.time : tstr(ri(7*60, Math.max(7*60+5, o.arr===LAST?NOWMIN-10:22*60))), spend:(st==='In Sabah'||st==='Departed')?Math.round(M[5]*100*(.3+rnd()*.9)):0 }, o.extra||{});
}
const linFlight = FLIGHTS.find(f=>f.lin);
const TRAV = [];
TRAV.push(mkParty(0,{m:MI.CN,c:0,name:'Lin Wei',adults:2,kids:0,st:'In Sabah',arr:LAST,dep:LAST+4,paidOn:LAST-1,paidAt:'21:42',rail:'Alipay+',chan:'App',flight:linFlight}));
TRAV[0].members=[{n:'Lin Wei',age:38,st:'Paid'},{n:'Chen Yu',age:36,st:'Paid'},{n:'Xiaomei Lin',age:8,st:'Exempt'}]; Object.assign(TRAV[0],{pass:'SGP-7F3K91',pp:'••••4821',paying:2,due:10000,amt:10000,arrAt:'13:12',spend:3500});
TRAV.push(mkParty(1,{m:MI.OT,c:0,name:'Sofia Rossi',adults:1,kids:0,st:'In Sabah',arr:LAST,dep:LAST+6,paidOn:LAST,paidAt:'14:05',rail:'Kiosk or counter card',chan:'Kiosk',extra:{kioskNote:'Reached the counter unpaid at 13:58, paid at kiosk KKIA-K07 at 14:05'}}));
TRAV[1].arrAt='14:09';
CP.forEach((C,c)=>{ for(let u=0;u<STILL_UNPAID[c];u++){ const m=wpick(MKT.map((_,j)=>j),j=>CPMIX[c][j]); TRAV.push(mkParty(TRAV.length,{m,c,st:'Unpaid',arr:LAST,dep:LAST+5,adults:1,kids:0,extra:{arrAt:tstr(NOWMIN-ri(2,9))}})); } });
while(TRAV.length<74){ const m=wpick(MKT.map((_,j)=>j),j=>MKT[j][2]); const c=wpick(CP.map((_,j)=>j),j=>CP[j].share*CPMIX[j][m]);
  const st=wpick(['In Sabah','Pre-arrival','Departed'],s=>({'In Sabah':58,'Pre-arrival':24,'Departed':18})[s]);
  const stay=Math.max(1,Math.round(MKT[m][4]*(.6+rnd()*.8))); const arr = st==='Pre-arrival'?LAST+ri(1,9):st==='Departed'?LAST-ri(stay+1,stay+14):LAST-ri(0,Math.max(0,stay-1));
  TRAV.push(mkParty(TRAV.length,{m,c,st,arr,dep:arr+stay,paidOn:st==='Pre-arrival'?LAST-ri(0,5):arr-ri(0,6)})); }
/* a few in Sabah past their declared departure (changed flights), stable */
TRAV.filter(t=>t.st==='In Sabah'&&t.i>3).slice(0,5).forEach((t,k)=>{ t.dep=LAST-[1,2,4,6,9][k]; t.arr=Math.min(t.arr,t.dep-2); });
TRAV.forEach(t=>{ if(t.arr<LAST) t.flight=null; });

/* ---------- merchants (platform directory) ---------- */
const MCAT = {food:'Food', tour:'Tours & activities', stay:'Accommodation', trans:'Transport', retail:'Handicrafts & retail'};
const MERCH = [
 ['Kuih & Kraf Aminah','retail','Kota Belud'],['Kedai Kopi Fatt Kee','food','Kota Kinabalu'],['Welcome Seafood Restaurant','food','Kota Kinabalu'],['Filipino Market Grill Stall 12','food','Kota Kinabalu'],
 ['Semporna Island Hopping Co.','tour','Semporna'],['Borneo Divers Mabul','tour','Semporna'],['Sukau River Lodge Tours','tour','Kinabatangan'],['Kundasang Highland Tours','tour','Ranau'],['Mari-Mari Cultural Village','tour','Penampang'],['Kinabalu Mountain Guides','tour','Ranau'],
 ['Shangri-La Tanjung Aru','stay','Kota Kinabalu'],['Homestay Kg Mesilau','stay','Ranau'],['Kapalai Dive Resort','stay','Semporna'],['Pine Resort Kundasang','stay','Ranau'],['Sepilok Forest Edge','stay','Sandakan'],
 ['Jesselton Point Ferry','trans','Kota Kinabalu'],['Airport Express Bus','trans','Kota Kinabalu'],['Tawau Semporna Shuttle','trans','Tawau'],
 ['Gaya Street Crafts','retail','Kota Kinabalu'],['Sabah Tea Garden Shop','retail','Ranau'],['Borneo Pearl Gallery','retail','Kota Kinabalu'],['Rungus Beads Kudat','retail','Kudat'],
].map((m,i)=>({ n:m[0], cat:m[1], loc:m[2], id:'SGM-'+(10200+i*37), gmv:Math.round((m[1]==='stay'?380000:m[1]==='tour'?160000:m[1]==='trans'?120000:42000)*(.5+rnd())*100), tx:ri(180,3900), r:(4.3+rnd()*.6).toFixed(1), st:i===7?'Suspended':i===18?'Under review':'Active', why:i===7?'Unlicensed guides reported by Sabah Parks':'', joined:LAST-ri(10,165), tier:m[1]==='stay'||m[1]==='tour'?'Licensed operator':i===0?'Micro trader (MyKad verified)':'SME' }));
const MNET = (()=>{ let active=2640; const base=[520,410,362,330,301,288,270]; return MONTHKEYS.map((k,i)=>{ const part = i===MONTHKEYS.length-1 ? dayUTC(LAST).getUTCDate()/daysInMonthKey(k) : 1;
  const apps=Math.round((base[i]||280)*1.12*part), rej=Math.round(apps*.07), pend = i===MONTHKEYS.length-1 ? 6 : 0, appr=apps-rej-pend, susp=Math.round(appr*.03), closed=Math.round(active*.004*part);
  active += appr - susp - closed; return {k, apps, appr, rej, pend, susp, closed, active}; }); })();
const ACTIVE_MERCH = MNET[MNET.length-1].active;
let APPS = [
 {n:'Kedai Runcit Hjh Aminah', cat:'retail', loc:'Kota Belud', who:'Hjh Aminah Binti Sulaiman', h:2, docs:[1,1,1,0], risk:'Low', micro:false},
 {n:'Mabul Sea Nomad Tours', cat:'tour', loc:'Semporna', who:'Abdul Rahim Jumadil', h:5, docs:[1,1,0,1], risk:'Medium', note:'MOTAC tour licence number does not match the registry'},
 {n:'Tip of Borneo Café', cat:'food', loc:'Kudat', who:'Vivian Lo', h:26, docs:[1,1,1,1], risk:'Low'},
 {n:'Kinabatangan Jungle Camp', cat:'stay', loc:'Kinabatangan', who:'Rosnah Ahmad', h:31, docs:[1,1,1,1], risk:'Low'},
 {n:'Sapi Island Watersports', cat:'tour', loc:'Kota Kinabalu', who:'Jeffery Sinsua', h:52, docs:[1,0,1,1], risk:'Medium', note:'Bank account name differs from the SSM registration'},
 {n:'Tenom Coffee House', cat:'food', loc:'Tenom', who:'Liew Kok Wah', h:70, docs:[1,1,1,1], risk:'Low'},
];
const DOCS = ['Business registration (SSM, or MyKad for micro traders)','Bank account verification','Premises or trading licence','MOTAC licence (tours and stays)'];

/* ---------- support ---------- */
const TICKETS = [
 {id:'SUP-20931', s:'Charged twice for TEC', who:'Kim Min-jun', m:MI.KR, ch:'Bella AI handoff', pr:'High', st:'Open', age:14, sla:30, sum:'Two card authorisations 40 seconds apart, one captured. Suggested: void the second authorisation and confirm by push.', msg:'I think I paid the entry contribution twice. Can you check?'},
 {id:'SUP-20928', s:'Pass not showing after payment', who:'Li Na', m:MI.CN, ch:'In-app chat', pr:'High', st:'Open', age:31, sla:30, sum:'Alipay+ payment succeeded at 14:49; pass issue job retried twice. Suggested: reissue the pass from the TEC record.', msg:'I paid with Alipay but the pass page is empty.'},
 {id:'SUP-20922', s:'Refund for cancelled trip', who:'Maria Santos', m:MI.PH, ch:'Email', pr:'Medium', st:'Waiting on traveller', age:128, sla:240, sum:'Trip cancelled 3 days before arrival. Needs proof of cancellation before a refund is raised to Finance.', msg:'Our flight was cancelled. Can I get my RM 50 back?'},
 {id:'SUP-20917', s:'Wrong passport number on pass', who:'Oliver Smith', m:MI.GB, ch:'Bella AI handoff', pr:'Medium', st:'Open', age:186, sla:240, sum:'MRZ scan misread one digit. Suggested: correct from a new passport scan; MDAC match will then succeed.', msg:'My pass shows a different passport number.'},
 {id:'SUP-20904', s:'Merchant QR declined Alipay+', who:'Gaya Street Crafts', m:null, ch:'Merchant line', pr:'Medium', st:'Escalated', age:302, sla:240, sum:'Acquirer returned error 05 for 3 Alipay+ payments. Escalated to the acquirer.', msg:'Tourists say Alipay is not working at my stall.'},
 {id:'SUP-20899', s:'Is my child exempt?', who:'Sato Yuki', m:MI.JP, ch:'In-app chat', pr:'Low', st:'Resolved', age:355, sla:480, sum:'Child aged 9, exemption applied automatically from date of birth.', msg:'Does my 9-year-old need to pay?'},
];
const BELLA = DAY.map((o,d)=>{ const conv=Math.round((STOCK[d]*0.42 + o.n*0.9)*(d===LAST?TODAY_FRAC:1)); const resolved=Math.round(conv*.872); return {conv,resolved,handoff:conv-resolved,csatN:Math.round(conv*.31),csat:4.5+((d*7)%10)/100}; });
const AUDIT = [
 ['15:02','Puan Aminah','Merchant','Payment received','RM 35.00 · Sabah GO QR · pass-holder deal'],
 ['14:05','System','System','Kiosk payment','KKIA-K07 · 1 traveller · RM 50.00'],
 ['13:12','Counter 7 officer','Immigration','Pass verified','SGP-7F3K91 · Paid ×2 · Exempt ×1'],
 ['10:12','Siti Mariam Yusof','Finance','Approved refund','TEC-58160077 · RM 50.00 · duplicate charge'],
 ['09:42','Aisyah Rahman','Ops','Approved merchant','Kopi Tenom Corner · SGM-11042'],
 ['09:30','System','System','Daily reconciliation','Yesterday: 100% reconciled, 0 exceptions'],
 ['08:12','System','System','Rate table check','TEC rules v2.0 · RM 50, under 12 exempt'],
 ['07:55','Nurul Aqilah','Tourism','Sent official alert','Weather advisory · Kinabalu Park · 1,860 delivered'],
];

/* ---------- portals ---------- */
const ROLES = {
 ops:{ name:'Sabah GO Operations', short:'Operations', who:'Platform operator', img:'p_ops', logo:'SG',
   maker:['Aisyah Rahman','Operations Lead'], checker:['Daniel Tan','Head of Operations'],
   desc:'System health, payment success, travellers, merchants and support for the whole platform.',
   nav:[['Monitor',[['overview','Command centre','home'],['travellers','Travellers','users'],['tec','TEC payments','ticket']]],
        ['Ecosystem',[['merchants','Merchants','store'],['support','Bella AI & support','spark']]],
        ['Back office',[['settlement','Settlement','bank'],['system','System & audit','server']]],
        ['Reporting',[['reports','Reports','file']]]] },
 tourism:{ name:'KePKAS', short:'Ministry of Tourism, Culture & Environment', who:'Kementerian Pelancongan, Kebudayaan dan Alam Sekitar Sabah', img:'p_tourism', logo:'KEP',
   maker:['Nurul Aqilah','Principal Assistant Secretary'], checker:['Faridah Ismail','Deputy Secretary (Tourism)'],
   desc:'Arrivals, source markets, where visitors go and spend, destination capacity and official alerts.',
   nav:[['Insights',[['overview','Tourism overview','home'],['movement','Visitor movement','pin'],['markets','Source markets','globe'],['destinations','Destinations & capacity','mount']]],
        ['Economy',[['spending','Visitor spending','wallet'],['events','Events & campaigns','cal']]],
        ['Reach',[['alerts','Official alerts','alertsend'],['sentiment','Visitor sentiment','smile']]],
        ['Reporting',[['reports','Reports','file']]]] },
 finance:{ name:'Ministry of Finance Sabah', short:'TEC Revenue', who:'Kementerian Kewangan Sabah', img:'p_finance', logo:'MOF',
   maker:['Hafiz Mansor','Revenue Accountant'], checker:['Siti Mariam Yusof','Accountant, Revenue Division'],
   desc:'Live TEC revenue, settlement into the State account, reconciliation, refunds and audit reports.',
   nav:[['Revenue',[['overview','Live revenue','home'],['collections','Collections','receipt'],['recon','Reconciliation','refresh'],['channels','Payment channels','card']]],
        ['Controls',[['refunds','Refunds & exemptions','shield']]],
        ['Reporting',[['reports','Reports & statements','file']]]] },
 immigration:{ name:'Immigration Sabah', short:'TEC Compliance', who:'Jabatan Imigresen Malaysia, Negeri Sabah', img:'p_immigration', logo:'IMM',
   maker:['Rahman Yusof','Checkpoint Supervisor, KKIA'], checker:['Jessica Lajim','Assistant Director, Control'],
   desc:'TEC status at every counter: compliance by entry point and flight, pass checks and exceptions.',
   nav:[['Operations',[['overview','Entry overview','home'],['flights','Flights today','plane'],['verify','Pass check','scan'],['checkpoints','Checkpoints & kiosks','kiosk']]],
        ['Compliance',[['exceptions','Exceptions','alert'],['departures','Stay & departures','exit']]],
        ['Reporting',[['reports','Reports','file']]]] },
 merchant:{ name:'Merchant app', short:'Kuih & Kraf Aminah', who:'Puan Aminah · Tamu Kota Belud', img:'p_merchant', logo:'SG',
   maker:['Puan Aminah','Owner'], checker:['Rosli Abdullah','Son, helper'],
   desc:'Daily sales from Sabah GO QR, payouts to the bank, products, pass-holder deals and reviews.',
   nav:[['Business',[['overview','Today','home'],['transactions','Transactions','receipt'],['payouts','Payouts','bank']]],
        ['Grow',[['products','Products','basket'],['promos','Pass deals','mega'],['reviews','Reviews','star']]],
        ['Stall',[['qr','QR & helpers','qr']]],
        ['Reporting',[['reports','Reports','file']]]] },
};
const S = { role:null, page:null, range:'today', f:{}, actAs:'maker' };
let TIMERS = [];
const PAGES = {};
const RANGES = [['today','Today'],['last7','7 days'],['last30','30 days'],['mtd','Month'],['live','Since go-live']];
const RR = () => PERIODS[S.range].r();
const rangeL = () => PERIODS[S.range].l;
const prevRange = ([a,b]) => [a-(b-a+1), a-1];
const hasPrev = ([a,b]) => a-(b-a+1) >= 0;

function go(role, page){ location.hash = role ? `${role}/${page||'overview'}` : ''; }
function route(){
  const [r,p,q] = location.hash.replace('#','').split('/');
  TIMERS.forEach(clearInterval); TIMERS=[]; closeAll();
  document.documentElement.style.setProperty('--bgimg', bg('appbg'));
  if(r==='command'){ S.role=null; renderCommand(); return; }
  if(!r || !ROLES[r]) { S.role=null; renderPicker(); return; }
  if(S.role!==r){ S.f={}; S.actAs='maker'; }
  S.role=r; S.page = (PAGES[r] && PAGES[r][p]) ? p : 'overview'; S.q = q||null;
  renderShell();
}
window.addEventListener('hashchange', route);

/* ---------- landing: the Lin family's trip is the way into each portal ---------- */
const JOURNEY = [
 {t:'Yesterday 21:42', b:'Paid TEC in the app', s:'RM 100 · Xiaomei, 8, exempt', go:['finance','overview'], who:'Ministry of Finance', d:'The RM 100 appears in TEC collections the moment it is paid, credited straight to the State collection account.'},
 {t:'Today 13:12', b:'One scan at KKIA', s:'Paid ×2 · Exempt ×1', go:['immigration','verify'], who:'Immigration Sabah', d:'The officer scans the pass and sees TEC status only: no spending or location data.'},
 {t:'Today 14:05', b:'A visitor pays at a kiosk', s:'RM 50 · under a minute', go:['immigration','flights'], who:'Immigration and Finance', d:'Status changes from Unpaid to Paid; Finance sees a new RM 50 payment from KKIA kiosk K07.'},
 {t:'Today 13:40', b:'Bella AI plans 3 days', s:'Sepilok, Kinabatangan, Kundasang', go:['tourism','movement'], who:'KePKAS', d:'KePKAS sees where visitors go by district, anonymised, from visitors who allow location.'},
 {t:'Today 15:02', b:'Pays Puan Aminah', s:'RM 35 with the pass-holder deal', go:['merchant','overview'], who:'Merchant', d:'Puan Aminah gets the payment straight to her bank account, paid out tomorrow.'},
 {t:'Every hour', b:'Settled and reconciled', s:'Ledger, acquirer and bank match', go:['finance','recon'], who:'Ministry of Finance', d:'Transactions, acquirer reports and bank credits are matched every day. Yesterday: 100% reconciled.'},
];
let JSEL = 0;
function renderPicker(){
  $('#shell').style.display='none'; $('#picker').style.display='block'; document.title='Sabah GO Console';
  const live=dsum(0,LAST), rec=RECON[RECON.length-1];
  $('#picker').innerHTML = `<header class="lp-top"><div class="lp-photo"><div style="--heroimg:${bg('hero')}"></div></div><div class="lp-scrim"></div>
  <div class="lp">
    <nav class="lp-nav"><span class="lp-logo"><img src="${LOGO.full}" alt="Sabah GO, Your Journey Enriched"><span><b>Sabah GO Console</b><small>Sabah State Government</small></span></span>
      <span class="meta hide-sm">${fmtD(LAST,{weekday:'short',day:'numeric',month:'short',year:'numeric'})}, <span data-clock>${HHMM}:00</span> ${MYT}<br>Sample data</span></nav>
    <div class="lp-hero"><div><h1>Every ringgit traced.</h1>
      <p>One platform for the Tourist Entry Contribution: the visitor app, collection, and a dashboard for each ministry, hosted in Malaysia.</p>
      <div class="lp-actions"><button class="btn btn-w" onclick="document.getElementById('portals').scrollIntoView({behavior:'smooth'})">${ic('lock')}Sign in to a portal</button></div></div>
      <div class="lp-stats">
        <div class="lp-stat"><b data-static>${fmtN(DECK_TOTAL_2025)}</b><span>international visitors in 2025 (Sabah GO deck)</span></div>
        <div class="lp-stat"><b>${fmtN(IN_SABAH)}</b><span>pass holders in Sabah now</span></div>
        <div class="lp-stat"><b>${senK(live.gr)}</b><span>TEC collected since go-live</span></div>
        <div class="lp-stat"><b>${rec.variance===0?'100%':'Exception'}</b><span>reconciled yesterday</span></div>
      </div></div>
  </div></header>
  <div class="lp lp-body">
    <section class="lp-sec" id="portals" style="margin-top:0"><h2>Sign in</h2><p>Choose your portal. Each one shows only what that role needs.</p></section>
    <div class="lp-grid">${pcard('app',APP_PORTAL)}${Object.entries(ROLES).map(([k,r])=>pcard(k,r)).join('')}${pcard('command',COMMAND_PORTAL)}</div>
    ${flowTree()}
    <footer class="lp-foot"><b>Sabah GO. Your Journey Enriched.</b><img class="lp-partner" src="/img/logos/microtek-solutions.png" alt="Microtek Solutions: Innovate, Integrate, Inspire"><span>Sample data, labelled as such. Names and records are fictitious.</span></footer>
  </div>`;
}
/* the visitor app and the command centre sit beside the ministry portals as their own sign-ins */
const APP_PORTAL = {name:'Sabah GO visitor app', who:'Travellers · iOS and Android', img:'p_app', logoSrc:'/img/logo_mark.webp', tag:'Mobile app',
  desc:'The traveller app: pay TEC, get the digital pass, plan with Bella AI, scan and pay, rewards and help.',
  maker:['Emma Johnson','emma.johnson@mail.com']};
const COMMAND_PORTAL = {name:'State command centre', who:'All ministries together', img:'p_command', logo:'SG',
  desc:'KePKAS, Finance, Immigration and Operations on one wall, each showing only what its role needs.',
  maker:['State Secretary\'s office','Command centre duty officer']};
const portalOf = k => k==='app' ? APP_PORTAL : k==='command' ? COMMAND_PORTAL : ROLES[k];
const portalLogo = (r,sz=44) => r.logoSrc ? `<img src="${r.logoSrc}" alt="${esc(r.name)} logo" style="max-width:${sz}px;max-height:${sz}px">` : agLogo(r,sz);
const pcard = (k,r) => `<button class="pcard ${k==='app'?'app':''}" onclick="enter('${k}')"><div class="pcover" style="background-image:${bg(r.img)}"></div>${r.tag?`<span class="tagline">${r.tag}</span>`:''}<span class="pcrest">${portalLogo(r,44)}</span>
  <div class="pbody"><div class="who">${r.who}</div><h3>${r.name}</h3><p>${r.desc}</p><span class="go">Sign in ${ic('chev')}</span></div></button>`;

/* ---------- sign-in (prototype: any credentials work; real sign-in and 2FA need the backend) ---------- */
const SIGNED = (()=>{ try{ return new Set(JSON.parse(sessionStorage.getItem('sg_signed')||'[]')); }catch(e){ return new Set(); } })();
const saveSigned = () => { try{ sessionStorage.setItem('sg_signed', JSON.stringify([...SIGNED])); }catch(e){} };
const slug = n => n.toLowerCase().replace(/[^a-z ]/g,'').trim().replace(/ +/g,'.');
function openPortal(k, page){ if(k==='app'){ location.href='/app/'; return; } if(k==='command'){ location.hash='command'; return; } go(k, page); }
function enter(k, page){ if(SIGNED.has(k)) openPortal(k, page); else signIn(k, page); }
function signIn(k, page){
  const r=portalOf(k), isApp=k==='app', user=r.maker||['',''];
  const id = isApp ? user[1] : `${slug(user[0])}@${k==='command'?'sabah':k}.sabah.gov.my`;
  modal(isApp?'Sign in to the visitor app':'Sign in', isApp?'Opens the Sabah GO traveller app with a sample traveller account.':r.who,
    `<form class="signin" onsubmit="event.preventDefault();doSignIn('${k}','${page||''}')">
      <div class="sh"><span class="agl">${portalLogo(r,38)}</span><div><b>${r.name}</b><small>${isApp?'Traveller account':'Signed in as '+esc(user[0])+(user[1]?', '+esc(user[1]):'')}</small></div></div>
      <label class="field">${isApp?'Email or phone':'Work email'}<input id="siId" autocomplete="username" value="${esc(id)}"></label>
      <label class="field">Password<input id="siPw" type="password" autocomplete="current-password" value="sabahgo-demo"><span class="err" id="siErr" hidden></span></label>
      <button class="btn btn-p sso" type="submit">${ic('lock')}${isApp?'Sign in and open the app':'Sign in'}</button>
      ${isApp?'':`<div class="alt">or</div><button class="btn btn-s sso" type="button" onclick="doSignIn('${k}','${page||''}')">${ic('shield')}Sabah Government single sign-on</button>`}
      <p class="demo">Prototype: the sample account is filled in.${isApp?'':' Two-factor authentication is added with the backend.'}</p>
    </form>`, `<button class="btn btn-s" onclick="closeAll()">Cancel</button>`);
}
function doSignIn(k, page){
  const id=$('#siId').value.trim(), pw=$('#siPw').value, e=$('#siErr');
  if(!id || !pw){ e.textContent='Enter your '+(k==='app'?'email or phone':'work email')+' and password'; e.hidden=false; return; }
  SIGNED.add(k); saveSigned(); closeAll(); openPortal(k, page);
}
function signOut(){ SIGNED.delete(S.role); saveSigned(); toast('Signed out of '+ROLES[S.role].name,'lock'); go(); }
const jdetail = () => { const j=JOURNEY[JSEL]; return `<span class="ic">${ic('eye')}</span><div class="grow"><b>${j.who} sees</b><div class="small" style="color:var(--ink2)">${j.d}</div></div><button class="btn btn-p btn-sm" onclick="enter('${j.go[0]}','${j.go[1]}')">Open in ${j.who.split(' and ')[0]} ${ic('chev')}</button>`; };
function pickJ(i){ JSEL=i; document.querySelectorAll('.jstep').forEach((b,k)=>b.classList.toggle('on',k===i)); $('#jdetail').innerHTML=jdetail(); }

function renderShell(){
  const R = ROLES[S.role];
  $('#picker').style.display='none'; $('#shell').style.display='block';
  const flat = R.nav.flatMap(g=>g[1]); const cur = flat.find(n=>n[0]===S.page);
  document.title = `${cur[1]} · ${R.name} · Sabah GO`;
  const user = S.actAs==='checker' ? R.checker : R.maker; const counts = navCounts();
  $('#side').innerHTML = `<div class="brand"><span class="em"><img src="${LOGO.emblem}" alt=""></span><div><b>Sabah GO</b><small>Government console</small></div></div>
    <div class="agency"><span class="agl">${agLogo(R)}</span><div><b>${R.name}</b><span>${R.short}</span></div></div>
    <nav class="nav" aria-label="${esc(R.name)}">${R.nav.map(([g,items])=>`<div class="grp">${g}</div>${items.map(([k,l,i])=>`<a href="#${S.role}/${k}" class="${k===S.page?'on':''}">${ic(i)}${l}${counts[k]?`<span class="cnt">${counts[k]}</span>`:''}</a>`).join('')}`).join('')}<div class="grp">Elsewhere</div><a href="#command">${ic('g_command')}State command centre</a><a href="/app/">${ic('phone')}Visitor app</a><a href="#">${ic('swap')}Switch portal</a></nav>
    <div class="me">${av(user[0])}<div class="grow" style="min-width:0"><b>${user[0]}</b><small>${user[1]}</small></div><button onclick="signOut()" aria-label="Sign out" title="Sign out">${ic('exit')}</button></div>`;
  const showRange = S.page==='overview';
  $('#top').innerHTML = `<button class="ibtn menu" onclick="$('#side').classList.add('open');$('#scrim').classList.add('on')" aria-label="Open menu">${ic('menu')}</button>
    <div class="grow"><div class="crumb">${R.who}</div><h1>${cur[1]}</h1></div>
    ${showRange?`<div class="seg" role="group" aria-label="Period">${RANGES.map(([k,l])=>`<button class="${S.range===k?'on':''}" onclick="setRange('${k}')">${l}</button>`).join('')}</div>
      <label class="field rsel"><select aria-label="Period" onchange="setRange(this.value)">${RANGES.map(([k,l])=>`<option value="${k}" ${S.range===k?'selected':''}>${l}</option>`).join('')}</select></label>`:''}
    <div class="simdate"><b>${fmtD(LAST,{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</b><span class="row" style="gap:6px;justify-content:flex-end"><span class="dotlive"></span>Live · <span data-clock>${HHMM}:00</span> ${MYT}</span></div>
    <span class="sample hide-sm">Sample data</span>
    ${['ops','immigration','finance'].includes(S.role)?`<label class="srch">${ic('search')}<input aria-label="Search passes" placeholder="Pass ID or name" onkeydown="if(event.key==='Enter')globalSearch(this.value)"></label>`:''}
    <button class="ibtn" onclick="notifs()" aria-label="Notifications">${ic('bell')}${notifList().length?'<span class="pip"></span>':''}</button>`;
  $('#content').innerHTML = `<div class="fade">${PAGES[S.role][S.page]()}</div>`;
  window.scrollTo(0,0);
  const after = PAGES[S.role]['_'+S.page]; if(after) after();
}
function rerender(){ const y=window.scrollY; $('#content').innerHTML = `<div>${PAGES[S.role][S.page]()}</div>`; window.scrollTo(0,y); const after = PAGES[S.role]['_'+S.page]; if(after) after(); }
function setRange(k){ S.range=k; renderShell(); }
function navCounts(){ const c={};
  if(S.role==='ops'){ c.merchants=APPS.length; c.support=TICKETS.filter(t=>t.st!=='Resolved').length; }
  if(S.role==='immigration'){ c.exceptions=EXC.filter(e=>!e.done).length; c.flights=FLIGHTS.filter(f=>!f.arrived&&f.cp===0).length; }
  if(S.role==='finance'){ c.refunds=FREFUNDS.length; }
  if(S.role==='merchant'){ c.reviews=MREV.filter(r=>!r[5]).length; }
  const pend=(RHIST[S.role]||[]).filter(h=>h.status==='Pending approval').length; if(pend) c.reports=pend; return c; }
function globalSearch(q){ q=q.trim(); if(!q) return;
  const t=TRAV.find(x=>x.pass.toLowerCase()===q.toLowerCase()||x.name.toLowerCase().includes(q.toLowerCase())||x.members.some(mm=>mm.n.toLowerCase().includes(q.toLowerCase())));
  if(t){ if(S.role==='immigration'){ verifyLookup(t.pass); return; } openTrav(t.i); return; }
  toast(`No pass or traveller matches “${esc(q)}”. Try SGP-7F3K91.`,'search'); }
function notifList(){ const r=S.role; const L=[];
  if(r==='ops'){ const late=TICKETS.filter(t=>t.st!=='Resolved'&&t.age>t.sla); if(late.length) L.push(['spark','t-red',`${plural(late.length,'ticket')} past response target`,late.map(t=>t.id).join(', ')]); if(APPS.length) L.push(['store','',`${plural(APPS.length,'merchant application')} waiting`,`${APPS.filter(a=>a.note).length} with document mismatches`]); }
  if(r==='tourism'){ L.push(['mount','t-amber','Sipadan permits nearly full',`${fmtN(dvis(5,LAST+1))} of 176 booked for tomorrow`]); if((RHIST.tourism||[]).some(h=>h.status==='Pending approval')) L.push(['file','','A bulletin is waiting for approval','Monthly tourism bulletin']); }
  if(r==='finance'){ const y=RECON[RECON.length-1]; L.push(['refresh',y.variance?'t-red':'t-green',y.variance?'Yesterday has a reconciliation exception':'Yesterday: 100% reconciled',`${sen(y.credited)} credited to the State account`]); if(FREFUNDS.length) L.push(['receipt','',`${plural(FREFUNDS.length,'refund')} waiting for your approval`,sen(FREFUNDS.reduce((a,x)=>a+x.amt,0))]); }
  if(r==='immigration'){ const o=EXC.filter(e=>!e.done).length; if(o) L.push(['alert','t-red',`${plural(o,'open exception')}`,'See Exceptions']); const u=FLIGHTS.filter(f=>!f.arrived&&f.cp===0); if(u.length) L.push(['plane','',`${plural(u.length,'flight')} still to arrive at KKIA`,`${fmtN(u.reduce((a,f)=>a+f.pax,0))} expected passengers`]); }
  if(r==='merchant'){ L.push(['wallet','t-green',`Payout of ${sen(nextPayout().net)} tomorrow`,'To your bank account ending 3301']); const w=MREV.filter(x=>!x[5]).length; if(w) L.push(['star','',`${plural(w,'review')} waiting for a reply`,'Replies are translated for guests']); }
  return L; }
function notifs(){ const L=notifList(); drawer('Notifications', ROLES[S.role].name, L.length?`<div class="card">${L.map(n=>li(n[0],n[1],n[2],n[3])).join('')}</div>`:'<div class="empty">Nothing needs your attention</div>'); }

/* ---------- traveller record (Ops and Immigration; Immigration sees TEC status and identity only) ---------- */
const stBadge = s => badge(s, {'In Sabah':'ok','Pre-arrival':'info','Departed':'mute','Unpaid':'bad','Paid':'ok','Exempt':'info'}[s]||'mute');
const tally = t => { const p=t.members.filter(x=>x.st==='Paid').length, e=t.members.filter(x=>x.st==='Exempt').length, u=t.members.filter(x=>x.st==='Unpaid').length; return [p?`Paid ×${p}`:'',e?`Exempt ×${e}`:'',u?`Unpaid ×${u}`:''].filter(Boolean).join(' · '); };
function openTrav(i){
  const t=TRAV[i], ops=S.role==='ops';
  const entered = t.st==='In Sabah'||t.st==='Departed';
  const steps = [
    ['MDAC submitted', t.mdac, 'done'],
    ['TEC paid', t.st==='Unpaid'?'Not paid yet. Sent to the arrival kiosk.':`${sen(t.amt)} · ${t.chan} · ${t.rail} · ${fmtD(t.paidOn)} ${t.paidAt}`, t.st==='Unpaid'?'rej':'done'],
    ['Digital Tourist Pass issued', t.st==='Unpaid'?'Issued after payment':`${t.pass} · signed, verifiable offline`, t.st==='Unpaid'?'pend':'done'],
    ['Entry verified', entered?`${t.cp.short}${t.flight?' · flight from '+t.flight.origin:''} · ${fmtD(t.arr)} ${t.arrAt}`:'Expected '+fmtD(t.arr), entered?'done':'pend'],
    ['Exit recorded', t.st==='Departed'?`${t.cp.short} · ${fmtD(t.dep)}`:'Declared departure '+fmtD(t.dep), t.st==='Departed'?'done':'pend'],
  ];
  drawer(`${t.name}`, `${t.ctry} · Pass ${t.pass}`, `
    <div class="row between"><div class="row">${av(t.name,46)}<div><b style="font-size:15px">${t.name}</b><div class="small muted">${t.members.length} on this pass · ${tally(t)}</div></div></div>${stBadge(t.st)}</div>
    <div><h5>Travellers on the pass</h5>${table([{h:'Name',v:x=>x.n},{h:'Age',r:1,v:x=>x.age},{h:'TEC',v:x=>stBadge(x.st)},{h:'Amount',r:1,v:x=>x.st==='Paid'?sen(TEC_SEN):x.st==='Exempt'?'Exempt, under 12':sen(TEC_SEN)+' due'}], t.members)}</div>
    <div><h5>Trip</h5><div class="kv"><div><small>Nationality</small><b>${t.ctry}</b></div><div><small>Passport</small><b>${t.pp}</b></div><div><small>Entry point</small><b>${t.cp.short}</b></div>
      <div><small>Arrival</small><b>${fmtD(t.arr)}</b></div><div><small>Declared departure</small><b>${fmtD(t.dep)}</b></div><div><small>TEC paid</small><b>${t.st==='Unpaid'?'Not paid':sen(t.amt)}</b></div>
      ${ops?`<div><small>Channel</small><b>${t.chan}</b></div><div><small>In-app spend</small><b>${sen(t.spend)}</b></div>`:''}</div></div>
    <div><h5>Journey</h5><div class="tl">${steps.map(s=>`<div class="st ${s[2]}"><b>${s[0]}</b><small>${s[1]}</small></div>`).join('')}</div></div>
    ${ops?'':`<p class="note">Immigration sees TEC status and identity details only. This view was logged to your user ID.</p>`}`,
    ops ? `${t.st==='Unpaid'?'':`<button class="btn btn-s" onclick="closeAll();toast('Pass re-sent to ${esc(t.name)}','send')">${ic('send')}Resend pass</button><button class="btn btn-r" onclick="refundModal(${i})">${ic('refresh')}Raise refund</button>`}`
        : `<button class="btn btn-s" onclick="closeAll();raiseExc(${i})">${ic('flag')}Raise exception</button>${t.st==='Pre-arrival'?`<button class="btn btn-p" onclick="recordEntry(${i})">${ic('check')}Record entry</button>`:''}${t.st==='In Sabah'?`<button class="btn btn-s" onclick="recordExit(${i})">${ic('exit')}Record exit</button>`:''}`);
}
function refundModal(i){ const t=TRAV[i]; closeAll(); const done=FREFUNDS.some(r=>r.ref===t.tec)||REFUNDED.has(t.tec);
  setTimeout(()=>modal('Raise a TEC refund', `${t.name} · ${t.tec} · paid ${sen(t.amt)}`, done?alertBox('warn','alert','A refund already exists for this payment','It is waiting for, or has received, Finance approval.'):`
    <label class="field">Reason<select id="rfR"><option>Duplicate charge</option><option>Trip cancelled before arrival</option><option>Wrong traveller count</option></select></label>
    <label class="field">Amount (RM)<input id="rfA" inputmode="decimal" value="${(TEC_SEN/100).toFixed(2)}"><span class="hint">Up to ${sen(t.amt)}. Returned to ${t.rail}.</span></label>
    ${alertBox('info','shield','Maker and checker','Operations raises the refund; the Ministry of Finance approves it before any money moves. Both steps are in the audit log.')}`,
    done?`<button class="btn btn-s" onclick="closeAll()">Close</button>`:`<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-p" onclick="submitRefund(${i})">Send to Finance</button>`),280); }
const REFUNDED = new Set();
function submitRefund(i){ const t=TRAV[i]; const raw=$('#rfA').value; if(!moneyOK(raw)){ fieldErr('rfA','Enter an amount like 50.00'); return; } const v=Math.round(parseFloat(raw)*100); if(v>t.amt){ fieldErr('rfA','Cannot be more than '+sen(t.amt)); return; }
  FREFUNDS.unshift({ref:t.tec, name:t.name, m:t.m, why:$('#rfR').value, amt:v, by:ROLES.ops.maker[0], at:HHMM, kind:'Refund'}); AUDIT.unshift([HHMM,ROLES.ops.maker[0],'Ops','Raised refund',`${t.tec} · ${sen(v)}`]); closeAll(); toast(`Refund of ${sen(v)} sent to the Ministry of Finance for approval`); }
