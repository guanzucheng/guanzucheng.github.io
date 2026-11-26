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
function isWeChat(){return /MicroMessenger/i.test(navigator.userAgent);}
function download(name,content,type){
  let saved=false;
  try{
    const blob=new Blob([content],{type:type||'text/plain;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download=name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),1500);
    saved=true;
  }catch(e){saved=false;}
  // 微信内置浏览器等环境拦截文件下载：弹出兜底面板，可复制内容留存
  if(isWeChat()||!saved) openDlPanel(name,content);
}
function openDlPanel(name,content){
  $('dlTitle').textContent=name;
  $('dlText').value=content;
  $('dlModal').hidden=false;
}
function closeDlPanel(){ $('dlModal').hidden=true; }
function fallbackCopy(ta){
  let ok=false;
  try{ ok=document.execCommand('copy'); }catch(e){ ok=false; }
  toast(ok?'已复制，可去粘贴':'复制失败，请长按文本手动复制');
}
function copyDlText(){
  const ta=$('dlText'); ta.focus(); ta.select();
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(ta.value).then(()=>toast('已复制，可去粘贴')).catch(()=>fallbackCopy(ta));
  }else{ fallbackCopy(ta); }
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
  const csv=[head].concat(rows).map(r=>r.map(csvEscape).join(',')).join('\n');
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
  const csv=[head].concat(rows).map(r=>r.map(csvEscape).join(',')).join('\n');
  download('门店盘点-'+todayStr()+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');toast('已导出盘点 CSV');
}
/* 导出人员当月考勤与工资（与人员页工资表同口径：在岗人员，超额利润提成均分） */
function expStaff(){
  const on=S.staff.filter(e=>e.status==='on');
  if(!S.staff.length){toast('还没有人员');return;}
  if(!on.length){toast('暂无在职人员可导出');return;}
  const rev=monthRevenue(staffMonth);
  const profit=monthProfit(rev);
  const cfg=staffCfg();
  const pool=Math.round(profit*(Number(cfg.poolRate)||0)/100*100)/100;
  const avg=on.length?Math.round(pool/on.length*100)/100:0;
  const attLabel={work:'出勤',rest:'休息',leave:'请假'};
  const head=['姓名','岗位','用工类型','薪资标准','应出勤','公休','请假','实出勤','缺勤扣款','全勤奖','提成','应发'];
  const rows=[]; const detail=[];
  on.forEach(e=>{
    const w=staffWage(e,staffMonth,avg);
    const att=w.att;
    const std=w.byHour?('时薪 '+money(w.hourly||0)+' 元/时')
      :(e.type==='temp'?('日薪 '+money(e.base||0)+' 元/天'):('底薪 '+money(e.base||0)+' 元/月'));
    const workTxt=w.byHour?(w.hours+' 小时'):(e.type==='temp'?att.work+' 天':att.work);
    const deduct=e.type==='temp'?'—':w.deduct;
    rows.push([e.name,e.role,e.type==='temp'?'兼职':'全职',std,att.total,att.rest,att.leave,workTxt,deduct,w.bonus,w.comm,w.total]);
    Object.keys(e.attend||{}).filter(k=>k.indexOf(staffMonth)===0).sort().forEach(k=>{
      const v=e.attend[k]; if(v)detail.push([e.name,k,attLabel[v]||v]);
    });
  });
  let body=[head].concat(rows).map(r=>r.map(csvEscape).join(',')).join('\n');
  if(detail.length){
    body+='\n\n'+[['姓名','日期','考勤状态']].concat(detail).map(r=>r.map(csvEscape).join(',')).join('\n');
  }
  download('人员考勤工资-'+staffMonth+'.csv','\ufeff'+body,'text/csv;charset=utf-8');
  toast('已导出人员考勤工资 CSV');
}
function saveShop(){
  const v=$('setShop').value.trim();
  if(!v){toast('填个店名');return;}
  S.shopName=v; save(); $('shopName').textContent=v; toast('已保存');
}
function resetAll(){
  const m=$('resetModal'); if(!m){doReset();return;}
  $('resetPwd').value='';
  $('resetErr').textContent='';
  m.hidden=false;
  $('resetPwd').focus();
}
function doReset(){
  S=seed(); save(); $('shopName').textContent=S.shopName; $('setShop').value=S.shopName;
  renderAll(); toast('已清空');
}
function confirmReset(){
  const v=$('resetPwd').value.trim();
  if(v!==ACCESS_PWD){ $('resetErr').textContent='密码不对，请核对后重试'; $('resetPwd').select(); return; }
  $('resetModal').hidden=true;
  doReset();
}
function closeReset(){ $('resetModal').hidden=true; }

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
function isShopCard(c){ return !!c && c.source==='shop'; }
function shopUnitOfPu(pu){ return String(pu||'').replace(/^元\//,'').trim(); }
function escHtml(s){return String(s==null?'':s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function renderCards(){
  const box=$('cardBox'); if(!box) return;
  const cards=S.costCards||[];
  if(!cards.length){box.innerHTML='<div class="mini">还没有成本卡</div>';return;}
  let idx=cards.findIndex(function(c){return c.id===S.costSel;});
  if(idx<0){idx=0;S.costSel=cards[0].id;}
  const card=cards[idx];
  const st=cardStats(card);
  const unit=card.unit||'份';
  const shop=isShopCard(card);

  const opts=cards.map(function(c){
    const lab=isShopCard(c)?('✦ '+c.name+'（门店新品）'):c.name;
    return '<option value="'+c.id+'"'+(c.id===card.id?' selected':'')+'>'+escHtml(lab)+'</option>';
  }).join('');

  let rowsHtml;
  if(!card.rows.length){
    rowsHtml='<tr><td colspan="'+(shop?7:6)+'" class="mini">'+(shop?'还没加原料，点下面“加一行原料”逐项录入用量和进价':'暂无原料明细，标准单份成本 '+r3(card.unitCost||0)+' 元/'+unit)+'</td></tr>';
  }else{
    rowsHtml=card.rows.map(function(r,i){
      const amt=cardRowAmt(r);
      const per=st.batches?amt/st.batches:null;
      if(shop){
        return '<tr>'+
          '<td><input type="text" value="'+escHtml(r.name||'')+'" data-ri="'+i+'" data-f="name" placeholder="原料名"></td>'+
          '<td><input type="number" inputmode="decimal" value="'+(r.price==null?'':r.price)+'" data-ri="'+i+'" data-f="price" placeholder="进价"></td>'+
          '<td><input type="text" value="'+escHtml(r.pu||'元/斤')+'" data-ri="'+i+'" data-f="pu" placeholder="元/斤"></td>'+
          '<td><input type="number" inputmode="decimal" value="'+(r.qty==null?'':r.qty)+'" data-ri="'+i+'" data-f="qty" placeholder="用量"></td>'+
          '<td>'+r3(amt)+'</td>'+
          '<td>'+(per==null?'—':r3(per))+'</td>'+
          '<td><button type="button" class="btn plain" data-delrow="'+i+'" style="padding:4px 8px;font-size:12px">删</button></td>'+
        '</tr>';
      }
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

  const headActions=shop
    ? '<div class="bar" style="gap:6px"><button type="button" class="btn plain" id="btnCardRename" style="padding:6px 10px;font-size:12.5px">改名</button><button type="button" class="btn plain" id="btnCardDel" style="padding:6px 10px;font-size:12.5px;color:var(--warn)">删除</button></div>'
    : '';
  const shopTag=shop?'<span class="tag" style="background:#e57232;color:#fff;font-weight:700;margin-left:6px">门店新品</span>':'';
  const headCol=shop
    ? '<colgroup><col style="width:21%"><col style="width:15%"><col style="width:14%"><col style="width:14%"><col style="width:14%"><col style="width:14%"><col style="width:8%"></colgroup>'
    : '<colgroup><col style="width:23%"><col style="width:17%"><col style="width:15%"><col style="width:19%"><col style="width:13%"><col style="width:13%"></colgroup>';
  const headTh=shop
    ? '<th>原料</th><th>进价</th><th>单价单位</th><th>用量</th><th>一批金额</th><th>每份成本</th><th></th>'
    : '<th>原料</th><th>单价(可调)</th><th>单价单位</th><th>配方用量(固定)</th><th>一批金额</th><th>每份成本</th>';
  const secondField=shop
    ? '<div class="field"><label>一批出多少份（'+unit+'）</label><input type="number" id="cardBatches" inputmode="decimal" value="'+(card.batches==null?'':card.batches)+'" placeholder="例如 40"></div>'
    : '<div class="field"><label>一批总成本</label><input type="text" value="'+r3(st.total)+' 元'+(st.batches?' / '+st.batches+' '+unit:'')+'" readonly></div>';
  const addRowBtn=shop?'<div style="margin-top:10px"><button type="button" class="btn ghost" id="btnCardAddRow" style="width:auto;padding:8px 14px">＋加一行原料</button></div>':'';
  const hint=shop
    ? '原料名、用量和进价按本店实际称量填写；进价×用量自动算一批金额，一批合计÷份数得单份成本，售价填好后自动算毛利与毛利率。'
    : '单价按当地进价修改；配方用量与总部保持一致、不可改；金额、单份成本、毛利与毛利率自动重算。水、大料等没有单价的项按固定分摊金额计算。';

  box.innerHTML=
    '<div class="bar" style="margin-bottom:12px;justify-content:space-between;gap:10px;align-items:end">'+
      '<div class="field" style="flex:1;margin:0"><label>选择产品</label><select id="cardSel">'+opts+'</select></div>'+
      '<button type="button" class="btn ghost" id="btnCardNew" style="width:auto;padding:10px 14px;white-space:nowrap">＋新增产品</button>'+
    '</div>'+
    '<div class="bar" style="justify-content:space-between;gap:10px;flex-wrap:wrap">'+
      '<h2 style="margin:0">'+escHtml(card.name)+shopTag+'</h2>'+headActions+
    '</div>'+
    '<div class="bar" style="margin-top:4px"><span class="mini">'+escHtml(card.basis||'')+(card.basis?' · ':'')+'按'+unit+'计</span></div>'+
    '<div class="row three" style="margin-top:12px">'+
      '<div class="item"><div class="nm">单份成本（元/'+unit+'）</div><div class="val">'+r3(st.unit)+'</div></div>'+
      '<div class="item"><div class="nm">单份毛利</div><div class="val">'+grossHtml+'</div></div>'+
      '<div class="item"><div class="nm">毛利率</div><div class="val">'+rateHtml+'</div></div>'+
    '</div>'+
    '<div class="row two" style="margin-top:10px">'+
      '<div class="field"><label>售价（元/'+unit+'，自己填）</label><input type="number" id="cardSale" inputmode="decimal" value="'+(card.sale==null?'':card.sale)+'" placeholder="例如 8"></div>'+
      secondField+
    '</div>'+
    '<div style="overflow-x:auto;margin-top:12px">'+
      '<table>'+headCol+'<thead><tr>'+headTh+'</tr></thead><tbody>'+rowsHtml+'</tbody>'+
      '</table>'+
    '</div>'+
    addRowBtn+
    '<p class="hint" style="margin-top:10px">'+hint+'</p>';

  $('cardSel').onchange=function(){S.costSel=$('cardSel').value;save();renderCards();};
  $('cardSale').onchange=function(){const v=$('cardSale').value;card.sale=(v===''?null:Number(v));save();renderCards();};
  $('btnCardNew').onclick=function(){openCardModal(null);};

  if(shop){
    const bIn=$('cardBatches');
    if(bIn)bIn.onchange=function(){
      const v=bIn.value; card.batches=(v===''?null:Number(v));
      card.basis=card.batches?('一批 '+card.batches+' '+unit):'门店自制';
      save();renderCards();
    };
    box.querySelectorAll('input[data-ri]').forEach(function(inp){
      inp.onchange=function(){
        const ri=Number(inp.dataset.ri),f=inp.dataset.f,row=card.rows[ri];
        let v=inp.value;
        if(f==='name'){row.name=v.trim();}
        else if(f==='pu'){row.pu=v.trim()||'元/斤';}
        else if(f==='qty'){row.qty=(v===''?null:Number(v));}
        else if(f==='price'){row.price=(v===''?null:Number(v));}
        if(row.qty!=null){row.qt=row.qty+' '+(shopUnitOfPu(row.pu)||'');}
        if(row.price!=null&&row.qty!=null) row.amt=Math.round(row.price*row.qty*1000)/1000;
        else row.amt=0;
        save();renderCards();
      };
    });
    const ar=$('btnCardAddRow'); if(ar)ar.onclick=function(){card.rows.push({name:'',price:null,pu:'元/斤',qty:null,qt:'',amt:0});save();renderCards();};
    box.querySelectorAll('[data-delrow]').forEach(function(b){b.onclick=function(){card.rows.splice(Number(b.dataset.delrow),1);save();renderCards();};});
    const rn=$('btnCardRename'); if(rn)rn.onclick=function(){openCardModal(card.id);};
    const dl=$('btnCardDel'); if(dl)dl.onclick=function(){deleteCard(card.id);};
  }else{
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
}

/* 新增 / 修改门店自建新品（弹窗）；字段 id 用 card 前缀，避免与库存自购表单 cmName/cmUnit 冲突 */
function openCardModal(editId){
  let m=$('cardModal');
  if(!m){
    m=document.createElement('div'); m.className='dl-modal'; m.id='cardModal';
    m.innerHTML=
      '<div class="dl-box">'+
        '<h2 id="cardModalTitle">新增门店新品</h2>'+
        '<div class="field" style="margin-top:10px"><label>产品名称（必填）</label><input type="text" id="cardName" placeholder="例如 凉拌木耳"></div>'+
        '<div class="row two" style="margin-top:10px">'+
          '<div class="field"><label>计量单位</label><input type="text" id="cardUnit" placeholder="碗 / 个 / 斤 / 笼"></div>'+
          '<div class="field"><label>一批出多少份</label><input type="number" id="cardBatches" inputmode="decimal" placeholder="例如 40"></div>'+
        '</div>'+
        '<div class="field" style="margin-top:10px"><label>售价（元/份，可后补）</label><input type="number" id="cardSalePrice" inputmode="decimal" placeholder="例如 6"></div>'+
        '<div class="lock-err" id="cardErr" style="margin-top:6px"></div>'+
        '<div class="bar" style="margin-top:14px">'+
          '<button class="btn" id="cardConfirm" type="button" style="flex:1">保存新品</button>'+
          '<button class="btn plain" id="cardCancel" type="button" style="flex:1">取消</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(m);
  }
  const editing=editId?S.costCards.find(c=>c.id===editId):null;
  $('cardModalTitle').textContent=editing?'修改门店新品':'新增门店新品';
  $('cardName').value=editing?editing.name:'';
  $('cardUnit').value=editing?editing.unit:'';
  $('cardBatches').value=editing&&editing.batches!=null?editing.batches:'';
  $('cardSalePrice').value=editing&&editing.sale!=null?editing.sale:'';
  $('cardErr').textContent='';
  m.hidden=false;
  const confirm=function(){
    const name=$('cardName').value.trim();
    if(!name){$('cardErr').textContent='先填产品名称';$('cardName').focus();return;}
    const unit=$('cardUnit').value.trim()||'碗';
    const batches=$('cardBatches').value===''?null:Number($('cardBatches').value);
    const sale=$('cardSalePrice').value===''?null:Number($('cardSalePrice').value);
    if(editing){
      editing.name=name; editing.unit=unit; editing.batches=batches; editing.sale=sale;
      editing.basis=batches?('一批 '+batches+' '+unit):'门店自制';
    }else{
      const card={id:'x'+Math.random().toString(36).slice(2,8),source:'shop',name:name,unit:unit,basis:batches?('一批 '+batches+' '+unit):'门店自制',batches:batches,sale:sale,rows:[],edited:true,unitCost:0};
      S.costCards.push(card); S.costSel=card.id;
    }
    save(); m.hidden=true; renderCards();
    toast(editing?'已保存修改':'已新增，接着加原料明细');
  };
  $('cardConfirm').onclick=confirm;
  $('cardCancel').onclick=function(){m.hidden=true;};
  $('cardName').focus();
}

function deleteCard(id){
  const c=S.costCards.find(x=>x.id===id); if(!c)return;
  if(!confirm('删除「'+c.name+'」？配方明细一并删除，此操作不可恢复。'))return;
  S.costCards=S.costCards.filter(x=>x.id!==id);
  if(S.costSel===id)S.costSel=S.costCards.length?S.costCards[0].id:null;
  save(); renderCards(); toast('已删除该新品');
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
$('btnExpStaff').onclick=expStaff;
$('btnImpPrice').onclick=importPrices;
$('btnExpPrice').onclick=expPrices;
$('btnReset').onclick=resetAll;
$('resetConfirm').onclick=confirmReset;
$('resetCancel').onclick=closeReset;
$('resetPwd').onkeydown=e=>{if(e.key==='Enter')confirmReset();};
$('dlCopy').onclick=copyDlText;
$('dlClose').onclick=closeDlPanel;
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
