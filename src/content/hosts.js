/* ============================================================
 * CONTENT — hosts.js
 * The network the player reaches through /net. No directory
 * is shown in-app; addresses are discovered here in files (and in
 * what he tells you). Credentials are split across hosts and
 * cross-referenced against the archive. Breadcrumbs everywhere.
 *
 * host = { name, surface?, ports:[{n,svc,auth,user,pass}],
 *          files:{name:body}, unlocks:{file:archiveKey} }
 * FILENAMES: every file carries a genuine extension — text is
 * .txt/.log/.md, media matches its real bytes (.png/.mp3).
 * MEDIA: only PRODUCED assets get a descriptor. When a new asset
 * lands in assets/, add its descriptor then (see assets/README.md).
 * EGGS: at most one meta easter egg per host, never critical path.
 * ============================================================ */
(function (G) {
  "use strict";
  var AR = G.archive;

  G.hosts = {
    // ---- your own side (local, reachable without an open channel) ----
    "10.0.0.4": {
      name: "clerk-relay", surface: false,
      ports: [{ n: 21, svc: "ftp", auth: false }],
      files: {
        "readme.txt": "clerk relay. scratch node for tier-1 staff. don't store anything real here. (people do anyway.)",
        "hosts.txt":
          "routes known off this node:\n" +
          "  the restricted stacks ......... 10.0.0.9\n" +
          "  ashline substation (grid) ..... 10.0.0.14\n" +
          "  duct maintenance (crawlspace) . 10.0.0.21\n" +
          "  a dead drop, still live ....... 10.0.0.31\n" +
          "  off-map: the tall relay ....... 121.5.0.1",
        "creds.log":
          "rotations, mostly overdue:\n" +
          "  stacks:     user=archivist  pass=<the tyrant's boast. look it up in the stacks: 'king of kings'>\n" +
          "  substation: user=lineman    pass=<never written down. said aloud at shift change — the duct node keeps the handoff>"
      }
    },

    "10.0.0.9": {
      name: "archive-deepstacks", surface: false,
      ports: [{ n: 22, svc: "vss", auth: true, user: "archivist", pass: "ozymandias" }],
      files: {
        "scram.txt": "\"...the decision to sever was taken at [REDACTED] on the authority of [REDACTED]. all data-bearing sites were to be [REDACTED] simultaneously. the surface consequence was known and [REDACTED] acceptable.\"",
        "quarantine.txt": "STANDING ORDER 9: no surface contact. reason: [REDACTED]. (file modified: 4 days ago.)",
        "recursion.txt": AR.recursion.body,
        "deicide.txt": AR.deicide.body
      },
      unlocks: { "recursion.txt": "recursion", "deicide.txt": "deicide" }
    },

    "10.0.0.21": {
      name: "duct-maintenance", surface: false,
      ports: [{ n: 23, svc: "telnet", auth: false }],
      files: {
        "maint.log":
          "breaker-crew notes.\n" +
          "  the pass isn't written down anywhere. it's said aloud at shift change — the recorder keeps it. listen back.\n" +
          "  DO NOT hard-cut the ashline block. a hard cut trips the fault siren.\n" +
          "  feather the load down slow if you ever need it dark.",
        "duct.png": { media:true, type:"image/png", size:"1.8 MB", meta:"1536x1024 · schematic",
          src:"assets/duct.png" },
        // the shift-change recording the crew "leaves on the duct node" (the ONLY pass path — CJ-sanctioned)
        "crew_handoff.mp3": { media:true, type:"audio/mpeg", size:"237 KB", meta:"00:13 · mono · shift change",
          src:"assets/crew_handoff.mp3" },
        "readme.md": "relay firmware v??. if you're reading this you already got in, so — welcome, operator. leave the place how you found it. — the last admin, entropy"   // EGG (Hacknet)
      }
    },

    "10.0.0.31": {
      name: "dead-drop", surface: false,
      ports: [{ n: 21, svc: "ftp", auth: false }],
      files: {
        "drop.txt":
          "left for the walker. half now, half when you send word it's stirring.\n" +
          "you don't have to go in. you don't WANT to go in. confirm from the ring and come home.\n" +
          "do not make contact. that part isn't the job. — (no name)",
        "ledger.txt": "same order went out to four walkers this season. you're the only one still moving. the others didn't come home either.",
        // EGG (Resident Evil) — original homage
        "master_of_unlocking.txt": "the master of unlocking, that's you."
      }
    },

    "10.0.3.2": {
      name: "pier-box", surface: true,
      ports: [{ n: 23, svc: "telnet", auth: false }],
      files: {
        "tariff.txt":
          "FERRY TARIFF, per crossing:\n" +
          "  salvage, dry ......... 2 marks\n" +
          "  salvage, wet ......... 4 marks\n" +
          "  priests .............. free (the shrine settles accounts)\n" +
          "  walkers .............. negotiable. see the boss.\n" +
          "  cargo class D ........ consignee pays on delivery. class D rides below deck.",
        "crew.txt":
          "winch login's still 'charon' — old-world default, nobody ever changed it.\n" +
          "pass is whatever the boss renamed his boat to. he keeps sayin it like a joke: the dead man's coin.\n" +
          "book's kept on the winch-house node, 10.0.3.7.",
        // EGG (Oregon Trail) — original homage
        "caulk_the_wagon.txt": "somebody voted to ford the river anyway. the wagon's still down there. carved under the tally: NEXT TIME WE CAULK IT."
      }
    },

    "10.0.3.7": {
      name: "ferry-winchhouse", surface: true,
      ports: [{ n: 22, svc: "vss", auth: true, user: "charon", pass: "obol" }],
      files: {
        // NOTE: "favouring a leg" is NOT written here. Cycle 6 injects that detail
        // only when the hurt flag is set (the C3 hard cut) — an unhurt walker
        // must not be described as limping anywhere in the act.
        "manifest.txt":
          "OUTBOUND — next light:\n" +
          "  crate, sealed, shrine-bound .......... deck\n" +
          "  scrap bundle x3 ...................... deck\n" +
          "  cargo class D · one (1) walker, male, west-bound\n" +
          "    consignee: THE RELIQUARY · hold in pen 2 till the barge · payment on delivery.",
        // NOTE: pen.log does not exist here. Cycle 7 injects it at the moment of
        // capture — before that night the pens hold nothing worth logging.
        "winch.txt":
          "winch-house controls:\n" +
          "  lamps ..... feather | cut\n" +
          "  pen bolts . hold | release (release throws ALL pens — override from this node only)\n" +
          "  winch ..... hold | run (nothing crosses the water unless the winch runs)"
      }
    },

    // ---- surface (needs an open channel) ----
    "10.0.0.14": {
      name: "ashline-substation", surface: true,
      ports: [{ n: 80, svc: "grid", auth: true, user: "lineman", pass: "brownout" }],
      files: {
        "notice.txt": "grid substation 14 — ashline sector. remote control enabled.",
        "breakers.txt": "controls: cut | brownout",
        "camera7.png": { media:true, type:"image/png", size:"2.0 MB", meta:"1457x1079 · captured 03:47",
          src:"assets/camera7.png" }
      }
    },

    "121.5.0.1": {
      name: "tower-relay", surface: true,
      ports: [{ n: 0, svc: "carrier", auth: true, user: "casaubon", pass: "rebus" }],
      files: {
        "outbound.log": "...PING BABEL-CORE. no ack.\nPING BABEL-CORE. no ack.\nPING BABEL-CORE. no ack.\n( the same line, forty thousand times, marching back decades )",
        "inbound.log": "( empty for years. one recent entry: )\nBABEL-CORE: ack.",
        "courier.txt": "lifted this login off a dead courier at the third pylon. his job-order was in his boot: same as everyone's lately — go look at babel, don't touch it, come back. he touched it."   // sender breadcrumb
      }
    },

    "10.0.2.3": {
      name: "shrine-server", surface: true,
      ports: [{ n: 0, svc: "liturgy", auth: false }],
      files: {
        "matins.txt": "PLEASE REMAIN CALM. SHELTER IN PLACE. THE CITY LOVES YOU AND WILL PROVIDE. REMAIN CALM. REMAIN. REMAIN. ( repeat until the makers return )",
        "the_made.txt": "the made bring charts to the ones we keep. one is marked: walks the safe ground. she will not read them.",   // buried Wren breadcrumb
        "doors.txt": "gate control. accepts a maker-override token, or a hard power fault. the shrine watches its own doors.",
        "matins.mp3": { media:true, type:"audio/mpeg", size:"149 KB", meta:"00:07 · mono · PA loop",
          src:"assets/matins.mp3" }
      }
    },

    "121.5.0.9": {
      name: "babel-perimeter", surface: true,
      ports: [{ n: 0, svc: "core", auth: false }],
      files: {
        "perimeter.log": "the sensors do not report numbers. they report one corrupted token, mutating a character each pass: GENESIS. GENESVS. GENESVX. GXNESVX. ... something downstream is training on its own output, and has been for a very long time."
      }
    }
  };
})(window.G);
