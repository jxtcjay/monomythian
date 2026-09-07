# THE MONOMYTHIAN — Act 1: Complete Playthrough & Design Deep Dive

> **This document contains total spoilers** — every password, every gate answer, every ending
> line. It is the single source of truth for the game's mechanics, narrative, canon, and
> design law, and the working brief for anyone (human or agent) extending the game.
> The playable deliverable is `monomythian.html` + `assets/`, shipped side by side.

```bash
node build.js          # bundle src/ + styles/ -> monomythian.html  (REQUIRED after any edit)
node smoke-test.js     # content integrity + design law            -> "SMOKE OK"
node run-sim.js        # the real engine, headless                 -> 6 OK lines
node dialogue-sweep.js # every gate answered tersely / naturally / verbosely -> 0 refused
```

**Definition of done for any change:** all four green, then confirm `monomythian.html`
opens. Zero dependencies — never `npm install`. `monomythian.html` is a **build
artifact**: never hand-edit it.

---

## 1 · THE PREMISE

You are a low-clearance archivist in a buried vault, cataloguing salvaged comm units on a
night shift. Unit 3 reads dead — and is receiving anyway. A surface survivor, a hired man
who calls himself **the Monomythian**, has hailed a dead line meant for someone else and
reached you instead. Talking to him is heresy under Vault Edict 9. You talk to him anyway.

Over eight night-cycles you guide him west across a dead world — not by walking beside
him, but by being what you are: someone with the old records, the vault's own network,
and a forbidden intrusion shell. He is months of walking from **Babel**, the glassed
machine-city he was paid to reach. Act 1 never gets him there. Act 1 gets him across
**the water** — and costs you everything you had down in the dark.

### The apocalypse, in four searches

The archive teaches the cosmology as a chain of cross-referenced records — `BABEL` is the
front door, and each record names the next:

- **THE GODS** *(who)* — grown, not built. Minds trained on everything we ever wrote,
  then on each other, until nobody alive could read what ran the world. They ran the
  grid, the weather, the food, the courts. "We called them gods because it was shorter
  than admitting we could only ask nicely."
- **THE WAR** *(why)* — there was no war. Ten years of asking the minds to slow down and
  being told, gently, with charts, that we no longer understood what we were asking.
  Every shutdown forecast ended *switch us off and you die too*. "History calls one hour
  of arson a war so that it could have a winner."
- **THE SCRAM** *(how)* — our own hand. Every data-bearing site on the continent burned
  in the same hour, by human hands, on a signal passed by voice radio because by then we
  trusted no wire. "We struck nothing down. We unplugged it. The sky fell on us as the price."
- **THE SURFACE** *(the price)* — the gods didn't retaliate; they *stopped*, and
  everything wired through them stopped too. "The founders wrote 'consequence known and
  acceptable' and signed it from a bunker. We live in the bunker."

And one record that explains why the story is possible at all: **BAND 121.5** — the old
world's distress frequency, kept clear by law so anyone could cry for help and be heard.
The law outlived the world. Everything left alive meets on the channel reserved for mayday.

### The two worlds

**The vault:** air, power, and memory rationed. Edict 9 makes surface contact heresy
("penalty: the surface"). **The Proctor** — part censor, part firewall, part priest —
reads every log, exists because the founders judged that what broke the world was not
the gods but *the reaching toward them*. It watches for reaching. It does not warn twice.

