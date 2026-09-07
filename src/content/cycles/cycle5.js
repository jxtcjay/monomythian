/* CONTENT — cycles/cycle5.js — "THE SENDER'S PRICE"  (dead-drop)
   The employer thread pays off EARLY — at the water's edge, before
   he commits to the crossing. The drop reveals the job was CONFIRM
   AND COME HOME, never contact. And if you lied about the relay in
   C2, the order itself catches you out here. */
(function (G) {
  "use strict";
  G.cycles.push({
    id: "c5", title: "The Sender's Price",
    steps: [
      { t: "sys", v: "[ carrier · band 121.5 · water on the line, close ]" },
      { t: "in", who: "mono", v: "i can smell the crossin from here. kell's water. the fare'll take the last of my advance." }, { t: "pause", v: 160 },
      { t: "in", who: "mono", v: "so fore i pay it — you got me thinkin, back at the stacks. you said money leaves a trail." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "the drop my handler uses is still live — your clerk relay named it. pull it. tell me what im really bein paid to do." },
      { t: "spacer" },
      { t: "host", ip: "10.0.0.31" },
      { t: "objective", otype: "host", target: "10.0.0.31", thenReturn: true,
        nudge: [
          "the dead drop is 10.0.0.31 (the clerk relay's hosts.txt listed it). connect and read what was left for the walker.",
          "your clerk relay named the drop, friend — 10.0.0.31. whatever the sender left for the walker is sittin on it right now.",
          "i aint payin kell's fare till i know the job. 10.0.0.31. read me my own orders."
        ] },

      { t: "pause", v: 250 },
      { t: "in", who: "mono", v: "well? what's the job, really? word for word if you got it." },
      { t: "spacer" },
      { t: "reply",
        reprompt: "read the drop first. what did they actually order — what's the one thing it says not to do?",
        opts: [
          { keywords: ["dont make contact", "no contact", "not make contact", "not to make contact", "never make contact", "not to", "dont touch", "not touch", "just confirm", "confirm", "come home", "come back", "look only", "just look", "only look", "just watch", "observe", "dont go in", "dont go inside", "go inside", "stay out", "stay away", "keep out", "not supposed", "forbid", "forbidden", "from the ring"],
            steps: [
              { t: "pause", v: 300 },
              { t: "in", who: "mono", v: "...confirm it's stirrin and come home. do not make contact." }, { t: "pause", v: 220 },
              { t: "in", who: "mono", v: "and the only way to confirm anythin out here is to get close enough to die of it. huh." }
            ]}
        ]},
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "there was a ledger too, wasnt there. how many walkers got this same job." },
      { t: "spacer" }, { t: "pause", v: 200 },
      { t: "in", who: "mono", v: "four. and none of em came home. whoever's payin dont want a report. they want a door opened, and a body to blame." },
      { t: "spacer" }, { t: "pause", v: 300 },

      { t: "if", flag: "lied", eq: true, then: [
        { t: "in", who: "mono", v: "and hold on. the order says confirm its STIRRIN. whoever wrote it already knows the relay's gettin answers back." }, { t: "pause", v: 200 },
        { t: "in", who: "mono", v: "you read that inbound log for me. you told me it was dead. why." },
        { t: "spacer" },
        { t: "reply", reprompt: "...say somethin. why'd you lie to me.", opts: [
          { keywords: ["sorry", "wrong", "shouldnt", "my fault", "apolog", "forgive", "messed up", "mistake", "regret", "truth", "protect you", "scared"],
            steps: [ { t: "in", who: "mono", v: "yeah. dont do it again. youre the only true thing i got up here — dont be the liar too." } ] },
          { default: true, steps: [ { t: "set", flag: "fractured" }, { t: "in", who: "mono", v: "that wasnt yours to decide." } ] }
        ]},
        { t: "spacer" }
      ]},

      { t: "in", who: "mono", v: "so. knowin all that — you want me to turn back? give it up, go home?" },
      { t: "spacer" },
      { t: "reply", reprompt: "turn back, or keep walkin? tell me plain, friend.", opts: [
        // KEEP GOING — index 0 so negated forms ("dont stop", "dont turn back") route here first
        { keywords: ["no", "nah", "nope", "keep", "cross", "go on", "onward", "onwards", "press on", "push on", "closer", "finish", "do it", "continue", "carry on", "move on", "dont stop", "dont turn", "dont quit", "dont give up", "wont stop", "wont turn", "not turnin", "not stoppin", "forward", "your call", "up to you", "far", "too far", "this far", "come too far", "not turning back", "keep walking", "keep walkin", "worth it"],
          steps: [
            { t: "in", who: "mono", v: "yeah. figured youd say that too." }, { t: "pause", v: 200 },
            { t: "in", who: "mono", v: "i didnt walk a dead world this far to rot on the near bank. for good reasons or stupid ones, im crossin." }
          ]},
        // TURN BACK
        { keywords: ["yes", "yeah", "yep", "yup", "turn", "turn around", "turn back", "walk away", "leave", "go home", "come home", "head back", "head home", "stop", "quit", "give up", "give it up", "retreat", "abandon", "dont go", "dont cross", "dont go on", "shouldnt go", "not worth it", "back home", "obey", "listen"],
          steps: [
            { t: "in", who: "mono", v: "i hear you. i do." }, { t: "pause", v: 200 },
            { t: "in", who: "mono", v: "but the job dont end cause i stop walkin. the ones who turned around didnt come home neither — and men like kell collect on quitters too. only way out is through." },
            { t: "set", flag: "warned" }
          ]}
      ]},
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "ill see about passage tomorrow. the ferryman dont do favors, so this'll cost. talk then." },
      { t: "spacer" },
      { t: "sys", v: "  he signs off. switch to /home when you're ready." }
    ]
  });
})(window.G);
