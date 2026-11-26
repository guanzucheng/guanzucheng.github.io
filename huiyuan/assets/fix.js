/* 文案修正：把种子数据里打错的两个字改回来，并修好已经生成过的本地数据 */
(function () {
  var W = window, L = W.MemberLogic;
  if (!L) return;
  var PAIRS = [['骿', '骨'], ['柔难感', '柔雾感'], ['难眉', '雾眉'], ['怕痛', '怕疼']];
  function fixText(s) {
    if (typeof s !== 'string') return s;
    var v = s;
    for (var i = 0; i < PAIRS.length; i++) v = v.split(PAIRS[i][0]).join(PAIRS[i][1]);
    return v;
  }
  function fixDB(db) {
    if (!db) return db;
    if (db.cfg) db.cfg.slogan = fixText(db.cfg.slogan);
    (db.works || []).forEach(function (w) { w.label = fixText(w.label); });
    (db.customers || []).forEach(function (c) {
      if (c.profile && c.profile.history) c.profile.history = fixText(c.profile.history);
      if (c.tags) c.tags = c.tags.map(fixText);
      if (c.note) c.note = fixText(c.note);
    });
    (db.orders || []).forEach(function (o) {
      if (o.note) o.note = fixText(o.note);
      (o.items || []).forEach(function (it) { it.series = fixText(it.series); });
    });
    return db;
  }
  var orig = L.makeSeed;
  L.makeSeed = function () { return fixDB(orig.apply(null, arguments)); };
  try {
    var raw = W.localStorage.getItem(L.STORE_KEY);
    if (raw) {
      var db = JSON.parse(raw);
      fixDB(db);
      W.localStorage.setItem(L.STORE_KEY, JSON.stringify(db));
    }
  } catch (e) {}
})(window);
