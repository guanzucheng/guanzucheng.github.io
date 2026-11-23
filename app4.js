/* ============ 日志 ============ */
const LOG_TAG={in:['入库','tag ok'],out:['领用','tag out'],check:['盘点','tag gray'],custom:['自购','tag gray'],rename:['改名','tag gray'],daily:['日报','tag gray'],cost:['成本','tag gray'],staff:['人员','tag gray']};
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

/* ============ 成本卡 ============ */
function cardRowAmt(row){
  if(row.amt!=null) return Math.round(row.amt*1000)/1000;
  if(row.price!=null && row.qty!=null) return Math.round(row.price*row.qty*1000)/1000;
  return 0;
}
function r3(n){return Math.round(n*1000)/1000;}
function cardStats(card){
  const batches=Number(card.batches)>0?Number(card.batches):null;
  const total=card.rows.reduce(function(a,r){return a+cardRowAmt(r);},0);
  let unit;
  if(card.edited){
    unit=batches?total/batches:(card.unitCost!=null?card.unitCost:total);
  }else{
    unit=card.unitCost!=null?card.unitCost:(batches?total/batches:total);
  }
  const sale=Number(card.sale);
  const hasSale=card.sale!=null&&!isNaN(sale)&&sale>0;
  const gross=hasSale?sale-unit:null;
  const rate=hasSale&&sale>0?gross/sale*100:null;
  return {batches:batches,total:Math.round(total*1000)/1000,unit:Math.round(unit*1000)/1000,sale:hasSale?sale:null,gross:gross,rate:rate};
}
function renderCards(){
  const box=$('cardBox'); if(!box) return;
  const cards=S.costCards||[];
  if(!cards.length){box.innerHTML='<div class="mini">还没有成本卡</div>';return;}
  let idx=cards.findIndex(function(c){return c.id===S.costSel;});
  if(idx<0){idx=0;S.costSel=cards[0].id;}
  const card=cards[idx];
  const st=cardStats(card);
  const unit=card.unit||'份';

  const opts=cards.map(function(c){return '<option value="'+c.id+'"'+(c.id===card.id?' selected':'')+'>'+c.name+'</option>';}).join('');

  let rowsHtml;
  if(!card.rows.length){
    rowsHtml='<tr><td colspan="6" class="mini">暂无原料明细，标准单份成本 '+r3(card.unitCost||0)+' 元/'+unit+'</td></tr>';
  }else{
    rowsHtml=card.rows.map(function(r,i){
      const amt=cardRowAmt(r);
      const per=st.batches?amt/st.batches:null;
      const priceIn=(r.price==null?'':r.price);
      const pu=r.pu||'—';
      const qt=r.qt||(r.qty!=null?r.qty:'—');
      return '<tr>'+
        '<td class="nm">'+r.name+'</td>'+
        '<td><input type="number" inputmode="decimal" value="'+priceIn+'" data-ri="'+i+'" data-f="price" placeholder="单价"></td>'+
        '<td class="mini">'+pu+'</td>'+
        '<td class="mini">'+qt+'</td>'+
        '<td>'+r3(amt)+'</td>'+
        '<td>'+(per==null?'—':r3(per))+'</td>'+
      '</tr>';
    }).join('');
  }

  const rateHtml=st.rate==null?'<span class="mini">待填售价</span>':'<span class="'+(st.rate>=0?'tag ok':'tag warn')+'">'+Math.round(st.rate*10)/10+'%</span>';
  const grossHtml=st.gross==null?'<span class="mini">待填售价</span>':money(st.gross)+' 元';

  box.innerHTML=
    '<div class="field" style="margin-bottom:12px"><label>选择产品</label><select id="cardSel">'+opts+'</select></div>'+
    '<div class="bar" style="justify-content:space-between;gap:10px;flex-wrap:wrap">'+
      '<h2 style="margin:0">'+card.name+'</h2>'+
      '<span class="mini">'+(card.basis||'')+(card.basis?' · ':'')+'按'+unit+'计</span>'+
    '</div>'+
    '<div class="row three" style="margin-top:12px">'+
      '<div class="item"><div class="nm">单份成本（元/'+unit+'）</div><div class="val">'+r3(st.unit)+'</div></div>'+
      '<div class="item"><div class="nm">单份毛利</div><div class="val">'+grossHtml+'</div></div>'+
      '<div class="item"><div class="nm">毛利率</div><div class="val">'+rateHtml+'</div></div>'+
    '</div>'+
    '<div class="row two" style="margin-top:10px">'+
      '<div class="field"><label>售价（元/'+unit+'，自己填）</label><input type="number" id="cardSale" inputmode="decimal" value="'+(card.sale==null?'':card.sale)+'" placeholder="例如 8"></div>'+
      '<div class="field"><label>一批总成本</label><input type="text" value="'+r3(st.total)+' 元'+(st.batches?' / '+st.batches+' '+unit:'')+'" readonly></div>'+
    '</div>'+
    '<div style="overflow-x:auto;margin-top:12px">'+
      '<table>'+
        '<colgroup><col style="width:23%"><col style="width:17%"><col style="width:15%"><col style="width:19%"><col style="width:13%"><col style="width:13%"></colgroup>'+
        '<thead><tr><th>原料</th><th>单价(可调)</th><th>单价单位</th><th>配方用量(固定)</th><th>一批金额</th><th>每份成本</th></tr></thead>'+
        '<tbody>'+rowsHtml+'</tbody>'+
      '</table>'+
    '</div>'+
    '<p class="hint" style="margin-top:10px">单价按当地进价修改；配方用量与总部保持一致、不可改；金额、单份成本、毛利与毛利率自动重算。水、大料等没有单价的项按固定分摊金额计算。</p>';

  $('cardSel').onchange=function(){S.costSel=$('cardSel').value;save();renderCards();};
  $('cardSale').onchange=function(){const v=$('cardSale').value;card.sale=(v===''?null:Number(v));save();renderCards();};
  box.querySelectorAll('input[data-ri]').forEach(function(inp){
    inp.onchange=function(){
      const ri=Number(inp.dataset.ri),v=inp.value;
      const row=card.rows[ri];
      row.price=(v===''?null:Number(v));
      if(row.price!=null&&row.qty!=null) row.amt=Math.round(row.price*row.qty*1000)/1000;
      card.edited=true;
      save();renderCards();
    };
  });
}

