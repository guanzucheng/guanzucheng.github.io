/* 原料清单：21 项通用原料名称，不含备货量、不含价格、不含成本 */
const MATERIALS = [
  {n:'胡辣汤料',unit:'斤',cat:'食材原料',stock:null},
  {n:'面筋',unit:'斤',cat:'食材原料',stock:null},
  {n:'木耳',unit:'斤',cat:'食材原料',stock:null},
  {n:'虫草花',unit:'斤',cat:'食材原料',stock:null},
  {n:'白胡椒粉',unit:'斤',cat:'食材原料',stock:null},
  {n:'秘制料油',unit:'斤',cat:'食材原料',stock:null},
  {n:'去皮鲜山药',unit:'斤',cat:'食材原料',stock:null},
  {n:'豆沫料',unit:'斤',cat:'食材原料',stock:null},
  {n:'粉条',unit:'斤',cat:'食材原料',stock:null},
  {n:'辣椒面',unit:'斤',cat:'食材原料',stock:null},
  {n:'包子料',unit:'斤',cat:'食材原料',stock:null},
  {n:'胡辣汤碗',unit:'个',cat:'包装物料',stock:null},
  {n:'胡辣汤勺',unit:'个',cat:'包装物料',stock:null},
  {n:'胡辣汤打包',unit:'套',cat:'包装物料',stock:null},
  {n:'外卖纸杯',unit:'套',cat:'包装物料',stock:null},
  {n:'托盘',unit:'个',cat:'包装物料',stock:null},
  {n:'垫纸',unit:'张',cat:'包装物料',stock:null},
  {n:'塑料袋',unit:'个',cat:'包装物料',stock:null},
  {n:'围裙',unit:'件',cat:'其它',stock:null},
  {n:'冬季工装',unit:'件',cat:'其它',stock:null},
  {n:'帽子',unit:'顶',cat:'其它',stock:null},
];

const KEY='ysh_local_v2';
function todayStr(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function seed(){return {shopName:'我的门店', records:[], materials:MATERIALS.map(m=>({...m})), custom:[], checks:[]};}
let S=load();
function load(){try{const raw=localStorage.getItem(KEY);if(raw){const o=JSON.parse(raw);o.custom=o.custom||[];o.records=o.records||[];o.checks=o.checks||[];if(!o.materials||!o.materials.length)o.materials=MATERIALS.map(m=>({...m}));return o;}}catch(e){}return seed();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){toast('存不下，可能浏览器空间满了');}}

const $=id=>document.getElementById(id);
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),1800);}
function money(n){return (Math.round(n*100)/100).toLocaleString('zh-CN',{maximumFractionDigits:2});}
let curView='daily';

/* ============ 物料 ============ */
function lowLine(m){return 1;}
function itemList(){
  const out=[];
  S.materials.forEach((m,i)=>out.push({key:'M'+i,m}));
  S.custom.forEach((c,i)=>out.push({key:'C'+i,m:c}));
  return out;
}
function findItem(key){return key[0]==='M'?S.materials[Number(key.slice(1))]:S.custom[Number(key.slice(1))];}

/* ============ 日报 ============ */
function renderDaily(){
  $('fDate').value=todayStr();
  const rec=S.records.find(r=>r.date===todayStr());
  $('fRev').value=rec?rec.revenue:'';
  $('fDine').value=rec&&rec.dine!=null?rec.dine:'';
  $('fGroup').value=rec&&rec.group!=null?rec.group:'';
  $('fTake').value=rec&&rec.take!=null?rec.take:'';
  $('fNote').value=rec?rec.note||'':'';
  renderRecent();
}
function renderRecent(){
  const rows=S.records.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,7);
  const box=$('recentList');
  if(!rows.length){box.innerHTML='<div class="mini">还没有记录，今天填第一条</div>';return;}
  box.innerHTML=rows.map(r=>{
    const ch=`堂食 ${r.dine!=null?money(r.dine)+' 元':'—'} · 团购 ${r.group!=null?r.group+' 单':'—'} · 外卖 ${r.take!=null?r.take+' 单':'—'}`;
    return `<div class="item"><div><div class="nm">${r.date}</div><div class="sub">${ch}</div></div><div class="val">${money(r.revenue)} 元</div></div>`;
  }).join('');
}
function submitDaily(){
  const rev=Number($('fRev').value);
  if(!rev||rev<=0){toast('总金额还没填');$('fRev').focus();return;}
  const num=v=>v===''?null:Number(v);
  const rec={date:todayStr(),revenue:rev,dine:num($('fDine').value),group:num($('fGroup').value),take:num($('fTake').value),note:$('fNote').value.trim()};
  S.records=S.records.filter(r=>r.date!==todayStr());
  S.records.push(rec); save(); toast('已保存今天的日报'); renderRecent(); renderRecords();
}

