function expCsv(){
  const head=["日期","星期","天气","总营业额"];
  const rows=S.records.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(r=>[r.date,weekLabel(r.date),r.weather||"",r.revenue]);
  const csv=head.concat(rows).map(r=>r.map(csvEscape).join(",")).join("\n");
  download("门店日报-"+todayStr()+'.csv',"\ufeff"+csv,"text/csv;charset=utf-8");toast("已导出日报 CSV");
}
function expCk(){
  if(!S.checks.length){toast("还没有盘点记录");return;}
  const head=["盘点日期","原料","单位","账面","实盘","差异","差异金额"];
  const rows=[];
  S.checks.forEach(c=>c.rows.forEach(r=>{
    const d2=Math.round((r.real-r.book)*100)/100;
    const a=(r.price==null)?"":Math.round(d2*r.price*100)/100;
    rows.push([c.date,r.n,r.unit,r.book,r.real,d2,a]);
  }));
  const csv=head.concat(rows).map(r=>r.map(csvEscape).join(",")).join("\n");
  download("门店盘点-"+todayStr()+'.csv',"\ufeff"+csv,"text/csv;charset=utf-8");toast("已导出盘点 CSV");
}
