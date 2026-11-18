function saveShop(){
  const v=$("setShop").value.trim();
  if(!v){toast("填个店名");return;}
  S.shopName=v; save(); $("shopName").textContent=v; toast("已保存");
}
function resetAll(){
  if(!confirm("会清空本机所有日报、库存和盘点记录，确定？")){return;}
  S=seed(); save(); $("shopName").textContent=S.shopName; $("setShop").value=S.shopName;
  renderAll(); toast("已清空");
}
