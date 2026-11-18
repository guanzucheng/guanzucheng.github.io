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
$('ckQ').oninput=drawCheck;
$('lgType').onchange=renderLog;
$('btnLogClr').onclick=clearLogs;
document.querySelectorAll('.tabs-in button').forEach(b=>b.onclick=()=>show(b.dataset.view));

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
window.addEventListener('hashchange',()=>{const v=(location.hash||'').replace('#/','');if(v&&v!==curView&&['daily','stock','check','record','log','setting'].indexOf(v)>=0)show(v);});
$('shopName').textContent=S.shopName;
show((location.hash||'#/daily').slice(2)||'daily');
