/* ============ 日志 ============ */
const LOG_TAG={in:['入库','tag ok'],out:['领用','tag out'],check:['盘点','tag gray'],custom:['自购','tag gray'],rename:['改名','tag gray'],daily:['日报','tag gray'],cost:['成本','tag gray']};
function renderLog(){
  const box=$('logList'); if(!box)return;
  const f=($('lgType')&&$('lgType').value)||'全部';
  const logs=S.logs.slice().reverse().filter(l=>f==='全部'||l.type===f);
  if($('lgCount'))$('lgCount').textContent='共 '+logs.length+' 条';
  if(!logs.length){box.innerHTML='<div class="mini">还没有动作记录，去库存页记一笔就会出现</div>';return;}
  let out='',last='';
  logs.forEach(l=>{
    const d=dateOf(l.at);
    if(d!==last){out+=`<div class="mini" style="margin:10px 0 2px;font-weight:600;color:var(--ink-2)">${d}</div>`;last=d;}
    const t=LOG_TAG[l.type]||['动作','tag gray'];
    const tagHtml=`<span class="tag ${t[1]}" style="margin-left:6px">${t[0]}</span>`;
    out+=`<div class="item"><div><div class="nm" style="font-weight:500">${l.label}${tagHtml}</div><div class="sub">${l.detail||''}</div></div><div class="val mini">${hhmm(l.at)}</div></div>`;
  });
  box.innerHTML=out;
}
function clearLogs(){
  if(!S.logs.length){toast('还没有日志');return;}
  if(!confirm('只清空操作日志，库存和日报数据不动，确定？')){return;}
  S.logs=[]; save(); renderLog(); toast('操作日志已清空');
}

/* ============ 历史 ============ */
function renderRecords(){
  const rows=S.records.slice().sort((a,b)=>b.date.localeCompare(a.date));
  $('recBody').innerHTML=rows.length?rows.map(r=>`<tr><td>${r.date}</td><td>${weekLabel(r.date)}</td><td>${r.weather||'—'}</td><td>${money(r.revenue)}</td></tr>`).join('')
    :'<tr><td colspan="4" class="mini">还没有日报</td></tr>';
  const days=rows.length;
  const total=rows.reduce((a,r)=>a+r.revenue,0);
  const avg=days?total/days:0;
  $('recSum').innerHTML=`<div class="item"><div class="nm">累计营业额</div><div class="val">${money(total)} 元</div></div>
    <div class="item"><div class="nm">记录天数</div><div class="val">${days} 天</div></div>
    <div class="item"><div class="nm">日均</div><div class="val">${money(avg)} 元</div></div>`;
}

