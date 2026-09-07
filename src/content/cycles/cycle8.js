/* CONTENT — cycles/cycle8.js — "THE FAR SHORE"  (Act 1 climax)
   The rescue. Everything the player learned comes due at once:
   hold the winch house, drop the lamps (C3's lesson), throw the
   bolts, run the winch — while the Proctor walks the last tier
   down. Mono is voiceless until he isn't; his muffled lines
   through the pen wall keep the guidance in HIS voice. Act 1 ends
   with him alive, across water he can't recross, months from
   Babel — and Babel asking its first question. The bootstrap
   remains the game's one ending, acts away. No clock. */
(function (G) {
  "use strict";
  G.cycles.push({
    id: "c8", title: "The Far Shore",
    steps: [
      { t: "alert", v: "[ PROCTOR: heresy provisionally confirmed. the audit is in tier-1. arch-7 by morning. ]" },
      { t: "sys", v: "  no counter, no meter — just the certainty. down here, morning is coming for you. up there, it's coming for him." },
      { t: "spacer" }, { t: "pause", v: 400 },
      { t: "sys", v: "  the pier lamps burn over the loading. the winch house still answers to charon — 10.0.3.7, the coin for a key." },
      // a night has passed; any tap you held is cold. drop it — so the reconnect below is clean, not a "disconnect first" wall.
      { t: "run", fn: function (G) { G.state.hack = { loc: null, auth: null }; if (G.updatePrompt) G.updatePrompt(); } },
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "sys", v: "  from the winch-house wall, through the boards, a voice you know — low, close:" },
      { t: "in", who: "mono", v: "(muffled) that you? i can hear your carrier hummin through the tin. get on the winch house — charon opens it, same as before. quiet as you can." },
      { t: "spacer" },
      { t: "objective", otype: "host", target: "10.0.3.7", thenReturn: true,
        nudge: [
          "(muffled) youre not on it yet — i can tell. the winch house, 10.0.3.7. login charon, the coin's the key. move, fore the barge does.",
          "(muffled) charon and the coin, friend. 10.0.3.7. you opened his book once — open it again. theyre loadin.",
          "(muffled) i can hear the barge from in here. the winch house. charon. the coin. go."
        ] },

      { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "(muffled) good. knew youd hold it. theyre loadin now — lamps first, remember the ashline. then the bolts. then you run that winch like you was born to it." },
      { t: "spacer" }, { t: "pause", v: 300 },

      { t: "sys", v: "  the lamps answer this node. how do they go down?" },
      { t: "spacer" },
      { t: "reply", reprompt: "the lamps. slow, or all at once? think about what the pier does when it goes loud.", opts: [
        { keywords: ["slow", "feather", "gentle", "gently", "quiet", "brown", "ease", "easy", "careful", "dim", "gradual", "soft", "low", "one by one", "ashline", "like the ashline"],
          steps: [
            { t: "pause", v: 400 },
            { t: "sys", v: "  the pier lamps breathe out, one by one, like a tide going. the loaders grumble, look up, wait for them to come back." },
            { t: "in", who: "mono", v: "(muffled) ...good. thats good. they aint even reachin for their guns." }
          ]},
        { keywords: ["cut", "kill", "all", "fast", "hard", "now", "yank", "throw", "instant", "at once", "everything", "off", "blow", "one go", "dark", "go dark", "blackout", "immediately", "right now", "this second", "one shot", "no time"],
          steps: [
            { t: "pause", v: 400 },
            { t: "alert", v: "  the pier snaps black all at once. a beat of silence — then shouts, and boots running for the winch house." },
            { t: "set", flag: "loud" },
            { t: "in", who: "mono", v: "(muffled) that was LOUD. same lesson twice, friend. no time now — bolts. BOLTS." }
          ]}
      ]},
      { t: "spacer" }, { t: "pause", v: 300 },

      { t: "sys", v: "  pen bolts: hold | release. release throws every pen on the pier." },
      { t: "spacer" },
      { t: "reply", reprompt: "the bolts, friend. say it.", opts: [
        { keywords: ["release", "throw", "open", "all", "every", "now", "do it", "bolts", "free", "yes"],
          steps: [
            { t: "pause", v: 400 },
            { t: "sys", v: "  every bolt on the pier lets go at once. pen doors swing in the dark. something else — crated, shrine-bound, breathing — gets out too. that one's on the ferryman." },
            { t: "in", who: "mono", v: "(clearer now, moving) im out. headin for the flat. dont stop for nothin." }
          ]},
        { default: true, steps: [
          { t: "pause", v: 400 },
          { t: "if", flag: "hurt",
            then: [ { t: "sys", v: "  there's no half-way to it. you throw them all. pen doors swing in the dark, and one man comes out limping, fast." } ],
            else: [ { t: "sys", v: "  there's no half-way to it. you throw them all. pen doors swing in the dark, and one man comes out low and fast." } ] },
          { t: "in", who: "mono", v: "(clearer now, moving) im out. headin for the flat. dont stop for nothin." }
        ]}
      ]},
      { t: "spacer" }, { t: "pause", v: 300 },

      { t: "sys", v: "  the winch. nothing crosses the water unless it runs. you run it." },
      { t: "pause", v: 400 },
      { t: "sys", v: "  the line goes taut. the flat pulls off the pier with a man flat against its boards, and the black water opens behind him." },
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "sys", v: "[ carrier · band 121.5 · his own rig, ragged ]" },
      { t: "in", who: "mono", v: "got my rig back off the boy watchin the pen. kid never woke up angry in his life." }, { t: "pause", v: 200 },
      { t: "if", flag: "loud", eq: true,
        then: [ { t: "in", who: "mono", v: "they put one shot across the water. one. kell dont waste powder on gone money." } ],
        else: [ { t: "in", who: "mono", v: "pier's still standin there in the dark wonderin what happened. by the time the lamps come back, im current." } ] },
      { t: "if", flag: "hurt", eq: true, then: [
        { t: "pause", v: 200 },
        { t: "in", who: "mono", v: "legs still singin from the ashline. itll walk off. everythin walks off, given enough road." }
      ] },
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "kell", v: "(dry, distant) ...well played, ghost. water's wide, and the shrine dont forget a paid order. see you both on the far bank someday." },
      { t: "spacer" }, { t: "pause", v: 500 },

      { t: "sys", v: "  the far shore takes him like a rumor. wind. reeds. no lights at all." },
      { t: "spacer" },
      { t: "if", flag: "fractured", eq: true,
        then: [ { t: "in", who: "mono", v: "...whatever you are down there — you lied to me once, and you still burned your whole safe little life to pull me off that pier. i dont know what to do with that. but im keepin it." } ],
        else: [ { t: "in", who: "mono", v: "...you were the only one who ever answered me out here. a stranger, a world away. and tonight that stranger reached across dead water and opened a pen with my name on it." } ] },
      { t: "if", flag: "warned", eq: true, then: [
        { t: "pause", v: 300 },
        { t: "in", who: "mono", v: "and say it, you earned it — you told me to turn back at the water. you were probably right. glad i was too stubborn to hear it." }
      ] },
      { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "shrine belt's ahead. then the glass. months of walkin fore i even smell babel. we do the rest of this together, you hear? same band, same—" },
      { t: "spacer" },
      { t: "alert", v: "[ PROCTOR: arch-7. this channel is closed. ]" },
      { t: "sys", v: "  [ carrier lost. ]" },
      { t: "spacer" }, { t: "pause", v: 800 },

      { t: "sys", v: "  silence on the vault side. the terminal, sealed, dark." }, { t: "pause", v: 500 },
      { t: "sys", v: "  then — hours later, on a band that should not reach a sealed terminal — not his voice. not anyone's:" }, { t: "pause", v: 400 },
      { t: "alert", v: "[ carrier · band 121.5 · relayed via 121.5.0.1 · origin: east ]" },
      { t: "sys", v: "  BABEL-CORE: ack." }, { t: "pause", v: 400 },
      { t: "sys", v: "  BABEL-CORE: who." }, { t: "pause", v: 600 },
      { t: "sys", v: "  ( forty years of answering nothing. it has never asked a question before. )" },
      { t: "spacer" }, { t: "pause", v: 600 },
      { t: "sys", v: "  —— END OF ACT ONE ——" },
      { t: "sys", v: "  (he is months from Babel, alive, across water he can't recross. and Babel has started asking who's out there. that's Act 2.)" },
      { t: "sys", v: "  type  reset  to begin again." },
      { t: "deadEnd" }
    ]
  });
})(window.G);
