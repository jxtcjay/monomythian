# assets/

Drop the generated media here. The game references these paths from
`src/content/hosts.js` (each media file's `src:`), and the browser downloads them
when the player opens the file in `/files`.

**Only produced assets are declared in hosts.js** (CJ, 2026-07-08). There are no
placeholder descriptors: if the file isn't in this folder, the game doesn't mention it.
When a new asset lands, add its descriptor to `hosts.js` then (see below).

## Produced & wired

| File | Type | Host | Brief |
|---|---|---|---|
| `camera7.png` | image | ashline-substation | Mono at the edge of the light; three lights closing |
| `crew_handoff.mp3` | audio | duct-maintenance | The dictated substation pass — the ONLY path; the player must listen |
| `duct.png` | image | duct-maintenance | Crawlspace schematic |
| `matins.mp3` | audio | shrine-server | The warping "remain calm" loop (banked host, Act 2) |

Produced files carry no `desc` — choosing them in `/files` just downloads them again;
they're meant to be viewed off-app.

## Planned (not yet produced, NOT declared)

The sender-sigil trio (`job_order_slip`, `drop_note`, `ledger_scan`), `carrier`
(tower audio), the deepstacks scans, and the banked Act-2 pieces (`chart_fragment`,
perimeter media). Design rationale and the sigil rule: **`../PLAYTHROUGH.md`** §7.
Use real extensions when producing (`.png`/`.jpg`/`.mp3`).

## Two rules

1. **The sigil is one asset, composited into three files.** The job-order slip, the
   drop note, and the ledger scan must carry the *identical* stamped mark —
   that recurring symbol is the entire sender breadcrumb. Don't re-prompt it.
2. **Media never gates a puzzle.** Every credential clue and report keyword lives in a
   *text* file that reads in-terminal. `smoke-test.js` enforces this: it fails if a
   critical-path file is ever converted to a binary. Media is evidence, not instruction.
   **One CJ-sanctioned exception:** `crew_handoff.mp3` dictates the substation pass and
   no text spells it — the smoke test enforces the exception, not the rule, there.

## Shipping

`monomythian.html` is self-contained **except** for these assets, which are fetched by
relative path. Ship the HTML file and this `assets/` folder side by side:

```
monomythian.html
assets/
```

If you need one truly single file, inline each asset as a `data:` URI in the `src:`
field — it works, but bloats the HTML considerably. Keeping the folder is recommended.

## Adding a new media file

In `src/content/hosts.js`, use a descriptor instead of a string:

```js
"camera7.png": { media:true, type:"image/png", size:"2.0 MB",
                 meta:"1457x1079 \u00b7 captured 03:47",
                 src:"assets/camera7.png" },
```

The file key IS the in-game filename \u2014 give it the real extension of the real bytes
(text files are `.txt`/`.log`/`.md`; media match their format).

`type` / `size` / `meta` are the inspector stub's flavour text (they don't have to match
the real bytes, but should be plausible). `desc` is an optional diegetic line \u2014 omit it
once the real asset exists and speaks for itself. Then rebuild:
`node build.js && node smoke-test.js && node run-sim.js`.
