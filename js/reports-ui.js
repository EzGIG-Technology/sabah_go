/* =====================================================================
   REPORTING JOURNEY · catalogue → parameters → preview with checks →
   save or submit → approve and sign (or return) → distribute / publish →
   history and audit trail. Also: schedules, sharing between agencies,
   and real PDF, Excel and CSV exports.
   ===================================================================== */
const RCODE = {ops:'OPS', tourism:'KEP', finance:'MOF', immigration:'JIM', merchant:'MER'};
const FLOW = {
  signoff:{tag:'Needs sign-off', steps:['Choose','Set parameters','Preview and check','Submit','Approve and sign','Distribute']},
  publish:{tag:'Published after approval', steps:['Choose','Set parameters','Preview and check','Submit','Approve','Publish']},
  none:{tag:'Self-service', steps:['Choose','Set parameters','Preview and check','Export or save']},
};
const FINAL = ['Signed','Distributed','Approved','Published','Generated'];
const findDef = (role,id) => RDEF[role].find(d=>d.id===id);
const defaultP = d => { const p=Object.assign({period:'last30',group:(d.groups||[])[0]||null,cps:[],modes:[],mkts:[]}, JSON.parse(JSON.stringify(d.defaults||{}))); if(d.monthly) p.period='month:'+lastClosedMonth(); return p; };
const params = (role,id) => { const k=role+':'+id; if(!S.rp) S.rp={}; if(!S.rp[k]) S.rp[k]=defaultP(findDef(role,id)); return S.rp[k]; };
const ptext = p => String(p.period).startsWith('month:') ? mLabel(+p.period.slice(6)) : (()=>{ const [a,b]=rng(p); return prdLabel(a,b); })();
let HSEQ = 40;
const newId = role => `RPT-${RCODE[role]}-${String(dyear(LAST)).slice(2)}${pad2(dmon(LAST)+1)}-${String(++HSEQ).padStart(4,'0')}`;
const stamp = (dOff=0, t=HHMM) => `${fmtD(LAST-dOff)} ${t}`;
const docHash = (r, extra='') => hash(JSON.stringify([r.rows,r.foot,extra]));
const mkHist = (role,id,p,status,by,timeline,extra={}) => { const d=findDef(role,id); const r=d.run(p); return Object.assign({hid:newId(role), role, defId:id, name:d.name, p:JSON.parse(JSON.stringify(p)), period:ptext(p), status, by, at:timeline[0][2], v:1, comment:'', hash:docHash(r,extra.comment||''), tl:timeline}, extra); };
const RHIST = {}, RSCHED = {}, RSHARED = {ops:[],tourism:[],finance:[],immigration:[],merchant:[]};
const nextOf = freq => { if(/^Daily/.test(freq)) return fmtD(LAST+1); if(/Weekly/.test(freq)){ let d=LAST+1; while(dow(d)!==1) d++; return fmtD(d); } const m=freq.match(/Monthly · (\d+)/); if(m){ const n=+m[1], y=dyear(LAST), mo=dmon(LAST); const d0=dayOf(y,mo,n); return fmtD(d0>LAST?d0:dayOf(y,mo+1,n)); } return 'On request'; };
function seedReports(){
  const lm='month:'+lastClosedMonth(), pm='month:'+MONTHKEYS.filter(k=>monthRangeFull(k)[1]<LAST).slice(-2)[0];
  const P = (role,id,o) => Object.assign(defaultP(findDef(role,id)), o||{});
  const day = n => ({period:'custom', from:LAST-n, to:LAST-n});
  const R=r=>[ROLES[r].maker[0],ROLES[r].checker[0]];
  let [m,c]=R('ops');
  RHIST.ops = [
    mkHist('ops','ops_daily',P('ops','ops_daily',day(1)),'Distributed',m,[['Generated',m,stamp(0,'07:52')],['Submitted for sign-off',m,stamp(0,'07:53')],['Approved and signed',c,stamp(0,'08:04'),'Checked against the reconciliation.'],['Distributed to KePKAS, Ministry of Finance, Immigration',m,stamp(0,'08:06')]],{sig:c}),
    mkHist('ops','ops_daily',P('ops','ops_daily',day(2)),'Distributed',m,[['Generated',m,stamp(1,'07:49')],['Submitted for sign-off',m,stamp(1,'07:50')],['Approved and signed',c,stamp(1,'08:01')],['Distributed to KePKAS, Ministry of Finance, Immigration',m,stamp(1,'08:02')]],{sig:c}),
    mkHist('ops','ops_sla',P('ops','ops_sla',{period:lm}),'Signed',m,[['Generated',m,stamp(13,'10:12')],['Submitted for sign-off',m,stamp(13,'10:15')],['Approved and signed',c,stamp(12,'09:40')]],{sig:c}),
    mkHist('ops','ops_refunds',P('ops','ops_refunds'),'Generated',m,[['Generated and exported (CSV)',m,stamp(0,'08:20')]]),
  ];
  [m,c]=R('tourism');
  RHIST.tourism = [
    mkHist('tourism','tou_bulletin',P('tourism','tou_bulletin',{period:lm}),'Pending approval',m,[['Generated',m,stamp(1,'15:10')],['Submitted for approval',m,stamp(1,'15:22'),'Ready for publication on the 7th.']]),
    mkHist('tourism','tou_bulletin',P('tourism','tou_bulletin',{period:pm}),'Published',m,[['Generated',m,stamp(40,'14:02')],['Submitted for approval',m,stamp(40,'14:30')],['Returned',c,stamp(39,'10:05'),'Please add a note on China growth.'],['Version 2 with commentary',m,stamp(39,'11:20')],['Submitted for approval',m,stamp(39,'11:22')],['Approved',c,stamp(38,'09:15')],['Published to the Ministry website and open data portal',m,stamp(38,'10:00')]],{v:2,sig:c,comment:'China remains the largest market and grew fastest, helped by new direct flights from Hangzhou and Chengdu.'}),
    mkHist('tourism','tou_markets',P('tourism','tou_markets'),'Generated',m,[['Generated and exported (Excel)',m,stamp(0,'09:05')]]),
  ];
  [m,c]=R('finance');
  RHIST.finance = [
    mkHist('finance','fin_daily',P('finance','fin_daily',day(1)),'Pending approval',m,[['Generated',m,stamp(0,'09:48')],['Submitted for sign-off',m,stamp(0,'09:50')]]),
    mkHist('finance','fin_daily',P('finance','fin_daily',day(2)),'Signed',m,[['Generated',m,stamp(1,'09:41')],['Submitted for sign-off',m,stamp(1,'09:42')],['Approved and signed',c,stamp(1,'10:05')]],{sig:c}),
    mkHist('finance','fin_statement',P('finance','fin_statement',{period:lm}),'Distributed',m,[['Generated',m,stamp(14,'11:00')],['Submitted for sign-off',m,stamp(14,'11:04')],['Approved and signed',c,stamp(13,'16:20')],['Distributed to the State Treasury and the National Audit Department',m,stamp(13,'16:30')]],{sig:c}),
    mkHist('finance','fin_recon',P('finance','fin_recon',{period:'custom',from:LAST-8,to:LAST-1}),'Returned',m,[['Generated',m,stamp(0,'10:10')],['Submitted for sign-off',m,stamp(0,'10:12')],['Returned',c,stamp(0,'10:31'),'Add the acquirer\'s confirmation for the Tawau kiosk batch in the commentary before I sign.']]),
    mkHist('finance','fin_partner',P('finance','fin_partner',{period:lm}),'Draft',m,[['Generated as a draft',m,stamp(0,'11:02')]]),
  ];
  [m,c]=R('immigration');
  RHIST.immigration = [
    mkHist('immigration','imm_daily',P('immigration','imm_daily',day(1)),'Signed',m,[['Generated automatically','System',stamp(1,'23:59')],['Reviewed and submitted',m,stamp(0,'07:12')],['Approved and signed',c,stamp(0,'07:45')]],{sig:c}),
    mkHist('immigration','imm_over',P('immigration','imm_over'),'Pending approval',m,[['Generated',m,stamp(0,'07:05')],['Submitted for sign-off',m,stamp(0,'07:09')]]),
  ];
  [m,c]=R('merchant');
  RHIST.merchant = [
    mkHist('merchant','m_payout',P('merchant','m_payout'),'Generated',m,[['Generated and exported (PDF)',m,stamp(17,'21:40')]]),
    mkHist('merchant','m_acct',P('merchant','m_acct'),'Generated',m,[['Exported for my records (CSV)',m,stamp(17,'21:44')]]),
  ];
  Object.keys(RDEF).forEach(role=>{ RSCHED[role] = RDEF[role].filter(d=>d.freq&&!/demand|After|request/.test(d.freq)).slice(0,4).map((d,i)=>({id:'SCH-'+(300+i)+RCODE[role], defId:d.id, name:d.name, freq:d.freq, next:nextOf(d.freq), fmt:i%2?'Excel':'PDF', to:role==='merchant'?'Your email':i===0?'Department inbox and named officers':'Department inbox', on:true})); });
  const share = (from,id,to,p,dOff,t,note) => RSHARED[to].push({from, defId:id, name:findDef(from,id).name, p, period:ptext(p), at:stamp(dOff,t), by:ROLES[from].maker[0], note});
  ['tourism','finance','immigration'].forEach(r=>share('ops','ops_daily',r,P('ops','ops_daily',day(1)),0,'08:06','Signed daily summary.'));
  share('ops','ops_refunds','finance',P('ops','ops_refunds'),0,'08:21','Refunds approved this week.');
  share('tourism','tou_spend','finance',P('tourism','tou_spend'),3,'15:40','Spending by category for the budget paper.');
  share('finance','fin_recon','ops',P('finance','fin_recon',{period:'custom',from:LAST-8,to:LAST-1}),0,'10:40','One late kiosk batch at Tawau Airport, cleared the next day. Please confirm the kiosk cut-off fix.');
  share('immigration','imm_compliance','ops',P('immigration','imm_compliance'),1,'14:30','Sindumin is below its compliance target this month.');
}

