/* ============================================================
 * THE MONOMYTHIAN — engine/apps.js
 * App router + the archive / files / status / help views.
 * ============================================================ */
(function (G) {
  "use strict";
  var T = G.term;

  // ---------- prompt ----------
  G.getPrompt = function () {
    if (G.state.app === "net") return G.connectPrompt ? G.connectPrompt() : "net $";
    if (G.state.app === "archive") return "search";
    return "\u203a";
  };

  // ---------- router ----------
  G.openApp = function (app) {
    G.state.app = app;
    G.clearList();
    document.body.dataset.app = app;
    G.dom.hLoc.textContent = app;
    G.updatePrompt();

    if (app === "home") {
      // resume a paused scene that was waiting for the player to come back
      if (G.state._returnResolve) { var r = G.state._returnResolve; G.state._returnResolve = null; r(); }
      // start the current cycle if it hasn't begun
      if (G.startCurrentCycle) G.startCurrentCycle();
      T.scrollDown();
      return;
    }
    T.clearApp(app);
    if (app === "archive") renderArchive();
    else if (app === "files") renderFiles();
    else if (app === "net") G.renderConnect();
    else if (app === "status") renderStatus();
    else if (app === "help") renderHelp();
    T.scrollDown();
  };

  // ---------- archive (search only, no list) ----------
  function renderArchive() {
    T.sys("archive", "[ ARCHIVE \u2014 search ]");
    T.sys("archive", "  type a term and press enter to search the old records.");
  }
  G.queryArchive = function (term) {
    var raw = (term || "").toLowerCase().trim();
    var clean = raw.replace(/^(search|find|lookup|query)\s+/, "").trim();
    var k = clean || raw;
    var e = G.archive[k] || G.archive[raw];
    if (!G.archive[k] && G.archive[raw]) k = raw;
    T.spacer("archive");
    T.you("archive", "search " + k);
    if (!e) { T.sys("archive", '  no record found for "' + k + '".'); return; }
    var locked = e.tier > 1 && !G.state.unlocked[k];
    T.archiveBlock("archive", k, locked);
    if (!locked) G.resolveObjective("archive", k);
  };

  // ---------- files (downloads only) ----------
  G.saveFile = function (name, body) {
    if (G.state.files.some(function (f) { return f.name === name; })) return;
    G.state.files.push({ name: name, body: body });
    if (G.persistSave) G.persistSave();
  };
  function renderFiles() {
    T.sys("files", "[ FILES \u2014 downloaded from hosts ]");
    if (G.state.files.length === 0) { T.sys("files", "  empty. nothing downloaded yet."); G.clearList(); return; }
    T.sys("files", "  \u2191\u2193 + enter to open \u00b7 or type a file's name.");
    T.spacer("files");
    var rows = [], actions = [];
    G.state.files.forEach(function (f, i) {
      var r = document.createElement("div"); r.className = "line row app-files";
      var tag = G.isMedia(f.body) ? '<span class="c1"> ' + G.util.esc(f.body.type) + '</span>' : '';
      r.innerHTML = '<span class="c1">' + String(i).padStart(3, "0") + '</span><span>' + G.util.esc(f.name) + '</span>' + tag;
      G.dom.out.appendChild(r); rows.push(r); actions.push(function () { openFile(f.name); });
    });
    G.registerList(rows, actions);
  }
  function openFile(name) {
    var raw = (name || "").toLowerCase().trim();
    var clean = raw.replace(/^(open|cat|read|view|get)\s+/, "").trim();
    var f = G.state.files.find(function (x) {
      var fn = x.name.toLowerCase();
      return fn === clean || fn === raw;
    });
    var displayName = f ? f.name : (clean || raw);
    T.spacer("files"); T.you("files", "open " + displayName);
    if (!f) { T.sys("files", "  no such file."); return; }
    if (G.isMedia(f.body)) {
      T.mediaStub("files", f.name, f.body);
      T.download("files", f.name, f.body);   // leaves the game; the browser takes it
      return;
    }
    T.plain("files", "  " + f.body);
  }
  G.openFileByName = openFile;

  // ---------- send (home) ----------
  // Transmit a download to him over the open band. Only /files content can
  // leave the terminal — the vault's records stay put unless you pulled them
  // first. A "send" objective (otype:"send", target:<filename>) gates on it.
  G.sendFile = function (name) {
    var A = "home";
    T.you(A, ("send " + name).trim());
    if (!name) { T.sys(A, "  send <filename> — transmit a file from /files over the band."); return; }
    var f = G.state.files.find(function (x) { return x.name.toLowerCase() === name.toLowerCase(); });
    if (!f) { T.sys(A, "  nothing by that name in /files. only downloaded files can be sent."); return; }
    if (!G.state.contact) { T.sys(A, "  no open channel. there is no one to send to."); return; }
    var tag = G.isMedia(f.body) ? " · " + f.body.type + " · " + f.body.size : "";
    T.sys(A, "  [ tx · " + f.name + tag + " → band 121.5 ]");
    if (G.resolveObjective("send", f.name)) return;      // the scene takes it from here
    var o = G.state._objective;
    if (o && o.type === "send" && o.nudge) { G.speakNudge(o); return; }  // wrong file: he says what he needs
    T.sys(A, "  no acknowledgement.");
  };

  // ---------- status ----------
  function renderStatus() {
    var s = G.state;
    T.sys("status", "[ STATUS ]"); T.spacer("status");
    T.plain("status", "  operator     " + (s.username || "\u2014") + "  (low-clearance archivist)");
    T.plain("status", "  clearance    tier-1 (restricted)");
    T.plain("status", "  cycle        " + (s.cycleIndex + 1) + " of " + G.cycles.length);
    T.plain("status", "  channel      " + (s.contact ? "OPEN \u2014 band 121.5 \u2014 HERETICAL" : (s.pilotStarted ? "opening" : "\u2014")));
    T.plain("status", "  downloads    " + s.files.length + " file" + (s.files.length === 1 ? "" : "s"));
    T.plain("status", "  connection   " + (s.hack.loc ? "connected \u2192 " + s.hack.loc : (s.hack.auth ? "authenticating \u2192 " + s.hack.auth.ip : "idle")));
    var un = Object.keys(s.unlocked).filter(function (k) { return s.unlocked[k]; });
    T.plain("status", "  unlocked     " + (un.join(", ") || "\u2014"));
  }

  // ---------- help ----------
  function renderHelp() {
    T.sys("help", "[ COMMANDS ]"); T.spacer("help");
    G.COMMANDS.forEach(function (c) { T.plain("help", "  /" + (c.cmd + "          ").slice(0, 10) + c.desc); });
    T.spacer("help");
    T.sys("help", "  in home: type your reply in your own words and press enter.");
    T.sys("help", "  in home: send <filename> \u2014 transmit a /files download over the band.");
    T.sys("help", "  in archive: type a term to search the records.");
    T.sys("help", "  in files: \u2191\u2193 + enter, or type a filename, to open a download.");
    T.sys("help", "  in net: type commands (scan, connect, login, ls, cat\u2026). type help inside it.");
    T.sys("help", "  reset  \u2014 wipe the save and restart from first contact.");
    T.sys("help", "  a refresh keeps your progress; reset is the only full restart.");
  }

})(window.G);
