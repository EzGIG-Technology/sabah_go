/* ============================================================
   Sabah GO — mobile app prototype
   Router + state + every screen. All controls are live.
   ============================================================ */

/* ---------------- icons (24px stroke) ---------------- */
const ICONS = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  search:'<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.3-4.3"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  chevL:'<path d="m15 18-6-6 6-6"/>', chevR:'<path d="m9 18 6-6-6-6"/>', chevD:'<path d="m6 9 6 6 6-6"/>',
  plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  food:'<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  bed:'<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  wallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  user:'<circle cx="12" cy="8" r="4.5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  bag:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  shop:'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  scan:'<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>', minus:'<path d="M5 12h14"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  sparkle:'<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
  percent:'<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  tag:'<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1"/>',
  headset:'<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  star:'<path d="M11.5 2.3a.5.5 0 0 1 .9 0l2.3 4.7a2.1 2.1 0 0 0 1.6 1.2l5.2.7a.5.5 0 0 1 .3.9l-3.7 3.7a2.1 2.1 0 0 0-.6 1.9l.9 5.1a.5.5 0 0 1-.8.6l-4.6-2.4a2.1 2.1 0 0 0-2 0L6.4 21a.5.5 0 0 1-.8-.6l.9-5.1a2.1 2.1 0 0 0-.6-1.9L2.2 9.8a.5.5 0 0 1 .3-.9l5.2-.8a2.1 2.1 0 0 0 1.6-1.1z"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  check:'<path d="M20 6 9 17l-5-5"/>', x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  sliders:'<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  car:'<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  ship:'<path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.4 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.9 5.3 2.8 7.8"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6M12 10v4M12 2v3"/>',
  wifi:'<path d="M12 20h.01M2 8.8a15 15 0 0 1 20 0M5 12.9a10 10 0 0 1 14 0M8.5 16.4a5 5 0 0 1 7 0"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  alert:'<path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  receipt:'<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11"/>',
  share:'<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4M12 2v13"/>',
  mountain:'<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  activity:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  crown:'<path d="M11.6 3.3a.5.5 0 0 1 .9 0l2.9 5.6a1 1 0 0 0 1.5.3l4.3-3.7a.5.5 0 0 1 .8.5l-2.8 10.3a1 1 0 0 1-1 .7H5.8a1 1 0 0 1-1-.7L2 6a.5.5 0 0 1 .8-.5l4.3 3.7a1 1 0 0 0 1.5-.3z"/><path d="M5 21h14"/>',
  ticket:'<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
  lang:'<path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>',
  store:'<path d="m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4M2 7h20M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.6-.6.7.7 0 0 0-.8 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.6-.6.7.7 0 0 0-.8 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.6-.6.7.7 0 0 0-.8 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.6-.6.7.7 0 0 0-.8 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  chart:'<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  trend:'<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
  megaphone:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  id:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M7 16h10"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  nav:'<path d="m3 11 19-9-9 19-2-8-8-2z"/>',
  medical:'<path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  flash:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  arrowUp:'<path d="M7 17 17 7M7 7h10v10"/>', arrowDown:'<path d="M17 7 7 17M17 17H7V7"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.8 9.8 0 0 1 6.7 2.7L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.8 9.8 0 0 1-6.7-2.7L3 16"/><path d="M8 16H3v5"/>',
  box:'<path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  swap:'<path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>',
  thumb:'<path d="M7 10v12M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9Z"/>',
  bus:'<path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
};
function ic(n, cls=''){ return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`; }

/* ---------------- state ---------------- */
const fresh = () => ({
  lang:'en', cur:'MYR', loggedIn:false, mdac:false, pass:null,
  user:{name:'Emma Johnson', email:'emma.johnson@mail.com', nat:'United Kingdom', flag:'🇬🇧', passport:'AB1234567', phone:'+44 7700 900123'},
  balance:150, points:2450, favs:['semporna','kinabalu'],
  tec:{route:'air', date:'2026-11-12', port:'Kota Kinabalu International Airport', sameDay:false, adults:1, teens:0, kids:0},
  txns:[
    {id:'t3', t:'Jesselton Point Ferry', s:'Return ticket · Manukan', amt:-21.5, d:'20 Oct, 16:40', m:'Sabah GO Wallet', ic:'ship'},
    {id:'t2', t:'Kedai Kopi Fatt Kee', s:'Merchant QR payment', amt:-28.5, d:'20 Oct, 13:12', m:'Sabah GO Wallet', ic:'food'},
    {id:'t1', t:'Top up', s:'From Visa •••• 4821', amt:200, d:'20 Oct, 09:05', m:'Visa •••• 4821', ic:'plus'},
  ],
  bookings:[{id:'b1', item:'s_shangri', name:'Shangri-La Tanjung Aru', sub:'2 nights · 1 room', date:'12 Nov 2026', amt:1560, ref:'SG-BK-48210', status:'Confirmed'}],
  claimed:['d_attr'], reminders:[], chat:[], obIdx:0, authTab:'signup', terms:true,
  notifs:[
    {id:'n1', ic:'ticket', c:'c-orange', t:'Complete your Tourist Entry Contribution', s:'Pay before you land to get your Digital Tourist Pass.', time:'2h', read:false, go:'tec'},
    {id:'n2', ic:'gift', c:'c-green', t:'RM120 cashback unlocked', s:'Book any stay above RM600 this month.', time:'5h', read:false, go:'coupon:d_cash'},
    {id:'n3', ic:'cal', c:'c-purple', t:'Borneo Bird Festival · 8 Nov', s:'Happening near Sepilok during your trip.', time:'1d', read:false, go:'event:birds'},
    {id:'n4', ic:'sun', c:'c-blue', t:'Weather advisory: Kinabalu Park', s:'Afternoon showers expected. Start hikes before 9am.', time:'2d', read:true, go:'dest:kinabalu'},
  ],
  exFilter:'all', dTab:'overview', tripSeg:'itin', lsFilter:'all', method:'wallet', checkout:null,
  bk:{}, kp:'', topAmt:100, torch:false, rating:0, notifOn:true, locOn:true, bioOn:true,
  merchant:{sales:1250, count:26, pays:[['Alipay+','pay_alipay','🇨🇳','45.00','12:41'],['Visa','pay_visa','🇬🇧','28.50','12:30'],['DuitNow QR','pay_duitnow','🇲🇾','12.00','12:02'],['WeChat Pay','pay_wechat','🇨🇳','96.00','11:47']]},
  extraDays:{},
});
let S = fresh();

/* ---------------- helpers ---------------- */
const $ = s => document.querySelector(s);
const fmt = n => Number(n).toLocaleString('en-MY',{minimumFractionDigits:2, maximumFractionDigits:2});
const rm = n => 'RM ' + fmt(n);
const t = k => (I18N[S.lang]||I18N.en)[k] || I18N.en[k] || k;
const img = n => `img/${n}.jpg`;
const conv = n => { if (S.cur==='MYR') return ''; const c = CURR.find(c=>c[0]===S.cur); const v = n*c[2]; return `≈ ${S.cur} ${v>=1000?Math.round(v).toLocaleString():v.toFixed(2)}`; };
const destById = id => DEST.find(d=>d.id===id);
const isFav = id => S.favs.includes(id);
const unread = () => S.notifs.filter(n=>!n.read).length;
const rnd = n => Math.floor(Math.random()*n);
const now = () => { const d=new Date(); return d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})+', '+d.toTimeString().slice(0,5); };
const ref = p => p + '-' + (100000+rnd(899999));

function qr(seed='sabah', dark='#0A2463'){
  const n=25; let h=0; for (const ch of seed) h=(h*31+ch.charCodeAt(0))>>>0;
  const r=()=>{ h^=h<<13; h>>>=0; h^=h>>17; h^=h<<5; h>>>=0; return h/4294967296; };
  let s='';
  const finder=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="7" fill="${dark}"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="${dark}"/>`;
  const inF=(x,y)=>(x<8&&y<8)||(x>16&&y<8)||(x<8&&y>16);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){ if(inF(x,y)) continue; if(x>=10&&x<=14&&y>=10&&y<=14) continue; if(r()>.52) s+=`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${dark}"/>`; }
  const logo=`<rect x="10" y="10" width="5" height="5" rx="1.2" fill="#1460E0"/><path d="M11 13.6l1.6-2.4 1.4 1.6" stroke="#fff" stroke-width=".5" fill="none"/>`;
  return `<svg viewBox="-1 -1 27 27" width="100%" height="100%" shape-rendering="crispEdges" role="img" aria-label="QR code">${s}${finder(0,0)}${finder(18,0)}${finder(0,18)}${logo}</svg>`;
}

/* ---------------- router ---------------- */
let stack = [{n:'splash'}];
let statusLight = false, darkBottom = false;
const topScr = () => stack[stack.length-1];
const TABS = ['home','trips','wallet','rewards','profile'];

function render(enter=true){
  statusLight=false; darkBottom=false;
  const cur = topScr();
  const fn = SCREENS[cur.n];
  $('#app').innerHTML = fn ? fn(cur.p) : `<div class="scr">${hdr('Not found')}</div>`;
  const scr = $('#app').firstElementChild;
  if (enter && scr) { scr.classList.add('enter'); if (stack.length>1 && !TABS.includes(cur.n)) scr.classList.add('push'); }
  const ph = $('#phone'); ph.classList.toggle('light-sb', statusLight); ph.classList.toggle('dark-bottom', darkBottom);
  enhance(enter);
  if (cur.after) { cur.after(); cur.after=null; }
  markSide();
}
function enhance(entered){
  const app=$('#app');
  // toggle state for chips, options, segments, section buttons, route tiles, star ratings
  app.querySelectorAll('.chip,.opt,.seg button,.tabs button,.rt-tile,.stars button').forEach(b=>b.setAttribute('aria-pressed', b.classList.contains('on')));
  app.querySelectorAll('.list-label,.grp').forEach(h=>{ h.setAttribute('role','heading'); h.setAttribute('aria-level','2'); });
  document.documentElement.lang = S.lang==='ms' ? 'ms' : 'en';
  const h1 = app.querySelector('h1');
  const name = h1 ? h1.textContent.trim() : 'Sabah GO';
  document.title = name==='Sabah GO' ? 'Sabah GO' : `${name} · Sabah GO`;
  if(entered && h1 && document.readyState==='complete'){ h1.setAttribute('tabindex','-1'); h1.focus({preventScroll:true}); }
  const scr=app.firstElementChild, c=app.querySelector('.content'); // Stella button hides on scroll down, returns on scroll up
  if(scr && c && scr.querySelector('.fab')){ let y=c.scrollTop; c.addEventListener('scroll',()=>{ const d=c.scrollTop-y; if(Math.abs(d)<6) return; scr.classList.toggle('fab-away', d>0 && c.scrollTop>80); y=c.scrollTop; },{passive:true}); }
}
function refresh(){
  const c = $('#app .content'); const st = c ? c.scrollTop : 0;
  render(false);
  const c2 = $('#app .content'); if (c2) c2.scrollTop = st;
}
function go(n, p){ closeSheet(true); stack.push({n,p}); render(); }
function replace(n, p){ closeSheet(true); stack[stack.length-1]={n,p}; render(); }
function back(){ closeSheet(true); if (stack.length>1){ stack.pop(); render(); } else tab('home'); }
function tab(n, p){ closeSheet(true); stack=[{n,p}]; render(); }
function toHome(){ S.loggedIn=true; tab('home'); }
function goto(target){ // "screen:param" strings from data
  const [n,p] = target.split(':'); go(n,p);
}

/* ---------------- overlays ---------------- */
let toastT;
function toast(msg, icon='check'){
  const el=$('#toast'); el.innerHTML = ic(icon) + `<span>${msg}</span>`; el.classList.add('show');
  clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'), 2400);
}
let sheetReturn=null;
function sheet(html){
  const sh=$('#sheet'), w=$('#sheetWrap');
  if(!w.classList.contains('open')) sheetReturn=document.activeElement;
  sh.innerHTML = `<div class="grab" aria-hidden="true"></div>${html}`;
  const h=sh.querySelector('h3'); if(h){ h.id='sheetTitle'; sh.setAttribute('aria-labelledby','sheetTitle'); } else sh.setAttribute('aria-label','Dialog');
  w.classList.add('open'); w.removeAttribute('aria-hidden'); $('#app').setAttribute('aria-hidden','true');
  const f=sh.querySelector('button,input,select,textarea,a[href]'); setTimeout(()=>(f||sh).focus(),60);
}
function closeSheet(instant){
  const w=$('#sheetWrap'); if(!w||!w.classList.contains('open')) return;
  w.classList.remove('open'); w.setAttribute('aria-hidden','true'); $('#app').removeAttribute('aria-hidden');
  if(!instant && sheetReturn && sheetReturn.isConnected) sheetReturn.focus(); sheetReturn=null;
}
document.addEventListener('keydown', e=>{ // keep Tab inside an open sheet
  const w=$('#sheetWrap'); if(e.key!=='Tab'||!w.classList.contains('open')) return;
  const els=[...$('#sheet').querySelectorAll('button:not(:disabled),input,select,textarea,a[href]')]; if(!els.length) return;
  const first=els[0], last=els[els.length-1];
  if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
});
function loading(msg, ms, cb){
  const el=document.createElement('div'); el.className='loading-ov'; el.setAttribute('role','status'); el.setAttribute('aria-live','assertive'); el.innerHTML=`<div class="spin" aria-hidden="true"></div><div>${msg}</div>`;
  $('#phone').appendChild(el); setTimeout(()=>{ el.remove(); cb&&cb(); }, ms);
}

/* ---------------- layout pieces ---------------- */
function hdr(title, {back:b=true, right='', cls='', sub=''}={}){
  return `<header class="hdr ${cls}">${b?`<button class="ib" onclick="back()" aria-label="Back">${ic('chevL')}</button>`:'<span class="ib-sp"></span>'}
  <div class="hdr-t"><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}</div>${right||'<span class="ib-sp"></span>'}</header>`;
}
function navBar(active){
  const it=(k,icn,label)=>`<button class="${active===k?'on':''}" onclick="tab('${k}')" aria-label="${label}">${ic(icn)}<span>${label}</span></button>`;
  return `<nav class="nav" aria-label="Main">${it('home','home',t('home'))}${it('trips','bag',t('trips'))}
  <button class="center ${active==='wallet'?'on':''}" onclick="tab('wallet')" aria-label="${t('wallet')}"><span class="ring">${ic('wallet')}</span><span>${t('wallet')}</span></button>
  ${it('rewards','gift',t('rewards'))}${it('profile','user',t('profile'))}</nav>`;
}
function fab(){ return `<button class="fab" onclick="go('stella')" aria-label="Ask Stella, your AI travel assistant"><img src="img/stella.jpg" alt=""><span class="spark">${ic('sparkle')}</span><span class="lbl">Ask Stella</span></button>`; }
function page({header='', body='', nav=null, cls='', footer='', withFab=false}){
  return `<div class="scr ${cls} ${nav?'has-nav':'no-nav'} ${footer?'has-footer':''}">${header}<main class="content">${body}</main>${footer?`<div class="footer">${footer}</div>`:''}${withFab?fab():''}${nav?navBar(nav):''}</div>`;
}
const heartBtn = (id, cls='hbtn') => `<button class="${cls} ${isFav(id)?'on':''}" onclick="event.stopPropagation();toggleFav('${id}')" aria-label="${isFav(id)?'Remove from':'Save to'} favourites" aria-pressed="${isFav(id)}">${ic('heart')}</button>`;
function toggleFav(id){ if(isFav(id)){ S.favs=S.favs.filter(x=>x!==id); toast('Removed from favourites','heart'); } else { S.favs.push(id); toast('Saved to favourites','heart'); } refresh(); }
const li = ({icon, c='', title, sub='', right='', onclick, chev=true}) => !onclick ? `<div class="li"><span class="ico ${c}">${ic(icon)}</span><span class="tx"><b>${title}</b>${sub?`<small>${sub}</small>`:''}</span>${right}</div>` : `<button class="li" onclick="${onclick}"><span class="ico ${c}">${ic(icon)}</span><span class="tx"><b>${title}</b>${sub?`<small>${sub}</small>`:''}</span>${right}${chev?ic('chevR','chev'):''}</button>`;
const check = (on, label, onclick) => `<button class="check ${on?'on':''}" onclick="${onclick}" role="checkbox" aria-checked="${on}"><span class="box">${ic('check')}</span><span>${label}</span></button>`;
const toggle = (on, onclick, label) => `<button class="toggle ${on?'on':''}" onclick="${onclick}" role="switch" aria-checked="${on}" aria-label="${label}"></button>`;
const wm = (cls='') => `<div class="wm ${cls}"><span class="wm-s">SABAH</span><span class="wm-go">GO</span></div>`;
const stars = r => `<span class="star">${ic('star')}${r.toFixed(1)}</span>`;

/* =========================================================
   SCREENS
   ========================================================= */
const SCREENS = {};

/* ---------- Splash ---------- */
SCREENS.splash = () => {
  setTimeout(()=>{ if (topScr().n==='splash') replace('onboard'); }, 2200);
  return `<div class="scr"><div class="splash" onclick="replace('onboard')" role="button" tabindex="0" aria-label="Sabah GO. Tap to continue">
    <img class="logo" src="img/logo.webp" alt="Sabah GO — Your journey enriched">
    <div class="ld"><i></i></div><div class="wave"></div>
    <div class="by">Official tourism app of the Sabah State Government</div></div></div>`;
};