/* ---------- page ---------- */
function reportsPage(){
  const q=S.q||'';
  if(q.startsWith('b:')) return builder(q.slice(2));
  if(q.startsWith('h:')) return histView(q.slice(2));
  if(q.startsWith('s:')) return sharedView(+q.slice(2));
  const tab=S.f.rtab||'catalogue', R=ROLES[S.role], H=RHIST[S.role], hasFlow=RDEF[S.role].some(d=>d.flow!=='none'), pend=H.filter(h=>h.status==='Pending approval');
  const tabs=[['catalogue','Catalogue',RDEF[S.role].length],['history','Generated',H.length],...(hasFlow?[['approvals','Waiting for approval',pend.length]]:[]),['scheduled','Scheduled',RSCHED[S.role].length],['shared','Shared with us',RSHARED[S.role].length]];
  let body='';
  if(tab==='catalogue'){ const cats=[...new Set(RDEF[S.role].map(d=>d.cat))];
    body=cats.map(c=>`<h3 style="font-size:15px;margin:6px 2px 10px">${c}</h3><div class="rcat" style="margin-bottom:22px">${RDEF[S.role].filter(d=>d.cat===c).map(d=>{ const last=H.find(h=>h.defId===d.id);
      return `<button class="rc" onclick="openBuilder('${d.id}')"><div class="row between">${icn('file')}${last?badge(last.status,stCls(last.status)):''}</div><h4>${d.name}</h4><p>${d.desc}</p><div class="meta"><span class="tag">${d.freq}</span><span class="tag ${d.flow!=='none'?'sig':''}">${FLOW[d.flow].tag}</span>${d.to?`<span class="tag">Can be shared</span>`:''}</div></button>`; }).join('')}</div>`).join(''); }
  if(tab==='history') body=card('', table([{h:'Reference',v:h=>`<span class="code">${h.hid}</span>${h.v>1?` <small class="muted">version ${h.v}</small>`:''}`},{h:'Report',v:h=>`<b>${h.name}</b>`},{h:'Period',v:h=>h.period},{h:'Prepared by',v:h=>h.by},{h:'Last update',v:h=>h.tl[h.tl.length-1][2]},{h:'Status',v:h=>badge(h.status,stCls(h.status))}], H, {click:h=>`go('${S.role}','reports/h:${h.hid}')`}), {flush:true});
  if(tab==='approvals') body = pend.length ? card('', table([{h:'Reference',v:h=>`<span class="code">${h.hid}</span>`},{h:'Report',v:h=>`<b>${h.name}</b>`},{h:'Period',v:h=>h.period},{h:'Submitted by',v:h=>h.by},{h:'Submitted',v:h=>h.tl[h.tl.length-1][2]},{h:'Approver',v:()=>R.checker[0]},{h:'',r:1,v:h=>`<button class="btn btn-sm btn-s" onclick="event.stopPropagation();go('${S.role}','reports/h:${h.hid}')">Review</button>`}], pend, {click:h=>`go('${S.role}','reports/h:${h.hid}')`}), {flush:true}) : `<div class="card empty">Nothing is waiting for approval</div>`;
  if(tab==='scheduled') body=card('', table([{h:'Schedule',v:s=>`<span class="code">${s.id}</span>`},{h:'Report',v:s=>`<b>${s.name}</b>`},{h:'Runs',v:s=>s.freq},{h:'Next run',v:s=>s.on?s.next:'Paused'},{h:'Format',v:s=>s.fmt},{h:'Sent to',v:s=>s.to},
      {h:'Active',r:1,v:(s,i)=>`<button class="toggle ${s.on?'on':''}" onclick="event.stopPropagation();RSCHED[S.role][${i}].on=!RSCHED[S.role][${i}].on;rerender();toast('Schedule '+(RSCHED[S.role][${i}].on?'resumed':'paused'))" aria-label="Pause or resume schedule"></button>`}], RSCHED[S.role], {click:s=>`openBuilder('${s.defId}')`}), {flush:true, sub:'Monthly schedules use the last full month. Reports that need sign-off are created as drafts for the preparer.'});
  if(tab==='shared') body = RSHARED[S.role].length ? card('', table([{h:'From',v:s=>`<span class="row"><span class="agl" style="width:28px;height:28px">${agLogo(ROLES[s.from],22)}</span><b>${ROLES[s.from].name}</b></span>`},{h:'Report',v:s=>`<b>${s.name}</b>`},{h:'Period',v:s=>s.period},{h:'Shared by',v:s=>s.by},{h:'When',v:s=>s.at},{h:'Note',v:s=>`<span class="small">${esc(s.note||'')}</span>`}], RSHARED[S.role], {click:(s,i)=>`go('${S.role}','reports/s:${i}')`}), {flush:true}) : `<div class="card empty">No reports have been shared with you yet</div>`;
  return phead(`Reports run on the same data as the dashboards, show their arithmetic checks and definitions, and keep a full approval and audit trail.${hasFlow?` Reports that leave ${R.name} are prepared by ${R.maker[0]} and approved by ${R.checker[0]}.`:''}`, actAsSeg()) + `<div class="row wrap" style="margin-bottom:14px">${chips(tabs, tab, 'setRtab')}</div>` + body;
}
const stCls = s => ({'Draft':'mute','Pending approval':'warn','Returned':'bad','Approved':'info','Signed':'ok','Published':'navy','Distributed':'navy','Generated':'info'})[s]||'mute';
function setRtab(k){ S.f.rtab=k; rerender(); }
function actAsSeg(){ if(!RDEF[S.role].some(d=>d.flow!=='none')) return ''; const R=ROLES[S.role];
  return `<span class="small muted">Acting as</span><div class="seg"><button class="${S.actAs==='maker'?'on':''}" onclick="setActAs('maker')">${R.maker[0]}, preparer</button><button class="${S.actAs==='checker'?'on':''}" onclick="setActAs('checker')">${R.checker[0]}, approver</button></div>`; }
