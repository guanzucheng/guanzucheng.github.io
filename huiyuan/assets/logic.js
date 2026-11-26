/* =========================================================
   半永久定妆 · 轻量会员系统 —— 业务逻辑层（纯函数，无 DOM 依赖）
   可在浏览器直接引用，也可被 node 直接 require 做逻辑自测
   ========================================================= */
(function (global) {
  'use strict';

  var STORE_KEY = 'ban_permanent_member_v1';
  var DB_VERSION = 1;

  var SERIES = [
    '活动款',
    '大分子美版（三色机器）',
    '中分子轻氧韩版（五色手工）',
    '小分子烟霏德版（六色烟飞针）',
    '唇部套盒',
    '修复因子'
  ];

  /* ---------------- 价目种子（依据现行价目表） ---------------- */
  var SEED_PROJECTS = [
    // 活动款
    ['活动根眉', '活动款', 1080, 1080, 'main', '单色机器操作'],
    ['活动雾眉', '活动款', 1380, 1380, 'main', '单色机器操作'],
    ['活动美瞳线', '活动款', 1280, 1280, 'main', '单色机器操作'],
    ['活动美瞳线(2D)', '活动款', 2080, 2080, 'main', '单色机器操作'],
    ['活动水晶唇', '活动款', 2380, 2380, 'main', '单色机器操作'],

    // 大分子美版
    ['仿真眉', '大分子美版（三色机器）', 2980, 2380, 'main', '三色机器'],
    ['水雾升级', '大分子美版（三色机器）', 3880, 2880, 'main', '三色机器'],
    ['丝雾眉', '大分子美版（三色机器）', 4880, 3980, 'main', '三色机器'],
    ['美瞳线', '大分子美版（三色机器）', 2280, 1980, 'main', '三色机器'],
    ['美瞳线(3D)', '大分子美版（三色机器）', 4380, 3980, 'main', '三色机器'],

    // 中分子轻氧韩版
    ['3D仿真眉', '中分子轻氧韩版（五色手工）', 3380, 2580, 'main', '五色手工'],
    ['水雾升级（中分子）', '中分子轻氧韩版（五色手工）', 4180, 3480, 'main', '五色手工'],
    ['4D丝绒眉（推荐）', '中分子轻氧韩版（五色手工）', 5680, 4880, 'main', '五色手工'],
    ['氧气眉（推荐）', '中分子轻氧韩版（五色手工）', 8800, 5800, 'main', '五色手工'],
    ['开运眉', '中分子轻氧韩版（五色手工）', 12000, 9800, 'main', '五色手工'],
    ['星空眉（推荐）', '中分子轻氧韩版（五色手工）', 12000, 8800, 'main', '五色手工'],
    ['美瞳线(3D·中分子)', '中分子轻氧韩版（五色手工）', 4600, 3980, 'main', '五色手工'],
    ['升级手工操作+', '中分子轻氧韩版（五色手工）', 1000, 1000, 'addon', '加项'],

    // 小分子烟霏德版
    ['4D仿真眉（小分子）', '小分子烟霏德版（六色烟飞针）', 3580, 2880, 'main', '六色烟飞针'],
    ['幻变水雾眉', '小分子烟霏德版（六色烟飞针）', 4680, 3980, 'main', '六色烟飞针'],
    ['5D丝绒眉', '小分子烟霏德版（六色烟飞针）', 6800, 5580, 'main', '六色烟飞针'],
    ['氧气眉（小分子·推荐）', '小分子烟霏德版（六色烟飞针）', 9800, 6800, 'main', '六色烟飞针'],
    ['鸿运眉', '小分子烟霏德版（六色烟飞针）', 38000, 16888, 'main', '六色烟飞针'],
    ['星空眉（小分子·推荐）', '小分子烟霏德版（六色烟飞针）', 13800, 9800, 'main', '六色烟飞针'],
    ['魅惑美瞳黑', '小分子烟霏德版（六色烟飞针）', 7800, 6800, 'main', '六色烟飞针'],
    ['红蓝眉毛转色', '小分子烟霏德版（六色烟飞针）', 1980, 1980, 'main', '改色，需先评估旧色'],
    ['无创色素提取', '小分子烟霏德版（六色烟飞针）', 1980, 1980, 'main', '改色，需先评估旧色'],

    // 唇部套盒（大 / 中 / 小 三档）
    ['韩式水嫩唇（大分子套盒）', '唇部套盒', 3680, 3680, 'main', '大分子套盒'],
    ['韩式水嫩唇（中分子套盒）', '唇部套盒', 4280, 4280, 'main', '中分子套盒'],
    ['韩式水嫩唇（小分子套盒）', '唇部套盒', 5280, 5280, 'main', '小分子套盒'],
    ['韩式水晶唇（大分子套盒）', '唇部套盒', 4880, 4880, 'main', '大分子套盒'],
    ['韩式水晶唇（中分子套盒）', '唇部套盒', 5580, 5580, 'main', '中分子套盒'],
    ['韩式水晶唇（小分子套盒）', '唇部套盒', 6280, 6280, 'main', '小分子套盒'],
    ['渐变唇（大分子套盒）', '唇部套盒', 5280, 5280, 'main', '大分子套盒'],
    ['渐变唇（中分子套盒）', '唇部套盒', 6880, 6880, 'main', '中分子套盒'],
    ['渐变唇（小分子套盒）', '唇部套盒', 7880, 7880, 'main', '小分子套盒'],
    ['樱花唇（大分子套盒）', '唇部套盒', 9980, 9980, 'main', '大分子套盒'],
    ['樱花唇（中分子套盒）', '唇部套盒', 12800, 12800, 'main', '中分子套盒'],
    ['樱花唇（小分子套盒）', '唇部套盒', 26888, 26888, 'main', '小分子套盒'],

    // 修复因子
    ['修复因子 A 型', '修复因子', 598, 598, 'addon', '术后修复耗材'],
    ['修复因子 B 型', '修复因子', 398, 398, 'addon', '术后修复耗材'],
    ['修复因子 C 型', '修复因子', 298, 298, 'addon', '术后修复耗材'],
    ['修复因子 基础款', '修复因子', 1980, 1980, 'addon', '术后修复耗材']
  ];

  /* ---------------- 券模板 ---------------- */
  var COUPON_TEMPLATES = [
    { id: 'new', title: '新人体验券', desc: '首单立减 200 元，限活动款或入门系列', kind: 'cash', value: 200, days: 7, only: 'first' },
    { id: 'factor', title: '修复因子券', desc: '赠修复因子 A、B、C 任选一支', kind: 'item', value: 0, days: 30, only: 'none' },
    { id: 'upgrade', title: '升级券', desc: '按中分子价格做小分子系列', kind: 'item', value: 0, days: 60, only: 'none' },
    { id: 'makeup', title: '补色券', desc: '免费补色一次，限原项目', kind: 'item', value: 0, days: 45, only: 'none' },
    { id: 'referral', title: '转介绍券', desc: '首单立减 300 元', kind: 'cash', value: 300, days: 30, only: 'first' },
    { id: 'wake', title: '唤醒券', desc: '任选项目 8 折', kind: 'discount', value: 0.8, days: 30, only: 'none' }
  ];

  /* ---------------- 工具 ---------------- */
  function uid(prefix) {
    return (prefix || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function todayISO(d) {
    var t = d ? new Date(d) : new Date();
    return t.getFullYear() + '-' + pad(t.getMonth() + 1) + '-' + pad(t.getDate());
  }

  function nowISO() {
    var t = new Date();
    return todayISO(t) + 'T' + pad(t.getHours()) + ':' + pad(t.getMinutes());
  }

  function addDays(isoDate, n) {
    var d = new Date(isoDate.slice(0, 10) + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return todayISO(d);
  }

  function daysBetween(fromISO, toISO) {
    var a = new Date((fromISO || '').slice(0, 10) + 'T00:00:00');
    var b = new Date((toISO || todayISO()).slice(0, 10) + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }

  function money(n) {
    var v = Math.round(Number(n) || 0);
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function yyyymm(iso) { return (iso || '').slice(0, 7); }

  function inviteCode(phone) {
    var tail = (phone || '').replace(/\D/g, '').slice(-4) || '0000';
    var rnd = Math.random().toString(36).slice(2, 4).toUpperCase();
    return tail + rnd;
  }

  /* ---------------- 种子数据 ---------------- */
  function makeSeed() {
    var cfg = {
      shopName: '眉间 · 半永久定妆',
      masterName: '主理人',
      slogan: '一人一眉，按骿相设计',
      password: '8888',
      pointsRate: 100,
      makeupDays: 30,
      settleDays: 7,
      createdAt: nowISO()
    };

    var projects = SEED_PROJECTS.map(function (p) {
      return {
        id: uid('p'),
        name: p[0],
        series: p[1],
        price: p[2],
        memberPrice: p[3],
        type: p[4],
        note: p[5],
        active: true
      };
    });

    var t = todayISO();
    var c1 = {
      id: uid('c'), name: '张女士', phone: '13800001234', wechat: 'zhang_my',
      birthday: '1992-' + pad(new Date().getMonth() + 1) + '-18',
      source: '朋友圈', createdAt: addDays(t, -200), lastVisit: addDays(t, -62),
      totalSpent: 0, visits: 0,
      tags: ['要求自然'], note: '',
      profile: { pregnant: '否', disease: '无', period: '否', allergy: '无', history: '2022 年做过一次难眉，底色偏浅', skin: '混合偏油' },
      inviteCode: inviteCode('13800001234'), invitedBy: ''
    };
    var c2 = {
      id: uid('c'), name: '李女士', phone: '13900005678', wechat: 'li_ling',
      birthday: '1988-03-09',
      source: '张女士推荐', createdAt: addDays(t, -40), lastVisit: addDays(t, -38),
      totalSpent: 0, visits: 0,
      tags: ['怕痛'], note: '',
      profile: { pregnant: '否', disease: '无', period: '否', allergy: '麻药轻微过敏', history: '首次', skin: '干性' },
      inviteCode: inviteCode('13900005678'), invitedBy: c1.id
    };
    var c3 = {
      id: uid('c'), name: '王女士', phone: '13700009999', wechat: '',
      birthday: '1979-11-02',
      source: '微信群', createdAt: addDays(t, -420), lastVisit: addDays(t, -400),
      totalSpent: 0, visits: 0,
      tags: ['沉睡'], note: '对价格敏感',
      profile: { pregnant: '否', disease: '无', period: '否', allergy: '无', history: '无', skin: '中性' },
      inviteCode: inviteCode('13700009999'), invitedBy: ''
    };

    var db = {
      version: DB_VERSION,
      cfg: cfg,
      projects: projects,
      customers: [c1, c2, c3],
      orders: [],
      coupons: [],
      points: [],
      invites: [],
      works: [
        { id: uid('w'), label: '难眉 · 自然款', series: '大分子美版（三色机器）', image: '' },
        { id: uid('w'), label: '丝难眉 · 柔难感', series: '大分子美版（三色机器）', image: '' },
        { id: uid('w'), label: '4D 丝绒眉', series: '中分子轻氧韩版（五色手工）', image: '' },
        { id: uid('w'), label: '氧气眉 · 空气感', series: '中分子轻氧韩版（五色手工）', image: '' },
        { id: uid('w'), label: '美瞳线 · 内眼线', series: '大分子美版（三色机器）', image: '' },
        { id: uid('w'), label: '渐变唇', series: '唇部套盒', image: '' }
      ]
    };

    // 示例订单：张女士 62 天前做 4D 丝绒眉，补色日已过，用于演示补色提醒
    var p1 = projects.filter(function (x) { return x.name === '4D丝绒眉（推荐）'; })[0];
    var p2 = projects.filter(function (x) { return x.name === '修复因子 A 型'; })[0];
    var order1 = {
      id: uid('o'), no: 'S' + addDays(t, -62).replace(/-/g, '').slice(2) + '01',
      customerId: c1.id, date: addDays(t, -62), createdAt: addDays(t, -62) + 'T15:20',
      items: [
        { projectId: p1.id, name: p1.name, series: p1.series, price: p1.price, memberPrice: p1.memberPrice, actual: p1.memberPrice },
        { projectId: p2.id, name: p2.name, series: p2.series, price: p2.price, memberPrice: p2.memberPrice, actual: p2.memberPrice }
      ],
      amount: p1.memberPrice + p2.memberPrice,
      payMethod: '微信', couponId: '', points: Math.floor((p1.memberPrice + p2.memberPrice) / 100),
      tech: { brand: '德国进口色料', colorNo: '03 深棕 / 05 灰棕', method: '手工', colorCount: '5' },
      note: '顾客怕痛，麻药敷 25 分钟',
      makeupDate: addDays(t, -32), makeupDone: false,
      status: 'valid'
    };
    db.orders.push(order1);

    // 示例订单：李女士 38 天前首单（由张女士推荐）
    var p3 = projects.filter(function (x) { return x.name === '仿真眉'; })[0];
    var order2 = {
      id: uid('o'), no: 'S' + addDays(t, -38).replace(/-/g, '').slice(2) + '02',
      customerId: c2.id, date: addDays(t, -38), createdAt: addDays(t, -38) + 'T11:05',
      items: [{ projectId: p3.id, name: p3.name, series: p3.series, price: p3.price, memberPrice: p3.memberPrice, actual: p3.memberPrice }],
      amount: p3.memberPrice,
      payMethod: '支付宝', couponId: '', points: Math.floor(p3.memberPrice / 100),
      tech: { brand: '德国进口色料', colorNo: '02 咖棕', method: '机器', colorCount: '3' },
      note: '',
      makeupDate: addDays(t, -8), makeupDone: false,
      status: 'valid'
    };
    db.orders.push(order2);

    // 历史积分流水（与示例订单对应）
    db.points.push({
      id: uid('pt'), customerId: c1.id, delta: order1.points,
      reason: '服务消费 · ' + order1.no, at: order1.date + 'T15:20', orderId: order1.id
    });
    db.points.push({
      id: uid('pt'), customerId: c2.id, delta: order2.points,
      reason: '服务消费 · ' + order2.no, at: order2.date + 'T11:05', orderId: order2.id
    });

    // 回填客户累计
    db.orders.forEach(function (o) { recomputeCustomer(db, o.customerId); });

    // 邀请记录：李女士首单，待结算（已过期，演示自动结算）
    db.invites.push({
      id: uid('i'), inviterId: c1.id, inviteeId: c2.id, firstOrderId: order2.id,
      amount: order2.amount, status: 'pending',
      createdAt: addDays(t, -38), settleAt: addDays(t, -31),
      rewardPoints: 100, rewardCoupon: 'factor',
      rewardTitle: '修复因子套装 + 100 积分'
    });

    // 券：张女士持补色券，李女士持转介绍券
    db.coupons.push({
      id: uid('k'), customerId: c1.id, templateId: 'makeup', title: '补色券',
      desc: '免费补色一次，限原项目', kind: 'item', value: 0,
      issuedAt: addDays(t, -32), expireAt: addDays(t, 13), status: 'unused', source: 'auto'
    });
    db.coupons.push({
      id: uid('k'), customerId: c1.id, templateId: 'upgrade', title: '升级券',
      desc: '按中分子价格做小分子系列', kind: 'item', value: 0,
      issuedAt: addDays(t, -62), expireAt: addDays(t, -2), status: 'unused', source: 'auto'
    });

    return db;
  }

  /* ---------------- 存储 ---------------- */
  var memoryFallback = null;

  function storageOk() {
    try {
      var k = '__t' + Date.now();
      global.localStorage.setItem(k, '1');
      global.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  }

  var canStore = (typeof global.localStorage !== 'undefined') && storageOk();

  function save(db) {
    if (!canStore) { memoryFallback = db; return; }
    try {
      global.localStorage.setItem(STORE_KEY, JSON.stringify(db));
    } catch (e) {
      memoryFallback = db;
    }
  }

  function load() {
    var raw = null;
    if (canStore) {
      try { raw = global.localStorage.getItem(STORE_KEY); } catch (e) { raw = null; }
    }
    if (!raw && memoryFallback) return memoryFallback;
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function getDB() {
    var db = load();
    if (!db || !db.version) {
      db = makeSeed();
      save(db);
    }
    return db;
  }

  function resetDB(keepProjects) {
    var db = makeSeed();
    if (keepProjects) {
      // 保留当前价目，仅重置客户与交易数据
      var cur = load();
      if (cur && cur.projects && cur.projects.length) db.projects = cur.projects;
    }
    save(db);
    return db;
  }

  function clearAll() {
    var db = makeSeed();
    db.customers = [];
    db.orders = [];
    db.coupons = [];
    db.points = [];
    db.invites = [];
    save(db);
    return db;
  }

  /* ---------------- 客户 ---------------- */
  function findCustomer(db, phone) {
    return db.customers.filter(function (c) { return c.phone === phone; })[0] || null;
  }

  function findCustomerById(db, id) {
    return db.customers.filter(function (c) { return c.id === id; })[0] || null;
  }

  function addCustomer(db, data) {
    var c = {
      id: uid('c'),
      name: data.name || '未命名',
      phone: data.phone || '',
      wechat: data.wechat || '',
      birthday: data.birthday || '',
      source: data.source || '到店',
      createdAt: todayISO(),
      lastVisit: '',
      totalSpent: 0,
      visits: 0,
      tags: data.tags || [],
      note: data.note || '',
      profile: data.profile || { pregnant: '否', disease: '无', period: '否', allergy: '无', history: '首次', skin: '' },
      inviteCode: inviteCode(data.phone),
      invitedBy: data.invitedBy || ''
    };
    db.customers.push(c);
    save(db);
    return c;
  }

  function recomputeCustomer(db, customerId) {
    var c = findCustomerById(db, customerId);
    if (!c) return;
    var valid = db.orders.filter(function (o) { return o.customerId === customerId && o.status === 'valid'; });
    c.visits = valid.length;
    c.totalSpent = valid.reduce(function (s, o) { return s + (Number(o.amount) || 0); }, 0);
    if (valid.length) {
      var latest = valid.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; })[valid.length - 1];
      c.lastVisit = latest.date;
    }
  }

  /* ---------------- 积分 ---------------- */
  function pointsBalance(db, customerId) {
    return db.points.filter(function (p) { return p.customerId === customerId; })
      .reduce(function (s, p) { return s + (Number(p.delta) || 0); }, 0);
  }

  function addPoints(db, customerId, delta, reason, orderId) {
    db.points.push({
      id: uid('pt'), customerId: customerId, delta: delta, reason: reason,
      at: nowISO(), orderId: orderId || ''
    });
  }

  function pointsForAmount(amount, cfg) {
    var rate = (cfg && cfg.pointsRate) || 100;
    return Math.floor((Number(amount) || 0) / rate);
  }

  /* ---------------- 券 ---------------- */
  function templateById(id) {
    return COUPON_TEMPLATES.filter(function (t) { return t.id === id; })[0] || null;
  }

  function issueCoupon(db, customerId, templateId, opts) {
    var t = templateById(templateId);
    if (!t) return null;
    opts = opts || {};
    var days = opts.days || t.days;
    var c = {
      id: uid('k'),
      customerId: customerId,
      templateId: t.id,
      title: opts.title || t.title,
      desc: opts.desc || t.desc,
      kind: t.kind,
      value: (opts.value !== undefined ? opts.value : t.value),
      issuedAt: todayISO(),
      expireAt: addDays(todayISO(), days),
      status: 'unused',
      source: opts.source || 'manual',
      note: opts.note || ''
    };
    db.coupons.push(c);
    save(db);
    return c;
  }

  function refreshCouponStatus(db) {
    var t = todayISO();
    var changed = false;
    db.coupons.forEach(function (c) {
      if (c.status === 'unused' && c.expireAt && c.expireAt < t) {
        c.status = 'expired';
        changed = true;
      }
    });
    if (changed) save(db);
    return db;
  }

  function couponsOf(db, customerId, status) {
    refreshCouponStatus(db);
    return db.coupons.filter(function (c) {
      return c.customerId === customerId && (!status || c.status === status);
    }).sort(function (a, b) { return a.expireAt < b.expireAt ? -1 : 1; });
  }

  function couponDeduct(coupon, receivable) {
    if (!coupon) return 0;
    if (coupon.kind === 'cash') return Math.min(Number(coupon.value) || 0, receivable);
    if (coupon.kind === 'discount') return Math.round(receivable * (1 - (Number(coupon.value) || 1)));
    return 0;
  }

  /* ---------------- 开单 ---------------- */
  function createOrder(db, payload) {
    var c = findCustomerById(db, payload.customerId);
    if (!c) return { ok: false, msg: '客户不存在' };
    var items = (payload.items || []).map(function (it) {
      return {
        projectId: it.projectId || '',
        name: it.name,
        series: it.series || '',
        price: Number(it.price) || 0,
        memberPrice: Number(it.memberPrice) || 0,
        actual: Number(it.actual) || 0
      };
    });
    if (!items.length) return { ok: false, msg: '至少选择一个项目' };

    var receivable = items.reduce(function (s, it) { return s + it.actual; }, 0);
    var coupon = payload.couponId ? db.coupons.filter(function (x) { return x.id === payload.couponId; })[0] : null;
    if (coupon && coupon.status !== 'unused') coupon = null;

    var deduct = couponDeduct(coupon, receivable);
    var amount = (payload.amount === undefined || payload.amount === null || payload.amount === '')
      ? Math.max(0, receivable - deduct)
      : Number(payload.amount);

    var firstOrder = db.orders.filter(function (o) {
      return o.customerId === c.id && o.status === 'valid';
    }).length === 0;

    var order = {
      id: uid('o'),
      no: 'S' + todayISO().replace(/-/g, '').slice(2) + pad(db.orders.length + 1),
      customerId: c.id,
      date: payload.date || todayISO(),
      createdAt: nowISO(),
      items: items,
      amount: amount,
      payMethod: payload.payMethod || '微信',
      couponId: coupon ? coupon.id : '',
      couponTitle: coupon ? coupon.title : '',
      couponDeduct: deduct,
      points: pointsForAmount(amount, db.cfg),
      tech: payload.tech || {},
      factor: payload.factor || '',
      note: payload.note || '',
      makeupDate: payload.makeupDate || addDays(payload.date || todayISO(), (db.cfg && db.cfg.makeupDays) || 30),
      makeupDone: false,
      status: 'valid'
    };
    db.orders.push(order);

    // 券核销
    if (coupon) {
      coupon.status = 'used';
      coupon.usedAt = todayISO();
      coupon.usedOrderId = order.id;
    }

    // 积分
    if (order.points > 0) {
      addPoints(db, c.id, order.points, '服务消费 · ' + order.no, order.id);
    }

    recomputeCustomer(db, c.id);

    // 首单 + 被邀请 → 建立待结算关系
    var inviteCreated = null;
    if (firstOrder && c.invitedBy) {
      var inviter = findCustomerById(db, c.invitedBy);
      if (inviter) {
        var exist = db.invites.filter(function (i) { return i.inviteeId === c.id; })[0];
        if (!exist) {
          var rw = rewardFor(amount);
          var inv = {
            id: uid('i'),
            inviterId: inviter.id,
            inviteeId: c.id,
            firstOrderId: order.id,
            amount: amount,
            status: 'pending',
            createdAt: todayISO(),
            settleAt: addDays(todayISO(), (db.cfg && db.cfg.settleDays) || 7),
            rewardPoints: rw.points,
            rewardCoupon: rw.coupon,
            rewardTitle: rw.title
          };
          db.invites.push(inv);
          inviteCreated = inv;
        }
      }
    }

    save(db);
    return { ok: true, order: order, invite: inviteCreated };
  }

  function voidOrder(db, orderId) {
    var o = db.orders.filter(function (x) { return x.id === orderId; })[0];
    if (!o) return false;
    o.status = 'void';
    // 积分回收
    db.points = db.points.filter(function (p) { return p.orderId !== orderId; });
    // 券退回
    if (o.couponId) {
      var cp = db.coupons.filter(function (x) { return x.id === o.couponId; })[0];
      if (cp && cp.status === 'used') {
        cp.status = 'unused';
        cp.usedOrderId = '';
      }
    }
    // 取消邀请
    db.invites.forEach(function (i) {
      if (i.firstOrderId === orderId && i.status !== 'settled') i.status = 'canceled';
    });
    recomputeCustomer(db, o.customerId);
    save(db);
    return true;
  }

  /* ---------------- 老带新 ---------------- */
  function rewardFor(amount) {
    if (amount >= 8000) {
      return { points: 300, coupon: 'upgrade', title: '升级券 + 300 积分' };
    }
    if (amount >= 3000) {
      return { points: 200, coupon: 'makeup', title: '免费补色一次 + 200 积分' };
    }
    return { points: 100, coupon: 'factor', title: '修复因子套装 + 100 积分' };
  }

  function settleInvites(db, nowDate) {
    var t = nowDate || todayISO();
    var settled = [];
    db.invites.forEach(function (i) {
      if (i.status === 'pending' && i.settleAt <= t) {
        i.status = 'settled';
        i.settledAt = t;
        if (i.rewardPoints) addPoints(db, i.inviterId, i.rewardPoints, '老带新奖励 · ' + (i.rewardTitle || ''), i.firstOrderId);
        if (i.rewardCoupon) issueCoupon(db, i.inviterId, i.rewardCoupon, { source: 'invite', note: '老带新奖励' });
        settled.push(i);
      }
    });
    if (settled.length) save(db);
    return settled;
  }

  function invitesOf(db, customerId) {
    return db.invites.filter(function (i) { return i.inviterId === customerId; });
  }

  /* ---------------- 提醒 ---------------- */
  function reminders(db) {
    refreshCouponStatus(db);
    var t = todayISO();
    var month = t.slice(5, 7);
    var makeup = [], birthday = [], sleeping = [], pending = [];

    db.orders.forEach(function (o) {
      if (o.status === 'valid' && !o.makeupDone && o.makeupDate && o.makeupDate <= t) {
        var c = findCustomerById(db, o.customerId);
        if (c) makeup.push({ type: 'makeup', customer: c, order: o, days: daysBetween(o.makeupDate, t) });
      }
    });

    db.customers.forEach(function (c) {
      if (c.birthday && c.birthday.slice(5, 7) === month) {
        birthday.push({ type: 'birthday', customer: c, day: c.birthday.slice(8, 10) });
      }
      if (c.lastVisit && daysBetween(c.lastVisit, t) >= 365) {
        sleeping.push({ type: 'sleeping', customer: c, days: daysBetween(c.lastVisit, t) });
      }
    });

    db.invites.forEach(function (i) {
      if (i.status === 'pending' && i.settleAt <= t) {
        pending.push({ type: 'invite', invite: i });
      }
    });

    return {
      makeup: makeup,
      birthday: birthday,
      sleeping: sleeping,
      pending: pending,
      total: makeup.length + birthday.length + sleeping.length + pending.length
    };
  }

  /* ---------------- 统计 ---------------- */
  function stats(db, month) {
    var m = month || yyyymm(todayISO());
    var valid = db.orders.filter(function (o) { return o.status === 'valid' && yyyymm(o.date) === m; });
    var revenue = valid.reduce(function (s, o) { return s + (Number(o.amount) || 0); }, 0);
    var newCustomers = db.customers.filter(function (c) { return yyyymm(c.createdAt) === m; }).length;
    var referredFirst = valid.filter(function (o) {
      var c = findCustomerById(db, o.customerId);
      return c && c.invitedBy;
    }).length;
    var makeupDue = db.orders.filter(function (o) { return o.status === 'valid' && o.makeupDate && o.makeupDate <= todayISO(); }).length;
    var makeupDone = db.orders.filter(function (o) { return o.status === 'valid' && o.makeupDone; }).length;
    return {
      month: m,
      revenue: revenue,
      orders: valid.length,
      avg: valid.length ? Math.round(revenue / valid.length) : 0,
      newCustomers: newCustomers,
      referRate: valid.length ? Math.round(referredFirst / valid.length * 100) : 0,
      makeupDue: makeupDue,
      makeupDone: makeupDone,
      makeupRate: makeupDue ? Math.round(makeupDone / makeupDue * 100) : 0,
      totalCustomers: db.customers.length,
      totalCoupons: db.coupons.length,
      usedCoupons: db.coupons.filter(function (c) { return c.status === 'used'; }).length
    };
  }

  /* ---------------- 导出 / 导入 ---------------- */
  function exportJSON(db) {
    var data = {
      app: '半永久定妆会员系统',
      version: DB_VERSION,
      exportedAt: nowISO(),
      db: db
    };
    return JSON.stringify(data, null, 2);
  }

  function importJSON(text) {
    try {
      var obj = JSON.parse(text);
      var db = obj.db || obj;
      if (!db || !db.cfg || !db.customers) return { ok: false, msg: '文件格式不正确' };
      db.version = db.version || DB_VERSION;
      save(db);
      return { ok: true, db: db };
    } catch (e) {
      return { ok: false, msg: '解析失败：' + e.message };
    }
  }

  function exportCustomersCSV(db) {
    var head = ['姓名', '手机号', '微信号', '生日', '来源', '建档日期', '最近到店', '到店次数', '累计实收', '积分', '标签', '备注'];
    var rows = db.customers.map(function (c) {
      return [c.name, c.phone, c.wechat, c.birthday, c.source, c.createdAt, c.lastVisit,
        c.visits, c.totalSpent, pointsBalance(db, c.id), (c.tags || []).join('/'), (c.note || '').replace(/,/g, '，')];
    });
    return [head].concat(rows).map(function (r) {
      return r.map(function (v) { return '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
  }

  function exportOrdersCSV(db) {
    var head = ['单号', '日期', '客户', '手机号', '项目', '实收', '收款方式', '券', '积分', '补色日', '状态'];
    var rows = db.orders.map(function (o) {
      var c = findCustomerById(db, o.customerId) || { name: '', phone: '' };
      return [o.no, o.date, c.name, c.phone,
        (o.items || []).map(function (i) { return i.name; }).join(' / '),
        o.amount, o.payMethod, o.couponTitle || '', o.points, o.makeupDate || '',
        o.status === 'valid' ? '有效' : (o.status === 'void' ? '作废' : '退款')];
    });
    return [head].concat(rows).map(function (r) {
      return r.map(function (v) { return '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
  }

  /* ---------------- 导出到 global ---------------- */
  var API = {
    STORE_KEY: STORE_KEY,
    DB_VERSION: DB_VERSION,
    SERIES: SERIES,
    COUPON_TEMPLATES: COUPON_TEMPLATES,
    SEED_PROJECTS: SEED_PROJECTS,
    uid: uid,
    todayISO: todayISO,
    nowISO: nowISO,
    addDays: addDays,
    daysBetween: daysBetween,
    money: money,
    yyyymm: yyyymm,
    inviteCode: inviteCode,
    makeSeed: makeSeed,
    load: load,
    save: save,
    getDB: getDB,
    resetDB: resetDB,
    clearAll: clearAll,
    findCustomer: findCustomer,
    findCustomerById: findCustomerById,
    addCustomer: addCustomer,
    recomputeCustomer: recomputeCustomer,
    pointsBalance: pointsBalance,
    addPoints: addPoints,
    pointsForAmount: pointsForAmount,
    templateById: templateById,
    issueCoupon: issueCoupon,
    refreshCouponStatus: refreshCouponStatus,
    couponsOf: couponsOf,
    couponDeduct: couponDeduct,
    createOrder: createOrder,
    voidOrder: voidOrder,
    rewardFor: rewardFor,
    settleInvites: settleInvites,
    invitesOf: invitesOf,
    reminders: reminders,
    stats: stats,
    exportJSON: exportJSON,
    importJSON: importJSON,
    exportCustomersCSV: exportCustomersCSV,
    exportOrdersCSV: exportOrdersCSV
  };

  global.MemberLogic = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;

})(typeof window !== 'undefined' ? window : globalThis);