/* ---------- Onboarding ---------- */
const OB = [
  {img:'hero_sabah', k:'Explore & Plan', icn:'pin', c:'c-blue', h:'Discover <em>Amazing Sabah</em>', p:'Mountains, islands, rainforest and 30+ ethnic cultures. Itineraries, tickets and local guides in one app, in 12 languages.'},
  {img:'market1', k:'Book & Pay', icn:'wallet', c:'c-green', h:'One wallet. <em>Pay your way.</em>', p:'Alipay+, WeChat Pay, cards, PayNow, QRIS or DuitNow — prices in your own currency, and one QR code accepted everywhere in Sabah.'},
  {img:'airport', k:'Tourist Entry Contribution', icn:'ticket', c:'c-orange', h:'Land with a <em>Digital Tourist Pass</em>', p:'Link your MDAC, settle the Tourist Entry Contribution in minutes, and unlock attraction access, activity permits and exclusive discounts.'},
];
SCREENS.onboard = () => {
  const i=S.obIdx, o=OB[i], last=i===OB.length-1;
  return `<div class="scr"><div class="ob">
    <div class="im"><img src="${img(o.img)}" alt=""><button class="skip" onclick="replace('lang',{onb:1})">Skip</button></div>
    <div class="bd">
      <span class="kick"><span class="bub ${o.c}">${ic(o.icn)}</span>${o.k}</span>
      <h1>${o.h}</h1><p>${o.p}</p>
      <div class="ft"><div class="dots">${OB.map((_,j)=>`<button onclick="S.obIdx=${j};refresh()" aria-label="Slide ${j+1}" style="padding:6px 0"><i class="${j===i?'on':''}" style="display:block;width:${j===i?26:8}px;height:8px;border-radius:4px;background:${j===i?'var(--blue)':'#D4DEEE'}"></i></button>`).join('')}</div>
      <button class="btn btn-primary" onclick="${last?"replace('lang',{onb:1})":'S.obIdx++;render()'}">${last?'Get Started':'Next'} ${ic('chevR')}</button></div>
    </div></div></div>`;
};

/* ---------- Language ---------- */
SCREENS.lang = (p={}) => {
  const onb = p && p.onb;
  const partial = !['en','ms'].includes(S.lang);
  return page({
    header: hdr(onb?'Choose your language':'Language', {back:!onb, sub:'12 languages supported'}),
    body: `<div class="pad stack" style="gap:8px">
      ${LANGS.map(([c,n,e])=>`<button class="opt ${S.lang===c?'on':''}" onclick="S.lang='${c}';refresh()"><span class="radio"></span><span class="tx"><b>${n}</b><small>${e}</small></span>${c==='ms'||c==='en'?'':'<span class="pill">Beta</span>'}</button>`).join('')}
      ${partial?`<div class="info-box orange">${ic('info')}<span>This prototype carries full copy in English and Bahasa Malaysia. Other languages fall back to English for now.</span></div>`:''}
    </div>`,
    footer: `<button class="btn btn-primary btn-block" onclick="${onb?"replace('auth')":"back();toast('Language updated','lang')"}">${onb?'Continue':'Save'}</button>`
  });
};

/* ---------- Auth ---------- */
SCREENS.auth = () => {
  const su = S.authTab==='signup';
  return page({
    header: `<div style="padding:calc(var(--sb) + 18px) 24px 6px"><div class="row" style="gap:10px"><img class="mark" src="img/logo_mark.webp" alt="">${wm('sm')}</div>
      <h1 style="font-size:26px;font-weight:800;margin-top:18px;color:var(--navy)">${su?'Create your account':'Welcome back'}</h1>
      <p class="muted" style="font-size:13.5px;margin-top:4px">${su?'One digital identity for your whole Sabah journey.':'Log in to continue your journey.'}</p></div>`,
    body: `<div class="seg" style="margin:14px 20px 18px"><button class="${su?'on':''}" onclick="S.authTab='signup';refresh()">Sign up</button><button class="${!su?'on':''}" onclick="S.authTab='login';refresh()">Log in</button></div>
    <div class="pad">
      ${su?`<label class="field"><span>Full name (as in passport)</span><input class="inp" value="${S.user.name}" oninput="S.user.name=this.value"></label>`:''}
      <label class="field"><span>Email</span><input class="inp" type="email" value="${S.user.email}" oninput="S.user.email=this.value" autocomplete="email"></label>
      ${su?`<div class="row" style="gap:10px;align-items:flex-start"><label class="field" style="flex:1"><span>Nationality</span><select class="inp" onchange="setNat(this.value)">${['United Kingdom','China','Singapore','South Korea','Japan','Indonesia','Australia','United States','Malaysia'].map(n=>`<option ${n===S.user.nat?'selected':''}>${n}</option>`).join('')}</select></label>
      <label class="field" style="flex:1"><span>Passport no.</span><input class="inp" value="${S.user.passport}" oninput="S.user.passport=this.value"></label></div>`
      :`<label class="field"><span>Password</span><input class="inp" type="password" placeholder="Enter your password" autocomplete="current-password"></label>
      <button class="btn-ghost small b" style="margin:-4px 0 14px" onclick="toast('Reset link sent to your email','msg')">Forgot password?</button>`}
      ${su?check(S.terms,'I agree to the Terms of Use and Privacy Notice (PDPA). My data is stored in Malaysia.','S.terms=!S.terms;refresh()'):''}
      <button class="btn btn-primary btn-block" style="margin-top:18px" ${su&&!S.terms?'disabled':''} onclick="loading('${su?'Creating your account…':'Signing in…'}',1100,()=>{S.loggedIn=true;replace('mdac',{onb:1})})">${su?'Create account':'Log in'}</button>
      <div class="row" style="margin:18px 0;gap:10px;color:var(--ink3);font-size:12px"><span style="flex:1;height:1px;background:var(--line)"></span>or continue with<span style="flex:1;height:1px;background:var(--line)"></span></div>
      <div class="row" style="gap:10px"><button class="btn btn-light" style="flex:1" onclick="loading('Connecting to Apple…',900,()=>{S.loggedIn=true;replace('mdac',{onb:1})})"><svg viewBox="0 0 24 24" width="18" fill="currentColor"><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.6 1.3-.1 1.7-.8 3.3-.8 1.5 0 2 .8 3.3.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.5-1-2.5-4.1zM13.9 5c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5z"/></svg>Apple</button>
      <button class="btn btn-light" style="flex:1" onclick="loading('Connecting to Google…',900,()=>{S.loggedIn=true;replace('mdac',{onb:1})})"><svg viewBox="0 0 24 24" width="18"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-1.9 3.3-4.8 3.3-8.1z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z"/></svg>Google</button></div>
      <button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="toHome()">Explore as guest</button>
    </div>`
  });
};
function setNat(v){ const f={'United Kingdom':'🇬🇧','China':'🇨🇳','Singapore':'🇸🇬','South Korea':'🇰🇷','Japan':'🇯🇵','Indonesia':'🇮🇩','Australia':'🇦🇺','United States':'🇺🇸','Malaysia':'🇲🇾'}; S.user.nat=v; S.user.flag=f[v]||'🏳️'; }

/* ---------- MDAC link ---------- */
SCREENS.mdac = (p={}) => {
  const onb = p && p.onb;
  if (S.mdac) return page({
    header: hdr('MDAC Linked', {back:!onb}),
    body: `<div class="okwrap" style="padding-top:20px"><div class="okc">${ic('check')}</div>
      <h1>MDAC Verified</h1><p>Your Malaysia Digital Arrival Card was matched with Immigration records automatically.</p>
      <div class="card receipt">
        ${[['Name',S.user.name],['Passport',S.user.passport],['Nationality',S.user.flag+' '+S.user.nat],['Arrival','12 Nov 2026 · '+S.tec.port.split(' ').slice(0,2).join(' ')],['MDAC ref','MDAC-2611-'+S.user.passport.slice(-4)]].map(([k,v])=>`<div class="sumrow"><span>${k}</span><b>${v}</b></div>`).join('')}
      </div>
      <div class="info-box green" style="margin-top:14px;text-align:left">${ic('shield')}<span>Next: settle the Tourist Entry Contribution to receive your Digital Tourist Pass before you land.</span></div></div>`,
    footer: `<button class="btn btn-primary btn-block" onclick="go('tec')">Pay Tourist Entry Contribution</button>${onb?`<button class="btn btn-ghost btn-block" style="height:44px;margin-top:4px" onclick="toHome()">I'll do it later</button>`:''}`
  });
  return page({
    header: hdr('Link your MDAC', {back:!onb, sub:'Malaysia Digital Arrival Card', right: onb?`<button class="btn-ghost small b" style="width:44px" onclick="toHome()">Skip</button>`:''}),
    body: `<div class="pad">
      <div class="card" style="padding:16px;display:flex;gap:14px;align-items:center;margin-bottom:18px"><span class="bub c-navy" style="width:50px;height:50px;flex-shrink:0">${ic('id')}</span><div><b style="font-size:14.5px">Already filled your MDAC?</b><p class="muted small" style="line-height:1.5;margin-top:2px">Sabah GO reads it securely from the Immigration system — no need to type everything twice.</p></div></div>
      <label class="field"><span>Passport number</span><input class="inp" value="${S.user.passport}" oninput="S.user.passport=this.value"></label>
      <label class="field"><span>Nationality</span><select class="inp" onchange="setNat(this.value)">${['United Kingdom','China','Singapore','South Korea','Japan','Indonesia','Australia','United States'].map(n=>`<option ${n===S.user.nat?'selected':''}>${n}</option>`).join('')}</select></label>
      <div class="row" style="gap:10px"><label class="field" style="flex:1"><span>Arrival date</span><input class="inp" type="date" value="${S.tec.date}" onchange="S.tec.date=this.value"></label>
      <label class="field" style="flex:1"><span>Flight / vessel</span><input class="inp" value="MH2600"></label></div>
      <label class="field"><span>Point of entry</span><select class="inp" onchange="S.tec.port=this.value">${['Kota Kinabalu International Airport','Tawau Airport','Sandakan Airport','Jesselton Point Ferry Terminal','Sindumin Land Border'].map(n=>`<option ${n===S.tec.port?'selected':''}>${n}</option>`).join('')}</select></label>
      <button class="btn-ghost small b" onclick="toast('Opening the official MDAC portal','globe')">Haven't registered? Fill MDAC first ›</button>
    </div>`,
    footer: `<button class="btn btn-primary btn-block" onclick="loading('Checking MDAC with Immigration…',1500,()=>{S.mdac=true;S.notifs.unshift({id:'n'+Date.now(),ic:'shield',c:'c-green',t:'MDAC verified',s:'Your arrival card is linked to Sabah GO.',time:'now',read:false,go:'mdac'});refresh();toast('MDAC verified','shield')})">${ic('shield')} Verify with MDAC</button>`
  });
};

/* ---------- Home ---------- */
SCREENS.home = () => {
  statusLight=false;
  const entry = S.pass
    ? `<button class="pass-mini" onclick="go('pass')"><span class="qrbox">${qr(S.pass.id)}</span><span style="flex:1"><b>Digital Tourist Pass · Active</b><small>${S.pass.id} · valid until ${S.pass.until}</small><span class="pill white" style="margin-top:6px">${ic('check')} Tap to show at entry</span></span>${ic('chevR','chev')}</button>`
    : `<div class="entry-card"><div class="row between"><div><h3>Complete your entry to Sabah</h3><p>3 quick steps · about 5 minutes</p></div><span class="pill white">${S.mdac?'2':'1'} of 3</span></div>
      <div class="steps"><span class="step ${S.mdac?'done':'cur'}"><i></i>MDAC</span><span class="step ${S.mdac?'cur':''}"><i></i>Contribution</span><span class="step"><i></i>Tourist Pass</span></div>
      <button class="btn btn-white btn-sm" onclick="go('${S.mdac?'tec':'mdac'}')">${S.mdac?'Pay Tourist Entry Contribution':'Link my MDAC'} ${ic('chevR')}</button></div>`;
  const cats = [['c_dest','pin','c-blue',"go('explore')"],['c_act','activity','c-green',"go('listing','act')"],['c_food','food','c-orange',"go('listing','food')"],['c_shop','shop','c-red',"go('listing','shop')"],['c_stay','bed','c-purple',"go('listing','stay')"],['c_deal','tag','c-teal',"go('listing','deal')"],['c_svc','info','c-navy',"go('services')"],['c_rw','gift','c-gold',"tab('rewards')"]];
  const reco = [['rec_diving','Diving','Sipadan',"go('dest','sipadan')"],['rec_orangutan','Wildlife','Sepilok & Kinabatangan',"go('dest','kinabatangan')"],['rec_waterfall','Waterfalls','Danum Valley',"go('dest','danum')"],['marimari','Culture','Mari-Mari',"go('dest','marimari')"],['seafood','Food Tour','Kota Kinabalu',"go('booking','a_food')"]];
  return page({ nav:'home', withFab:true,
    body: `<div class="home-top"><img class="bg" src="img/hero_sabah.jpg" alt="Mount Kinabalu above water villages">
      <div class="home-logo"><div class="lg"><img class="mark" src="img/logo_mark.webp" alt="">${wm('sm')}</div>
        <div class="row" style="gap:8px"><button class="ib" onclick="go('lang')" aria-label="Language">${ic('globe')}</button><button class="ib" onclick="go('notifs')" aria-label="Notifications, ${unread()} unread">${ic('bell')}${unread()?'<span class="dot-badge"></span>':''}</button></div></div>
      <div class="home-hero-tx"><div class="hi">${t('welcome')}, ${S.loggedIn?S.user.name.split(' ')[0]:'traveller'} 👋</div><h1>${t('discover')}</h1><p>${t('heroSub')}</p></div>
      <div class="home-search"><button class="search" onclick="go('search')">${ic('search')}<span>${t('search')}</span><span class="filt">${ic('sliders')}</span></button></div></div>
    <div class="home-sheet">
      ${entry}
      <div class="sec"><div class="grid4">${cats.map(([k,icn,c,on])=>`<button class="cat" onclick="${on}"><span class="bub ${c}">${ic(icn)}</span>${t(k)}</button>`).join('')}</div></div>
      <div class="sec"><div class="sec-h"><h2>${t('popular')}</h2><button onclick="go('explore')">${t('seeAll')}</button></div>
        <div class="hscroll">${DEST.slice(0,6).map(d=>`<div class="dcard"><img src="${img(d.img)}" alt="" loading="lazy"><span class="rt" aria-label="Rated ${d.rating}">${ic('star')}${d.rating}</span>${heartBtn(d.id,'hrt')}<span class="t"><button class="stretch" onclick="go('dest','${d.id}')"><b>${d.name}</b></button><small>${d.tag}</small></span></div>`).join('')}</div></div>
      <div class="sec"><button class="banner" onclick="go('stella',{prompt:'Plan a 5-day trip in Sabah'})"><img src="img/stella_banner.jpg" alt=""><span class="bt"><span class="kick">${ic('sparkle')}${S.lang==='ms'?'Stella · Perancang perjalanan AI':'Stella · AI trip planner'}</span><h3>${t('banner')}</h3><p>${t('bannerSub')}</p><span class="cta">${ic('sparkle')}${t('bannerCta')}</span></span></button></div>
      <div class="sec"><div class="sec-h"><h2>${t('reco')}</h2><button onclick="go('listing','act')">${t('seeAll')}</button></div>
        <div class="hscroll">${reco.map(([im,n,s,on])=>`<button class="rcard" onclick="${on}"><span class="im" style="display:block"><img src="${img(im)}" alt="" loading="lazy"></span><b>${n}</b><small>${s}</small></button>`).join('')}</div></div>
      <div class="sec"><div class="sec-h"><h2>${t('events')}</h2><button onclick="go('events')">${t('seeAll')}</button></div>
        <div class="hscroll">${EVENTS.map(e=>`<button class="evcard" onclick="go('event','${e.id}')"><span class="im" style="display:block"><img src="${img(e.img)}" alt="" loading="lazy"><span class="date"><b>${e.d}</b><small>${e.m}</small></span></span><span class="bd" style="display:block"><b>${e.name}</b><small>${e.sub}</small></span></button>`).join('')}</div></div>
      <div class="sec"><div class="sec-h"><h2>${t('deals')}</h2><button onclick="go('listing','deal')">${t('seeAll')}</button></div>
        <div class="hscroll">${DEALS.map(d=>`<button class="dealcard ${d.c}" onclick="go('coupon','${d.id}')"><span class="big">${d.big}</span><b>${d.t}</b><small>${d.s}</small><span class="claim">${S.claimed.includes(d.id)?'Claimed ✓':'Claim'}</span></button>`).join('')}</div></div>
      <div class="sec"><div class="sec-h"><h2>${t('services')}</h2></div>
        <div class="svc">${[['wifi','eSIM & Internet','#EEF5FF','var(--blue)',"go('booking','v_esim')"],['car','Transport','#ECFBF3','var(--green)',"go('services')"],['medical','Medical Tourism','#FFF0F3','var(--red)',"go('booking','v_medical')"],['headset','Help 24/7','#F3EEFF','var(--purple)',"go('help')"]].map(([icn,l,bg,co,on])=>`<button onclick="${on}"><span class="ico" style="background:${bg};color:${co}">${ic(icn)}</span>${l}</button>`).join('')}</div></div>
    </div>`
  });
};

/* ---------- Notifications ---------- */
SCREENS.notifs = () => page({
  header: hdr('Notifications', {right:`<button class="ib" onclick="S.notifs.forEach(n=>n.read=true);refresh();toast('All marked as read')" aria-label="Mark all read">${ic('check')}</button>`}),
  body: `<div class="pad"><div class="list">${S.notifs.map(n=>`<button class="li" onclick="S.notifs.find(x=>x.id==='${n.id}').read=true;goto('${n.go}')" style="${n.read?'':'background:#F4F8FF'}"><span class="bub ${n.c}" style="width:42px;height:42px;flex-shrink:0">${ic(n.ic)}</span><span class="tx"><b>${n.t}</b><small>${n.s}</small></span><span class="small muted" style="align-self:flex-start">${n.time}${n.read?'':'<i style="display:block;width:8px;height:8px;border-radius:50%;background:var(--blue);margin:6px 0 0 auto"></i>'}</span></button>`).join('')}</div>
  <div class="row between" style="margin-top:18px;background:#fff;border-radius:16px;padding:14px 16px;box-shadow:var(--shadow)"><div><b style="font-size:14px">Push notifications</b><p class="small muted">Deals, safety alerts & trip reminders</p></div>${toggle(S.notifOn,"S.notifOn=!S.notifOn;refresh()",'Push notifications')}</div></div>`
});

