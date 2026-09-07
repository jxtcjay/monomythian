/* CONTENT — cycles/cycle3.js — "FIND YOUR OWN WAY IN"  (substation)
   The full forensic sweep. A split credential (username on the
   clerk relay, the pass DICTATED in crew_handoff.mp3), then two
   image gates — the crawl schematic duct.png (in at AH-1, take the
   D6 supply run; D2/D7 are stamped collapsed) and the substation's
   own camera7.png (three patrol lights on the road, a downed line
   across the yard). Both media-vital by CJ order (2026-07-09).
   Observant players are rewarded; careless ones get him hurt. */
(function (G) {
  "use strict";
  G.cycles.push({
    id: "c3", title: "Find Your Own Way In",
    steps: [
      { t: "sys", v: "[ carrier · band 121.5 · wind on the line ]" },
      { t: "in", who: "mono", v: "im on the Ashline, headin west. theres a substation lightin the whole block up — 10.0.0.14." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "lit means seen, and im not alone. the Ferry runs this stretch. they clock me, im salvage." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "so i dont use the road and i dont use the gate. you people built UNDER everythin — theres an air-crawl beneath this block. i found the intake housing. its a maze down there." },
      { t: "spacer" },
      { t: "in", who: "mono", v: "nobody's handin you this one. that clerk relay you people run — 10.0.0.4 — leaks routes and old creds. scan it." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "the linemen dont write the substation pass down — itll be somewhere the crews work. and the crews kept a MAP of this crawl. i need both." },
      { t: "spacer" },
      { t: "host", ip: "10.0.0.4" },
      { t: "objective", otype: "host", target: "10.0.0.14", thenReturn: true,
        nudge: [
          "start at 10.0.0.4. its files name the other nodes and the substation user — the pass is said aloud on the duct node, and the crawl map is kept there too. then get into 10.0.0.14.",
          "the clerk relay, 10.0.0.4 — it leaks the crews nodes and the substation user. the pass gets SAID at shift change, not written. and dont forget my map.",
          "im sittin at a dead fan in the dark, friend. clerk relay, the crews node, the spoken pass, the crawl map. then 10.0.0.14."
        ] },

      { t: "pause", v: 250 },
      { t: "in", who: "mono", v: "youre in their grid. good. now get ME in. im at the intake — big dead fan, plate says AH somethin." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "first — the crews kept a map of this crawl. duct.png, on their node. send it over the band. if we lose each other down there, i want it on my own rig." },
      { t: "spacer" },
      { t: "objective", otype: "send", target: "duct.png",
        nudge: [
          "the map, friend. duct.png, off the crews duct node. pull it if you aint yet, then punch  send duct.png  into that terminal — the band does the rest.",
          "im starin at a dead fan and a black hole in the ground. the crawl map. send it over."
        ] },
      { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "got it. grainy little thing, but it reads. aight." },
      { t: "spacer" }, { t: "pause", v: 200 },
      { t: "in", who: "mono", v: "now talk me through the crawl. which run do i take?" },
      { t: "spacer" },
      { t: "reply",
        reprompt: "the maps schedule marks half these runs COLLAPSED. i need the one thats active and wide enough for a man. which is it?",
        opts: [
          { keywords: ["ah 1", "ah1", "air handler", "handler", "intake", "d6", "d 6", "10x6", "10 by 6", "ten by six", "supply", "live node", "live run", "active", "not collapsed", "isnt collapsed", "still open", "open one", "wide one"],
            steps: [
              { t: "pause", v: 300 },
              { t: "in", who: "mono", v: "in at the handler, follow the ten-by-six supply. D6 — the run your live node sits on. not the two stamped collapsed." }, { t: "pause", v: 250 },
              { t: "sys", v: "  a long scrape of tin. breathing, counted. then a grate, lifted slow." },
              { t: "in", who: "mono", v: "im under the yard. poppin up at the edge of their light." }
            ]}
        ]},
      { t: "spacer" }, { t: "pause", v: 300 },

      { t: "in", who: "mono", v: "fore i step out — you own their node now, so you own their eye. camera 7. pull the still. whats on the road behind me?" },
      { t: "spacer" },
      { t: "reply",
        reprompt: "its in the frame, friend. the road behind me. what do you see on it?",
        opts: [
          { keywords: ["three", "3", "lights", "headlight", "headlights", "patrol", "rigs", "trucks", "vehicles", "cars", "convoy", "ferry", "closing", "approaching", "coming", "behind you", "following", "tail", "hunters", "kell"],
            steps: [
              { t: "pause", v: 300 },
              { t: "in", who: "mono", v: "three sets of lights. thats the ferrys whole night crew on this stretch, and theyre pointed my way." }
            ]}
        ]},
      { t: "spacer" }, { t: "pause", v: 300 },

      { t: "in", who: "mono", v: "so. three rigs on the road that come runnin at any noise, and a yard fulla light on me. the light is yours to kill. how you droppin it — slow, or all at once?" },
      { t: "spacer" },
      { t: "reply", reprompt: "slow or all at once? tell me plain — and think about what the crew notes said.", opts: [
        { keywords: ["slow", "slowly", "feather", "gentle", "gently", "quiet", "quietly", "brown", "brownout", "ease", "easy", "careful", "carefully", "dim", "gradual", "soft", "softly", "low", "bleed", "one by one"],
          steps: [
            { t: "pause", v: 400 },
            { t: "sys", v: "  the block goes dark without a sound. on the road, the running lights slow, mill, turn away." },
            { t: "in", who: "mono", v: "clean. didnt even hear it happen. im over the fence and gone fore they finish their smoke." }, { t: "pause", v: 160 },
            { t: "in", who: "mono", v: "you did your readin, didnt you." }
          ]},
        { keywords: ["cut", "kill", "all", "fast", "hard", "hard cut", "now", "yank", "throw", "instant", "at once", "everything", "off", "rip", "pull", "flip", "blackout", "kill it", "blow", "one go"],
          steps: [
            { t: "pause", v: 400 },
            { t: "alert", v: "  a fault siren splits the dark. every running light on the road snaps toward the sound. toward him." },
            { t: "set", flag: "hurt" },
            { t: "in", who: "mono", v: "siren— thats on me? no— theyre turnin, all three, comin fast, im—" }, { t: "pause", v: 300 },
            { t: "sys", v: "  [ carrier lost. ]" }, { t: "pause", v: 600 },
            { t: "sys", v: "  ...he opens again a while later. quieter. a limp in the next camera. a cough that wasn't there." },
            { t: "in", who: "mono", v: "the crew notes said not to hard-cut. you read em, or no?" }
          ]}
      ]},
      { t: "spacer" }, { t: "pause", v: 300 },

      { t: "sys", v: "[ carrier · unknown band · a different rig ]" },
      { t: "in", who: "kell", v: "substation went dark on operator work, not scav work. so theres a ghost in my grid tonight." }, { t: "pause", v: 140 },
      { t: "if", flag: "hurt",
        then: [ { t: "in", who: "kell", v: "names Kell. i broker this stretch. you just cost me a catch — the limpin one. woulda paid good." } ],
        else: [ { t: "in", who: "kell", v: "names Kell. i broker this stretch. somebody walked through my lights tonight clean, and i never even got a look. that costs me." } ] },
      { t: "spacer" },
      { t: "reply", opts: [
        { keywords: ["not for sale", "his", "leave him", "back off", "mine", "cant have", "no", "not merchandise", "not property", "not cargo", "not yours", "near him", "nowhere near", "stay away", "hands off", "not him", "forget it", "not happening"],
          steps: [ { t: "in", who: "kell", v: "everything up here's for sale, ghost. you just aint heard the price yet." } ] },
        { keywords: ["buy", "people", "slaver", "monster", "sick", "sell", "trade"],
          steps: [ { t: "in", who: "kell", v: "i move people. buyin's what the shrine does — they keep em. me, im just the ferry cross the water." } ] },
        { default: true, steps: [ { t: "in", who: "kell", v: "heh. dont matter, ghost. ill be on this band when you aint." } ] }
      ]},
      { t: "spacer" }, { t: "pause", v: 200 },
      { t: "in", who: "kell", v: "i move all kinds cross this water. scavs, priests, mapmakers — everybody needs the ferry eventually." },
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "crossin's ahead. past it theres a shrine-town i gotta go through. but first i need the truth about what im walkin to." },
      { t: "spacer" },
      { t: "sys", v: "  he signs off. switch to /home when you're ready." }
    ]
  });
})(window.G);