function setActAs(k){ S.actAs=k; renderShell(); toast(`Now acting as ${ROLES[S.role][k][0]}`,'swap'); }
function openBuilder(id){ go(S.role,'reports/b:'+id); }
const me = () => ROLES[S.role][S.actAs==='checker'?'checker':'maker'][0];

/* ---------- builder ---------- */
function builder(id){
  const d=findDef(S.role,id); if(!d) return `<div class="card empty">Report not found</div>`;
  const p=params(S.role,id), fl=FLOW[d.flow];
  return `<div class="row wrap" style="margin-bottom:12px"><button class="btn btn-s btn-sm" onclick="go('${S.role}','reports')">${ic('back')}All reports</button><span class="grow"></span>${actAsSeg()}</div>
  ${stepsBar(fl.steps, 2)}
  <div class="grid g-12"><div class="stack">${paramPanel(d,p)}
      ${card('What happens next', `<ol class="note" style="margin-left:16px">${d.flow==='signoff'?`<li>Save a draft or submit. ${ROLES[S.role].checker[0]} reviews the same figures and checks.</li><li>When approved, the report is signed, locked and given a document hash.</li><li>Distribute it to recipients${d.to?' or share it with other agencies':''}. Every step is in the audit trail.</li>`:d.flow==='publish'?`<li>Submit for approval by ${ROLES[S.role].checker[0]}.</li><li>An approved bulletin is locked.</li><li>Publish it to the Ministry website and the open data portal.</li>`:`<li>Export as PDF, Excel or CSV, or save it to Generated.</li><li>Schedule it to run automatically.</li>${d.to?'<li>Share it with another agency.</li>':''}`}</ol>`)}</div>
    <div>${previewBlock(d,p)}</div></div>`;
}
function stepsBar(steps, cur){ return `<div class="steps">${steps.map((s,i)=>`<span class="${i<cur?'done':i===cur?'on':''}"><i>${i<cur?ic('check'):''}</i>${s}</span>`).join('')}</div>`; }
function paramPanel(d,p){
  const [a,b]=rng(p); const iso=i=>dayUTC(i).toISOString().slice(0,10);
  const ms=(key,list)=>`<div class="ms">${list.map(([v,l])=>`<label class="${p[key].includes(v)?'on':''}" tabindex="0" onclick="togP('${d.id}','${key}',${typeof v==='string'?`'${v}'`:v})">${l}</label>`).join('')}</div>`;
  let period;
  if(d.fixed) period=`<div class="field">Period<span class="hint">${d.fixed}</span></div>`;
  else if(d.monthly) period=`<label class="field">Month<select onchange="setP('${d.id}','period',this.value)">${MONTHKEYS.slice().reverse().map(k=>`<option value="month:${k}" ${p.period==='month:'+k?'selected':''}>${mLabel(k)}${monthRangeFull(k)[1]>=LAST?' (to date)':''}</option>`).join('')}</select><span class="hint">Whole months only</span></label>`;
  else period=`<label class="field">Period<select onchange="setP('${d.id}','period',this.value)">${Object.keys(PERIODS).map(k=>`<option value="${k}" ${p.period===k?'selected':''}>${PERIODS[k].l}</option>`).join('')}<option value="custom" ${p.period==='custom'?'selected':''}>Custom dates</option></select><span class="hint">${prdLabel(a,b)} · ${plural(b-a+1,'day')}</span></label>
    ${p.period==='custom'?`<div class="f2"><label class="field">From<input id="pFrom" type="date" min="${iso(0)}" max="${iso(LAST)}" value="${iso(a)}" onchange="setDate('${d.id}')"></label><label class="field">To<input id="pTo" type="date" min="${iso(0)}" max="${iso(LAST)}" value="${iso(b)}" onchange="setDate('${d.id}')"></label></div>`:''}`;
  return card('Parameters', `<div class="stack" style="gap:14px">${period}
    ${(d.groups||[]).length>1?`<label class="field">Break down by<select onchange="setP('${d.id}','group',this.value)">${d.groups.map(g=>`<option value="${g}" ${p.group===g?'selected':''}>${GH[g]}</option>`).join('')}</select></label>`:''}
    ${d.filters.includes('cp')?`<div class="field">Entry points<span class="hint">None selected means all</span>${ms('cps',CP.map((c,i)=>[i,c.short]))}</div>`:''}
    ${d.filters.includes('mode')?`<div class="field">Entry mode${ms('modes',MODES.map(m=>[m,MODE[m].l]))}</div>`:''}
    ${d.filters.includes('mkt')?`<div class="field">Markets${ms('mkts',MKT.map((m,i)=>[i,m[1]]))}</div>`:''}
    <div class="row"><button class="btn btn-s btn-sm" onclick="resetP('${d.id}')">${ic('refresh')}Reset</button><span class="grow"></span><span class="small muted">Data to ${HHMM} ${MYT}</span></div></div>`);
}
function setP(id,k,v){ const p=params(S.role,id); p[k]=v; if(k==='period'&&v==='custom'){ const [a,b]=PERIODS.last7.r(); p.from=a; p.to=b; } rerender(); }
function setDate(id){ const p=params(S.role,id); const toIdx=v=>Math.round((Date.parse(v+'T00:00:00Z')-GO_LIVE_UTC)/864e5); const f=toIdx($('#pFrom').value), t=toIdx($('#pTo').value);
  if(isNaN(f)||isNaN(t)){ toast('Enter both dates','alert'); return; } if(t<f){ fieldErr('pTo','The end date must be on or after the start date'); return; }
  p.from=Math.max(0,Math.min(LAST,f)); p.to=Math.max(0,Math.min(LAST,t)); rerender(); }
