/* ============ 库存 ============ */
/* 剩余库存总金额固定放在库存账卡片最下方（节点在 HTML 里静态写好，不再动态挂载，兼容旧安卓外壳） */
function sumEl(){
  let el=$('stVal');
  if(!el){
    el=document.createElement('div'); el.id='stVal';
    el.style.marginTop='12px'; el.style.paddingTop='10px'; el.style.borderTop='1px solid var(--line)';
    const box=$('stockList');
    if(box&&box.parentNode) box.parentNode.appendChild(el);
  }
  return el;
}
function renderStock(){
  const cat=($('stCat')&&$('stCat').value)||'全部';
  const q=(($('stQ')&&$('stQ').value)||'').trim();
  const list=itemList().filter(({key,m})=>{
    const ok=cat==='全部'?true:(cat==='待补货'?remindLow(key,m):(m.cat||'门店自购')===cat);
    return ok&&(!q||m.n.indexOf(q)>=0);
  });
  list.sort((a,b)=>{
    const aHas=a.m.stock!=null, bHas=b.m.stock!=null;
    if(aHas!==bHas) return aHas?-1:1;
    if(aHas&&bHas) return (b.m.stock||0)-(a.m.stock||0);
    return 0;
  });
  const box=$('stockList');
  if(!list.length){box.innerHTML='<div class="mini">'+(cat==='待补货'?'当前没有需要补货的原料':'没有匹配的原料')+'</div>';}
  else box.innerHTML=list.map(({key,m})=>{
    const unit=m.unit||'';
    const low=remindLow(key,m);
    const stockTxt=m.stock==null?'—':(m.stock+' '+unit);
    const a=amtOf(m);
    const amtTxt=a==null?'金额 —':('金额 '+money(a)+' 元');
    const tag=m.stock==null?'未建账':'已建账';
    const lowRow='<div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:6px;font-size:12px;color:var(--ink-3)"><span>预警线</span><input type="number" class="lowIn" data-key="'+key+'" value="'+(m.low==null?'':m.low)+'" placeholder="填" inputmode="decimal" style="width:52px;padding:4px 6px;font-size:12px;text-align:center"><span>'+unit+'</span></div>';
    const lowTag=low?'<span class="tag warn" style="margin-left:6px">补货</span>':'';
    const stockBox=low?'border-color:var(--warn);color:var(--warn);background:#fbecea':'border:1px solid var(--line);background:#fff';
    const rowBg=low?'background:#fdf3f1;border-radius:8px;padding-left:8px;padding-right:8px':'';
    return '<div class="item" style="'+rowBg+'"><div style="flex:1;min-width:0"><div class="nm" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap"><span class="nmTxt">'+m.n+'</span>'+lowTag+'<button type="button" class="btn plain nmEdit" data-key="'+key+'" style="width:auto;padding:2px 8px;font-size:12px">改名</button></div><div class="sub">'+(m.cat||'门店自购')+' · '+tag+'</div><div class="sub" style="margin-top:3px;color:var(--ink-2);font-variant-numeric:tabular-nums">'+amtTxt+'</div></div><div style="text-align:right;min-width:122px"><div style="display:inline-block;min-width:74px;padding:5px 10px;border-radius:8px;font-weight:600;font-variant-numeric:tabular-nums;text-align:center;'+stockBox+'">'+stockTxt+'</div><div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:6px;font-size:12px;color:var(--ink-3)"><span>单价</span><input type="number" class="prIn" data-key="'+key+'" value="'+(m.price==null?'':m.price)+'" placeholder="填" inputmode="decimal" style="width:52px;padding:4px 6px;font-size:12px;text-align:center"><span>元/'+unit+'</span></div>'+lowRow+'</div></div>';
  }).join('');
  box.querySelectorAll('.prIn').forEach(inp=>{
    inp.onchange=()=>{
      const m=findItem(inp.dataset.key); if(!m)return;
      const val=inp.value===''?null:Number(inp.value);
      m.price=(val==null||isNaN(val))?null:val;
      save(); renderStock();
    };
  });
  box.querySelectorAll('.lowIn').forEach(inp=>{
    inp.onchange=()=>{
      const m=findItem(inp.dataset.key); if(!m)return;
      const val=inp.value===''?null:Number(inp.value);
      m.low=(val==null||isNaN(val))?null:val;
      save(); renderStock();
    };
  });
  bindRename(box);
  refreshCombo();
  renderStockTotal();
  renderLowBanner();
  renderLowList();
}
function renderLowList(){
  const box=$('stLowList'); if(!box)return;
  const rows=itemList().filter(({key,m})=>remindLow(key,m));
  if(!rows.length){box.innerHTML='';return;}
  box.innerHTML=rows.map(({key,m})=>{
    const unit=m.unit||'';
    const lowLine=m.low==null?'—':(m.low+' '+unit);
    const info='（账面 '+m.stock+' '+unit+' · 预警线 '+lowLine+'）';
    return '<div class="item" style="background:#fdf3f1;border-radius:8px;padding-left:8px;padding-right:8px"><div style="flex:1;min-width:0"><div class="nm">'+m.n+' <span class="mini" style="color:var(--ink-3);font-weight:400">'+info+'</span></div></div><button type="button" class="btn plain restockBtn" data-key="'+key+'" style="width:auto;flex:0 0 auto;padding:5px 10px;font-size:12.5px;color:var(--accent);border-color:var(--accent)">已补货</button></div>';
  }).join('');
  box.querySelectorAll('.restockBtn').forEach(b=>{
    b.onclick=()=>{
      S.ackLow[b.dataset.key]=true;
      save(); renderStock(); toast('已标记补货，该提醒已消除');
    };
  });
}
function bindRename(box){
  box.querySelectorAll('.nmEdit').forEach(btn=>{
    btn.onclick=()=>{
      const key=btn.dataset.key;
      const m=findItem(key); if(!m)return;
      const nmRow=btn.closest('.nm');
      const span=nmRow.querySelector('.nmTxt');
      const old=m.n;
      const inp=document.createElement('input');
      inp.type='text'; inp.value=old;
      inp.style='font:inherit;font-weight:600;padding:4px 8px;border:1px solid var(--line);border-radius:8px;width:100%';
      span.replaceWith(inp); btn.style.display='none';
      inp.focus(); inp.select();
      let done=false;
      const commit=()=>{
        if(done)return; done=true;
        const nv=inp.value.trim();
        if(!nv){toast('名称不能为空');renderStock();return;}
        if(nv!==old&&itemList().some(({key:k,m:it})=>k!==key&&it.n===nv)){toast('这个名称已经有了');renderStock();return;}
        if(nv!==old){
          m.n=nv;
          logAdd('rename','改名：'+old+' → '+nv,'');
          save();
        }
        renderStock();
      };
      inp.onblur=commit;
      inp.onkeydown=e=>{if(e.key==='Enter')inp.blur();else if(e.key==='Escape'){inp.value=old;inp.blur();}};
    };
  });
}
function renderLowBanner(){
  const n=lowCount();
  const badge=$('stockBadge');
  if(badge){ badge.hidden=!(n>0); badge.textContent=n>0?n:''; }
  const el=$('stLow'); if(!el)return;
  el.innerHTML=n>0
    ? '<span style="color:var(--warn);font-weight:600">待补货 '+n+' 项</span><span class="mini" style="margin-left:8px">账面已低于预警线，建议尽快进货</span>'
    : '<span class="mini">没有低于预警线的原料</span>';
}
function renderStockTotal(){
  const el=sumEl(); if(!el)return;
  const t=stockTotal();
  const total=itemList().length;
  const main=t.filled?('剩余库存总金额 <b style="color:var(--accent);font-size:19px;font-weight:700">'+money(t.sum)+' 元</b>'):('剩余库存总金额 <b style="color:var(--ink-3);font-size:17px">待入库</b>');
  el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap"><span>'+main+'</span></div><div class="mini" style="margin-top:5px">已填单价 '+t.filled+' / '+total+' 项 · 单价可按当地进价随时改，改完金额自动重算</div>';
}

