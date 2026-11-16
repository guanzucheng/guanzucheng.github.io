/* 原料清单：76 项（食材 65 · 包装 8 · 其它 3）；食材统一按「斤」，包装按个/条/包/掴，工装按件/顶 */
const MATERIALS = [
  {n:'胡辣汤料',unit:'斤',cat:'食材原料',stock:null},
  {n:'面筋',unit:'斤',cat:'食材原料',stock:null},
  {n:'木耳',unit:'斤',cat:'食材原料',stock:null},
  {n:'虫草花',unit:'斤',cat:'食材原料',stock:null},
  {n:'白胡椒粉',unit:'斤',cat:'食材原料',stock:null},
  {n:'秘制料油',unit:'斤',cat:'食材原料',stock:null},
  {n:'去皮鲜山药',unit:'斤',cat:'食材原料',stock:null},
  {n:'鲜牛肉',unit:'斤',cat:'食材原料',stock:null},
  {n:'小麦淀粉',unit:'斤',cat:'食材原料',stock:null},
  {n:'玉米淀粉',unit:'斤',cat:'食材原料',stock:null},
  {n:'太太乐鸡精',unit:'斤',cat:'食材原料',stock:null},
  {n:'基豆',unit:'斤',cat:'食材原料',stock:null},
  {n:'花江豆',unit:'斤',cat:'食材原料',stock:null},
  {n:'赤小豆',unit:'斤',cat:'食材原料',stock:null},
  {n:'云豆',unit:'斤',cat:'食材原料',stock:null},
  {n:'高粱米',unit:'斤',cat:'食材原料',stock:null},
  {n:'麦仁',unit:'斤',cat:'食材原料',stock:null},
  {n:'大枣（无核）',unit:'斤',cat:'食材原料',stock:null},
  {n:'江米',unit:'斤',cat:'食材原料',stock:null},
  {n:'莲子',unit:'斤',cat:'食材原料',stock:null},
  {n:'花生',unit:'斤',cat:'食材原料',stock:null},
  {n:'红曲米',unit:'斤',cat:'食材原料',stock:null},
  {n:'小米',unit:'斤',cat:'食材原料',stock:null},
  {n:'南瓜',unit:'斤',cat:'食材原料',stock:null},
  {n:'黄豆',unit:'斤',cat:'食材原料',stock:null},
  {n:'消泡剂',unit:'斤',cat:'食材原料',stock:null},
  {n:'豆腐王',unit:'斤',cat:'食材原料',stock:null},
  {n:'青菜',unit:'斤',cat:'食材原料',stock:null},
  {n:'自己炸豆腐皮',unit:'斤',cat:'食材原料',stock:null},
  {n:'熟白芝麻',unit:'斤',cat:'食材原料',stock:null},
  {n:'豆沫料',unit:'斤',cat:'食材原料',stock:null},
  {n:'豆沫专用粉条',unit:'斤',cat:'食材原料',stock:null},
  {n:'小米面',unit:'斤',cat:'食材原料',stock:null},
  {n:'粉条',unit:'斤',cat:'食材原料',stock:null},
  {n:'辣椒面',unit:'斤',cat:'食材原料',stock:null},
  {n:'包子料',unit:'斤',cat:'食材原料',stock:null},
  {n:'雪菜',unit:'斤',cat:'食材原料',stock:null},
  {n:'大蒜',unit:'斤',cat:'食材原料',stock:null},
  {n:'牛肉馅',unit:'斤',cat:'食材原料',stock:null},
  {n:'牛油',unit:'斤',cat:'食材原料',stock:null},
  {n:'羊油',unit:'斤',cat:'食材原料',stock:null},
  {n:'葱',unit:'斤',cat:'食材原料',stock:null},
  {n:'姜',unit:'斤',cat:'食材原料',stock:null},
  {n:'老抽',unit:'斤',cat:'食材原料',stock:null},
  {n:'鸡蛋',unit:'斤',cat:'食材原料',stock:null},
  {n:'碱面',unit:'斤',cat:'食材原料',stock:null},
  {n:'胡萝卜',unit:'斤',cat:'食材原料',stock:null},
  {n:'豆腐',unit:'斤',cat:'食材原料',stock:null},
  {n:'茄子',unit:'斤',cat:'食材原料',stock:null},
  {n:'香菇',unit:'斤',cat:'食材原料',stock:null},
  {n:'青辣椒',unit:'斤',cat:'食材原料',stock:null},
  {n:'包子面',unit:'斤',cat:'食材原料',stock:null},
  {n:'包子专用粉条',unit:'斤',cat:'食材原料',stock:null},
  {n:'麻辣鲜',unit:'斤',cat:'食材原料',stock:null},
  {n:'油条面',unit:'斤',cat:'食材原料',stock:null},
  {n:'小香葱',unit:'斤',cat:'食材原料',stock:null},
  {n:'糯米粉',unit:'斤',cat:'食材原料',stock:null},
  {n:'白糖',unit:'斤',cat:'食材原料',stock:null},
  {n:'味精',unit:'斤',cat:'食材原料',stock:null},
  {n:'酵母（梅山牌）',unit:'斤',cat:'食材原料',stock:null},
  {n:'无铝泡打粉（梅山牌）',unit:'斤',cat:'食材原料',stock:null},
  {n:'大豆混合油',unit:'斤',cat:'食材原料',stock:null},
  {n:'菜籽油',unit:'斤',cat:'食材原料',stock:null},
  {n:'纯正香油',unit:'斤',cat:'食材原料',stock:null},
  {n:'盐',unit:'斤',cat:'食材原料',stock:null},
  {n:'胡辣汤碗',unit:'个',cat:'包装物料',stock:null},
  {n:'胡辣汤勺',unit:'个',cat:'包装物料',stock:null},
  {n:'胡辣汤打包纸碗',unit:'个',cat:'包装物料',stock:null},
  {n:'外卖纸杯',unit:'条',cat:'包装物料',stock:null},
  {n:'托盘',unit:'个',cat:'包装物料',stock:null},
  {n:'一次性垫筐纸',unit:'包',cat:'包装物料',stock:null},
  {n:'大打包袋',unit:'捆',cat:'包装物料',stock:null},
  {n:'小打包袋',unit:'捆',cat:'包装物料',stock:null},
  {n:'围裙',unit:'件',cat:'其它',stock:null},
  {n:'冬季工装',unit:'件',cat:'其它',stock:null},
  {n:'帽子',unit:'顶',cat:'其它',stock:null},
];

