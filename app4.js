/* app4 restore shell */
const LOG_TAG={in:['in','tag ok'],out:['out','tag'],check:['check','tag gray'],custom:['custom','tag gray'],daily:['daily','tag gray']};
function renderLog(){
  const box=$('logList'); if(!box)return;
  const f=($('lgType')&&$('lgType').value)||'all';
  const logs=S.logs.slice().reverse().filter(l=>f==='all'||l.type===f);
  if($('lgCount'))$('lgCount').textContent=''+logs.length;
  if(!logs.length){box.innerHTML='<div class="mini">none</div>';return;}
  let out='',last='';
  logs.forEach(l=>{
    const d=dateOf(l.at);
    if(d!==last){out+='<div class="mini" style="margin:10px 0 2px;font-weight:600;color:var(--ink-2)">'+d+'</div>';last=d;}
    const t=LOG_TAG[l.type]||['x','tag gray'];
    const tagHtml='<span class="tag '+t[1]+'" style="margin-left:6px">'+t[0]+'</span>';
    out+='<div class="item"><div><div class="nm" style="font-weight:500">'+l.label+tagHtml+'</div><div class="sub">'+(l.detail||'')+'</div></div><div class="val mini">'+hhmm(l.at)+'</div></div>';
  });
  box.innerHTML=out;
}
function clearLogs(){
  if(!S.logs.length){toast('none');return;}
  if(!confirm('clear?')){return;}
  S.logs=[]; save(); renderLog();
}
