/* ============================================================
 * THE MONOMYTHIAN — engine/scene.js
 * Interprets a cycle's step data and runs it as a branching
 * scene. Also handles cycle-to-cycle progression.
 *
 * A cycle = { id, title, steps: [ ...step ] }
 * A step  = { t: type, ...fields }.  Supported types:
 *   sys/alert/spacer/pause
 *   in {who,v}        incoming transmission (streamed)
 *   you {v}           scripted player echo
 *   ask {store,max,fallback,echo,after}   capture typed text
 *   choice {opts:[{label,steps}]}         branching
 *   objective {otype,target,hint,thenReturn}   gate on a player action
 *   awaitReturn       wait for the player to switch back to /home
 *   unlock {key}      reveal an archive record
 *   host {ip}         add a host to known hosts
 *   creds {v}         print a system line (credentials handed over)
 *   save {name,body}  drop a file into /files
 *   set {flag,v}      set a narrative flag
 *   if {flag,eq,then,else}   branch on a flag
 *   contact {v}       set channel-open state
 *   deadEnd           stop cycle progression (a dead-end ending)
 *   run {fn}          custom function(G) escape hatch
 * ============================================================ */
(function (G) {
  "use strict";
  var T = G.term;
  var A = "home";

  function subst(text) {
    return String(text).replace(/\{name\}/g, G.state.username || "you");
  }

  async function runSteps(steps) {
    for (var i = 0; i < steps.length; i++) {
      var s = steps[i];
      switch (s.t) {
        case "sys": T.sys(A, subst(s.v)); break;
        case "alert": T.alert(A, subst(s.v)); break;
        case "spacer": T.spacer(A); break;
        case "pause": await T.pause(s.v); break;
        case "in": await T.incoming(A, s.who, subst(s.v)); break;
        case "you": T.you(A, s.v !== undefined ? subst(s.v) : (s.store ? (G.state[s.store] || "") : "")); break;

        case "ask": {
          var val = ((await G.input.askText()) || "").trim();
          if (s.max) val = val.slice(0, s.max);
          if (!val && s.fallback) val = s.fallback;
          if (s.store) G.state[s.store] = val;
          if (s.store === "username" && G.dom.opId) G.dom.opId.textContent = val;
          if (s.echo !== false) T.you(A, val);
          if (s.after) T.sys(A, s.after.replace("{}", val));
          break;
        }

        case "reply":
        case "choice": {
          var idx = await G.input.reply(s.opts, s.reprompt);
          T.spacer(A);
          await runSteps(s.opts[idx].steps || []);
          break;
        }

        case "objective": {
          await G.input.awaitObjective({ type: s.otype, target: s.target, nudge: s.nudge });
          if (s.thenReturn) await G.input.awaitReturn();
          break;
        }
        case "awaitReturn": await G.input.awaitReturn(); break;

        case "unlock": G.state.unlocked[s.key] = true; break;
        case "host": if (G.state.knownHosts.indexOf(s.ip) < 0) G.state.knownHosts.push(s.ip); break;
        case "creds": T.sys(A, subst(s.v)); break;
        case "save": G.saveFile(s.name, s.body); break;
        case "set": G.state.flags[s.flag] = (s.v === undefined ? true : s.v); break;
        case "contact": G.state.contact = (s.v === undefined ? true : s.v); break;
        case "deadEnd": G.state.flags.deadEnd = true; break;

        case "if": {
          var want = (s.eq === undefined ? true : s.eq);
          var cond = G.state.flags[s.flag] === want;
          await runSteps(cond ? (s.then || []) : (s.else || []));
          break;
        }

        case "run": if (typeof s.fn === "function") await s.fn(G); break;

        default: /* ignore unknown */ break;
      }
      if (G.persistSave) G.persistSave();
    }
  }
  G.runSteps = runSteps;

  // ---------- cycle progression ----------
  G.startCurrentCycle = function () {
    var i = G.state.cycleIndex;
    if (i >= G.cycles.length) return;
    if (G.state.cycleStarted[i]) return;
    G.state.cycleStarted[i] = true;
    if (i === 0) G.state.pilotStarted = true;
    var cyc = G.cycles[i];
    runSteps(cyc.steps).then(function () {
      if (G.state.flags.deadEnd) { if (G.persistSave) G.persistSave(); return; }
      if (i < G.cycles.length - 1) {
        G.state.cycleIndex = i + 1; // next cycle begins on the next return to /home
      }
      if (G.persistSave) G.persistSave();
    }).catch(function (err) {
      T.alert(A, "[ scene fault: " + ((err && err.message) || err) + " ]  type reset to restart.");
    });
  };

})(window.G);
