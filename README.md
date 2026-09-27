# THE MONOMYTHIAN

A terminal, a dead world, and a wrong number across the apocalypse.

You are a low-clearance archivist in a buried vault. A surface survivor — the **Monomythian** — hails a dead line meant for someone else, and reaches you instead. Over eight night-cycles you guide him west toward **Babel**, the glassed machine-city, using nothing but the old records and a terminal you're forbidden to use. Babel is months of walking away; Act 1 ends at **the water** — a betrayal, a rescue, and, on a band that should be sealed, the first question anything out there has ever asked.

Black-on-white, keyboard-only, no build step. This repo is **Act 1**.

---

## Run it

**Zero setup — just play:** open **`monomythian.html`**. It's a single self-contained file (all CSS + code inlined) and runs anywhere: double-clicked from disk, dragged into a browser, or in a preview pane. Start here.

**For development** there's also a modular `index.html` that loads `src/` as separate files. Because browsers won't fetch sibling scripts in some contexts (a bare preview, certain sandboxes), open it through a local server:

```bash
cd monomythian
python3 -m http.server 8000     # then open http://localhost:8000
```

After editing anything in `src/`, `styles/`, or `shell.html`, rebuild with:

```bash
node build.js        # regenerates index.html and monomythian.html
```

No dependencies. No compilation. Nothing to install.

### Deploy on Vercel

The project is pre-configured for Vercel with zero extra setup:

1. **Via Git Integration:** Push this repository to GitHub/GitLab/Bitbucket, import the repository into your [Vercel Dashboard](https://vercel.com/new), and click **Deploy**. Vercel will automatically run `npm run build` and serve the site with clean URLs and optimized asset caching.
2. **Via Vercel CLI:** Run `npx vercel` from the project directory.

The deployment includes:
- `vercel.json` with build commands, clean URLs, and media cache headers
- `.vercelignore` to keep design docs and test runners private
- Custom terminal-styled `404.html`
- Diegetic SVG favicon and Open Graph metadata

---

## How to play

- Type **`/`** to open the app menu. Move with **↑ ↓**, confirm with **Enter**, or type the command (`/home`, `/net`, …).
- **/home** — the channel. This is where he talks to you. **Type your replies in your own words** and press Enter — there are no menus. He reads what you say and answers; on the choices that matter, be clear about what you want. He'll tell you what he needs (an address, a login, a file to read) in his own words — there are no gray hints. Sometimes what he needs is the file itself: **`send <filename>`** transmits anything you've downloaded to /files over the band.
- **/archive** — search the vault's old records. Type a term (try `babel`). Some records are restricted until you pull them off a host.
- **/net** — the intrusion shell. Recon and enter surface & archive hosts to find what he needs:
  `scan <ip>` → `connect <ip>` → `login <user> <pass>` → `ls` → `cat <file>`.
  Credentials are **found, not guessed** — a file on one host is the key to the next. No brute-forcing, no trace meter.
- **/files** — everything you've downloaded. **↑ ↓ + Enter** or type a filename to reopen.
- **/status**, **/help** — what they say.
- **`reset`** — wipe the save and start over from first contact. A refresh keeps your progress.

Progression is by **cycle**. When he signs off, switch back to **/home** when you're ready and the next contact begins.

---

## What's here

Act 1, all eight cycles, playable start to finish. No spoilers here —
open the terminal and play it cold.

---

## Architecture (short version)

The **engine** is generic; the **content** is data. Cycles are authored as step-arrays and run by a small interpreter, so you can write new narrative without touching engine code.

```
shell.html                 the one HTML chrome template
index.html                 generated — modular scripts for local development
monomythian.html           generated — CSS + JS inlined
styles/terminal.css        the whole look
src/engine/
  core.js                  namespace, state, terminal output primitives
  ui.js                    input, slash menu, choices, list nav, scene await-primitives
  apps.js                  router + archive / files / status / help views
  connect.js               the intrusion shell (scan/net/login/ls/cat)
  scene.js                 the cycle interpreter + cycle progression
src/content/
  archive-data.js          searchable records
  hosts.js                 the network + easter eggs
  cycles/cycle1..8.js      Act 1, authored as step data
src/main.js                boot
assets/                    the produced media (fetched by relative path)
```

---

## Tests

Three headless checks (Node, no dependencies), or `npm test`:

```bash
node smoke-test.js      # content integrity: refs resolve, creds match, assets on disk, design law
node run-sim.js         # all 8 cycles + a live connect pivot through the real engine
node dialogue-sweep.js  # 239 typed replies across every gate (terse / natural / verbose)
```

---

## Design canon

The spine is fixed:

- He is **nobody special** — a hired man sent to look at Babel by an employer he can't name, on a job whose one rule was *don't make contact*. The handle "Monomythian" is just a handle he liked; the irony is that he isn't the hero of any story.
- **Act 1 ends at the water.** Babel is months away; the act's climax is the Ferry betrayal and rescue. The game's single eventual ending — the bootstrap — is banked for the final act. **One ending**, always: choices colour *tone*, never outcome.
- **No clock.** The Proctor (your own vault's compliance daemon) is narrative pressure, not a timer.
- **Difficulty is forensic**: credentials are split across hosts and cross-referenced against the archive; addresses aren't listed, they're discovered.

---

*Reference touchstone: Vigil Files (VigilOS terminal + forensic hacking loop). Aesthetic touchstone: the Claude Code CLI.*