function togP(id,k,v){ const p=params(S.role,id); const i=p[k].indexOf(v); if(i>=0) p[k].splice(i,1); else p[k].push(v); rerender(); }
function resetP(id){ delete S.rp[S.role+':'+id]; rerender(); toast('Parameters reset','refresh'); }
function previewBlock(d,p){
  const sub=d.flow==='none', checker=S.actAs==='checker';
  const acts=`<div class="row wrap" style="margin-bottom:12px;gap:8px"><span class="grow small muted">${sub?'The preview follows your parameters':'Preview, not yet submitted'}</span>
    <button class="btn btn-s btn-sm" onclick="exportModal('${d.id}')">${ic('download')}Export</button>
    <button class="btn btn-s btn-sm" onclick="schedModal('${d.id}')">${ic('clock')}Schedule</button>
    ${d.to&&sub?`<button class="btn btn-s btn-sm" onclick="shareModal('${d.id}')">${ic('share')}Share</button>`:''}
    ${sub?`<button class="btn btn-p btn-sm" onclick="saveRun('${d.id}','Generated')">${ic('check')}Save to Generated</button>`
       :`<button class="btn btn-s btn-sm" onclick="saveRun('${d.id}','Draft')" ${checker?'disabled':''}>Save draft</button><button class="btn btn-p btn-sm" onclick="saveRun('${d.id}','Pending approval')" ${checker?'disabled':''}>${ic('send')}Submit for ${d.flow==='signoff'?'sign-off':'approval'}</button>`}</div>
    ${!sub&&checker?alertBox('info','lock','Approvers do not prepare reports','Switch "Acting as" to the preparer to save or submit. This keeps maker and checker separate.'):''}`;
  return acts + `<div class="mt">${paper(d,p,{status:sub?null:'Preview'})}</div>`;
}
function paper(d,p,meta={}){
  const R=ROLES[meta.role||S.role]; const r=d.run(p);
  const wm = ({Preview:'DRAFT PREVIEW',Draft:'DRAFT','Pending approval':'AWAITING APPROVAL',Returned:'RETURNED'})[meta.status]||null;
  const asAt = meta.at || opDate();
  return `<div class="paper">${wm?`<span class="wm">${wm}</span>`:''}
    <div class="phd"><div class="row" style="gap:14px;align-items:flex-start">${R.logo!=='SG'?`<img src="${LOGO[R.logo]}" alt="" style="height:46px">`:''}<img src="${LOGO.full}" alt="Sabah GO"><div><div class="small b">${R.who}</div><h2>${d.name}</h2><div class="small">${ptext(p)}${filterNote(p,d)?' · '+filterNote(p,d):''}${p.group&&(d.groups||[]).length>1?' · by '+GH[p.group].toLowerCase():''}</div></div></div>
      <div class="pmeta small">${meta.hid?`<span><b style="color:var(--pInk)">${meta.hid}</b>${meta.v>1?', version '+meta.v:''}</span>`:''}<span>Prepared ${asAt}</span><span>${meta.by?'by '+meta.by:'Sample data'}</span></div></div>
    <div class="psec"><div class="grid g-kpi">${r.kpis.map(k=>`<div class="pill-stat"><small>${k[0]}</small><b>${k[1]}</b></div>`).join('')}</div></div>
    ${meta.comment?`<div class="psec"><h5>Commentary</h5><div class="commentary">${esc(meta.comment)}</div></div>`:''}
    ${r.chart?`<div class="psec">${r.chart}</div>`:''}
    ${r.extra?`<div class="psec"><h5>Summary</h5>${r.extra}</div>`:''}
    <div class="psec" style="padding:0">${table(r.cols.map((c,i)=>({h:c.h,r:c.r,v:row=>row[i]})), r.rows, {foot:r.foot})}</div>
    <div class="psec"><div class="grid g-2e"><div><h5>Definitions</h5><ul class="note">${r.notes.map(n=>`<li>${n}</li>`).join('')}</ul></div>
      <div><h5>Arithmetic checks</h5>${r.checks.length?r.checks.map(c=>`<div class="chk">${icn(c[1]?'check':'x',c[1]?'t-green':'t-red')}<span class="grow">${c[0]}</span><span class="small">${c[2]||''}</span></div>`).join(''):'<p class="note">No arithmetic checks apply to this report.</p>'}
      <div class="note" style="margin-top:8px">Source: Sabah GO data platform, data as at ${asAt}. Sample data. Document hash ${docHash(r,meta.comment||'')}.</div></div></div></div>
    ${meta.sig?`<div class="psec"><div class="sigbox">${icn('sign')}<div class="grow"><b>Digitally signed by ${meta.sig}</b><div class="small">${R.checker[1]} · ${meta.sigAt||''} · hash ${docHash(r,meta.comment||'')} · contents locked</div></div>${badge('Verified','ok')}</div></div>`:''}
  </div>`;
}
function saveRun(id, status){
  const d=findDef(S.role,id), p=params(S.role,id), who=me();
  if(S.actAs==='checker' && status!=='Generated'){ toast('Switch to the preparer to save or submit','lock'); return; }
  if(d.closedOnly && rng(p)[1]===LAST && status!=='Generated'){ toast('This report covers today, which has not closed. Choose a period that ends yesterday or earlier.','clock'); return; }
  const pt=ptext(p), dup=RHIST[S.role].find(h=>h.defId===id&&h.period===pt&&['Pending approval','Signed','Approved','Published','Distributed'].includes(h.status));
  if(dup && status!=='Generated'){ modal('This period already has a report', `${dup.hid} · ${dup.status}`, alertBox('warn','alert','Only one live version per period',`${dup.hid} for ${pt} is ${dup.status.toLowerCase()}. Open it, or return it for a new version, instead of creating a second one.`), `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-p" onclick="closeAll();go('${S.role}','reports/h:${dup.hid}')">Open ${dup.hid}</button>`); return; }
  const tl=[[status==='Generated'?'Generated':'Generated as a draft',who,stamp(0)]]; if(status==='Pending approval') tl.push(['Submitted for '+(d.flow==='signoff'?'sign-off':'approval'),who,stamp(0)]);
  const h=mkHist(S.role,id,p,status,who,tl); RHIST[S.role].unshift(h);
  toast(status==='Pending approval'?`${h.hid} sent to ${ROLES[S.role].checker[0]}`:`${h.hid} saved`);
  go(S.role,'reports/h:'+h.hid);
}

