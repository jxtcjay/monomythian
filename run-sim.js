/* Runs the REAL engine headlessly: executes every cycle's steps
   through runSteps (auto-answering choices/asks/objectives) and
   drives a live /net pivot, to surface runtime errors. */
const fs = require("fs"), path = require("path"), vm = require("vm");

const created = [];   // every element the engine builds (lets us assert on <a> downloads)
function fakeEl(tag){
  const node = {
    tag: tag || "div", attrs:{},
    _kids: [], classList:{add(){},remove(){},toggle(){},contains(){return false;}},
    style:{}, dataset:{}, innerHTML:"", textContent:"", value:"", href:"", download:"",
    scrollHeight:0, scrollTop:0, clientHeight:0,
    appendChild(c){ node._kids.push(c); return c; }, setAttribute(k,v){ node.attrs[k]=v; },
    replaceWith(){}, cloneNode(){return fakeEl(tag);},
    querySelector(){ return fakeEl(); }, querySelectorAll(){ return []; },
    addEventListener(){}, scrollIntoView(){}, focus(){}, click(){ node.clicked = true; }
  };
  created.push(node);
  return node;
}
const ids = {};
["output","cmd","slashmenu","inputbox","prompt","hLoc","opId"].forEach(id => ids[id]=fakeEl());

const win = {};
win.window = win;
win.matchMedia = () => ({ matches: true }); // REDUCED -> instant text, no timers
win.setTimeout = (fn)=>fn();                 // resolve pauses instantly
win.location = { reload(){} };
const mem = {};
win.localStorage = {
  getItem(k){ return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
  setItem(k,v){ mem[k] = String(v); },
  removeItem(k){ delete mem[k]; }
};
win.document = {
  readyState:"complete", body:{dataset:{}},
  addEventListener(){}, getElementById:(id)=>ids[id]||fakeEl(), createElement:(t)=>fakeEl(t)
};
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
files.forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname,f),"utf8"), ctx, {filename:f}));

const G = win.G;
G.initDom();

