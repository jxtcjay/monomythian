/* CONTENT — cycles/cycle6.js — "THE FERRYMAN'S LEDGER"  (pier + winch house)
   Kell quotes a fare that's too kind. The player breaks into the
   ferry's winch-house node (split clue: username + riddle on the
   pier box, password via the archive — the dead man's coin) and
   reads the outbound manifest: the cargo is HIM. Proof-of-work
   report, then the seed of the third way. */
(function (G) {
  "use strict";
  G.cycles.push({
    id: "c6", title: "The Ferryman's Ledger",
    steps: [
      { t: "sys", v: "[ carrier · band 121.5 · pier lights across the water ]" },
      { t: "in", who: "mono", v: "im at the landin. kell met me himself. all smiles. quoted me half what i figured for the crossin." }, { t: "pause", v: 160 },
      { t: "in", who: "mono", v: "nobody cuts a walker a deal out of kindness. not on this water." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "theres an old pier box by the ramp, plate says 10.0.3.2. get on it. find out what the friend price buys." },
      { t: "spacer" },
      { t: "host", ip: "10.0.3.2" },
      // the manifest only mentions the leg if the ashline actually hurt him (C3 hard cut)
      { t: "run", fn: function (G) {
          if (G.state.flags.hurt) {
            G.hosts["10.0.3.7"].files["manifest.txt"] = G.hosts["10.0.3.7"].files["manifest.txt"]
              .replace("one (1) walker, male, west-bound", "one (1) walker, male, favouring a leg, west-bound");
          }
        } },
      { t: "objective", otype: "host", target: "10.0.3.7", thenReturn: true,
        nudge: [
          "start with the pier box at 10.0.3.2 — its crew note names the winch-house node and who logs into it. the pass is the boss's little joke about his boat. your archive knows the coin.",
          "pier box first, friend. 10.0.3.2. it says who signs into the winch house — and the pass is the joke the boss painted on his own boat. your archive knows the dead mans coin.",
          "im standin on his ramp makin small talk. the pier box, the boatmans name, the coin from your records. get me his book."
        ] },

      { t: "pause", v: 300 },
      { t: "sys", v: "[ carrier · unknown band · the ferryman's rig ]" },
      { t: "in", who: "kell", v: "evenin, ghost. your walker's buyin passage off me. i gave him the friend price. aint that somethin." },
      { t: "spacer" },
      { t: "reply", opts: [
        { keywords: ["why", "kind", "friend", "deal", "cheap", "price", "generous", "what do you get", "catch", "angle", "what do you want", "in it for", "motive", "getting out of", "get out of", "reason", "discount", "whats in it", "your cut", "gain", "benefit", "half price"],
          steps: [ { t: "in", who: "kell", v: "call it an investment." } ] },
        { default: true, steps: [ { t: "in", who: "kell", v: "heh. dont matter what you call it, ghost. barge loads at first light." } ] }
      ]},
      { t: "spacer" }, { t: "pause", v: 300 },

      { t: "in", who: "mono", v: "you got into his book yet? read me the outbound. whats he haulin next light?" },
      { t: "spacer" },
      { t: "reply",
        reprompt: "its in the winch-house manifest. read it, then tell me — whats the cargo?",
        opts: [
          // "=you" fires only when the whole reply is that one word — bare "you"
          // inside a longer sentence would pass players who haven't read the book.
          { keywords: ["=you", "its you", "is you", "youre the", "you are the", "selling you", "sellin you", "sells you", "sold you", "haulin you", "hauling you", "yourself", "the fare", "him", "walker", "cargo", "class d", "pen", "sell", "sold", "sellin", "selling", "consign", "shrine", "reliquary", "trap", "limp", "leg", "a man", "person", "people"],
            steps: [
              { t: "pause", v: 300 },
              { t: "if", flag: "hurt",
                then: [ { t: "in", who: "mono", v: "...cargo class D. one walker, favourin a leg. consignee, the reliquary." } ],
                else: [ { t: "in", who: "mono", v: "...cargo class D. one walker, west-bound. consignee, the reliquary." } ] },
              { t: "pause", v: 220 },
              { t: "in", who: "mono", v: "the fare was never marks. the fare's me. half price cause he collects twice." }
            ]}
        ]},
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "dont spook him. he learns my rig can read his book, i ride that pen tonight stead of tomorrow." },
      { t: "spacer" }, { t: "pause", v: 200 },
      { t: "in", who: "mono", v: "so i walk onto that barge like a fool, or i run and hes right behind me. unless you got a third way." },
      { t: "spacer" },
      { t: "reply", reprompt: "think on what you're holdin. is there a third way?", opts: [
        { keywords: ["pen", "bolt", "winch", "lamp", "lamps", "override", "control", "controls", "node", "ctl", "third", "plan", "free", "open", "release", "hold", "winch house", "dark"],
          steps: [
            { t: "pause", v: 300 },
            { t: "in", who: "mono", v: "...the winch house. it holds the bolts, the lamps, the winch itself. and YOU hold the winch house." }, { t: "pause", v: 200 },
            { t: "in", who: "mono", v: "aight. we got a third way." }
          ]},
        { default: true, steps: [
          { t: "in", who: "mono", v: "then look again at what youre loggin into. bolts. lamps. the winch. he forgot his whole pier answers to a node you own now." }, { t: "pause", v: 200 },
          { t: "in", who: "mono", v: "THATS the third way." }
        ]}
      ]},
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "i board at first light like nothin's wrong. whatever you do from that node — do it while theyre loadin." }, { t: "pause", v: 160 },
      { t: "in", who: "mono", v: "see you on the other side, friend. one way or the other." },
      { t: "spacer" },
      { t: "sys", v: "  he signs off. switch to /home when you're ready." }
    ]
  });
})(window.G);