/* ---------- Search ---------- */
SCREENS.search = () => {
  const html = page({
    header: `<div class="hdr"><button class="ib" onclick="back()" aria-label="Back">${ic('chevL')}</button><div class="search" style="height:46px">${ic('search')}<input id="q" placeholder="${t('search')}" oninput="doSearch(this.value)" aria-label="Search"></div></div>`,
    body: `<div id="sres">${searchResults('')}</div>`
  });
  stack[stack.length-1].after = () => $('#q') && $('#q').focus();
  return html;
};
function searchResults(q){
  q=q.trim().toLowerCase();
  if(!q) return `<div class="pad"><div class="list-label">Popular searches</div><div class="qchips">${['Island hopping','Mount Kinabalu','Seafood','Orangutan','Diving','Homestay','Kaamatan'].map(s=>`<button onclick="$('#q').value='${s}';doSearch('${s}')">${s}</button>`).join('')}</div>
    <div class="list-label">Trending destinations</div><div class="dl" style="padding:0">${DEST.slice(0,4).map(drow).join('')}</div></div>`;
  const ds = DEST.filter(d=>(d.name+d.tag+d.loc+d.desc).toLowerCase().includes(q));
  const its = Object.entries(ITEMS).filter(([k,v])=>(v.name+v.sub).toLowerCase().includes(q));
  const evs = EVENTS.filter(e=>(e.name+e.sub).toLowerCase().includes(q));
  if(!ds.length && !its.length && !evs.length) return `<div class="empty"><span class="bub c-blue">${ic('search')}</span><b>No results for “${q}”</b><p>Try another word, or let Stella find it for you.</p><button class="btn btn-primary btn-sm" onclick="go('stella',{prompt:'${q.replace(/'/g,'')}'})">Ask Stella</button></div>`;
  return `<div class="pad">${ds.length?`<div class="list-label">Destinations</div><div class="dl" style="padding:0">${ds.map(drow).join('')}</div>`:''}
    ${its.length?`<div class="list-label">Activities, food & stays</div><div class="stack">${its.map(([k,v])=>icard(k,v)).join('')}</div>`:''}
    ${evs.length?`<div class="list-label">Events</div><div class="list">${evs.map(e=>li({icon:'cal',title:e.name,sub:e.d+' '+e.m+' · '+e.sub,onclick:`go('event','${e.id}')`})).join('')}</div>`:''}</div>`;
}
function doSearch(v){ $('#sres').innerHTML = searchResults(v); }

/* ---------- Explore (destinations) ---------- */
const drow = d => `<div class="drow"><span class="th"><img src="${img(d.thumb)}" alt="" loading="lazy"></span><span class="tx"><button class="stretch" onclick="go('dest','${d.id}')"><b>${d.name}</b></button><small>${d.tag}</small><span class="meta">${stars(d.rating)}<span class="muted">(${d.reviews.toLocaleString()})</span><span class="row" style="gap:3px">${ic('pin')}${d.loc.split(',')[0]}</span></span></span>${heartBtn(d.id)}</div>`;
SCREENS.explore = () => {
  const f=S.exFilter;
  const list = f==='all'?DEST: f==='fav'?DEST.filter(d=>isFav(d.id)) : DEST.filter(d=>d.cat.includes(f));
  return page({ withFab:true,
    header: hdr('Destinations', {right:`<button class="ib" onclick="go('search')" aria-label="Search">${ic('search')}</button>`}),
    body: `<div class="chips" style="margin-bottom:14px">${[['all','All'],['nature','Nature'],['island','Island'],['adventure','Adventure'],['culture','Culture'],['wildlife','Wildlife'],['fav','♥ Saved']].map(([k,l])=>`<button class="chip ${f===k?'on':''}" onclick="S.exFilter='${k}';refresh()">${l}</button>`).join('')}</div>
    <div class="dl">${list.length?list.map(drow).join(''):`<div class="empty"><span class="bub c-red">${ic('heart')}</span><b>Nothing saved yet</b><p>Tap the heart on any destination to keep it here.</p></div>`}</div>`
  });
};

/* ---------- Destination detail ---------- */
const icard = (id, v, btn) => {
  const label = btn || ({act:'Book',food:'Reserve',stay:'Book',shop:'Directions',svc:'Buy'})[v.type];
  const action = v.type==='shop' ? `toast('Opening directions to ${v.name.replace(/'/g,'')}','nav')` : `go('booking','${id}')`;
  return `<div class="icard"><span class="stretch" onclick="${action}" aria-hidden="true"></span><span class="th"><img src="${img(v.img)}" alt="" loading="lazy"></span><span class="tx"><b>${v.name}</b><small>${v.sub}</small>
  <span class="pr"><span>${v.price?(v.type==='food'?'~'+rm(v.price)+' /pax':v.type==='stay'?rm(v.price)+'<s style="text-decoration:none"> /night</s>':rm(v.price)):'Free entry'}${v.old?`<s>${rm(v.old)}</s>`:''}</span>
  <button class="btn btn-soft btn-sm" onclick="event.stopPropagation();${action}" aria-label="${label} ${v.name.replace(/"/g,'')}">${label}</button></span>${v.deal?`<span class="pill green" style="margin-top:6px">${ic('tag')}${v.deal}</span>`:''}</span></div>`;
};
SCREENS.dest = (id) => {
  const d = destById(id); if(!d) return '';
  statusLight = true;
  const tabs=[['overview','Overview','home'],['attr','Attractions','mountain'],['act','Activities','activity'],['food','Food','food'],['stay','Stay','bed']];
  const T=S.dTab;
  let body='';
  if(T==='overview') body=`<p class="para">${d.desc}</p>
    <div class="facts" style="margin-top:16px"><div class="fact">${ic('pin')}<b>Location</b><span>${d.loc}</span></div><div class="fact">${ic('sun')}<b>Best time</b><span>${d.best}</span></div><div class="fact">${ic('users')}<b>Ideal for</b><span>${d.ideal}</span></div></div>
    <div class="bigimg" style="margin-top:16px"><img src="${img(d.gallery)}" alt="${d.name}"></div>
    <div class="row" style="gap:10px;margin-top:14px"><button class="btn btn-light btn-sm" style="flex:1" onclick="toast('Opening navigation to ${d.name}','nav')">${ic('nav')}Directions</button><button class="btn btn-light btn-sm" style="flex:1" onclick="go('stella',{prompt:'What is the weather in ${d.name}'})">${ic('sun')}Weather</button><button class="btn btn-light btn-sm" style="flex:1" onclick="shareIt('${d.name}')">${ic('share')}Share</button></div>
    <div class="info-box" style="margin-top:14px">${ic('ticket')}<span>Show your <b>Digital Tourist Pass</b> at park gates for faster entry and 10% off activities here.</span></div>`;
  if(T==='attr') body=`<div class="stack">${d.attractions.map(([n,s,im])=>`<div class="icard"><span class="th"><img src="${img(im)}" alt=""></span><span class="tx"><b>${n}</b><small>${s}</small><span class="pr"><span class="small muted" style="font-weight:500">${d.name}</span><button class="btn btn-soft btn-sm" style="height:32px" onclick="addToTrip('${n.replace(/'/g,'')}','${im}','${d.id}')">${ic('plus')}Add</button></span></span></div>`).join('')}</div>`;
  if(T==='act') body=`<div class="stack">${d.acts.map(k=>icard(k,ITEMS[k])).join('')||'<p class="muted">No activities listed yet.</p>'}</div>`;
  if(T==='food') body=`<div class="stack">${d.food.length?d.food.map(k=>icard(k,ITEMS[k])).join(''):`<div class="empty"><b>Bring a packed lunch</b><p>No restaurants inside this area. Your lodge includes meals.</p></div>`}</div>`;
  if(T==='stay') body=`<div class="stack">${d.stay.map(k=>icard(k,ITEMS[k])).join('')}</div>`;
  return page({ cls:'nohdr',
    body: `<div class="dhero"><img src="${img(d.img)}" alt="${d.name}"><div class="top"><button class="ib glass" onclick="back()" aria-label="Back">${ic('chevL')}</button><div class="r">${heartBtn(d.id,'ib glass hrt')}<button class="ib glass" onclick="shareIt('${d.name}')" aria-label="Share">${ic('share')}</button></div></div>
      <div class="tt"><h1>${d.name}</h1><p>${d.tag}</p><div class="row" style="gap:10px;margin-top:8px;font-size:12.5px">${stars(d.rating)}<span style="opacity:.85">${d.reviews.toLocaleString()} reviews</span></div></div></div>
      <div class="dbody"><div class="tabs" aria-label="Sections">${tabs.map(([k,l,icn])=>`<button class="${T===k?'on':''}" onclick="S.dTab='${k}';refresh()">${ic(icn)}${l}</button>`).join('')}</div>
      <div class="pad" style="padding-top:16px">${body}</div></div>`,
    footer: `<div class="row" style="gap:10px"><button class="ib" style="width:52px;height:52px;border-radius:16px" onclick="go('stella',{prompt:'Tell me about ${d.name}'})" aria-label="Ask Stella about ${d.name}"><img src="img/stella.jpg" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover;object-position:50% 35%"></button><button class="btn btn-primary" style="flex:1" onclick="planSheet('${d.id}')">${ic('cal')} Plan Your Trip</button></div>`
  });
};
function planSheet(id){
  const d=destById(id);
  sheet(`<h3>Plan ${d.name}</h3><p class="lead">Add it to your Sabah Adventure, or let Stella build the days around it.</p>
  <div class="list-label" style="margin-top:0">Add to a day of your trip</div>
  <div class="chips" style="padding:0 0 4px">${TRIP_DAYS.map((x,i)=>`<button class="chip" onclick="addToTrip('${d.name}','${d.thumb}','${d.id}',${i})">Day ${i+1} · ${x.date}</button>`).join('')}</div>
  <div class="stack" style="margin-top:14px">
  <button class="btn btn-primary btn-block" onclick="go('stella',{prompt:'Plan a trip including ${d.name}'})">${ic('sparkle')}Ask Stella to plan it</button>
  <button class="btn btn-soft btn-block" onclick="closeSheet();S.dTab='act';refresh()">${ic('ticket')}Book an activity</button></div>`);
}
function addToTrip(name, im, destId, day){
  if(day===undefined){ sheet(`<h3>Add “${name}”</h3><p class="lead">Choose a day of your trip.</p><div class="stack" style="gap:8px">${TRIP_DAYS.map((x,i)=>`<button class="opt" onclick="addToTrip('${name}','${im}','${destId}',${i})"><span class="radio"></span><span class="tx"><b>Day ${i+1} · ${x.title}</b><small>${x.date}</small></span></button>`).join('')}</div>`); return; }
  (S.extraDays[day] ||= []).push({tm:'Added', n:name, img:im, go:'dest:'+destId});
  closeSheet(); toast(`Added to Day ${day+1} of your trip`,'cal');
}
function shareIt(n){ if(navigator.share){ navigator.share({title:'Sabah GO', text:`${n} on Sabah GO`}).catch(()=>{}); } else toast('Link copied to clipboard','share'); }

/* ---------- Listing by category ---------- */
SCREENS.listing = (cat) => {
  const titles={act:['Activities','Tours, dives & adventures'],food:['Food & Dining','Taste of Sabah'],stay:['Stay','Hotels, resorts & homestays'],shop:['Shopping','Markets & crafts'],deal:['Packages & Deals','Exclusive for Sabah GO travellers'],svc:['Services','']};
  const [title,sub]=titles[cat]||['Explore',''];
  if(cat==='deal') return page({ header:hdr(title,{sub}), body:`<div class="pad stack">${DEALS.map(couponRow).join('')}
    <div class="list-label">Packages</div>${['a_island','a_climb','a_river'].map(k=>icard(k,{...ITEMS[k],name:ITEMS[k].name+' Package',deal:'Bundle with stay · save 15%'})).join('')}</div>` });
  const items = Object.entries(ITEMS).filter(([k,v])=>v.type===cat);
  const places=[...new Set(items.map(([k,v])=>v.dest).filter(Boolean))];
  const f=S.lsFilter;
  const shown = items.filter(([k,v])=>f==='all'||v.dest===f);
  return page({ withFab:true,
    header: hdr(title,{sub, right:`<button class="ib" onclick="go('search')" aria-label="Search">${ic('search')}</button>`}),
    body: `<div class="chips" style="margin-bottom:14px"><button class="chip ${f==='all'?'on':''}" onclick="S.lsFilter='all';refresh()">All</button>${places.map(p=>`<button class="chip ${f===p?'on':''}" onclick="S.lsFilter='${p}';refresh()">${destById(p).name}</button>`).join('')}</div>
    <div class="pad stack">${(shown.length?shown:items).map(([k,v])=>icard(k,v)).join('')}
    ${cat==='shop'?`<div class="info-box green">${ic('qr')}<span>Most market stalls accept the <b>Sabah GO QR</b> — pay in your own wallet, no cash needed.</span></div><button class="btn btn-green btn-block" onclick="go('scan')">${ic('scan')}Scan & Pay at a stall</button>`:''}</div>`
  });
};

/* ---------- Booking ---------- */
const BK_DATES = ['12 Nov','13 Nov','14 Nov','15 Nov','16 Nov','17 Nov','18 Nov'];
const BK_DAYS = ['Thu','Fri','Sat','Sun','Mon','Tue','Wed'];
SCREENS.booking = (id) => {
  const v=ITEMS[id]; if(!v) return '';
  const b = S.bk[id] ||= {date:0, time:0, adults: v.type==='svc'?1:2, kids:0, nights:2, addon:false};
  const stay=v.type==='stay', food=v.type==='food', svc=v.type==='svc';
  const times = food?['12:30','18:30','19:30','20:30']:['07:00','09:00','13:00','15:30'];
  let sub = stay ? v.price*b.nights : food ? 0 : v.price*(b.adults + b.kids*0.5);
  const addon = b.addon ? (stay?60*b.nights:20*(b.adults+b.kids)) : 0;
  const disc = (S.pass && v.type==='act') ? Math.round((sub)*0.10*100)/100 : 0;
  const total = sub + addon - disc;
  const qtyLabel = svc ? 'Quantity' : 'Adults';
  return page({ cls:'nohdr',
    body: `<div class="dhero" style="height:240px"><img src="${img(v.img)}" alt=""><div class="top"><button class="ib glass" onclick="back()" aria-label="Back">${ic('chevL')}</button><button class="ib glass" onclick="shareIt('${v.name.replace(/'/g,'')}')" aria-label="Share">${ic('share')}</button></div>
      <div class="tt" style="bottom:36px"><h1 style="font-size:24px">${v.name}</h1><p style="font-size:13px">${v.sub}</p></div></div>
    <div class="dbody" style="padding:18px 20px 0">
      <div class="row between"><div class="row" style="gap:10px;font-size:12.5px">${stars(v.rating)}<span class="muted">Free cancellation up to 24h</span></div>${v.dest?`<button class="btn-ghost small b" onclick="go('dest','${v.dest}')">${destById(v.dest).name} ›</button>`:''}</div>
      ${v.incl?`<div class="qchips" style="margin-top:12px">${v.incl.map(x=>`<span class="pill green">${ic('check')}${x}</span>`).join('')}</div>`:''}
      <div class="list-label">${stay?'Check-in date':food?'Reservation date':'Select date'}</div>
      <div class="hscroll" style="padding:4px 0 6px;gap:8px">${BK_DATES.map((d,i)=>`<button class="chip ${b.date===i?'on':''}" style="height:62px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:58px;padding:0 10px" onclick="S.bk['${id}'].date=${i};refresh()"><small style="font-size:11px;opacity:.8">${BK_DAYS[i]}</small><b style="font-size:15px">${d.split(' ')[0]}</b></button>`).join('')}</div>
      ${!stay&&!svc?`<div class="list-label">Time</div><div class="chips" style="padding:0">${times.map((x,i)=>`<button class="chip ${b.time===i?'on':''}" onclick="S.bk['${id}'].time=${i};refresh()">${x}</button>`).join('')}</div>`:''}
      <div class="list-label">${stay?'Stay':food?'Guests':'Guests'}</div>
      <div class="card" style="padding:4px 16px">
        ${stay?stepRow('Nights','',b.nights,`bkStep('${id}','nights',-1)`,`bkStep('${id}','nights',1)`,1):''}
        ${stepRow(stay?'Guests':qtyLabel, svc?'':'Age 13+', b.adults, `bkStep('${id}','adults',-1)`, `bkStep('${id}','adults',1)`,1)}
        ${!svc?stepRow('Children','Age 3–12 · 50%', b.kids, `bkStep('${id}','kids',-1)`, `bkStep('${id}','kids',1)`,0):''}
      </div>
      ${!food?`<div class="row between card" style="padding:14px 16px;margin-top:12px"><div><b style="font-size:14px">${stay?'Breakfast for all':svc?'Express delivery':'Hotel pickup'}</b><p class="small muted">${stay?'RM 60 / night':svc?'Included':'RM 20 per guest'}</p></div>${toggle(b.addon,`S.bk['${id}'].addon=!S.bk['${id}'].addon;refresh()`,'Add-on')}</div>`:''}
      ${food?`<div class="info-box green" style="margin-top:14px">${ic('tag')}<span>Reservations are free. Pay at the table with Sabah GO QR to get <b>${v.deal||'rewards points'}</b>.</span></div>`:`
      <div class="card" style="padding:12px 16px;margin-top:14px">
        <div class="sumrow"><span>${stay?`${rm(v.price)} × ${b.nights} nights`:`${rm(v.price)} × ${b.adults}${b.kids?` + ${b.kids} child`:''}`}</span><b>${rm(sub)}</b></div>
        ${addon?`<div class="sumrow"><span>Add-on</span><b>${rm(addon)}</b></div>`:''}
        ${disc?`<div class="sumrow"><span>Tourist Pass discount (10%)</span><b class="neg">− ${rm(disc)}</b></div>`:(v.type==='act'?`<div class="sumrow"><span class="small">Get 10% off with a Digital Tourist Pass</span><button class="btn-ghost small b" onclick="go('${S.mdac?'tec':'mdac'}')">Get pass</button></div>`:'')}
        <div class="sumrow tot"><span>Total</span><b>${rm(total)}</b></div>
        ${conv(total)?`<p class="small muted" style="text-align:right">${conv(total)}</p>`:''}
      </div>`}
    </div>`,
    footer: food
      ? `<button class="btn btn-primary btn-block" onclick="reserveTable('${id}')">${ic('cal')} Reserve table</button>`
      : `<button class="btn btn-primary btn-block" onclick="startCheckout({kind:'booking', id:'${id}', title:'${v.name.replace(/'/g,'')}', sub:'${BK_DATES[b.date]} 2026${stay?' · '+b.nights+' nights':''} · ${b.adults+b.kids} ${svc?'item':'guest'}${b.adults+b.kids>1?'s':''}', amount:${total.toFixed(2)}})">Continue · ${rm(total)}</button>`
  });
};
function stepRow(label, sub, val, minus, plus, min){
  return `<div class="row between" style="padding:12px 0;border-bottom:1px solid var(--line)"><div><b style="font-size:14px">${label}</b>${sub?`<p class="small muted">${sub}</p>`:''}</div>
  <div class="stepper"><button onclick="${minus}" ${val<=min?'disabled':''} aria-label="Fewer ${label}">${ic('minus')}</button><b>${val}</b><button onclick="${plus}" aria-label="More ${label}">${ic('plus')}</button></div></div>`;
}
function bkStep(id,k,d){ const b=S.bk[id]; b[k]=Math.max(k==='kids'?0:1, Math.min(10,b[k]+d)); refresh(); }
function reserveTable(id){
  const v=ITEMS[id], b=S.bk[id];
  loading('Reserving your table…',1000,()=>{ S.bookings.unshift({id:'b'+Date.now(), item:id, name:v.name, sub:`Table for ${b.adults+b.kids} · ${['12:30','18:30','19:30','20:30'][b.time]}`, date:BK_DATES[b.date]+' 2026', amt:0, ref:ref('SG-RS'), status:'Reserved'}); S.tripSeg='book'; tab('trips'); toast('Table reserved','cal'); });
}

