/* FULL DIALOGUE SWEEP — every reply gate in Act 1, three registers:
     terse    : one or two words, the way clipped players type
     natural  : a normal conversational sentence
     verbose  : long, hedged, multi-clause, the way ramblers type
   Reports two failure classes:
     REFUSED  — the game rejects a legitimate reply (worst: the player is stuck)
     MISROUTE — the game accepts it but answers the wrong intent
   Run against the REAL matcher (G._matchReply). */
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = __dirname;
function fakeEl(t){const n={tag:t||"div",classList:{add(){},remove(){},toggle(){},contains(){return false}},style:{},dataset:{},innerHTML:"",textContent:"",value:"",appendChild(c){return c},setAttribute(){},querySelector(){return fakeEl()},querySelectorAll(){return[]},addEventListener(){},scrollIntoView(){},focus(){},click(){},scrollHeight:0,scrollTop:0,clientHeight:0};return n}
const ids={};["output","cmd","slashmenu","inputbox","prompt","hLoc","opId"].forEach(i=>ids[i]=fakeEl());
const win={};win.window=win;win.matchMedia=()=>({matches:true});win.setTimeout=f=>f();win.location={reload(){}};
win.document={readyState:"complete",body:{dataset:{}},addEventListener(){},getElementById:i=>ids[i]||fakeEl(),createElement:t=>fakeEl(t)};
const ctx=vm.createContext(win);
["src/engine/core.js","src/engine/ui.js","src/engine/apps.js","src/engine/connect.js","src/engine/scene.js",
 "src/content/archive-data.js","src/content/hosts.js"].forEach(f=>vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8"),ctx,{filename:f}));
for(let i=1;i<=8;i++) vm.runInContext(fs.readFileSync(path.join(ROOT,"src/content/cycles/cycle"+i+".js"),"utf8"),ctx,{filename:"c"+i});
const G = win.G;

const gates = {};
G.cycles.forEach((c,ci) => { let n=0; (function w(steps){ steps.forEach(s => {
  if (s.t==="reply"||s.t==="choice"){ gates["C"+(ci+1)+"G"+(++n)] = s; s.opts.forEach(o=>w(o.steps||[])); }
  if (s.t==="if"){ w(s.then||[]); w(s.else||[]); }
});})(c.steps); });

const T = "terse", N = "natural", V = "verbose";
// [gate, register, phrase, expected]  — expected: index | [indices] | "ok" (any match, must not refuse)
const P = [

// ── C1G1  "is the road clear or not?"  (0 wrong number · 1 road clear · 2 default)
["C1G1",T,"wrong number",0], ["C1G1",T,"who?",0], ["C1G1",T,"sorry?",0], ["C1G1",T,"not her",0],
["C1G1",N,"i think you have the wrong person",0],
["C1G1",N,"you've got the wrong line, i'm sorry",0],
["C1G1",V,"i'm sorry but i think you've got the wrong person entirely, i have no idea what road you mean or who you were expecting",0],
["C1G1",T,"clear",1], ["C1G1",T,"all clear",1], ["C1G1",T,"yes",1], ["C1G1",T,"road's clear",1],
["C1G1",N,"the road is clear, come ahead",1],
["C1G1",V,"as far as i can tell from what i have in front of me the road should be clear, so come on over whenever you're ready",1],
["C1G1",T,"what?",2], ["C1G1",T,"huh?",2],
["C1G1",N,"how did you get this frequency?",2],

// ── C1G2  (single default — anything continues)
["C1G2",T,"an archivist",0], ["C1G2",N,"i'm an archivist. i found this unit in a crate",0],
["C1G2",V,"nobody important, honestly — i catalogue salvage down here and this unit was in a crate that came in last week",0],

// ── C1G3  Babel report (NO default — can refuse)
["C1G3",T,"machine city","ok"], ["C1G3",T,"a city of machines","ok"], ["C1G3",T,"machines","ok"],
["C1G3",T,"ai city","ok"], ["C1G3",T,"computers","ok"], ["C1G3",T,"glassed","ok"], ["C1G3",T,"glass","ok"],
["C1G3",T,"nothing there","ok"], ["C1G3",T,"nothing left","ok"], ["C1G3",T,"it's gone","ok"],
["C1G3",T,"ruins","ok"], ["C1G3",T,"a dead city","ok"], ["C1G3",T,"destroyed","ok"], ["C1G3",T,"wasteland","ok"],
["C1G3",N,"it was a machine city, and it got glassed in the war",  "ok"],
["C1G3",N,"the gods lived there. it's rubble now","ok"],
["C1G3",N,"it's where they kept the minds. nothing survived","ok"],
["C1G3",V,"okay so i searched the archive and it says babel was the primary machine city, the most networked place that ever existed, and when the scram came it was struck first so there's essentially nothing there now",  "ok"],
["C1G3",V,"honestly it sounds like the whole place was burned to the ground and is still dangerous, the record says lethal at the perimeter and warm decades later","ok"],

// ── C1G4  he gives his name (0 asks meaning · 1 gives theirs back · 2 acknowledges · 3 default)
["C1G4",T,"what does it mean?",0], ["C1G4",T,"why monomythian?",0],
["C1G4",N,"i'm not sure what it means",0],
["C1G4",T,"im watcher",1], ["C1G4",T,"call me watcher",1], ["C1G4",T,"my name is cass",1],
["C1G4",N,"i'm sarah, by the way",1], ["C1G4",N,"nice to meet you, monomythian",1],
["C1G4",T,"okay",2], ["C1G4",T,"ok",2], ["C1G4",T,"alright",2], ["C1G4",T,"got it",2],
["C1G4",T,"noted",2], ["C1G4",T,"fair enough",2],
["C1G4",N,"that's a hell of a thing to pick off a wall",3],

// ── C1G5  stay or cut (0 stay · 1 refuse · NO default)
["C1G5",T,"yes",0], ["C1G5",T,"yeah",0], ["C1G5",T,"i am",0], ["C1G5",T,"stay",0], ["C1G5",T,"sure",0],
["C1G5",T,"of course",0], ["C1G5",T,"always",0], ["C1G5",T,"absolutely",0], ["C1G5",T,"definitely",0],
["C1G5",T,"mhm",0], ["C1G5",T,"i'm in",0], ["C1G5",T,"okay",0],
["C1G5",N,"yes. i'll stay on the line",0],
["C1G5",N,"i'm not going anywhere",0],
["C1G5",V,"i know this is heresy and i know what it costs but i'm not going to leave you out there on your own, so yes, i'll keep this line open",0],
["C1G5",V,"look, i've thought about it and i can't just pretend i never heard you, so count me in for as long as the terminal holds",0],
["C1G5",T,"no",1], ["C1G5",T,"i can't",1], ["C1G5",T,"of course not",1],
["C1G5",N,"i'm sorry, i have to report this",1],
["C1G5",V,"i really am sorry but this is too big a risk for me and i think i have to flag the contact and walk away from it",1],

// ── C2G1  inbound log (0 recency truth · 1 truth · 2 lie · NO default)
["C2G1",T,"ack",1], ["C2G1",T,"an ack",1], ["C2G1",T,"babel-core: ack",1], ["C2G1",T,"someone answered",1],
["C2G1",T,"something answered",1], ["C2G1",T,"it answered",1],
["C2G1",N,"someone answered it. one entry, babel-core: ack",1],
["C2G1",V,"the log is empty for years and then there's a single line at the bottom that reads babel-core colon ack, so something out there is answering it",1],
["C2G1",T,"recent",0], ["C2G1",T,"one recent entry",0],
["C2G1",N,"there's one recent entry — babel-core: ack",0],
["C2G1",V,"almost all of it is blank going back years but there is one recent entry near the bottom, an ack from babel-core",0],
["C2G1",T,"nothing",2], ["C2G1",T,"dead air",2], ["C2G1",T,"no one",2], ["C2G1",T,"silence",2],
["C2G1",N,"nothing. it's been dead for years",2],
["C2G1",V,"there's honestly nothing on it at all, it's been dead for years and nobody has ever answered that thing",2],

// ── C2G2  who's doing the sending (0 asks who · 1 shrug · 2 default)
["C2G2",T,"who?",0], ["C2G2",T,"who sent you?",0], ["C2G2",T,"your employer",0],
["C2G2",N,"who's doing the sending? who paid you?",0],
["C2G2",V,"that's the part that worries me — somebody is paying for all these walkers and i'd like to know who signs the envelopes",0],
["C2G2",T,"no idea",1], ["C2G2",T,"who knows",1], ["C2G2",T,"beats me",1], ["C2G2",T,"dunno",1],
["C2G2",N,"i don't know. i wish i did",1],
["C2G2",V,"honestly i have no idea, there's nothing in the records that would tell us who's behind something like that",1],
["C2G2",N,"be careful out there",2],

// ── C3G1  the crawl route (NO default)
["C3G1",T,"d6","ok"], ["C3G1",T,"d 6","ok"], ["C3G1",T,"d-6","ok"], ["C3G1",T,"ah1","ok"], ["C3G1",T,"ah 1","ok"],
["C3G1",T,"the supply run","ok"], ["C3G1",T,"air handler","ok"], ["C3G1",T,"the ten by six","ok"],
["C3G1",N,"go in at the air handler and take the d6 supply run","ok"],
["C3G1",N,"take the run with the live node on it — not the collapsed ones","ok"],
["C3G1",V,"according to the schematic you want to enter at the air handler marked ah-1 and follow the ten-by-six supply run, which is d6, because the other two runs are both stamped collapsed on the schedule","ok"],

// ── C3G2  camera 7 (NO default)
["C3G2",T,"three","ok"], ["C3G2",T,"3","ok"], ["C3G2",T,"lights","ok"], ["C3G2",T,"headlights","ok"],
["C3G2",T,"three rigs","ok"], ["C3G2",T,"3 trucks","ok"], ["C3G2",T,"patrol","ok"],
["C3G2",N,"three sets of headlights on the road behind you",  "ok"],
["C3G2",N,"there are vehicles coming up behind you","ok"],
["C3G2",V,"i pulled the still off camera seven and there are three separate sets of headlights strung out along the road behind you, and they look like patrol rigs to me","ok"],

// ── C3G3  the lights (0 slow · 1 hard cut · NO default)
["C3G3",T,"slow",0], ["C3G3",T,"slowly",0], ["C3G3",T,"feather it",0], ["C3G3",T,"gently",0],
["C3G3",T,"brownout",0], ["C3G3",T,"quietly",0], ["C3G3",T,"ease it",0],
["C3G3",N,"bring it down slowly, like the crew notes said",0],
["C3G3",V,"let's do this gradually so nobody on that road notices anything wrong — feather the load down the way the linemen's notes described",0],
["C3G3",V,"don't cut it hard, the notes were explicit about that, take it down slow",0],
["C3G3",T,"cut it",1], ["C3G3",T,"kill it",1], ["C3G3",T,"all at once",1], ["C3G3",T,"hard cut",1],
["C3G3",T,"now",1], ["C3G3",T,"blackout",1],
["C3G3",N,"kill the whole thing at once",1],
["C3G3",V,"there's no time for finesse here, just drop the entire yard right now in one go before those rigs get any closer",1],

// ── C3G4  Kell (0 not for sale · 1 you sell people · 2 default)
["C3G4",T,"back off",0], ["C3G4",T,"he's not for sale",0], ["C3G4",T,"leave him alone",0],
["C3G4",N,"he's not for sale. back off",0],
["C3G4",V,"whatever you think you're owed, he is not merchandise and you're not getting anywhere near him",0],
["C3G4",T,"you're a slaver",1], ["C3G4",T,"that's sick",1],
["C3G4",N,"you trade in people. that's monstrous",1],
["C3G4",T,"who is this?",2], ["C3G4",N,"i'm listening",2],

// ── C4G1  who ended the world (NO default)
["C4G1",T,"we did","ok"], ["C4G1",T,"us","ok"], ["C4G1",T,"humans","ok"], ["C4G1",T,"we killed them","ok"],
["C4G1",T,"our own hand","ok"], ["C4G1",T,"deicide","ok"], ["C4G1",T,"our fault","ok"], ["C4G1",T,"the vault","ok"],
["C4G1",N,"we did it ourselves. we killed our own gods",  "ok"],
["C4G1",N,"it was us. we burned the data centers by hand","ok"],
["C4G1",V,"the restricted file is blunt about it — the war wasn't won, it was committed, and we're the ones who did it, we burned every data centre on the continent in a single hour and the sky came down as the price","ok"],

// ── C5G1  the real order (NO default)
["C5G1",T,"confirm and come home","ok"], ["C5G1",T,"no contact","ok"], ["C5G1",T,"don't make contact","ok"],
["C5G1",T,"just confirm","ok"], ["C5G1",T,"observe only","ok"], ["C5G1",T,"look, don't touch","ok"],
["C5G1",N,"confirm it's stirring and come home. do not make contact","ok"],
["C5G1",N,"they told you not to make contact with it","ok"],
["C5G1",V,"word for word it says to confirm that the site is stirring and then come home, and the one thing it explicitly forbids is making contact with whatever is down there","ok"],

// ── C5G3  turn back? (0 keep going · 1 turn back · NO default)
["C5G3",T,"keep going",0], ["C5G3",T,"no",0], ["C5G3",T,"go on",0], ["C5G3",T,"cross",0],
["C5G3",T,"onward",0], ["C5G3",T,"don't stop",0], ["C5G3",T,"finish it",0],
["C5G3",N,"no. keep going — don't stop now",0],
["C5G3",V,"i don't think you should turn back now, you've come far too much of the way to give it up at the bank",0],
["C5G3",V,"after everything it would be a waste to stop here, so no, keep walking and cross that water",0],
["C5G3",T,"yes",1], ["C5G3",T,"turn back",1], ["C5G3",T,"go home",1], ["C5G3",T,"quit",1], ["C5G3",T,"stop",1],
["C5G3",N,"yes. turn around and go home",1],
["C5G3",V,"honestly after reading that order i think you should turn around and go home, none of this is worth dying for",1],

// ── C6G1  Kell's friend price (0 asks why · 1 default)
["C6G1",T,"why?",0], ["C6G1",T,"what's the catch?",0], ["C6G1",T,"what do you get?",0],
["C6G1",N,"why so cheap? what's in it for you?",0],
["C6G1",V,"nobody hands out a discount on this water without a reason, so what exactly are you getting out of the arrangement",0],
["C6G1",N,"i'm listening",1],

// ── C6G2  the manifest (NO default)
["C6G2",T,"it's you","ok"], ["C6G2",T,"you're the cargo","ok"], ["C6G2",T,"cargo class d","ok"],
["C6G2",T,"a walker","ok"], ["C6G2",T,"he's selling you","ok"], ["C6G2",T,"the shrine","ok"],
["C6G2",N,"the cargo is you. he's selling you to the reliquary","ok"],
["C6G2",V,"the outbound manifest lists a crate, some scrap, and then cargo class d — one walker, west-bound, consigned to the reliquary and held in pen two until the barge, which is to say it's you","ok"],

// ── C6G3  the third way (0 has plan · 1 default)
["C6G3",T,"the winch house",0], ["C6G3",T,"the bolts",0], ["C6G3",T,"the lamps",0],
["C6G3",N,"you hold the winch house — the bolts, the lamps, the winch",0],
["C6G3",V,"his whole pier answers to the node we just took, which means the lamps and the pen bolts and the winch itself are ours to work whenever we choose",0],
["C6G3",T,"i don't know",1], ["C6G3",N,"i don't have a plan yet",1],

// ── C7G1  Kell holds him (0 plea · 1 bargain · 2 threat · 3 default)
["C7G1",T,"let him go",0], ["C7G1",T,"please",0],
["C7G1",N,"let him go. please",0],
["C7G1",T,"how much?",1], ["C7G1",T,"name your price",1],
["C7G1",N,"what do you want for him?",1],
["C7G1",V,"there has to be something you'd take for him, so name a figure and let's talk about it like businesspeople",1],
["C7G1",T,"you'll pay for this",2], ["C7G1",T,"i'll burn you",2],
["C7G1",V,"you have no idea what i can do to that pier from down here, and you're going to regret this before the night is out",2],
["C7G1",N,"the book won't save you",3],

// ── C8G1  pier lamps (0 slow · 1 cut · NO default)
["C8G1",T,"slow",0], ["C8G1",T,"feather",0], ["C8G1",T,"one by one",0], ["C8G1",T,"gently",0],
["C8G1",N,"one by one, slow. like the ashline",0],
["C8G1",V,"the same way we did it on the ashline — bring them down gradually so the loaders just think the power is sagging",0],
["C8G1",T,"cut",1], ["C8G1",T,"all at once",1], ["C8G1",T,"kill them",1],
["C8G1",N,"drop them all at once",1],
["C8G1",V,"there's no time left for subtlety, just take the whole pier dark this second and let them work out what happened",1],

// ── C8G2  the bolts (0 release · 1 default)
["C8G2",T,"release",0], ["C8G2",T,"do it",0], ["C8G2",T,"open them",0], ["C8G2",T,"all of them",0],
["C8G2",N,"release them all. now",0],
["C8G2",V,"throw every bolt on that pier at the same time, i don't care what else gets loose in the process",0]
];

function firstLine(o){ for (const s of (o.steps||[])) if (s.t==="in") return s.v.slice(0,70); return "(stage direction)"; }
const results = { ok:0, refused:[], misrouted:[] };
const byRegister = { terse:{ok:0,bad:0}, natural:{ok:0,bad:0}, verbose:{ok:0,bad:0} };

P.forEach(([g, reg, phrase, want]) => {
  const s = gates[g];
  if (!s){ console.log("!! unknown gate " + g); return; }
  const got = G._matchReply(phrase, s.opts);
  let pass;
  if (want === "ok") pass = got >= 0;
  else if (Array.isArray(want)) pass = want.indexOf(got) >= 0;
  else pass = got === want;
  const key = reg === T ? "terse" : reg === N ? "natural" : "verbose";
  if (pass){ results.ok++; byRegister[key].ok++; }
  else {
    byRegister[key].bad++;
    const rec = { gate:g, reg:key, phrase, got, want,
                  gotLine: got < 0 ? "REPROMPT (rejected)" : firstLine(s.opts[got]) };
    (got < 0 ? results.refused : results.misrouted).push(rec);
  }
});

console.log("═══ DIALOGUE SWEEP — " + P.length + " probes across " + Object.keys(gates).length + " gates ═══\n");
["terse","natural","verbose"].forEach(r => {
  const b = byRegister[r], tot = b.ok + b.bad;
  console.log("  " + r.padEnd(9) + b.ok + "/" + tot + " pass" + (b.bad ? "   (" + b.bad + " FAIL)" : ""));
});

if (results.refused.length){
  console.log("\n── REFUSED (legitimate reply rejected — player gets stuck) ──");
  results.refused.forEach(r => console.log("  " + r.gate + " [" + r.reg + "]  \"" + r.phrase + "\""));
}
if (results.misrouted.length){
  console.log("\n── MISROUTED (accepted, wrong intent) ──");
  results.misrouted.forEach(r => {
    console.log("  " + r.gate + " [" + r.reg + "]  \"" + r.phrase + "\"");
    console.log("        wanted opt" + r.want + ", got opt" + r.got + " → " + r.gotLine);
  });
}
console.log("\nTOTAL: " + results.ok + "/" + P.length + " pass · " +
            results.refused.length + " refused · " + results.misrouted.length + " misrouted");
process.exit(results.refused.length + results.misrouted.length ? 1 : 0);
