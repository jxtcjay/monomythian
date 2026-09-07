/* CONTENT — cycles/cycle2.js — "THE SCHOLAR'S KEY"  (tower relay)
   Harder: the login is a cross-reference puzzle. He gives the
   address + username; the PASSWORD hides in the archive record the
   clue points to (casaubon -> "rebus"). Then read the inbound log
   and report the proof word. Sender breadcrumb in courier.txt. */
(function (G) {
  "use strict";
  G.cycles.push({
    id: "c2", title: "The Scholar's Key",
    steps: [
      { t: "sys", v: "[ carrier \u00b7 band 121.5 \u00b7 03:11 vault-night ]" },
      { t: "in", who: "mono", v: "youre there. good. fore we found each other i was hailin a relay \u2014 the tall one, way out east past everythin. you can see it from any ridge on the continent." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "babel sits at the foot of it. months of walkin from where i stand, if the road's kind. it wont be." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "only thing out there still talkin, and it never shuts up. i wanna know who its talkin to. address is 121.5.0.1." },
      { t: "spacer" },
      { t: "in", who: "mono", v: "login i lifted off a dead courier. the user's 'casaubon.' but he only scratched half of it down." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "said the pass was the scholar's own word for his little puzzles. your records'll have the man \u2014 look him up, work it out, and get in." },
      { t: "spacer" },
      { t: "host", ip: "121.5.0.1" },
      { t: "objective", otype: "host", target: "121.5.0.1", thenReturn: true,
        nudge: [
          "search your archive for casaubon \u2014 his word for his puzzles is the password. then login at 121.5.0.1.",
          "the scholar, friend. casaubon. your records have him \u2014 the word he used for his little puzzles opens the relay.",
          "no hurry on my account, but that relay wont read itself. casaubon's word, then 121.5.0.1."
        ] },

      { t: "pause", v: 250 },
      { t: "in", who: "mono", v: "youre in? read its inbound log. tell me what its been hearin back all these years." },
      { t: "spacer" },
      { t: "reply",
        reprompt: "you gotta actually read the inbound log to know. open it, then tell me \u2014 who's it hearin back from?",
        opts: [
          // the player reported the TIMING too — he can draw the line himself
          { keywords: ["recent", "recently", "lately", "just now", "new entry", "recent entry", "this week", "few days", "four days", "days ago", "not long ago"],
            steps: [
              { t: "pause", v: 200 },
              { t: "in", who: "mono", v: "...recent. and i started walkin four days ago." }, { t: "pause", v: 220 },
              { t: "in", who: "mono", v: "thats not a coincidence i like." }
            ] },
          // the player reported an answer without a date — he does NOT presume one
          { keywords: ["ack", "acked", "acks", "answer", "answered", "reply", "replied", "babel", "core", "babel core", "alive", "awake", "someone", "something", "somethin", "responded", "one entry", "an ack", "one ack", "one message", "one line", "it answered", "got an answer"],
            steps: [
              { t: "pause", v: 200 },
              { t: "in", who: "mono", v: "...somethin answered it. after all them years of nothin." }, { t: "pause", v: 220 },
              { t: "in", who: "mono", v: "i started walkin four days back. if that thing woke up anywhere near then, thats not a coincidence i like." }
            ] },
          { keywords: ["nothing", "dead", "static", "no one", "noone", "empty", "silence", "quiet", "itself", "nobody", "never", "not once", "no answer", "no reply", "dead air"],
            steps: [ { t: "set", flag: "lied" }, { t: "pause", v: 200 }, { t: "in", who: "mono", v: "...aight." } ] }
        ]},
      { t: "spacer" }, { t: "pause", v: 300 },
      { t: "in", who: "mono", v: "that login came off a dead courier, like i said. his job-order was same as mine." }, { t: "pause", v: 140 },
      { t: "in", who: "mono", v: "everybody's bein sent to babel lately. makes a man wonder who's doin the sendin." },
      { t: "spacer" },
      { t: "reply", opts: [
        { keywords: ["who", "whos", "sent", "paid", "paying", "payin", "pays", "employer", "boss", "sender", "hired", "order"],
          steps: [ { t: "in", who: "mono", v: "i dont know their name. money finds me, the job's in the envelope. thats how it works out here." } ] },
        // the player doesn't know either — a shrug is an answer, and he takes it as one
        { keywords: ["dont know", "not know", "no idea", "who knows", "god knows", "beats me", "search me", "hard to say", "cant say", "couldnt say", "cant tell", "no clue", "not sure", "dunno", "your guess", "anyones guess", "no way to know", "no way to tell", "never know", "no tellin", "no telling", "wish i knew"],
          steps: [
            { t: "in", who: "mono", v: "nobody does. thats what the envelope's for — no name on it, nobody to answer for whats inside." }, { t: "pause", v: 160 },
            { t: "in", who: "mono", v: "somebody out there likes it that way." }
          ] },
        { default: true, steps: [ { t: "in", who: "mono", v: "yeah. i try not to think on it too hard. thinkin dont pay." } ] }
      ]},
      { t: "spacer" }, { t: "pause", v: 200 },
      { t: "in", who: "mono", v: "next time ill be movin. nobody hands you the way in twice \u2014 youll have to find it yourself." },
      { t: "spacer" },
      { t: "sys", v: "  he signs off. switch to /home when you're ready." }
    ]
  });
})(window.G);
