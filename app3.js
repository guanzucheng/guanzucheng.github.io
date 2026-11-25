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
  const csv=[head].concat(rows).map(r=>r.map(csvEscape).join(',')).join('\n');
  download('门店单价清单-'+todayStr()+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');
  toast('已导出单价清单');
}
function expStock(){
  const head=['原料','品类','单位','账面','单价','金额'];
  const rows=itemList().map(({m})=>{const a=amtOf(m);return [m.n,m.cat||'门店自购',m.unit||'',m.stock==null?'':m.stock,m.price==null?'':m.price,a==null?'':a];});
  rows.push(['合计','','','','',stockTotal().sum]);
  const csv=[head].concat(rows).map(r=>r.map(csvEscape).join(',')).join('\n');
  download('门店库存金额-'+todayStr()+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');
  toast('已导出库存金额 CSV');
}

/* ============ 盘点 ============ */
let ckRows=[];
let ckSeg='month';
let ckDiffOnly=false;
function isDiffRow(r){
  if(r.real==null||r.real==='') return false;
  const d=Math.round(((Number(r.real))-(r.book==null?0:r.book))*100)/100;
  return d!==0;
}
function diffCount(){return ckRows.filter(isDiffRow).length;}
function ckVisible(){
  const cat=($('ckCat')&&$('ckCat').value)||'食材原料';
  const q=(($('ckQ')&&$('ckQ').value)||'').trim().toLowerCase();
  return ckRows.map((r,i)=>({r,i})).filter(x=>{
    const m=x.r;
    if(cat!=='全部'&&(m.cat||'门店自购')!==cat) return false;
    if(ckDiffOnly&&!isDiffRow(m)) return false;
    if(!q) return m.book!=null;
    return m.n.toLowerCase().indexOf(q)>=0;
  });
}
function refreshCkDiffUI(){
  const b=$('ckDiffBtn'); if(b)b.classList.toggle('on',ckDiffOnly);
  const c=$('ckDiffCount'); if(c)c.textContent=ckDiffOnly?('差异 '+diffCount()+' 项'):'';
}
function isMonthEnd(){
  const now=new Date();
  const last=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  return now.getDate()===last;
}
function refreshCkBadge(){
  const b=$('ckMonthBadge'); if(!b)return;
  b.hidden=!isMonthEnd();
}
function toggleCkDiff(){
  ckDiffOnly=!ckDiffOnly;
  refreshCkDiffUI();
  drawCheck();
}
function ckTitleFor(dateStr){const d=new Date(dateStr+'T00:00:00');if(isNaN(d.getTime()))return '本月盘点';return `${d.getFullYear()} 年 ${d.getMonth()+1} 月盘点`;}
function refreshCkSegUI(){
  const isCur=ckSeg==='current';
  document.querySelectorAll('[data-ckseg]').forEach(b=>b.classList.toggle('on',b.dataset.ckseg===ckSeg));
  const mo=$('ckMonthOnly'); if(mo)mo.hidden=isCur;
  const ct=$('ckCurTime');
  if(isCur){
    const now=new Date();
    $('ckTitle').textContent='当期盘点';
    if(ct)ct.textContent='盘点时间：'+todayStrOf(now)+' '+pad2(now.getHours())+':'+pad2(now.getMinutes());
  }else{
    $('ckTitle').textContent=ckTitleFor($('ckDate').value);
    if(ct)ct.textContent='';
  }
}
function switchCkSeg(seg){
  ckSeg=seg;
  refreshCkSegUI();
  rebuildCheck();
  drawCheck();
}
function renderCheck(){
  if(!$('ckDate').value)$('ckDate').value=todayStr();
  refreshCkSegUI();
  refreshCkDiffUI();
  refreshCkBadge();
  rebuildCheck();
  drawCheck();
}
function rebuildCheck(){
  const cat=($('ckCat')&&$('ckCat').value)||'食材原料';
  const keep={}; ckRows.forEach(r=>{keep[r.n]=r.real;});
  ckRows=itemList().filter(({m})=>cat==='全部'||(m.cat||'门店自购')===cat)
    .map(({m})=>({n:m.n,unit:m.unit||'',cat:m.cat||'门店自购',book:m.stock==null?null:m.stock,price:m.price==null?null:m.price,real:keep[m.n]!=null?keep[m.n]:''}));
}
function drawCheck(){
  const vis=ckVisible();
  const body=$('ckBody');
  if(!vis.length){
    const q=(($('ckQ')&&$('ckQ').value)||'').trim();
    const msg=ckDiffOnly?'目前没有盘点差异的原料':(q?'没有匹配的原料':'暂无库存原料，入库后自动显示');
    body.innerHTML='<tr><td colspan="5" class="mini">'+msg+'</td></tr>';updateCkTotal();return;}
  body.innerHTML=vis.map(x=>{const r=x.r;return `<tr><td>${r.n}</td><td>${r.book==null?'未建账':r.book+' '+r.unit}</td>
    <td><input type="number" data-i="${x.i}" class="ckIn" placeholder="实盘" value="${r.real==null?'':r.real}" style="padding:5px 8px"></td>
    <td class="ckDiff" data-i="${x.i}">—</td><td class="ckAmt" data-i="${x.i}">—</td></tr>`;}).join('');
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
          else{const m2=Math.round(d2*p*100)/100;amtCell.textContent=(m2>0?'+':'-')+money(Math.abs(m2))+' 元';amtCell.style.color=m2===0?'':'var(--warn)';}
        }
      }
      updateCkTotal();
    };
  });
  vis.forEach(x=>{
    const r=x.r, i=x.i;
    const cell=body.querySelector(`.ckDiff[data-i="${i}"]`);
    const amtCell=body.querySelector(`.ckAmt[data-i="${i}"]`);
    if(r.real!=null&&r.real!==''){
      const d2=Math.round((r.real-(r.book==null?0:r.book))*100)/100;
      if(cell){cell.textContent=(d2>0?'+':'')+d2+' '+r.unit;cell.style.color=d2===0?'':'var(--warn)';}
      if(amtCell&&r.price!=null){const m2=Math.round(d2*r.price*100)/100;amtCell.textContent=(m2>0?'+':'-')+money(Math.abs(m2))+' 元';amtCell.style.color=m2===0?'':'var(--warn)';}
    }
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
  refreshCkDiffUI();
}
function saveCheck(){
  const filled=ckRows.filter(r=>r.real!=null&&r.real!=='');
  if(!filled.length){toast('还没填实盘数');return;}
  const isCur=ckSeg==='current';
  const now=new Date();
  const cdate=isCur?todayStrOf(now):($('ckDate').value||todayStr());
  const rec={date:cdate,type:isCur?'current':'month',rows:filled.map(r=>({n:r.n,unit:r.unit,book:r.book==null?0:r.book,real:r.real,price:r.price==null?null:r.price}))};
  if(isCur){rec.at=now.getTime();rec.time=pad2(now.getHours())+':'+pad2(now.getMinutes());}
  S.checks.push(rec);
  const diff=filled.reduce((a,r)=>a+Math.abs((r.real==null?0:r.real)-(r.book==null?0:r.book)),0);
  logAdd('check',(isCur?'当期':'月度')+'盘点 '+filled.length+' 项已盘','差异合计 '+Math.round(diff*100)/100);
  save(); renderCkHistory(); toast(isCur?('当期盘点已保存（'+cdate+' '+rec.time+'）'):('盘点已保存（'+cdate+'）'));
}
function renderCkHistory(){
  const box=$('ckHistory');
  if(!S.checks.length){box.innerHTML='<div class="mini">还没有盘点记录</div>';return;}
  box.innerHTML=S.checks.slice().reverse().map(c=>{
    const isCur=c.type==='current';
    const diffRows=c.rows.map(r=>{
      const d2=Math.round(((r.real==null?0:r.real)-(r.book==null?0:r.book))*100)/100;
      return {r,d2};
    }).filter(x=>x.d2!==0);
    const diff=diffRows.reduce((a,x)=>a+Math.abs(x.d2),0);
    let amt=0; diffRows.forEach(x=>{if(x.r.price!=null)amt+=Math.abs(x.d2*x.r.price);});
    const when=isCur?(c.date+(c.time?(' '+c.time):'')):c.date;
    const tag=isCur?'<span class="tag gray" style="margin-left:6px">当期</span>':'<span class="tag gray" style="margin-left:6px">月度</span>';
    const diffHtml=diffRows.length?diffRows.map(x=>{
      const r=x.r, d2=x.d2, up=d2>0;
      const word=up?'多了':'少了';
      const cls=up?'up':'down';
      const amtTxt=r.price!=null?((d2>0?'+':'-')+money(Math.abs(Math.round(d2*r.price*100)/100))+' 元'):'';
      return `<div class="ck-diff-row"><span class="dn">${r.n}</span><span class="${cls}">${word} ${Math.abs(d2)} ${r.unit||''}</span>${amtTxt?`<span class="amt">${amtTxt}</span>`:''}</div>`;
    }).join(''):'<div class="mini">账实相符，无差异</div>';
    return `<div class="item" style="flex-wrap:wrap"><div style="flex:1;min-width:0"><div class="nm">${when}${tag}</div><div class="sub">${c.rows.length} 项 · 差异 ${diffRows.length} 项</div><div class="ck-hist-diffs">${diffHtml}</div></div><div class="val" style="text-align:right">差异量 ${Math.round(diff*100)/100}<div class="sub" style="font-weight:400">${amt>0?('金额约 '+money(Math.round(amt*100)/100)+' 元'):'金额 —'}</div></div></div>`;
  }).join('');
}
