/* 原料清单：82 项（食材 68 · 包装 10 · 其它 4）；单位以总部预警线表为准（斤/包/箱/桶/捆/件/个/套） */
const MATERIALS = [
  {n:'胡辣汤料',unit:'斤',cat:'食材原料',stock:null},
  {n:'干面筋',unit:'包',cat:'食材原料',stock:null},
  {n:'木耳',unit:'包',cat:'食材原料',stock:null},
  {n:'虫草花',unit:'箱',cat:'食材原料',stock:null},
  {n:'白胡椒粉',unit:'斤',cat:'食材原料',stock:null},
  {n:'料油',unit:'桶',cat:'食材原料',stock:null},
  {n:'去皮鲜山药',unit:'斤',cat:'食材原料',stock:null},
  {n:'牛肉',unit:'斤',cat:'食材原料',stock:null},
  {n:'小麦淀粉',unit:'斤',cat:'食材原料',stock:null},
  {n:'玉米淀粉',unit:'斤',cat:'食材原料',stock:null},
  {n:'鸡精',unit:'箱',cat:'食材原料',stock:null},
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
  {n:'干粉条',unit:'包',cat:'食材原料',stock:null},
  {n:'辣椒面',unit:'斤',cat:'食材原料',stock:null},
  {n:'肉包子料',unit:'斤',cat:'食材原料',stock:null},
  {n:'素包子料',unit:'斤',cat:'食材原料',stock:null},
  {n:'肉盒料',unit:'斤',cat:'食材原料',stock:null},
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
  {n:'酵母',unit:'箱',cat:'食材原料',stock:null},
  {n:'泡打粉',unit:'箱',cat:'食材原料',stock:null},
  {n:'大豆混合油',unit:'斤',cat:'食材原料',stock:null},
  {n:'菜籽油',unit:'斤',cat:'食材原料',stock:null},
  {n:'纯正香油',unit:'斤',cat:'食材原料',stock:null},
  {n:'盐',unit:'斤',cat:'食材原料',stock:null},
  {n:'骨汤包',unit:'件',cat:'食材原料',stock:null},
  {n:'胡辣汤碗',unit:'个',cat:'包装物料',stock:null},
  {n:'胡辣汤勺',unit:'个',cat:'包装物料',stock:null},
  {n:'胡辣汤打包碗',unit:'箱',cat:'包装物料',stock:null},
  {n:'胡辣汤打包盖',unit:'箱',cat:'包装物料',stock:null},
  {n:'外卖纸杯',unit:'箱',cat:'包装物料',stock:null},
  {n:'托盘',unit:'个',cat:'包装物料',stock:null},
  {n:'一次性垫筐纸',unit:'包',cat:'包装物料',stock:null},
  {n:'大打包袋',unit:'捆',cat:'包装物料',stock:null},
  {n:'小打包袋',unit:'捆',cat:'包装物料',stock:null},
  {n:'肉盒纸袋',unit:'捆',cat:'包装物料',stock:null},
  {n:'围裙',unit:'个',cat:'其它',stock:null},
  {n:'冬季工装',unit:'套',cat:'其它',stock:null},
  {n:'帽子',unit:'个',cat:'其它',stock:null},
  {n:'夏季工装',unit:'套',cat:'其它',stock:null},
];

/* 参考单价（元/对应单位），门店可改；未列项为未定价，门店自己填 */
const REF_PRICES={
  '胡辣汤料':43,'干面筋':3,'木耳':32,'虫草花':28,'料油':15,'去皮鲜山药':6.8,
  '小麦淀粉':1.9,'基豆':6,'花江豆':6.4,'赤小豆':4,'云豆':7,'高粱米':2.12,'麦仁':1.74,
  '大枣（无核）':8,'江米':3.4,'莲子':28,'花生':5.2,'红曲米':7,'小米':3.8,'南瓜':1.5,
  '青菜':2,'熟白芝麻':10,'豆沫料':35,'豆沫专用粉条':3.3,'小米面':3,'干粉条':3.3,
  '肉包子料':35,'素包子料':35,'牛肉馅':30,'牛油':6,'葱':2,'姜':5,'鸡蛋':3.5,'碱面':1.8,'胡萝卜':1.5,
  '豆腐':2.2,'茄子':3.5,'香菇':6,'青辣椒':5,'包子专用粉条':3.3,'小香葱':5,'糯米粉':2.64,
  '白糖':3.48,'味精':4.1,'纯正香油':18
};
function defaultPrice(n){return (REF_PRICES[n]==null?null:REF_PRICES[n]);}