/* ============ 导出与设置 ============ */
function download(name,content,type){
  const blob=new Blob([content],{type:type||'text/plain;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}
function csvEscape(v){
  const s=v==null?'':String(v);
  const need=s.indexOf('"')>=0||s.indexOf(',')>=0||s.indexOf('\n')>=0;
  return need?'"'+s.split('"').join('""')+'"':s;
}
function expJson(){download('门店数据备份-'+todayStr()+'.json',JSON.stringify(S,null,2),'application/json');toast('已导出 JSON');}
function expCsv(){
  const head=['日期','星期','天气','总营业额'];
  const rows=S.records.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(r=>[r.date,weekLabel(r.date),r.weather||'',r.revenue]);
  const csv=head.concat(rows).map(r=>r.map(csvEscape).join(',')).join('\n');
  download('门店日报-'+todayStr()+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');toast('已导出日报 CSV');
}
function expCk(){
  if(!S.checks.length){toast('还没有盘点记录');return;}
  const head=['类型','盘点日期','时间','原料','单位','账面','实盘','差异','差异金额'];
  const rows=[];
  S.checks.forEach(c=>c.rows.forEach(r=>{
    const d2=Math.round((r.real-r.book)*100)/100;
    const a=(r.price==null)?'':Math.round(d2*r.price*100)/100;
    rows.push([c.type==='current'?'当期':'月度',c.date,c.time||'',r.n,r.unit,r.book,r.real,d2,a]);
  }));
  const csv=head.concat(rows).map(r=>r.map(csvEscape).join(',')).join('\n');
  download('门店盘点-'+todayStr()+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');toast('已导出盘点 CSV');
}
function saveShop(){
  const v=$('setShop').value.trim();
  if(!v){toast('填个店名');return;}
  S.shopName=v; save(); $('shopName').textContent=v; toast('已保存');
}
function resetAll(){
  if(!confirm('会清空本机所有日报、库存和盘点记录，确定？')){return;}
  S=seed(); save(); $('shopName').textContent=S.shopName; $('setShop').value=S.shopName;
  renderAll(); toast('已清空');
}

/* ============ 路由 ============ */
function show(view){
  curView=view;
  ['daily','stock','check','cost','record','log','setting'].forEach(v=>{$('view-'+v).hidden=v!==view;});
  document.querySelectorAll('.tabs-in button').forEach(b=>b.classList.toggle('on',b.dataset.view===view));
  if(view==='daily') renderDaily();
  if(view==='stock'){renderStock();renderCustom();}
  if(view==='check') renderCheck();
  if(view==='cost') renderCost();
  if(view==='record') renderRecords();
  if(view==='log') renderLog();
  if(view==='setting'){ $('setShop').value=S.shopName; }
  location.hash='#/'+view;
}
function renderAll(){
  $('shopName').textContent=S.shopName;
  renderDaily(); renderStock(); renderCustom(); renderCheck(); renderCost(); renderRecords(); renderLog();
}

$('btnSave').onclick=submitDaily;
$('fDate').onchange=loadDailyForm;
$('ckDate').onchange=()=>{$('ckTitle').textContent=ckTitleFor($('ckDate').value);};
$('btnStock').onclick=stockApply;
$('btnAddCustom').onclick=addCustom;
function switchStockSeg(seg){
  $('seg-stock').hidden=seg!=='stock';
  var list=$('seg-stock-list'); if(list) list.hidden=seg!=='stock';
  $('seg-custom').hidden=seg!=='custom';
  document.querySelectorAll('.seg-btn[data-seg]').forEach(b=>b.classList.toggle('on',b.dataset.seg===seg));
}
document.querySelectorAll('.seg-btn[data-seg]').forEach(b=>b.onclick=()=>switchStockSeg(b.dataset.seg));
document.querySelectorAll('.seg-btn[data-ckseg]').forEach(b=>b.onclick=()=>switchCkSeg(b.dataset.ckseg));
document.querySelectorAll('[data-diff]').forEach(b=>b.onclick=()=>toggleCkDiff());
$('btnCk').onclick=saveCheck;
$('btnCost').onclick=submitCost;
['cRent','cWater','cLabor','cLogistics','cOther'].forEach(id=>$(id).oninput=drawCost);
$('btnShop').onclick=saveShop;
$('btnExpJson').onclick=expJson;
$('btnExpCsv').onclick=expCsv;
$('btnExpCk').onclick=expCk;
$('btnExpStock').onclick=expStock;
$('btnImpPrice').onclick=importPrices;
$('btnExpPrice').onclick=expPrices;
$('btnReset').onclick=resetAll;
$('stCat').onchange=renderStock;
$('stQ').oninput=renderStock;
$('ckCat').onchange=renderCheck;
$('ckQ').oninput=drawCheck;
$('lgType').onchange=renderLog;
$('btnLogClr').onclick=clearLogs;
document.querySelectorAll('.tabs-in button').forEach(b=>b.onclick=()=>show(b.dataset.view));

/* 记一笔：原料搜索组合框交互 */
(function initCombo(){
  const input=$('sItemInput'), box=$('sItemList');
  if(!input||!box) return;
  input.onfocus=()=>{ refreshCombo(); box.hidden=false; };
  input.oninput=()=>{ selItemKey=''; refreshCombo(); };
  document.addEventListener('click',e=>{
    if(!$('sCombo').contains(e.target)) box.hidden=true;
  });
})();

syncCopy();
window.addEventListener('hashchange',()=>{const v=(location.hash||'').replace('#/','');if(v&&v!==curView&&['daily','stock','check','cost','record','log','setting'].indexOf(v)>=0)show(v);});
$('shopName').textContent=S.shopName;
show((location.hash||'#/daily').slice(2)||'daily');
