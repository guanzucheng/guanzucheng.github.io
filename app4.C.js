/* ============ 导出与设置 ============ */
function download(name,content,type){
  const blob=new Blob([content],{type:type||"text/plain;charset=utf-8"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob); a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}
function csvEscape(v){
  const s=v==null?"":String(v);
  const need=s.indexOf("\"")>=0||s.indexOf(",")>=0||s.indexOf("\n")>=0;
  return need?"\""+s.split("\"").join("\"\"")+"\"":s;
}