/* 总部预置预警线（账面 ≤ 该值即提醒补货）；门店本机改过的预警线优先保留。单位须与账面单位一致 */
const LOW_PRESET={
  '胡辣汤料':100,'肉包子料':30,'素包子料':30,'肉盒料':20,'豆沫料':20,'骨汤包':3,
  '料油':3,'干面筋':3,'虫草花':1,'木耳':1,'鸡精':3,'酵母':3,'泡打粉':3,'干粉条':3,'牛肉':20,
  '大打包袋':200,'小打包袋':200,'肉盒纸袋':50,'一次性垫筐纸':80,'胡辣汤打包碗':20,'胡辣汤打包盖':20,
  '外卖纸杯':10,'胡辣汤碗':300,'胡辣汤勺':500,'围裙':20,'冬季工装':10,'夏季工装':10
};
function defaultLow(n){return LOW_PRESET[n]==null?null:LOW_PRESET[n];}

/* 预设成本卡数据见 cards-a.js / cards-b.js，全局变量 PRESET_COST_CARDS */

/* 成本卡旧结构迁移：旧卡 bowls/amount → 新结构 batches/unitCost/rows[].pu/qt/amt */
function normalizeCostCard(c){
  if(!c||typeof c!=='object')return c;
  if(!c.id)c.id='c'+Math.random().toString(36).slice(2,8);
  if(c.unitCost==null){
    const bowls=Number(c.bowls)>0?Number(c.bowls):40;
    c.unit='碗';c.basis='一桶汤 '+bowls+' 碗';c.batches=bowls;
    c.rows=(c.rows||[]).map(function(r){
      const amt=(r.amount!=null)?r.amount:((r.price!=null&&r.qty!=null)?Math.round(r.price*r.qty*1000)/1000:0);
      return {name:r.name,price:r.price,pu:'元/斤',qty:r.qty,qt:(r.qty!=null?r.qty+' 斤':''),amt:amt};
    });
    const total=c.rows.reduce(function(a,r){return a+(r.amt||0);},0);
    c.unitCost=Math.round(total/bowls*1000)/1000;
  }
  c.edited=!!c.edited;
  c.rows=c.rows||[];
  if(c.sale==null)c.sale=null;
  return c;
}

/* 预置成本卡同步：门店未手动改价(edited=false)的卡跟随总部最新配方；改过单价的保留本机；补齐缺失的预置卡 */
function syncPresetCards(o){
  const pres=PRESET_COST_CARDS||[];
  const byId={}; o.costCards.forEach(c=>{if(c&&c.id)byId[c.id]=c;});
  pres.forEach(p=>{
    const m=byId[p.id];
    if(!m){o.costCards.push(JSON.parse(JSON.stringify(p)));}
    else if(!m.edited){byId[p.id]=JSON.parse(JSON.stringify(p));}
  });
  o.costCards=o.costCards.map(c=>byId[c.id]||c);
}

/* 通用占位人员：模板不带任何真实门店人名与历史考勤，各店自行改名、填工资和考勤；占位行可增删 */
const PRESET_STAFF_COUNT=13;
function presetStaff(){
  return Array.from({length:PRESET_STAFF_COUNT},(_,i)=>({
    id:'e'+(i+1), name:'员工'+(i+1), role:'售卖', type:'full', status:'on',
    base:0, hourly:null, attBonus:null, phone:'', start:'', attend:{}, monthAtt:{}
  }));
}

