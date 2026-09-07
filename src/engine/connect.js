/* ============================================================
 * THE MONOMYTHIAN — engine/connect.js
 * The /net intrusion shell: recon a host, get in with found
 * credentials, read & download files. No brute force, no trace.
 * ============================================================ */
(function (G) {
  "use strict";
  var T = G.term;
  function S(t) { T.sys("net", t); }

  G.connectPrompt = function () {
    var h = G.state.hack;
    if (h.auth) return "login:";
    if (h.loc) return h.loc + " $";
    return "net $";
  };

  G.renderConnect = function () {
    var h = G.state.hack;
    S("[ NET \u2014 intrusion shell ]");
    S("  you need an address to scan. they aren't listed here \u2014");
    S("  addresses turn up in what people tell you, and in the files you read.");
    S("  scan \u00b7 connect \u00b7 login \u00b7 ls \u00b7 cat \u00b7 disconnect \u00b7 help");
    if (h.loc) { T.spacer("net"); S("  (connected: " + G.hosts[h.loc].name + ")"); }
  };

  function echo(v) { T.plain("net", G.connectPrompt() + " " + v, "sys"); }

  function reachable(ip) {
    var host = G.hosts[ip];
    if (!host) return "no route to host.";
    if (host.surface && !G.state.contact) return "no carrier. the surface is unreachable without an open channel.";
    return null;
  }

  G.hackCommand = function (v) {
    var h = G.state.hack;
    var parts = v.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    echo(v);
    if (cmd === "help") return help();
    if (cmd === "hosts" || cmd === "targets") { S("  no directory. an address is something you find \u2014 in a file, or from someone who knows one."); return; }

    if (h.loc) { // connected
      if (cmd === "ls") return ls();
      if (cmd === "cat" || cmd === "get" || cmd === "download") return cat(parts[1]);
      if (cmd === "disconnect" || cmd === "exit" || cmd === "logout") { S("  connection to " + h.loc + " closed."); h.loc = null; G.updatePrompt(); return; }
      if (cmd === "scan" || cmd === "connect") { S("  disconnect first."); return; }
      S("  " + cmd + ": not found here. (ls \u00b7 cat <file> \u00b7 disconnect)"); return;
    }
    if (h.auth) { // mid-auth
      if (cmd === "login") return login(parts[1], parts[2]);
      if (cmd === "cancel" || cmd === "exit") { S("  cancelled."); h.auth = null; G.updatePrompt(); return; }
      S("  authentication required. login <user> <pass>   (or cancel)"); return;
    }
    if (cmd === "scan") return scan(parts[1]);
    if (cmd === "connect") return connect(parts[1]);
    if (cmd === "login") { S("  connect to a host first."); return; }
    S("  " + cmd + ": not found. type help.");
  };

  function scan(ip) {
    if (!ip) return S("  usage: scan <ip>");
    var host = G.hosts[ip];
    if (!host) return S("  " + ip + ": no route to host.");
    var err = reachable(ip); if (err) return S("  " + err);
    if (G.state.knownHosts.indexOf(ip) < 0) G.state.knownHosts.push(ip);
    S("  PORT  SERVICE   STATE");
    host.ports.forEach(function (p) {
      var label = p.auth ? (p.user ? "auth required" : "auth required (no known credentials)") : "open (anonymous)";
      S("  " + (String(p.n || "--") + "     ").slice(0, 5) + " " + (p.svc + "         ").slice(0, 9) + " " + label);
    });
  }
  function connect(ip) {
    if (!ip) return S("  usage: connect <ip>");
    var host = G.hosts[ip];
    if (!host) return S("  " + ip + ": no route to host.");
    var err = reachable(ip); if (err) return S("  " + err);
    var p = host.ports[0];
    if (!p.auth) {
      G.state.hack.loc = ip; G.updatePrompt();
      S("  connected to " + host.name + " (" + ip + "). anonymous access.");
      S("  ls to list files.");
      G.resolveObjective("host", ip);
      return;
    }
    G.state.hack.auth = { ip: ip }; G.updatePrompt();
    S("  " + host.name + " requires authentication.");
    if (p.user) S("  login <user> <pass>");
    else S("  no credentials on record. you'll need them from somewhere.");
  }
  function login(user, pass) {
    var h = G.state.hack; if (!h.auth) return S("  nothing to authenticate.");
    var host = G.hosts[h.auth.ip]; var p = host.ports[0];
    if (!user || !pass) return S("  usage: login <user> <pass>");
    if (p.user && user === p.user && pass === p.pass) {
      h.loc = h.auth.ip; h.auth = null; G.updatePrompt();
      S("  access granted.");
      S("  ls to list files.");
      G.resolveObjective("host", h.loc);
    } else {
      S("  access denied.");
    }
  }
  function ls() {
    var host = G.hosts[G.state.hack.loc];
    var names = Object.keys(host.files);
    if (!names.length) return S("  (empty)");
    names.forEach(function (n) { S("  " + n); });
  }
  function cat(name) {
    if (!name) return S("  usage: cat <file>");
    var host = G.hosts[G.state.hack.loc];
    var body = host.files[name];
    if (body == null) return S("  " + name + ": no such file.");
    T.spacer("net");
    if (G.isMedia(body)) {
      T.mediaStub("net", name, body);          // it isn't text. don't dump bytes.
      T.plain("net", "  \u203a saved to /files \u2014 download to open.", "sys");
    } else {
      T.plain("net", "  " + body);
    }
    T.spacer("net");
    var had = G.state.files.some(function (f) { return f.name === name; });
    G.saveFile(name, body);
    if (!had && !G.isMedia(body)) S("  [ downloaded \u2192 files/" + name + " ]");
    var key = host.unlocks && host.unlocks[name];
    if (key && !G.state.unlocked[key]) {
      G.state.unlocked[key] = true;
      S("  [ archive updated: " + G.archive[key].title + " ]");
    }
    G.resolveObjective("file", name);
  }
  function help() {
    S("  recon");
    S("    scan <ip>            list a host's open ports  (you supply the address)");
    S("  access");
    S("    connect <ip>        open a connection");
    S("    login <user> <pass> authenticate \u2014 find the creds, don't guess");
    S("  on a host");
    S("    ls                  list files");
    S("    cat <file>          read a file \u2014 or inspect one that isn't text");
    S("    disconnect          drop the connection");
  }

  var _hack = G.hackCommand;
  G.hackCommand = function (v) {
    var r = _hack(v);
    if (G.persistSave) G.persistSave();
    return r;
  };

})(window.G);
