/* ============================================================
 * THE MONOMYTHIAN — engine/ui.js
 * Input routing. The player TYPES everything, Vigil-Files style.
 * In /home their message is echoed and matched against keywords
 * to choose the reply/branch. No multiple-choice menus. No gray
 * hint lines \u2014 guidance, if any, comes in-character from him.
 * ============================================================ */
(function (G) {
  "use strict";
  var T = G.term;

  var listNav = null; // {rows, actions, sel}

  G.input = {};

  // ---------- free-text reply (home) ----------
  // opts: [ { keywords:[...], steps:[...] }, { default:true, steps:[...] } ]
  // reprompt: an in-character line spoken if nothing matches and no default.
  G.input.reply = function (opts, reprompt) {
    return new Promise(function (resolve) {
      G.state._reply = { opts: opts, reprompt: reprompt, resolve: resolve };
    });
  };

  // How matching works (word-based, not raw substring):
  //  - apostrophes vanish before punctuation strips, so typed "don't" becomes
  //    "dont" and matches the surface-voice keywords
  //  - a keyword word hits a text word exactly, or as a prefix when the keyword
  //    word is 4+ chars ("stay" -> "stayin"/"staying", "apolog" -> "apology");
  //    short words never hit inside longer ones ("no" no longer hits "know",
  //    "us" no longer hits "just")
  //  - a hit is discarded when a negator reaches it: same clause, up to six
  //    words back ("i dont think you should turn back" no longer votes for
  //    "turn back"). Punctuation and but/however/though end a clause, so the
  //    negation in one clause can't poison the next ("i dont know, three rigs
  //    on the road" still counts "three"). Keywords that carry their own
  //    negation ("dont stop", "no contact") are exempt and mean what they say.
  //  - a keyword written "=word" matches ONLY when it is the entire reply.
  //    That lets a gate accept a bare "us" or "you" from a terse player
  //    without that word matching inside every longer sentence.
  //  - the most specific hit wins (whole-reply, then more words, then longer),
  //    not the earliest option ("pay for this" outbids "pay"); ties keep order
  var NEGATORS = {};
  ("dont not no never aint wont cant cannot nothin nothing nobody noone neither without " +
   "isnt doesnt didnt wasnt werent wouldnt couldnt shouldnt nope nah").split(" ")
    .forEach(function (w) { NEGATORS[w] = true; });
  // turns of phrase that negate whatever follows them in the clause
  var NEGATOR_PHRASES = ["instead of", "rather than"]
    .map(function (p) { return p.split(" "); });
  var CLAUSE_BREAKERS = { but: 1, however: 1, though: 1, although: 1 };
  // a negator's reach ends at these: it can't cross into a sub-clause or a new
  // conjunct. "im not sure WHAT it means" must not negate "means"; "i dont
  // trust them AND you should turn back" must not negate "turn back".
  var SCOPE_ENDERS = {};
  ("what that which who whom whose how why when where if whether because since unless " +
   "until while before after and or so then yet").split(" ")
    .forEach(function (w) { SCOPE_ENDERS[w] = true; });
  var NEG_REACH = 6;   // how many words forward a negator can reach

  // lowercase; apostrophes vanish ("don't" -> "dont"); , . ; : ! ? end a clause
  function tokenize(text) {
    var s = String(text).toLowerCase()
      .replace(/[\u2019']/g, "")
      .replace(/[,.;:!?]+/g, " | ")
      .replace(/[^a-z0-9\s|]/g, " ");
    var raw = s.split(/\s+/), words = [], clause = [], c = 0;
    for (var i = 0; i < raw.length; i++) {
      var w = raw[i];
      if (!w) continue;
      if (w === "|") { c++; continue; }
      if (CLAUSE_BREAKERS[w]) c++;
      words.push(w); clause.push(c);
    }
    return { words: words, clause: clause };
  }
  function wordHit(kw, tw) {
    return tw === kw || (kw.length >= 4 && tw.indexOf(kw) === 0);
  }
  // is the hit starting at i reached by a negator? walk backwards from the hit
  // and stop at the first thing that closes the negator's scope.
  function negatedAt(tk, i) {
    var stop = Math.max(0, i - NEG_REACH);
    for (var b = i - 1; b >= stop; b--) {
      if (tk.clause[b] !== tk.clause[i]) break;   // a different clause: out of reach
      if (SCOPE_ENDERS[tk.words[b]]) break;       // sub-clause or new conjunct: out of reach
      if (NEGATORS[tk.words[b]]) return true;
      // "too X to Y" means not-Y: "too far to turn back", "too much of the way to give it up"
      if (tk.words[b] === "too" && tk.words[i - 1] === "to") return true;
      for (var p = 0; p < NEGATOR_PHRASES.length; p++) {
        var ph = NEGATOR_PHRASES[p], hit = true;
        for (var j = 0; j < ph.length; j++) {
          if (tk.words[b + j] !== ph[j]) { hit = false; break; }
        }
        if (hit) return true;
      }
    }
    return false;
  }
  // best score for one keyword against the text; 0 = absent (or only negated)
  function keywordScore(kwWords, tk, exempt) {
    var tw = tk.words;
    for (var i = 0; i + kwWords.length <= tw.length; i++) {
      var hit = true;
      for (var j = 0; j < kwWords.length; j++) {
        if (!wordHit(kwWords[j], tw[i + j])) { hit = false; break; }
      }
      if (!hit) continue;
      if (!exempt && negatedAt(tk, i)) continue; // this one's negated; try a later one
      return kwWords.length * 100 + kwWords.join(" ").length;
    }
    return 0;
  }
  function matchReply(text, opts) {
    var tk = tokenize(text);
    var whole = tk.words.join(" ");
    var best = -1, bestScore = 0, def = -1;
    opts.forEach(function (o, i) {
      if (o.default) def = i;
      if (!o.keywords) return;
      for (var k = 0; k < o.keywords.length; k++) {
        var raw = o.keywords[k], s = 0;
        if (raw.charAt(0) === "=") {                 // whole-reply keyword
          var want = tokenize(raw.slice(1)).words.join(" ");
          s = (whole === want) ? 1000 + want.length : 0;
        } else {
          var kwWords = tokenize(raw).words;
          if (!kwWords.length) continue;
          var exempt = false;
          for (var j = 0; j < kwWords.length; j++) {
            if (NEGATORS[kwWords[j]]) { exempt = true; break; }
          }
          s = keywordScore(kwWords, tk, exempt);
        }
        if (s > bestScore) { bestScore = s; best = i; }
      }
    });
    return best >= 0 ? best : def;
  }
  G._matchReply = matchReply; // exposed for the headless test rigs

  function handleReply(text) {
    var r = G.state._reply;
    G.state._reply = null;
    T.you("home", text);
    var idx = matchReply(text, r.opts);
    if (idx < 0) {
      // nothing matched \u2014 nudge in-character and wait again
      G.state._reply = r;
      T.incoming("home", "mono", r.reprompt || "say that plainer for me.");
      return;
    }
    r.resolve(idx);
  }

  // ---------- free-text capture (username) ----------
  G.input.askText = function () {
    return new Promise(function (res) { G.state._inputResolve = res; });
  };

  // ---------- nudges ----------
  // a nudge may be a string or an array — arrays rotate so asking twice
  // doesn't get the same line twice, verbatim, like a machine would.
  G.speakNudge = function (o) {
    var n = o.nudge;
    if (Array.isArray(n)) {
      o._nudgeIdx = o._nudgeIdx || 0;
      n = n[o._nudgeIdx % n.length];
      o._nudgeIdx++;
    }
    T.incoming("home", "mono", n);
  };

  // ---------- objectives (do X elsewhere to continue) ----------
  G.input.awaitObjective = function (obj) {
    return new Promise(function (res) {
      obj.resolve = res; G.state._objective = obj;
      // Reaching a host you already occupy is trivially satisfied — don't make the
      // player disconnect and reconnect to a node they're already standing on.
      if (obj.type === "host" && G.state.hack && G.state.hack.loc === obj.target) {
        Promise.resolve().then(function () {
          if (G.state._objective === obj) { G.state._objective = null; res(); }
        });
      } else if (obj.type === "file" && G.state.files.some(function (f) { return f.name === obj.target; })) {
        Promise.resolve().then(function () {
          if (G.state._objective === obj) { G.state._objective = null; res(); }
        });
      }
    });
  };
  G.resolveObjective = function (type, value) {
    var o = G.state._objective;
    if (o && o.type === type && o.target === value) { G.state._objective = null; o.resolve(); return true; }
    return false;
  };

  // ---------- wait for return to /home ----------
  G.input.awaitReturn = function () {
    return new Promise(function (res) {
      // already home? nothing to wait for. (matters when the objective before this
      // resolved without the player ever leaving /home.)
      if (G.state.app === "home") { res(); return; }
      G.state._returnResolve = res;
    });
  };

  // ---------- file list navigation ----------
  G.registerList = function (rows, actions) {
    if (!rows || !rows.length) { listNav = null; return; }
    listNav = { rows: rows, actions: actions, sel: 0 };
    rows.forEach(function (r) { r.classList.remove("sel"); });
    rows[0].classList.add("sel");
    // touch/mouse: tapping a row selects and opens it (keyboard nav still works)
    rows.forEach(function (r, i) {
      r.addEventListener("click", function (ev) {
        ev.stopPropagation(); // don't pop the keyboard on touch
        if (!listNav || listNav.rows !== rows) return;
        listNav.rows[listNav.sel].classList.remove("sel");
        listNav.sel = i;
        r.classList.add("sel");
        listPick(i);
      });
    });
  };
  G.clearList = function () { listNav = null; };
  function listMove(dir) {
    if (!listNav) return;
    listNav.rows[listNav.sel].classList.remove("sel");
    listNav.sel = (listNav.sel + dir + listNav.rows.length) % listNav.rows.length;
    var r = listNav.rows[listNav.sel]; r.classList.add("sel"); r.scrollIntoView({ block: "nearest" });
  }
  function listPick(i) {
    if (!listNav) return;
    if (i == null) i = listNav.sel;
    if (i < 0 || i >= listNav.actions.length) return;
    listNav.actions[i]();
  }

  // ---------- slash-command menu ----------
  var COMMANDS = G.COMMANDS = [
    { cmd: "home", desc: "the channel \u2014 talk to him" },
    { cmd: "archive", desc: "search the old records" },
    { cmd: "net", desc: "scan & connect to hosts" },
    { cmd: "files", desc: "files you've downloaded" },
    { cmd: "status", desc: "operator status" },
    { cmd: "help", desc: "all commands" },
    { cmd: "clear", desc: "clear this view" }
  ];
  var CMD_TO_APP = { home: "home", archive: "archive", net: "net", files: "files", status: "status", help: "help" };

  var menuItems = [], menuSel = 0;
  function slashOpen() { return G.dom.slashmenu.classList.contains("open"); }
  function closeSlash() { G.dom.slashmenu.classList.remove("open"); G.dom.slashmenu.innerHTML = ""; menuSel = 0; }
  function renderSlash(filter) {
    var f = filter.replace(/^\//, "").toLowerCase();
    menuItems = COMMANDS.filter(function (c) { return c.cmd.indexOf(f) === 0; });
    if (!menuItems.length) { closeSlash(); return; }
    menuSel = Math.min(menuSel, menuItems.length - 1);
    var sm = G.dom.slashmenu; sm.innerHTML = "";
    menuItems.forEach(function (c, i) {
      var d = document.createElement("div"); d.className = "smi" + (i === menuSel ? " sel" : "");
      d.innerHTML = '<span class="cmd">/' + c.cmd + '</span><span class="desc">' + G.util.esc(c.desc) + '</span>';
      // touch/mouse: tapping a menu row runs the command (keyboard nav still works)
      d.addEventListener("click", function (ev) {
        ev.stopPropagation();
        G.dom.input.value = "";
        closeSlash();
        runCommand(c.cmd);
      });
      sm.appendChild(d);
    });
    sm.classList.add("open");
  }

  function runCommand(cmd) {
    cmd = cmd.toLowerCase();
    if (cmd === "clear") { T.clearApp(G.state.app); if (G.state.app !== "home") G.openApp(G.state.app); return; }
    var app = CMD_TO_APP[cmd];
    if (app) { G.openApp(app); return; }
    T.plain(G.state.app, "  unknown command: /" + cmd + "   (try /help)");
  }

  // ---------- submit ----------
  function submit() {
    var raw = G.dom.input.value;
    var v = raw.trim().toLowerCase();   // the terminal speaks small letters only
    G.dom.input.value = "";
    if (slashOpen()) closeSlash();
    if (v === "") return;

    if (v === "reset") {
      if (G.state && G.state.flags && G.state.flags.deadEnd) {
        if (G.clearSave) G.clearSave(); location.reload(); return;
      }
      T.alert(G.state.app, "  [ WARNING: this will wipe all progress and restart from cycle 1. ]");
      T.alert(G.state.app, "  [ type  reset confirm  to permanently erase your save. ]");
      return;
    }
    if (v === "reset confirm" || v === "reset --force") {
      if (G.clearSave) G.clearSave(); location.reload(); return;
    }

    // username capture
    if (G.state._inputResolve) { var cb = G.state._inputResolve; G.state._inputResolve = null; cb(v); return; }
    if (v.charAt(0) === "/") { runCommand(v.slice(1).trim()); return; }

    if (G.state.app === "archive") { G.queryArchive(v); return; }
    if (G.state.app === "net") { G.hackCommand(v); return; }
    if (G.state.app === "files") { G.openFileByName(v); return; }

    if (G.state.app === "home") {
      // send <file> — transmit a download over the band. while he's waiting on
      // an ANSWER, only an exact /files name is treated as a send, so replies
      // that merely start with the word "send" still reach the conversation.
      if (v === "send") { G.sendFile(""); return; }
      if (v.indexOf("send ") === 0) {
        var sarg = v.slice(5).trim();
        var known = G.state.files.some(function (f) { return f.name.toLowerCase() === sarg; });
        if (known || !G.state._reply) { G.sendFile(sarg); return; }
      }
      if (G.state._reply) { handleReply(v); return; }
      if (G.state._objective) {
        // he's waiting on you to go do something; answer him in-character
        T.you("home", v);
        var o = G.state._objective;
        if (o.nudge) G.speakNudge(o);
        return;
      }
      // idle channel \u2014 no gray chatter
      return;
    }
    T.plain(G.state.app, "  nothing to do here. type / to switch apps.");
  }
  G._submit = submit;

  // ---------- wire events ----------
  G.wireInput = function () {
    var input = G.dom.input;

    input.addEventListener("input", function () {
      var v = input.value;
      if (!G.state._inputResolve && v.charAt(0) === "/") renderSlash(v); else closeSlash();
    });

    input.addEventListener("keydown", function (e) {
      if (slashOpen()) {
        if (e.key === "ArrowDown") { e.preventDefault(); menuSel = (menuSel + 1) % menuItems.length; renderSlash(input.value); return; }
        if (e.key === "ArrowUp") { e.preventDefault(); menuSel = (menuSel - 1 + menuItems.length) % menuItems.length; renderSlash(input.value); return; }
        if (e.key === "Tab") { e.preventDefault(); input.value = "/" + menuItems[menuSel].cmd; renderSlash(input.value); return; }
        if (e.key === "Enter") { e.preventDefault(); runCommand(menuItems[menuSel].cmd); input.value = ""; closeSlash(); return; }
        if (e.key === "Escape") { closeSlash(); return; }
      }
      // files list nav
      if (G.state.app === "files" && listNav && input.value === "") {
        if (e.key === "ArrowDown") { e.preventDefault(); listMove(1); return; }
        if (e.key === "ArrowUp") { e.preventDefault(); listMove(-1); return; }
        if (e.key === "Enter") { e.preventDefault(); listPick(); return; }
        if (/^[1-9]$/.test(e.key)) { e.preventDefault(); listPick(parseInt(e.key, 10) - 1); return; }
      }
      // skip a streaming line
      if (T._streaming && input.value === "" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); T._skip = true; return; }
      if (e.key === "Enter") { e.preventDefault(); submit(); }
    });

    document.addEventListener("click", function () { input.focus(); });
    window.addEventListener("load", function () { input.focus(); });
  };

})(window.G);
