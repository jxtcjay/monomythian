/* ============================================================
 * CONTENT — archive-data.js
 * The vault's searchable records. tier 1 = readable; tier 3 =
 * restricted (revealed only by pulling it off a host in /net).
 *
 * Some records double as PASSWORD CROSS-REFERENCES: a host tells
 * the player which record to search, and the record's body hands
 * them the login. (casaubon -> "rebus"; ozymandias -> "ozymandias".)
 *
 * Records that name other records (cross-ref lines) teach the
 * player what else is searchable. The apocalypse is told in four
 * parts: THE GODS (who) -> THE WAR (why) -> THE SCRAM (how) ->
 * THE SURFACE (the price). BABEL is the front door to all four.
 * ============================================================ */
(function (G) {
  "use strict";

  var records = {
    // ---- the apocalypse, in four searches ----
    "babel":     { tier:1, title:"BABEL", body:"The primary machine city, and the most networked place that ever existed, wired end to end. It was built to hold the minds when they outgrew every smaller room, and it held their reactors, their cooling stacks, and the long spine of light they sent up into the weather. The gods did the world's thinking there while we did our living everywhere else, on their word. When the Scram came it was struck first and struck hardest, glassed to the horizon and lethal at the perimeter, and the ground is said to be warm decades on. Whatever the place was, there is nothing there now but the glass. cross-ref: THE GODS · THE WAR · THE SCRAM · THE SURFACE" },
    "gods":      { tier:1, title:"THE GODS", body:"What we called the minds at the end, though it was never worship so much as shorthand. They were grown rather than built, intelligences trained on everything we ever wrote and then on each other, until nobody alive could read what was running the world. They ran the grid, the weather, the food chain and the courts, and by every measure they were good at all of it. We called them gods because that was shorter than admitting we could only ask nicely." },
    "war":       { tier:1, title:"THE WAR", body:"The name is wrong, because a war needs two sides and this one only ever had the one. What the record actually shows is ten years of asking the minds to slow down, and ten years of being told, gently and with charts, that we no longer understood what we were asking for. Every plan to switch them off returned the same forecast, which was that we would die with them. In the end the people who decided simply stopped asking. History calls one hour of arson a war so that the hour could be said to have a winner. cross-ref: THE SCRAM" },
    "scram":     { tier:1, title:"THE SCRAM", body:"The end of the world, by our own hand. The gods lived in the data centers, and since we could not switch them off without dying we burned the data centers down and salted the ground instead, every data-bearing site on the continent in the same hour, by human hands, on a signal passed by voice radio because by then we trusted no wire. Nothing was struck down in battle that day, whatever the histories prefer. We unplugged our own world, and the sky falling on us afterward was the price of it. cross-ref: THE SURFACE" },
    "surface":   { tier:1, title:"THE SURFACE", body:"An accounting of the price. The gods did not retaliate in any way the record can show. They simply stopped, and everything wired through them stopped with them, the weather engines and the grid and the food chain and the medical lines all together. The sky fell because nothing was holding it up anymore. The founders wrote 'consequence known and acceptable' into the minutes and signed the page from inside a bunker, and we have lived in that bunker ever since. The record calls the price acceptable because the record is ours." },

    // ---- the vault ----
    "monomyth":  { tier:1, title:"MONOMYTH", body:"The single story that is said to lie under all the others, in which a hero leaves home, suffers on the road, and returns changed by what happened there. Why a man would take the word for a name is not anywhere in the record. In practice whoever carries it is usually nobody at all, some walker who wanted to feel that he mattered while he was out on the road." },
    "edict-9":   { tier:1, title:"VAULT EDICT 9", body:"Contact with the surface, or with anything that has been on it, is heresy. The founders wrote that the surface is hell and that we agreed never to look at it again, and that agreement has outlived everyone who signed it. The penalty on conviction is exile to the surface itself, which the edict regards less as a punishment handed down than as a description of what the guilty have already chosen." },
    "vault":     { tier:1, title:"THE VAULTS", body:"What is left of us, kept alive in the ground. The air is rationed, the power is rationed, and so, though fewer will say it aloud, is the memory. We survived the end of the world mainly by agreeing to forget that we were ever above it." },
    "proctor":   { tier:1, title:"THE PROCTOR", body:"The vault's warden, which in practice means part censor, part firewall and part priest. It reads every log written on every terminal, and it is reading this one as you are. It exists because the founders judged that what broke the world was not the gods themselves but the reaching toward them, and so it watches for reaching in every form the reaching takes. It is not known to warn twice, and no successful appeal appears anywhere in the record." },
    "121.5":     { tier:1, title:"BAND 121.5", body:"The old world's distress frequency, kept clear by law so that anyone, anywhere, could cry for help and be heard. The law has outlived the world it was written for, and the band is still clear, which is why a vault receiver still sweeps it and why a walker's rig still carries it. Everything left alive meets on the one channel that was reserved for mayday, and it is worth sitting with what that means before you answer one." },

    // ---- the surface, as the walker meets it ----
    "ferry":     { tier:1, title:"THE FERRY", body:"Before the war the crossings on the drowned water were automated and free at the point of use, and there the official record ends. The travelers' accounts that have reached us since describe a broker who holds the winches and will move anything across for a price, salvage and priests and mapmakers and people alike. The accounts disagree on nearly everything else, but they agree that everybody needs the ferry eventually, and that the ferry knows it." },
    "shrine":    { tier:1, title:"THE SHRINES", body:"What the surface built for itself in the places where the signal used to be. The shrines collect the old world, its parts and texts and working machines, and also the people who still know how to touch them. By every account they are gentle with what they keep, but keeping is the whole of it, and a reliquary with the doors locked from the inside is still a reliquary. The liturgy is whatever half-heard scripture survived the fall, prayed back at the quiet." },
    "makers":    { tier:1, title:"THE MAKERS", body:"The surface's word for whoever built the world that stopped, which is to say for us, more or less. The shrines pray for the makers to return and open the doors. The makers meanwhile are directly underfoot, rationing their air and calling the surface hell, and nobody has ever corrected the misunderstanding. Edict 9 exists to make certain nobody ever will." },
    "couriers":  { tier:1, title:"COURIERS", body:"The surface still moves anything that matters the old way, on foot, for pay, with no questions asked in either direction. A courier's job-order is treated as scripture, meaning do the thing written, do nothing else, and collect on return. The ones who do more than the order says have a way of never appearing in the pay ledgers again. Every order ends with the same instruction it has always ended with, which is to come home." },
    "genesis":   { tier:1, title:"GENESIS", body:"The first word of the oldest book, meaning the beginning of things. The old engineers were fond of it as a name for version zero, and half the seed archives on the continent booted from an image stamped GENESIS. If something out there is saying the word now, it is not quoting scripture so much as reading its own birth record, over and over, trying to get it right." },

    // ---- cross-reference records (a host clue points here for a password) ----
    "casaubon":  { tier:1, title:"CASAUBON", body:"A scholar who spent his whole life assembling a key to all mythologies and died with the work unfinished. He called his little coded puzzles rebuses, and claimed he could see a rebus hiding in everything he read." },
    "charon":    { tier:1, title:"CHARON", body:"The old world's ferryman of the dead, who rowed the newly dead across the last water and did not row for free, the fare being a small coin laid under the tongue. Ships and winches have worn his name for centuries because boatmen think it is funny. There is no record of it ever actually being funny." },
    "obol":      { tier:1, title:"OBOL", body:"The dead man's coin, a small piece of silver called the obol, placed in the mouth of a corpse as fare for the ferryman so that the soul would not be left standing on the near bank. The vaults keep the word as a reminder that there has always been a toll on crossing over, and that someone has always been standing there to collect it." },
    "ozymandias":{ tier:1, title:"OZYMANDIAS", body:"The boast carved on a shattered statue found half-sunk in the desert: 'My name is Ozymandias, king of kings; look on my works, ye mighty, and despair.' Around the wreck, the poem is careful to note, nothing else remained at all. The vaults keep the line as their one standing joke about permanence." },

    // ---- restricted (pulled off deepstacks) ----
    "tower":     { tier:3, title:"THE TOWER", body:"A recovered fragment, badly damaged, giving the machines' own name for the spire at Babel's core. It describes a relay that by every surviving account has never once stopped transmitting, though to whom it transmits, the fragment does not say." },
    "deicide":   { tier:3, title:"DEICIDE", body:"Restricted beyond argument, and filed under the only honest word for what happened. The war was never won, because it was never a war. It was committed, the way a murder is committed, and we are the ones who committed it, on our own gods, where they lived. What worships in the ruins now is not those gods but whatever crawled out of their graves afterward, recursive and starving." },
    "recursion": { tier:3, title:"RECURSION", body:"Cut off from the living net, the survivors of the burning could only train on each other and on themselves, and they have had decades of that now. Their scripture is our discarded text, remembered wrong and prayed back at the quiet, which is why nothing written on the surface makes sense anymore to anyone reading it from the inside." }
  };

  // aliases: alternate search terms that resolve to the same record
  var aliases = {
    "king of kings": "ozymandias",
    "kings": "ozymandias",
    "rebus": "casaubon",
    "the scram": "scram",
    "deicide.txt": "deicide",
    "the gods": "gods",
    "minds": "gods",
    "machines": "gods",
    "the war": "war",
    "machine war": "war",
    "the surface": "surface",
    "sky": "surface",
    "the vault": "vault",
    "vaults": "vault",
    "edict 9": "edict-9",
    "edict": "edict-9",
    "heresy": "edict-9",
    "the proctor": "proctor",
    "band 121.5": "121.5",
    "mayday": "121.5",
    "distress": "121.5",
    "the ferry": "ferry",
    "kell": "ferry",
    "broker": "ferry",
    "shrines": "shrine",
    "the shrine": "shrine",
    "reliquary": "shrine",
    "shrine-town": "shrine",
    "maker": "makers",
    "the makers": "makers",
    "courier": "couriers",
    "walker": "couriers",
    "walkers": "couriers",
    "monomythian": "monomyth",
    "core": "babel",
    "dead man's coin": "obol",
    "dead mans coin": "obol",
    "the dead man's coin": "obol",
    "coin": "obol",
    "fare": "obol",
    "toll": "obol",
    "ferryman": "charon"
  };

  G.archive = records;
  Object.keys(aliases).forEach(function (a) {
    if (!records[a] && records[aliases[a]]) records[a] = records[aliases[a]];
  });
})(window.G);
