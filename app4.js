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
    if(d!==last){out+='<div class="mini" style="margin:10px 0 2px;font-weight:600;color:var(--ink-2)">'+d+'</div>';last=d;}
    const t=LOG_TAG[l.type]||['动作','tag gray'];
    const tagHtml='<span class="tag '+t[1]+'" style="margin-left:6px">'+t[0]+'</span>';
    out+='<div class="item"><div><div class="nm" style="font-weight:500">'+l.label+tagHtml+'</div><div class="sub">'+(l.detail||'')+'</div></div><div class="val mini">'+hhmm(l.at)+'</div></div>';
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
  $('recBody').innerHTML=rows.length?rows.map(r=>'<tr><td>'+r.date+'<br><span style="color:var(--ink-2);font-size:12px">'+weekLabel(r.date)+'</span></td><td>'+(r.weather||'—')+'</td><td>'+money(r.revenue)+'</td><td>'+(r.note||'—')+'</td></tr>').join('')
    :'<tr><td colspan="4" class="mini">还没有日报</td></tr>';
  const days=rows.length;
  const total=rows.reduce((a,r)=>a+r.revenue,0);
  const avg=days?total/days:0;
  $('recSum').innerHTML='<div class="item"><div class="nm">累计营业额</div><div class="val">'+money(total)+' 元</div></div><div class="item"><div class="nm">记录天数</div><div class="val">'+days+' 天</div></div><div class="item"><div class="nm">日均</div><div class="val">'+money(avg)+' 元</div></div>';
}

/* ============ 导出与设置 ============ */
download placeholder