(async function(){
  let fails = 0;

  // ---- keyword routing test (uses the REAL reply matcher + submit) ----
  async function route(text, opts, reprompt){
    let done=false, idx=-1;
    G.input.reply(opts, reprompt).then(i=>{ done=true; idx=i; });
    G.dom.input.value = text; G._submit();
    await Promise.resolve(); await Promise.resolve();
    if(!done){ G.state._reply=null; return "reprompt"; }
    return idx;
  }
  const opts = [ {keywords:["slow","feather"],steps:[]}, {keywords:["cut","hard"],steps:[]} ];
  const optsD = [ {keywords:["yes"],steps:[]}, {default:true,steps:[]} ];
  const optsN = [ {keywords:["stay"],steps:[]}, {keywords:["cut"],steps:[]} ];
  const optsS = [ {keywords:["pay"],steps:[]}, {keywords:["pay for this"],steps:[]} ];
  const optsW = [ {keywords:["no"],steps:[]}, {default:true,steps:[]} ];
  let rfail = 0;
  const r1 = await route("go slow and quiet", opts, "again?");
  const r2 = await route("hard cut it now", opts, "again?");
  const r3 = await route("burn the whole thing", opts, "again?"); // no match, no default
  const r4 = await route("nah", optsD);                           // -> default
  const r5 = await route("don't cut it. i'm staying", optsN, "again?"); // negation + apostrophes
  const r6 = await route("you'll pay for this", optsS, "again?");       // specificity beats list order
  const r7 = await route("i know the risks", optsW);                    // word boundary: "no" != "know"
  if(r1!==0){ console.log("  route FAIL: slow ->", r1); rfail++; }
  if(r2!==1){ console.log("  route FAIL: cut ->", r2); rfail++; }
  if(r3!=="reprompt"){ console.log("  route FAIL: unmatched should reprompt ->", r3); rfail++; }
  if(r4!==1){ console.log("  route FAIL: default ->", r4); rfail++; }
  if(r5!==0){ console.log("  route FAIL: negated 'dont cut' should stay ->", r5); rfail++; }
  if(r6!==1){ console.log("  route FAIL: 'pay for this' should beat 'pay' ->", r6); rfail++; }
  if(r7!==1){ console.log("  route FAIL: 'no' must not hit inside 'know' ->", r7); rfail++; }
  console.log(rfail===0 ? "KEYWORD ROUTING OK — keywords, defaults, reprompts, negation, boundaries, specificity."
                        : "KEYWORD ROUTING: "+rfail+" failure(s).");
  fails += rfail;

  // auto-drivers: replies pick index 0, asks return a name, objectives/returns resolve
  G.input.reply = async () => 0;
  G.input.askText = async () => "tester";
  G.input.awaitObjective = async () => {};
  G.input.awaitReturn = async () => {};

  // run every cycle's steps through the real interpreter
  for (let i=0;i<G.cycles.length;i++){
    try { await G.runSteps(G.cycles[i].steps); }
    catch(e){ console.log("  RUNTIME FAIL in cycle "+(i+1)+":", e.message); fails++; }
  }
  console.log(fails===0 ? "SCENE RUN OK — all "+G.cycles.length+" cycles execute without error." : "SCENE RUN: "+fails+" failure(s).");

  // ---- live /net pivot: clerk-relay -> deepstacks -> read a restricted record ----
  G.state.contact = true;
  G.state.hack = { loc:null, auth:null };
  G.state.files = []; G.state.unlocked = {};
  const seq = [
    "scan 10.0.0.4","connect 10.0.0.4","ls","cat creds.log",
    "connect 10.0.0.9","login archivist ozymandias","ls","cat deicide.txt","disconnect"
  ];
  // connect while connected errors "disconnect first" — insert a disconnect before pivoting
  let cfail = 0;
  try {
    G.hackCommand("scan 10.0.0.4");
    G.hackCommand("connect 10.0.0.4");
    G.hackCommand("cat creds.log");
    G.hackCommand("disconnect");
    G.hackCommand("connect 10.0.0.9");
    G.hackCommand("login archivist ozymandias");
    G.hackCommand("cat deicide.txt");
  } catch(e){ console.log("  CONNECT FAIL:", e.message); cfail++; }
  const gotFile = G.state.files.some(f=>f.name==="deicide.txt");
  const unlocked = G.state.unlocked.deicide === true;
  console.log((cfail===0 && gotFile && unlocked)
    ? "CONNECT OK — pivot logs in, downloads deicide.txt, unlocks the archive record."
    : "CONNECT PROBLEM — file:"+gotFile+" unlocked:"+unlocked+" errors:"+cfail);

  // ---- send gate: only /files content transmits; the right file resolves ----
  let sfail = 0;
  G.state.app = "home";
  let sent = false;
  G.state._objective = { type: "send", target: "deicide.txt", nudge: "the file, friend.", resolve: () => { sent = true; } };
  G.dom.input.value = "send ghost.txt"; G._submit();       // never downloaded -> refused
  if (sent) { console.log("  SEND FAIL: undownloaded file resolved the gate"); sfail++; }
  G.dom.input.value = "send creds.log"; G._submit();       // downloaded, but not what he asked for
  if (sent) { console.log("  SEND FAIL: wrong file resolved the gate"); sfail++; }
  G.dom.input.value = "send deicide.txt"; G._submit();     // downloaded by the connect test above
  if (!sent) { console.log("  SEND FAIL: sending the target did not resolve"); sfail++; }
  G.state._objective = null;
  console.log(sfail===0 ? "SEND OK — only downloaded files transmit, wrong files nudge, the target resolves."
                        : "SEND: "+sfail+" failure(s).");

  // ---- archive objective resolution ----
  let resolved = false;
  G.state._objective = { type:"archive", target:"babel", resolve:()=>{resolved=true;} };
  G.queryArchive("babel");
  console.log(resolved ? "ARCHIVE OBJECTIVE OK — searching the target resolves the gate."
                       : "ARCHIVE OBJECTIVE PROBLEM.");

  // ---- binary downloads: inspect, don't dump; /files emits a real anchor ----
  let mfail = 0;
  try {
    G.state.app = "net";
    G.hackCommand("disconnect");
    G.hackCommand("connect 10.0.0.14");
    G.hackCommand("login lineman brownout");
    const before = ids.output._kids.length;
    G.hackCommand("cat camera7.png");                       // a binary
    const out = ids.output._kids.slice(before).map(k=>k.textContent||"").join("\n");
    if (!/image\/png/.test(out) || !/2\.0 MB/.test(out)) { console.log("  no inspector stub"); mfail++; }
    if (!/saved to \/files/.test(out))                   { console.log("  not routed to /files"); mfail++; }
    if (/\[object Object\]/.test(out))                   { console.log("  dumped raw object"); mfail++; }
    if (/undefined/.test(out))                           { console.log("  printed undefined (missing desc leaked)"); mfail++; }

    const saved = G.state.files.find(f=>f.name==="camera7.png");
    if (!saved || !G.isMedia(saved.body) || saved.body.src !== "assets/camera7.png") { console.log("  descriptor not saved"); mfail++; }

    created.length = 0;                                  // watch what /files builds
    G.state.app = "files";
    G.openFileByName("camera7.png");
    const a = created.find(n=>n.tag==="a");
    if (!a) { console.log("  no download anchor"); mfail++; }
    else if (a.download !== "camera7.png" || a.href !== "assets/camera7.png") { console.log("  bad anchor href/download"); mfail++; }
    else if (!a.clicked) { console.log("  reopening in /files did not auto-fire the download"); mfail++; }

    created.length = 0;                                  // text files must not regress
    G.state.app = "net";
    G.hackCommand("cat notice.txt");
    if (created.find(n=>n.tag==="a")) { console.log("  text file produced a download link"); mfail++; }
  } catch(e){ console.log("  MEDIA FAIL:", e.message); mfail++; }
  console.log(mfail===0
    ? "BINARY DOWNLOAD OK — binaries inspect + route to /files, anchor emitted, text unchanged."
    : "BINARY DOWNLOAD PROBLEM — "+mfail+" issue(s)");

  // ---- session save: durable fields round-trip; mid-night unmarks the current cycle ----
  let pfail = 0;
  try {
    G.clearSave();
    G.state.username = "tester";
    G.state.cycleIndex = 2;
    G.state.cycleStarted = { 0: true, 1: true, 2: true };
    G.state.contact = true;
    G.state.flags = { hurt: true };
    G.state.files = [{ name: "creds.log", body: "x" }];
    G.state.knownHosts = ["10.0.0.4", "10.0.0.9"];
    G.state.hack = { loc: "10.0.0.9", auth: null };
    G.hosts["10.0.3.7"].files["pen.log"] = "pen 2: occupied.";
    G.persistSave();
    G.state.username = "";
    G.state.cycleIndex = 0;
    G.state.cycleStarted = {};
    G.state.contact = false;
    G.state.flags = {};
    G.state.files = [];
    G.state.knownHosts = ["10.0.0.4"];
    G.state.hack = { loc: null, auth: null };
    delete G.hosts["10.0.3.7"].files["pen.log"];
    const got = G.restoreSave();
    if (!got) { console.log("  SAVE FAIL: restore returned false"); pfail++; }
    if (G.state.username !== "tester") { console.log("  SAVE FAIL: username"); pfail++; }
    if (G.state.cycleIndex !== 2) { console.log("  SAVE FAIL: cycleIndex"); pfail++; }
    if (!G.state.cycleStarted[0] || !G.state.cycleStarted[1] || G.state.cycleStarted[2]) {
      console.log("  SAVE FAIL: mid-night should unmark the current cycle only"); pfail++;
    }
    if (!G.state.contact || !G.state.flags.hurt) { console.log("  SAVE FAIL: flags/contact"); pfail++; }
    if (!G.state.files.some(f => f.name === "creds.log")) { console.log("  SAVE FAIL: files"); pfail++; }
    if (G.state.hack.loc !== "10.0.0.9") { console.log("  SAVE FAIL: hack.loc"); pfail++; }
    if (G.hosts["10.0.3.7"].files["pen.log"] !== "pen 2: occupied.") { console.log("  SAVE FAIL: host overlay"); pfail++; }

    G.state.cycleIndex = 0;
    G.state.cycleStarted = { 0: true };
    G.state.flags = { deadEnd: true };
    G.persistSave();
    G.state.cycleStarted = {};
    G.restoreSave();
    if (!G.state.cycleStarted[0]) { console.log("  SAVE FAIL: deadEnd must not unmark the closed cycle"); pfail++; }

    G.clearSave();
    if (G.restoreSave()) { console.log("  SAVE FAIL: clearSave left a snapshot"); pfail++; }
  } catch (e) { console.log("  SAVE FAIL:", e.message); pfail++; }
  console.log(pfail===0 ? "SAVE OK — persist, mid-night replay mark, deadEnd, host overlay, clear."
                        : "SAVE: "+pfail+" failure(s).");

  process.exit((fails||cfail||sfail||mfail||pfail||!gotFile||!unlocked||!resolved)?1:0);
})();