function normalizeStaff(e){
  if(!e||typeof e!=='object')return e;
  if(!e.id)e.id='e'+Math.random().toString(36).slice(2,8);
  e.name=e.name||'';
  const ROLE_MAP={'厨师':'烧汤师傅','帮工':'售卖员','杂工':'收碗','临时工':'售卖员'};
  e.role=ROLE_MAP[e.role]||e.role||'售卖员';
  const ROLE_SKILL={'烧汤师傅':'烧汤','面点师傅':'面点','油炸师傅':'油炸','售卖员':'售卖'};
  if(ROLE_SKILL[e.role])e.role=ROLE_SKILL[e.role];
  e.type=(e.type==='temp'?'temp':'full');
  e.phone=e.phone||'';
  e.start=e.start||'';
  e.leaveDate=e.leaveDate||null;
  e.skills=Array.isArray(e.skills)?e.skills.filter(s=>typeof s==='string'):[];
  e.status=(e.status==='off'?'off':'on');
  e.base=(e.base==null?null:Number(e.base));
  e.hourly=(e.hourly==null?null:Number(e.hourly));
  e.attBonus=(e.attBonus==null?null:Number(e.attBonus));
  e.comm=(e.comm==null?0:Number(e.comm));
  e.attend=(e.attend&&typeof e.attend==='object')?e.attend:{};
  e.monthAtt=(e.monthAtt&&typeof e.monthAtt==='object')?e.monthAtt:{};
  return e;
}

function mergeMaterials(arr){
  const old={}; (arr||[]).forEach(m=>{if(m&&m.n)old[m.n]=m;});
  return MATERIALS.map(m=>{
    const o=old[m.n];
    const out=Object.assign({},m,{price:defaultPrice(m.n),low:defaultLow(m.n)});
    if(!o) return out;
    if(o.stock!=null) out.stock=o.stock;
    if(o.price!=null) out.price=o.price;
    if(o.low!=null) out.low=o.low;
    return out;
  });
}

const KEY='ysh_local_v2';
function pad2(n){n=String(n);return n.length<2?'0'+n:n;}
function todayStr(){const d=new Date();return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function todayStrOf(d){return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function weekOf(d){const w=['周日','周一','周二','周三','周四','周五','周六'];return w[d.getDay()];}
function weekLabel(dateStr){const d=new Date(dateStr+'T00:00:00');if(isNaN(d.getTime()))return '—';return weekOf(d);}
function seed(){
  return {shopName:'我的门店', records:[], materials:MATERIALS.map(m=>Object.assign({},m,{price:defaultPrice(m.n),low:defaultLow(m.n)})), custom:[], checks:[], logs:[], cost:{rent:null,water:null,labor:null,logistics:null,other:null,margin:null}, ackLow:{}, staff:presetStaff(), staffCfg:{poolRate:20}, costCards:JSON.parse(JSON.stringify(PRESET_COST_CARDS)), mig:'u5'};
}
let S=load();
function saveRaw(o){try{localStorage.setItem(KEY,JSON.stringify(o));}catch(e){}}
function load(){try{const raw=localStorage.getItem(KEY);if(raw){const o=JSON.parse(raw);o.custom=o.custom||[];o.records=o.records||[];o.checks=o.checks||[];o.logs=o.logs||[];o.ackLow=o.ackLow||{};o.staff=(Array.isArray(o.staff)?o.staff:[]).map(normalizeStaff);
  o.costCards=Array.isArray(o.costCards)&&o.costCards.length?o.costCards.map(normalizeCostCard):JSON.parse(JSON.stringify(PRESET_COST_CARDS));
  syncPresetCards(o);
  o.cost=o.cost||{rent:null,water:null,labor:null,logistics:null,other:null,margin:null};
  o.cost.margin=(o.cost.margin==null?null:o.cost.margin);
  o.staffCfg=o.staffCfg||{}; if(o.staffCfg.poolRate==null)o.staffCfg.poolRate=20;
  if(o.cost.property!=null){o.cost.rent=(o.cost.rent||0)+o.cost.property;delete o.cost.property;}
  const oldUnit={};(o.materials||[]).forEach(m=>{if(m&&m.n)oldUnit[m.n]=m.unit;});
  o.materials=mergeMaterials(o.materials);
  /* 物料单位有过调整：只把单位发生变化的项清回未建账，单位没变的库存与单价照旧保留 */
  if(o.mig!=='u4'){o.materials.forEach(m=>{if(oldUnit[m.n]&&oldUnit[m.n]!==m.unit){m.stock=null;m.price=defaultPrice(m.n);}});o.mig='u4';saveRaw(o);}
  /* u5：人员字段兼容；已在用的账本保留本机名单，不自动塞人 */
  if(o.mig!=='u5'){
    o.mig='u5';saveRaw(o);
  }
  return o;}}catch(e){}return seed();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){toast('存不下，可能浏览器空间满了');}}

const $=id=>document.getElementById(id);
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),1800);}
function money(n){return String(Math.round(n*100)/100);}
let curView='daily';

