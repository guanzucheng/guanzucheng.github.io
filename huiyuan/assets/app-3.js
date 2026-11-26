  function pageWorks() {
    return topbar('作品集', '#/settings', '<button class="act" data-act="edit-work" data-id="">新增</button>') +
      '<div class="page"><div class="note">这里只放你获得顾客授权可以公开展示的照片。图片地址可以填图床链接，也可以留空先用占位。</div>' +
      '<div class="card" style="margin-top:12px"><div class="list">' + db.works.map(function (w) {
        return '<div class="row" data-act="edit-work" data-id="' + w.id + '">' +
          '<div style="width:44px;height:44px;border-radius:8px;background:linear-gradient(150deg,#ead9cf,#d9c2b5);overflow:hidden;flex-shrink:0">' +
          (w.image ? '<img src="' + esc(w.image) + '" style="width:100%;height:100%;object-fit:cover">' : '') + '</div>' +
          '<div class="grow"><div class="name" style="font-size:13.5px">' + esc(w.label) + '</div>' +
          '<div class="sub">' + esc(w.series || '') + '</div></div><div class="end">编辑</div></div>';
      }).join('') + '</div></div></div>' + tabbar('admin', '#/settings');
  }

  /* ---------- 看板 ---------- */
  function pageStats() {
    var s = L.stats(db);
    var rows = [
      ['本月实收', '¥' + L.money(s.revenue), s.orders + ' 单'],
      ['客单价', '¥' + L.money(s.avg), ''],
      ['新客', s.newCustomers + ' 人', '转介绍占 ' + s.referRate + '%'],
      ['补色到店率', s.makeupRate + '%', '到期 ' + s.makeupDue + '，已补 ' + s.makeupDone],
      ['客户总数', s.totalCustomers + ' 人', ''],
      ['券', s.totalCoupons + ' 张', '已用 ' + s.usedCoupons + ' 张']
    ];
    return topbar('数据看板', '#/admin') + '<div class="page">' +
      rows.map(function (r) {
        return '<div class="card" style="padding:14px 16px;margin-bottom:9px"><div style="display:flex;align-items:baseline;justify-content:space-between">' +
          '<div><div style="font-size:12px;color:#958a80">' + r[0] + '</div>' +
          '<div style="font-size:20px;font-weight:600;margin-top:2px">' + r[1] + '</div></div>' +
          '<div style="font-size:11.5px;color:#958a80;text-align:right">' + r[2] + '</div></div></div>';
      }).join('') +
      '<div class="note" style="margin-top:10px">只看这五个数：实收、客单价、新客、转介绍占比、补色到店率。其余报表不做。</div>' +
      '</div>' + tabbar('admin', '#/admin');
  }

  /* ---------- 设置 ---------- */
  function pageSettings() {
    var c = cfg();
    return topbar('设置', '#/admin') + '<div class="page">' +
      '<div class="section-title"><h2>店铺信息</h2><span></span></div>' +
      '<div class="card">' +
      '<div class="field"><label>店名</label><input id="setShop" value="' + esc(c.shopName) + '"></div>' +
      '<div class="field"><label>一句话介绍</label><input id="setSlogan" value="' + esc(c.slogan) + '"></div>' +
      '<div class="two-col"><div class="field"><label>主理人微信</label><input id="setWechat" value="' + esc(c.masterWechat || '') + '" placeholder="顾客约时间加这个"></div>' +
      '<div class="field"><label>管理密码</label><input id="setPwd" value="' + esc(c.password) + '"></div></div>' +
      '<div class="two-col"><div class="field"><label>每多少元 1 分</label><input id="setRate" type="number" value="' + c.pointsRate + '"></div>' +
      '<div class="field"><label>补色提醒天数</label><input id="setMakeup" type="number" value="' + c.makeupDays + '"></div></div>' +
      '<div class="field"><label>奖励结算天数</label><input id="setSettle" type="number" value="' + c.settleDays + '"></div>' +
      '<button class="btn block" data-act="save-settings">保存</button></div>' +

      '<div class="section-title"><h2>内容</h2><span></span></div>' +
      '<div class="card"><div class="list">' +
      '<div class="row" data-act="go" data-to="#/projects"><div class="grow"><div class="name">项目与价目</div><div class="sub">' + db.projects.length + ' 个项目</div></div><div class="end">›</div></div>' +
      '<div class="row" data-act="go" data-to="#/works"><div class="grow"><div class="name">作品集</div><div class="sub">' + db.works.length + ' 组</div></div><div class="end">›</div></div>' +
      '<div class="row" data-act="go" data-to="#/coupons"><div class="grow"><div class="name">发券记录</div><div class="sub">' + db.coupons.length + ' 张</div></div><div class="end">›</div></div>' +
      '<div class="row" data-act="go" data-to="#/invites"><div class="grow"><div class="name">老带新</div><div class="sub">' + db.invites.length + ' 条</div></div><div class="end">›</div></div>' +
      '</div></div>' +

      '<div class="section-title"><h2>数据</h2><span>存在本机，请定期备份</span></div>' +
      '<div class="card">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
      '<button class="btn ghost" data-act="export-json">导出备份</button>' +
      '<button class="btn ghost" data-act="import-json">导入备份</button>' +
      '<button class="btn ghost" data-act="export-customers">客户表 CSV</button>' +
      '<button class="btn ghost" data-act="export-orders">订单表 CSV</button>' +
      '</div>' +
      '<div class="note warn" style="margin-top:12px">数据只存在这台设备的浏览器里。换手机、清理缓存、换浏览器都会丢，务必每月导出一次备份文件存到网盘。</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px">' +
      '<button class="btn danger" data-act="reset-demo">恢复示例数据</button>' +
      '<button class="btn danger" data-act="clear-data">清空所有数据</button>' +
      '</div></div>' +

      '<div class="card" style="margin-top:12px"><div class="kv"><div class="k">版本</div><div class="v">v1.0 · 网页版（可转小程序）</div></div>' +
      '<div class="kv"><div class="k">存储</div><div class="v">' + (storageMode()) + '</div></div></div>' +
      '</div>' + tabbar('admin', '#/settings');
  }

  function storageMode() {
    try {
      localStorage.setItem('__probe', '1');
      localStorage.removeItem('__probe');
      return '浏览器本地存储（可用）';
    } catch (e) {
      return '本地存储不可用，当前为临时内存模式';
    }
  }

  /* ================= 弹层内容 ================= */
  function reminderSheet(key) {
    var r = L.reminders(db);
    var title = { makeup: '补色到期', birthday: '本月生日', sleeping: '一年未到店', pending: '待结算奖励' }[key];
    var body = '';
    if (key === 'makeup') {
      body = r.makeup.map(function (x) {
        return '<div class="row"><div class="avatar">' + esc(x.customer.name.slice(0, 1)) + '</div>' +
          '<div class="grow"><div class="name">' + esc(x.customer.name) + '</div>' +
          '<div class="sub">补色日 ' + x.order.makeupDate + '，已超 ' + x.days + ' 天</div></div>' +
          '<div class="end"><button class="btn mini ghost" data-act="copy-makeup" data-id="' + x.order.id + '">话术</button>' +
          '<button class="btn mini" data-act="makeup-done" data-id="' + x.order.id + '">已补</button></div></div>';
      }).join('') || emptyBlock('没有到期的补色');
    } else if (key === 'birthday') {
      body = r.birthday.map(function (x) {
        return '<div class="row"><div class="avatar">' + esc(x.customer.name.slice(0, 1)) + '</div>' +
          '<div class="grow"><div class="name">' + esc(x.customer.name) + '</div>' +
          '<div class="sub">生日 ' + x.customer.birthday + '</div></div>' +
          '<div class="end"><button class="btn mini ghost" data-act="issue-for" data-id="' + x.customer.id + '">发券</button></div></div>';
      }).join('') || emptyBlock('本月没有生日客户');
    } else if (key === 'sleeping') {
      body = r.sleeping.map(function (x) {
        return '<div class="row"><div class="avatar">' + esc(x.customer.name.slice(0, 1)) + '</div>' +
          '<div class="grow"><div class="name">' + esc(x.customer.name) + '</div>' +
          '<div class="sub">' + x.days + ' 天未到店，上次 ' + x.customer.lastVisit + '</div></div>' +
          '<div class="end"><button class="btn mini ghost" data-act="issue-for" data-id="' + x.customer.id + '">唤醒券</button></div></div>';
      }).join('') || emptyBlock('没有长期未到店客户');
    } else {
      body = r.pending.map(function (x) {
        var a = L.findCustomerById(db, x.invite.inviterId) || { name: '—' };
        var b = L.findCustomerById(db, x.invite.inviteeId) || { name: '—' };
        return '<div class="row"><div class="grow"><div class="name">' + esc(a.name) + ' → ' + esc(b.name) + '</div>' +
          '<div class="sub">' + esc(x.invite.rewardTitle) + '，结算日 ' + x.invite.settleAt + '</div></div></div>';
      }).join('') || emptyBlock('没有待结算');
    }
    openSheet('<h3>' + title + '（' + r[key].length + '）</h3>' + body +
      (key === 'pending' ? '<button class="btn block" data-act="settle-invites" style="margin-top:12px">立即结算</button>' : '') +
      '<button class="btn ghost block" data-act="close-sheet" style="margin-top:10px">关闭</button>');
  }

  function customerFormSheet(customer) {
    var c = customer || { name: '', phone: '', wechat: '', birthday: '', source: '到店', note: '', tags: [], profile: {} };
    var p = c.profile || {};
    openSheet('<h3>' + (customer ? '编辑客户' : '新增客户') + '</h3>' +
      '<div class="two-col"><div class="field"><label>称呼 *</label><input id="cfName" value="' + esc(c.name) + '" placeholder="张女士"></div>' +
      '<div class="field"><label>手机号 *</label><input id="cfPhone" type="tel" maxlength="11" value="' + esc(c.phone) + '"></div></div>' +
      '<div class="two-col"><div class="field"><label>微信</label><input id="cfWechat" value="' + esc(c.wechat) + '"></div>' +
      '<div class="field"><label>生日</label><input id="cfBirthday" type="date" value="' + esc(c.birthday) + '"></div></div>' +
      '<div class="two-col"><div class="field"><label>来源</label><select id="cfSource">' +
      ['到店', '朋友圈', '微信群', '老客推荐', '其他'].map(function (s) { return '<option' + (c.source === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="field"><label>标签（逗号分隔）</label><input id="cfTags" value="' + esc((c.tags || []).join('，')) + '" placeholder="怕痛，要求自然"></div></div>' +
      '<div style="font-size:12px;color:#958a80;margin:8px 0">专业档案（开单前必看）</div>' +
      '<div class="two-col"><div class="field"><label>孕期/哺乳</label><select id="pfPregnant">' +
      ['否', '是'].map(function (v) { return '<option' + (p.pregnant === v ? ' selected' : '') + '>' + v + '</option>'; }).join('') +
      '</select></div><div class="field"><label>经期</label><select id="pfPeriod">' +
      ['否', '是'].map(function (v) { return '<option' + (p.period === v ? ' selected' : '') + '>' + v + '</option>'; }).join('') +
      '</select></div></div>' +
      '<div class="field"><label>疾病史</label><input id="pfDisease" value="' + esc(p.disease || '') + '" placeholder="疤痕体质 / 糖尿病 / 无"></div>' +
      '<div class="field"><label>过敏史</label><input id="pfAllergy" value="' + esc(p.allergy || '') + '" placeholder="麻药、色料、酒精"></div>' +
      '<div class="field"><label>既往纹绣史</label><input id="pfHistory" value="' + esc(p.history || '') + '" placeholder="做过几次、什么颜色、有无红蓝眉"></div>' +
      '<div class="field"><label>皮肤状态</label><input id="pfSkin" value="' + esc(p.skin || '') + '" placeholder="油性 / 干性 / 敏感"></div>' +
      '<div class="field"><label>备注</label><textarea id="cfNote">' + esc(c.note || '') + '</textarea></div>' +
      '<button class="btn block" data-act="save-customer" data-id="' + (customer ? customer.id : '') + '">保存</button>');
  }

  function projectFormSheet(p) {
    var isNew = !p;
    p = p || { name: '', series: L.SERIES[1], price: 0, memberPrice: 0, type: 'main', note: '', active: true };
    openSheet('<h3>' + (isNew ? '新增项目' : '编辑项目') + '</h3>' +
      '<div class="field"><label>项目名称</label><input id="pfName" value="' + esc(p.name) + '"></div>' +
      '<div class="field"><label>所属系列</label><select id="pfSeries">' +
      L.SERIES.map(function (s) { return '<option' + (p.series === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="two-col"><div class="field"><label>原价</label><input id="pfPrice" type="number" value="' + p.price + '"></div>' +
      '<div class="field"><label>会员价</label><input id="pfMember" type="number" value="' + p.memberPrice + '"></div></div>' +
      '<div class="two-col"><div class="field"><label>类型</label><select id="pfType">' +
      '<option value="main"' + (p.type === 'main' ? ' selected' : '') + '>主项目</option>' +
      '<option value="addon"' + (p.type === 'addon' ? ' selected' : '') + '>加项</option></select></div>' +
      '<div class="field"><label>状态</label><select id="pfActive">' +
      '<option value="1"' + (p.active !== false ? ' selected' : '') + '>在售</option>' +
      '<option value="0"' + (p.active === false ? ' selected' : '') + '>停用</option></select></div></div>' +
      '<div class="field"><label>说明</label><input id="pfNote" value="' + esc(p.note || '') + '"></div>' +
      '<button class="btn block" data-act="save-project" data-id="' + (p.id || '') + '">保存</button>');
  }

  function workFormSheet(w) {
    var isNew = !w;
    w = w || { label: '', series: '', image: '' };
    openSheet('<h3>' + (isNew ? '新增作品' : '编辑作品') + '</h3>' +
      '<div class="field"><label>标题</label><input id="wfLabel" value="' + esc(w.label) + '" placeholder="丝难眉 · 柔难感"></div>' +
      '<div class="field"><label>所属系列</label><select id="wfSeries"><option value="">未指定</option>' +
      L.SERIES.map(function (s) { return '<option' + (w.series === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="field"><label>图片地址</label><input id="wfImage" value="' + esc(w.image) + '" placeholder="https://... 留空用占位色块"></div>' +
      '<button class="btn block" data-act="save-work" data-id="' + (w.id || '') + '">保存</button>');
  }

  function issueForSheet(customerId) {
    state.couponCustomerId = customerId;
    var customer = L.findCustomerById(db, customerId);
    openSheet('<h3>给 ' + esc(customer ? customer.name : '客户') + ' 发券</h3>' +
      '<div class="chips" style="margin-bottom:12px">' + L.COUPON_TEMPLATES.map(function (t) {
        return '<button class="chip ' + (state.couponTpl === t.id ? 'on' : '') + '" data-act="coupon-tpl" data-id="' + t.id + '">' + esc(t.title) + '</button>';
      }).join('') + '</div>' +
      '<div class="note">' + esc((L.templateById(state.couponTpl) || {}).desc || '') + '</div>' +
      '<div class="field" style="margin-top:12px"><label>有效期（天）</label><input id="cpDays" type="number" value="' + ((L.templateById(state.couponTpl) || {}).days || 30) + '"></div>' +
      '<button class="btn block" data-act="issue-coupon" data-id="' + customerId + '">生成</button>');
  }

  /* ================= 路由 ================= */
  function parseQuery(hash) {
    var idx = hash.indexOf('?');
    if (idx < 0) return {};
    var q = hash.slice(idx + 1);
    hash = hash.slice(0, idx);
    var out = {};
    q.split('&').forEach(function (kv) {
      var p = kv.split('=');
      out[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
    });
    return out;
  }