/* 参考单价（元/对应单位），门店可改；未列项为未定价，门店自己填 */
const REF_PRICES={
  '胡辣汤料':43,'面筋':3,'木耳':32,'虫草花':28,'秘制料油':15,'去皮鲜山药':6.8,
  '小麦淀粉':1.9,'基豆':6,'花江豆':6.4,'赤小豆':4,'云豆':7,'高粱米':2.12,'麦仁':1.74,
  '大枣（无核）':8,'江米':3.4,'莲子':28,'花生':5.2,'红曲米':7,'小米':3.8,'南瓜':1.5,
  '青菜':2,'熟白芝麻':10,'豆沫料':35,'豆沫专用粉条':3.3,'小米面':3,'粉条':3.3,
  '包子料':35,'牛肉馅':30,'牛油':6,'葱':2,'姜':5,'鸡蛋':3.5,'碱面':1.8,'胡萝卜':1.5,
  '豆腐':2.2,'茄子':3.5,'香菇':6,'青辣椒':5,'包子专用粉条':3.3,'小香葱':5,'糯米粉':2.64,
  '白糖':3.48,'味精':4.1,'纯正香油':18
};
function defaultPrice(n){return (REF_PRICES[n]==null?null:REF_PRICES[n]);}

function mergeMaterials(arr){
  const old={}; (arr||[]).forEach(m=>{if(m&&m.n)old[m.n]=m;});
  return MATERIALS.map(m=>{
    const o=old[m.n];
    const out={...m,price:defaultPrice(m.n)};
    if(!o) return out;
    if(o.stock!=null) out.stock=o.stock;
    if(o.price!=null) out.price=o.price;
    return out;
  });
}

