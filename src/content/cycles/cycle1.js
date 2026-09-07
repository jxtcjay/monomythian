/* CONTENT — cycles/cycle1.js — "CARRIER"  (the pilot)
   Accidental contact. Archive tutorial as a proof-of-work report.
   He is nobody: a hired man sent to look at Babel. The handle is
   just a handle. */
(function (G) {
  "use strict";
  G.cycles.push({
    id: "c1", title: "Carrier",
    steps: [
      { t: "sys", v: "[ VAULTNET \u00b7 archive terminal arch-7 \u00b7 night cycle ]" },
      { t: "spacer" }, { t: "pause", v: 400 },
      { t: "sys", v: "  this terminal has no operator handle." },
      { t: "sys", v: "  type a handle to sign your logs, then press enter:" },
      { t: "ask", store: "username", max: 24, fallback: "archivist", after: "  registered \u2014 {}." },
      { t: "spacer" }, { t: "pause", v: 500 },

      { t: "sys", v: "\u203a resuming: crate 0x4F \u2014 salvaged comms units. cataloguing." }, { t: "pause", v: 420 },
      { t: "sys", v: "  unit 1 \u2014 dead." }, { t: "pause", v: 320 },
      { t: "sys", v: "  unit 2 \u2014 dead." }, { t: "pause", v: 320 },
      { t: "sys", v: "  unit 3 \u2014" }, { t: "pause", v: 700 }, { t: "spacer" },
      { t: "alert", v: "[ !! carrier \u00b7 band 121.5 \u00b7 SURFACE ]" }, { t: "pause", v: 240 },
      { t: "sys", v: "  this unit reads dead. it is receiving anyway." }, { t: "pause", v: 700 }, { t: "spacer" },

      { t: "in", who: "unknown", v: "you're late. i've been sittin in the dark for an hour." }, { t: "pause", v: 160 },
      { t: "in", who: "unknown", v: "im at the west substation, like we said. is the road clear or not?" },
      { t: "spacer" },
      { t: "reply", reprompt: "...say again? your carrier's breakin up.", opts: [
        { keywords: ["wrong", "mistake", "not her", "who", "who is", "whos this", "who are you", "sorry", "no idea", "dont know", "never met", "dont understand"],
          steps: [ { t: "in", who: "unknown", v: "...what?" } ] },
        { keywords: ["clear", "road", "yes", "safe", "come on", "come over", "come ahead", "come through", "go ahead", "good to go"],
          steps: [ { t: "in", who: "unknown", v: "you dont even sound sure. since when." } ] },
        { default: true, steps: [ { t: "in", who: "unknown", v: "hello? dont do this to me right now." } ] }
      ]},
      { t: "spacer" }, { t: "pause", v: 200 },
      { t: "in", who: "unknown", v: "wait. your carrier's wrong. the tone of it. thats not her rig." }, { t: "pause", v: 160 },
      { t: "in", who: "unknown", v: "who is this?" },
      { t: "spacer" },
      { t: "reply", reprompt: "say it again. who am i talkin to?", opts: [
        { default: true, steps: [
          { t: "in", who: "unknown", v: "no. i dont know you." }, { t: "pause", v: 140 },
          { t: "in", who: "unknown", v: "youre not her." }
        ]}
      ]},
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "unknown", v: "this line was supposed to be dead to everyone but her." }, { t: "pause", v: 160 },
      { t: "in", who: "unknown", v: "if it reached you instead, then youre\u2014 youre underground. one of the buried cities." }, { t: "pause", v: 140 },
      { t: "in", who: "unknown", v: "nothin else could still be listenin this deep." },
      { t: "spacer" }, { t: "pause", v: 450 },

      { t: "in", who: "mono", v: "okay. i wasnt gonna pull a stranger into this." }, { t: "pause", v: 160 },
      { t: "in", who: "mono", v: "but youre the first voice thats answered in nine days, and out here guessin gets people killed." },
      { t: "spacer" },
      { t: "in", who: "mono", v: "one thing. small. then ill leave you be." },
      { t: "spacer" }, { t: "pause", v: 350 },
      { t: "in", who: "mono", v: "theres a place i got paid to reach. i only got the name \u2014 no map, no idea whats standin." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "you people kept the old world, all of it, filed away down there. the name is Babel." }, { t: "pause", v: 200 },
      { t: "in", who: "mono", v: "search your archive for it, then tell me what the place actually was." },
      { t: "spacer" },
      { t: "reply",
        reprompt: "thats not what the record says. go read it \u2014 search Babel in your archive \u2014 then tell me what the place was.",
        opts: [
          { keywords: ["machine city", "city of machines", "machines", "machine", "networked", "network", "wired", "glassed", "glass", "lethal", "no there", "nothing there", "ai", "computer", "computers", "data center", "datacenter", "server", "servers", "gods", "minds", "ruins", "rubble", "gone", "destroyed", "wasteland", "dead city", "nothing left", "nothing survived", "nothing standing", "leveled", "levelled", "flattened", "wiped out", "burned", "ash", "crater", "reactors", "their capital"],
            steps: [
              { t: "pause", v: 300 },
              { t: "in", who: "mono", v: "...a city of machines." }, { t: "pause", v: 260 },
              { t: "in", who: "mono", v: "course it is. the one place they paid me to reach is the thing that ended the world." }
            ]}
        ]},
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "doesnt change it. somebody wants to know whats left there, and theyre payin. i dont ask why. i just walk." }, { t: "pause", v: 160 },
      { t: "in", who: "mono", v: "but thank you. thats the first true thing anyone's give me out here." },
      { t: "spacer" }, { t: "pause", v: 450 },

      { t: "in", who: "mono", v: "one more thing, since you keep callin me nothin. i go by Monomythian." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "picked it off a wall a long time back. liked the sound of it." },
      { t: "spacer" },
      { t: "reply", opts: [
        // asks what the name means
        { keywords: ["mean", "story", "hero", "return", "leave", "monomyth", "myth", "journey", "why"],
          steps: [
            { t: "in", who: "mono", v: "your records say? the one story \u2014 hero leaves, suffers, comes home changed." }, { t: "pause", v: 140 },
            { t: "in", who: "mono", v: "(dry) i aint him. im a guy they pay to walk. but the names mine now." }
          ]},
        // gives their own name back \u2014 he just traded his, most people trade back
        { keywords: ["im", "my name", "call me", "names", "im called", "you can call me", "nice to meet", "meet you", "pleasure", "introduc"],
          steps: [
            { t: "in", who: "mono", v: "...huh. a name for a name. aint had that trade in a long while." }, { t: "pause", v: 160 },
            { t: "in", who: "mono", v: "good to know you." }
          ]},
        // a flat acknowledgement \u2014 "okay", "got it", "sure"
        { keywords: ["okay", "ok", "alright", "aight", "got it", "sure", "noted", "gotcha", "i see", "fair enough", "understood", "cool", "fine", "makes sense"],
          steps: [
            { t: "in", who: "mono", v: "heh. not much of a talker. sfine \u2014 i got enough words for the both of us out here." }
          ]},
        { default: true, steps: [ { t: "in", who: "mono", v: "sounded like somebody who mattered, when i picked it. i dont. but its mine now." } ] }
      ]},
      { t: "spacer" }, { t: "pause", v: 400 },
      { t: "alert", v: "[ keeping this channel open is heresy under Vault Edict 9. ]" },
      { t: "in", who: "mono", v: "so? you stayin on the line with me, or not?" },
      { t: "spacer" },
      { t: "reply", reprompt: "...say it plain for me. you stayin on this line, or cuttin me loose?", opts: [
        { keywords: ["keep", "help", "stay", "stayin", "stick", "open", "yes", "yeah", "yep", "yup", "i am", "iam", "we are", "im in", "with you", "hide", "not going anywhere", "not goin anywhere", "going nowhere", "goin nowhere", "not going", "not goin", "aint going", "aint goin", "staying put", "stayin put", "ill be here", "ill help", "ill stay", "i will", "will", "sure", "okay", "ok", "of course", "always", "im here", "count on me", "count me in", "promise", "never leave", "aint leavin", "not leavin", "not leaving", "wont leave", "wont report", "cant report", "wont turn", "cant turn", "wont flag", "wont tell", "for you", "affirmative", "you bet", "damn right", "here", "absolutely", "definitely", "certainly", "obviously", "mhm", "mmhm", "uh huh", "yea", "aye", "for sure", "no question", "as long as"],
          steps: [
            { t: "pause", v: 300 },
            { t: "in", who: "mono", v: "okay. okay \u2014 thank you." }, { t: "pause", v: 180 },
            { t: "in", who: "mono", v: "same band, same time tomorrow. if i dont answer, assume the worst, and dont come lookin." },
            { t: "spacer" }, { t: "pause", v: 450 },
            { t: "alert", v: "[ signal lost. ]" },
            { t: "contact" }, { t: "host", ip: "121.5.0.1" },
            { t: "spacer" },
            { t: "sys", v: "  he'll call again next cycle. switch to /home when you're ready." },
            { t: "sys", v: "  (meanwhile: /archive to search the records \u00b7 /net to reach hosts \u00b7 /files for downloads)" }
          ]},
        // bare "wont"/"cant" are NOT here: english uses them to promise ("i wont
        // leave you", "i cant abandon him"), so they'd read a vow as a refusal.
        { keywords: ["cut", "report", "no", "nope", "nah", "stop", "end", "flag", "hang up", "i wont", "i cant", "cant do", "wont do", "have to report", "gotta report", "turn you in", "turn him in", "not worth", "too risky", "too dangerous", "hell no", "walk away", "leave you", "of course not", "course not", "im out", "goodbye"],
          steps: [
            { t: "pause", v: 400 },
            { t: "sys", v: "  you flag the contact for Vault Security. you stay clean. you stay safe." }, { t: "pause", v: 300 },
            { t: "sys", v: "  the line goes dead. you never learn whether the hired man reached the grave he was walking toward." },
            { t: "spacer" }, { t: "sys", v: "  type  reset  to choose again." },
            { t: "deadEnd" }
          ]}
      ]}
    ]
  });
})(window.G);