/* ---------- a saved report ---------- */
function histView(hid){
  const h=RHIST[S.role].find(x=>x.hid===hid); if(!h) return `<div class="card empty">Report ${esc(hid)} not found</div>`;
  const d=findDef(S.role,h.defId), fl=FLOW[d.flow], R=ROLES[S.role], who=me(), checker=S.actAs==='checker';
  const stepIdx = {Draft:2,'Pending approval':4,Returned:3,Approved:5,Signed:5,Published:6,Distributed:6,Generated:4}[h.status];
  let acts='';
  if(h.status==='Draft') acts=`<button class="btn btn-p" onclick="histAct('${hid}','submit')" ${checker?'disabled':''}>${ic('send')}Submit for ${d.flow==='signoff'?'sign-off':'approval'}</button><button class="btn btn-s" onclick="histAct('${hid}','discard')" ${checker?'disabled':''}>Discard draft</button>`;
  if(h.status==='Pending approval') acts = checker ? (h.by===R.checker[0] ? alertBox('warn','lock','You prepared this report','The same person cannot prepare and approve a report.') : `<button class="btn btn-p" onclick="approveModal('${hid}')">${ic(d.flow==='signoff'?'sign':'check')}${d.flow==='signoff'?'Approve and sign':'Approve'}</button><button class="btn btn-r" onclick="returnModal('${hid}')">Return with comments</button>`)
     : `${alertBox('info','clock',`Waiting for ${R.checker[0]}`,'Switch "Acting as" to the approver to continue.')}<button class="btn btn-s" onclick="histAct('${hid}','recall')">Recall to draft</button>`;
  if(h.status==='Returned') acts=`<button class="btn btn-p" onclick="reviseModal('${hid}')" ${checker?'disabled':''}>${ic('refresh')}Prepare version ${h.v+1}</button>`;
  if(h.status==='Signed') acts=`<button class="btn btn-p" onclick="distModal('${hid}')">${ic('send')}Distribute</button>`;
  if(h.status==='Approved') acts=`<button class="btn btn-p" onclick="pubModal('${hid}')">${ic('globe')}Publish</button>`;
  acts += `<button class="btn btn-s" onclick="exportModal('${h.defId}','${hid}')">${ic('download')}Export</button>${d.to&&FINAL.includes(h.status)?`<button class="btn btn-s" onclick="shareModal('${h.defId}','${hid}')">${ic('share')}Share</button>`:''}`;
  return `<div class="row wrap" style="margin-bottom:12px"><button class="btn btn-s btn-sm" onclick="S.f.rtab='history';go('${S.role}','reports')">${ic('back')}Generated reports</button><span class="grow"></span>${actAsSeg()}</div>
  ${stepsBar(fl.steps, stepIdx)}
  <div class="grid g-21"><div>${paper(d,h.p,{status:h.status,hid:h.hid,v:h.v,at:h.at,by:h.by,comment:h.comment,sig:['Signed','Distributed','Approved','Published'].includes(h.status)&&d.flow!=='none'?h.sig:null,sigAt:(h.tl.slice().reverse().find(t=>/^Approved/.test(t[0]))||[])[2]})}</div>
    <div class="stack">${card(h.hid, `<div class="stack"><div class="row between">${badge(h.status,stCls(h.status))}<span class="small muted">Version ${h.v}</span></div>
        <div class="kv"><div><small>Report</small><b>${h.name}</b></div><div><small>Period</small><b>${h.period}</b></div><div><small>Prepared by</small><b>${h.by}</b></div><div><small>Approver</small><b>${d.flow==='none'?'Not needed':R.checker[0]}</b></div><div><small>Document hash</small><b>${h.hash}</b></div><div><small>You are</small><b>${who}</b></div></div>
        <div class="row wrap" style="gap:8px">${acts}</div></div>`)}
      ${card('Audit trail', `<div class="tl">${h.tl.map(t=>`<div class="st ${/Returned/.test(t[0])?'rej':'done'}"><b>${t[0]}</b><small>${t[1]} · ${t[2]}</small>${t[3]?`<div class="small" style="margin-top:4px;padding:8px 10px;border-radius:10px;background:rgba(20,96,224,.08)">“${esc(t[3])}”</div>`:''}</div>`).join('')}${h.status==='Pending approval'?`<div class="st pend"><b>${d.flow==='signoff'?'Approve and sign':'Approve'}</b><small>${R.checker[0]}</small></div>`:''}</div>`)}</div></div>`;
}
function histAct(hid,a){ const H=RHIST[S.role], h=H.find(x=>x.hid===hid), who=me(), d=findDef(S.role,h.defId);
  if(a==='submit'){ h.status='Pending approval'; h.tl.push(['Submitted for '+(d.flow==='signoff'?'sign-off':'approval'),who,stamp(0)]); toast(`Sent to ${ROLES[S.role].checker[0]}`,'send'); }
  if(a==='discard'){ H.splice(H.indexOf(h),1); toast('Draft discarded'); S.f.rtab='history'; go(S.role,'reports'); return; }
  if(a==='recall'){ h.status='Draft'; h.tl.push(['Recalled to draft',who,stamp(0)]); toast('Recalled to draft'); }
  rerender(); }