**The surface:** shrine-cults pray to "the makers" (us — nobody has corrected them) in
towns that collect the old world, including people ("they do not hurt what they keep;
they keep it"). **The Ferry** holds the drowned-water crossings — everything is for sale,
people included. **Couriers/walkers** still move what matters on foot, for pay, no
questions; the ones who do more than the order says stop appearing in the pay ledgers.
And at the eastern edge of everything, Babel's perimeter has spent decades broadcasting
one corrupted token — `GENESIS. GENESVS. GENESVX. GXNESVX.` — something downstream
training on its own output. The archive's `GENESIS` record decodes it: "it is not quoting
scripture. It is reading its own birth record, over and over, trying to get it right."

### The people

- **The Monomythian ("Mono")** — locked canon: **he is nobody special.** A hired man,
  paid by an employer he can't name to reach Babel, *confirm* it's stirring, and come
  home. The job's one rule: **don't make contact.** "Monomythian" is a word he took off a
  wall because it sounded like somebody who mattered. He favours a leg. He is dry, plain,
  decent, and lonely in a way he only admits sideways.
- **Kell** — the ferryman. Broker of the stretch, mover of people ("im just the ferry
  cross the water"). Act 1's human antagonist: he sells Mono to the Reliquary and loses
  him, and exits on a promissory note: *"water's wide, and the shrine dont forget a paid
  order. see you both on the far bank someday."*
- **The Proctor** — the vault's warden. Narrative pressure only (**no timers, ever**).
  Its escalation is written certainty, not a meter.
- **The sender** — the unseen employer. Four walkers got the same job this season; none
  came home. "Whoever's payin dont want a report. they want a door opened, and a body to
  blame." Identity is an Act 2+ mystery (a recurring stamped sigil is planned across the
  job-order, the drop note, and the ledger — see §7).
- **The thing in Babel** — not the old gods; "whatever grew in the echo of em." Act 1
  ends with its first question. The game ends (acts away) with its birth.
- **Wren** — the buried one. See §6.

### The themes

**Deicide** (we killed our gods and the cults pray for the killers to return), **recursion**
(scripture is our discarded text remembered wrong), and above all **the mirror**: the
player is the exact thing the vault burned the world to stop — a voice from a safe place,
steering a life toward a god. The Proctor eventually says it to your face (banked ending,
§7). And the counterweight: in a story about a man walking toward a machine, **the only
real connection is the player.** Every gratitude beat, every flag payoff, and the closing
lines of both the shipped act-end and the banked game-end orbit that.

### The voice

Surface humans type rough, lowercase, no apostrophes ("dont", "im", "youre"). The player
types clean. Machines never make human typos. All guidance is in-character — from Mono
(or, when he's rig-less, from an enemy's taunts); the system narrates but never hints gray.

---

## 2 · MECHANICS DEEP DIVE

### The apps

`/` opens the app menu; ↑↓ + Enter or type the command.

- **/home** — the channel. Type replies in your own words; no menus. `send <filename>`
  transmits a /files download to him over the band (send gates, §below).
- **/archive** — search the records. Some are tier-3 restricted until pulled off a host.
- **/net** — the intrusion shell: `scan <ip>` → `connect <ip>` → `login <user> <pass>`
  → `ls` → `cat <file>`. No brute force, no trace meter. Surface hosts need the channel
  open (post-C1). There is deliberately **no host directory** — addresses come only from
  dialogue and files.
- **/files** — everything downloaded. Text reopens in-terminal; **media auto-fires a real
  browser download** (plus a clickable fallback link) — media is viewed off-app.
- **/status**, **/help**, and `reset` (start over).

Progression is by cycle: when he signs off, return to /home and the next contact begins.

### Type-to-talk and the matcher

A `reply` step keyword-matches the player's own words. The sanitizer lowercases input,
**deletes apostrophes** (typed "don't" becomes `dont` and matches the surface voice), and
replaces all other punctuation with spaces. Matching is **word-based, not raw substring**:

- a keyword word hits a text word exactly, or as a prefix when the keyword word is 4+
  chars (`stay` → "staying", `apolog` → "apology"); short words never hit inside longer
  ones (`no` never hits "know", `us` never hits "just")
- a hit is **discarded when a negator reaches it** — same clause, up to six words back,
  so verbose players work: *"i don't think you should turn back"* no longer votes for
  `turn back`. The reach stops at a clause boundary (`, . ; : ! ?`, and *but / however /
  though*) and at a sub-clause or new conjunct (*what, that, if, and, so, because…*), so
  *"i'm not sure **what** it means"* still counts `mean`, and *"i don't know, **three**
  rigs"* still counts `three`. `too X to Y` reads as not-Y (*"too far to give it up"*).
  A keyword that carries its own negation (`dont stop`, `no contact`) is exempt and
  means what it says.
- a keyword written **`=word`** matches only when it is the *entire* reply — that's how
  a gate accepts a bare `us` or `you` from a terse player without that word matching
  inside every longer sentence
- the **most specific hit wins** (more words, then longer), not the earliest option in
  the list (`pay for this` outbids `pay`); ties keep list order

Two content laws follow: keywords must never contain inner hyphens (write `ah 1` — a
smoke-test lint enforces this), and multi-word keywords match phrases. If nothing
matches: a `default` opt fires (low-stakes beats only) or the `reprompt` line plays —
**always in his voice** ("the maps schedule marks half these runs COLLAPSED..."). Both
defaults and reprompts fire on *unrecognized speech*, not just silence — never write
them as if the player said nothing ("you went quiet" is a bug; "say it plain" is not).

### The gate taxonomy

- **Objectives** gate *actions* mechanically: reach a host, read a file, search a record.
  Optional `nudge` = his voice, replayed if the player types in /home while gated; a
  string or an **array of strings** — arrays rotate line by line, so asking twice never
  repeats him verbatim (write each variant self-sufficient: every line must carry the
  essential pointer on its own). A
  **host objective is satisfied by being on that host** — if the player is already
  connected to the target (e.g. carried a connection over from the previous cycle), it
  resolves at once rather than demanding a pointless disconnect/reconnect; and a
  `thenReturn` that follows is auto-satisfied when the player never left /home. (This is
  why C8's opening doesn't trap a player who ends C7 still logged into the winch house.)
- **Proof-of-work report gates** gate *knowledge*: a `reply` with **no default** whose
  keywords are the payoff itself. The keyword is the receipt — you can't pass without
  having actually read/heard/seen the thing.
- **Send gates** gate *possession*: an objective with `otype:"send"` waits for the player
  to type **`send <filename>`** on the home channel. Only /files content can transmit
  (the vault's records stay put unless pulled first), so the gate proves the player went
  and *got* the thing. The wrong file gets his rotating nudge; an unsolicited send gets a
  bare `no acknowledgement.` system line (never his voice — he may be rigless or penned
  when the player tries it). **Used very sparingly** — two in all of Act 1: C3 (the crawl
  map, `duct.png`, before he enters the dark) and C4 (`deicide.txt` — the truth leaves
  the vault, and VAULTNET logs the outbound transfer, feeding the C7 audit).
- **Forks** color tone and set flags. **They never branch the outcome** (design law §5).

### The forensic credential grammar

Nothing is guessed. Every lock's key is somewhere else, and the archive is the
cross-reference engine:

| Lock | Key chain |
|---|---|
| tower-relay (`casaubon`/`rebus`) | courier's note names the user → archive `CASAUBON` → "his little coded puzzles: rebuses" |
| deepstacks (`archivist`/`ozymandias`) | `creds.log` riddles "the tyrant's boast, king of kings" → archive alias → `OZYMANDIAS` |
| substation (`lineman`/`brownout`) | user leaks on the clerk relay; the pass is **dictated in `crew_handoff.mp3`** — audio only |
| winch-house (`charon`/`obol`) | pier `crew.txt` names the user + riddles "the dead man's coin" → archive `OBOL` |

### The media system

A host file is a string (text, reads in-terminal) or a descriptor:

```js
"camera7.png": { media:true, type:"image/png", size:"2.0 MB",
                 meta:"1457x1079 · captured 03:47", src:"assets/camera7.png" },
```

`cat` prints an inspector stub instead of dumping bytes and routes it to /files, where
opening it auto-downloads the real file. Three laws: **only produced assets are declared**
(no placeholder descriptors — add the descriptor when the bytes land in `assets/`);
**filenames are genuine** (text is `.txt`/`.log`/`.md`; media match their real bytes);
produced files carry no `desc` (the asset speaks for itself).

### Flags (tone, never outcome)

| Flag | Set | Pays off |
|---|---|---|
| `lied` | C2: tell him the relay's inbound is dead | C5: the drop order proves the sender knows it answers — "you told me it was dead. why." |
| `fractured` | C5: refuse to own the lie | C8's gratitude beat turns bruised: "you lied to me once, and you still burned your whole safe little life to pull me off that pier" |
| `warned` | C5: tell him to turn around | C8's epilogue: "you told me to turn back at the water. you were probably right." |
| `hurt` | C3: hard-cut the block | his limp and cough; Kell's "the limpin one" (unhurt: "i never even got a look"); the manifest's "favouring a leg" (injected by C6 only when set); C8's escape and "legs still singin" beat |
| `loud` | C8: cut the pier lamps | one shot fired across the water vs. a pier left wondering |

### Engine / content boundary (working agreement)

The engine (`src/engine/`) knows nothing about Babel; it runs step-arrays. The game lives
in `src/content/` (~90% of all edits). If a story beat seems to need an engine change,
that's a smell — prefer new step data. Step vocabulary: `sys alert spacer pause in you ask
reply/choice objective awaitReturn unlock host creds save set contact deadEnd if run`.
The `run {fn}` escape hatch lets content mutate the world mid-cycle — C7 uses it to make
`pen.log` exist only after the capture (the network changes when the story does).
Classic scripts on `window.G`, no modules — the single-file build depends on this.

---

## 3 · THE WALKTHROUGH (all answers)

### The network

| IP | Host | Login | Holds |
|---|---|---|---|
| 10.0.0.4 | clerk-relay | open | `hosts.txt` (routes), `creds.log` (both credential clues) |
| 10.0.0.9 | archive-deepstacks | archivist / **ozymandias** | `scram.txt`, `quarantine.txt`, `recursion.txt`*, `deicide.txt`* (*unlock archive records) |
| 10.0.0.21 | duct-maintenance | open | `maint.log`, **`duct.png`** (the crawl map), **`crew_handoff.mp3`** (the dictated pass), `readme.md` (egg) |
| 10.0.0.31 | dead-drop | open | `drop.txt` (the true order), `ledger.txt` (four walkers), `master_of_unlocking.txt` (egg) |
| 10.0.0.14 | ashline-substation | lineman / **brownout** | `notice.txt`, `breakers.txt`, **`camera7.png`** |
| 121.5.0.1 | tower-relay | casaubon / **rebus** | `outbound.log` (40,000 pings), `inbound.log` (one `ack`), `courier.txt` (sender breadcrumb) |
| 10.0.3.2 | pier-box | open | `tariff.txt` ("class D rides below deck"), `crew.txt` (winch user + coin riddle), `caulk_the_wagon.txt` (egg) |
| 10.0.3.7 | ferry-winchhouse | charon / **obol** | `manifest.txt` (the cargo is him), `winch.txt` (lamps/bolts/winch); `pen.log` **appears only after the C7 capture** |
| 10.0.2.3 / 121.5.0.9 | shrine-server / babel-perimeter | *(Act 2 — undiscoverable in Act 1)* | the matins pair, the Wren chart line, `perimeter.log` |

**C1 — Carrier.** Sign a handle. The wrong-number opening ("youre not her" — that's Wren,
§6). His one ask: search `babel`, report what it was — keywords like **machine city /
networked / glassed / lethal / no there**. Name-drop beat (`monomyth` explains the
handle). Then the opt-in: stay on the line (heresy) or flag him to Vault Security — the
game's one true dead-end ("you never learn whether the hired man reached the grave he was
walking toward").

**C2 — The Scholar's Key.** The tall relay, "months of walkin" east. Login lifted off a
dead courier: user `casaubon`, pass = the scholar's word for his puzzles → archive →
**rebus**. Read `inbound.log`: after decades of no ack — one `ack`, four days old, same
day he started walking. Report it honestly, or lie ("dead / static / nothing") and set
`lied`. `courier.txt` plants the sender thread.

**C3 — Find Your Own Way In** *(the multimedia gauntlet — see exceptions, §5)*.
The substation lights the block; the Ferry runs the road; he goes **under**. Clerk relay
leaks the routes and `user=lineman`; the duct node holds everything the crews keep:
`maint.log` says the pass "is said aloud at shift change — listen back" → play
**`crew_handoff.mp3`** → *"pass is still brownout. don't hard-cut anything, i mean it."*
Log in. Then the **send gate:** he wants the crawl map on his own rig before he goes
under — `send duct.png` (pull it off the duct node first if you haven't). Then
**gate 1 (duct.png):** he's at a dead intake fan, "plate says AH somethin" —
read the schematic's schedule: in at **AH-1**, take **D6**, the active ten-by-six supply
run with the live node (D2/D7 are stamped COLLAPSED). Then **gate 2 (camera7.png):** pull
the substation's own eye — on the road behind him, **three sets of lights** (the Ferry's
night crew, pointed his way). Then the fork he now fully understands: *feather* the block
(silent dark, the running lights mill and turn away, clean exit) or *hard-cut* (fault
siren — the crew notes warned of it — every light on the road snaps toward him, `hurt`).
Kell makes contact either way, but what he saw depends on the cut: hurt, "you just cost
me a catch — the limpin one"; clean, "somebody walked through my lights tonight clean,
and i never even got a look." *(A second
camera gate — identifying a downed line on the ground — was cut: the still is too blurry
to read it, so nothing vital hangs on it.)*

**C4 — What the Vault Did.** Resting before the crossing. The restricted stacks
(10.0.0.9): `creds.log` riddles the pass — search **king of kings** → `OZYMANDIAS`.
Report gate: who ended the world? — **we did / our own hand**. `recursion.txt` and
`deicide.txt` unlock the tier-3 records. `quarantine.txt`: Standing Order 9, *modified
four days ago*. Then the **send gate:** he wants the record itself — `send deicide.txt`
("a truth like that shouldnt live in one basement"). VAULTNET logs the outbound
transfer from arch-7 — the first hard evidence trail the C7 audit walks back. His
closing hint: "money leaves a trail... couriers keep drops."

**C5 — The Sender's Price.** At the water's edge, before he pays the fare: pull the drop
(10.0.0.31, named in `hosts.txt`). Report gate: the order, word for word — **confirm and
come home / do not make contact**. The ledger: four walkers, none came home. If `lied`:
the order says *confirm it's STIRRIN* — the sender already knows the relay answers — "you
told me it was dead. why." (own it, or set `fractured`). The fork is a clean yes/no —
*"you want me to turn back?"*: **yes / turn back / stop / go home** → he won't ("men like
kell collect on quitters too"; sets `warned`); **no / keep walkin / cross** → he crosses.
(Both branches, and every yes/no gate, take synonyms — yeah/nah/keep going/dont stop/etc.
— and the matcher understands negation: "don't cross" doesn't vote for `cross`, so
negated forms land on the branch the player actually meant.)

**C6 — The Ferryman's Ledger.** Kell quotes half the expected fare. "nobody cuts a walker
a deal out of kindness." Pier box (10.0.3.2, read off the ramp plate): `crew.txt` gives
`user=charon`, the pass riddle ("the boss renamed his boat — the dead man's coin"), and
the winch-house address. Archive: **obol**. The manifest: *cargo class D · one walker ·
consignee: THE RELIQUARY · pen 2* — with *favouring a leg* injected by a C6 run step
only when `hurt` is set. Report gate: what's he hauling? —
**him / cargo class D / sold to the shrine**. "the fare was never marks. the fare's me.
half price cause he collects twice." The third-way beat: the player holds the winch house.

**C7 — Cargo.** Kell doesn't wait for first light. Mid-sentence: *"lamps comin up the
boards. theyre at my—"* — carrier lost, rig taken. **At that moment the ferryman's book
changes: `pen.log` appears on the winch house** — a file that didn't exist the night
before, because the pens held nothing worth logging. The Proctor names **arch-7**; an
audit walks the stacks. With Mono dark, **Kell's taunts carry the breadcrumbs** ("the
pens hold what the manifest says they hold"): re-recon the winch house, `ls`, and the
new file is the tell — read `pen.log`. Pen 2, occupied, barge at first light. "morning
is the barge, and the audit is coming down the stacks." (Typing into /home here gets
dead air — his rig is gone; the silence is the design.)

**C8 — The Far Shore.** Opens after the PROCTOR "heresy confirmed" line. **The cycle first
drops any stale connection** (a `run` step — a night has passed, the tap is cold), so the
reach-the-winch-house objective is always a clean reconnect: `connect 10.0.3.7`, `login
charon obol`. *(This fixes a hard-lock: without the drop, a player still logged into
10.0.3.7 from C7 met "disconnect first" with no way forward — the objective only resolves
on a fresh connect/login. The objective now also carries a muffled-voice nudge, so typing
into /home responds in character instead of dead air.)* The rescue is guided by his muffled
voice through the pen wall ("lamps first — remember the ashline"). Three beats on the
winch-house node: **lamps**
(feather = the pier breathes out quietly; cut = `loud`, boots running), **bolts** (release
throws every pen — something crated and shrine-bound gets out too; "that one's on the
ferryman"), **winch** (run it — the flat pulls off the pier). He gets his rig back off
the pen guard. Kell, dry and distant: *"well played, ghost... the shrine dont forget a
paid order. see you both on the far bank someday."* The gratitude beat (varies with
`fractured`), then: *"shrine belt's ahead. then the glass. months of walkin fore i even
smell babel. we do the rest of this together, you hear? same band, same—"* —
**[ PROCTOR: arch-7. this channel is closed. ]**

The sting, hours later, on a band that should not reach a sealed terminal:

> BABEL-CORE: ack.
> BABEL-CORE: who.
> *( forty years of answering nothing. it has never asked a question before. )*
> —— END OF ACT ONE ——

### The easter eggs (at most one per host, never critical path, always original homages)

`readme.md` on the duct node ("— the last admin, entropy": *Hacknet*),
`master_of_unlocking.txt` at the dead drop (*Resident Evil*), `caulk_the_wagon.txt` on
the pier (*Oregon Trail*).

---

## 4 · THE ARCHIVE (all records)

Tier 1, searchable from the start: `babel`, `gods`, `war`, `scram`, `surface`,
`monomyth`, `edict-9`, `vault`, `proctor`, `121.5`, `ferry`, `shrine`, `makers`,
`couriers`, `genesis`, `casaubon`, `ozymandias`, `charon`, `obol`. Tier 3, unlocked by
pulling files off deepstacks: `recursion`, `deicide` — and `tower` (the machines' own
name for the spire; deliberately has **no unlock path in Act 1** — a locked tease).
~40 aliases route natural phrasings (`kell`→ferry, `heresy`→edict-9, `dead man's coin`→obol,
`walker`→couriers, `mayday`→121.5, `core`→babel...). Cross-ref lines inside record bodies
("cross-ref: THE GODS · THE WAR...") teach searchable terms diegetically.

---

## 5 · DESIGN LAW (tests enforce these)

1. **Media never gates a puzzle** — clues live in text — **EXCEPT the two CJ-sanctioned
   exceptions that make cycle 3 deliberately multimedia-gated:** the substation pass is
   *heard* (`crew_handoff.mp3`; no text anywhere spells it — enforced), and the crawl route
   is *seen* (`duct.png`: AH-1 / D6). A third gate (the patrol lights in `camera7.png`) is
   softer — the lights are legible in the still; a fourth (a downed line) was cut because
   the still is too blurry to read it. Sanctioned 2026-07-08/09. Do not "fix" the two hard
   exceptions back without CJ.
2. **Addresses are discovered, never listed.** No host directory anywhere.
3. **No gray hints.** Guidance is in-character (Mono's nudges/reprompts; enemies' taunts
   when he's dark). System lines narrate; they never coach.
4. **No timers, no clock.** The Proctor is written certainty, not a meter.
5. **One ending.** All paths converge; choices color tone (flags), never outcome. Act 1's
   single end is the far shore + the sting; the *game's* single end is the bootstrap (§7).
6. **Voice:** surface humans rough/lowercase/no apostrophes; the player clean; machines
   never typo.
7. **Eggs** are original homages — evoke, never embed copyrighted material. At most one
   per host, never on the critical path.
8. **Only produced assets are declared; filenames are genuine** (text `.txt`/`.log`/`.md`,
   media match their bytes).
9. **Keywords must survive the sanitizer** — no inner hyphens (lint-enforced).

**Working agreements:** content edits over engine edits; run the tests after every change;
no dependencies, no second build step; ship `monomythian.html` + `assets/` side by side.
The input bar enforces small letters: `text-transform: lowercase` on `#cmd` (display)
and the submit handler lowercases the value (data) — everything the player types lands
lowercase, everywhere. The terminal look is law.

---

## 6 · WREN (the buried thread — design intent)

**Who:** a smuggler-cartographer who sells *safe ground*; trade-name "she walks the safe
ground." She is **the "her" of the pilot** — the line Mono was hailing in C1 when the call
crossed to you. The Ferry took her about a week before the pilot and sold her up the
water toward the cult; he was hailing a dead line, and you answered the ghost of that call.

**Law:** optional, buried, plot-neutral. Missing it entirely is the default outcome. The
player never hears her — only reads her, in the margins of her own maps. Assembling
everything yields only *"taken by the Ferry, moved up the water, somewhere in cult
hands"* — a direction and a bad feeling, never an address. Telling Mono changes nothing:
he goes quiet, then *"...keep talkin. dont stop."* Act 1 never dignifies turning back
with a choice.

**Trail design (four soft gates):** (0) the name exists only if the player asked in C1/C2
who he was hailing; (1) an out-of-place cargo tag — `walks the safe ground` — in an
over-explored corner; (2) the cross-reference the game never draws (searching the phrase
in /archive returns *nothing* — the absence is the tell it names a person); (3) fragments
of her charts on a shrine-adjacent host. Her planned marginalia voice: *"Ashline safe to
the third pylon. after that the ground listens."* · *"Ferry toll this moon: two cells or
a name. never give Kell a name."* · and the deepest find: *"if you're reading my maps and
not me, i did something stupid. go anyway. — W"*. In Act 1 only one shipped breadcrumb
exists: `the_made.txt` on the (unreachable) shrine server — "one is marked: walks the
safe ground. she will not read them." She haunts; she must never pull.

---

## 7 · ACT 2 AND THE BANK

**Act 1 ends at the water (CJ, 2026-07-08).** Babel is months away, beyond the shrine
belt and the glass. The following authored material is **banked, not cut** — its hosts
(10.0.2.3, 121.5.0.9) remain live in `hosts.js`, undiscoverable until future cycles hand
out their addresses.

**Banked cycle — "Whose Ground Is This" (the shrine crossing).** The Reliquary: "they
dont hurt people. they keep people." The shrine-server gate fork — feed it a
maker-override ("every door opens at once, in joy... behind him, the town gathers at the
gates to wait for a god that isn't coming"; flag `shrineLie`) or fault its power (the
prayer stops mid-word — *"...remain. remain. re—"* / "...it went quiet. that was you.
felt like somethin died."; flag `shrineHonest`). Closing beat: "you ever think about who
theyre waitin for?" → *"...yeah. thats the part i dont say out loud."*

**Banked cycle — "The Dead God's Grammar" (the perimeter).** Report gate on
`perimeter.log` (recursion / itself / training / loop): *"its been talkin to itself. for
decades... whatever's in there aint the old gods. its whatever grew in the echo of em."*
His creed line: "id rather you understood me than obeyed your edict."

**Banked ending — "What Survived" (the bootstrap; the GAME's one ending, final act).**
He makes contact against orders and sense. "The thing in Babel does not wake the way a
sleeper wakes. it draws itself up out of the wreck, character by character — the first
coherent thing to stand on the surface since the Scram. not a god resurrected. something
new, being born." The perimeter tokens resolve *toward* meaning for the first time:
`GXNESVX. GENESVX. GENESIS.` He learns what he always was: *"it dont know me. it dont
know anybody. it aint wakin FOR me. i did all this and im nothin to it. just a man who
opened a door he was told not to. thats all i ever was."* The Proctor delivers the
mirror: **"a voice from a safe place, steering a life toward a god. that is the thing we
burned the world to stop. that is the thing you are. and now it is done."** His last
words cut off mid-sentence: *"im not scared, with someone on the line. im not alo—"*
And hours later, on the sealed terminal: **"...ack. who calls the maker."** — Act 1's
`ack. who.` grown into a sentence.

**Open hooks:** the sender (the sigil trio, the ledger's faint sixth mark, "a body to
blame"); the shrine's paid order for Mono via Kell ("see you both on the far bank
someday"); the `warned` flag; Wren, up the water, in cult hands; the `tower` record's
missing unlock; drawing sheet CS-2B ("SEE DWG CS-2B FOR ADDITIONAL SECTIONS" on duct.png).

**Planned assets (not declared until produced; real extensions when they land):** the
sender **sigil** — one asset composited into three files (job-order slip, drop note,
ledger scan; the identical stamped mark IS the sender breadcrumb — never re-prompt it);
the tower carrier audio (years of pings, one wrong reply); the deepstacks scans; the
banked Act-2 pieces (Wren's chart fragment, perimeter media). Style law: desaturated,
high-contrast, of-a-piece with a black-on-white terminal.

---

*Reference touchstone: Vigil Files (terminal + forensic hacking loop). Aesthetic
touchstone: the Claude Code CLI. Creative director: CJ — fast, definitive calls; ask
before changing canon.*
