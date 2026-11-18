/* =====================================================================
   UI KIT · icons, charts, components, overlays, exports
   ===================================================================== */
/* duotone line icons (stroke + soft fill) */
const I = {
 home:['M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z','M9 21v-6h6v6z'],
 users:['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75','M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
 ticket:['M3 9a3 3 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a3 3 0 0 0 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z M13 5v2 M13 11v2 M13 17v2','M3 9a3 3 0 0 0 0 6v3h10V5H3z'],
 store:['M3 9l1.5-5h15L21 9 M3 9v11h18V9 M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0 M9 20v-6h6v6','M3 9l1.5-5h15L21 9a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z'],
 spark:['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z','M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'],
 wallet:['M19 7V4H5a2 2 0 0 0 0 4h15v12H5a2 2 0 0 1-2-2V6 M16 14h.01','M3 8h17v12H5a2 2 0 0 1-2-2z'],
 server:['M3 4h18v6H3z M3 14h18v6H3z M7 7h.01 M7 17h.01','M3 4h18v6H3z'],
 chart:['M3 3v18h18 M8 17v-6 M13 17V7 M18 17v-4','M7 11h2v6H7z M12 7h2v10h-2z'],
 pin:['M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z','M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z'],
 cal:['M3 5h18v16H3z M3 10h18 M8 3v4 M16 3v4','M3 5h18v5H3z'],
 star:['M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z','M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z'],
 file:['M14 3H6v18h12V7z M14 3v4h4 M9 13h6 M9 17h6','M14 3H6v18h12V7h-4z'],
 shield:['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4','M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'],
 scan:['M3 7V4h3 M21 7V4h-3 M3 17v3h3 M21 17v3h-3 M7 12h10','M7 7h10v10H7z'],
 alert:['M12 3l10 18H2z M12 10v4 M12 17.5h.01','M12 3l10 18H2z'],
 check:['M5 12.5l4.5 4.5L19 7'], x:['M6 6l12 12 M18 6L6 18'],
 search:['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4','M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z'],
 bell:['M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8 M10 20a2 2 0 0 0 4 0','M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8z'],
 download:['M12 3v12 M7 10l5 5 5-5 M4 21h16'], plus:['M12 5v14 M5 12h14'],
 gear:['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z'],
 qr:['M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h3v3h-3z M20 14v.01 M14 20h.01 M17 17h4v4h-4','M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z'],
 refresh:['M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5'],
 plane:['M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z','M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12z'],
 ship:['M2 20c2 1 4 1 6 0s4-1 6 0 4 1 6 0 M4 18l-1-5h18l-2 5 M6 13V7h12v6 M12 3v4','M3 13h18l-2 5H4z'],
 bus:['M5 17h14v-5l-2-5H7l-2 5z M5 12h14 M7.5 17v2 M16.5 17v2 M8 14.5h.01 M16 14.5h.01','M5 12l2-5h10l2 5z'],
 anchor:['M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M12 7v14 M5 12H2a10 10 0 0 0 20 0h-3'],
 globe:['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3a14 14 0 0 1 0 18 M12 3a14 14 0 0 0 0 18','M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'],
 clock:['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2','M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'],
 up:['M7 14l5-5 5 5'], dn:['M7 10l5 5 5-5'], chev:['M9 6l6 6-6 6'], back:['M15 6l-6 6 6 6'],
 swap:['M16 3l4 4-4 4 M20 7H4 M8 21l-4-4 4-4 M4 17h16'],
 filter:['M3 5h18l-7 8v6l-4 2v-8z','M3 5h18l-7 8v6l-4 2v-8z'],
 eye:['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z','M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
 flag:['M4 21V4 M4 4h13l-2 4 2 4H4','M4 4h13l-2 4 2 4H4z'],
 tag:['M3 3h8l10 10-8 8L3 11z M7.5 7.5h.01','M3 3h8l10 10-8 8L3 11z'],
 box:['M21 8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8','M3 8l9 5 9-5-9-5z'],
 receipt:['M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z M9 8h6 M9 12h6 M9 16h4','M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z'],
 mega:['M3 11v3a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z M17 9a4 4 0 0 1 0 6','M3 11v3a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z'],
 mount:['M2 18l6-9 4 5 3-3 7 7z M17 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z','M2 18l6-9 4 5 3-3 7 7z'],
 msg:['M21 12a8 8 0 0 1-12 7l-6 2 2-5.5A8 8 0 1 1 21 12z','M21 12a8 8 0 0 1-12 7l-6 2 2-5.5A8 8 0 1 1 21 12z'],
 bank:['M3 10l9-6 9 6 M5 10v8 M9.5 10v8 M14.5 10v8 M19 10v8 M3 21h18','M3 10l9-6 9 6z'],
 trend:['M3 17l6-6 4 4 8-8 M15 7h6v6'],
 lock:['M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4','M5 11h14v10H5z'],
 menu:['M4 6h16 M4 12h16 M4 18h16'],
 card:['M2 6h20v12H2z M2 10h20','M2 6h20v4H2z'],
 kiosk:['M7 2h10v20H7z M11 18h2 M9 6h6v6H9z','M9 6h6v6H9z'],
 send:['M3 11l18-8-8 18-2-8z','M3 11l18-8-8 18-2-8z'],
 smile:['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8.5 14a4 4 0 0 0 7 0 M9 9.5h.01 M15 9.5h.01','M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'],
 leaf:['M5 21c0-9 5-15 16-16-1 11-7 16-16 16z M5 21l8-8','M5 21c0-9 5-15 16-16-1 11-7 16-16 16z'],
 id:['M3 5h18v14H3z M8 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 16c.5-1.5 1.7-2 3-2s2.5.5 3 2 M14 9h4 M14 13h4','M3 5h18v14H3z'],
 phone:['M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5z M11 18.5h2'], exit:['M14 4h5v16h-5 M10 8l-4 4 4 4 M6 12h10'], enter:['M10 4H5v16h5 M14 8l4 4-4 4 M18 12H8'],
 g_command:['M3 4h18v12H3z M8 20h8 M12 16v4 M6 12l3-3 3 2 5-5','M3 4h18v12H3z'],
 basket:['M4 9h16l-2 11H6z M8 9l4-6 4 6 M9 13v4 M12 13v4 M15 13v4','M4 9h16l-2 11H6z'],
 alertsend:['M12 3l8 4v5c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V7z M12 8v5 M12 16h.01','M12 3l8 4v5c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V7z'],
 layers:['M12 3l9 5-9 5-9-5z M3 13l9 5 9-5','M12 3l9 5-9 5-9-5z'],
 sign:['M3 17c3-3 4-9 6-9s1 7 3 7 2-3 4-3 2 2 5 2 M3 21h18'],
 share:['M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8.6 13.5l6.8 4 M15.4 6.5l-6.8 4'],
 history:['M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5 M12 7v5l3 2'],
 inbox:['M3 13l3-9h12l3 9v7H3z M3 13h5l1 3h6l1-3h5','M3 13h5l1 3h6l1-3h5v7H3z'],
 /* portal glyphs drawn from the logo: swoosh waves, peak, plane */
 g_ops:['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3.6 14.2c4.6-3.4 10.4-4 16.9-1.6 M5.4 18c4-2.2 8.6-2.6 13.4-1 M14 7.5l3.2-1.7 M16 9.5l3.5-.4','M12 3a9 9 0 0 0-8.4 11.2c4.6-3.4 10.4-4 16.9-1.6A9 9 0 0 0 12 3z'],
 g_tourism:['M2.5 16l6-8.5 3.6 4.7 2.6-2.8 6.8 6.6 M2 20c3 1.6 6.4 1.6 10 0s7-1.6 10 0','M2.5 16l6-8.5 3.6 4.7 2.6-2.8 6.8 6.6z'],
 g_finance:['M12 3l9 4.8H3z M5.5 10v6 M10 10v6 M14 10v6 M18.5 10v6 M2 20c3 1.6 6.4 1.6 10 0s7-1.6 10 0','M12 3l9 4.8H3z'],
 g_immigration:['M5 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5z M8.5 16.5h6 M11.5 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M15 4.5l5.5-2.5-1.2 5','M5 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5z'],
 g_merchant:['M3 9.5l2-5.5h14l2 5.5 M3 9.5c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3 M5 12.3V19h14v-6.7 M2 21.5c3 1.4 6.4 1.4 10 0s7-1.4 10 0','M3 9.5l2-5.5h14l2 5.5c0 1.7-1.3 3-3 3s-3-1.3-3-3c0 1.7-1.3 3-3 3s-3-1.3-3-3c0 1.7-1.3 3-3 3s-3-1.3-3-3z'],
};
const ic = (n, c='') => { const v=I[n]||I.box; return `<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${v[1]?`<path class="fl" d="${v[1]}"/>`:''}<path d="${v[0]}"/></svg>`; };
const icn = (n, tone='') => `<span class="ic ${tone}">${ic(n)}</span>`;

/* ---------- utils ---------- */
let seed = 20261118;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const ri = (a,b) => Math.floor(a + rnd()*(b-a+1));
const pick = a => a[Math.floor(rnd()*a.length)];
const wpick = (arr, w) => { const t=arr.reduce((a,x)=>a+w(x),0); let r=rnd()*t; for(const x of arr){ r-=w(x); if(r<=0) return x; } return arr[0]; };
const AL = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code = n => Array.from({length:n},()=>AL[Math.floor(rnd()*AL.length)]).join('');
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ini = s => s.split(/[\s-]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const av = (name, size) => `<span class="av" ${size?`style="width:${size}px;height:${size}px"`:''}>${ini(name)}</span>`;
const badge = (txt, k='mute') => `<span class="badge b-${k}">${txt}</span>`;
const cc = m => `<span class="cc" title="${esc(MKT[m][1])}">${MKT[m][0]==='OT'?'Other':MKT[m][0]}</span>`;
const ccode = code_ => `<span class="cc">${code_}</span>`;
const delta = (v, inv) => { if(v===null||v===undefined) return ''; if(Math.abs(v)<.05) return `<span class="delta flat">0.0%</span>`; const up=v>=0, good=inv?!up:up; return `<span class="delta ${good?'up':'dn'}">${ic(up?'up':'dn')}${Math.abs(v).toFixed(1)}%</span>`; };
const PAL = ['#1460E0','#22B5F0','#0A2463','#14B8A6','#7B4DE3','#FF8A1F','#6AA8FF','#C4CFE2','#0B6A85','#8592AD'];
const MODEC = {air:'#1460E0', sea:'#22B5F0', cruise:'#0A2463', land:'#14B8A6'};
const RAILC = ['#1460E0','#22B5F0','#14B8A6','#0A2463','#6AA8FF','#8592AD'];
const MKTC = m => PAL[m%PAL.length];

/* ---------- charts (flat colour, inline SVG) ---------- */
function niceMax(v){ if(v<=5) return 5; const p=Math.pow(10,Math.floor(Math.log10(v))); const m=v/p; return (m<=1?1:m<=2?2:m<=2.5?2.5:m<=5?5:10)*p; }
function nt(max){ if(max<=5) return 5; const p=Math.pow(10,Math.floor(Math.log10(max))); const m=Math.round(max/p*10)/10; return m===2||m===4||m===8?4:5; }
function legend(series){ return `<div class="legend" style="margin-top:8px">${series.map(s=>`<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')}</div>`; }
const clean = a => a.map(v=>isFinite(v)?v:0);
function lineChart({labels, series, h=230, w=680, area=true, yfmt=kN, every, nolegend}){
  if(!labels.length) return '<div class="empty">No data for this selection</div>';
  series=series.map(s=>({...s,data:clean(s.data)}));
  const pl=54,pr=12,pt=12,pb=26, iw=w-pl-pr, ih=h-pt-pb, n=labels.length;
  const max=niceMax(Math.max(1,...series.flatMap(s=>s.data))*1.06), NT=nt(max);
  const x=i=>pl+(n===1?iw/2:i*iw/(n-1)), y=v=>pt+ih-(v/max)*ih; let g='';
  for(let k=0;k<=NT;k++){ const v=max*k/NT, yy=y(v); g+=`<line class="gl" x1="${pl}" x2="${w-pr}" y1="${yy}" y2="${yy}"/><text x="${pl-8}" y="${yy+3.5}" text-anchor="end">${yfmt(v)}</text>`; }
  every = every || Math.ceil(n/8);
  labels.forEach((l,i)=>{ if(i%every===0) g+=`<text x="${x(i)}" y="${h-6}" text-anchor="middle">${l}</text>`; });
  series.forEach((s,si)=>{ const d=s.data.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)).join(' ');
    if(area && si===0) g+=`<path d="${d} L${x(n-1)} ${pt+ih} L${x(0)} ${pt+ih}Z" fill="${s.color}" opacity=".16"/>`;
    g+=`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.dash?1.7:2.4}" ${s.dash?'stroke-dasharray="5 5"':''} stroke-linejoin="round" stroke-linecap="round"/>`; });
  const s0=series[0]; g+=`<circle cx="${x(n-1)}" cy="${y(s0.data[n-1])}" r="4.5" fill="${s0.color}"/>`;
  labels.forEach((l,i)=>{ g+=`<rect x="${x(i)-iw/n/2}" y="${pt}" width="${iw/n}" height="${ih}" fill="transparent"><title>${l}\n${series.map(s=>s.name+': '+yfmt(s.data[i])).join('\n')}</title></rect>`; });
  return `<svg class="ch" viewBox="0 0 ${w} ${h}" role="img">${g}</svg>${series.length>1&&!nolegend?legend(series):''}`;
}
function barChart({labels, series, h=230, w=680, stacked=false, yfmt=kN, every, nolegend, line, onbar}){
  if(!labels.length) return '<div class="empty">No data for this selection</div>';
  series=series.map(s=>({...s,data:clean(s.data)}));
  const pl=54,pr=12,pt=12,pb=26, iw=w-pl-pr, ih=h-pt-pb, n=labels.length;
  const totals = labels.map((_,i)=> stacked ? series.reduce((a,s)=>a+s.data[i],0) : Math.max(...series.map(s=>s.data[i])));
  const max=niceMax(Math.max(1,...totals, ...(line?line.data:[0]))*1.06), NT=nt(max);
  const y=v=>pt+ih-(v/max)*ih, bw=iw/n; let g='';
  for(let k=0;k<=NT;k++){ const v=max*k/NT, yy=y(v); g+=`<line class="gl" x1="${pl}" x2="${w-pr}" y1="${yy}" y2="${yy}"/><text x="${pl-8}" y="${yy+3.5}" text-anchor="end">${yfmt(v)}</text>`; }
  every = every || Math.ceil(n/12);
  labels.forEach((l,i)=>{ const x0=pl+i*bw;
    if(i%every===0) g+=`<text x="${x0+bw/2}" y="${h-6}" text-anchor="middle">${l}</text>`;
    if(stacked){ let acc=0; series.forEach((s,si)=>{ const v=s.data[i], top=y(acc+v), bh=y(acc)-y(acc+v); acc+=v; g+=`<rect x="${x0+bw*.18}" y="${top}" width="${bw*.64}" height="${Math.max(0,bh)}" rx="${si===series.length-1?3:0}" fill="${s.color}"/>`; }); }
    else { const gw=bw*.7/series.length; series.forEach((s,si)=>{ const v=s.data[i]; g+=`<rect x="${x0+bw*.15+si*gw}" y="${y(v)}" width="${Math.max(1,gw-2)}" height="${pt+ih-y(v)}" rx="3" fill="${s.color}"/>`; }); }
    g+=`<rect x="${x0}" y="${pt}" width="${bw}" height="${ih}" fill="transparent" ${onbar?`style="cursor:pointer" onclick="${onbar(i)}"`:''}><title>${l}\n${series.map(s=>s.name+': '+yfmt(s.data[i])).join('\n')}${line?'\n'+line.name+': '+yfmt(line.data[i]):''}</title></rect>`; });
  if(line){ const d=line.data.map((v,i)=>(i?'L':'M')+(pl+i*bw+bw/2).toFixed(1)+' '+y(v).toFixed(1)).join(' '); g+=`<path d="${d}" fill="none" stroke="${line.color}" stroke-width="2" stroke-dasharray="5 4"/>`+line.data.map((v,i)=>`<circle cx="${pl+i*bw+bw/2}" cy="${y(v)}" r="3" fill="${line.color}"/>`).join(''); }
  const lgd=[...series, ...(line?[line]:[])];
  return `<svg class="ch" viewBox="0 0 ${w} ${h}" role="img">${g}</svg>${lgd.length>1&&!nolegend?legend(lgd):''}`;
}
function donut(segs, {size=164, th=20, center='', sub='', fmt=(p)=>pct(p)}={}){
  segs=segs.filter(s=>s.value>0); const tot=segs.reduce((a,s)=>a+s.value,0)||1, r=(size-th)/2, c=2*Math.PI*r; let off=0;
  const arcs=segs.map(s=>{ const len=c*s.value/tot; const a=`<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${th}" stroke-dasharray="${Math.max(0,len-2)} ${c}" stroke-dashoffset="${-off}" transform="rotate(-90 ${size/2} ${size/2})"><title>${s.label}: ${(s.value/tot*100).toFixed(1)}%</title></circle>`; off+=len; return a; }).join('');
  return `<div class="donut-wrap"><svg class="ch" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="flex:none;width:${size}px">${arcs}<text class="dc" x="50%" y="${size/2-1}" text-anchor="middle" style="font:800 17px Poppins,sans-serif">${center}</text><text x="50%" y="${size/2+16}" text-anchor="middle" style="font:500 11px 'Public Sans',sans-serif">${sub}</text></svg>
  <div class="lg">${segs.map(s=>`<div><i style="background:${s.color}"></i><span>${s.label}</span><b>${fmt(s.value/tot*100, s.value)}</b></div>`).join('')}</div></div>`;
}
function hbars(items, {fmt=fmtN, max}={}){
  const m = max || Math.max(1,...items.map(i=>i.value));
  return items.map(i=>`<div class="hb"><span class="lbl">${i.pre||''}${i.label}</span><div class="bar"><i style="width:${(i.value/m*100).toFixed(1)}%;${i.color?`background:${i.color}`:''}"></i></div><span class="b" style="min-width:60px;text-align:right">${fmt(i.value)}${i.sub?` <small class="muted" style="font-weight:500">${i.sub}</small>`:''}</span></div>`).join('');
}
function spark(data, color='#22B5F0'){ data=clean(data); const w=120,h=28, mx=Math.max(...data), mn=Math.min(...data), n=data.length;
  const d=data.map((v,i)=>(i?'L':'M')+(i*w/(n-1)).toFixed(1)+' '+(h-2-(v-mn)/((mx-mn)||1)*(h-4)).toFixed(1)).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
function heat(rows, data, rgb='20,96,224'){ const mx=Math.max(1,...data.flat());
  let h='<div class="heat"><span></span>'+Array.from({length:24},(_,i)=>`<span style="justify-content:center">${i%3===0?pad2(i):''}</span>`).join('');
  rows.forEach((r,ri)=>{ h+=`<span>${r}</span>`+data[ri].map((v,ci)=>`<div title="${r} ${pad2(ci)}:00 · ${fmtN(v)}" style="background:rgba(${rgb},${(0.06+0.9*v/mx).toFixed(2)})"></div>`).join(''); });
  return h+'</div>'; }
const progress = (v, color, h=7) => `<div class="bar" style="height:${h}px"><i style="width:${Math.min(100,Math.max(0,v))}%;${color?`background:${color}`:''}"></i></div>`;

/* ---------- components ---------- */
const card = (title, body, {sub='', action='', flush=false, id='', style=''}={}) =>
  `<section class="card" ${id?`id="${id}"`:''} style="${style}">${title?`<div class="card-h"><div><h3>${title}</h3>${sub?`<p>${sub}</p>`:''}</div>${action}</div>`:''}<div class="card-b ${flush?'flush':''}">${body}</div></section>`;
const kpi = ({label, value, d, inv, foot='', icon='chart', tone='', sp, hero}) =>
  `<section class="card kpi ${hero?'hero':''}"><div class="lab">${icn(icon,tone)}${label}</div><div class="val">${value}</div><div class="foot">${delta(d,inv)}<span>${foot}</span></div>${sp?`<div class="sp">${spark(sp, hero?'#FFFFFF':'#1460E0')}</div>`:''}</section>`;
function table(cols, rows, {click, foot, hl}={}){
  return `<div class="tbl-wrap"><table class="t"><thead><tr>${cols.map(c=>`<th class="${c.r?'r':''}">${c.h}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map((r,i)=>`<tr class="${click?'click':''} ${hl&&hl(r,i)?'hl':''}" ${click?`onclick="${click(r,i)}" tabindex="0" onkeydown="if(event.key==='Enter')this.click()"`:''}>${cols.map(c=>`<td class="${c.r?'r':''}">${c.v(r,i)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${cols.length}" class="empty">No records for this selection</td></tr>`}</tbody>${foot&&rows.length?`<tfoot><tr>${foot.map((f,i)=>`<td class="${cols[i]&&cols[i].r?'r':''}">${f}</td>`).join('')}</tr></tfoot>`:''}</table></div>`;
}
const li = (icon, tone, title, sub, right='') => `<div class="li">${icn(icon,tone)}<div class="grow"><b>${title}</b><small>${sub}</small></div>${right}</div>`;
const alertBox = (k, icon, title, sub, act='') => `<div class="alert ${k}">${icn(icon, k==='bad'?'t-red':k==='warn'?'t-amber':k==='ok'?'t-green':'')}<div class="grow"><b>${title}</b><small>${sub}</small></div>${act}</div>`;
const chips = (list, cur, fn) => `<div class="chips">${list.map(([k,l,n])=>`<button class="chip ${k===cur?'on':''}" onclick="${fn}('${k}')">${l}${n!==undefined?`<span class="n">${n}</span>`:''}</button>`).join('')}</div>`;
const phead = (text, actions='') => `<div class="pagehead"><p>${text}</p><div class="row wrap">${actions}</div></div>`;
const moneyOK = v => /^\d{1,7}(\.\d{1,2})?$/.test(String(v).trim()) && parseFloat(v)>0;

/* ---------- overlays ---------- */
function toast(msg, icon='check'){ const t=$('#toast'); t.innerHTML=ic(icon)+`<span>${msg}</span>`; t.classList.add('on'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('on'),3000); }
function drawer(title, sub, body, foot=''){ $('#drawer').innerHTML=`<div class="dh"><div class="grow"><h3>${title}</h3>${sub?`<p class="small muted">${sub}</p>`:''}</div><button class="ibtn" onclick="closeAll()" aria-label="Close">${ic('x')}</button></div><div class="db">${body}</div>${foot?`<div class="df">${foot}</div>`:''}`; $('#drawer').classList.add('on'); $('#scrim').classList.add('on'); }
function modal(title, sub, body, foot){ $('#modal').innerHTML=`<div class="mh"><h3>${title}</h3>${sub?`<p>${sub}</p>`:''}</div><div class="mb">${body}</div><div class="mf">${foot||`<button class="btn btn-s" onclick="closeAll()">Close</button>`}</div>`; $('#modal').classList.add('on'); $('#scrim').classList.add('on'); const f=$('#modal input,#modal textarea,#modal select'); if(f) setTimeout(()=>f.focus(),60); }
function closeAll(){ ['#drawer','#modal','#scrim'].forEach(s=>$(s).classList.remove('on')); $('#side').classList.remove('open'); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeAll(); });
const fieldErr = (id, msg) => { const el=$('#'+id); if(!el) return; let e=el.parentElement.querySelector('.err'); if(!e){ e=document.createElement('span'); e.className='err'; el.parentElement.appendChild(e); } e.textContent=msg; el.focus(); };

/* ---------- real file exports: CSV and XLSX (no library) ---------- */
const CRC = (()=>{ const t=new Uint32Array(256); for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c = c&1 ? 0xEDB88320^(c>>>1) : c>>>1; t[n]=c>>>0; } return t; })();
const crc32 = u8 => { let c=0xFFFFFFFF; for(let i=0;i<u8.length;i++) c=CRC[(c^u8[i])&255]^(c>>>8); return (c^0xFFFFFFFF)>>>0; };
function zipStore(files){ const enc=new TextEncoder(), parts=[], cen=[]; let off=0;
  files.forEach(f=>{ const name=enc.encode(f.name), data=typeof f.data==='string'?enc.encode(f.data):f.data, crc=crc32(data);
    const h=new DataView(new ArrayBuffer(30)); h.setUint32(0,0x04034b50,true); h.setUint16(4,20,true); h.setUint16(8,0,true); h.setUint32(14,crc,true); h.setUint32(18,data.length,true); h.setUint32(22,data.length,true); h.setUint16(26,name.length,true);
    parts.push(new Uint8Array(h.buffer), name, data);
    const c=new DataView(new ArrayBuffer(46)); c.setUint32(0,0x02014b50,true); c.setUint16(4,20,true); c.setUint16(6,20,true); c.setUint32(16,crc,true); c.setUint32(20,data.length,true); c.setUint32(24,data.length,true); c.setUint16(28,name.length,true); c.setUint32(42,off,true);
    cen.push(new Uint8Array(c.buffer), name); off += 30+name.length+data.length; });
  const csize=cen.reduce((a,b)=>a+b.length,0); const e=new DataView(new ArrayBuffer(22)); e.setUint32(0,0x06054b50,true); e.setUint16(8,files.length,true); e.setUint16(10,files.length,true); e.setUint32(12,csize,true); e.setUint32(16,off,true);
  return new Blob([...parts,...cen,new Uint8Array(e.buffer)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}); }
/* cell text → typed value: "RM 1,234.50" → 1234.5, "(RM 5.00)" → -5, "12.5%" → 0.125, "3,451" → 3451 */
function typed(v){ const s=String(v).trim(); let m;
  if((m=s.match(/^\((RM [\d,]+\.\d\d)\)$/))) return {n:-parseFloat(m[1].slice(3).replace(/,/g,'')),f:'money'};
  if((m=s.match(/^RM ([\d,]+\.\d\d)$/))) return {n:parseFloat(m[1].replace(/,/g,'')),f:'money'};
  if((m=s.match(/^([+-]?[\d,]*\.?\d+)%$/))) return {n:parseFloat(m[1].replace(/,/g,''))/100,f:'pct'};
  if(/^[+-]?\d{1,3}(,\d{3})*(\.\d+)?$/.test(s)||/^[+-]?\d+(\.\d+)?$/.test(s)) return {n:parseFloat(s.replace(/,/g,'')),f:'num'};
  return {s}; }
function xlsx(sheetName, rows){ const colL=i=>{ let s=''; i++; while(i){ const m=(i-1)%26; s=String.fromCharCode(65+m)+s; i=Math.floor((i-1)/26); } return s; };
  const x=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const sd = rows.map((r,ri)=>`<row r="${ri+1}">${r.map((v,ci)=>{ const ref=colL(ci)+(ri+1); if(v===null||v===undefined||v==='') return ''; if(typeof v==='object'&&v.n!==undefined) return `<c r="${ref}" s="${v.f==='money'?1:v.f==='pct'?2:0}"><v>${v.n}</v></c>`; return `<c r="${ref}" t="inlineStr" ${ri<3?'s="3"':''}><is><t>${x(v.s!==undefined?v.s:v)}</t></is></c>`; }).join('')}</row>`).join('');
  return zipStore([
    {name:'[Content_Types].xml',data:'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'},
    {name:'_rels/.rels',data:'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
    {name:'xl/workbook.xml',data:`<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${x(sheetName.slice(0,31))}" sheetId="1" r:id="rId1"/></sheets></workbook>`},
    {name:'xl/_rels/workbook.xml.rels',data:'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},
    {name:'xl/styles.xml',data:'<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="&quot;RM&quot; #,##0.00;(&quot;RM&quot; #,##0.00)"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="4"><xf/><xf numFmtId="164" applyNumberFormat="1"/><xf numFmtId="10" applyNumberFormat="1"/><xf fontId="1" applyFont="1"/></cellXfs></styleSheet>'},
    {name:'xl/worksheets/sheet1.xml',data:`<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sd}</sheetData></worksheet>`},
  ]); }
function download(blob, name){ const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500); }