function reviseModal(hid){ const h=RHIST[S.role].find(x=>x.hid===hid); const ask=(h.tl.slice().reverse().find(t=>t[0]==='Returned')||[])[3]||'';
  modal(`Prepare version ${h.v+1}`, `${h.hid} · ${h.name}`, `${ask?alertBox('warn','msg','The approver asked',esc(ask)):''}<label class="field">Commentary for this version<textarea id="rvC" rows="4" placeholder="Explain the change or add the information requested">${esc(h.comment||'')}</textarea><span class="hint">Shown on the report and included in its document hash.</span></label>`,
  `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-p" onclick="doRevise('${hid}')">Create version ${h.v+1}</button>`); }
function doRevise(hid){ const c=$('#rvC').value.trim(); if(!c){ fieldErr('rvC','Add commentary that answers the approver'); return; } const h=RHIST[S.role].find(x=>x.hid===hid), d=findDef(S.role,h.defId);
  h.v++; h.comment=c; h.status='Draft'; h.hash=docHash(d.run(h.p),c); h.tl.push([`Version ${h.v} prepared with commentary`,me(),stamp(0)]); closeAll(); rerender(); toast(`Version ${h.v} is a draft. Submit it when ready.`); }
function approveModal(hid){ const h=RHIST[S.role].find(x=>x.hid===hid), d=findDef(S.role,h.defId), r=d.run(h.p);
  modal(d.flow==='signoff'?'Approve and sign':'Approve for publication', `${h.hid} · ${h.name} · ${h.period}`, `
    ${alertBox(r.checks.every(c=>c[1])?'ok':'warn','shield','You are confirming the figures and checks shown', `${r.checks.filter(c=>c[1]).length} of ${r.checks.length} arithmetic checks pass. Document hash ${h.hash} is locked into the signature.`)}
    <label class="field">Comment (optional)<textarea id="apC" rows="2" placeholder="Shown in the audit trail"></textarea></label>
    <div class="alert info">${icn('lock')}<div class="grow"><b>Confirm with two-factor authentication</b><small>A prompt goes to ${ROLES[S.role].checker[0]}'s registered device. No password is typed here.</small></div></div>`,
    `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-p" onclick="doApprove('${hid}')">${ic('sign')}${d.flow==='signoff'?'Sign':'Approve'}</button>`); }