const KEY='ysh_local_v2';
function todayStr(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function seed(){return {shopName:'我的门店', records:[], materials:MATERIALS.map(m=>({...m,price:defaultPrice(m.n)})), custom:[], checks:[], logs:[], mig:'u3'};}
let S=load();
function saveRaw(o){try{localStorage.setItem(KEY,JSON.stringify(o));}catch(e){}}
function load(){try{const raw=localStorage.getItem(KEY);if(raw){const o=JSON.parse(raw);o.custom=o.custom||[];o.records=o.records||[];o.checks=o.checks||[];o.logs=o.logs||[];
  const oldUnit={};(o.materials||[]).forEach(m=>{if(m&&m.n)oldUnit[m.n]=m.unit;});
  o.materials=mergeMaterials(o.materials);
  /* 物料单位有过调整：只把单位发生变化的项清回未建账，单位没变的库存与单价照旧保留 */
  if(o.mig!=='u3'){o.materials.forEach(m=>{if(oldUnit[m.n]&&oldUnit[m.n]!==m.unit){m.stock=null;m.price=defaultPrice(m.n);}});o.mig='u3';saveRaw(o);}
  return o;}}catch(e){}return seed();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){toast('存不下，可能浏览器空间满了');}}

const $=id=>document.getElementById(id);
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),1800);}
function money(n){return (Math.round(n*100)/100).toLocaleString('zh-CN',{maximumFractionDigits:2});}
let curView='daily';

