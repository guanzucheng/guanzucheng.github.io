/* ============ 人员管理（正式工 / 临时工，底薪 + 超额利润提成均分） ============ */
const STAFF_ROLES=['店长','烧汤师傅','面点师傅','油炸师傅','售卖员','收银','收碗'];
const ATT_OPTS=[['work','出勤'],['rest','休息'],['leave','请假'],['absent','旷工']];
let staffMonth=curMonthStr();
let attDate=todayStr();
let editingId=null;

function curMonthStr(){const d=new Date();return d.getFullYear()+'-'+pad2(d.getMonth()+1);}
function escStaff(s){return String(s==null?'':s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function monthRevenue(m){return S.records.filter(r=>r.date&&r.date.indexOf(m)===0).reduce((a,r)=>a+(Number(r.revenue)||0),0);}
function attendDays(e,m){const d=e.attend||{};let n=0;Object.keys(d).forEach(k=>{if(k.indexOf(m)===0&&(d[k]==='work'||d[k]==='overtime'))n++;});return n;}

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
  const days=attendDays(e,m);
  const base=Number(e.base)||0;
  const fixed=e.type==='temp'?Math.round(base*days*100)/100:base;
  const comm=Math.round((Number(avgComm)||0)*100)/100;
  const total=Math.round((fixed+comm)*100)/100;
  return {days,fixed,comm,total};
}

function renderStaff(){
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
    const tag=e.type==='temp'?'临时':'正式';
    const st=e.status==='off'?'<span class="tag warn">离职</span>':'<span class="tag ok">在职</span>';
    const baseTxt=e.type==='temp'?('日薪 '+money(e.base||0)+' 元/天'):('底薪 '+money(e.base||0)+' 元/月');
    return `<div class="item">
      <div>
        <div class="nm">${escStaff(e.name)} ${st}</div>
        <div class="sub">${escStaff(e.role)} · ${tag} · ${baseTxt}${e.phone?' · '+escStaff(e.phone):''}</div>
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
    return `<div class="item"><div class="nm" style="min-width:74px">${escStaff(e.name)}</div><div class="bar">${btns}</div></div>`;
  }).join('');
}

function renderPayroll(pool,avg,on){
  const body=$('payBody'); const sum=$('paySum'); if(!body)return;
  if(!on.length){body.innerHTML='<tr><td colspan="6" class="mini">暂无在职人员。</td></tr>';if(sum)sum.textContent='';return;}
  let sf=0;
  body.innerHTML=on.map(e=>{
    const w=staffWage(e,staffMonth,avg);
    sf+=w.fixed;
    const baseTxt=e.type==='temp'?`日薪 ${money(e.base||0)}×${w.days} 天`:`底薪 ${money(e.base||0)}`;
    return `<tr><td>${escStaff(e.name)}</td><td>${e.type==='temp'?'临时':'正式'}</td><td>${baseTxt}</td><td>${w.days} 天</td><td>${money(w.comm)}</td><td><b>${money(w.total)}</b></td></tr>`;
  }).join('')+`<tr><td colspan="4" class="mini">合计</td><td><b>${money(pool)}</b></td><td><b>${money(Math.round((sf+pool)*100)/100)}</b></td></tr>`;
  if(sum)sum.textContent=`固定部分合计 ${money(sf)} 元，提成池 ${money(pool)} 元（人均 ${money(avg)} 元），应发合计 ${money(Math.round((sf+pool)*100)/100)} 元。`;
}

function collectStaffForm(){
  return {
    name:$('stName').value.trim(),
    role:$('stRole').value,
    type:$('stType').value,
    status:$('stStatus').value,
    base:Number($('stBase').value)||0,
    phone:$('stPhone').value.trim(),
    start:$('stStart').value
  };
}
function syncBaseLabel(){
  const lab=$('stBaseLabel'); if(lab)lab.textContent=$('stType').value==='temp'?'日工资（元/天）':'月底薪（元/月）';
}
function onTypeChange(){ syncBaseLabel(); }
function resetStaffForm(){
  editingId=null;
  ['stName','stPhone','stStart','stBase'].forEach(id=>{const el=$(id);if(el)el.value='';});
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
  $('stPhone').value=e.phone;$('stStart').value=e.start;
  $('staffFormTitle').textContent='修改人员';
  $('btnStaffSave').textContent='保存修改';
  $('btnStaffCancel').hidden=false;
  syncBaseLabel();
}
function staffSave(){
  const f=collectStaffForm();
  if(!f.name){toast('先填姓名');return;}
  if(editingId){
    const e=S.staff.find(x=>x.id===editingId);
    if(e){Object.assign(e,f);logAdd('staff','修改',f.name);}
  }else{
    f.id='e'+Math.random().toString(36).slice(2,8);
    f.attend={};
    S.staff.push(f);
    logAdd('staff','新增',f.name);
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
