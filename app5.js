/* ============ 人员管理（全职 / 兼职，底薪扣缺勤款 + 超额利润提成均分） ============ */
const STAFF_ROLES=['店长','烧汤师傅','面点师傅','油炸师傅','售卖员','收银','收碗'];
const ATT_OPTS=[['work','出勤'],['rest','休息'],['leave','请假']];
let staffMonth=curMonthStr();
let attDate=todayStr();
let editingId=null;

function curMonthStr(){const d=new Date();return d.getFullYear()+'-'+pad2(d.getMonth()+1);}
function escStaff(s){return String(s==null?'':s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function monthRevenue(m){return S.records.filter(r=>r.date&&r.date.indexOf(m)===0).reduce((a,r)=>a+(Number(r.revenue)||0),0);}
function attendDays(e,m){const d=e.attend||{};let n=0;Object.keys(d).forEach(k=>{if(k.indexOf(m)===0&&(d[k]==='work'||d[k]==='overtime'))n++;});return n;}
/* 当月日历天数（日工资分母，与十月表口径：基本工资 ÷ 31） */
function daysInMonth(m){const p=String(m).split('-').map(Number);return new Date(p[0],p[1],0).getDate();}
/* 逐日考勤统计：rest=公休，leave=请假（均计缺勤） */
function countAttend(e,m,kind){
  const d=e.attend||{};let n=0;
  Object.keys(d).forEach(k=>{
    if(k.indexOf(m)!==0)return;
    if(kind==='rest'&&d[k]==='rest')n++;
    if(kind==='leave'&&d[k]==='leave')n++;
  });
  return n;
}
/* 考勤口径：公休天数在人员表单按月调整；请假按每日考勤板统计；实出勤=应出勤-公休-请假 */
function attendance(e,m){
  const total=daysInMonth(m);
  const ma=(e.monthAtt||{})[m]||{};
  const rest=ma.rest!=null?(Number(ma.rest)||0):countAttend(e,m,'rest');
  const leave=countAttend(e,m,'leave');
  const work=Math.max(total-rest-leave,0);
  const hours=Number(ma.hours)||0;
  return {total,rest,leave,work,hours};
}

function staffCfg(){
  if(!S.staffCfg)S.staffCfg={};
  if(S.staffCfg.poolRate==null)S.staffCfg.poolRate=20;
  return S.staffCfg;
}
/* 月保本营业额：固定开支 ÷ 65% 综合毛利率（与运营成本页同口径） */
function beMonthly(){
  const c=S.cost||{};
  const fixed=(Number(c.rent)||0)+(Number(c.water)||0)+(Number(c.labor)||0)+(Number(c.logistics)||0)+(Number(c.other)||0);
  const be=fixed>0?Math.round(fixed/0.65*100)/100:0;
  return {fixed,be};
}
function monthProfit(rev){const {be}=beMonthly();return Math.max(Math.round((rev-be)*100)/100,0);}

function staffWage(e,m,avgComm){
  const att=attendance(e,m);
  const base=Number(e.base)||0;
  const hourly=Number(e.hourly)||0;
  const days=att.work;
  let fixed,deduct=0,byHour=false;
  if(e.type==='temp'){
    if(hourly>0&&att.hours>0){
      byHour=true;
      fixed=Math.round(hourly*att.hours*100)/100;
    }else{
      fixed=Math.round(base*days*100)/100;
    }
  }else{
    const dayWage=att.total>0?base/att.total:0;
    deduct=Math.round(dayWage*att.leave*100)/100;
    fixed=Math.max(Math.round((base-deduct)*100)/100,0);
  }
  /* 全勤奖：当月无请假即发（公休带薪不影响全勤）；填了金额才发 */
  const bonusRaw=Number(e.attBonus)||0;
  const bonus=att.leave===0?Math.round(bonusRaw*100)/100:0;
  const comm=Math.round((Number(avgComm)||0)*100)/100;
  const total=Math.round((fixed+bonus+comm)*100)/100;
  return {att,days,fixed,deduct,bonus,comm,total,byHour,hours:att.hours,hourly};
}
/* 当月固定工资合计：全职底薪扣缺勤款＋兼职（时薪×工时 或 日薪×出勤天数），不含提成池，供运营成本页自动取数 */
function staffFixedTotal(m){
  const mm=m||staffMonth;
  const on=S.staff.filter(e=>e.status==='on');
  return Math.round(on.reduce((a,e)=>a+staffWage(e,mm,0).fixed,0)*100)/100;
}

function renderStaff(){
  syncBaseLabel();
  const m=$('staffMonth'); if(m)m.value=staffMonth;
  const rev=monthRevenue(staffMonth);
  const revEl=$('staffMonthRev'); if(revEl)revEl.value=money(rev)+' 元';
  const {be}=beMonthly();
  const profit=monthProfit(rev);
  const cfg=staffCfg();
  const pool=Math.round(profit*(Number(cfg.poolRate)||0)/100*100)/100;
  const on=S.staff.filter(e=>e.status==='on');
  const avg=on.length?Math.round(pool/on.length*100)/100:0;

  const setRate=$('stPoolRate'); if(setRate&&document.activeElement!==setRate)setRate.value=cfg.poolRate;
  const beEl=$('beMonthVal'); if(beEl)beEl.textContent=be>0?money(be)+' 元':'未填固定开支';
  const pfEl=$('profitVal'); if(pfEl)pfEl.textContent=profit>0?money(profit)+' 元':'0 元（未超保本点）';
  const poolEl=$('poolVal'); if(poolEl)poolEl.textContent=money(pool)+' 元';
  const avgEl=$('avgCommVal'); if(avgEl)avgEl.textContent=on.length?money(avg)+' 元/人':'—';

  renderStaffSummary(rev,pool,on);
  renderStaffList();
  renderAttBoard();
  renderPayroll(pool,avg,on);
}

function renderStaffSummary(rev,pool,on){
  let fixedSum=0; on.forEach(e=>{fixedSum+=staffWage(e,staffMonth,0).fixed;});
  const total=Math.round((fixedSum+pool)*100)/100;
  const ratio=rev>0?Math.round(total/rev*1000)/10:0;
  const box=$('staffSummary'); if(!box)return;
  box.innerHTML=[
    ['在岗人数', on.length+' 人'],
    ['当月人工合计', money(total)+' 元'],
    ['人工占营业额', rev>0?ratio+'%':'待填日报']
  ].map(([k,v])=>`<div class="field"><label>${k}</label><div style="font-weight:700;font-size:17px">${v}</div></div>`).join('');
}

function renderStaffList(){
  const box=$('staffList'); if(!box)return;
  if(!S.staff.length){box.innerHTML='<div class="mini">还没有人员，先在上面添加。</div>';return;}
  box.innerHTML=S.staff.map(e=>{
    const tag=e.type==='temp'?'兼职':'全职';
    const st=e.status==='off'?'<span class="tag warn">离职</span>':'<span class="tag ok">在职</span>';
    const baseTxt=e.type==='temp'?(e.hourly?('时薪 '+money(e.hourly||0)+' 元/时'):'未填时薪'):('底薪 '+money(e.base||0)+' 元/月');
    return `<div class="item">
      <div>
        <div class="nm">${escStaff(e.name)} ${st}</div>
        <div class="sub">${escStaff(e.role)} · ${tag} · ${baseTxt}</div>
      </div>
      <div class="bar" style="margin-left:auto">
        <button class="btn plain" data-act="edit" data-id="${e.id}">改</button>
        <button class="btn plain" data-act="del" data-id="${e.id}">删</button>
      </div>
    </div>`;
  }).join('');
}

function renderAttBoard(){
  const box=$('attBoard'); if(!box)return;
  const d=$('attDate'); if(d)d.value=attDate;
  const on=S.staff.filter(e=>e.status==='on');
  if(!on.length){box.innerHTML='<div class="mini">暂无在职人员。</div>';return;}
  box.innerHTML=on.map(e=>{
    const cur=(e.attend||{})[attDate]||'';
    const btns=ATT_OPTS.map(([v,lab])=>`<button type="button" class="seg-btn ${cur===v?'on':''}" data-att="${v}" data-id="${e.id}" style="flex:0 1 auto;padding:6px 10px;font-size:12.5px">${lab}</button>`).join('');
    const ma=(e.monthAtt||{})[staffMonth]||{};
    const hours=ma.hours==null?'':ma.hours;
    const hourField=e.type==='temp'?`<label class="mini" style="margin-right:12px">工时(小时) <input type="number" min="0" id="mh-${e.id}" value="${hours}" style="width:64px"></label>`:'';
    return `<div class="item">
      <div class="nm" style="min-width:74px">${escStaff(e.name)}</div>
      <div class="bar">${btns}${hourField}</div>
    </div>`;
  }).join('');
  on.forEach(e=>{
    const h=$('mh-'+e.id);
    if(h)h.onchange=()=>setMonthAtt(e,'hours',h.value);
  });
}

function renderPayroll(pool,avg,on){
  const body=$('payBody'); const sum=$('paySum'); if(!body)return;
  if(!on.length){body.innerHTML='<tr><td colspan="10" class="mini">暂无在职人员。</td></tr>';if(sum)sum.textContent='';return;}
  let sf=0,ded=0,bonusSum=0;
  body.innerHTML=on.map(e=>{
    const w=staffWage(e,staffMonth,avg);
    sf+=w.fixed; ded+=w.deduct; bonusSum+=w.bonus;
    const att=w.att;
    const baseTxt=w.byHour?`时薪 ${money(w.hourly)} 元/时`:(e.type==='temp'?`日薪 ${money(e.base||0)} 元/天`:`${money(e.base||0)}`);
    const workTxt=w.byHour?`${w.hours} 小时`:(e.type==='temp'?`${att.work} 天`:att.work);
    const deductTxt=e.type==='temp'?'—':money(w.deduct);
    return `<tr>
      <td>${escStaff(e.name)}</td>
      <td>${baseTxt}</td>
      <td>${att.total}</td>
      <td>${att.rest}</td>
      <td>${att.leave}</td>
      <td>${workTxt}</td>
      <td>${deductTxt}</td>
      <td>${money(w.bonus)}</td>
      <td>${money(w.comm)}</td>
      <td><b>${money(w.total)}</b></td>
    </tr>`;
  }).join('')+`<tr><td colspan="7" class="mini">合计</td><td><b>${money(bonusSum)}</b></td><td><b>${money(pool)}</b></td><td><b>${money(Math.round((sf+bonusSum+pool)*100)/100)}</b></td></tr>`;
  if(sum)sum.textContent=`固定部分合计 ${money(sf)} 元，全勤奖 ${money(bonusSum)} 元，缺勤扣款 ${money(ded)} 元，提成池 ${money(pool)} 元（人均 ${money(avg)} 元），应发合计 ${money(Math.round((sf+bonusSum+pool)*100)/100)} 元。`;
}

/* 月度考勤录入：公休天数、兼职工时（请假由每日考勤板统计，不在此录） */
function setMonthAtt(e,key,val){
  if(!e.monthAtt)e.monthAtt={};
  if(!e.monthAtt[staffMonth])e.monthAtt[staffMonth]={};
  const row=e.monthAtt[staffMonth];
  if(val===''){delete row[key];}
  else{const n=Number(val);row[key]=isNaN(n)?0:n;}
  save(); renderStaff();
}

function collectStaffForm(){
  const type=$('stType').value;
  const hv=$('stHourly')?$('stHourly').value.trim():'';
  const bv=$('stBase')?$('stBase').value.trim():'';
  const bn=$('stBonus')?$('stBonus').value.trim():'';
  return {
    name:$('stName').value.trim(),
    role:$('stRole').value,
    type,
    status:$('stStatus').value,
    base:type==='full'?(Number(bv)||0):0,
    hourly:type==='temp'&&hv!==''?Number(hv):null,
    attBonus:bn!==''?Number(bn):null,
    start:$('stStart').value
  };
}
/* 用工类型互斥：全职只显示月底薪，兼职只显示小时工资 */
function syncBaseLabel(){
  const temp=$('stType').value==='temp';
  const bw=$('stBaseWrap'); if(bw)bw.hidden=temp;
  const hw=$('stHourlyWrap'); if(hw)hw.hidden=!temp;
  const lab=$('stBaseLabel'); if(lab)lab.textContent='月底薪（元/月）';
}
function onTypeChange(){ syncBaseLabel(); }
function resetStaffForm(){
  editingId=null;
  ['stName','stStart','stBase','stHourly','stRest','stBonus'].forEach(id=>{const el=$(id);if(el)el.value='';});
  $('stRole').value='售卖员';$('stType').value='full';$('stStatus').value='on';
  $('staffFormTitle').textContent='添加人员';
  $('btnStaffSave').textContent='保存人员';
  $('btnStaffCancel').hidden=true;
  syncBaseLabel();
}
function fillStaffForm(e){
  editingId=e.id;
  $('stName').value=e.name;$('stRole').value=e.role;$('stType').value=e.type;
  $('stStatus').value=e.status;$('stBase').value=e.base==null?'':e.base;
  $('stHourly').value=e.hourly==null?'':e.hourly;
  $('stBonus').value=e.attBonus==null?'':e.attBonus;
  const ma=(e.monthAtt||{})[staffMonth]||{};
  $('stRest').value=ma.rest==null?'':ma.rest;
  $('stStart').value=e.start;
  $('staffFormTitle').textContent='修改人员';
  $('btnStaffSave').textContent='保存修改';
  $('btnStaffCancel').hidden=false;
  syncBaseLabel();
}
function staffSave(){
  const f=collectStaffForm();
  if(!f.name){toast('先填姓名');return;}
  let e;
  if(editingId){
    e=S.staff.find(x=>x.id===editingId);
    if(e){Object.assign(e,f);logAdd('staff','修改',f.name);}
  }else{
    f.id='e'+Math.random().toString(36).slice(2,8);
    f.attend={};
    e=f;
    S.staff.push(f);
    logAdd('staff','新增',f.name);
  }
  /* 公休天数按当前核算月份保存；留空则回退到每日点休息统计 */
  if(e){
    if(!e.monthAtt)e.monthAtt={};
    if(!e.monthAtt[staffMonth])e.monthAtt[staffMonth]={};
    const restVal=$('stRest')?$('stRest').value.trim():'';
    const row=e.monthAtt[staffMonth];
    if(restVal===''){delete row.rest;}
    else{row.rest=Number(restVal)||0;}
  }
  save(); resetStaffForm(); renderStaff(); toast('已保存');
}
function savePoolRate(){
  const cfg=staffCfg();
  cfg.poolRate=Number($('stPoolRate').value)||0;
  save(); renderStaff();
}

function bindStaffEvents(){
  const list=$('staffList');
  if(list)list.addEventListener('click',ev=>{
    const btn=ev.target.closest('button[data-act]'); if(!btn)return;
    const e=S.staff.find(x=>x.id===btn.dataset.id); if(!e)return;
    if(btn.dataset.act==='edit'){fillStaffForm(e);}
    else if(btn.dataset.act==='del'){
      if(confirm('删除 '+e.name+'？考勤记录一并删除。')){
        S.staff=S.staff.filter(x=>x.id!==e.id);
        save(); renderStaff(); toast('已删除');
      }
    }
  });
  const board=$('attBoard');
  if(board)board.addEventListener('click',ev=>{
    const btn=ev.target.closest('button[data-att]'); if(!btn)return;
    const e=S.staff.find(x=>x.id===btn.dataset.id); if(!e)return;
    if(!e.attend)e.attend={};
    const cur=e.attend[attDate];
    if(cur===btn.dataset.att)delete e.attend[attDate]; else e.attend[attDate]=btn.dataset.att;
    save();
    renderAttBoard(); renderStaff();
  });
  const mon=$('staffMonth'); if(mon)mon.addEventListener('change',()=>{staffMonth=mon.value||curMonthStr();renderStaff();});
  const ad=$('attDate'); if(ad)ad.addEventListener('change',()=>{attDate=ad.value||todayStr();renderAttBoard();});
  const ty=$('stType'); if(ty)ty.addEventListener('change',onTypeChange);
  const pr=$('stPoolRate'); if(pr)pr.addEventListener('change',savePoolRate);
  const bs=$('btnStaffSave'); if(bs)bs.addEventListener('click',staffSave);
  const cc=$('btnStaffCancel'); if(cc)cc.addEventListener('click',resetStaffForm);
}

bindStaffEvents();