/* ============ 操作日志 ============ */
function dateOf(ts){const d=new Date(ts);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function hhmm(ts){const d=new Date(ts);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
function logAdd(type,label,detail){
  S.logs.push({at:Date.now(),type,label,detail:detail||''});
  if(S.logs.length>800)S.logs=S.logs.slice(-800);
}

/* ============ 物料与金额 ============ */
function itemList(){
  const out=[];
  S.materials.forEach((m,i)=>out.push({key:'M'+i,m}));
  S.custom.forEach((c,i)=>out.push({key:'C'+i,m:c}));
  return out;
}
function findItem(key){return key[0]==='M'?S.materials[Number(key.slice(1))]:S.custom[Number(key.slice(1))];}
function amtOf(m){return (m.price!=null&&m.stock!=null)?Math.round(m.stock*m.price*100)/100:null;}
function stockTotal(){
  let sum=0, filled=0;
  itemList().forEach(({m})=>{const a=amtOf(m); if(a!=null){sum+=a;filled++;}});
  return {sum:Math.round(sum*100)/100, filled};
}

/* 页面上的项数文案跟着清单走，增删物料后不会对不上 */
function syncCopy(){
  const c={}; MATERIALS.forEach(m=>c[m.cat]=(c[m.cat]||0)+1);
  const t=c['食材原料']||0, p=c['包装物料']||0, ot=c['其它']||0, n=MATERIALS.length;
  const note=document.querySelector('#view-stock .note');
  if(note)note.textContent='预置总部报货表全部 '+n+' 项原料（食材 '+t+' · 包装 '+p+' · 其它 '+ot+'，食材统一按斤），首次是“未建账”，入库后开始算；已预置总部核算参考单价，入库就自动算出库存金额，门店可以自己改，改过的只存本机。';
  const sel=$('ckCat');
  if(sel&&sel.options.length>=5){
    sel.options[0].text='食材原料（'+t+' 项）';
    sel.options[1].text='包装物料（'+p+' 项）';
    sel.options[2].text='其它（'+ot+' 项）';
    sel.options[4].text='全部（'+n+' 项 + 自购）';
  }
}

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
  S.records.push(rec);
  logAdd('daily','总营业额 '+money(rev)+' 元','堂食 '+(rec.dine!=null?money(rec.dine):'—')+' · 团购 '+(rec.group!=null?rec.group+' 单':'—')+' · 外卖 '+(rec.take!=null?rec.take+' 单':'—'));
  save(); toast('已保存今天的日报'); renderRecent(); renderRecords(); if(curView==='log')renderLog();
}

/* ============ 库存 ============ */
/* 剩余库存总金额固定放在库存账卡片最下方 */
function sumEl(){
  let el=$('stVal');
  if(!el){el=document.createElement('div');el.id='stVal';}
  const card=$('stockList')?$('stockList').closest('.card'):null;
  if(card&&card.lastElementChild!==el)card.appendChild(el);
  el.style.marginTop='12px';
  el.style.paddingTop='10px';
  el.style.borderTop='1px solid var(--line)';
  return el;
}
function renderStock(){
  const cat=($('stCat')&&$('stCat').value)||'全部';
  const q=(($('stQ')&&$('stQ').value)||'').trim();
  const list=itemList().filter(({m})=>(cat==='全部'||(m.cat||'门店自购')===cat)&&(!q||m.n.indexOf(q)>=0));
  const box=$('stockList');
  if(!list.length){box.innerHTML='<div class="mini">没有匹配的原料</div>';}
  else box.innerHTML=list.map(({key,m})=>{
    const unit=m.unit||'';
    const stockTxt=m.stock==null?'—':(m.stock+' '+unit);
    const a=amtOf(m);
    const amtTxt=a==null?'金额 —':('金额 '+money(a)+' 元');
    const tag=m.stock==null?'未建账':'已建账';
    return `<div class="item">
      <div style="flex:1;min-width:0">
        <div class="nm">${m.n}</div>
        <div class="sub">${m.cat||'门店自购'} · ${tag}</div>
        <div class="sub" style="margin-top:3px;color:var(--ink-2);font-variant-numeric:tabular-nums">${amtTxt}</div>
      </div>
      <div style="text-align:right;min-width:122px">
        <div style="display:inline-block;min-width:74px;padding:5px 10px;border:1px solid var(--line);border-radius:8px;background:#fff;font-weight:600;font-variant-numeric:tabular-nums;text-align:center">${stockTxt}</div>
        <div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:6px;font-size:12px;color:var(--ink-3)">
          <span>单价</span>
          <input type="number" class="prIn" data-key="${key}" value="${m.price==null?'':m.price}" placeholder="填" inputmode="decimal" style="width:52px;padding:4px 6px;font-size:12px;text-align:center">
          <span>元/${unit}</span>
        </div>
      </div>
    </div>`;
  }).join('');
  box.querySelectorAll('.prIn').forEach(inp=>{
    inp.onchange=()=>{
      const m=findItem(inp.dataset.key); if(!m)return;
      const val=inp.value===''?null:Number(inp.value);
      m.price=(val==null||isNaN(val))?null:val;
      save(); renderStock();
    };
  });
  const all=itemList();
  $('sItem').innerHTML=all.map(({key,m})=>`<option value="${key}">${m.n}（${m.unit||''}）</option>`).join('');
  renderStockTotal();
}
function renderStockTotal(){
  const el=sumEl(); if(!el)return;
  const t=stockTotal();
  const total=itemList().length;
  const main=t.filled?('剩余库存总金额 <b style="color:var(--accent);font-size:19px;font-weight:700">'+money(t.sum)+' 元</b>'):('剩余库存总金额 <b style="color:var(--ink-3);font-size:17px">待入库</b>');
  el.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap"><span>${main}</span></div><div class="mini" style="margin-top:5px">已填单价 ${t.filled} / ${total} 项 · 单价可按当地进价随时改，改完金额自动重算</div>`;
}
function stockApply(){
  const key=$('sItem').value, q=Number($('sQty').value);
  if(!key){toast('先选原料');return;}
  if(!q||q<=0){toast('数量不对');return;}
  const m=findItem(key); if(!m){toast('原料没找到');return;}
  const cur=m.stock==null?0:m.stock;
  const isIn=$('sType').value==='in';
  if(!isIn&&cur-q<0){toast('库存不够，不能出这么多');return;}
  m.stock=Math.round((isIn?cur+q:cur-q)*100)/100;
  const a=amtOf(m);
  logAdd(isIn?'in':'out',q+' '+(m.unit||'')+' '+m.n,'账面 '+m.stock+' '+(m.unit||'')+(a!=null?(' · 金额 '+money(a)+' 元'):''));
  save(); $('sQty').value=''; if($('stQ').value)$('stQ').value='';
  renderStock(); if(curView==='log')renderLog();
  toast(isIn?'已入库':'已领用');
}

/* ============ 自购项 ============ */
function renderCustom(){
  const box=$('customList'); if(!box)return;
  if(!S.custom.length){box.innerHTML='<div class="mini">还没有自购项</div>';return;}
  box.innerHTML=S.custom.map((c,i)=>`<div class="item"><div><div class="nm">${c.n}</div>
    <div class="sub">${c.unit||''} · 账面 ${c.stock==null?'未建账':c.stock}</div></div>
    <button class="btn plain" data-del="${i}" type="button">删除</button></div>`).join('');
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{
    const gone=S.custom[Number(b.dataset.del)];
    S.custom.splice(Number(b.dataset.del),1);
    logAdd('custom','删除 '+(gone?gone.n:'—'),'');
    save(); renderCustom(); renderStock(); toast('已删除');
  });
}
function addCustom(){
  const n=$('cmName').value.trim();
  if(!n){toast('先填名称');return;}
  if(S.materials.find(m=>m.n===n)||S.custom.find(c=>c.n===n)){toast('这个已经有了');return;}
  const unit=$('cmUnit').value.trim()||'斤';
  const qty=$('cmQty').value===''?null:Number($('cmQty').value);
  S.custom.push({n,unit,stock:qty,cat:'门店自购'});
  logAdd('custom','新增 '+n,'单位 '+unit+' · 期初 '+(qty==null?'未建账':qty));
  save(); $('cmName').value='';$('cmUnit').value='';$('cmQty').value='';
  renderCustom(); renderStock(); toast('已加入清单');
}