function doApprove(hid){ const h=RHIST[S.role].find(x=>x.hid===hid), d=findDef(S.role,h.defId), c=$('#apC').value.trim();
  h.status=d.flow==='signoff'?'Signed':'Approved'; h.sig=me(); h.tl.push([d.flow==='signoff'?'Approved and signed':'Approved',me(),stamp(0),c||undefined]); closeAll(); rerender(); toast(`${h.hid} ${d.flow==='signoff'?'signed and locked':'approved'}`,'sign'); }
function returnModal(hid){ modal('Return to the preparer','Say what needs to change. The preparer creates a new version with commentary.', `<label class="field">Comments<textarea id="rtC" rows="3" placeholder="What should change?"></textarea></label>`,
  `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-r" onclick="doReturn('${hid}')">Return</button>`); }
function doReturn(hid){ const c=$('#rtC').value.trim(); if(!c){ fieldErr('rtC','Add a comment so the preparer knows what to change'); return; } const h=RHIST[S.role].find(x=>x.hid===hid); h.status='Returned'; h.tl.push(['Returned',me(),stamp(0),c]); closeAll(); rerender(); toast('Returned to '+h.by); }
const RECIPIENTS = {ops:['KePKAS','Ministry of Finance Sabah','Immigration Sabah','Sabah GO management'],tourism:['Minister\'s office','Sabah Tourism Board','Ministry of Finance Sabah','Media list'],finance:['State Treasury','National Audit Department','Sabah GO Operations','Concession partner'],immigration:['Immigration headquarters','Sabah state director','Sabah GO Operations'],merchant:['My accountant']};
function distModal(hid){ const h=RHIST[S.role].find(x=>x.hid===hid);
  modal('Distribute the signed report', `${h.hid} · ${h.name}`, `<div class="field">Recipients<div class="ms">${RECIPIENTS[S.role].map((a,i)=>`<label class="${i<2?'on':''}" tabindex="0" onclick="this.classList.toggle('on')">${a}</label>`).join('')}</div></div><label class="field">Format<select><option>Signed PDF</option><option>Signed PDF and Excel data</option></select></label><p class="note">Recipients get a secure link. Every opening is logged and the link expires after 30 days.</p>`,
  `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-p" onclick="doDist('${hid}')">${ic('send')}Send</button>`); }
function doDist(hid){ const sel=[...document.querySelectorAll('#modal .ms label.on')].map(x=>x.textContent); if(!sel.length){ toast('Choose at least one recipient','alert'); return; } const h=RHIST[S.role].find(x=>x.hid===hid); h.status='Distributed'; h.tl.push(['Distributed to '+sel.join(', '),me(),stamp(0)]); closeAll(); rerender(); toast('Sent to '+plural(sel.length,'recipient'),'send'); }
function pubModal(hid){ const h=RHIST[S.role].find(x=>x.hid===hid);
  modal('Publish the bulletin', `${h.hid} · ${h.period}`, `<div class="field">Channels<div class="ms">${['Ministry website','Open data portal (CSV)','Media list','Sabah Tourism Board'].map((a,i)=>`<label class="${i<2?'on':''}" tabindex="0" onclick="this.classList.toggle('on')">${a}</label>`).join('')}</div></div>`,
  `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-p" onclick="doPub('${hid}')">${ic('globe')}Publish</button>`); }
function doPub(hid){ const sel=[...document.querySelectorAll('#modal .ms label.on')].map(x=>x.textContent); if(!sel.length){ toast('Choose at least one channel','alert'); return; } const h=RHIST[S.role].find(x=>x.hid===hid); h.status='Published'; h.tl.push(['Published to '+sel.join(', '),me(),stamp(0)]); closeAll(); rerender(); toast('Bulletin published','globe'); }

/* ---------- shared with us ---------- */
function sharedView(i){ const s=RSHARED[S.role][i]; if(!s) return `<div class="card empty">Not found</div>`; const d=findDef(s.from,s.defId);
  return `<div class="row wrap" style="margin-bottom:12px"><button class="btn btn-s btn-sm" onclick="S.f.rtab='shared';go('${S.role}','reports')">${ic('back')}Shared with us</button><span class="grow"></span><button class="btn btn-s btn-sm" onclick="exportModal('${s.defId}',null,'${s.from}',${i})">${ic('download')}Export</button></div>
  ${alertBox('info','share',`Shared by ${s.by}, ${ROLES[s.from].name}`, `${s.at}${s.note?' · “'+esc(s.note)+'”':''} · read-only copy`)}<div class="mt">${paper(d,s.p,{at:s.at,by:s.by,role:s.from})}</div>`; }
function shareModal(id, hid){ const d=findDef(S.role,id); const p = hid ? RHIST[S.role].find(x=>x.hid===hid).p : params(S.role,id);
  modal('Share with another agency', `${d.name} · ${ptext(p)}`, `<div class="field">Share with<div class="ms">${d.to.map((r,i)=>`<label class="${i===0?'on':''}" tabindex="0" data-r="${r}" onclick="this.classList.toggle('on')">${ROLES[r].name}</label>`).join('')}</div></div><label class="field">Note<input id="shN" placeholder="Optional message"></label><p class="note">The agency gets a read-only copy under Reports, Shared with us. Sharing is logged.</p>`,
  `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-p" onclick="doShare('${id}','${hid||''}')">${ic('share')}Share</button>`); }