/* ============ 路由 ============ */
function show(view){
  curView=view;
  ['daily','stock','card','cost','staff','check','record','log','setting'].forEach(v=>{$('view-'+v).hidden=v!==view;});
  document.querySelectorAll('.tabs-in button').forEach(b=>b.classList.toggle('on',b.dataset.view===view));
  if(view==='daily') renderDaily();
  if(view==='stock'){renderStock();renderCustom();}
  if(view==='check') renderCheck();
  if(view==='card') renderCards();
  if(view==='cost') renderCost();
  if(view==='staff') renderStaff();
  if(view==='record') renderRecords();
  if(view==='log') renderLog();
  if(view==='setting'){ $('setShop').value=S.shopName; }
  location.hash='#/'+view;
}
function renderAll(){
  $('shopName').textContent=S.shopName;
  renderDaily(); renderStock(); renderCustom(); renderCheck(); renderCards(); renderCost(); renderStaff(); renderRecords(); renderLog();
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
['cRent','cWater','cLogistics','cOther'].forEach(id=>$(id).oninput=drawCost);
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
window.addEventListener('hashchange',()=>{if(!localStorage.getItem('ysh_unlocked_v1'))return;const v=(location.hash||'').replace('#/','');if(v&&v!==curView&&['daily','stock','card','cost','staff','check','record','log','setting'].indexOf(v)>=0)show(v);});

/* ===== 初级访问门禁：未输密码不进入账本；本机记住已解锁 ===== */
const LOCK_KEY='ysh_unlocked_v1';
const ACCESS_PWD='ysh2026';
function enterApp(){
  const ls=$('lockScreen'); if(ls) ls.hidden=true;
  $('shopName').textContent=S.shopName;
  show((location.hash||'#/daily').slice(2)||'daily');
}
(function gate(){
  const locked=!localStorage.getItem(LOCK_KEY);
  if(!locked){enterApp();return;}
  const ls=$('lockScreen'); if(ls) ls.hidden=false;
  const inp=$('lockPwd'),btn=$('lockBtn'),err=$('lockErr');
  function tryUnlock(){
    if(inp.value.trim()===ACCESS_PWD){localStorage.setItem(LOCK_KEY,'1');enterApp();}
    else{err.textContent='密码不对，请核对后重试';inp.select();}
  }
  if(btn)btn.onclick=tryUnlock;
  if(inp)inp.onkeydown=e=>{if(e.key==='Enter')tryUnlock();};
})();
