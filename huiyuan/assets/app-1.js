  var L = window.MemberLogic;
  var db = L.getDB();
  var appEl = document.getElementById('app');
  var SESSION_KEY = 'bp_session_customer';

  var state = {
    q: '',
    order: null,
    couponCustomerId: '',
    sheet: null
  };

  function reload() { db = L.getDB(); }
  function cfg() { return db.cfg; }

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function sessionCustomer() {
    var id = null;
    try { id = localStorage.getItem(SESSION_KEY); } catch (e) { id = null; }
    return id ? L.findCustomerById(db, id) : null;
  }

  function setSession(id) {
    try { localStorage.setItem(SESSION_KEY, id); } catch (e) {}
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('on'); }, 2400);
  }

  function openSheet(html) {
    closeSheet();
    var mask = document.createElement('div');
    mask.className = 'mask';
    mask.innerHTML = '<div class="sheet">' + html + '</div>';
    mask.addEventListener('click', function (e) { if (e.target === mask) closeSheet(); });
    document.body.appendChild(mask);
  }

  function closeSheet() {
    var arr = document.querySelectorAll('.mask');
    for (var i = 0; i < arr.length; i++) arr[i].remove();
  }

  function copyText(text) {
    var done = function () { toast('已复制，去微信粘贴发送'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('复制失败，请手动选择文字'); }
      ta.remove();
    }
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    var s = String(iso).slice(0, 10);
    var parts = s.split('-');
    if (parts.length !== 3) return s;
    return parts[1] + '-' + parts[2];
  }

  function fullDate(iso) {
    if (!iso) return '—';
    return String(iso).slice(0, 10);
  }

  function icon(name) {
    var p = {
      home: '<path d="M3 10.5L12 3l9 7.5V21H3z"/>',
      list: '<path d="M4 6h16M4 12h16M4 18h10"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'
    };
    return '<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (p[name] || '') + '</svg>';
  }

  function topbar(title, backTo, rightHtml) {
    return '<div class="topbar">' +
      (backTo !== null ? '<button class="back" data-act="go" data-to="' + backTo + '">‹</button>' : '') +
      '<div class="title">' + esc(title) + '</div>' +
      (rightHtml || '') +
      '</div>';
  }

  function tabbar(area, active) {
    var shopTabs = [
      ['#/shop', '店面', 'home'],
      ['#/price', '价目', 'list'],
      ['#/me', '我的', 'user']
    ];
    var adminTabs = [
      ['#/admin', '今日', 'clock'],
      ['#/customers', '客户', 'user'],
      ['#/order', '开单', 'plus'],
      ['#/settings', '设置', 'gear']
    ];
    var tabs = area === 'admin' ? adminTabs : shopTabs;
    return '<div class="tabbar">' + tabs.map(function (t) {
      var on = (t[0] === active) ? ' on' : '';
      return '<a href="' + t[0] + '" class="' + on.trim() + '">' + icon(t[2]) + '<span>' + t[1] + '</span></a>';
    }).join('') + '</div>';
  }

  function emptyBlock(text) {
    return '<div class="empty"><div class="big">·</div>' + esc(text) + '</div>';
  }

  function couponCard(c, opts) {
    opts = opts || {};
    var left, unit;
    if (c.kind === 'cash') { left = '¥' + (c.value || 0); unit = '立减'; }
    else if (c.kind === 'discount') { left = (Math.round((c.value || 1) * 10 * 10) / 10); unit = '折'; }
    else { left = '权益'; unit = c.title.indexOf('补色') >= 0 ? '补色' : (c.title.indexOf('修复') >= 0 ? '修复' : '礼遇'); }
    var exp = c.status === 'used' ? '已使用' : (c.status === 'expired' ? '已过期' : '有效期至 ' + c.expireAt);
    return '<div class="coupon ' + (c.status !== 'unused' ? 'used' : '') + '">' +
      '<div class="left"><div class="num">' + esc(left) + '</div><div class="unit">' + esc(unit) + '</div></div>' +
      '<div class="right"><div class="t">' + esc(c.title) + '</div><div class="d">' + esc(c.desc) + '</div>' +
      '<div class="e">' + esc(exp) + (opts.action || '') + '</div></div>' +
      '</div>';
  }

  /* ================= 顾客端 ================= */
  function pageEntry() {
    var c = cfg();
    return '<div class="entry">' +
      '<div class="brand">SEMI-PERMANENT · MEMBER</div>' +
      '<h1>' + esc(c.shopName) + '</h1>' +
      '<p>' + esc(c.slogan) + '<br>价目、作品、券与积分，以及你每一次服务的记录，都在这里。</p>' +
      '<div class="btns">' +
      '<button class="btn block" data-act="go" data-to="#/shop">进店看看</button>' +
      '<button class="btn ghost block" data-act="go" data-to="#/admin">我是店主 · 管理后台</button>' +
      '</div>' +
      '<div class="foot">顾客端查看价目、作品、券、积分与服务记录；店主端用于建档、开单、发券、查看待跟进。数据保存在本机浏览器，请定期在设置页导出备份。</div>' +
      '</div>';
  }

  function pageShop() {
    var c = cfg();
    var me = sessionCustomer();
    var works = db.works.slice(0, 6);
    var featured = db.projects.filter(function (p) { return p.active !== false && p.type === 'main'; }).slice(0, 4);
    var newCoupon = null;
    if (me) {
      newCoupon = db.coupons.filter(function (x) { return x.customerId === me.id && x.templateId === 'new'; })[0];
    }
    var hasOrder = me ? db.orders.filter(function (o) { return o.customerId === me.id && o.status === 'valid'; }).length : 0;

    var claimHtml = '';
    if (!newCoupon && !hasOrder) {
      claimHtml = '<div class="card" style="border-color:#e8cfc6;background:linear-gradient(160deg,#fdf3ee,#f8e8e0)">' +
        '<div style="display:flex;align-items:center;gap:12px">' +
        '<div style="flex:1"><div style="font-size:15px;font-weight:600;color:#8a5044">新人首次到店立减 200 元</div>' +
        '<div style="font-size:12px;color:#958a80;margin-top:3px">限活动款与入门系列，领取后 7 天内有效</div></div>' +
        '<button class="btn mini" data-act="claim-new">领取</button></div></div>';
    }

    return topbar(c.shopName, null, '<button class="act" data-act="go" data-to="#/me">我的</button>') +
      '<div class="hero">' +
      '<div class="kicker">SEMI-PERMANENT</div>' +
      '<h1>' + esc(c.shopName) + '</h1>' +
      '<p>' + esc(c.slogan) + '</p>' +
      '<div class="badges"><span>一人一眉</span><span>按骨相设计</span><span>术后含补色</span></div>' +
      '</div>' +
      '<div class="page">' +
      claimHtml +
      '<div class="section-title"><h2>近期作品</h2><span>共 ' + db.works.length + ' 组</span></div>' +
      '<div class="gallery">' + works.map(function (w) {
        return '<div class="g" data-act="view-work" data-id="' + w.id + '">' +
          (w.image ? '<img src="' + esc(w.image) + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">' : '<div class="ph">◒</div>') +
          '<span class="cap">' + esc(w.label) + '</span></div>';
      }).join('') + '</div>' +
      '<div class="section-title"><h2>热门项目</h2><span>会员价</span></div>' +
      '<div class="card">' + featured.map(function (p) {
        return '<div class="proj"><div class="grow"><div class="pname">' + esc(p.name) + '</div>' +
          '<div class="pnote">' + esc(p.series) + '</div></div>' +
          '<div class="price"><b>¥' + L.money(p.memberPrice) + '</b>' +
          (p.price > p.memberPrice ? '<span class="old">¥' + L.money(p.price) + '</span>' : '') + '</div></div>';
      }).join('') + '</div>' +
      '<button class="btn block" data-act="go" data-to="#/price">查看完整价目</button>' +
      '</div>' +
      tabbar('shop', '#/shop');
  }

  function pagePrice() {
    var c = cfg();
    var groups = L.SERIES.map(function (s) {
      var list = db.projects.filter(function (p) { return p.series === s && p.active !== false; });
      if (!list.length) return '';
      return '<div class="section-title"><h2>' + esc(s) + '</h2><span>' + list.length + ' 项</span></div>' +
        '<div class="card">' + list.map(function (p) {
          return '<div class="proj"><div class="grow"><div class="pname">' + esc(p.name) +
            (p.type === 'addon' ? ' <span class="tag">加项</span>' : '') + '</div>' +
            (p.note ? '<div class="pnote">' + esc(p.note) + '</div>' : '') + '</div>' +
            '<div class="price"><b>¥' + L.money(p.memberPrice) + '</b>' +
            (p.price > p.memberPrice ? '<span class="old">¥' + L.money(p.price) + '</span>' : '') + '</div></div>';
        }).join('') + '</div>';
    }).join('');
    return topbar('价目表', '#/shop') + '<div class="page">' +
      '<div class="note">标价为会员价。首次到店有 200 元新人券，术后含一次补色，具体以当面沟通为准。</div>' +
      groups + '</div>' + tabbar('shop', '#/price');
  }

  function loginSheet() {
    openSheet('<h3>手机号登录</h3>' +
      '<div class="field"><label>手机号</label><input id="lgPhone" type="tel" maxlength="11" placeholder="用于识别你的会员档案"></div>' +
      '<div class="field"><label>称呼（首次来需要填）</label><input id="lgName" placeholder="例如 张女士"></div>' +
      '<div class="field"><label>邀请码（有就填，没有留空）</label><input id="lgRef" value="' + esc(state.refCode || '') + '" placeholder="老客分享给你的 4 位邀请码"></div>' +
      '<button class="btn block" data-act="login-submit">进入</button>' +
      '<div class="field hint" style="margin-top:10px">老客推荐来的填邀请码，首单完成后推荐人会得到补色或修复因子奖励。</div>');
  }

  function pageMe() {
    var c = cfg();
    var me = sessionCustomer();
    if (!me) {
      return topbar('我的', '#/shop') + '<div class="page">' +
        '<div class="card" style="text-align:center;padding:32px 18px">' +
        '<div style="font-size:15px;font-weight:600">登录后查看你的券和积分</div>' +
        '<div style="font-size:12.5px;color:#958a80;margin:8px 0 18px">用手机号识别会员档案，做过项目会自动带出服务记录</div>' +
        '<button class="btn block" data-act="login">手机号登录</button></div></div>' +
        tabbar('shop', '#/me');
    }

    var pts = L.pointsBalance(db, me.id);
    var myCoupons = L.couponsOf(db, me.id);
    var usable = myCoupons.filter(function (x) { return x.status === 'unused'; });
    var used = myCoupons.filter(function (x) { return x.status !== 'unused'; });
    var orders = db.orders.filter(function (o) { return o.customerId === me.id && o.status === 'valid'; })
      .sort(function (a, b) { return a.date > b.date ? -1 : 1; });
    var invites = L.invitesOf(db, me.id);
    var link = location.href.split('#')[0] + '#/shop?ref=' + me.inviteCode;

    var orderHtml = orders.length ? '<div class="timeline">' + orders.map(function (o) {
      var next = o.makeupDate && !o.makeupDone ? '下次补色：' + o.makeupDate : '补色已完成';
      return '<div class="tl-item"><div class="when">' + fullDate(o.date) + '　' + esc(o.payMethod) + '</div>' +
        '<div class="what">' + o.items.map(function (i) { return esc(i.name); }).join(' / ') + '</div>' +
        '<div class="meta">实收 ¥' + L.money(o.amount) + '　积分 +' + o.points + '</div>' +
        '<div class="flag">' + esc(next) + '</div></div>';
    }).join('') + '</div>' : emptyBlock('还没有服务记录');

    var inviteHtml = invites.length ? invites.map(function (i) {
      var invitee = L.findCustomerById(db, i.inviteeId) || { name: '好友' };
      var st = i.status === 'settled' ? '已到账' : (i.status === 'canceled' ? '已取消' : '待结算');
      return '<div class="row"><div class="grow"><div class="name">' + esc(invitee.name) + '</div>' +
        '<div class="sub">首单 ¥' + L.money(i.amount) + '　' + esc(i.rewardTitle || '') + '</div></div>' +
        '<div class="end"><span class="tag ' + (i.status === 'settled' ? 'ok' : 'warn') + '">' + st + '</span></div></div>';
    }).join('') : emptyBlock('还没有邀请记录');

    return topbar('我的', '#/shop') + '<div class="page">' +
      '<div class="card" style="background:linear-gradient(150deg,#3b312c,#6d5043);color:#fdf9f5;border:0">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
      '<div class="avatar" style="background:rgba(255,255,255,.16);color:#fff">' + esc(me.name.slice(0, 1)) + '</div>' +
      '<div style="flex:1"><div style="font-size:16px;font-weight:600">' + esc(me.name) + '</div>' +
      '<div style="font-size:11.5px;opacity:.72;margin-top:2px">' + esc(me.phone) + '　到店 ' + me.visits + ' 次</div></div>' +
      '<div style="text-align:right"><div style="font-size:22px;font-weight:600">' + pts + '</div>' +
      '<div style="font-size:11px;opacity:.72">积分</div></div></div></div>' +

      '<div class="stat-grid" style="margin-bottom:12px">' +
      '<div class="stat"><div class="label">可用券</div><div class="value">' + usable.length + '<small>张</small></div></div>' +
      '<div class="stat"><div class="label">累计消费</div><div class="value">' + L.money(me.totalSpent) + '<small>元</small></div></div>' +
      '</div>' +

      '<div class="section-title"><h2>我的券</h2><span>' + usable.length + ' 张可用</span></div>' +
      (usable.length ? usable.map(function (x) { return couponCard(x); }).join('') : '<div class="card">' + emptyBlock('暂无可用券') + '</div>') +
      (used.length ? '<div class="section-title"><h2>已用与过期</h2><span>' + used.length + ' 张</span></div>' +
        used.map(function (x) { return couponCard(x); }).join('') : '') +

      '<div class="section-title"><h2>服务记录</h2><span>' + orders.length + ' 次</span></div>' +
      '<div class="card">' + orderHtml + '</div>' +

      '<div class="section-title"><h2>带朋友来</h2><span>双方都有礼</span></div>' +
      '<div class="card">' +
      '<div style="font-size:13px;color:#574d46;line-height:1.75">把你的邀请码或链接发给朋友，她首单完成后你得到补色或修复因子，她首单立减 300 元。</div>' +
      '<div style="display:flex;align-items:center;gap:10px;margin:14px 0 10px">' +
      '<div style="flex:1;font-size:20px;font-weight:600;letter-spacing:3px;color:#8a5044">' + esc(me.inviteCode) + '</div>' +
      '<button class="btn mini ghost" data-act="copy" data-text="' + esc(link) + '">复制链接</button></div>' +
      '<div style="font-size:11.5px;color:#958a80;word-break:break-all">' + esc(link) + '</div>' +
      (invites.length ? '<div style="margin-top:14px">' + inviteHtml + '</div>' : '') +
      '</div>' +

      '<button class="btn ghost block" data-act="logout" style="margin-top:16px">退出登录</button>' +
      '</div>' + tabbar('shop', '#/me');
  }

  /* ================= 店主端 ================= */
  function adminGate() {
    openSheet('<h3>店主验证</h3>' +
      '<div class="field"><label>管理密码</label><input id="adminPwd" type="password" placeholder="默认 8888"></div>' +
      '<button class="btn block" data-act="admin-login">进入后台</button>' +
      '<div class="field hint" style="margin-top:10px">密码在设置页可修改。后台只在这台设备上可用，顾客扫码进来看到的是店面页。</div>');
  }

  function isAdmin() {
    try { return sessionStorage.getItem('bp_admin') === '1'; } catch (e) { return false; }
  }

  function pageToday() {
    var c = cfg();
    var r = L.reminders(db);
    var s = L.stats(db);
    var today = db.orders.filter(function (o) { return o.date === L.todayISO() && o.status === 'valid'; });
    var cards = [
      { key: 'makeup', label: '补色到期', n: r.makeup.length },
      { key: 'birthday', label: '本月生日', n: r.birthday.length },
      { key: 'sleeping', label: '一年未到店', n: r.sleeping.length },
      { key: 'pending', label: '待结算奖励', n: r.pending.length }
    ];

    return topbar('今日', null, '<button class="act" data-act="go" data-to="#/stats">看板</button>') + '<div class="page">' +
      '<div class="card">' +
      '<div style="display:flex;align-items:baseline;justify-content:space-between">' +
      '<div><div style="font-size:12px;color:#958a80">' + L.todayISO() + '</div>' +
      '<div style="font-size:19px;font-weight:600;margin-top:2px">今天有 ' + r.total + ' 件要跟进</div></div>' +
      '<div style="text-align:right;font-size:12px;color:#958a80">今日到店 ' + today.length + ' 单<br>实收 ¥' + L.money(today.reduce(function (a, o) { return a + o.amount; }, 0)) + '</div>' +
      '</div></div>' +

      '<div class="stat-grid" style="margin-bottom:12px">' + cards.map(function (k) {
        return '<div class="stat" data-act="open-reminder" data-key="' + k.key + '">' +
          '<div class="label">' + k.label + '</div>' +
          '<div class="value">' + k.n + '<small>项</small></div></div>';
      }).join('') + '</div>' +

      '<div class="section-title"><h2>本月</h2><span>' + s.month + '</span></div>' +
      '<div class="card">' +
      '<div class="kv"><div class="k">实收</div><div class="v">¥' + L.money(s.revenue) + '（' + s.orders + ' 单）</div></div>' +
      '<div class="kv"><div class="k">客单价</div><div class="v">¥' + L.money(s.avg) + '</div></div>' +
      '<div class="kv"><div class="k">新客</div><div class="v">' + s.newCustomers + ' 人　转介绍占 ' + s.referRate + '%</div></div>' +
      '<div class="kv"><div class="k">补色</div><div class="v">到期 ' + s.makeupDue + ' 单，已补 ' + s.makeupDone + ' 单</div></div>' +
      '</div>' +

      '<div class="section-title"><h2>快捷操作</h2><span></span></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
      '<button class="btn dark" data-act="go" data-to="#/order">开一单</button>' +
      '<button class="btn ghost" data-act="go" data-to="#/coupons">发券</button>' +
      '<button class="btn soft" data-act="new-customer">加客户</button>' +
      '<button class="btn soft" data-act="go" data-to="#/invites">老带新</button>' +
      '</div>' +
      '</div>' + tabbar('admin', '#/admin');
  }
