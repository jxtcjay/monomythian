/* ============================================================
 * THE MONOMYTHIAN — main.js
 * Boot. Wires the DOM, input, and starts the first cycle.
 * Loaded last, after engine + content.
 * ============================================================ */
(function (G) {
  "use strict";
  function boot() {
    G.initDom();
    G.wireInput();
    var resumed = G.restoreSave && G.restoreSave();
    if (resumed && G.state.username && G.dom.opId) G.dom.opId.textContent = G.state.username;
    G.updatePrompt();
    G.openApp("home"); // starts the current cycle via startCurrentCycle
    if (resumed && G.term) {
      var who = G.state.username ? " \u2014 " + G.state.username : "";
      if (G.state.flags.deadEnd) {
        G.term.sys("home", "[ session restored" + who + ". this line is closed. type reset to begin again. ]");
      } else {
        G.term.sys("home", "[ session restored" + who + ". type reset to start over. ]");
      }
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window.G);
