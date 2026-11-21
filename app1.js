/* ============ 基础数据与状态 ============ */
const MATERIALS=[
  {n:'胡辣汤料',unit:'斤',cat:'食材原料',low:5},
  {n:'面筋',unit:'斤',cat:'食材原料',low:3},
  {n:'木耳',unit:'斤',cat:'食材原料',low:15},
  {n:'黄花菜',unit:'斤',cat:'食材原料',low:2},
  {n:'粉条',unit:'斤',cat:'食材原料',low:3},
  {n:'牛肉',unit:'斤',cat:'食材原料',low:4},
  {n:'羊肉',unit:'斤',cat:'食材原料',low:3},
  {n:'豆腐',unit:'斤',cat:'食材原料',low:3},
  {n:'粉条段',unit:'斤',cat:'食材原料',low:2},
  {n:'花生',unit:'斤',cat:'食材原料',low:2},
  {n:'芝麻',unit:'斤',cat:'食材原料',low:1},
  {n:'香油',unit:'斤',cat:'食材原料',low:1},
  {n:'辣椒油',unit:'斤',cat:'食材原料',low:1},
  {n:'食盐',unit:'斤',cat:'调料',low:2},
  {n:'味精',unit:'斤',cat:'调料',low:1},
  {n:'鸡精',unit:'斤',cat:'调料',low:1},
  {n:'胡椒粉',unit:'斤',cat:'调料',low:1},
  {n:'十三香',unit:'斤',cat:'调料',low:1},
  {n:'酱油',unit:'斤',cat:'调料',low:1},
  {n:'醋',unit:'斤',cat:'调料',low:1},
  {n:'生姜',unit:'斤',cat:'食材原料',low:2},
  {n:'大葱',unit:'斤',cat:'食材原料',low:3},
  {n:'大蒜',unit:'斤',cat:'食材原料',low:2},
  {n:'香菜',unit:'斤',cat:'食材原料',low:2},
  {n:'菠菜',unit:'斤',cat:'食材原料',low:2},
  {n:'白菜',unit:'斤',cat:'食材原料',low:3},
  {n:'冬瓜',unit:'斤',cat:'食材原料',low:2},
  {n:'土豆',unit:'斤',cat:'食材原料',low:3},
  {n:'胡萝卜',unit:'斤',cat:'食材原料',low:2},
  {n:'鸡蛋',unit:'斤',cat:'食材原料',low:4},
  {n:'面粉',unit:'斤',cat:'食材原料',low:5},
  {n:'淀粉',unit:'斤',cat:'食材原料',low:2},
  {n:'食用油',unit:'斤',cat:'食材原料',low:4},
  {n:'白糖',unit:'斤',cat:'调料',low:1},
  {n:'料酒',unit:'斤',cat:'调料',low:1},
  {n:'豆瓣酱',unit:'斤',cat:'调料',low:1},
  {n:'花椒',unit:'斤',cat:'调料',low:1},
  {n:'八角',unit:'斤',cat:'调料',low:1},
  {n:'桂皮',unit:'斤',cat:'调料',low:1},
  {n:'香叶',unit:'斤',cat:'调料',low:1},
  {n:'干辣椒',unit:'斤',cat:'调料',low:1},
  {n:'花椒面',unit:'斤',cat:'调料',low:1},
  {n:'辣椒面',unit:'斤',cat:'调料',low:1},
  {n:'孜然',unit:'斤',cat:'调料',low:1},
  {n:'芝麻香油',unit:'斤',cat:'调料',low:1},
  {n:'芝麻酱',unit:'斤',cat:'调料',low:1},
  {n:'花生酱',unit:'斤',cat:'调料',low:1},
  {n:'咸菜',unit:'斤',cat:'食材原料',low:2},
  {n:'萝卜干',unit:'斤',cat:'食材原料',low:2},
  {n:'豆角',unit:'斤',cat:'食材原料',low:2},
  {n:'茄子',unit:'斤',cat:'食材原料',low:2},
  {n:'青椒',unit:'斤',cat:'食材原料',low:2},
  {n:'洋葱',unit:'斤',cat:'食材原料',low:2},
  {n:'豆芽',unit:'斤',cat:'食材原料',low:2},
  {n:'海带',unit:'斤',cat:'食材原料',low:1},
  {n:'紫菜',unit:'斤',cat:'食材原料',low:1},
  {n:'虾皮',unit:'斤',cat:'食材原料',low:1},
  {n:'虾仁',unit:'斤',cat:'食材原料',low:1},
  {n:'鱿鱼',unit:'斤',cat:'食材原料',low:1},
  {n:'带鱼',unit:'斤',cat:'食材原料',low:1},
  {n:'鲫鱼',unit:'斤',cat:'食材原料',low:1},
  {n:'鲤鱼',unit:'斤',cat:'食材原料',low:1},
  {n:'鲢鱼',unit:'斤',cat:'食材原料',low:1},
  {n:'丸子',unit:'斤',cat:'食材原料',low:2},
  {n:'香肠',unit:'斤',cat:'食材原料',low:2},
  {n:'油条',unit:'根',cat:'食材原料',low:10},
  {n:'包子',unit:'个',cat:'食材原料',low:10},
  {n:'馒头',unit:'个',cat:'食材原料',low:10},
  {n:'花卷',unit:'个',cat:'食材原料',low:10},
  {n:'饼丝',unit:'斤',cat:'食材原料',low:2},
  {n:'烧饼',unit:'个',cat:'食材原料',low:10},
  {n:'豆浆',unit:'杯',cat:'食材原料',low:10},
  {n:'牛奶',unit:'盒',cat:'食材原料',low:10},
  {n:'一次性碗',unit:'个',cat:'包材',low:20},
  {n:'一次性筷',unit:'双',cat:'包材',low:20},
  {n:'塑料袋',unit:'个',cat:'包材',low:20},
  {n:'餐巾纸',unit:'包',cat:'包材',low:5}
];
const STORE_KEY='ysh_ledger_v3';
let S=seed();
let curView='daily';
let selItemKey='';
function seed(){return {shopName:'我的门店', records:[], materials:MATERIALS.map(m=>Object.assign({},m,{price:defaultPrice(m.n)})), custom:[], checks:[], logs:[], cost:{rent:null,water:null,labor:null,logistics:null,other:null,margin:65}, ackLow:{}, mig:'u3'};}
function defaultPrice(n){
  const map={'牛肉':38,'羊肉':42,'鸡蛋':6,'食用油':8,'面粉':2.5,'粉条':4,'面筋':5,'木耳':60,'黄花菜':30,'胡辣汤料':12};
  return map[n]!=null?map[n]:null;
}
function $(id){return document.getElementById(id);}
function todayStr(){const d=new Date();return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function todayStrOf(d){return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function pad2(n){return String(n).padStart(2,'0');}
function money(n){return (Math.round(Number(n||0)*100)/100).toFixed(2);}
function dateOf(at){const d=new Date(at);return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function hhmm(at){const d=new Date(at);return pad2(d.getHours())+':'+pad2(d.getMinutes());}
function weekLabel(dateStr){const d=new Date(dateStr+'T00:00:00');if(isNaN(d.getTime()))return '—';return ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];}
function load(){
  let raw=null;
  try{raw=localStorage.getItem(STORE_KEY);}catch(e){}
  if(!raw){S=seed();return;}
  let o;
  try{o=JSON.parse(raw);}catch(e){S=seed();return;}
  o.custom=o.custom||[];o.records=o.records||[];o.checks=o.checks||[];o.logs=o.logs||[];o.ackLow=o.ackLow||{};
  o.cost=o.cost||{};o.mig='u3';
  S=Object.assign(seed(),o);
}
function save(){
  try{localStorage.setItem(STORE_KEY,JSON.stringify(S));}catch(e){}
}
function itemList(){
  const ms=S.materials.map((m,i)=>({key:'M'+i,m}));
  const cs=S.custom.map((m,i)=>({key:'C'+i,m}));
  return ms.concat(cs);
}
function findItem(key){const hit=itemList().find(x=>x.key===key);return hit?hit.m:null;}
function amtOf(m){return m.price!=null&&m.stock!=null?Math.round(m.price*m.stock*100)/100:null;}
function stockTotal(){const list=itemList().map(x=>x.m).filter(m=>m.stock!=null);const sum=list.reduce((a,m)=>a+(amtOf(m)||0),0);return {sum:Math.round(sum*100)/100,count:list.length};
}
/* 预警红线：已建账且填了预警线，账面 ≤ 预警线即偏低；已确认补货的项暂不提醒 */
function isLow(m){return m.stock!=null&&m.low!=null&&!isNaN(Number(m.low))&&m.stock<=Number(m.low);}
function remindLow(key,m){return isLow(m)&&!S.ackLow[key];}
function lowCount(){return itemList().filter(({key,m})=>remindLow(key,m)).length;}
function logAdd(type,label,detail){
  S.logs.push({type,label,detail:detail||'',at:Date.now()});
  if(S.logs.length>500)S.logs=S.logs.slice(-500);
}
function syncCopy(){
  const b=$('shopName'); if(b)b.textContent=S.shopName;
}
load();