/* ============ 库存 ============ */
function renderStock(){
  const cat=($('stCat')&&$('stCat').value)||'全部';
  const list=itemList().filter(({m})=>cat==='全部'||(m.cat||'门店自购')===cat);
  const box=$('stockList');
  if(!list.length){box.innerHTML='<div class="mini">这一类还没有原料</div>';}
  else box.innerHTML=list.map(({key,m})=>{
    const low=false;
    const v=m.stock==null?'—':(m.stock+' '+(m.unit||''));
    const tag=m.stock==null?'<span class="tag gray">未建账</span>':'<span class="tag ok">已建账</span>';
    const ref='';
    const hq='';
    return `<div class="item"><div><div class="nm">${m.n}</div><div class="sub">${m.cat||'门店自购'}${ref}${hq}</div></div>
      <div class="val" style="${low?'color:var(--warn)':''}">${v}</div>${tag}</div>`;
  }).join('');
  $('sItem').innerHTML=list.map(({key,m})=>`<option value="${key}">${m.n}（${m.unit||''}）</option>`).join('');
}
function stockApply(){
  const key=$('sItem').value, q=Number($('sQty').value);
  if(!key){toast('先选原料');return;}
  if(!q||q<=0){toast('数量不对');return;}
  const m=findItem(key); if(!m){toast('原料没找到');return;}
  const cur=m.stock==null?0:m.stock;
  if($('sType').value==='out'&&cur-q<0){toast('库存不够，不能出这么多');return;}
  m.stock=Math.round(($('sType').value==='in'?cur+q:cur-q)*100)/100;
  save(); $('sQty').value=''; renderStock(); toast($('sType').value==='in'?'已入库':'已领用');
}

/* ============ 自购项 ============ */
function renderCustom(){
  const box=$('customList'); if(!box)return;
  if(!S.custom.length){box.innerHTML='<div class="mini">还没有自购项</div>';return;}
  box.innerHTML=S.custom.map((c,i)=>`<div class="item"><div><div class="nm">${c.n}</div>
    <div class="sub">${c.unit||''} · 账面 ${c.stock==null?'未建账':c.stock}</div></div>
    <button class="btn plain" data-del="${i}" type="button">删除</button></div>`).join('');
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{
    S.custom.splice(Number(b.dataset.del),1); save(); renderCustom(); renderStock(); toast('已删除');
  });
}
function addCustom(){
  const n=$('cmName').value.trim();
  if(!n){toast('先填名称');return;}
  if(S.materials.find(m=>m.n===n)||S.custom.find(c=>c.n===n)){toast('这个已经有了');return;}
  S.custom.push({n,unit:$('cmUnit').value.trim()||'件',stock:$('cmQty').value===''?null:Number($('cmQty').value),cat:'门店自购'});
  save(); $('cmName').value='';$('cmUnit').value='';$('cmQty').value='';
  renderCustom(); renderStock(); toast('已加入清单');
}

/* ============ 盘点 ============ */
let ckRows=[];
function renderCheck(){
  const d=new Date();
  $('ckDate').value=todayStr();
  $('ckTitle').textContent=`${d.getFullYear()} 年 ${d.getMonth()+1} 月盘点`;
  const cat=($('ckCat')&&$('ckCat').value)||'食材原料';
  ckRows=itemList().filter(({m})=>cat==='全部'||(m.cat||'门店自购')===cat)
    .map(({key,m})=>({key,n:m.n,unit:m.unit||'',book:m.stock==null?null:m.stock,real:''}));
  const body=$('ckBody');
  body.innerHTML=ckRows.map((r,i)=>`<tr><td>${r.n}</td><td>${r.book==null?'未建账':r.book+' '+r.unit}</td>
    <td><input type="number" data-i="${i}" class="ckIn" placeholder="实盘" style="padding:5px 8px"></td>
    <td class="ckDiff" data-i="${i}">—</td></tr>`).join('');
  body.querySelectorAll('.ckIn').forEach(inp=>{
    inp.oninput=()=>{
      const i=Number(inp.dataset.i), v=inp.value===''?null:Number(inp.value);
      ckRows[i].real=v;
      const cell=body.querySelector(`.ckDiff[data-i="${i}"]`);
      if(v==null){cell.textContent='—';cell.style.color='';}
      else{
        const d2=Math.round((v-(ckRows[i].book==null?0:ckRows[i].book))*100)/100;
        cell.textContent=(d2>0?'+':'')+d2+' '+ckRows[i].unit;
        cell.style.color=d2===0?'':'var(--warn)';
      }
      updateCkTotal();
    };
  });
  updateCkTotal(); renderCkHistory();
}
function updateCkTotal(){
  const filled=ckRows.filter(r=>r.real!=null&&r.real!=='');
  if(!filled.length){$('ckDiff').textContent='已填 0 / '+ckRows.length+' 项';return;}
  let sum=0; filled.forEach(r=>{sum+=Math.abs(r.real-(r.book==null?0:r.book));});
  $('ckDiff').textContent=`已填 ${filled.length} / ${ckRows.length} 项 · 差异量合计 ${Math.round(sum*100)/100}`;
}
function saveCheck(){
  const filled=ckRows.filter(r=>r.real!=null&&r.real!=='');
  if(!filled.length){toast('还没填实盘数');return;}
  S.checks.push({date:todayStr(),by:$('ckBy').value.trim()||'—',rows:filled.map(r=>({n:r.n,unit:r.unit,book:r.book==null?0:r.book,real:r.real}))});
  save(); renderCkHistory(); toast('盘点已保存');
}
function renderCkHistory(){
  const box=$('ckHistory');
  if(!S.checks.length){box.innerHTML='<div class="mini">还没有盘点记录</div>';return;}
  box.innerHTML=S.checks.slice().reverse().map(c=>{
    const diff=c.rows.reduce((a,r)=>a+Math.abs(r.real-r.book),0);
    return `<div class="item"><div><div class="nm">${c.date}</div><div class="sub">${c.rows.length} 项 · 盘点人 ${c.by}</div></div><div class="val">差异量 ${Math.round(diff*100)/100}</div></div>`;
  }).join('');
}

