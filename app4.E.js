function expJson(){download("门店数据备份-"+todayStr()+'.json',JSON.stringify(S,null,2),"application/json");toast("已导出 JSON");}
