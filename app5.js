/* ============ 人员管理（正式工 / 临时工，底薪+提成台账） ============ */
const STAFF_ROLES=['店长','厨师','帮工','收银','杂工','临时工'];
const ATT_OPTS=[['work','出勤'],['overtime','加班'],['rest','休息'],['leave','请假'],['absent','旷工']];
let staffMonth=curMonthStr();
let attDate=todayStr();
let editingId=null;

function curMonthStr(){const d=new Date();return d.getFullYear()+'-'+pad2(d.getMonth()+1);}
function escStaff(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function monthRevenue(m){return S.records.filter(r=>r.date&&r.date.indexOf(m)===0).reduce((a,r)=>a+(Number(r.revenue)||0),0);}
function attendDays(e,m){const d=e.attend||{};let n=0;Object.keys(d).forEach(k=>{if(k.indexOf(m)===0&&(d[k]==='work'||d[k]==='overtime'))n++;});return n;}
function staffWage(e,m,rev){
  const days=attendDays(e,m);
  const base=Number(e.base)||0;
  const comm=Math.round(rev*(Number(e.comm)||0)/100*100)/100;
  const fixed=e.type==='temp'?Math.round(base*days*100)/100:base;
  const total=Math.round((fixed+comm)*100)/100;
  return {days,fixed,comm,total};
}

function renderStaff(){
  const m=$('staffMonth'); if(m)m.value=staffMonth;
  const rev=monthRevenue(staffMonth);
  const revEl=$('staffMonthRev'); if(revEl)revEl.value=money(rev)+' 元';
  renderStaffSummary(rev);
  renderStaffList();
  renderAttBoard();
  renderPayroll(rev);
}

function renderStaffSummary(rev){
  const on=S.staff.filter(e=>e.status==='on');
  let total=0; on.forEach(e=>{total+=staffWage(e,staffMonth,rev).total;});
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
    const commTxt='提成 '+(Number(e.comm)||0)+'%';
    return `<div class="item">
      <div>
        <div class="nm">${escStaff(e.name)} ${st}</div>
        <div class="sub">${escStaff(e.role)} · ${tag} · ${baseTxt} · ${commTxt}${e.phone?' · '+escStaff(e.phone):''}</div>
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

function renderPayroll(rev){
  const body=$('payBody'); const sum=$('paySum'); if(!body)return;
  const on=S.staff.filter(e=>e.status==='on');
  if(!on.length){body.innerHTML='<tr><td colspan="6" class="mini">暂无在职人员。</td></tr>';if(sum)sum.textContent='';return;}
  let sf=0,sc=0,st=0;
  body.innerHTML=on.map(e=>{
    const w=staffWage(e,staffMonth,rev);
    sf+=w.fixed;sc+=w.comm;st+=w.total;
    const baseTxt=e.type==='temp'?`日薪 ${money(e.base||0)}×${w.days} 天`:`底薪 ${money(e.base||0)}`;
    return `<tr><td>${escStaff(e.name)}</td><td>${e.type==='temp'?'临时':'正式'}</td><td>${baseTxt}</td><td>${w.days} 天</td><td>${money(w.comm)}</td><td><b>${money(w.total)}</b></td></tr>`;
  }).join('')+`<tr><td colspan="4" class="mini">合计</td><td><b>${money(sc)}</b></td><td><b>${money(st)}</b></td></tr>`;
  if(sum)sum.textContent=`固定部分合计 ${money(sf)} 元，提成合计 ${money(sc)} 元，应发合计 ${money(st)} 元。`;
}

function collectStaffForm(){
  return {
    name:$('stName').value.trim(),
    role:$('stRole').value,
    type:$('stType').value,
    status:$('stStatus').value,
    base:Number($('stBase').value)||0,
    comm:Number($('stComm').value)||0,
    phone:$('stPhone').value.trim(),
    start:$('stStart').value
  };
}
function syncBaseLabel(){
  const lab=$('stBaseLabel'); if(lab)lab.textContent=$('stType').value==='temp'?'日工资（元/天）':'月底薪（元/月）';
}
function onTypeChange(){
  syncBaseLabel();
  if($('stType').value==='temp')$('stRole').value='临时工';
  else if($('stRole').value==='临时工')$('stRole').value='帮工';
}
function resetStaffForm(){
  editingId=null;
  ['stName','stPhone','stStart','stBase','stComm'].forEach(id=>{const el=$(id);if(el)el.value='';});
  $('stRole').value='帮工';$('stType').value='full';$('stStatus').value='on';
  $('staffFormTitle').textContent='添加人员';
  $('btnStaffSave').textContent='保存人员';
  $('btnStaffCancel').hidden=true;
  syncBaseLabel();
}
function fillStaffForm(e){
  editingId=e.id;
  $('stName').value=e.name;$('stRole').value=e.role;$('stType').value=e.type;
  $('stStatus').value=e.status;$('stBase').value=e.base==null?'':e.base;
  $('stComm').value=e.comm==null?'':e.comm;$('stPhone').value=e.phone;$('stStart').value=e.start;
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
    const rev=monthRevenue(staffMonth);
    renderAttBoard(); renderStaffSummary(rev); renderPayroll(rev);
  });
  const mon=$('staffMonth'); if(mon)mon.addEventListener('change',()=>{staffMonth=mon.value||curMonthStr();renderStaff();});
  const ad=$('attDate'); if(ad)ad.addEventListener('change',()=>{attDate=ad.value||todayStr();renderAttBoard();});
  const ty=$('stType'); if(ty)ty.addEventListener('change',onTypeChange);
  const bs=$('btnStaffSave'); if(bs)bs.addEventListener('click',staffSave);
  const cc=$('btnStaffCancel'); if(cc)cc.addEventListener('click',resetStaffForm);
}

bindStaffEvents();