/* ---------- Tourist Entry Contribution ---------- */
function tecCalc(){
  const T=S.tec, r=TEC_RATES[T.route].p;
  const a=T.adults*r, te=T.teens*r*0.5;
  const reb = T.sameDay ? Math.min(a, T.adults*10) + Math.min(te, T.teens*10) : 0;
  return {r, a, te, reb, total: a+te-reb};
}
SCREENS.tec = () => {
  const T=S.tec, c=tecCalc();
  return page({
    header: hdr('Tourist Entry Contribution', {sub:'Sumbangan Kemasukan Pelancong (TEC)'}),
    body: `<div class="pad">
      <div class="info-box">${ic('leaf')}<span>Your contribution funds Sabah's parks, marine protection, tourist safety and local communities — <b>100% reinvested</b> in tourism.</span></div>
      <div class="list-label">How are you entering Sabah?</div>
      <div class="route">${Object.entries(TEC_RATES).map(([k,v])=>`<button class="rt-tile ${T.route===k?'on':''}" onclick="S.tec.route='${k}';refresh()" aria-pressed="${T.route===k}"><span class="im" style="display:block"><img src="${img(v.img)}" alt=""><span class="ck">${ic('check')}</span></span><span class="bd"><span><b>${v.n}</b><small>${v.ms}</small></span><span class="p">RM${v.p}</span></span></button>`).join('')}</div>
      <div class="list-label">Arrival</div>
      <div class="card" style="padding:4px 16px">
        <div class="row between" style="padding:12px 0;border-bottom:1px solid var(--line)"><b style="font-size:14px">Arrival date</b><input type="date" value="${T.date}" onchange="S.tec.date=this.value" style="border:0;font-weight:600;color:var(--blue);background:none;font-size:14px" aria-label="Arrival date"></div>
        <div class="row between" style="padding:12px 0;gap:14px"><div><b style="font-size:14px">Leaving within 24 hours</b><p class="small muted">Day-trip rebate: RM10 per paying traveller</p></div>${toggle(T.sameDay,'S.tec.sameDay=!S.tec.sameDay;refresh()','Leaving within 24 hours')}</div>
      </div>
      <div class="list-label">Travellers</div>
      <div class="card" style="padding:4px 16px">
        ${stepRow('Adults','18 years & above · 100%',T.adults,"tecStep('adults',-1)","tecStep('adults',1)",1)}
        ${stepRow('Teens','13 – 17 years · 50%',T.teens,"tecStep('teens',-1)","tecStep('teens',1)",0)}
        ${stepRow('Children','12 years & below · Free',T.kids,"tecStep('kids',-1)","tecStep('kids',1)",0)}
      </div>
      <div class="list-label">Summary</div>
      <div class="card" style="padding:12px 16px">
        <div class="sumrow"><span>${TEC_RATES[T.route].n} rate × ${T.adults} adult${T.adults>1?'s':''}</span><b>${rm(c.a)}</b></div>
        ${T.teens?`<div class="sumrow"><span>Teens × ${T.teens} (50%)</span><b>${rm(c.te)}</b></div>`:''}
        ${T.kids?`<div class="sumrow"><span>Children × ${T.kids}</span><b>Free</b></div>`:''}
        ${c.reb?`<div class="sumrow"><span>24-hour rebate</span><b class="neg">− ${rm(c.reb)}</b></div>`:''}
        <div class="sumrow tot"><span>Net contribution</span><b>${rm(c.total)}</b></div>
        <div class="row between"><button class="btn-ghost small b" onclick="currencySheet()">${ic('swap','') .replace('<svg','<svg style="width:14px;display:inline;vertical-align:-2px"')} Show in ${S.cur==='MYR'?'my currency':S.cur}</button><span class="small muted">${conv(c.total)}</span></div>
      </div>
      <p class="small muted" style="line-height:1.55;margin-top:14px">Travellers who stay longer and use more facilities contribute more; day visitors, teens and children pay a fairer, lower rate.</p>
    </div>`,
    footer: `<button class="btn btn-primary btn-block" onclick="startCheckout({kind:'tec', title:'Tourist Entry Contribution', sub:'${TEC_RATES[T.route].n} · ${T.adults+T.teens+T.kids} traveller${T.adults+T.teens+T.kids>1?'s':''}', amount:${c.total.toFixed(2)}})">Continue to payment · ${rm(c.total)}</button>`
  });
};
function tecStep(k,d){ S.tec[k]=Math.max(k==='adults'?1:0, Math.min(9,S.tec[k]+d)); refresh(); }

/* ---------- Checkout (all payment rails) ---------- */
function startCheckout(o){ S.checkout=o; if(o.kind==='topup' && S.method==='wallet') S.method='visa'; go('pay'); }
SCREENS.pay = () => {
  const o=S.checkout; if(!o) return '';
  const groups = RAILS.map(g=>({...g, items:g.items.filter(it=>!(o.kind==='topup'&&it[0]==='wallet'))})).filter(g=>g.items.length);
  const m = RAILS.flatMap(g=>g.items).find(x=>x[0]===S.method);
  return page({
    header: hdr('Payment', {sub:'Secure · PCI DSS · BNM RMiT'}),
    body: `<div class="pad">
      <div class="card" style="padding:18px;text-align:center;background:var(--gradNavy);color:#fff">
        <small style="opacity:.8">${o.title}</small>
        <div style="font-size:34px;font-weight:800;margin-top:2px">${rm(o.amount)}</div>
        <p class="small" style="opacity:.8">${o.sub||''}</p>
        <button class="pill white" style="margin-top:10px;min-height:44px;padding:0 14px" onclick="currencySheet()">${ic('globe')} ${S.cur==='MYR'?'Show in my currency':conv(o.amount)}</button>
      </div>
      ${groups.map(g=>`<div class="grp">${g.g}</div><div class="stack" style="gap:8px">${g.items.map(([k,n,s,logo])=>`<button class="opt ${S.method===k?'on':''}" onclick="S.method='${k}';refresh()"><span class="radio"></span><span class="tx"><b>${n}</b><small>${k==='wallet'?'Balance '+rm(S.balance):s}</small></span>${logo?`<span class="lg2"><img src="img/${logo}.png" alt="${n}"></span>`:`<span class="lg2" style="background:var(--grad);border:0;color:#fff">${ic('wallet')}</span>`}</button>`).join('')}</div>`).join('')}
      <div class="info-box green" style="margin-top:18px">${ic('lock')}<span>One QR, every rail. No card data is stored on your phone; all transactions are kept in Malaysia under PDPA.</span></div>
    </div>`,
    footer: `<button class="btn btn-primary btn-block" onclick="doPay()">${ic('lock')} Pay ${rm(o.amount)} with ${m?m[1]:'…'}</button>`
  });
};
function doPay(){
  const o=S.checkout, m=RAILS.flatMap(g=>g.items).find(x=>x[0]===S.method);
  if(S.method==='wallet' && S.balance < o.amount){
    sheet(`<div style="text-align:center"><span class="bub c-orange" style="margin:6px auto 14px;width:64px;height:64px">${ic('wallet')}</span><h3>Not enough balance</h3><p class="lead">You need ${rm(o.amount-S.balance)} more. Top up your wallet or choose another payment method.</p></div>
    <div class="stack"><button class="btn btn-primary btn-block" onclick="S.topAmt=Math.ceil((${o.amount}-S.balance)/50)*50;go('topup')">Top up wallet</button><button class="btn btn-soft btn-block" onclick="closeSheet();S.method='visa';refresh()">Use Visa instead</button></div>`);
    return;
  }
  const isRedirect = ['alipay','wechat','unionpay','paynow','promptpay','qris','duitnow','fpx'].includes(S.method);
  loading(isRedirect?`Authorising with ${m[1]}…`:'Processing payment…', 1600, ()=>finishPay(o, m));
}
function finishPay(o, m){
  const id='t'+Date.now(), r=ref('SG');
  const mName = m[0]==='visa'?'Visa •••• 4821':m[1];
  if(o.kind==='topup'){ S.balance+=o.amount; S.txns.unshift({id, t:'Top up', s:'From '+mName, amt:o.amount, d:now(), m:mName, ic:'plus', ref:r}); }
  else {
    if(S.method==='wallet') S.balance-=o.amount;
    const icn={tec:'ticket',booking:'cal',merchant:'store',bill:'receipt'}[o.kind]||'receipt';
    S.txns.unshift({id, t:o.title, s:o.sub, amt:-o.amount, d:now(), m:mName, ic:icn, ref:r});
    const pts=Math.floor(o.amount/10)*10; S.points+=pts; o.pts=pts;
  }
  if(o.kind==='tec'){
    S.pass={id:'SB-2611-'+(100000+rnd(899999)), until:'12 Dec 2026', issued:now(), route:TEC_RATES[S.tec.route].n, travellers:S.tec.adults+S.tec.teens+S.tec.kids};
    S.notifs=S.notifs.filter(n=>n.go!=='tec');
    S.notifs.unshift({id:'n'+Date.now(),ic:'ticket',c:'c-green',t:'Digital Tourist Pass issued',s:'Show it at entry, attractions and partner merchants.',time:'now',read:false,go:'pass'});
  }
  if(o.kind==='booking'){ const v=ITEMS[o.id]; S.bookings.unshift({id:'b'+Date.now(), item:o.id, name:v.name, sub:o.sub.split(' · ').slice(1).join(' · '), date:o.sub.split(' · ')[0], amt:o.amount, ref:r, status:'Confirmed'}); }
  if(o.kind==='merchant'){ S.merchant.sales+=o.amount; S.merchant.count++; }
  o.ref=r; o.method=mName; o.txn=id;
  replace('success');
}
SCREENS.success = () => {
  const o=S.checkout;
  const titles={tec:['Contribution paid','Your Digital Tourist Pass is ready. Terima kasih for supporting Sabah.'],booking:['Booking confirmed','We sent the ticket to your Trips and your email.'],merchant:['Payment successful',`Paid to ${o.title}. The merchant sees one payment; you see one receipt.`],topup:['Wallet topped up',`New balance ${rm(S.balance)}.`],bill:['Bill paid','Receipt saved to your wallet.']};
  const [h,p]=titles[o.kind]||titles.bill;
  const primary = {tec:[`View Digital Tourist Pass`,"tab('home');go('pass')"],booking:['View in Trips',"S.tripSeg='book';tab('trips')"],merchant:['Done',"tab('wallet')"],topup:['Back to Wallet',"tab('wallet')"],bill:['Back to Wallet',"tab('wallet')"]}[o.kind];
  return page({
    body: `<div class="okwrap"><div class="okc">${ic('check')}</div><h1>${h}</h1><p>${p}</p>
    <div class="card receipt">
      <div class="sumrow"><span>${o.kind==='topup'?'Amount added':'Amount paid'}</span><b style="font-size:17px">${rm(o.amount)}</b></div>
      ${conv(o.amount)?`<div class="sumrow"><span>In ${S.cur}</span><b>${conv(o.amount).slice(2)}</b></div>`:''}
      <div class="sumrow"><span>For</span><b style="text-align:right;max-width:60%">${o.title}</b></div>
      <div class="sumrow"><span>Method</span><b>${o.method}</b></div>
      <div class="sumrow"><span>Reference</span><b>${o.ref}</b></div>
      <div class="sumrow"><span>Date</span><b>${now()}</b></div>
      ${o.pts?`<div class="sumrow tot" style="font-size:13.5px"><span>Rewards earned</span><b style="font-size:15px;color:var(--okText)">+${o.pts} pts</b></div>`:''}
    </div>
    <button class="btn btn-ghost" style="margin-top:6px" onclick="toast('Receipt saved as PDF','download')">${ic('download')}Download receipt</button></div>`,
    footer: `<button class="btn btn-primary btn-block" onclick="${primary[1]}">${primary[0]}</button>`
  });
};

/* ---------- Digital Tourist Pass ---------- */
SCREENS.pass = () => {
  if(!S.pass) return page({ header:hdr('Digital Tourist Pass'), body:`<div class="empty" style="padding-top:60px"><span class="bub c-orange">${ic('ticket')}</span><b>No pass yet</b><p>Link your MDAC and pay the Tourist Entry Contribution to get your Digital Tourist Pass instantly.</p><button class="btn btn-primary" onclick="go('${S.mdac?'tec':'mdac'}')">${S.mdac?'Pay contribution':'Link MDAC'}</button></div>` });
  statusLight=true;
  const perks=[['ticket','Attraction access',"go('explore')"],['shield','Activity permits',"go('listing','act')"],['percent','Exclusive discounts',"go('listing','deal')"],['wallet','Cashless everywhere',"tab('wallet')"]];
  return page({ cls:'navyscr',
    header: hdr('Digital Tourist Pass',{cls:'dark', sub:'Pas Digital Pelancong Sabah', right:`<button class="ib" onclick="toast('Screen brightness raised for scanning','sun')" aria-label="Brighten screen">${ic('sun')}</button>`}),
    body: `<div class="pass"><div class="ph"><small>SABAH DIGITAL TOURIST PASS</small><h3>${S.user.name.toUpperCase()}</h3><div class="row" style="gap:8px;margin-top:6px"><span class="pill white">${S.user.flag} ${S.user.nat}</span><span class="pill white">${S.pass.route}</span></div></div>
      <div class="pb"><div class="qr">${qr(S.pass.id)}</div><span class="verified">${ic('shield')}Pass verified · MDAC linked</span>
      <div class="kv"><div><small>Passport</small><b>${S.user.passport}</b></div><div><small>Valid until</small><b>${S.pass.until}</b></div><div><small>Pass ID</small><b>${S.pass.id}</b></div><div><small>Travellers</small><b>${S.pass.travellers}</b></div></div></div></div>
      <div class="list-label pad" style="padding:0 20px">Your pass unlocks</div>
      <div class="perks">${perks.map(([i,l,on])=>`<button onclick="${on}"><span class="ico">${ic(i)}</span>${l}</button>`).join('')}</div>
      <div class="pad row" style="gap:10px;margin-top:16px"><button class="btn btn-light btn-sm" style="flex:1" onclick="toast('Added to Apple Wallet','wallet')">${ic('wallet')}Add to Wallet</button><button class="btn btn-light btn-sm" style="flex:1" onclick="toast('Pass saved as PDF','download')">${ic('download')}Save PDF</button></div>`
  });
};

