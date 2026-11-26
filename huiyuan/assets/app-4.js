  function render(keepScroll) {
    reload();
    var y = keepScroll ? window.scrollY : 0;
    var projScroll = keepScroll ? ((document.getElementById('projList') || {}).scrollTop || 0) : 0;
    var raw = location.hash || '#/';
    var path = raw.split('?')[0];
    var q = parseQuery(raw);
    var html = '';

    if (path === '#/') html = pageEntry();
    else if (path === '#/shop') html = pageShop();
    else if (path === '#/price') html = pagePrice();
    else if (path === '#/me') html = pageMe();
    else if (path === '#/admin') {
      if (!isAdmin()) { html = pageEntry(); setTimeout(adminGate, 60); }
      else html = pageToday();
    }
    else if (path === '#/customers') html = pageCustomers();
    else if (path.indexOf('#/customer/') === 0) html = pageCustomer(path.split('/')[2]);
    else if (path === '#/order') html = pageOrder(q);
    else if (path === '#/coupons') html = pageCoupons(q);
    else if (path === '#/invites') html = pageInvites();
    else if (path === '#/projects') html = pageProjects();
    else if (path === '#/works') html = pageWorks();
    else if (path === '#/stats') html = pageStats();
    else if (path === '#/settings') html = pageSettings();
    else html = pageEntry();

    appEl.innerHTML = html;
    if (keepScroll) {
      window.scrollTo(0, y);
      var pl = document.getElementById('projList');
      if (pl) pl.scrollTop = projScroll;
    } else {
      window.scrollTo(0, 0);
    }

    // 以 ?ref= 进入时，记录邀请码待登录使用
    if (q.ref) {
      state.refCode = q.ref;
      var me = sessionCustomer();
      if (!me) setTimeout(loginSheet, 260);
    }
  }

  /* ================= 事件 ================= */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');
    if (act === 'none') return;

    if (act === 'go') {
      location.hash = el.getAttribute('data-to');
      return;
    }
    if (act === 'close-sheet') { closeSheet(); return; }
    if (act === 'copy') { copyText(el.getAttribute('data-text') || ''); return; }

    if (act === 'login') { loginSheet(); return; }

    if (act === 'login-submit') {
      var phone = (document.getElementById('lgPhone') || {}).value || '';
      phone = phone.replace(/\s/g, '');
      if (!/^1\d{10}$/.test(phone)) { toast('请填 11 位手机号'); return; }
      var name = (document.getElementById('lgName') || {}).value || '';
      var ref = (document.getElementById('lgRef') || {}).value || '';
      var exist = L.findCustomer(db, phone);
      if (exist) {
        setSession(exist.id);
        closeSheet();
        toast('欢迎回来，' + exist.name);
        render();
        return;
      }
      if (!name) { toast('首次来请填一个称呼'); return; }
      var invitedBy = '';
      if (ref) {
        var inviter = db.customers.filter(function (c) { return c.inviteCode === ref.trim(); })[0];
        if (inviter) invitedBy = inviter.id;
      }
      var c = L.addCustomer(db, { name: name, phone: phone, source: invitedBy ? '老客推荐' : '小程序', invitedBy: invitedBy });
      L.issueCoupon(db, c.id, 'referral', { source: 'auto' });
      setSession(c.id);
      closeSheet();
      toast('已建档，转介绍券放你券包了');
      render();
      return;
    }

    if (act === 'logout') { clearSession(); toast('已退出'); render(); return; }

    if (act === 'claim-new') {
      var me2 = sessionCustomer();
      if (!me2) { loginSheet(); return; }
      var has = db.orders.filter(function (o) { return o.customerId === me2.id && o.status === 'valid'; }).length;
      if (has) { toast('首单券仅限首次到店前领取'); return; }
      var old = db.coupons.filter(function (x) { return x.customerId === me2.id && x.templateId === 'new'; })[0];
      if (old) { toast('你已经领过了'); return; }
      L.issueCoupon(db, me2.id, 'new', { source: 'auto' });
      toast('新人券已放入券包');
      render();
      return;
    }

    if (act === 'admin-login') {
      var pwd = (document.getElementById('adminPwd') || {}).value || '';
      if (pwd !== cfg().password) { toast('密码不对'); return; }
      try { sessionStorage.setItem('bp_admin', '1'); } catch (e2) {}
      closeSheet();
      render();
      return;
    }

    if (act === 'new-customer') { customerFormSheet(null); return; }
    if (act === 'edit-customer') { customerFormSheet(L.findCustomerById(db, el.getAttribute('data-id'))); return; }

    if (act === 'save-customer') {
      var id = el.getAttribute('data-id');
      var nm = (document.getElementById('cfName') || {}).value || '';
      var ph = (document.getElementById('cfPhone') || {}).value || '';
      if (!nm.trim() || !ph.trim()) { toast('称呼和手机号都要填'); return; }
      var tags = ((document.getElementById('cfTags') || {}).value || '').split(/[，,、\s]+/).filter(Boolean);
      var profile = {
        pregnant: (document.getElementById('pfPregnant') || {}).value || '否',
        period: (document.getElementById('pfPeriod') || {}).value || '否',
        disease: (document.getElementById('pfDisease') || {}).value || '',
        allergy: (document.getElementById('pfAllergy') || {}).value || '',
        history: (document.getElementById('pfHistory') || {}).value || '',
        skin: (document.getElementById('pfSkin') || {}).value || ''
      };
      if (id) {
        var cc = L.findCustomerById(db, id);
        cc.name = nm.trim(); cc.phone = ph.trim();
        cc.wechat = (document.getElementById('cfWechat') || {}).value || '';
        cc.birthday = (document.getElementById('cfBirthday') || {}).value || '';
        cc.source = (document.getElementById('cfSource') || {}).value || cc.source;
        cc.tags = tags; cc.profile = profile;
        cc.note = (document.getElementById('cfNote') || {}).value || '';
        L.save(db);
      } else {
        var cnew = L.addCustomer(db, {
          name: nm.trim(), phone: ph.trim(),
          wechat: (document.getElementById('cfWechat') || {}).value || '',
          birthday: (document.getElementById('cfBirthday') || {}).value || '',
          source: (document.getElementById('cfSource') || {}).value || '到店',
          tags: tags, profile: profile,
          note: (document.getElementById('cfNote') || {}).value || ''
        });
        toast('已建档');
      }
      closeSheet();
      render();
      return;
    }

    if (act === 'open-reminder') { reminderSheet(el.getAttribute('data-key')); return; }

    if (act === 'makeup-done') {
      var oid = el.getAttribute('data-id');
      var od = db.orders.filter(function (x) { return x.id === oid; })[0];
      if (od) {
        od.makeupDone = true;
        od.makeupDoneAt = L.todayISO();
        L.save(db);
        closeSheet();
        toast('已标记补色完成');
        render();
      }
      return;
    }

    if (act === 'void-order') {
      var oid2 = el.getAttribute('data-id');
      if (!window.confirm('作废这一单？积分和券都会回退，邀请奖励取消。')) return;
      L.voidOrder(db, oid2);
      toast('已作废');
      render();
      return;
    }

    if (act === 'copy-makeup') {
      var od2 = db.orders.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0];
      var cu = od2 ? L.findCustomerById(db, od2.customerId) : null;
      if (!od2 || !cu) return;
      var txt = cu.name + '，你的' + (od2.items[0] ? od2.items[0].name : '项目') + '做完已经满一个月了，这个阶段可以来补色，把颜色和留色再调一遍。你想这周哪天方便？';
      copyText(txt);
      return;
    }

    if (act === 'issue-for') {
      state.couponCustomerId = el.getAttribute('data-id');
      state.couponTpl = 'wake';
      issueForSheet(state.couponCustomerId);
      return;
    }

    if (act === 'order-pick-customer') {
      state.order = null;
      ensureOrder(el.getAttribute('data-id'));
      location.hash = '#/order?c=' + el.getAttribute('data-id');
      render();
      return;
    }
    if (act === 'order-change-customer') {
      state.order = null;
      location.hash = '#/order';
      render();
      return;
    }
    if (act === 'order-reset') {
      state.order = null;
      state.orderSeries = '';
      render();
      toast('已清空本单');
      return;
    }
    if (act === 'order-series') {
      captureOrderInputs(true);
      state.orderSeries = el.getAttribute('data-s');
      render(true);
      return;
    }
    if (act === 'toggle-item') {
      captureOrderInputs(true);
      var pid = el.getAttribute('data-id');
      var proj = db.projects.filter(function (p) { return p.id === pid; })[0];
      if (!proj || !state.order) return;
      if (state.order.items[pid]) delete state.order.items[pid];
      else state.order.items[pid] = { projectId: proj.id, name: proj.name, series: proj.series, price: proj.price, memberPrice: proj.memberPrice, actual: proj.memberPrice };
      render(true);
      return;
    }
    if (act === 'del-item') {
      captureOrderInputs(true);
      delete state.order.items[el.getAttribute('data-id')];
      render(true);
      return;
    }
    if (act === 'pick-coupon') {
      captureOrderInputs(true);
      state.order.couponId = el.getAttribute('data-id');
      state.order.amountInput = '';
      render(true);
      return;
    }
    if (act === 'pay-method') {
      captureOrderInputs(true);
      state.order.payMethod = el.getAttribute('data-m');
      render(true);
      return;
    }

    if (act === 'submit-order') {
      var o = state.order;
      if (!o || !o.customerId) { toast('先选客户'); return; }
      var items = Object.keys(o.items).map(function (k) { return o.items[k]; });
      if (!items.length) { toast('至少选一个项目'); return; }
      var amountEl = document.getElementById('ordAmount');
      var amount = amountEl && amountEl.value !== '' ? Number(amountEl.value) : undefined;
      var makeupEl = document.getElementById('ordMakeup');
      var payload = {
        customerId: o.customerId,
        items: items,
        couponId: o.couponId,
        payMethod: o.payMethod,
        amount: amount,
        makeupDate: makeupEl ? makeupEl.value : o.makeupDate,
        tech: {
          brand: (document.getElementById('techBrand') || {}).value || '',
          colorNo: (document.getElementById('techColor') || {}).value || '',
          method: (document.getElementById('techMethod') || {}).value || '',
          colorCount: (document.getElementById('techCount') || {}).value || ''
        },
        note: (document.getElementById('ordNote') || {}).value || '',
        date: L.todayISO()
      };
      var res = L.createOrder(db, payload);
      if (!res.ok) { toast(res.msg); return; }
      state.order = null;
      state.orderSeries = '';
      toast('已开单，积分 +' + res.order.points + '，补色提醒 ' + res.order.makeupDate);
      location.hash = '#/customer/' + res.order.customerId;
      render();
      return;
    }

    if (act === 'coupon-pick-customer') {
      state.couponCustomerId = el.getAttribute('data-id');
      location.hash = '#/coupons';
      render();
      return;
    }
    if (act === 'coupon-tpl') {
      state.couponTpl = el.getAttribute('data-id');
      if (document.querySelector('.mask') && state.couponCustomerId) {
        issueForSheet(state.couponCustomerId);
      } else {
        render();
      }
      return;
    }
    if (act === 'coupon-change-customer') {
      state.couponCustomerId = '';
      location.hash = '#/coupons';
      render();
      return;
    }
    if (act === 'issue-coupon') {
      var cid = el.getAttribute('data-id') || state.couponCustomerId;
      if (!cid) { toast('先选客户'); return; }
      var days = Number((document.getElementById('cpDays') || {}).value) || undefined;
      var cp = L.issueCoupon(db, cid, state.couponTpl, { days: days, source: 'manual' });
      if (!cp) { toast('发券失败'); return; }
      closeSheet();
      var cust = L.findCustomerById(db, cid);
      openSheet('<h3>券已生成</h3>' +
        couponCard(cp) +
        '<div class="note" style="margin-top:10px">把下面这段发给 ' + esc(cust.name) + '：</div>' +
        '<div class="note" style="background:#fff;border:1px solid #eae2d8;margin-top:8px">' + esc(cust.name) + '，给你留了一张「' + cp.title + '」，' + cp.desc + '，有效期到 ' + cp.expireAt + '，来之前微信说一声就行。</div>' +
        '<button class="btn block" data-act="copy" data-text="' + esc(cust.name + '，给你留了一张「' + cp.title + '」，' + cp.desc + '，有效期到 ' + cp.expireAt + '，来之前微信说一声就行。') + '" style="margin-top:12px">复制这段话</button>' +
        '<button class="btn ghost block" data-act="close-sheet" style="margin-top:8px">关闭</button>');
      render();
      return;
    }

    if (act === 'settle-invites') {
      var s = L.settleInvites(db);
      closeSheet();
      toast(s.length ? '已结算 ' + s.length + ' 笔' : '暂无到期结算');
      render();
      return;
    }

    if (act === 'edit-project') {
      var pid2 = el.getAttribute('data-id');
      projectFormSheet(pid2 ? db.projects.filter(function (p) { return p.id === pid2; })[0] : null);
      return;
    }
    if (act === 'save-project') {
      var pid3 = el.getAttribute('data-id');
      var pd = {
        name: (document.getElementById('pfName') || {}).value || '',
        series: (document.getElementById('pfSeries') || {}).value || L.SERIES[1],
        price: Number((document.getElementById('pfPrice') || {}).value) || 0,
        memberPrice: Number((document.getElementById('pfMember') || {}).value) || 0,
        type: (document.getElementById('pfType') || {}).value || 'main',
        note: (document.getElementById('pfNote') || {}).value || '',
        active: (document.getElementById('pfActive') || {}).value === '1'
      };
      if (!pd.name.trim()) { toast('项目名不能空'); return; }
      if (pid3) {
        var pp = db.projects.filter(function (p) { return p.id === pid3; })[0];
        Object.keys(pd).forEach(function (k) { pp[k] = pd[k]; });
      } else {
        pd.id = L.uid('p');
        db.projects.push(pd);
      }
      L.save(db);
      closeSheet();
      toast('已保存');
      render();
      return;
    }

    if (act === 'edit-work') {
      var wid = el.getAttribute('data-id');
      workFormSheet(wid ? db.works.filter(function (w) { return w.id === wid; })[0] : null);
      return;
    }
    if (act === 'save-work') {
      var wid2 = el.getAttribute('data-id');
      var wd = {
        label: (document.getElementById('wfLabel') || {}).value || '',
        series: (document.getElementById('wfSeries') || {}).value || '',
        image: (document.getElementById('wfImage') || {}).value || ''
      };
      if (!wd.label.trim()) { toast('标题不能空'); return; }
      if (wid2) {
        var ww = db.works.filter(function (w) { return w.id === wid2; })[0];
        ww.label = wd.label; ww.series = wd.series; ww.image = wd.image;
      } else {
        wd.id = L.uid('w');
        db.works.push(wd);
      }
      L.save(db);
      closeSheet();
      toast('已保存');
      render();
      return;
    }

    if (act === 'view-work') {
      var wid3 = el.getAttribute('data-id');
      var w3 = db.works.filter(function (w) { return w.id === wid3; })[0];
      if (!w3) return;
      openSheet('<h3>' + esc(w3.label) + '</h3>' +
        (w3.image ? '<img src="' + esc(w3.image) + '" style="width:100%;border-radius:12px">' : '<div style="height:220px;border-radius:12px;background:linear-gradient(150deg,#ead9cf,#d9c2b5);display:flex;align-items:center;justify-content:center;color:#8a5044;font-size:13px">作品图待上传</div>') +
        '<div style="font-size:12px;color:#958a80;margin-top:10px">' + esc(w3.series || '') + '</div>' +
        '<button class="btn ghost block" data-act="close-sheet" style="margin-top:14px">关闭</button>');
      return;
    }

    if (act === 'save-settings') {
      var cc2 = cfg();
      cc2.shopName = (document.getElementById('setShop') || {}).value || cc2.shopName;
      cc2.slogan = (document.getElementById('setSlogan') || {}).value || cc2.slogan;
      cc2.masterWechat = (document.getElementById('setWechat') || {}).value || '';
      cc2.password = (document.getElementById('setPwd') || {}).value || cc2.password;
      cc2.pointsRate = Number((document.getElementById('setRate') || {}).value) || 100;
      cc2.makeupDays = Number((document.getElementById('setMakeup') || {}).value) || 30;
      cc2.settleDays = Number((document.getElementById('setSettle') || {}).value) || 7;
      L.save(db);
      toast('设置已保存');
      render();
      return;
    }

    if (act === 'export-json') {
      download('会员数据备份_' + L.todayISO() + '.json', L.exportJSON(db), 'application/json');
      return;
    }
    if (act === 'export-customers') {
      download('客户表_' + L.todayISO() + '.csv', '\ufeff' + L.exportCustomersCSV(db), 'text/csv');
      return;
    }
    if (act === 'export-orders') {
      download('订单表_' + L.todayISO() + '.csv', '\ufeff' + L.exportOrdersCSV(db), 'text/csv');
      return;
    }
    if (act === 'import-json') {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = function () {
        var f = input.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          var r = L.importJSON(String(reader.result));
          if (!r.ok) { toast(r.msg); return; }
          toast('导入成功');
          render();
        };
        reader.readAsText(f);
      };
      input.click();
      return;
    }
    if (act === 'reset-demo') {
      if (!window.confirm('恢复示例数据会覆盖当前所有客户与订单，确定吗？')) return;
      L.resetDB(false);
      toast('已恢复示例数据');
      render();
      return;
    }
    if (act === 'clear-data') {
      if (!window.confirm('清空所有客户、订单、券和积分，不可恢复。建议先导出备份。确定吗？')) return;
      L.clearAll();
      clearSession();
      toast('已清空');
      render();
      return;
    }
  });

  function download(filename, content, type) {
    var blob = new Blob([content], { type: type + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }

  /* 输入框实时搜索 */
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'custSearch') {
      state.q = t.value;
      var box = document.getElementById('custList');
      if (box) box.innerHTML = customerListHtml(filterCustomers());
      return;
    }
    if (t.id === 'ordCust') {
      state.q = t.value;
      var box2 = document.getElementById('ordCustList');
      if (box2) box2.innerHTML = orderCustomerList(t.value);
      return;
    }
    if (t.id === 'cpCust') {
      var box3 = document.getElementById('cpList');
      if (box3) box3.innerHTML = orderCustomerList(t.value, 'coupon-pick-customer');
      return;
    }
  });

  window.addEventListener('hashchange', function () {
    state.q = '';
    render();
  });

  // 启动：自动结算已到期的老带新奖励
  L.settleInvites(db);
  render();
