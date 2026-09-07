/* Loads engine + content under a minimal DOM shim and validates
   that the Act 1 content is internally consistent. Not a game run;
   a data-integrity check. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// --- minimal DOM/window shim ---
function fakeEl() {
  return {
    classList: { add(){}, remove(){}, toggle(){}, contains(){return false;} },
    style: {}, dataset: {},
    set innerHTML(v){}, get innerHTML(){return "";},
    set textContent(v){}, get textContent(){return "";},
    appendChild(){}, replaceWith(){}, cloneNode(){return fakeEl();},
    querySelector(){return fakeEl();}, querySelectorAll(){return [];},
    addEventListener(){}, scrollIntoView(){}, focus(){},
    scrollHeight:0, scrollTop:0, clientHeight:0, value:""
  };
}
const win = {};
win.window = win;
win.matchMedia = () => ({ matches: false });
win.document = {
  readyState: "complete",
  body: { dataset: {} },
  addEventListener(){}, getElementById(){ return fakeEl(); }, createElement(){ return fakeEl(); }
};
win.setTimeout = setTimeout; win.location = { reload(){} };

const ctx = vm.createContext(win);

const files = [
  "src/engine/core.js","src/engine/ui.js","src/engine/apps.js",
  "src/engine/connect.js","src/engine/scene.js",
  "src/content/archive-data.js","src/content/hosts.js",
  "src/content/cycles/cycle1.js","src/content/cycles/cycle2.js",
  "src/content/cycles/cycle3.js","src/content/cycles/cycle4.js",
  "src/content/cycles/cycle5.js","src/content/cycles/cycle6.js",
"src/content/cycles/cycle7.js","src/content/cycles/cycle8.js"
];
for (const f of files) {
  const code = fs.readFileSync(path.join(__dirname, f), "utf8");
  vm.runInContext(code, ctx, { filename: f });
}

const G = win.G;
let fails = 0;
function ok(cond, msg){ if(!cond){ console.log("  FAIL:", msg); fails++; } }

// cycles
ok(G.cycles.length === 8, "8 cycles registered (got " + G.cycles.length + ")");
G.cycles.forEach((c, i) => {
  ok(Array.isArray(c.steps) && c.steps.length > 0, "cycle " + (i+1) + " has steps");
});

// walk every step recursively; validate references
function walk(steps, cyc){
  steps.forEach(s => {
    if (s.t === "choice" || s.t === "reply") s.opts.forEach(o => { ok(Array.isArray(o.steps), cyc+" opt has steps"); walk(o.steps||[], cyc); });
    if (s.t === "if") { walk(s.then||[], cyc); walk(s.else||[], cyc); }
    if (s.t === "objective") {
      ok(["archive","file","host","send"].includes(s.otype), cyc+" objective otype valid: "+s.otype);
      if (s.otype === "host") ok(!!G.hosts[s.target], cyc+" objective host exists: "+s.target);
      if (s.otype === "archive") ok(!!G.archive[s.target], cyc+" objective archive key exists: "+s.target);
      if (s.otype === "send") {
        // only /files content can be sent, so the target must be downloadable
        ok(Object.values(G.hosts).some(h => s.target in h.files),
           cyc+" send target is downloadable from a host: "+s.target);
        ok(!!s.nudge, cyc+" send objective has a nudge (the command must be taught in-character)");
      }
    }
    if (s.t === "unlock") ok(!!G.archive[s.key], cyc+" unlock key exists: "+s.key);
    if (s.t === "host") ok(!!G.hosts[s.ip], cyc+" host exists: "+s.ip);
    if (s.t === "reply") {
      const hasDefault = s.opts.some(o => o.default);
      ok(hasDefault || !!s.reprompt, cyc+" reply is resolvable (has default or reprompt)");
      s.opts.forEach(o => ok(o.default || (Array.isArray(o.keywords) && o.keywords.length>0),
        cyc+" reply opt has keywords or is default"));
    }
  });
}
G.cycles.forEach((c,i)=>walk(c.steps, "c"+(i+1)));

// ---- keyword-collision lint ----
// Within a single reply, no two OPTIONS may lay claim to the same typed word:
//  (a) the same keyword (after the matcher's normalization) in two options is
//      pure ambiguity — list order decides silently;
//  (b) two single-word keywords in different options that the runtime word-hit
//      rule (exact, or prefix at 4+ chars) can both satisfy from one typed word
//      collide the same way. ("pay" vs "pay for this" across options is FINE —
//      specificity scoring resolves it — but "stay" vs "staying" across
//      options is not.)
// Duplicates inside one option are harmless and not flagged.
function kwNorm(k){
  return String(k).toLowerCase().replace(/['’]/g,"").replace(/[^a-z0-9\s]/g," ")
    .split(/\s+/).filter(Boolean);
}
function kwWordHit(kw, tw){ return tw === kw || (kw.length >= 4 && tw.indexOf(kw) === 0); }
function lintReplyKeywords(steps, cyc){
  steps.forEach(s => {
    if (s.t === "reply" || s.t === "choice"){
      const norm = s.opts.map(o => (o.keywords || []).map(k => ({ raw: k, w: kwNorm(k) })));
      norm.forEach((list, oi) => list.forEach(k => {
        ok(k.w.length > 0, cyc + " keyword survives the sanitizer: '" + k.raw + "'");
        norm.forEach((other, oj) => {
          if (oj <= oi) return;
          other.forEach(k2 => {
            ok(k.w.join(" ") !== k2.w.join(" "),
               cyc + " keyword claimed by two options: '" + k.raw + "'");
            if (k.w.length === 1 && k2.w.length === 1)
              ok(!kwWordHit(k.w[0], k2.w[0]) && !kwWordHit(k2.w[0], k.w[0]),
                 cyc + " keywords collide across options ('" + k.raw + "' vs '" + k2.raw + "'): one typed word can hit both");
          });
        });
      }));
      s.opts.forEach(o => lintReplyKeywords(o.steps || [], cyc));
    }
    if (s.t === "if"){ lintReplyKeywords(s.then || [], cyc); lintReplyKeywords(s.else || [], cyc); }
  });
}
G.cycles.forEach((c,i)=>lintReplyKeywords(c.steps, "c"+(i+1)));

// hosts: unlock keys must exist in archive; auth hosts need creds
Object.keys(G.hosts).forEach(ip => {
  const h = G.hosts[ip];
  ok(Array.isArray(h.ports) && h.ports.length>0, ip+" has ports");
  if (h.unlocks) Object.values(h.unlocks).forEach(k => ok(!!G.archive[k], ip+" unlock -> archive key exists: "+k));
});

// tower login: password is a cross-ref (casaubon record must contain 'rebus')
const tower = G.hosts["121.5.0.1"].ports[0];
ok(tower.user==="casaubon" && tower.pass==="rebus", "tower creds casaubon/rebus");
ok(/rebus/i.test(G.archive.casaubon.body), "casaubon record hands the tower password (rebus)");

// deepstacks login: password is a riddle -> 'king of kings' -> ozymandias record -> 'ozymandias'
const stacks = G.hosts["10.0.0.9"].ports[0];
ok(stacks.user==="archivist" && stacks.pass==="ozymandias", "deepstacks creds archivist/ozymandias");
ok(/archivist/.test(G.hosts["10.0.0.4"].files["creds.log"]), "clerk relay leaks the deepstacks username");
ok(/king of kings/i.test(G.hosts["10.0.0.4"].files["creds.log"]), "clerk relay riddles the deepstacks password");
ok(!!G.archive["king of kings"], "archive resolves the 'king of kings' alias");
ok(/ozymandias/i.test(G.archive["king of kings"].body), "the aliased record hands the deepstacks password");

// substation login: split credential (username leaks on clerk, password on the duct node)
const sub = G.hosts["10.0.0.14"].ports[0];
ok(sub.user==="lineman" && sub.pass==="brownout", "substation creds lineman/brownout");
ok(/lineman/.test(G.hosts["10.0.0.4"].files["creds.log"]), "clerk relay leaks the substation username");
// CJ-SANCTIONED EXCEPTION to the media invariant: the substation pass is DICTATED.
// crew_handoff.mp3 is the only path — no text anywhere on the network spells it.
ok(G.isMedia(G.hosts["10.0.0.21"].files["crew_handoff.mp3"]), "duct node carries the shift-change recording (the only pass path)");
ok(/listen/i.test(G.hosts["10.0.0.21"].files["maint.log"]), "maint.log points the player at listening");
Object.entries(G.hosts).forEach(([ip, h]) => Object.entries(h.files).forEach(([n, v]) => {
  // (the substation's own files sit behind the login and can't leak it forward)
  if (typeof v === "string" && ip !== "10.0.0.14")
    ok(!/brownout/.test(v), "no text file spells the dictated pass: " + ip + "/" + n);
}));

// C3's image gates (CJ-sanctioned media-vital exceptions, 2026-07-09):
// the crawl route lives only in duct.png; the patrol lights only in camera7.png.
// (the second camera gate — the downed line — was cut: the still is too blurry to read it.)
const c3steps = JSON.stringify(G.cycles[2].steps).toLowerCase();
ok(c3steps.indexOf('"d6"') >= 0 && c3steps.indexOf('"ah 1"') >= 0, "c3 route gate keys on the schematic (AH-1 / D6)");
// keywords must survive the input sanitizer (it strips punctuation to spaces) — no hyphens allowed
G.cycles.forEach((c, i) => JSON.stringify(c.steps).match(/"keywords":\[[^\]]*\]/g)?.forEach(k => {
  ok(!/[a-z0-9]-[a-z0-9]/i.test(k), "c" + (i+1) + " keyword contains a hyphen the matcher can never see: " + k.slice(0, 60));
}));
ok(c3steps.indexOf('"three"') >= 0 && c3steps.indexOf("patrol") >= 0, "c3 camera gate keys on the patrol lights");
ok(c3steps.indexOf("downed") < 0, "the blurry downed-line camera gate is gone");
ok(G.isMedia(G.hosts["10.0.0.21"].files["duct.png"]), "the route gate's image stays declared on the duct node");

// C8 must clear any stale connection before its reach-the-winch-house objective,
// or a player still logged into 10.0.3.7 from C7 hits a "disconnect first" hard-lock.
{
  const c8 = G.cycles[7].steps;
  const dropIdx = c8.findIndex(s => s.t === "run");
  const objIdx = c8.findIndex(s => s.t === "objective" && s.target === "10.0.3.7");
  ok(dropIdx >= 0 && dropIdx < objIdx, "c8 drops the stale connection before its winch-house objective");
  const objStep = c8[objIdx];
  ok(objStep && !!objStep.nudge, "c8's winch-house objective has a nudge (no dead air on the home channel)");
  // prove the drop actually frees the connection
  G.state.hack = { loc: "10.0.3.7", auth: null };
  if (dropIdx >= 0) c8[dropIdx].fn(G);
  ok(G.state.hack.loc === null, "the c8 drop step actually clears hack.loc");
}
ok(G.isMedia(G.hosts["10.0.0.14"].files["camera7.png"]), "the camera gate's image stays declared on the substation");

// ferry winch house: split clue (user + riddle on the pier box) -> archive coin -> obol
const winch = G.hosts["10.0.3.7"].ports[0];
ok(winch.user==="charon" && winch.pass==="obol", "winch-house creds charon/obol");
ok(/charon/.test(G.hosts["10.0.3.2"].files["crew.txt"]), "pier box leaks the winch username");
ok(/coin/i.test(G.hosts["10.0.3.2"].files["crew.txt"]), "pier box riddles the winch password (the dead man's coin)");
ok(G.hosts["10.0.3.2"].files["crew.txt"].indexOf("10.0.3.7") >= 0, "pier box breadcrumbs the winch-house address");
ok(!!G.archive["dead man's coin"], "archive resolves the 'dead man's coin' alias");
ok(/obol/i.test(G.archive["dead man's coin"].body), "the aliased record hands the winch password");
ok(/class d/i.test(G.hosts["10.0.3.7"].files["manifest.txt"]) && /reliquary/i.test(G.hosts["10.0.3.7"].files["manifest.txt"]),
   "manifest names the cargo and the consignee");

// pen.log must NOT exist before the capture, and cycle 7 must inject it (a run step),
// readable as text, before its own file objective can gate on it
ok(!("pen.log" in G.hosts["10.0.3.7"].files), "the pens are empty until the walker is caught (no static pen.log)");
{
  const c7 = G.cycles[6].steps;
  const runIdx = c7.findIndex(s => s.t === "run" && typeof s.fn === "function");
  const objIdx = c7.findIndex(s => s.t === "objective" && s.target === "pen.log");
  ok(runIdx >= 0, "c7 has an injection step");
  ok(objIdx > runIdx, "c7 injects pen.log before gating on it");
  if (runIdx >= 0) c7[runIdx].fn(G);
  ok(typeof G.hosts["10.0.3.7"].files["pen.log"] === "string" && /pen 2: occupied/.test(G.hosts["10.0.3.7"].files["pen.log"]),
     "the injected pen.log is readable text and names pen 2");
}

// two new hosts exist and their addresses are breadcrumbed on the clerk relay
["10.0.0.21","10.0.0.31"].forEach(ip => ok(!!G.hosts[ip], "new host exists: "+ip));
["10.0.0.9","10.0.0.14","10.0.0.21","10.0.0.31","121.5.0.1"].forEach(ip =>
  ok(G.hosts["10.0.0.4"].files["hosts.txt"].indexOf(ip) >= 0, "clerk hosts.txt breadcrumbs "+ip));

// sender breadcrumb present
ok(/make contact/i.test(G.hosts["10.0.0.31"].files["drop.txt"]), "dead-drop states the 'do not make contact' order");

// easter eggs present (one per host; some relocated)
const eggs = { "10.0.0.21":"readme.md", "10.0.0.31":"master_of_unlocking.txt", "10.0.3.2":"caulk_the_wagon.txt" };
Object.entries(eggs).forEach(([ip,f]) => ok(!!G.hosts[ip].files[f], "egg present "+ip+"/"+f));

// archive tiers
ok(G.archive.babel.tier===1 && G.archive.deicide.tier===3, "archive tiers sane");

// ---- binary/media files ----
// every media descriptor is well-formed (engine needs type/size/src; desc is optional)
let mediaCount = 0;
Object.entries(G.hosts).forEach(([ip, h]) => Object.entries(h.files).forEach(([n, v]) => {
  if (v && typeof v === "object") {
    mediaCount++;
    ok(v.media === true && !!v.type && !!v.size && !!v.src,
       "media descriptor well-formed: " + ip + "/" + n);
    ok(v.src.startsWith("assets/"), "media src points into assets/: " + n);
    ok(fs.existsSync(path.join(__dirname, v.src)), "media file on disk: " + v.src);
  }
}));
ok(mediaCount > 0, "media files exist (got " + mediaCount + ")");

// INVARIANT: media never gates a puzzle or a report. Critical-path files stay
// readable text, because a download can't be read in-terminal (and audio/visual-only
// clues would lock out players who can't hear or see them).
const CRITICAL = {
  "10.0.0.4":  ["hosts.txt", "creds.log"],            // routes + credential clues
  "10.0.0.21": ["maint.log"],                          // hard-cut warning (pass itself is the sanctioned audio exception)
  "10.0.0.31": ["drop.txt", "ledger.txt"],             // C5 report gate
  "121.5.0.1": ["inbound.log", "outbound.log", "courier.txt"], // C2 report gate
  "10.0.0.9":  ["scram.txt", "quarantine.txt", "recursion.txt", "deicide.txt"], // C4 gate + unlocks
  "10.0.3.2":  ["tariff.txt", "crew.txt"],            // C6 credential clues + class-D dread
  "10.0.3.7":  ["manifest.txt", "winch.txt"],          // C6 report gate + C8 rescue (pen.log is C7-injected)
  "121.5.0.9": ["perimeter.log"],                      // banked (Act 2)
  "10.0.2.3":  ["matins.txt", "the_made.txt", "doors.txt"],    // banked (Act 2) + Wren breadcrumb
  "10.0.0.14": ["notice.txt", "breakers.txt"]         // C3 blackout clue
};
Object.entries(CRITICAL).forEach(([ip, names]) => names.forEach(n =>
  ok(typeof G.hosts[ip].files[n] === "string", "critical file stays readable text: " + ip + "/" + n)));

// unlockable archive records must be text (they're read, not downloaded)
Object.entries(G.hosts).forEach(([ip, h]) => Object.keys(h.unlocks || {}).forEach(f =>
  ok(typeof h.files[f] === "string", "archive-unlocking file is text: " + ip + "/" + f)));

console.log(fails===0 ? "SMOKE OK — content is internally consistent." : ("SMOKE: "+fails+" problem(s)."));
process.exit(fails===0?0:1);