/* ---------- Trips ---------- */
const TRIP_DAYS = [
  {date:'Thu, 12 Nov', title:'Arrive in Kota Kinabalu', items:[['10:30','Land at KKIA · show Tourist Pass','airport_sunset','pass'],['14:00','Check in · Shangri-La Tanjung Aru','resort23','booking:s_shangri'],['18:30','Sunset & Filipino Market dinner','jetty_sunset','dest:kk']]},
  {date:'Fri, 13 Nov', title:'Islands of Tunku Abdul Rahman Park', items:[['08:30','Ferry from Jesselton Point','boat','booking:v_ferry'],['10:00','Snorkel at Pulau Manukan','manukan','dest:manukan'],['17:30','Signal Hill sunset','city','dest:kk']]},
  {date:'Sat, 14 Nov', title:'Kinabalu Park & Kundasang', items:[['07:00','Kinabalu Park botanical trail','kinabalu_park','dest:kinabalu'],['12:00','Lunch · Tuaran mee','market2','booking:f_tuaran'],['14:30','Desa Dairy Farm','t_kundasang','dest:kundasang']]},
  {date:'Sun, 15 Nov', title:'Semporna Islands', items:[['06:45','Flight KK → Tawau','airport','dest:tawau'],['09:30','Island hopping · Bohey Dulang','islands','booking:a_island']]},
  {date:'Mon, 16 Nov', title:'Culture & Markets', items:[['09:30','Mari-Mari Cultural Village','marimari','dest:marimari'],['15:00','Handicraft Market shopping','crafts','listing:shop']]},
];
SCREENS.trips = () => {
  const seg=S.tripSeg;
  let body='';
  if(seg==='itin') body = TRIP_DAYS.map((d,i)=>{
    const items=[...d.items.map(([tm,n,im,g])=>({tm,n,img:im,go:g})), ...(S.extraDays[i]||[])];
    return `<div class="day"><div class="rail"><span class="n"><small>DAY</small><b>${i+1}</b></span>${i<TRIP_DAYS.length-1?'<span class="v"></span>':''}</div>
    <div class="items"><h4>${d.title}</h4><small>${d.date}</small>${items.map(x=>`<button class="tl" onclick="goto('${x.go}')"><img src="${img(x.img)}" alt="" loading="lazy"><span style="min-width:0"><span class="tm">${x.tm}</span><b>${x.n}</b></span>${ic('chevR','chev')}</button>`).join('')}
    <button class="btn-ghost small b" style="margin-top:8px;height:32px" onclick="go('explore')">${ic('plus').replace('<svg','<svg style="width:14px;display:inline;vertical-align:-2px"')} Add to day ${i+1}</button></div></div>`;}).join('')
    + `<div class="pad"><button class="btn btn-soft btn-block" onclick="go('stella',{prompt:'Optimise my 5-day itinerary'})">${ic('sparkle')}Ask Stella to optimise my days</button></div>`;
  if(seg==='book') body = S.bookings.length ? `<div class="pad stack">${S.bookings.map(b=>`<button class="icard" style="text-align:left;width:100%" onclick="go('bookingDetail','${b.id}')"><span class="th"><img src="${img(ITEMS[b.item].img)}" alt=""></span><span class="tx"><b>${b.name}</b><small>${b.date} · ${b.sub}</small><span class="pr"><span>${b.amt?rm(b.amt):'Pay at venue'}</span><span class="pill ${b.status==='Cancelled'?'red':'green'}">${b.status}</span></span></span></button>`).join('')}</div>`
    : `<div class="empty"><span class="bub c-blue">${ic('ticket')}</span><b>No bookings yet</b><p>Tours, stays and tickets you book will show here.</p><button class="btn btn-primary btn-sm" onclick="go('listing','act')">Browse activities</button></div>`;
  if(seg==='docs') body = `<div class="pad"><div class="list">
    ${li({icon:'ticket',c:'',title:'Digital Tourist Pass',sub:S.pass?S.pass.id+' · Active':'Not issued yet',onclick:"go('pass')"})}
    ${li({icon:'id',title:'MDAC · Digital Arrival Card',sub:S.mdac?'Verified with Immigration':'Not linked',onclick:"go('mdac')"})}
    ${li({icon:'receipt',title:'TEC receipt',sub:S.pass?'Paid · '+S.pass.issued:'Pending',onclick:S.pass?"go('receipt','"+(S.txns.find(x=>x.ic==='ticket')||{}).id+"')":"go('tec')"})}
    ${li({icon:'shield',title:'Travel insurance',sub:'Add cover from RM 18',onclick:"toast('Insurance partners coming soon','info')"})}
    ${li({icon:'plane',title:'Flight MH2600 · KUL → BKI',sub:'12 Nov · 08:05 – 10:40',onclick:"toast('Flight is on time','plane')"})}
  </div></div>`;
  return page({ nav:'trips', withFab:true,
    header: hdr('My Trip',{back:false, right:`<button class="ib" onclick="shareIt('My Sabah Adventure')" aria-label="Share trip">${ic('share')}</button>`}),
    body: `<div class="tripcard"><img src="img/villas.jpg" alt=""><span class="cd"><b>22</b><small>days to go</small></span><div class="tc"><h3>Sabah Adventure</h3><div class="m"><span>${ic('cal')}12 – 17 Nov 2026</span><span>${ic('users')}${S.tec.adults+S.tec.teens+S.tec.kids} traveller${S.tec.adults+S.tec.teens+S.tec.kids>1?'s':''}</span><span>${ic('pin')}5 places</span></div></div></div>
    <div class="seg" style="margin:16px 20px 18px">${[['itin','Itinerary'],['book','Bookings'],['docs','Documents']].map(([k,l])=>`<button class="${seg===k?'on':''}" onclick="S.tripSeg='${k}';refresh()">${l}</button>`).join('')}</div>${body}`
  });
};
SCREENS.bookingDetail = (id) => {
  const b=S.bookings.find(x=>x.id===id); if(!b) return '';
  const v=ITEMS[b.item]; const cancelled=b.status==='Cancelled';
  return page({
    header: hdr('Booking', {sub:b.ref}),
    body: `<div class="pass" style="margin-top:0"><div class="ph"><small>${({act:'ACTIVITY TICKET',stay:'HOTEL BOOKING',food:'TABLE RESERVATION',svc:'SERVICE'})[v.type]}</small><h3>${b.name}</h3><div class="row" style="gap:8px;margin-top:6px"><span class="pill white">${ic('cal')}${b.date}</span><span class="pill white">${b.sub}</span></div></div>
      <div class="pb">${cancelled?`<div class="empty" style="padding:20px"><span class="bub c-red">${ic('x')}</span><b>Booking cancelled</b><p>${b.amt?rm(b.amt)+' refunded to your Sabah GO Wallet.':''}</p></div>`:`<div class="qr" style="width:170px;height:170px">${qr(b.ref)}</div><span class="verified">${ic('check')}${b.status} · show at check-in</span>`}
      <div class="kv"><div><small>Reference</small><b>${b.ref}</b></div><div><small>Paid</small><b>${b.amt?rm(b.amt):'At venue'}</b></div><div><small>Guest</small><b>${S.user.name}</b></div><div><small>Location</small><b>${v.dest?destById(v.dest).name:'Sabah'}</b></div></div></div></div>
    <div class="pad stack" style="margin-top:16px;gap:10px">
      <div class="row" style="gap:10px"><button class="btn btn-light btn-sm" style="flex:1" onclick="toast('Opening directions','nav')">${ic('nav')}Directions</button><button class="btn btn-light btn-sm" style="flex:1" onclick="toast('Added to your calendar','cal')">${ic('cal')}Calendar</button><button class="btn btn-light btn-sm" style="flex:1" onclick="go('help')">${ic('headset')}Help</button></div>
      ${cancelled?'':`<button class="btn btn-danger btn-block" onclick="cancelSheet('${b.id}')">Cancel booking</button>`}
    </div>`
  });
};
function cancelSheet(id){
  const b=S.bookings.find(x=>x.id===id);
  sheet(`<h3>Cancel this booking?</h3><p class="lead">${b.name} · ${b.date}. ${b.amt?`${rm(b.amt)} will be refunded to your Sabah GO Wallet within minutes.`:'The venue will be notified.'}</p>
  <div class="stack"><button class="btn btn-danger btn-block" onclick="doCancel('${id}')">Yes, cancel booking</button><button class="btn btn-soft btn-block" onclick="closeSheet()">Keep booking</button></div>`);
}
function doCancel(id){
  const b=S.bookings.find(x=>x.id===id); b.status='Cancelled';
  if(b.amt){ S.balance+=b.amt; S.txns.unshift({id:'t'+Date.now(), t:'Refund · '+b.name, s:'Booking '+b.ref, amt:b.amt, d:now(), m:'Sabah GO Wallet', ic:'refresh'}); }
  closeSheet(); refresh(); toast(b.amt?'Refunded to wallet':'Booking cancelled');
}

/* ---------- Wallet ---------- */
const txRow = x => `<button class="li" onclick="go('receipt','${x.id}')"><span class="ico" style="${x.amt>0?'background:#E2F8EE;color:#0E8F57':''}">${ic(x.ic)}</span><span class="tx"><b>${x.t}</b><small>${x.d} · ${x.m}</small></span><span class="amt ${x.amt>0?'pos':''}">${x.amt>0?'+':'−'} ${rm(Math.abs(x.amt))}</span></button>`;
SCREENS.wallet = () => {
  statusLight=true;
  const acts=[['scan','Scan & Pay',"go('scan')"],['receipt','Pay Bills',"go('bills')"],['plus','Top Up',"go('topup')"],['card','Cards',"go('methods','card')"],['wallet','eWallet',"go('methods','ewallet')"],['globe','International',"go('methods','intl')"]];
  return page({ nav:'wallet', cls:'navyscr',
    header: `<header class="hdr dark"><span class="av" style="width:42px;height:42px;font-size:15px;border-width:2px">${S.user.name.split(' ').map(x=>x[0]).join('')}</span><div class="hdr-t" style="text-align:left"><h1>Sabah GO Wallet</h1><p>Sabah Pay · official payment gateway</p></div><button class="ib" onclick="go('myqr')" aria-label="My QR code">${ic('qr')}</button></header>`,
    body: `<div class="bal"><small>eWallet balance</small><div class="amt">${rm(S.balance)}</div>${conv(S.balance)?`<small>${conv(S.balance)}</small>`:''}<button class="add" onclick="go('topup')" aria-label="Top up">${ic('plus')}</button>
      <div class="sub"><span>${ic('shield')}Protected</span><span>${ic('gift')}${S.points.toLocaleString()} pts</span><span>${ic('globe')}12 rails</span></div></div>
      <div class="wact">${acts.map(([i,l,on],k)=>`<button onclick="${on}">${ic(i)}${l}</button>`).join('')}</div>
      <div class="sec"><div class="sec-h"><h2>Popular services</h2></div><div class="svc" style="grid-template-columns:repeat(3,1fr)">${[['bed','Stays','#F3EEFF','var(--purple)',"go('listing','stay')"],['activity','Activities','#FFF4E6','var(--orange)',"go('listing','act')"],['food','Food','#ECFBF3','var(--green)',"go('listing','food')"]].map(([icn,l,bg,co,on])=>`<button onclick="${on}"><span class="ico" style="background:${bg};color:${co}">${ic(icn)}</span>${l}</button>`).join('')}</div></div>
      <div class="sec"><div class="sec-h"><h2>Recent transactions</h2><button onclick="go('history')">See all</button></div><div class="pad"><div class="list">${S.txns.slice(0,4).map(txRow).join('')}</div></div></div>`
  });
};
SCREENS.history = () => page({ header:hdr('Transactions',{sub:`${S.txns.length} this trip`}), body:`<div class="pad"><div class="list">${S.txns.map(txRow).join('')}</div></div>` });
SCREENS.receipt = (id) => {
  const x=S.txns.find(t=>t.id===id); if(!x) return page({header:hdr('Receipt'),body:'<div class="empty"><b>Receipt not found</b></div>'});
  return page({ header:hdr('Receipt'),
    body:`<div class="pad"><div class="card" style="padding:22px 18px;text-align:center"><span class="bub ${x.amt>0?'c-green':'c-blue'}" style="margin:0 auto 10px">${ic(x.ic)}</span><b style="font-size:16px">${x.t}</b><div style="font-size:30px;font-weight:800;margin-top:6px;color:${x.amt>0?'var(--okText)':'var(--ink)'}">${x.amt>0?'+':'−'} ${rm(Math.abs(x.amt))}</div><span class="verified">${ic('check')}Successful</span>
    <div style="text-align:left;margin-top:16px;border-top:1.5px dashed var(--line);padding-top:10px">${[['Details',x.s],['Date',x.d],['Method',x.m],['Reference',x.ref||'SG-'+x.id.slice(-6).toUpperCase()],['Includes','Tourism levy settled automatically']].map(([k,v])=>`<div class="sumrow"><span>${k}</span><b style="text-align:right;max-width:62%">${v}</b></div>`).join('')}</div></div>
    <div class="row" style="gap:10px;margin-top:14px"><button class="btn btn-light btn-sm" style="flex:1" onclick="toast('Receipt saved as PDF','download')">${ic('download')}Save</button><button class="btn btn-light btn-sm" style="flex:1" onclick="shareIt('Receipt')">${ic('share')}Share</button><button class="btn btn-light btn-sm" style="flex:1" onclick="go('help')">${ic('alert')}Report</button></div></div>` });
};
SCREENS.myqr = () => page({ header:hdr('My QR',{sub:'Receive money or show to merchant'}),
  body:`<div class="pad" style="text-align:center"><div class="card" style="padding:24px"><span class="av" style="margin:0 auto;width:56px;height:56px;font-size:19px">${S.user.name.split(' ').map(x=>x[0]).join('')}</span><b style="display:block;margin-top:10px;font-size:16px">${S.user.name}</b><p class="small muted">Sabah GO ID · ${S.user.email}</p><div style="width:220px;height:220px;margin:18px auto 0">${qr(S.user.email)}</div></div>
  <div class="row" style="gap:10px;margin-top:14px"><button class="btn btn-light btn-sm" style="flex:1" onclick="toast('QR saved to photos','image')">${ic('download')}Save</button><button class="btn btn-light btn-sm" style="flex:1" onclick="shareIt('My Sabah GO QR')">${ic('share')}Share</button><button class="btn btn-primary btn-sm" style="flex:1" onclick="go('scan')">${ic('scan')}Scan</button></div></div>` });

/* ---------- Scan & Pay ---------- */
SCREENS.scan = () => {
  statusLight=true; darkBottom=true;
  return `<div class="scr"><div class="scan"><div class="cam"></div>
    <header class="hdr dark" style="position:relative"><button class="ib" onclick="back()" aria-label="Close scanner">${ic('x')}</button><div class="hdr-t"><h1>Scan & Pay</h1></div><button class="ib" onclick="toast('Scan any Sabah GO, DuitNow, Alipay+ or PayNow QR','info')" aria-label="Help">${ic('info')}</button></header>
    <button class="frame" onclick="scanned()" aria-label="Simulate scanning a merchant QR"><span class="qrghost">${qr('fattkee','#222')}</span><span class="corner c1"></span><span class="corner c2"></span><span class="corner c3"></span><span class="corner c4"></span><span class="line"></span></button>
    <div class="hint">Point at any merchant QR code<small>Tap the frame to simulate a scan</small></div>
    <div class="rails">${['pay_duitnow','pay_alipay','pay_wechat','pay_paynow','pay_qris','pay_promptpay'].map(l=>`<span><img src="img/${l}.png" alt=""></span>`).join('')}</div>
    <div class="tools"><button onclick="S.torch=!S.torch;refresh()"><span class="c ${S.torch?'on':''}">${ic('flash')}</span>Torch</button><button onclick="toast('Reading QR from photo…','image');setTimeout(scanned,900)"><span class="c">${ic('image')}</span>Gallery</button><button onclick="replace('myqr')"><span class="c">${ic('qr')}</span>My QR</button></div>
  </div></div>`;
};
function scanned(){ if(navigator.vibrate) navigator.vibrate(30); S.kp=''; replace('merchantPay','fattkee'); }
SCREENS.merchantPay = () => {
  const v=parseFloat(S.kp||'0');
  return page({
    header: hdr('Pay merchant'),
    body: `<div class="pad"><div class="card row" style="padding:14px;gap:12px"><img src="img/seafood.jpg" alt="" style="width:52px;height:52px;border-radius:14px;object-fit:cover"><div style="flex:1"><b>Kedai Kopi Fatt Kee</b><p class="small muted">Jalan Bakau, Kota Kinabalu</p></div><span class="pill green">${ic('shield')}Licensed</span></div></div>
    <div class="amtdisp"><small>Enter amount</small><div class="v"><span>RM</span>${S.kp||'0'}</div>${conv(v)?`<small>${conv(v)}</small>`:'<small>&nbsp;</small>'}</div>
    <div class="chips" style="justify-content:center;margin-bottom:14px">${[10,25,50,100].map(a=>`<button class="chip" onclick="S.kp='${a}';refresh()">RM ${a}</button>`).join('')}</div>
    <div class="keys">${['1','2','3','4','5','6','7','8','9','.','0','del'].map(k=>`<button onclick="kp('${k}')" aria-label="${k==='del'?'Delete':k}">${k==='del'?ic('chevL'):k}</button>`).join('')}</div>`,
    footer: `<button class="btn btn-primary btn-block" ${v>0?'':'disabled'} onclick="startCheckout({kind:'merchant', title:'Kedai Kopi Fatt Kee', sub:'Merchant QR payment', amount:${v}})">Pay ${rm(v)}</button>`
  });
};
function kp(k){ let s=S.kp; if(k==='del') s=s.slice(0,-1); else if(k==='.'){ if(!s.includes('.')) s=(s||'0')+'.'; } else { if(s.includes('.')&&s.split('.')[1].length>=2) return; if(s==='0') s=''; if(s.replace('.','').length>=6) return; s+=k; } S.kp=s; refresh(); }