/* ============ 历史 ============ */
function renderRecords(){
  const rows=S.records.slice().sort((a,b)=>b.date.localeCompare(a.date));
  $('recBody').innerHTML=rows.length?rows.map(r=>`<tr><td>${r.date}</td><td>${money(r.revenue)}</td>
    <td>${r.dine!=null?money(r.dine):'—'}</td><td>${r.group!=null?r.group:'—'}</td><td>${r.take!=null?r.take:'—'}</td></tr>`).join('')
    :'<tr><td colspan="5" class="mini">还没有日报</td></tr>';
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
function csvEscape(v){const s=v==null?'':String(v);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function expJson(){download('门店数据备份-'+todayStr()+'.json',JSON.stringify(S,null,2),'application/json');toast('已导出 JSON');}
function expCsv(){
  const head=['日期','总营业额','堂食(元)','团购(单)','外卖(单)','今日总结'];
  const rows=S.records.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(r=>[r.date,r.revenue,r.dine,r.group,r.take,r.note||'']);
  const csv=[head,...rows].map(r=>r.map(csvEscape).join(',')).join('\n');
  download('门店日报-'+todayStr()+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');toast('已导出日报 CSV');
}
function expCk(){
  if(!S.checks.length){toast('还没有盘点记录');return;}
  const head=['盘点日期','盘点人','原料','单位','账面','实盘','差异'];
  const rows=[];
  S.checks.forEach(c=>c.rows.forEach(r=>rows.push([c.date,c.by,r.n,r.unit,r.book,r.real,Math.round((r.real-r.book)*100)/100])));
  const csv=[head,...rows].map(r=>r.map(csvEscape).join(',')).join('\n');
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
  ['daily','stock','check','record','setting'].forEach(v=>{$('view-'+v).hidden=v!==view;});
  document.querySelectorAll('.tabs-in button').forEach(b=>b.classList.toggle('on',b.dataset.view===view));
  if(view==='daily') renderDaily();
  if(view==='stock'){renderStock();renderCustom();}
  if(view==='check') renderCheck();
  if(view==='record') renderRecords();
  if(view==='setting'){ $('setShop').value=S.shopName; }
  location.hash='#/'+view;
}
function renderAll(){
  $('shopName').textContent=S.shopName;
  renderDaily(); renderStock(); renderCustom(); renderCheck(); renderRecords();
}

$('btnSave').onclick=submitDaily;
$('btnStock').onclick=stockApply;
$('btnAddCustom').onclick=addCustom;
$('btnCk').onclick=saveCheck;
$('btnShop').onclick=saveShop;
$('btnExpJson').onclick=expJson;
$('btnExpCsv').onclick=expCsv;
$('btnExpCk').onclick=expCk;
$('btnReset').onclick=resetAll;
$('stCat').onchange=renderStock;
$('ckCat').onchange=renderCheck;
document.querySelectorAll('.tabs-in button').forEach(b=>b.onclick=()=>show(b.dataset.view));

window.addEventListener('hashchange',()=>{const v=(location.hash||'').replace('#/','');if(v&&v!==curView&&['daily','stock','check','record','setting'].includes(v))show(v);});
$('shopName').textContent=S.shopName;
show((location.hash||'#/daily').slice(2)||'daily');