/* ============ 操作日志 ============ */
function dateOf(ts){const d=new Date(ts);return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function hhmm(ts){const d=new Date(ts);const h=pad2(d.getHours());const m=pad2(d.getMinutes());return h+':'+m;}
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
/* 预警红线：已建账且填了预警线，账面 ≤ 预警线即偏低；已确认补货的项暂不提醒 */
function isLow(m){return m.stock!=null&&m.low!=null&&!isNaN(Number(m.low))&&m.stock<=Number(m.low);}
function remindLow(key,m){return isLow(m)&&!S.ackLow[key];}
function lowCount(){return itemList().filter(({key,m})=>remindLow(key,m)).length;}

/* 页面上的项数文案跟着清单走，增删物料后不会对不上 */
function syncCopy(){
  const c={}; MATERIALS.forEach(m=>c[m.cat]=(c[m.cat]||0)+1);
  const t=c['食材原料']||0, p=c['包装物料']||0, ot=c['其它']||0, n=MATERIALS.length;
  const note=document.querySelector('#view-stock .note');
  if(note)note.textContent='首次是“未建账”，入库后开始算；已预置总部核算参考单价，入库就自动算出库存金额，门店可以自己改，改过的只存本机。';
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
  const rent=costNum('cRent'), water=costNum('cWater'), logistics=costNum('cLogistics'), other=costNum('cOther');
  const labor=staffFixedTotal(staffMonth);
  const om=overallMargin();
  const margin=om.rate;
  const fixed=Math.round((rent+water+labor+logistics+other)*100)/100;
  const m=margin!=null?margin/100:0;
  const beMonth=(m>0)?Math.round(fixed/m*100)/100:0;
  const beDay=Math.round(beMonth/30*100)/100;
  return {rent,water,labor,logistics,other,margin,fixed,beMonth,beDay};
}
function renderCost(){
  $('cRent').value=S.cost.rent!=null?S.cost.rent:'';
  $('cWater').value=S.cost.water!=null?S.cost.water:'';
  $('cLabor').value=staffFixedTotal(staffMonth);
  $('cLogistics').value=S.cost.logistics!=null?S.cost.logistics:'';
  $('cOther').value=S.cost.other!=null?S.cost.other:'';
  drawCost();
}
function drawCost(){
  const c=costCalc();
  const rateTxt=c.margin==null?'<span class="mini">待成本卡定价</span>':c.margin+'%';
  const hasBe=c.margin!=null&&c.margin>0;
  const beTxt=hasBe?money(c.beMonth)+' 元 / 月':'<span class="mini">—</span>';
  const beDayTxt=hasBe?money(c.beDay)+' 元 / 天':'<span class="mini">—</span>';
  $('costResult').innerHTML=
    `<div class="item"><div class="nm">月固定开支合计</div><div class="val">${money(c.fixed)} 元 / 月</div></div>
     <div class="item"><div class="nm">综合毛利率</div><div class="val">${rateTxt}</div></div>
     <div class="item"><div class="nm">月保本营业额</div><div class="val">${beTxt}</div></div>
     <div class="item"><div class="nm">日均盈亏平衡点</div><div class="val" style="color:var(--accent)">${beDayTxt}</div></div>`;
}
function submitCost(){
  const rent=costNum('cRent'), water=costNum('cWater'), logistics=costNum('cLogistics'), other=costNum('cOther');
  const labor=staffFixedTotal(staffMonth);
  const om=overallMargin();
  S.cost={rent:rent||null,water:water||null,labor:labor||null,logistics:logistics||null,other:other||null,margin:om.rate};
  logAdd('cost','更新月度成本设置','房租（含物业） '+money(rent)+' · 水电 '+money(water)+' · 人工（人员固定工资） '+money(labor)+' · 物流 '+money(logistics)+' · 其它 '+money(other)+' · 综合毛利率 '+(om.rate==null?'待定价':om.rate+'%'));
  save(); drawCost(); toast('已保存成本设置');
}