/* ---------- Top up / bills / methods ---------- */
SCREENS.topup = () => page({
  header: hdr('Top Up Wallet'),
  body: `<div class="amtdisp"><small>Amount</small><div class="v"><span>RM</span>${S.topAmt}</div><small>${conv(S.topAmt)||'&nbsp;'}</small></div>
  <div class="pad"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${[50,100,200,300,500,1000].map(a=>`<button class="chip ${S.topAmt===a?'on':''}" style="height:52px;border-radius:16px;font-weight:600;font-size:15px" onclick="S.topAmt=${a};refresh()">RM ${a}</button>`).join('')}</div>
  <label class="field" style="margin-top:16px"><span>Or enter amount</span><input class="inp" type="number" min="10" max="5000" value="${S.topAmt}" onchange="S.topAmt=Math.max(10,Math.min(5000,+this.value||10));refresh()"></label>
  <div class="info-box">${ic('info')}<span>Top up with a foreign card, Alipay+, WeChat Pay or regional QR. Unused balance is refunded to the source when you leave Sabah.</span></div></div>`,
  footer: `<button class="btn btn-primary btn-block" onclick="startCheckout({kind:'topup', title:'Wallet top up', sub:'Sabah GO Wallet', amount:S.topAmt})">Continue · ${rm(S.topAmt)}</button>`
});
const BILLS=[['Sabah Parks entry fee','Kinabalu Park · foreigner adult',50,'mountain'],['Sipadan diving permit','Sabah Parks · per day',140,'ship'],['Marine park conservation fee','Tunku Abdul Rahman Park',25,'leaf'],['City parking','DBKK · 3 hours',6,'car'],['Hotel tourism tax','RM10 per room-night',20,'bed']];
SCREENS.bills = () => page({ header:hdr('Pay Bills',{sub:'Permits, park fees & levies'}),
  body:`<div class="pad"><div class="list">${BILLS.map((b,i)=>li({icon:b[3],title:b[0],sub:b[1],right:`<span class="amt">${rm(b[2])}</span>`,onclick:`billSheet(${i})`})).join('')}</div>
  <div class="info-box" style="margin-top:14px">${ic('shield')}<span>Payments go straight to the State agency account — every ringgit can be audited.</span></div></div>` });
function billSheet(i){ const b=BILLS[i]; sheet(`<h3>${b[0]}</h3><p class="lead">${b[1]}</p><div class="card" style="padding:10px 16px;box-shadow:none;background:var(--bg)"><div class="sumrow"><span>Payer</span><b>${S.user.name}</b></div><div class="sumrow"><span>Passport</span><b>${S.user.passport}</b></div><div class="sumrow tot"><span>Amount</span><b>${rm(b[2])}</b></div></div>
  <button class="btn btn-primary btn-block" style="margin-top:16px" onclick="startCheckout({kind:'bill', title:'${b[0]}', sub:'${b[1]}', amount:${b[2]}})">Pay ${rm(b[2])}</button>`); }
SCREENS.methods = (focus) => page({ header:hdr('Payment methods',{right:`<button class="ib" onclick="addCardSheet()" aria-label="Add card">${ic('plus')}</button>`}),
  body:`<div class="pad"><div class="card" style="padding:18px;background:linear-gradient(120deg,#1A1F71,#2B3A9A);color:#fff;border-radius:22px"><div class="row between"><b>Visa Debit</b><img src="img/pay_visa.png" alt="Visa" style="height:22px;background:#fff;border-radius:6px;padding:3px 6px"></div><div style="font-size:19px;letter-spacing:.14em;margin:26px 0 10px;font-weight:600">•••• •••• •••• 4821</div><div class="row between small" style="opacity:.85"><span>${S.user.name.toUpperCase()}</span><span>09/29</span></div></div>
  ${RAILS.slice(1).map(g=>`<div class="grp">${g.g}${(focus==='intl'&&g.g.includes('International'))||(focus==='ewallet'&&(g.g==='China'||g.g.includes('ASEAN')))?' · <span style="color:var(--blue)">suggested</span>':''}</div><div class="list">${g.items.map(([k,n,s,logo])=>`<div class="li"><span class="lg2" style="width:52px;height:36px;border-radius:9px;border:1px solid var(--line);display:grid;place-items:center;padding:4px;flex-shrink:0"><img src="img/${logo}.png" alt="" style="max-width:100%;max-height:100%;object-fit:contain"></span><span class="tx"><b>${n}</b><small>${k==='visa'?'Default · '+s:s}</small></span>${k==='visa'?'<span class="pill green">Linked</span>':`<button class="btn btn-soft btn-sm" onclick="toast('${n} linked','check');this.outerHTML='<span class=&quot;pill green&quot;>Linked</span>'">Link</button>`}</div>`).join('')}</div>`).join('')}</div>` });
function addCardSheet(){ sheet(`<h3>Add a card</h3><p class="lead">Visa, Mastercard, JCB, UnionPay or Amex. Card details are tokenised by our licensed acquirer.</p>
  <label class="field"><span>Card number</span><input class="inp" inputmode="numeric" placeholder="0000 0000 0000 0000" autocomplete="cc-number"></label>
  <div class="row" style="gap:10px"><label class="field" style="flex:1"><span>Expiry</span><input class="inp" placeholder="MM/YY" autocomplete="cc-exp"></label><label class="field" style="flex:1"><span>CVV</span><input class="inp" placeholder="•••" inputmode="numeric" autocomplete="cc-csc"></label></div>
  <button class="btn btn-primary btn-block" onclick="closeSheet();toast('Card added securely','card')">Add card</button>`); }

/* ---------- Rewards ---------- */
const couponRow = d => `<button class="coupon" onclick="go('coupon','${d.id}')"><span class="l ${d.c}"><b>${d.big}</b><small>${d.code}</small></span><span class="r"><b>${d.t}</b><small>${d.s}</small>${S.claimed.includes(d.id)?`<span class="pill green">${ic('check')}Claimed · tap to use</span>`:`<span class="pill">Claim now</span>`}</span></button>`;
const REDEEM=[['RM 5 wallet credit',500,'wallet'],['Free ferry to Manukan',1500,'ship'],['Mari-Mari tour 50% off',2000,'users'],['Night at Kinabalu Pine Resort',6000,'bed']];
SCREENS.rewards = () => {
  statusLight=true;
  const next=5000, pct=Math.min(100, S.points/next*100);
  return page({ nav:'rewards', cls:'rwscr',
    header: hdr('My Rewards',{back:false, cls:'dark', right:`<button class="ib" onclick="go('pointsInfo')" aria-label="How points work">${ic('info')}</button>`}),
    body: `<div class="navyblock"><button class="tier" onclick="go('pointsInfo')"><span class="crown">${ic('crown')}</span><span style="flex:1"><b>${S.points>=next?'Gold':'Silver'} Traveller</b><small>${S.points>=next?'Top tier unlocked':`${(next-S.points).toLocaleString()} pts to Gold`}</small><span class="prog" style="display:block"><i style="width:${pct}%"></i></span></span>${ic('chevR','chev')}</button>
      <div class="pts"><b>${S.points.toLocaleString()}</b><span style="opacity:.8">points</span></div>
      <button class="rw-row" onclick="go('coupon','d_cash')"><span class="ic c-red">${ic('gift')}</span><b>RM 120 Cashback</b>${ic('chevR','chev')}</button>
      <button class="rw-row" onclick="go('listing','deal')"><span class="ic c-gold">${ic('star')}</span><b>Exclusive Offers</b>${ic('chevR','chev')}</button>
      <button class="rw-row" onclick="go('partners')"><span class="ic c-green">${ic('percent')}</span><b>Partner Deals</b>${ic('chevR','chev')}</button>
      <button class="rw-row" onclick="go('coupon','d_attr')"><span class="ic c-blue">${ic('ticket')}</span><b>10% OFF Attractions</b>${ic('chevR','chev')}</button></div>
      <div class="sec"><div class="sec-h"><h2>Redeem points</h2></div><div class="pad"><div class="list">${REDEEM.map(([n,p,i],k)=>`<div class="li"><span class="ico">${ic(i)}</span><span class="tx"><b>${n}</b><small>${p.toLocaleString()} pts</small></span><button class="btn ${S.points>=p?'btn-primary':'btn-soft'} btn-sm" ${S.points>=p?'':'disabled style="opacity:.5"'} onclick="redeem(${k})">Redeem</button></div>`).join('')}</div></div></div>
      <div class="sec"><div class="sec-h"><h2>My coupons</h2><button onclick="go('listing','deal')">More</button></div><div class="pad stack">${DEALS.slice(0,3).map(couponRow).join('')}</div></div>`
  });
};
function redeem(k){ const [n,p]=REDEEM[k];
  sheet(`<h3>Redeem ${n}?</h3><p class="lead">${p.toLocaleString()} points will be deducted. You'll have ${(S.points-p).toLocaleString()} left.</p><div class="stack"><button class="btn btn-primary btn-block" onclick="doRedeem(${k})">Redeem now</button><button class="btn btn-soft btn-block" onclick="closeSheet()">Not now</button></div>`); }
function doRedeem(k){ const [n,p]=REDEEM[k]; S.points-=p; if(k===0){ S.balance+=5; S.txns.unshift({id:'t'+Date.now(),t:'Points redeemed',s:'500 pts → RM 5',amt:5,d:now(),m:'Rewards',ic:'gift'}); } closeSheet(); refresh(); toast(`${n} redeemed`,'gift'); }
SCREENS.coupon = (id) => {
  const d=DEALS.find(x=>x.id===id); const c=S.claimed.includes(id);
  return page({ header:hdr('Coupon'),
    body:`<div class="pad"><div class="card" style="overflow:hidden"><div class="cpn-hd ${d.c}" style="padding:26px 20px;color:#fff;text-align:center"><div style="font-size:44px;font-weight:800;line-height:1">${d.big}</div><b style="font-size:17px;display:block;margin-top:6px">${d.t}</b><small style="opacity:.9">${d.s}</small></div>
    <div style="padding:20px;text-align:center">${c?`<div style="width:160px;height:160px;margin:0 auto">${qr(d.code)}</div><p class="small muted" style="margin-top:8px">Show at checkout or enter code</p>`:''}<div style="display:inline-flex;gap:10px;align-items:center;margin-top:10px;padding:10px 16px;border:2px dashed #C7D6EE;border-radius:14px;font-weight:700;letter-spacing:.1em">${d.code}<button class="btn-ghost" onclick="toast('Code copied','check')" aria-label="Copy code">${ic('receipt')}</button></div></div></div>
    <div class="list-label">Terms</div><div class="card para" style="padding:14px 16px;font-size:12.5px">Valid until 31 Dec 2026 for Sabah GO users with a Digital Tourist Pass. One use per traveller. Not combinable with other promotions. Merchant must be a licensed Sabah GO partner.</div></div>`,
    footer: c ? `<button class="btn btn-primary btn-block" onclick="${id==='d_cash'?"go('listing','stay')":id==='d_esim'?"go('booking','v_esim')":id==='d_dive'?"go('booking','a_sipadan')":id==='d_fnb'?"go('listing','food')":"go('listing','act')"}">Use now</button>`
      : `<button class="btn btn-primary btn-block" onclick="S.claimed.push('${id}');refresh();toast('Coupon claimed','gift')">Claim coupon</button>`
  });
};
SCREENS.partners = () => page({ header:hdr('Partner Deals',{sub:'Licensed Sabah GO merchants'}),
  body:`<div class="pad stack">${[['f_fattkee','15% off total bill'],['s_shangri','RM120 cashback'],['a_river','Free night walk'],['v_car','Day 3 free'],['p_handicraft','10% off crafts']].map(([k,d])=>icard(k,{...ITEMS[k],deal:d})).join('')}</div>` });
SCREENS.pointsInfo = () => page({ header:hdr('How rewards work'),
  body:`<div class="pad"><div class="list">${[['star','Earn 10 pts per RM10','On every Sabah GO payment and booking'],['crown','Silver → Gold at 5,000 pts','Gold: priority support, lounge access at KKIA, 15% off attractions'],['gift','Redeem anytime','Wallet credit, ferry rides, tours and stays'],['leaf','Bonus for eco choices','+200 pts for homestays and conservation tours']].map(([i,a,b])=>li({icon:i,title:a,sub:b,onclick:"",chev:false})).join('')}</div>
  <div class="list-label">Points history</div><div class="list">${S.txns.filter(x=>x.amt<0).slice(0,5).map(x=>`<div class="li"><span class="ico">${ic('star')}</span><span class="tx"><b>${x.t}</b><small>${x.d}</small></span><span class="amt pos">+${Math.floor(Math.abs(x.amt)/10)*10}</span></div>`).join('')}</div></div>` });

/* ---------- Events ---------- */
SCREENS.events = () => page({ header:hdr('Festivals & Events',{sub:'Promosi dan festival Sabah'}),
  body:`<div class="pad stack">${EVENTS.map(e=>`<button class="icard" style="text-align:left;width:100%" onclick="go('event','${e.id}')"><span class="th"><img src="${img(e.img)}" alt=""></span><span class="tx"><b>${e.name}</b><small>${e.d} ${e.m} 2026 · ${e.sub}</small><span class="pr"><span class="small" style="color:var(--ink2);font-weight:500">${S.reminders.includes(e.id)?'🔔 Reminder on':'Free entry'}</span>${ic('chevR','chev')}</span></span></button>`).join('')}</div>` });
SCREENS.event = (id) => {
  const e=EVENTS.find(x=>x.id===id); const on=S.reminders.includes(id);
  statusLight=true;
  return page({
    body:`<div class="dhero" style="height:280px"><img src="${img(e.img)}" alt=""><div class="top"><button class="ib glass" onclick="back()" aria-label="Back">${ic('chevL')}</button><button class="ib glass" onclick="shareIt('${e.name}')" aria-label="Share">${ic('share')}</button></div><div class="tt"><h1 style="font-size:28px">${e.name}</h1><p>${e.sub}</p></div></div>
    <div class="dbody" style="padding:20px 20px 0"><div class="facts"><div class="fact">${ic('cal')}<b>Date</b><span>${e.d} ${e.m} 2026</span></div><div class="fact">${ic('clock')}<b>Time</b><span>9am – 11pm</span></div><div class="fact">${ic('ticket')}<b>Entry</b><span>Free</span></div></div>
    <p class="para" style="margin-top:16px">${e.desc}</p>
    <div class="row between card" style="padding:14px 16px;margin-top:16px"><div><b style="font-size:14px">Remind me</b><p class="small muted">A day before, with transport tips</p></div>${toggle(on,`toggleRem('${id}')`,'Remind me')}</div></div>`,
    footer:`<div class="row" style="gap:10px"><button class="btn btn-soft" style="flex:1" onclick="toast('Opening directions','nav')">${ic('nav')}Directions</button><button class="btn btn-primary" style="flex:1.4" onclick="addToTrip('${e.name}','${e.img}','kk')">${ic('cal')}Add to trip</button></div>`
  });
};
function toggleRem(id){ if(S.reminders.includes(id)){ S.reminders=S.reminders.filter(x=>x!==id); toast('Reminder off','bell'); } else { S.reminders.push(id); toast('We will remind you','bell'); } refresh(); }

/* ---------- Services & Help ---------- */
SCREENS.services = () => page({ withFab:true, header:hdr('Traveller Services',{sub:'Perkhidmatan pelancong'}),
  body:`<div class="pad">
  <div class="list-label" style="margin-top:4px">Connectivity</div><div class="list">${li({icon:'wifi',title:'eSIM & Internet',sub:'From RM 25 · instant activation',onclick:"go('booking','v_esim')"})}</div>
  <div class="list-label">Transport</div><div class="list">
    ${li({icon:'car',title:'E-hailing ride',sub:'Grab & local drivers · pay in wallet',onclick:'rideSheet()'})}
    ${li({icon:'ship',title:'Ferry tickets',sub:'Jesselton Point to the islands',onclick:"go('booking','v_ferry')"})}
    ${li({icon:'bus',title:'Airport Express Bus',sub:'KKIA ↔ city every 30 min',onclick:"go('booking','v_bus')"})}
    ${li({icon:'car',title:'Car rental',sub:'From RM 130 / day',onclick:"go('booking','v_car')"})}</div>
  <div class="list-label">Health & guidance</div><div class="list">
    ${li({icon:'medical',title:'Medical tourism',sub:'Health screening & wellness packages',onclick:"go('booking','v_medical')"})}
    ${li({icon:'nav',title:'Navigation & guides',sub:'Offline maps · licensed guides',onclick:"toast('Offline map of Sabah downloaded','nav')"})}
    ${li({icon:'lang',title:'Translation',sub:'Bahasa Malaysia, Kadazan & 12 languages',onclick:"go('stella',{prompt:'Translate basic phrases'})"})}
    ${li({icon:'headset',title:'Help 24/7',sub:'Emergency & traveller support',onclick:"go('help')"})}</div></div>` });
function rideSheet(){ sheet(`<h3>Book a ride</h3><p class="lead">Pay with Sabah GO Wallet. Licensed drivers only.</p>
  <label class="field"><span>Pickup</span><input class="inp" value="Shangri-La Tanjung Aru"></label><label class="field"><span>Drop-off</span><input class="inp" value="Jesselton Point Ferry Terminal"></label>
  <div class="card" style="padding:10px 16px;box-shadow:none;background:var(--bg);margin-bottom:14px"><div class="sumrow"><span>Estimated fare</span><b>RM 14.00</b></div><div class="sumrow"><span>Arrives in</span><b>4 min</b></div></div>
  <button class="btn btn-primary btn-block" onclick="closeSheet();loading('Finding a driver…',1300,()=>toast('Ahmad · Perodua Myvi SAB 4821 · 4 min','car'))">Confirm ride</button>`); }