function doShare(id, hid){ const to=[...document.querySelectorAll('#modal .ms label.on')].map(x=>x.dataset.r); if(!to.length){ toast('Choose an agency','alert'); return; }
  const p = hid ? RHIST[S.role].find(x=>x.hid===hid).p : params(S.role,id);
  to.forEach(r=>RSHARED[r].unshift({from:S.role, defId:id, name:findDef(S.role,id).name, p:JSON.parse(JSON.stringify(p)), period:ptext(p), at:stamp(0), by:me(), note:$('#shN').value.trim()}));
  if(hid){ RHIST[S.role].find(x=>x.hid===hid).tl.push(['Shared with '+to.map(r=>ROLES[r].name).join(', '),me(),stamp(0)]); }
  AUDIT.unshift([HHMM,me(),ROLES[S.role].name,'Shared report',`${findDef(S.role,id).name} · ${ptext(p)}`]); closeAll(); if(hid) rerender(); toast('Shared with '+to.map(r=>ROLES[r].name).join(', '),'share'); }
function schedModal(id){ const d=findDef(S.role,id);
  modal('Schedule this report', d.name, `<div class="f2"><label class="field">Runs<select id="scF">${[...new Set([d.freq,'Daily · 08:00','Weekly · Monday','Monthly · 1st','Monthly · 5th'])].filter(x=>!/demand|After|request/.test(x)).map(x=>`<option ${x===d.freq?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">Format<select id="scX"><option>PDF</option><option>Excel</option><option>CSV</option></select></label></div>
    <label class="field">Send to<input id="scT" value="${S.role==='merchant'?'Your email':'Department inbox'}"></label><p class="note">${d.monthly?'Each run uses the last full month.':'Each run uses the same rolling period as now ('+(PERIODS[params(S.role,id).period]||{l:'custom dates'}).l.toLowerCase()+').'}${d.flow!=='none'?' Runs are saved as drafts for the preparer to submit.':''}</p>`,
  `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-p" onclick="doSched('${id}')">${ic('clock')}Create schedule</button>`); }
function doSched(id){ const d=findDef(S.role,id), f=$('#scF').value; RSCHED[S.role].unshift({id:'SCH-'+(400+RSCHED[S.role].length)+RCODE[S.role], defId:id, name:d.name, freq:f, next:nextOf(f), fmt:$('#scX').value, to:$('#scT').value||'Department inbox', on:true}); closeAll(); toast('Schedule created. Next run '+nextOf(f)+'.','clock'); }

/* ---------- exports ---------- */
function exportModal(id, hid, fromRole, sharedIdx){ const d=findDef(fromRole||S.role,id); const h=hid?RHIST[S.role].find(x=>x.hid===hid):null; const draft = d.flow!=='none' && (!h || !FINAL.includes(h.status));
  modal('Export report', 'Every export is written to the audit log.', `${draft?alertBox('warn','alert','Not yet approved','The export will be marked DRAFT until the report is approved.'):''}
  <label class="field">Format<select id="exF"><option value="xlsx">Excel (.xlsx)</option><option value="csv">CSV</option><option value="pdf">PDF (print)</option></select></label>
  <p class="note">Excel and CSV hold numbers as numbers, with the report status, version, hash and signer at the top.</p>`,
  `<button class="btn btn-s" onclick="closeAll()">Cancel</button><button class="btn btn-p" onclick="doExport('${id}','${hid||''}','${fromRole||''}',${sharedIdx??'null'})">${ic('download')}Export</button>`); }
function doExport(id, hid, fromRole, si){
  const role=fromRole||S.role, d=findDef(role,id), h=hid?RHIST[S.role].find(x=>x.hid===hid):null, p=h?h.p:si!==null?RSHARED[S.role][si].p:params(S.role,id);
  const fmt=$('#exF').value, r=d.run(p), txt=v=>{ const e=document.createElement('div'); e.innerHTML=String(v); return e.textContent.trim(); };
  const status = h ? h.status : d.flow==='none' ? 'Generated' : 'Draft preview';
  const name = `${h?h.hid:RCODE[role]}_${d.name.replace(/[^A-Za-z0-9]+/g,'-')}_${ptext(p).replace(/[^A-Za-z0-9]+/g,'-')}`;
  const meta = [[d.name],[`${ROLES[role].who} · ${ptext(p)}`],[`Status: ${status}${h?' · '+h.hid+' version '+h.v:''}${h&&h.sig?' · signed by '+h.sig:''} · hash ${docHash(r,h?h.comment:'')}`],[`Data as at ${h?h.at:opDate()} · Sample data`],[]];
  closeAll();
  if(fmt==='csv'||fmt==='xlsx'){
    const head=r.cols.map(c=>c.h), body=r.rows.map(x=>x.map(txt)), foot=r.foot?r.foot.map(txt):null;
    if(fmt==='csv'){ const val=v=>{ const t=typed(v); return t.n!==undefined?String(Math.round(t.n*10000)/10000):v; }; const q=v=>/[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;
      const lines=[...meta,head,...body.map(rw=>rw.map(val)),...(foot?[foot.map(val)]:[])].map(l=>l.map(x=>q(String(x))).join(','));
      download(new Blob(['﻿'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'}), name+'.csv'); }
    else { download(xlsx(d.name, [...meta.map(m=>m.map(x=>({s:x}))), head.map(x=>({s:x})), ...body.map(rw=>rw.map(typed)), ...(foot?[foot.map(typed)]:[])]), name+'.xlsx'); }
  } else { const html=paper(d,p,h?{status:h.status,hid:h.hid,v:h.v,at:h.at,by:h.by,comment:h.comment,sig:['Signed','Distributed','Approved','Published'].includes(h.status)?h.sig:null,role}:{status:d.flow==='none'?null:'Preview',role});
    let pr=$('#print'); if(!pr){ pr=document.createElement('div'); pr.id='print'; document.body.appendChild(pr); } pr.innerHTML=html; setTimeout(()=>window.print(),80); }
  if(h){ h.tl.push([`Exported (${fmt.toUpperCase()})`,me(),stamp(0)]); rerender(); }
  AUDIT.unshift([HHMM,me(),ROLES[S.role].name,'Exported report',`${d.name} · ${ptext(p)} · ${fmt.toUpperCase()} · ${status}`]);
  toast(`${d.name} exported`,'download');
}
