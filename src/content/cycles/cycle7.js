/* CONTENT — cycles/cycle7.js — "CARGO"  (the trap springs)
   Kell doesn't wait for first light. The carrier goes dark
   mid-sentence, the Proctor names arch-7, and the only voice left
   on the surface is the ferryman's. No Mono, so no nudges — Kell's
   own taunts carry the breadcrumbs (the book, the pen). The player
   confirms where he's held; the rescue is next cycle. */
(function (G) {
  "use strict";
  G.cycles.push({
    id: "c7", title: "Cargo",
    steps: [
      { t: "sys", v: "[ carrier · band 121.5 · pre-dawn, wind flat ]" },
      { t: "in", who: "mono", v: "cant sleep. loaders are out early and i dont like the way the pier's" }, { t: "pause", v: 250 },
      { t: "in", who: "mono", v: "wait. lamps comin up the boards. theyre at my—" }, { t: "pause", v: 300 },
      { t: "sys", v: "  [ carrier lost. ]" },
      // the moment he's taken, the ferryman's book gains a line it never had before
      { t: "run", fn: function (G) {
          G.hosts["10.0.3.7"].files["pen.log"] =
            "pen 1: empty.\n" +
            "pen 2: occupied. hold for consignee. barge due next light.\n" +
            "pen 3: the bolt sticks. use the winch-house override.";
        } },
      { t: "spacer" }, { t: "pause", v: 600 },

      { t: "alert", v: "[ PROCTOR: anomalous surface link flagged. cross-reference: BABEL, DEICIDE, RECURSION. ]" },
      { t: "alert", v: "[ PROCTOR: terminal of origin identified. arch-7. an audit is walking the stacks tonight. ]" },
      { t: "sys", v: "  no counter, no meter — just the certainty in the words. they've found the terminal. they're coming for the channel." },
      { t: "spacer" }, { t: "pause", v: 400 },

      { t: "sys", v: "[ carrier · unknown band · the ferryman's rig ]" },
      { t: "in", who: "kell", v: "ghost. your walker got nosy feet. wandered where cargo waits, so now he waits with it." }, { t: "pause", v: 160 },
      { t: "in", who: "kell", v: "took his rig off him too. clever thing. shame he wont be needin it — shrine pays triple for a live one." },
      { t: "spacer" },
      { t: "reply", opts: [
        { keywords: ["let him go", "release", "free him", "dont", "stop", "please", "hes mine", "leave him"],
          steps: [ { t: "in", who: "kell", v: "everything up here's for sale, ghost. i told you that the night we met. you just still aint named a price." } ] },
        { keywords: ["buy", "pay", "price", "trade", "deal", "marks", "what do you want", "name it", "how much", "what would it take", "what will it take", "name your price", "ransom", "buy him", "offer", "name a figure", "figure", "what would you take", "take for him", "negotiate", "bargain", "terms", "something you want"],
          steps: [ { t: "in", who: "kell", v: "with what? vault money spends nowhere. you got nothin i can hold... cept maybe that trick you did to the ashline grid. but you wont. your kind watches." } ] },
        { keywords: ["kill", "regret", "burn", "sorry", "warn", "threat", "make you", "pay for this"],
          steps: [ { t: "in", who: "kell", v: "there it is. the vault shows its teeth. snarl all you want from your hole in the ground — my book says the barge sails at first light." } ] },
        { default: true, steps: [ { t: "in", who: "kell", v: "talk all you want, ghost. the book does the talkin on this pier. always has." } ] }
      ]},
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "kell", v: "sleep on it, ghost. come mornin its just business. the pens hold what the manifest says they hold." },
      { t: "spacer" }, { t: "pause", v: 400 },

      { t: "objective", otype: "file", target: "pen.log", thenReturn: true },
      { t: "pause", v: 300 },
      { t: "sys", v: "  pen 2. occupied. hold for consignee. barge due next light." },
      { t: "sys", v: "  he's alive, penned, and the ferryman thinks the winch house is his." },
      { t: "spacer" }, { t: "pause", v: 400 },
      { t: "alert", v: "[ PROCTOR: the audit has reached tier-2. arch-7 is next. ]" },
      { t: "sys", v: "  morning is the barge, and the audit is coming down the stacks. whatever you're going to do, you do it next cycle." },
      { t: "spacer" },
      { t: "sys", v: "  switch to /home when you're ready." }
    ]
  });
})(window.G);