SCREENS.help = () => page({
  header: hdr('Help 24/7',{sub:'Bantuan pelancong'}),
  body: `<div class="pad">
    <button class="card row" style="width:100%;padding:16px;gap:14px;background:linear-gradient(120deg,#E8345E,#FF6B8B);color:#fff;text-align:left" onclick="callSheet('999','Emergency (Police, Ambulance, Fire)')"><span class="bub" style="background:rgba(255,255,255,.2);box-shadow:none">${ic('phone')}</span><span style="flex:1"><b style="font-size:17px">Emergency · 999</b><small style="display:block;opacity:.9">Police, ambulance & fire. Shares your location.</small></span>${ic('chevR','chev')}</button>
    <div class="list-label">Talk to someone</div><div class="list">
      ${li({icon:'msg',title:'Chat with Stella',sub:'Instant answers in your language',onclick:"go('stella')"})}
      ${li({icon:'headset',title:'Tourist hotline',sub:'+60 88-212 121 · 24 hours',onclick:"callSheet('+6088212121','Sabah Tourism hotline')"})}
      ${li({icon:'shield',title:'Tourist Police',sub:'Kota Kinabalu Tourist Police Unit',onclick:"callSheet('+6088258191','Tourist Police')"})}
      ${li({icon:'medical',title:'Nearest hospital',sub:'Queen Elizabeth Hospital · 6.1 km',onclick:"toast('Opening directions to hospital','nav')"})}
      ${li({icon:'globe',title:'My embassy',sub:`${S.user.nat} · contact & location`,onclick:"toast('Embassy details opened','globe')"})}</div>
    <div class="list-label">Report an issue</div>
    <div class="card" style="padding:16px"><label class="field"><span>Type</span><select class="inp" id="rtype"><option>Overcharging / scam</option><option>Lost item</option><option>Unlicensed operator</option><option>Safety concern</option><option>Payment problem</option></select></label>
    <label class="field"><span>What happened?</span><textarea class="inp" id="rtext" aria-describedby="rerr" placeholder="Describe briefly. Location is attached automatically."></textarea></label><span class="field-err" id="rerr" role="alert"></span>
    <button class="btn btn-primary btn-block" onclick="sendReport()">Send report</button></div>
    <div class="list-label">FAQ</div>
    ${[['Who must pay the Tourist Entry Contribution?','All foreign visitors entering Sabah by air, land, sea or cruise. Children 12 and under are free; teens pay 50%.'],['Can I pay without a Malaysian bank?','Yes. Use Alipay+, WeChat Pay, international cards, PayNow, PromptPay or QRIS. Prices show in your currency.'],['What if I leave within 24 hours?','Turn on “Leaving within 24 hours” when paying. You receive a RM10 rebate per paying traveller.'],['Is my data safe?','Sabah GO is owned by the Sabah State Government. Data is stored in Malaysia and protected under PDPA.']].map(([q,a],i)=>`<div class="acc" id="acc${i}"><button onclick="this.setAttribute('aria-expanded',$('#acc${i}').classList.toggle('open'))" aria-expanded="false" aria-controls="ans${i}">${q}${ic('chevD')}</button><div class="ans" id="ans${i}">${a}</div></div>`).join('')}
  </div>`
});
function sendReport(){
  const tx=$('#rtext');
  if(!tx.value.trim()){ tx.setAttribute('aria-invalid','true'); $('#rerr').textContent='Please describe what happened so an officer can help.'; tx.focus(); return; }
  tx.removeAttribute('aria-invalid'); $('#rerr').textContent='';
  loading('Sending report…',1000,()=>{ $('#rtext').value=''; sheet(`<div style="text-align:center"><span class="bub c-green" style="margin:6px auto 14px;width:64px;height:64px">${ic('check')}</span><h3>Report received</h3><p class="lead">Ticket #SG-${4000+rnd(5000)} · ${$('#rtype').value}. An officer will reply within 2 hours.</p><button class="btn btn-primary btn-block" onclick="closeSheet()">OK</button></div>`); });
}
function logoutSheet(){ sheet(`<h3>Log out?</h3><p class="lead">Your pass and bookings stay safe in your account.</p><div class="stack"><button class="btn btn-danger btn-block" onclick="S.loggedIn=false;tab('auth')">Log out</button><button class="btn btn-soft btn-block" onclick="closeSheet()">Cancel</button></div>`); }
function callSheet(num, label){ sheet(`<div style="text-align:center"><span class="bub c-red" style="margin:6px auto 14px;width:64px;height:64px">${ic('phone')}</span><h3>Call ${num}?</h3><p class="lead">${label}</p></div><div class="stack"><a class="btn btn-primary btn-block" href="tel:${num}" onclick="closeSheet()" style="text-decoration:none">Call now</a><button class="btn btn-soft btn-block" onclick="closeSheet()">Cancel</button></div>`); }

/* ---------- Stella AI ---------- */
SCREENS.stella = (p={}) => {
  const pending = p && p.prompt; if(pending){ p.prompt=null; setTimeout(()=>stellaSend(pending),300); }
  const menu=[['pin','Destination ideas','Tempat menarik di seluruh Sabah','Recommend destinations'],['cal','Plan my trip','Pelan itinerari peribadi','Plan a 5-day trip in Sabah'],['food','Food & experiences','Makanan, budaya & aktiviti unik','What should I eat'],['bed','Stays & transport','Hotel, penerbangan, feri & kereta','Where should I stay'],['lang','Translate','Terjemah bahasa','Translate basic phrases'],['alert','Emergency help','Bantuan kecemasan','Emergency help']];
  return `<div class="scr"><header class="hdr white"><button class="ib" onclick="back()" aria-label="Back">${ic('chevL')}</button><img src="img/stella.jpg" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover;object-position:50% 35%"><div class="hdr-t" style="text-align:left"><h1>Stella</h1><p style="color:var(--okText)">● AI Travel Assistant · online</p></div><button class="ib" onclick="S.chat=[];refresh();toast('New conversation','refresh')" aria-label="New chat">${ic('refresh')}</button></header>
  <main class="content" id="chatScroll" style="padding-top:14px">
    <div class="stella-hero"><img src="img/stella_hero.jpg" alt="Stella, your Sabah travel assistant"><div class="bub2">Bah, selamat datang ke Sabah! Saya <b>Stella</b>. How can I help you explore Sabah today?</div><span class="tag"><i></i>Smart Tourism Experience &amp; Local Lifestyle Assistant</span></div>
    ${S.chat.length?'':`<div class="pad smenu" style="margin-top:12px">${menu.map(([i,a,b,q])=>`<button onclick="stellaSend('${q}')"><span class="ico">${ic(i)}</span><span><b>${a}</b><small>${b}</small></span>${ic('chevR','chev')}</button>`).join('')}</div>`}
    <div class="chat" id="chat">${S.chat.map(chatMsg).join('')}</div>
  </main>
  <div class="chatbar"><button class="mic" id="mic" onclick="stellaMic()" aria-label="Voice input">${ic('mic')}</button><input id="ci" placeholder="Ask Stella anything…" onkeydown="if(event.key==='Enter')stellaSend(this.value)" aria-label="Message Stella"><button class="send" onclick="stellaSend($('#ci').value)" aria-label="Send">${ic('send')}</button></div></div>`;
};
const chatMsg = m => m.from==='me' ? `<div class="msg me">${m.html}</div>` : `<div class="botrow"><img src="img/stella.jpg" alt=""><div class="msg bot">${m.html}</div></div>`;
const dayCard = (d, im, n, s, g) => `<button class="daycard" onclick="goto('${g}')"><img src="${img(im)}" alt=""><span style="min-width:0"><span class="d">${d}</span><b>${n}</b><small>${s}</small></span>${ic('chevR','chev')}</button>`;
function stellaReply(q){
  const s=q.toLowerCase(), has=(...w)=>w.some(x=>s.includes(x));
  if(has('translat','terjemah','phrase')) return `Here are handy phrases in Bahasa Malaysia 🇲🇾<br><br><b>Terima kasih</b> — Thank you<br><b>Berapa harga?</b> — How much?<br><b>Di mana tandas?</b> — Where is the toilet?<br><b>Sedap!</b> — Delicious!<br><b>Kotobian tadau</b> — Kadazan greeting for Kaamatan 🌾<div class="qchips" style="margin-top:8px"><button onclick="stellaSend('Translate: I am allergic to peanuts')">Allergy phrase</button><button onclick="stellaSend('Translate directions phrases')">Directions</button></div>`;
  if(has('emergenc','kecemasan','sos','help me','lost')) return `If you are in danger, call <b>999</b> now. I've also prepared:<div class="stack" style="gap:6px;margin-top:8px"><button class="btn btn-danger btn-sm" onclick="callSheet('999','Emergency')">${ic('phone')}Call 999</button><button class="btn btn-soft btn-sm" onclick="go('help')">${ic('headset')}Open Help 24/7</button></div>`;
  if(has('itiner','plan','5-day','5 day','5 hari','optimis','rancang','atur')) return `Here's a 5-day Sabah plan matched to nature, islands and local culture 🌴<br>${dayCard('Day 1','kk_city','Kota Kinabalu','City, waterfront & seafood','dest:kk')}${dayCard('Day 2','manukan','Pulau Manukan','Snorkelling, beach & island air','dest:manukan')}${dayCard('Day 3','kinabalu_park','Kinabalu Park','Nature trails & cool mountain air','dest:kinabalu')}${dayCard('Day 4','kundasang2','Kundasang','Farms & mountain views','dest:kundasang')}${dayCard('Day 5','marimari','Mari-Mari Cultural Village','Culture, tradition & local food','dest:marimari')}<div class="row" style="gap:6px;margin-top:10px"><button class="btn btn-primary btn-sm" style="flex:1" onclick="S.tripSeg='itin';tab('trips');toast('Plan saved to My Trip','cal')">Save to My Trip</button><button class="btn btn-soft btn-sm" onclick="stellaSend('Make it cheaper')">Cheaper</button></div>`;
  if(has('cheap','budget','jimat')) return `Budget version saves about <b>RM 640</b>: swap the resort for <b>Homestay Kg. Mesilou</b> (RM 120/night), use the Airport Express Bus (RM 5) and claim your <b>10% OFF Attractions</b> coupon.${dayCard('Stay','tourists','Homestay Kg. Mesilou','RM 120 / night · local hosts','booking:s_homestay')}`;
  if(has('eat','food','makan','restaurant','hungry','sedap')) return `You can't leave without trying these 🍤${dayCard('Must try','seafood','Butter prawns at Fatt Kee','Kopitiam · ~RM35/pax · 10% off with Pass','booking:f_fattkee')}${dayCard('Local','crafts','Hinava (raw fish salad)','Kadazan classic · Mari-Mari','booking:f_hinava')}${dayCard('Night','market1','Filipino Market grill','Pay by QR · from RM25','booking:f_seafood')}`;
  if(has('stay','hotel','penginapan','sleep','transport','ferry','car')) return `Top picks for your dates:${dayCard('Beach','resort23','Shangri-La Tanjung Aru','RM 780/night · RM120 cashback','booking:s_shangri')}${dayCard('Over water','bg_resort','Mabul Water Bungalows','RM 1,150/night · Semporna','booking:s_mabul')}${dayCard('Getting around','boat','Jesselton Point Ferry','Return RM 45','booking:v_ferry')}`;
  if(has('weather','cuaca','rain')) return `🌤️ <b>Kota Kinabalu</b>: 31°C, sunny morning, showers after 3pm.<br>⛰️ <b>Kinabalu Park</b>: 18°C, misty. Start hikes before 9am.<br>🏝️ <b>Semporna</b>: 30°C, calm seas — great visibility for diving.`;
  if(has('tec','levy','contribution','sumbangan','tax','pass')) return `The <b>Tourist Entry Contribution</b> is paid once per entry: <b>RM75 air</b>, <b>RM35 land or sea</b>, <b>RM50 cruise</b>. Teens 13–17 pay half, children 12 and under are free, and there's a RM10 rebate if you leave within 24 hours.<div style="margin-top:8px"><button class="btn btn-primary btn-sm" onclick="go('${S.pass?'pass':S.mdac?'tec':'mdac'}')">${S.pass?'Show my pass':'Pay now'}</button></div>`;
  if(has('deal','discount','promo','diskaun','coupon')) return `Your best deals right now 🎁<div class="qchips" style="margin-top:8px">${DEALS.slice(0,4).map(d=>`<button onclick="go('coupon','${d.id}')">${d.big} ${d.t}</button>`).join('')}</div>`;
  if(has('dive','diving','snorkel','island')) return `For divers, <b>Sipadan</b> is world class (permits are limited — book early). Beginners love <b>Mabul</b> and <b>Manukan</b>.${dayCard('Dive','rec_diving','Sipadan Dive Day Trip','RM 450 · permit included','booking:a_sipadan')}${dayCard('Easy','manukan','Pulau Manukan','Snorkel right off the beach','dest:manukan')}`;
  if(has('book','tempah','activit','aktiviti','tour')) return `Popular activities you can book instantly:${['a_island','a_river','a_culture'].map(k=>dayCard(rm(ITEMS[k].price),ITEMS[k].img,ITEMS[k].name,ITEMS[k].sub,'booking:'+k)).join('')}`;
  const d = DEST.find(x=>s.includes(x.name.toLowerCase()) || s.includes(x.id));
  if(d) return `<b>${d.name}</b> — ${d.desc}<br><br>Best time: <b>${d.best}</b>. Ideal for ${d.ideal.toLowerCase()}.${dayCard('Explore',d.thumb,d.name,d.tag,'dest:'+d.id)}`;
  if(has('destin','where','tempat','recommend','go')) return `Based on travellers like you, I'd start with these:${dayCard('Islands','t_semporna','Semporna','Island paradise','dest:semporna')}${dayCard('Nature','t_kinabalu','Mount Kinabalu','Nature & adventure','dest:kinabalu')}${dayCard('Wildlife','t_kinabatangan','Kinabatangan','Pygmy elephants & orangutans','dest:kinabatangan')}`;
  return `I can help with that! Try asking me to plan your days, find food, book activities, check the weather or translate.<div class="qchips" style="margin-top:8px"><button onclick="stellaSend('Plan a 5-day trip in Sabah')">Plan 5 days</button><button onclick="stellaSend('What should I eat')">Food</button><button onclick="stellaSend('Weather today')">Weather</button></div>`;
}
function stellaSend(text){
  text=(text||'').trim(); if(!text) return;
  if(topScr().n!=='stella') return go('stella',{prompt:text});
  S.chat.push({from:'me', html:text.replace(/</g,'&lt;')});
  refresh(); const ci=$('#ci'); if(ci) ci.value='';
  const chat=$('#chat'); chat.insertAdjacentHTML('beforeend', `<div class="botrow" id="typing"><img src="img/stella.jpg" alt=""><div class="msg bot typing"><i></i><i></i><i></i></div></div>`);
  scrollChat();
  setTimeout(()=>{ S.chat.push({from:'bot', html:stellaReply(text)}); if(topScr().n==='stella'){ refresh(); scrollChat(); } }, 900);
}
function scrollChat(){ const c=$('#chatScroll'); if(c) c.scrollTo({top:c.scrollHeight, behavior:'smooth'}); }
function stellaMic(){ const m=$('#mic'); m.classList.add('on'); $('#ci').placeholder='Listening…'; setTimeout(()=>{ m.classList.remove('on'); stellaSend('Plan a 5-day trip in Sabah'); },1500); }