/* ============ 单价导入导出 ============ */
function importPrices(){
  const raw=$('prText').value;
  if(!raw.trim()){toast('先把单价清单粘进来');return;}
  const all=itemList();
  let ok=0, miss=[];
  raw.split('\n').forEach(line=>{
    const parts=line.split(/[,，;；\u3000 ]+/).filter(x=>x.length);
    if(parts.length<2)return;
    const name=parts[0].trim();
    const num=Number(parts[parts.length-1]);
    if(!name||isNaN(num))return;
    let hit=all.find(({m})=>m.n===name);
    if(!hit&&name.length>=2)hit=all.find(({m})=>m.n.indexOf(name)>=0);
    if(!hit){miss.push(name);return;}
    hit.m.price=num; ok++;
  });
  save(); renderStock();
  if($('prMsg'))$('prMsg').textContent='已写入 '+ok+' 项单价'+(miss.length?'；没匹配到 '+miss.length+' 项：'+miss.join('、'):'');
  toast('单价已更新 '+ok+' 项');
}
function expPrices(){
  const rows=itemList().filter(({m})=>m.price!=null).map(({m})=>[m.n,m.unit||'',m.price]);
  if(!rows.length){toast('还没填单价');return;}
  const head=['原料','单位','单价'];
  const csv=[head,...rows].map(r=>r.map(csvEscape).join(',')).join('\n');
  download('门店单价清单-'+todayStr()+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');
  toast('已导出单价清单');
}
function expStock(){
  const head=['原料','品类','单位','账面','单价','金额'];
  const rows=itemList().map(({m})=>{const a=amtOf(m);return [m.n,m.cat||'门店自购',m.unit||'',m.stock==null?'':m.stock,m.price==null?'':m.price,a==null?'':a];});
  rows.push(['合计','','','','',stockTotal().sum]);
  const csv=[head,...rows].map(r=>r.map(csvEscape).join(',')).join('\n');
  download('门店库存金额-'+todayStr()+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');
  toast('已导出库存金额 CSV');
}

/* ============ 盘点 ============ */
let ckRows=[];
function renderCheck(){
  const d=new Date();
  $('ckDate').value=todayStr();
  $('ckTitle').textContent=`${d.getFullYear()} 年 ${d.getMonth()+1} 月盘点`;
  const cat=($('ckCat')&&$('ckCat').value)||'食材原料';
  ckRows=itemList().filter(({m})=>cat==='全部'||(m.cat||'门店自购')===cat)
    .map(({key,m})=>({key,n:m.n,unit:m.unit||'',book:m.stock==null?null:m.stock,price:m.price==null?null:m.price,real:''}));
  const body=$('ckBody');
  body.innerHTML=ckRows.map((r,i)=>`<tr><td>${r.n}</td><td>${r.book==null?'未建账':r.book+' '+r.unit}</td>
    <td><input type="number" data-i="${i}" class="ckIn" placeholder="实盘" style="padding:5px 8px"></td>
    <td class="ckDiff" data-i="${i}">—</td><td class="ckAmt" data-i="${i}">—</td></tr>`).join('');
  body.querySelectorAll('.ckIn').forEach(inp=>{
    inp.oninput=()=>{
      const i=Number(inp.dataset.i), v=inp.value===''?null:Number(inp.value);
      ckRows[i].real=v;
      const cell=body.querySelector(`.ckDiff[data-i="${i}"]`);
      const amtCell=body.querySelector(`.ckAmt[data-i="${i}"]`);
      if(v==null){cell.textContent='—';cell.style.color='';if(amtCell)amtCell.textContent='—';}
      else{
        const d2=Math.round((v-(ckRows[i].book==null?0:ckRows[i].book))*100)/100;
        cell.textContent=(d2>0?'+':'')+d2+' '+ckRows[i].unit;
        cell.style.color=d2===0?'':'var(--warn)';
        if(amtCell){
          const p=ckRows[i].price;
          if(p==null){amtCell.textContent='—';}
          else{const m2=Math.round(d2*p*100)/100;amtCell.textContent=(m2>0?'+':'')+money(m2)+' 元';amtCell.style.color=m2===0?'':'var(--warn)';}
        }
      }
      updateCkTotal();
    };
  });
  updateCkTotal(); renderCkHistory();
}
function updateCkTotal(){
  const filled=ckRows.filter(r=>r.real!=null&&r.real!=='');
  if(!filled.length){$('ckDiff').textContent='已填 0 / '+ckRows.length+' 项';return;}
  let sum=0, amt=0, amtN=0;
  filled.forEach(r=>{
    const d2=(r.real==null?0:r.real)-(r.book==null?0:r.book);
    sum+=Math.abs(d2);
    if(r.price!=null){amt+=Math.abs(d2*r.price);amtN++;}
  });
  $('ckDiff').textContent=`已填 ${filled.length} / ${ckRows.length} 项 · 差异量合计 ${Math.round(sum*100)/100}`+(amtN?(' · 差异金额约 '+money(Math.round(amt*100)/100)+' 元'):'');
}
function saveCheck(){
  const filled=ckRows.filter(r=>r.real!=null&&r.real!=='');
  if(!filled.length){toast('还没填实盘数');return;}
  S.checks.push({date:todayStr(),rows:filled.map(r=>({n:r.n,unit:r.unit,book:r.book==null?0:r.book,real:r.real,price:r.price==null?null:r.price}))});
  const diff=filled.reduce((a,r)=>a+Math.abs((r.real==null?0:r.real)-(r.book==null?0:r.book)),0);
  logAdd('check',filled.length+' 项已盘','差异合计 '+Math.round(diff*100)/100);
  save(); renderCkHistory(); toast('盘点已保存');
}
function renderCkHistory(){
  const box=$('ckHistory');
  if(!S.checks.length){box.innerHTML='<div class="mini">还没有盘点记录</div>';return;}
  box.innerHTML=S.checks.slice().reverse().map(c=>{
    const diff=c.rows.reduce((a,r)=>a+Math.abs(r.real-r.book),0);
    let amt=0; c.rows.forEach(r=>{if(r.price!=null)amt+=Math.abs((r.real-r.book)*r.price);});
    return `<div class="item"><div><div class="nm">${c.date}</div><div class="sub">${c.rows.length} 项</div></div><div class="val" style="text-align:right">差异量 ${Math.round(diff*100)/100}<div class="sub" style="font-weight:400">${amt>0?('金额约 '+money(Math.round(amt*100)/100)+' 元'):'金额 —'}</div></div></div>`;
  }).join('');
}

/* ============ 日志 ============ */
const LOG_TAG={in:['入库','tag ok'],out:['领用','tag'],check:['盘点','tag gray'],custom:['自购','tag gray'],daily:['日报','tag gray']};
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
function csvEscape(v){
  const s=v==null?'':String(v);
  const need=s.indexOf('"')>=0||s.indexOf(',')>=0||s.indexOf('\n')>=0;
  return need?'"'+s.split('"').join('""')+'"':s;
}
function expJson(){download('门店数据备份-'+todayStr()+'.json',JSON.stringify(S,null,2),'application/json');toast('已导出 JSON');}
function expCsv(){
  const head=['日期','总营业额','堂食(元)','团购(单)','外卖(单)','今日总结'];
  const rows=S.records.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(r=>[r.date,r.revenue,r.dine,r.group,r.take,r.note||'']);
  const csv=[head,...rows].map(r=>r.map(csvEscape).join(',')).join('\n');
  download('门店日报-'+todayStr()+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');toast('已导出日报 CSV');
}
function expCk(){
  if(!S.checks.length){toast('还没有盘点记录');return;}
  const head=['盘点日期','原料','单位','账面','实盘','差异','差异金额'];
  const rows=[];
  S.checks.forEach(c=>c.rows.forEach(r=>{
    const d2=Math.round((r.real-r.book)*100)/100;
    const a=(r.price==null)?'':Math.round(d2*r.price*100)/100;
    rows.push([c.date,r.n,r.unit,r.book,r.real,d2,a]);
  }));
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
  ['daily','stock','check','record','log','setting'].forEach(v=>{$('view-'+v).hidden=v!==view;});
  document.querySelectorAll('.tabs-in button').forEach(b=>b.classList.toggle('on',b.dataset.view===view));
  if(view==='daily') renderDaily();
  if(view==='stock'){renderStock();renderCustom();}
  if(view==='check') renderCheck();
  if(view==='record') renderRecords();
  if(view==='log') renderLog();
  if(view==='setting'){ $('setShop').value=S.shopName; }
  location.hash='#/'+view;
}
function renderAll(){
  $('shopName').textContent=S.shopName;
  renderDaily(); renderStock(); renderCustom(); renderCheck(); renderRecords(); renderLog();
}

$('btnSave').onclick=submitDaily;
$('btnStock').onclick=stockApply;
$('btnAddCustom').onclick=addCustom;
$('btnCk').onclick=saveCheck;
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
$('lgType').onchange=renderLog;
$('btnLogClr').onclick=clearLogs;
document.querySelectorAll('.tabs-in button').forEach(b=>b.onclick=()=>show(b.dataset.view));

syncCopy();
window.addEventListener('hashchange',()=>{const v=(location.hash||'').replace('#/','');if(v&&v!==curView&&['daily','stock','check','record','log','setting'].includes(v))show(v);});
$('shopName').textContent=S.shopName;
show((location.hash||'#/daily').slice(2)||'daily');
