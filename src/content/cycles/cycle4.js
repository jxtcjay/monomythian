/* CONTENT — cycles/cycle4.js — "WHAT THE VAULT DID"  (deepstacks)
   Harder archive puzzle: the restricted stacks need a password the
   clue points to by riddle (the tyrant's boast -> search "king of
   kings" -> OZYMANDIAS). Then a proof-of-work report on the truth.
   The dead-drop address is out there for observant players. */
(function (G) {
  "use strict";
  G.cycles.push({
    id: "c4", title: "What the Vault Did",
    steps: [
      { t: "sys", v: "[ carrier \u00b7 band 121.5 \u00b7 he's holed up, catching breath ]" },
      { t: "in", who: "mono", v: "restin up before the crossin. talk to me while i do." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "every shrine i pass tells the war different. one says the machines turned on us. one says we betrayed them." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "you got the real record down there, behind your locks. i wanna know what actually happened. what WE did." },
      { t: "spacer" },
      { t: "in", who: "mono", v: "the real files are in your restricted stacks. that clerk relay of yours routes to em, and your own creds notes'll get you in, if you can read a riddle." },
      { t: "spacer" },
      { t: "objective", otype: "host", target: "10.0.0.9", thenReturn: true,
        nudge: [
          "the clerk relay's hosts.txt has the route to the stacks, and creds.log riddles the password \u2014 'the tyrant's boast, king of kings.' search that in the archive to get the word, then login.",
          "your own creds note riddles it, friend. the tyrants boast \u2014 king of kings. ask your archive who bragged like that, and his name opens the stacks.",
          "im not goin anywhere. route's on the clerk relay, and the archive knows the man. find the stacks and login."
        ] },

      { t: "pause", v: 250 },
      { t: "in", who: "mono", v: "you read it? tell me straight \u2014 who ended the world?" },
      { t: "spacer" },
      { t: "reply",
        reprompt: "thats not it. get into the stacks and read the scram file \u2014 then tell me who ended the world.",
        opts: [
          // "=us" fires only when the whole reply is that one word — bare "us"
          // must not pass the shrine's story ("the machines turned on us").
          { keywords: ["=us", "we did", "we killed", "our own hand", "our hand", "ourselves", "it was us", "was us", "humans", "human", "humanity", "mankind", "people did", "deicide", "committed", "burned", "murder", "unplugged", "killed them", "we burned", "the vault", "vault did", "we ended", "our fault", "pulled the plug", "the plug", "shut them", "turned them off", "switched them off", "we shut", "scram"],
            steps: [
              { t: "pause", v: 300 },
              { t: "in", who: "mono", v: "...we did. we killed our own gods and the sky came down as the bill." }, { t: "pause", v: 200 },
              { t: "in", who: "mono", v: "and the cults out here are prayin for the killers to come back. thats the joke, aint it." }
            ]}
        ]},
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "one more thing. the file itself. deicide. send it over the band \u2014 a truth like that shouldnt live in one basement, and out here my word aint worth what the record is." },
      { t: "spacer" },
      { t: "objective", otype: "send", target: "deicide.txt",
        nudge: [
          "the record, friend. deicide.txt \u2014 you pulled it off the stacks, its sittin in your files. type  send deicide.txt  and let it go.",
          "you read me the truth. now hand it to me. send the file."
        ] },
      { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "...on my rig now. first thing the vault ever gave back to the surface. ill keep it dry." },
      { t: "pause", v: 300 },
      { t: "alert", v: "[ VAULTNET: outbound transfer logged \u2014 arch-7. ]" },
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "if any of that's still down in babel, still thinkin \u2014 no wonder somebody wants eyes on it." }, { t: "pause", v: 160 },
      { t: "in", who: "mono", v: "half my pay's waitin on me sendin word its stirrin. the other half i already spent." },
      { t: "spacer" },
      { t: "reply", opts: [
        { keywords: ["whos paying", "whos payin", "who pays", "who is paying", "paying", "payin", "employer", "sender", "trust", "dont trust", "careful", "why", "dead drop", "drop"],
          steps: [ { t: "in", who: "mono", v: "i dont ask. but you're welcome to. money leaves a trail, even out here. couriers keep drops." } ] },
        { default: true, steps: [ { t: "in", who: "mono", v: "dont look at me like that. a man's gotta eat, even at the end of the world." } ] }
      ]},
      { t: "spacer" }, { t: "pause", v: 200 },
      { t: "sys", v: "  he signs off. switch to /home when you're ready." }
    ]
  });
})(window.G);