/* ---------- Profile ---------- */
SCREENS.profile = () => {
  statusLight=true;
  const ini=S.user.name.split(' ').map(x=>x[0]).join('');
  return page({ nav:'profile',
    body: `<div class="prof-h"><div class="row" style="gap:14px"><span class="av">${ini}</span><div style="flex:1;min-width:0"><b style="font-size:19px;display:block">${S.user.name}</b><small style="opacity:.85">${S.user.flag} ${S.user.nat} · ${S.points>=5000?'Gold':'Silver'} Traveller</small><div style="margin-top:6px">${S.pass?`<span class="pill white">${ic('check')}Tourist Pass active</span>`:`<span class="pill white">${ic('alert')}Entry not complete</span>`}</div></div><button class="ib" style="background:rgba(255,255,255,.16);color:#fff;box-shadow:none" onclick="go('personal')" aria-label="Edit profile">${ic('edit')}</button></div></div>
    <div class="prof-card"><button onclick="S.tripSeg='book';tab('trips')"><b>${S.bookings.filter(b=>b.status!=='Cancelled').length}</b><small>Bookings</small></button><button onclick="S.exFilter='fav';go('explore')"><b>${S.favs.length}</b><small>Saved</small></button><button onclick="tab('rewards')"><b>${S.points.toLocaleString()}</b><small>Points</small></button></div>
    <div class="pad">
      <div class="list-label">Travel documents</div><div class="list">
        ${li({icon:'ticket',title:'Digital Tourist Pass',sub:S.pass?S.pass.id:'Not issued',onclick:"go('pass')"})}
        ${li({icon:'id',title:'MDAC',sub:S.mdac?'Verified':'Link your arrival card',onclick:"go('mdac')"})}
        ${li({icon:'leaf',title:'Tourist Entry Contribution',sub:S.pass?'Paid':'Pending',onclick:S.pass?"go('pass')":"go('"+(S.mdac?'tec':'mdac')+"')"})}</div>
      <div class="list-label">Payments</div><div class="list">
        ${li({icon:'card',title:'Payment methods',sub:'Visa •••• 4821 + 11 rails',onclick:"go('methods')"})}
        ${li({icon:'swap',title:'Display currency',sub:CURR.find(c=>c[0]===S.cur)[1],onclick:'currencySheet()'})}</div>
      <div class="list-label">Preferences</div><div class="list">
        ${li({icon:'lang',title:'Language',sub:LANGS.find(l=>l[0]===S.lang)[1],onclick:"go('lang')"})}
        <div class="li"><span class="ico">${ic('bell')}</span><span class="tx"><b>Notifications</b><small>Deals, alerts & reminders</small></span>${toggle(S.notifOn,'S.notifOn=!S.notifOn;refresh()','Notifications')}</div>
        <div class="li"><span class="ico">${ic('pin')}</span><span class="tx"><b>Location services</b><small>Nearby deals & safety alerts</small></span>${toggle(S.locOn,'S.locOn=!S.locOn;refresh()','Location')}</div>
        <div class="li"><span class="ico">${ic('lock')}</span><span class="tx"><b>Face ID for payments</b><small>Confirm payments faster</small></span>${toggle(S.bioOn,'S.bioOn=!S.bioOn;refresh()','Face ID')}</div></div>
      <div class="list-label">Support</div><div class="list">
        ${li({icon:'headset',title:'Help 24/7',onclick:"go('help')"})}
        ${li({icon:'thumb',title:'End trip & share feedback',sub:'Terima kasih! Jumpa lagi di Sabah',onclick:"go('postTrip')"})}
        ${li({icon:'shield',title:'Privacy & data',sub:'PDPA · data stored in Malaysia',onclick:"go('privacy')"})}
        ${li({icon:'info',title:'About Sabah GO',onclick:"go('about')"})}</div>
      <div class="list-label">For businesses</div><div class="list">${li({icon:'store',c:'',title:'Switch to Merchant app',sub:'Sabah GO Merchant · accept QR payments',onclick:"tab('mhome')"})}</div>
      <button class="btn btn-danger btn-block" style="margin-top:22px" onclick="logoutSheet()">${ic('logout')}Log out</button>
      <button class="btn btn-ghost btn-block" onclick="S=fresh();stack=[{n:'splash'}];render()">${ic('refresh')}Restart demo</button>
      <p class="small muted" style="text-align:center;margin-top:6px">Sabah GO v1.0 · Kerajaan Negeri Sabah</p>
    </div>`
  });
};
function currencySheet(){ sheet(`<h3>Display currency</h3><p class="lead">Prices are charged in MYR and shown in your currency at an indicative rate.</p><div class="stack" style="gap:8px">${CURR.map(([c,n])=>`<button class="opt ${S.cur===c?'on':''}" onclick="S.cur='${c}';closeSheet();refresh();toast('Showing prices in ${c}','globe')"><span class="radio"></span><span class="tx"><b>${c}</b><small>${n}</small></span></button>`).join('')}</div>`); }
SCREENS.personal = () => page({ header:hdr('Personal details'),
  body:`<div class="pad"><label class="field"><span>Full name</span><input class="inp" value="${S.user.name}" id="pn"></label><label class="field"><span>Email</span><input class="inp" value="${S.user.email}" id="pe"></label><label class="field"><span>Phone</span><input class="inp" value="${S.user.phone}" id="pp"></label>
  <label class="field"><span>Passport number</span><input class="inp" value="${S.user.passport}" disabled style="background:#F1F4F9"></label><div class="info-box">${ic('lock')}<span>Passport details come from your verified MDAC and can't be edited here.</span></div></div>`,
  footer:`<button class="btn btn-primary btn-block" onclick="S.user.name=$('#pn').value||S.user.name;S.user.email=$('#pe').value;S.user.phone=$('#pp').value;back();toast('Profile updated')">Save changes</button>` });
SCREENS.privacy = () => page({ header:hdr('Privacy & data'),
  body:`<div class="pad"><div class="list">${[['shield','Data stays in Malaysia','All transaction data is stored in Malaysia under PDPA.'],['lock','No card data on your phone','Payments are tokenised by licensed acquirers (PCI DSS, BNM RMiT).'],['eye','You control sharing','Location and marketing can be switched off anytime.']].map(([i,a,b])=>li({icon:i,title:a,sub:b,onclick:'',chev:false})).join('')}</div>
  <div class="stack" style="margin-top:16px"><button class="btn btn-light btn-block" onclick="toast('Your data export will be emailed','download')">${ic('download')}Download my data</button><button class="btn btn-danger btn-block" onclick="toast('Request sent. We will confirm by email.','info')">Request account deletion</button></div></div>` });
SCREENS.about = () => page({ header:hdr('About Sabah GO'),
  body:`<div class="pad" style="text-align:center"><img src="img/logo.webp" alt="Sabah GO — Your journey enriched" style="width:200px;height:auto;margin:4px auto 0">
  <p class="para" style="margin-top:16px;text-align:left">Sabah GO is the digital platform owned by the Sabah State Government — for travellers, local merchants and everyone in Sabah's tourism ecosystem. One digital identity, one licensed operator platform, and one ledger: contributions are collected fairly, data is complete, and every ringgit can be traced.</p>
  <div class="facts" style="margin-top:16px;text-align:left"><div class="fact">${ic('shield')}<b>Owned by</b><span>Sabah State Govt</span></div><div class="fact">${ic('lock')}<b>Security</b><span>PDPA · PCI DSS</span></div><div class="fact">${ic('users')}<b>For</b><span>Everyone</span></div></div></div>` });

/* ---------- Post-trip ---------- */
SCREENS.postTrip = () => {
  return page({ cls:'nohdr',
    body:`<div style="position:relative;height:300px"><img src="img/jetty_sunset.jpg" alt="" style="width:100%;height:100%;object-fit:cover"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.9) 0%,rgba(255,255,255,.4) 45%,var(--bg) 100%)"></div>
    <div style="position:absolute;top:calc(var(--sb) + 6px);left:16px"><button class="ib" onclick="back()" aria-label="Back">${ic('chevL')}</button></div>
    <div style="position:absolute;left:0;right:0;top:calc(var(--sb) + 36px);text-align:center"><img src="img/logo_mark.webp" alt="" style="width:112px;height:auto;margin:0 auto"><h1 style="font-size:30px;font-weight:800;color:var(--navy);margin-top:8px">Terima Kasih!</h1><p style="color:var(--ink2);font-size:14px">Jumpa lagi di Sabah — see you again</p></div></div>
    <div class="pad"><div class="facts" style="margin-top:-30px;position:relative"><div class="fact">${ic('cal')}<b>Days</b><span>5 days</span></div><div class="fact">${ic('pin')}<b>Places</b><span>8 visited</span></div><div class="fact">${ic('gift')}<b>Points</b><span>${S.points.toLocaleString()}</span></div></div>
    <div class="card" style="padding:18px;margin-top:16px;text-align:center"><b>How was your Sabah journey?</b><div class="stars" style="margin:12px 0">${[1,2,3,4,5].map(i=>`<button class="${S.rating>=i?'on':''}" onclick="S.rating=${i};refresh()" aria-label="${i} star">${ic('star')}</button>`).join('')}</div>
    <textarea class="inp" id="rev" aria-label="Your review" placeholder="Share a highlight with future travellers…"></textarea>
    <button class="btn btn-primary btn-block" style="margin-top:12px" onclick="if(!S.rating){toast('Tap a star rating first','star');return;}S.points+=200;toast('Thanks! +200 points for your review','gift');refresh()">Share experience · +200 pts</button></div>
    <div class="list" style="margin-top:14px">${li({icon:'share',title:'Kongsi pengalaman',sub:'Share photos & your trip map',onclick:"shareIt('My Sabah journey')"})}${li({icon:'bell',title:'Terus terhubung',sub:'Get festival news & return offers',onclick:"toast('You will hear about new festivals & offers','bell')"})}${li({icon:'gift',title:'15% off your next visit',sub:'Tawaran lawatan semula ke Sabah',onclick:"toast('Return-visit offer saved to Rewards','gift')"})}</div></div>`
  });
};

/* ---------- Merchant app ---------- */
SCREENS.mhome = () => {
  statusLight=true; const M=S.merchant;
  const grid=[['qr','Receive payment',"go('mqr')"],['box','Products',"go('mlist','products')"],['receipt','Orders',"go('mlist','orders')"],['megaphone','Promotions',"go('mlist','promos')"],['star','Reviews',"go('mlist','reviews')"],['settings','Settings',"go('mlist','settings')"]];
  return page({ cls:'mscr',
    header:`<header class="hdr dark"><img src="img/fisherman.jpg" alt="" style="width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid #fff"><div class="hdr-t" style="text-align:left"><h1>Sabah GO Merchant</h1><p>Gerai Laut Pak Hamid · Gaya Street</p></div><button class="ib" onclick="tab('profile');toast('Back to traveller app','swap')" aria-label="Switch to traveller app">${ic('swap')}</button></header>`,
    body:`<div class="mbal"><p class="small muted">Selamat datang! Today's sales</p><div class="row between"><div class="amt">${rm(M.sales)}</div><button class="btn-ghost small b" style="color:#0E8F57" onclick="go('mlist','analytics')">View analytics ›</button></div><p class="small" style="color:var(--ink2)"><b>${M.count}</b> transactions · paid out next business day</p></div>
    <div class="sec" style="margin-top:18px"><div class="mgrid">${grid.map(([i,l,on])=>`<button onclick="${on}"><span class="ico">${ic(i)}</span>${l}</button>`).join('')}</div></div>
    <div class="sec"><div class="sec-h"><h2>Latest payments</h2><button style="color:#0E8F57" onclick="go('mlist','orders')">See all</button></div><div class="pad"><div class="list">${M.pays.map(([n,l,f,a,tm])=>`<div class="li"><span class="lg2" style="width:50px;height:34px;border-radius:9px;border:1px solid var(--line);display:grid;place-items:center;padding:4px;flex-shrink:0"><img src="img/${l}.png" alt="" style="max-width:100%;max-height:100%;object-fit:contain"></span><span class="tx"><b>${f} ${n}</b><small>Today ${tm} · in MYR</small></span><span class="amt pos">+ RM ${a}</span></div>`).join('')}</div></div></div>
    <div class="pad" style="margin-top:16px"><div class="info-box green">${ic('trend')}<span>You're registered and licensed. Tourists see your stall on the map, and you get free training and support.</span></div></div>`
  });
};
SCREENS.mqr = () => page({ header:hdr('Receive payment',{sub:'Imbas untuk bayar'}),
  body:`<div class="stand"><b style="font-size:20px">Sabah GO</b><div class="q">${qr('merchant-hamid','#064E3B')}</div><b>Gerai Laut Pak Hamid</b><p class="small" style="opacity:.85">Alipay+ · WeChat · Cards · DuitNow · PayNow · QRIS</p></div>
  <p class="small muted" style="text-align:center;margin-top:16px;padding:0 30px">Tourists pay in their own wallet; you receive one payment in MYR.</p>`,
  footer:`<button class="btn btn-green btn-block" onclick="loading('Waiting for customer…',1400,()=>{const a=(10+rnd(80)).toFixed(2);S.merchant.sales+=+a;S.merchant.count++;S.merchant.pays.unshift(['WeChat Pay','pay_wechat','🇨🇳',a,new Date().toTimeString().slice(0,5)]);toast('Received RM '+a+' via WeChat Pay','check');back()})">Simulate incoming payment</button>` });
SCREENS.mlist = (k) => {
  const M=S.merchant;
  const T={products:'Products',orders:'Orders',promos:'Promotions',reviews:'Reviews',settings:'Settings',analytics:'Analytics'}[k];
  let body='';
  if(k==='products') body=`<div class="stack">${[['Grilled stingray','RM 25.00','seafood'],['Tiger prawns (500g)','RM 48.00','seafood'],['Hinava set','RM 15.00','market1'],['Coconut drink','RM 6.00','market2']].map(([n,p,im])=>`<div class="icard"><span class="th"><img src="${img(im)}" alt=""></span><span class="tx"><b>${n}</b><small>In stock</small><span class="pr"><span style="color:var(--okText)">${p}</span><button class="btn btn-soft btn-sm" style="height:32px" onclick="toast('Editing ${n}','edit')">Edit</button></span></span></div>`).join('')}<button class="btn btn-green btn-block" onclick="toast('New product form opened','plus')">${ic('plus')}Add product</button></div>`;
  if(k==='orders') body=`<div class="list">${M.pays.map(([n,l,f,a,tm])=>`<div class="li"><span class="ico" style="background:#E2F8EE;color:#0E8F57">${ic('receipt')}</span><span class="tx"><b>RM ${a} · ${n}</b><small>${f} Today ${tm}</small></span><span class="pill green">Paid</span></div>`).join('')}</div>`;
  if(k==='promos') body=`<div class="stack"><div class="coupon"><span class="l c-green"><b>10%</b><small>ACTIVE</small></span><span class="r"><b>Tourist Pass discount</b><small>Shown to all pass holders nearby</small><span class="pill green">Running · 42 used</span></span></div><button class="btn btn-green btn-block" onclick="toast('Promotion created and sent for approval','megaphone')">${ic('plus')}Create promotion</button></div>`;
  if(k==='reviews') body=`<div class="card" style="padding:18px;text-align:center;margin-bottom:12px"><div style="font-size:36px;font-weight:800">4.8</div><div class="stars" role="img" aria-label="4.8 out of 5">${[1,2,3,4,5].map(i=>`<span class="on">${ic('star')}</span>`).join('')}</div><p class="small muted">126 reviews</p></div><div class="stack">${[['Lina · 🇸🇬','Freshest prawns in KK, paid with PayNow — so easy!'],['Wei · 🇨🇳','老板很热情，可以用支付宝！'],['Tom · 🇦🇺','Great grilled fish, friendly owner.']].map(([a,b])=>`<div class="card" style="padding:14px"><b class="small">${a}</b><p class="para" style="font-size:13px;margin-top:4px">${b}</p><button class="btn-ghost small b" style="color:var(--okText);margin-top:6px" onclick="toast('Reply sent','msg')">Reply</button></div>`).join('')}</div>`;
  if(k==='settings') body=`<div class="list">${li({icon:'store',title:'Business profile',sub:'Licence SBH-T-20431 · verified',onclick:"toast('Profile opened','store')"})}${li({icon:'card',title:'Payout account',sub:'Bank Islam •••• 2210 · next business day',onclick:"toast('Payout settings opened','card')"})}${li({icon:'users',title:'Staff access',sub:'2 cashiers',onclick:"toast('Staff list opened','users')"})}${li({icon:'headset',title:'Training & support',sub:'Free merchant onboarding',onclick:"go('help')"})}</div>`;
  if(k==='analytics'){ const v=[620,880,740,1020,960,1310,1250]; const mx=Math.max(...v);
    body=`<div class="card" style="padding:16px"><b>Sales this week</b><p class="small muted">${rm(v.reduce((a,b)=>a+b))} · ↑ 18% vs last week</p><div class="bars">${v.map((x,i)=>`<div class="${i===6?'hl':''}"><i style="height:${x/mx*100}%"></i>${['M','T','W','T','F','S','S'][i]}</div>`).join('')}</div></div>
    <div class="list-label">Where your customers are from</div><div class="list">${[['🇨🇳 China','44%'],['🇲🇾 Malaysia','28%'],['🇸🇬 Singapore','11%'],['🇰🇷 Korea','9%'],['🌍 Others','8%']].map(([a,b])=>`<div class="li"><span class="tx"><b>${a}</b></span><span class="amt">${b}</span></div>`).join('')}</div>`; }
  return page({ header:hdr(T), body:`<div class="pad">${body}</div>` });
};

/* ---------------- desktop side links ---------------- */
const SIDE = [
  ['Splash',()=>{S.obIdx=0;tab('splash')}],['Onboarding',()=>{S.obIdx=0;tab('onboard')}],['Sign up',()=>tab('auth')],['MDAC',()=>{tab('home');go('mdac')}],
  ['Home',()=>toHome()],['Destinations',()=>{toHome();go('explore')}],['Semporna',()=>{toHome();S.dTab='overview';go('dest','semporna')}],
  ['TEC payment',()=>{S.mdac=true;toHome();go('tec')}],['Digital Pass',()=>{if(!S.pass){S.mdac=true;S.pass={id:'SB-2611-482105',until:'12 Dec 2026',issued:now(),route:'Air',travellers:1};}toHome();go('pass')}],
  ['Booking',()=>{toHome();go('booking','a_island')}],['My Trip',()=>{S.loggedIn=true;tab('trips')}],['Wallet',()=>{S.loggedIn=true;tab('wallet')}],['Scan & Pay',()=>{tab('wallet');go('scan')}],
  ['Rewards',()=>{S.loggedIn=true;tab('rewards')}],['Stella AI',()=>{toHome();go('stella')}],['Help 24/7',()=>{toHome();go('help')}],['Festivals',()=>{toHome();go('events')}],
  ['Profile',()=>{S.loggedIn=true;tab('profile')}],['Post-trip',()=>{tab('profile');go('postTrip')}],['Merchant app',()=>tab('mhome')],
];
function markSide(){}
(function initSide(){
  const el=$('#sideLinks'); if(!el) return;
  el.innerHTML = SIDE.map((s,i)=>`<button onclick="SIDE[${i}][1]()">${s[0]}</button>`).join('');
})();

/* reset per-screen ephemeral state when entering destination screens */
const _go = go;
go = function(n,p){ if(n==='dest') S.dTab='overview'; if(n==='listing') S.lsFilter='all'; _go(n,p); };

document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ if($('#sheetWrap').classList.contains('open')) closeSheet(); else if(stack.length>1) back(); }
  if((e.key==='Enter'||e.key===' ') && e.target.matches('[role="button"]')){ e.preventDefault(); e.target.click(); }
});
render();

/* fit the device frame to short desktop windows */
function fitDevice(){ // only trims the frame on large desktop windows, never below 80%, so browser zoom still enlarges content
  const d=document.querySelector('.device'); if(!d) return;
  if(innerWidth<=860){ d.style.zoom=''; return; }
  d.style.zoom=Math.max(.8, Math.min(1,(innerHeight-32)/868));
}
addEventListener('resize', fitDevice); fitDevice();
['#phone','#app'].forEach(s=>{ const el=$(s); el.addEventListener('scroll',()=>{ if(el.scrollTop||el.scrollLeft){ el.scrollTop=0; el.scrollLeft=0; } }); });
