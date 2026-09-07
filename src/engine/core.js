/* ============================================================
 * THE MONOMYTHIAN — engine/core.js
 * Namespace, game state, and terminal output primitives.
 * Classic script (no build step). Runs from file:// or a server.
 * ============================================================ */
(function (root) {
  "use strict";

  // ---- namespace ----
  var G = root.G = root.G || {};
  G.cycles = [];     // registered cycle definitions, in order
  G.hosts = {};      // network hosts (populated by content/hosts.js)
  G.archive = {};    // archive records (populated by content/archive-data.js)
  G.REDUCED = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- state ----
  G.state = {
    app: "home",
    username: "",
    cycleIndex: 0,        // which cycle is current
    cycleStarted: {},     // {0:true,...} which cycles have begun
    pilotStarted: false,
    contact: false,
    flags: {},            // narrative flags: lied, trust, etc.
    unlocked: {},         // archive record keys revealed
    files: [],            // downloaded files [{name, body}]
    knownHosts: ["10.0.0.4"],
    hack: { loc: null, auth: null },
    // transient runtime resolvers
    _objective: null,     // {type, target, resolve}
    _returnResolve: null,
    _inputResolve: null
  };

  G.flag = function (k) { return G.state.flags[k]; };
  G.setFlag = function (k, v) { G.state.flags[k] = v; G.persistSave(); };

  // ---- session save (localStorage) ----
  // Durable fields only. Scene resolvers are rebuilt by replaying the current
  // night from its first step; completed nights are not replayed.
  var SAVE_KEY = "monomythian:save:v1";
  var SAVE_FIELDS = ["username","cycleIndex","cycleStarted","pilotStarted","contact","flags","unlocked","files","knownHosts","hack"];

  function storage() {
    try { return root.localStorage; } catch (e) { return null; }
  }

  G.persistSave = function () {
    var ls = storage(); if (!ls) return;
    try {
      var state = {};
      SAVE_FIELDS.forEach(function (k) { state[k] = G.state[k]; });
      var hostFiles = {};
      Object.keys(G.hosts || {}).forEach(function (ip) {
        if (G.hosts[ip] && G.hosts[ip].files) hostFiles[ip] = G.hosts[ip].files;
      });
      ls.setItem(SAVE_KEY, JSON.stringify({ v: 1, state: state, hostFiles: hostFiles }));
    } catch (e) { /* quota / private mode / circular — play without a save */ }
  };

  G.clearSave = function () {
    var ls = storage(); if (!ls) return;
    try { ls.removeItem(SAVE_KEY); } catch (e) {}
  };

  G.restoreSave = function () {
    var ls = storage(); if (!ls) return false;
    var raw;
    try { raw = ls.getItem(SAVE_KEY); } catch (e) { return false; }
    if (!raw) return false;
    var snap;
    try { snap = JSON.parse(raw); } catch (e) { return false; }
    if (!snap || snap.v !== 1 || !snap.state) return false;
    SAVE_FIELDS.forEach(function (k) {
      if (snap.state[k] !== undefined) G.state[k] = snap.state[k];
    });
    G.state.app = "home";
    G.state._objective = null;
    G.state._returnResolve = null;
    G.state._inputResolve = null;
    G.state._reply = null;
    if (snap.hostFiles) {
      Object.keys(snap.hostFiles).forEach(function (ip) {
        if (G.hosts[ip]) G.hosts[ip].files = snap.hostFiles[ip];
      });
    }
    // Mid-night refresh: replay this cycle's script, keep inventory / flags.
    // A closed line (deadEnd) must not replay — the player is done.
    var i = G.state.cycleIndex;
    if (!G.state.flags.deadEnd && G.state.cycleStarted[i]) {
      delete G.state.cycleStarted[i];
    }
    return true;
  };

  // ---- DOM handles (cached on init) ----
  var out, input, slashmenu, inputbox, promptEl, hLoc, opId;
  G.dom = {};

  // ---- helpers ----
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function atBottom() { return out.scrollHeight - out.scrollTop - out.clientHeight < 80; }
  function scrollDown() { out.scrollTop = out.scrollHeight; }
  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function push(app, node) {
    node.classList.add("app-" + app);
    out.appendChild(node);
    if (app === G.state.app) scrollDown();
    return node;
  }

  // ---- line printers ----
  var T = G.term = {};

  T.sys = function (app, text) {
    var d = document.createElement("div"); d.className = "line sys"; d.textContent = text; return push(app, d);
  };
  T.alert = function (app, text) {
    var d = document.createElement("div"); d.className = "line alert"; d.textContent = text; return push(app, d);
  };
  T.plain = function (app, text, cls) {
    var d = document.createElement("div"); d.className = "line " + (cls || ""); d.textContent = text; return push(app, d);
  };
  T.spacer = function (app) {
    var d = document.createElement("div"); d.className = "line spacer"; return push(app, d);
  };

  // ---- binary / media files ----
  // A host file is either a STRING (readable in-terminal) or a MEDIA DESCRIPTOR:
  //   { media:true, type:"image/jpeg", size:"384 KB", meta:"1440x1080 \u00b7 03:47",
  //     desc:"one diegetic line (optional)", src:"assets/camera7.png" }
  // Media can't be read in the terminal; it's inspected, then downloaded by the browser.
  G.isMedia = function (v) { return !!(v && typeof v === "object" && v.media); };

  // the diegetic file-inspector stub, printed instead of dumping bytes
  T.mediaStub = function (app, name, m) {
    var head = "  [ " + name + " ]  " + m.type + (m.meta ? " \u00b7 " + m.meta : "") + " \u00b7 " + m.size;
    T.plain(app, head, "sys");
    if (m.desc) T.plain(app, "  " + m.desc);
  };

  // a real, clickable browser download (the file leaves the game)
  T.download = function (app, name, m) {
    var d = document.createElement("div"); d.className = "line dl";
    var a = document.createElement("a");
    a.href = m.src; a.download = name; a.textContent = "\u203a download " + name;
    a.setAttribute("rel", "noopener");
    d.appendChild(a);
    var node = push(app, d);
    if (a.click) a.click();   // fire the save immediately; the link stays as a manual fallback
    return node;
  };
  T.you = function (app, text) {
    var d = document.createElement("div"); d.className = "line msg-line you";
    d.innerHTML = '<span class="who you">you \u203a</span><span class="msg"></span>';
    d.querySelector(".msg").textContent = text; return push(app, d);
  };
  T.archiveBlock = function (app, key, locked) {
    var e = G.archive[key]; var d = document.createElement("div");
    d.className = "line arch" + (locked ? " locked" : "");
    d.innerHTML = '<span class="arch-tag">archive \u00b7 ' + (locked ? "restricted" : "match") + '</span><br>' +
      '<span class="arch-title">' + esc(e.title) + '</span>' +
      (locked
        ? '<div class="arch-body">' + esc("Above your clearance. Pull it off a host via /net.") + '</div>'
        : '<div class="arch-body">' + esc(e.body) + '</div>');
    return push(app, d);
  };

  // streaming incoming line (with keyboard skip via G.term._skip)
  T._streaming = false;
  T._skip = false;
  T.incoming = function (app, who, text) {
    var d = document.createElement("div"); d.className = "line msg-line in";
    d.innerHTML = '<span class="who">' + esc(who) + '</span><span class="msg"></span>';
    push(app, d);
    var m = d.querySelector(".msg");
    if (G.REDUCED) { m.textContent = text; return Promise.resolve(); }
    T._streaming = true; T._skip = false;
    return (async function () {
      for (var i = 0; i < text.length; i++) {
        m.textContent += text[i];
        if (app === G.state.app && atBottom()) scrollDown();
        if (!T._skip) {
          var c = text[i], d2 = 16;
          if (c === "." || c === "?" || c === "!") d2 = 140;
          else if (c === "," || c === ";") d2 = 70;
          await delay(d2);
        }
      }
      T._streaming = false; T._skip = false;
    })();
  };

  T.pause = function (ms) {
    if (G.REDUCED || T._skip) return Promise.resolve();
    return delay(ms);
  };

  // clear the visible app's lines
  T.clearApp = function (app) {
    out.querySelectorAll(".line.app-" + app).forEach(function (n) { n.remove(); });
  };

  T.scrollDown = scrollDown;

  // ---- prompt ----
  G.updatePrompt = function () {
    if (!promptEl) return;
    promptEl.textContent = G.getPrompt ? G.getPrompt() : "\u203a";
  };

  // ---- init ----
  G.initDom = function () {
    out = G.dom.out = document.getElementById("output");
    input = G.dom.input = document.getElementById("cmd");
    slashmenu = G.dom.slashmenu = document.getElementById("slashmenu");
    inputbox = G.dom.inputbox = document.getElementById("inputbox");
    promptEl = G.dom.prompt = document.getElementById("prompt");
    hLoc = G.dom.hLoc = document.getElementById("hLoc");
    opId = G.dom.opId = document.getElementById("opId");
  };

  G.util = { esc: esc, delay: delay, scrollDown: scrollDown };

})(window);
