  function pageCustomers() {
    var list = filterCustomers();
    return topbar('客户', null, '<button class="act" data-act="new-customer">新增</button>') + '<div class="page">' +
      '<div class="field" style="margin-bottom:12px"><input id="custSearch" placeholder="搜姓名或手机号后四位" value="' + esc(state.q) + '" data-act="none"></div>' +
      '<div id="custList">' + customerListHtml(list) + '</div>' +
      '</div>' + tabbar('admin', '#/customers');
  }

  function filterCustomers() {
    var q = (state.q || '').trim();
    var list = db.customers.slice().sort(function (a, b) {
      return (b.lastVisit || '') > (a.lastVisit || '') ? 1 : -1;
    });
    if (!q) return list;
    return list.filter(function (c) {
      return c.name.indexOf(q) >= 0 || (c.phone || '').slice(-4).indexOf(q) >= 0 || (c.phone || '').indexOf(q) >= 0;
    });
  }

  function customerListHtml(list) {
    if (!list.length) return '<div class="card">' + emptyBlock('没有匹配的客户') + '</div>';
    return '<div class="card"><div class="list">' + list.map(function (c) {
      var last = c.lastVisit ? '最近 ' + fmtDate(c.lastVisit) : '还没到店';
      var tags = (c.tags || []).slice(0, 2).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
      return '<div class="row" data-act="go" data-to="#/customer/' + c.id + '">' +
        '<div class="avatar">' + esc((c.name || '客').slice(0, 1)) + '</div>' +
        '<div class="grow"><div class="name">' + esc(c.name) + '　<span class="sub" style="display:inline">' + esc((c.phone || '').slice(-4)) + '</span></div>' +
        '<div class="sub">' + last + '　到店 ' + c.visits + ' 次　¥' + L.money(c.totalSpent) + '</div></div>' +
        '<div class="end">' + tags + '</div></div>';
    }).join('') + '</div></div>';
  }

  function pageCustomer(id) {
    var c = L.findCustomerById(db, id);
    if (!c) return topbar('客户', '#/customers') + '<div class="page">' + emptyBlock('客户不存在') + '</div>';
    var pts = L.pointsBalance(db, c.id);
    var orders = db.orders.filter(function (o) { return o.customerId === c.id; }).sort(function (a, b) { return a.date > b.date ? -1 : 1; });
    var cps = L.couponsOf(db, c.id);
    var ptsLog = db.points.filter(function (p) { return p.customerId === c.id; }).sort(function (a, b) { return a.at > b.at ? -1 : 1; });
    var pro = c.profile || {};

    var orderHtml = orders.length ? orders.map(function (o) {
      var st = o.status === 'valid' ? '' : '<span class="tag danger">' + (o.status === 'void' ? '作废' : '退款') + '</span>';
      var makeup = o.status === 'valid' ? (o.makeupDone ? '<span class="tag ok">已补色</span>' : '<span class="tag warn">待补色 ' + fmtDate(o.makeupDate) + '</span>') : '';
      return '<div class="card" style="padding:13px 14px">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
        '<div style="font-size:13.5px;font-weight:500">' + fullDate(o.date) + '　' + esc(o.no) + '</div>' +
        '<div style="font-size:14px;font-weight:600;color:#8a5044">¥' + L.money(o.amount) + '</div></div>' +
        '<div style="font-size:12.5px;color:#574d46;margin-top:6px">' + o.items.map(function (i) { return esc(i.name); }).join(' / ') + '</div>' +
        '<div style="font-size:11.5px;color:#958a80;margin-top:6px">' + esc(o.payMethod) + '　积分 +' + o.points + (o.couponTitle ? '　券：' + esc(o.couponTitle) : '') + '</div>' +
        '<div style="margin-top:8px">' + st + makeup + '</div>' +
        (o.tech && (o.tech.colorNo || o.tech.brand) ? '<div style="font-size:11.5px;color:#958a80;margin-top:6px">' + esc([o.tech.brand, o.tech.colorNo, o.tech.method].filter(Boolean).join(' · ')) + '</div>' : '') +
        '<div style="margin-top:8px;display:flex;gap:8px">' +
        (o.status === 'valid' && !o.makeupDone ? '<button class="btn mini ghost" data-act="makeup-done" data-id="' + o.id + '">标记已补色</button>' : '') +
        (o.status === 'valid' ? '<button class="btn mini danger" data-act="void-order" data-id="' + o.id + '">作废</button>' : '') +
        '</div></div>';
    }).join('') : '<div class="card">' + emptyBlock('还没有服务记录') + '</div>';

    return topbar('客户档案', '#/customers', '<button class="act" data-act="edit-customer" data-id="' + c.id + '">编辑</button>') + '<div class="page">' +
      '<div class="card">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
      '<div class="avatar" style="width:46px;height:46px;font-size:17px">' + esc(c.name.slice(0, 1)) + '</div>' +
      '<div style="flex:1"><div style="font-size:17px;font-weight:600">' + esc(c.name) + '</div>' +
      '<div style="font-size:12px;color:#958a80;margin-top:2px">' + esc(c.phone) + (c.wechat ? '　微信 ' + esc(c.wechat) : '') + '</div></div>' +
      '<div style="text-align:right"><div style="font-size:19px;font-weight:600">' + pts + '</div><div style="font-size:10.5px;color:#958a80">积分</div></div></div>' +
      '<div style="margin-top:12px">' + (c.tags || []).map(function (t) { return '<span class="tag accent">' + esc(t) + '</span>'; }).join('') +
      '<span class="tag">' + esc(c.source || '到店') + '</span></div>' +
      '<div class="bar"><span style="width:' + Math.min(100, (c.visits || 0) * 20) + '%"></span></div>' +
      '<div style="font-size:11.5px;color:#958a80;margin-top:6px">到店 ' + c.visits + ' 次　累计 ¥' + L.money(c.totalSpent) + '　最近 ' + (c.lastVisit || '—') + '</div>' +
      '</div>' +

      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">' +
      '<button class="btn dark" data-act="go" data-to="#/order?c=' + c.id + '">给她开单</button>' +
      '<button class="btn ghost" data-act="issue-for" data-id="' + c.id + '">发一张券</button>' +
      '</div>' +

      '<div class="section-title"><h2>基础信息</h2><span></span></div>' +
      '<div class="card">' +
      '<div class="kv"><div class="k">生日</div><div class="v">' + (c.birthday || '—') + '</div></div>' +
      '<div class="kv"><div class="k">来源</div><div class="v">' + esc(c.source || '—') + '</div></div>' +
      '<div class="kv"><div class="k">建档</div><div class="v">' + (c.createdAt || '—') + '</div></div>' +
      '<div class="kv"><div class="k">邀请码</div><div class="v">' + esc(c.inviteCode) + (c.invitedBy ? '（由 ' + esc((L.findCustomerById(db, c.invitedBy) || {}).name || '老客') + ' 推荐）' : '') + '</div></div>' +
      '<div class="kv"><div class="k">备注</div><div class="v">' + esc(c.note || '—') + '</div></div>' +
      '</div>' +

      '<div class="section-title"><h2>专业档案</h2><span>开单前必看</span></div>' +
      '<div class="card">' +
      '<div class="kv"><div class="k">孕期/哺乳</div><div class="v">' + esc(pro.pregnant || '—') + '</div></div>' +
      '<div class="kv"><div class="k">疾病史</div><div class="v">' + esc(pro.disease || '—') + '</div></div>' +
      '<div class="kv"><div class="k">经期</div><div class="v">' + esc(pro.period || '—') + '</div></div>' +
      '<div class="kv"><div class="k">过敏史</div><div class="v">' + esc(pro.allergy || '—') + '</div></div>' +
      '<div class="kv"><div class="k">既往纹绣</div><div class="v">' + esc(pro.history || '—') + '</div></div>' +
      '<div class="kv"><div class="k">皮肤</div><div class="v">' + esc(pro.skin || '—') + '</div></div>' +
      '</div>' +

      '<div class="section-title"><h2>服务记录</h2><span>' + orders.length + ' 单</span></div>' +
      orderHtml +

      '<div class="section-title"><h2>券</h2><span>' + cps.length + ' 张</span></div>' +
      (cps.length ? cps.map(function (x) { return couponCard(x); }).join('') : '<div class="card">' + emptyBlock('暂无券') + '</div>') +

      '<div class="section-title"><h2>积分流水</h2><span>余额 ' + pts + '</span></div>' +
      '<div class="card">' + (ptsLog.length ? ptsLog.map(function (p) {
        return '<div class="row"><div class="grow"><div class="name" style="font-size:13.5px">' + esc(p.reason) + '</div>' +
          '<div class="sub">' + esc(p.at) + '</div></div>' +
          '<div class="end" style="color:' + (p.delta > 0 ? '#4c7a63' : '#a4453c') + '">' + (p.delta > 0 ? '+' : '') + p.delta + '</div></div>';
      }).join('') : emptyBlock('暂无积分记录')) + '</div>' +
      '</div>' + tabbar('admin', '#/customers');
  }

  /* ---------- 开单 ---------- */
  function ensureOrder(customerId) {
    if (state.order && state.order.customerId === customerId && state.order.items) return state.order;
    state.order = {
      customerId: customerId || '',
      items: {},
      couponId: '',
      payMethod: '微信',
      amountInput: '',
      tech: { brand: '', colorNo: '', method: '', colorCount: '' },
      makeupDate: L.addDays(L.todayISO(), (cfg().makeupDays || 30)),
      note: ''
    };
    return state.order;
  }

  function captureOrderInputs(skipAmount) {
    if (!state.order) return;
    var a = document.getElementById('ordAmount');
    if (a && !skipAmount) state.order.amountInput = a.value;
    var mk = document.getElementById('ordMakeup');
    if (mk) state.order.makeupDate = mk.value;
    var nb = document.getElementById('ordNote');
    if (nb) state.order.note = nb.value;
    var b = document.getElementById('techBrand');
    if (b) state.order.tech.brand = b.value;
    var cl = document.getElementById('techColor');
    if (cl) state.order.tech.colorNo = cl.value;
    var mt = document.getElementById('techMethod');
    if (mt) state.order.tech.method = mt.value;
    var ct = document.getElementById('techCount');
    if (ct) state.order.tech.colorCount = ct.value;
  }

  function pageOrder(query) {
    var cid = query.c || '';
    var o = ensureOrder(cid);
    var customer = cid ? L.findCustomerById(db, cid) : null;
    var seriesChips = L.SERIES.map(function (s, i) {
      var on = state.orderSeries === s;
      return '<button class="chip ' + (on ? 'on' : '') + '" data-act="order-series" data-s="' + esc(s) + '">' + esc(s.replace(/（.*?）/g, '')) + '</button>';
    }).join('');

    var projList = db.projects.filter(function (p) {
      if (p.active === false) return false;
      if (state.orderSeries && p.series !== state.orderSeries) return false;
      return true;
    });

    var items = Object.keys(o.items).map(function (k) { return o.items[k]; });
    var receivable = items.reduce(function (s, it) { return s + (Number(it.actual) || 0); }, 0);

    var coupons = customer ? L.couponsOf(db, customer.id, 'unused') : [];
    var selectedCoupon = coupons.filter(function (x) { return x.id === o.couponId; })[0] || null;
    var deduct = L.couponDeduct(selectedCoupon, receivable);
    var suggest = Math.max(0, receivable - deduct);

    return topbar('开单', '#/admin', '<button class="act" data-act="order-reset">重来</button>') + '<div class="page">' +
      // 客户
      '<div class="section-title"><h2>1 选客户</h2><span></span></div>' +
      (customer ?
        '<div class="card" style="padding:13px 14px;display:flex;align-items:center;gap:10px">' +
        '<div class="avatar">' + esc(customer.name.slice(0, 1)) + '</div>' +
        '<div class="grow" style="flex:1"><div style="font-size:15px;font-weight:600">' + esc(customer.name) + '</div>' +
        '<div class="sub" style="font-size:11.5px;color:#958a80">' + esc(customer.phone) + '　到店 ' + customer.visits + ' 次</div></div>' +
        '<button class="btn mini ghost" data-act="order-change-customer">换人</button></div>'
        :
        '<div class="card">' +
        '<div class="field"><label>搜客户</label><input id="ordCust" placeholder="输入姓名或手机号后四位" value="' + esc(state.q) + '"></div>' +
        '<div id="ordCustList">' + orderCustomerList(state.q) + '</div>' +
        '<button class="btn ghost block" data-act="new-customer">没有，建档</button></div>') +

      // 项目
      '<div class="section-title"><h2>2 选项目</h2><span>' + items.length + ' 项已选</span></div>' +
      '<div class="card">' +
      '<div class="chips" style="margin-bottom:10px">' +
      '<button class="chip ' + (!state.orderSeries ? 'on' : '') + '" data-act="order-series" data-s="">全部</button>' + seriesChips + '</div>' +
      '<div style="max-height:320px;overflow-y:auto" id="projList">' + projList.map(function (p) {
        var on = !!o.items[p.id];
        return '<div class="proj" data-act="toggle-item" data-id="' + p.id + '">' +
          '<div class="check ' + (on ? 'on' : '') + '">' + (on ? '✓' : '') + '</div>' +
          '<div class="grow"><div class="pname">' + esc(p.name) + '</div>' +
          '<div class="pnote">' + esc(p.series.replace(/（.*?）/g, '')) + (p.type === 'addon' ? ' · 加项' : '') + '</div></div>' +
          '<div class="price"><b>¥' + L.money(p.memberPrice) + '</b>' +
          (p.price > p.memberPrice ? '<span class="old">¥' + L.money(p.price) + '</span>' : '') + '</div></div>';
      }).join('') + '</div></div>' +

      // 明细
      (items.length ? '<div class="card"><div class="list">' + items.map(function (it) {
        return '<div class="row"><div class="grow"><div class="name" style="font-size:13.5px">' + esc(it.name) + '</div></div>' +
          '<div class="end">¥' + L.money(it.actual) + '</div>' +
          '<button class="btn mini ghost" data-act="del-item" data-id="' + it.projectId + '">移除</button></div>';
      }).join('') + '</div>' +
        '<div style="text-align:right;font-size:13px;color:#574d46;margin-top:10px">项目合计 <b style="font-size:16px">¥' + L.money(receivable) + '</b></div></div>' : '') +

      // 券与收款
      '<div class="section-title"><h2>3 用券与收款</h2><span></span></div>' +
      '<div class="card">' +
      (customer && coupons.length ? '<div class="field"><label>可用券</label><div class="chips">' +
        '<button class="chip ' + (!o.couponId ? 'on' : '') + '" data-act="pick-coupon" data-id="">不用券</button>' +
        coupons.map(function (x) {
          return '<button class="chip ' + (o.couponId === x.id ? 'on' : '') + '" data-act="pick-coupon" data-id="' + x.id + '">' + esc(x.title) + '</button>';
        }).join('') + '</div>' +
        (selectedCoupon ? '<div class="hint">本单可抵 ¥' + L.money(deduct) + '，券使用后作废</div>' : '') + '</div>'
        : '<div class="hint" style="font-size:12px;color:#958a80;margin-bottom:10px">该客户暂无可用券，可在开单后到发券页补发</div>') +

      '<div class="field"><label>收款方式</label><div class="chips">' +
      ['微信', '支付宝', '现金', '其他'].map(function (m) {
        return '<button class="chip ' + (o.payMethod === m ? 'on' : '') + '" data-act="pay-method" data-m="' + m + '">' + m + '</button>';
      }).join('') + '</div></div>' +

      '<div class="two-col">' +
      '<div class="field"><label>应收</label><input value="¥' + L.money(suggest) + '" disabled></div>' +
      '<div class="field"><label>实收（可改）</label><input id="ordAmount" type="number" value="' + (o.amountInput ? o.amountInput : suggest) + '" placeholder="' + suggest + '"></div>' +
      '</div>' +
      '<div class="field"><label>补色日期</label><input id="ordMakeup" type="date" value="' + esc(o.makeupDate) + '"></div>' +
      '</div>' +

      // 技术信息
      '<details class="card" style="padding:0">' +
      '<summary style="padding:14px 16px;font-size:14px;font-weight:500;cursor:pointer">技术记录（色料、色号、手法，可后补）</summary>' +
      '<div style="padding:0 16px 16px">' +
      '<div class="two-col"><div class="field"><label>色料品牌</label><input id="techBrand" value="' + esc(o.tech.brand) + '" placeholder="例如 德国进口"></div>' +
      '<div class="field"><label>色号</label><input id="techColor" value="' + esc(o.tech.colorNo) + '" placeholder="例如 03 深棕 / 05 灰棕"></div></div>' +
      '<div class="two-col"><div class="field"><label>手法</label><select id="techMethod">' +
      ['', '机器', '手工', '烟飞针'].map(function (m) { return '<option value="' + m + '"' + (o.tech.method === m ? ' selected' : '') + '>' + (m || '未填') + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="field"><label>颜色数量</label><input id="techCount" value="' + esc(o.tech.colorCount) + '" placeholder="例如 5"></div></div>' +
      '<div class="field"><label>备注</label><textarea id="ordNote" placeholder="麻药、怕痛、特殊要求">' + esc(o.note) + '</textarea></div>' +
      '</div></details>' +

      '<button class="btn block dark" data-act="submit-order" style="margin-top:6px">确认开单</button>' +
      '<div class="note" style="margin-top:10px">提交后自动：记服务档案、发积分（每 100 元 1 分）、核销券、生成补色提醒、被邀请首单启动 7 天奖励结算。</div>' +
      '</div>' + tabbar('admin', '#/order');
  }

  function orderCustomerList(q, act) {
    act = act || 'order-pick-customer';
    var list = filterByQ(q).slice(0, 6);
    if (!list.length) return '<div class="empty" style="padding:16px">没搜到，点下面建档</div>';
    return '<div class="list">' + list.map(function (c) {
      return '<div class="row" data-act="' + act + '" data-id="' + c.id + '">' +
        '<div class="avatar">' + esc(c.name.slice(0, 1)) + '</div>' +
        '<div class="grow"><div class="name">' + esc(c.name) + '</div><div class="sub">' + esc((c.phone || '').slice(-4)) + '　到店 ' + c.visits + ' 次</div></div>' +
        '<div class="end">选择</div></div>';
    }).join('') + '</div>';
  }

  function filterByQ(q) {
    var s = (q || '').trim();
    var list = db.customers;
    if (!s) return list;
    return list.filter(function (c) {
      return c.name.indexOf(s) >= 0 || (c.phone || '').indexOf(s) >= 0;
    });
  }

  /* ---------- 发券 ---------- */
  function pageCoupons(query) {
    var cid = query.c || state.couponCustomerId || '';
    var customer = cid ? L.findCustomerById(db, cid) : null;
    if (!state.couponTpl) state.couponTpl = 'factor';

    return topbar('发券', '#/admin') + '<div class="page">' +
      '<div class="section-title"><h2>1 选客户</h2><span></span></div>' +
      (customer ? '<div class="card" style="padding:13px 14px;display:flex;align-items:center;gap:10px">' +
        '<div class="avatar">' + esc(customer.name.slice(0, 1)) + '</div>' +
        '<div style="flex:1"><div style="font-size:15px;font-weight:600">' + esc(customer.name) + '</div>' +
        '<div style="font-size:11.5px;color:#958a80">' + esc(customer.phone) + '</div></div>' +
        '<button class="btn mini ghost" data-act="coupon-change-customer">换人</button></div>'
        : '<div class="card"><input id="cpCust" placeholder="搜姓名或手机号" style="width:100%;border:1px solid #eae2d8;border-radius:10px;padding:11px 12px;font-size:14px">' +
        '<div id="cpList" style="margin-top:10px">' + orderCustomerList('', 'coupon-pick-customer') + '</div></div>') +

      '<div class="section-title"><h2>2 选券</h2><span></span></div>' +
      '<div class="card"><div class="chips">' + L.COUPON_TEMPLATES.map(function (t) {
        return '<button class="chip ' + (state.couponTpl === t.id ? 'on' : '') + '" data-act="coupon-tpl" data-id="' + t.id + '">' + esc(t.title) + '</button>';
      }).join('') + '</div>' +
      '<div class="note" style="margin-top:12px">' + esc((L.templateById(state.couponTpl) || {}).desc || '') + '</div>' +
      '<div class="field" style="margin-top:12px"><label>有效期（天）</label><input id="cpDays" type="number" value="' + ((L.templateById(state.couponTpl) || {}).days || 30) + '"></div>' +
      '<button class="btn block" data-act="issue-coupon">生成这张券</button>' +
      '</div>' +

      '<div class="section-title"><h2>3 已发的券</h2><span>' + db.coupons.length + ' 张</span></div>' +
      '<div class="card">' + (db.coupons.length ? '<div class="list">' + db.coupons.slice().sort(function (a, b) { return b.issuedAt > a.issuedAt ? 1 : -1; }).slice(0, 20).map(function (k) {
        var cu = L.findCustomerById(db, k.customerId) || { name: '—' };
        var st = k.status === 'unused' ? '<span class="tag ok">可用</span>' : (k.status === 'used' ? '<span class="tag">已用</span>' : '<span class="tag danger">过期</span>');
        return '<div class="row"><div class="grow"><div class="name" style="font-size:13.5px">' + esc(k.title) + '　' + esc(cu.name) + '</div>' +
          '<div class="sub">发 ' + k.issuedAt + '　到期 ' + k.expireAt + '</div></div><div class="end">' + st + '</div></div>';
      }).join('') + '</div>' : emptyBlock('还没有发过券')) + '</div>' +
      '</div>' + tabbar('admin', '#/settings');
  }

  /* ---------- 邀请 ---------- */
  function pageInvites() {
    var list = db.invites.slice().sort(function (a, b) { return b.createdAt > a.createdAt ? 1 : -1; });
    var due = L.reminders(db).pending.length;
    return topbar('老带新', '#/admin', due ? '<button class="act" data-act="settle-invites">结算 ' + due + ' 笔</button>' : '') + '<div class="page">' +
      '<div class="note">只做一级奖励：老客带来新客，新客首单完成满 ' + (cfg().settleDays || 7) + ' 天后自动到账。新客首单立减 300 元。</div>' +
      (list.length ? '<div class="card" style="margin-top:12px"><div class="list">' + list.map(function (i) {
        var a = L.findCustomerById(db, i.inviterId) || { name: '—' };
        var b = L.findCustomerById(db, i.inviteeId) || { name: '—' };
        var st = i.status === 'settled' ? '<span class="tag ok">已到账</span>' : (i.status === 'canceled' ? '<span class="tag danger">已取消</span>' : '<span class="tag warn">待结算 ' + i.settleAt + '</span>');
        return '<div class="row"><div class="grow"><div class="name">' + esc(a.name) + ' → ' + esc(b.name) + '</div>' +
          '<div class="sub">首单 ¥' + L.money(i.amount) + '　奖励：' + esc(i.rewardTitle || '') + '</div></div>' +
          '<div class="end">' + st + '</div></div>';
      }).join('') + '</div></div>' : '<div class="card" style="margin-top:12px">' + emptyBlock('还没有邀请记录') + '</div>') +
      '<div class="section-title"><h2>怎么运转</h2><span></span></div>' +
      '<div class="card"><div class="kv"><div class="k">档位</div><div class="v">3000 以下：修复因子套装<br>3000 至 8000：免费补色<br>8000 以上：升级券</div></div>' +
      '<div class="kv"><div class="k">防作弊</div><div class="v">同手机号不重复结算；首单 7 天内退款取消奖励</div></div></div>' +
      '</div>' + tabbar('admin', '#/settings');
  }

  /* ---------- 项目 ---------- */
  function pageProjects() {
    var groups = L.SERIES.map(function (s) {
      var list = db.projects.filter(function (p) { return p.series === s; });
      if (!list.length) return '';
      return '<div class="section-title"><h2>' + esc(s) + '</h2><span>' + list.length + ' 项</span></div>' +
        '<div class="card">' + list.map(function (p) {
          return '<div class="row" data-act="edit-project" data-id="' + p.id + '">' +
            '<div class="grow"><div class="name" style="font-size:13.5px">' + esc(p.name) + '</div>' +
            '<div class="sub">原价 ¥' + L.money(p.price) + '　会员价 ¥' + L.money(p.memberPrice) + (p.type === 'addon' ? '　加项' : '') + '</div></div>' +
            '<div class="end">' + (p.active === false ? '<span class="tag">已停用</span>' : '') + '›</div></div>';
        }).join('') + '</div>';
    }).join('');
    return topbar('项目与价目', '#/settings', '<button class="act" data-act="edit-project" data-id="">新增</button>') +
      '<div class="page">' + groups + '</div>' + tabbar('admin', '#/settings');
  }

  /* ---------- 作品 ---------- */
