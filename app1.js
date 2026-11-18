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
    const out=Object.assign({},m,{price:defaultPrice(m.n)});
    if(!o) return out;
    if(o.stock!=null) out.stock=o.stock;
    if(o.price!=null) out.price=o.price;
    return out;
  });
}

const KEY='ysh_local_v2';
function pad2(n){n=String(n);return n.length<2?'0'+n:n;}
function todayStr(){const d=new Date();return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function todayStrOf(d){return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function weekOf(d){const w=['周日','周一','周二','周三','周四','周五','周六'];return w[d.getDay()];}
function weekLabel(dateStr){const d=new Date(dateStr+'T00:00:00');if(isNaN(d.getTime()))return '—';return weekOf(d);}
function seed(){return {shopName:'我的门店', records:[], materials:MATERIALS.map(m=>Object.assign({},m,{price:defaultPrice(m.n)})), custom:[], checks:[], logs:[], cost:{rent:null,property:null,water:null,labor:null,margin:65}, mig:'u3'};}
let S=load();
function saveRaw(o){try{localStorage.setItem(KEY,JSON.stringify(o));}catch(e){}}
function load(){try{const raw=localStorage.getItem(KEY);if(raw){const o=JSON.parse(raw);o.custom=o.custom||[];o.records=o.records||[];o.checks=o.checks||[];o.logs=o.logs||[];
  o.cost=o.cost||{rent:null,property:null,water:null,labor:null,margin:65};
  o.cost.margin=(o.cost.margin==null?65:o.cost.margin);
  const oldUnit={};(o.materials||[]).forEach(m=>{if(m&&m.n)oldUnit[m.n]=m.unit;});
  o.materials=mergeMaterials(o.materials);
  /* 物料单位有过调整：只把单位发生变化的项清回未建账，单位没变的库存与单价照旧保留 */
  if(o.mig!=='u3'){o.materials.forEach(m=>{if(oldUnit[m.n]&&oldUnit[m.n]!==m.unit){m.stock=null;m.price=defaultPrice(m.n);}});o.mig='u3';saveRaw(o);}
  return o;}}catch(e){}return seed();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){toast('存不下，可能浏览器空间满了');}}

const $=id=>document.getElementById(id);
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),1800);}
function money(n){return String(Math.round(n*100)/100);}
let curView='daily';

/* ============ 操作日志 ============ */
function dateOf(ts){const d=new Date(ts);return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function hhmm(ts){const d=new Date(ts);return pad2(d.getHours())+':'+pad2(d.getMinutes());}
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
function dailyWeek(dateStr){const d=new Date(dateStr+'T00:00:00');return isNaN(d.getTime())?'—':weekOf(d);}
function loadDailyForm(){
  const date=$('fDate').value||todayStr();
  $('fWeek').value=dailyWeek(date);
  const rec=S.records.find(r=>r.date===date);
  $('fRev').value=rec?rec.revenue:'';
  $('fWeather').value=rec&&rec.weather!=null?rec.weather:'';
  $('fNote').value=rec?rec.note||'':'';
}
function renderDaily(){
  if(!$('fDate').value)$('fDate').value=todayStr();
  $('fDate').max=todayStr();
  loadDailyForm();
  renderRecent();
}
function renderRecent(){
  const rows=S.records.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,7);
  const box=$('recentList');
  if(!rows.length){box.innerHTML='<div class="mini">还没有记录，今天填第一条</div>';return;}
  box.innerHTML=rows.map(r=>{
    const w=r.weather?(' · 天气 '+r.weather):'';
    return `<div class="item"><div><div class="nm">${r.date} ${weekLabel(r.date)}</div><div class="sub">${w||'—'}</div></div><div class="val">${money(r.revenue)} 元</div></div>`;
  }).join('');
}
function submitDaily(){
  const date=$('fDate').value;
  if(!date){toast('先选营业日期');$('fDate').focus();return;}
  if(date>todayStr()){toast('不能填未来日期');return;}
  const rev=Number($('fRev').value);
  if(!rev||rev<=0){toast('总金额还没填');$('fRev').focus();return;}
  const rec={date:date,revenue:rev,weather:$('fWeather').value.trim(),note:$('fNote').value.trim()};
  S.records=S.records.filter(r=>r.date!==date);
  S.records.push(rec);
  logAdd('daily','总营业额 '+money(rev)+' 元',(rec.weather?('天气 '+rec.weather):'')+(rec.note?(' · 总结 '+rec.note):''));
  save(); toast('已保存 '+date+' 的日报'); loadDailyForm(); renderRecent(); renderRecords(); if(curView==='log')renderLog();
}

/* ============ 运营成本与盈亏平衡 ============ */
function costNum(id){const v=Number($(id).value);return isNaN(v)?0:v;}
function costCalc(){
  const rent=costNum('cRent'), property=costNum('cProperty'), water=costNum('cWater'), labor=costNum('cLabor');
  let margin=costNum('cMargin'); if(!margin||margin<=0||margin>=100) margin=65;
  const fixed=Math.round((rent+property+water+labor)*100)/100;
  const m=margin/100;
  const beMonth=m>0?Math.round(fixed/m*100)/100:0;
  const beDay=Math.round(beMonth/30*100)/100;
  return {rent,property,water,labor,margin,fixed,beMonth,beDay};
}
function renderCost(){
  $('cRent').value=S.cost.rent!=null?S.cost.rent:'';
  $('cProperty').value=S.cost.property!=null?S.cost.property:'';
  $('cWater').value=S.cost.water!=null?S.cost.water:'';
  $('cLabor').value=S.cost.labor!=null?S.cost.labor:'';
  $('cMargin').value=S.cost.margin!=null?S.cost.margin:65;
  drawCost();
}
function drawCost(){
  const c=costCalc();
  $('costResult').innerHTML=
    `<div class="item"><div class="nm">月固定开支合计</div><div class="val">${money(c.fixed)} 元 / 月</div></div>
     <div class="item"><div class="nm">月保本营业额</div><div class="val">${money(c.beMonth)} 元 / 月</div></div>
     <div class="item"><div class="nm">日均盈亏平衡点</div><div class="val" style="color:var(--accent)">${money(c.beDay)} 元 / 天</div></div>`;
}
function submitCost(){
  const rent=costNum('cRent'), property=costNum('cProperty'), water=costNum('cWater'), labor=costNum('cLabor');
  let margin=costNum('cMargin');
  if(!margin||margin<=0||margin>=100){toast('毛利率请填 0~100 之间的数，如 65');$('cMargin').focus();return;}
  S.cost={rent:rent||null,property:property||null,water:water||null,labor:labor||null,margin:margin};
  logAdd('cost','更新月度成本设置','房租 '+money(rent)+' · 物业 '+money(property)+' · 水电 '+money(water)+' · 人工 '+money(labor)+' · 毛利率 '+margin+'%');
  save(); drawCost(); toast('已保存成本设置');
}