/* ============ 记一笔：原料搜索组合框 ============ */
let selItemKey='';
function matchCombo(kw){
  kw=(kw||'').trim().toLowerCase();
  const cat=($('stCat')&&$('stCat').value)||'全部';
  return itemList().filter(({m})=>{
    if(cat!=='全部'&&cat!=='待补货'&&(m.cat||'门店自购')!==cat) return false;
    if(!kw) return true;
    return m.n.toLowerCase().indexOf(kw)>=0;
  });
}
function refreshCombo(){
  const input=$('sItemInput'), box=$('sItemList');
  if(!input||!box) return;
  const rows=matchCombo(input.value);
  if(!rows.length){
    box.innerHTML='<div class="empty">没找到这个原料，可先在下面“门店自购”里添加</div>';
    box.hidden=false; return;
  }
  box.innerHTML=rows.map(({key,m})=>'<div class="opt'+(key===selItemKey?' on':'')+'" data-key="'+key+'">'+m.n+'<span class="sub">'+(m.unit||'')+' · '+(m.cat||'门店自购')+'</span></div>').join('');
  box.querySelectorAll('.opt').forEach(o=>{
    o.onclick=()=>{
      selItemKey=o.dataset.key;
      const m=findItem(selItemKey);
      input.value=m?m.n:'';
      box.hidden=true;
      $('sQty').focus();
    };
  });
}
function stockApply(){
  if(!selItemKey){toast('先选原料，可打字搜索后点选');$('sItemInput').focus();return;}
  const q=Number($('sQty').value);
  if(!q||q<=0){toast('数量不对');$('sQty').focus();return;}
  const m=findItem(selItemKey); if(!m){toast('原料没找到');return;}
  const cur=m.stock==null?0:m.stock;
  const isIn=$('sType').value==='in';
  if(!isIn&&cur-q<0){toast('库存不够，不能出这么多');return;}
  m.stock=Math.round((isIn?cur+q:cur-q)*100)/100;
  delete S.ackLow[selItemKey];
  const a=amtOf(m);
  logAdd(isIn?'in':'out',q+' '+(m.unit||'')+' '+m.n,'账面 '+m.stock+' '+(m.unit||'')+(a!=null?(' · 金额 '+money(a)+' 元'):''));
  save(); $('sQty').value=''; if($('stQ').value)$('stQ').value='';
  selItemKey=''; $('sItemInput').value='';
  renderStock(); if(curView==='log')renderLog();
  toast(isIn?'已入库':'已领用');
}

/* ============ 自购项 ============ */
function renderCustom(){
  const box=$('customList'); if(!box)return;
  if(!S.custom.length){box.innerHTML='<div class="mini">还没有自购项</div>';return;}
  box.innerHTML=S.custom.map((c,i)=>'<div class="item"><div><div class="nm">'+c.n+'</div><div class="sub">'+(c.unit||'')+' · 账面 '+(c.stock==null?'未建账':c.stock)+'</div></div><button class="btn plain" data-del="'+i+'" type="button">删除</button></div>').join('');
  box.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{
    const gone=S.custom[Number(b.dataset.del)];
    delete S.ackLow['C'+Number(b.dataset.del)];
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
