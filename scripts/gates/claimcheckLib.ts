/**
 * CLAIMCHECK — THE PURE HALF. Every cite in `src/config/**` and `src/core/npc/**`,
 * resolved against the real decompiled ActionScript.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * WHY. Every config value and class header in this repo carries `<File>.as:<line>`,
 * and until now NOT ONE of them was checked. A cite that drifts by a line is invisible
 * forever. The slice 3 kickoff's `mcs.scaleX == 1` trap was dead in exactly this way:
 * it named a target that exists nowhere, and it survived a pass explicitly labelled
 * "TESTED against the AS3". Nothing in the toolchain reads prose — that is this gate's
 * whole point.
 *
 * IT PAID ON ITS FIRST RUN. Three cites in `src/config/ogEnemyKatana.ts` were WRONG, all
 * three in range (so an existence-only check passes them): `:140` for
 * `walkSpeed = random() * 3 + 4` should be `:129`; `:175-176` should be `:167`; `:185`
 * should be `:179`.
 *
 * AND THEN IT WAS CAUGHT FALSE-PASSING (harness finish, F1). An adversarial fan-out found
 * four cites this gate reported clean — `EnemyKatana.as:213` is a `break;`, cited in three
 * files; three `+ 100` cites sat one line off — through three holes, each now pinned in
 * `tests/claimcheck.test.ts`: a bare `export const NAME = 3` was never a field; a value
 * passed if ANY of its cites held it, so good cites covered a bad sibling; and ±1 passed
 * any off-by-one by construction. Closing them raised 82 failures on the tree that had
 * read "0": 10 cites on the wrong line, 41 whose file was set by prose the gate could not
 * read, 5 governing the wrong value, and 26 correct context cites, now named in CONTEXT.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * THE RESOLUTION RULES, each one earned by a measurement rather than assumed.
 * ─────────────────────────────────────────────────────────────────────────────────
 * 1. ONE PINNED SOURCE DIRECTORY, never a repo-wide basename search. `Projectile.as`
 *    exists in four decompiled trees with four different line counts (83 / 94 / 122 /
 *    122); `shs1` and `shs2` are the PREDECESSOR GAMES, so a cite would resolve there
 *    and mean something else entirely.
 * 2. A cite carrying its own `reference/…` path prefix is honoured verbatim — exactly
 *    one does, and it points into a different tree (the obfuscated web build).
 * 3. A BARE `:N` inherits the nearest NAMED cite EARLIER ON ITS OWN COMMENT LINE, and
 *    only falls back to the module's header default. The tempting rule — "inherit the
 *    last named cite anywhere above" — is FALSIFIED: `ogEnemyWolfAlpha.ts` names
 *    `EnemySpearElite.as` mid-file as an explicit CONTRAST, and inheriting it would
 *    mis-resolve roughly thirty values below it. The reverse rule (header always wins)
 *    is falsified too, by lines where a mid-clause named cite genuinely governs the
 *    bare cites after it. Same line first, header second.
 * 4. Cites that no filename rule can resolve — a bare cite retargeted by ENGLISH PROSE
 *    ("(ogre `:317`)", "(Female `:28`)", "`EnemyWolf2.as:24` ↔ `:227`") — are fixed in
 *    the DOC to name their file, not special-cased here. A gate that needs to parse
 *    "ogre" is a gate that will be wrong later.
 *
 * ─────────────────────────────────────────────────────────────────────────────────
 * THE NUMERIC HALF, and what it deliberately does NOT check.
 * ─────────────────────────────────────────────────────────────────────────────────
 * · `src/core/**` has no numeric half AT ALL, because it has no numbers:
 *   `tests/config-purity.test.ts` already pins ZERO numeric literals there. Core
 *   contributes cites to resolve, and nothing to cross-check.
 * · `src/config/ogAi.ts` is EXEMPT from the numeric half, with a reason: it transcribes
 *   `NPCManager.as`'s dispatch switch as DATA, so its numbers are ai ordinals, XML
 *   placement attributes and source LINE NUMBERS — checking "does 519 appear near
 *   NPCManager.as:500" is a category error, and it accounted for 58 of the 66 raw
 *   failures in the measurement that sized this gate. It is not unchecked: its own
 *   header records that `tests/ogAiData.test.ts` byte-checks it with an INDEPENDENT
 *   parser, which is strictly stronger than a ±N window.
 * · COMMENTS ARE STRIPPED before numeric fields are extracted. A field regex run over
 *   raw text matches prose inside the comments and invents fields that do not exist.
 * · PER CITE as well as per value: every governing cite must hold at least one value it
 *   governs, at ±0. See `checkValues` for why neither a per-file nor a per-run rule was
 *   enough, and `ContextCite` for the named exception.
 * · A value's governing cites are the UNION of its own line, the contiguous comment
 *   block directly above it, and the docblock above EVERY enclosing object literal at
 *   any depth. Stopping the walk at the nearest comment gives false failures (a value
 *   group whose cites are spread across several comment lines); stopping it at the
 *   `export const` gives them too (`dice: 3` is cited by the docblock above its own
 *   `idle: {`, one level in).
 */

/** One resolved cite: a file plus the line span it names. */
export interface Cite {
  /** Bare basename as written (`NPC.as`), or a full `reference/…` path when prefixed. */
  readonly file: string;
  readonly start: number;
  readonly end: number;
  /** Line of the citing file this was read from. */
  readonly line: number;
  /** Verbatim token, for the failure message. */
  readonly raw: string;
  /** How the filename was decided — the failure message needs to say. */
  readonly via: 'named' | 'same-line' | 'header' | 'path';
}

export interface NumericField {
  readonly key: string;
  readonly value: number;
  readonly line: number;
}

/** A source line split into its code part and its comment part. */
export interface SplitLine {
  readonly line: number;
  readonly code: string;
  readonly comment: string;
  /**
   * Did this line carry ANY comment syntax — text, or just a `/**` / `*\/` delimiter?
   *
   * Separate from `comment !== ''` on purpose. A closing `*\/` line has no comment TEXT,
   * and using emptiness to decide contiguity made the upward walk stop dead at it — so a
   * value never saw the docblock above its enclosing `export const`, and three colour
   * bands in `ogNpcBase.ts` failed against cites that do cover them.
   */
  readonly isComment: boolean;
}

const FILENAME = '[A-Za-z0-9_\\u00A7]+\\.as';
const PATH_PREFIX = '(?:[A-Za-z0-9_./-]*/)?';

/**
 * Split every line into code and comment.
 *
 * Deliberately a small hand-rolled scanner rather than a parser: it only has to know
 * `//`, `/* … *\/` and string literals well enough that a `//` inside a string does not
 * open a comment. Everything downstream depends on this split — cites are only ever
 * read from the comment side, numeric fields only from the code side.
 */
export function splitLines(src: string): SplitLine[] {
  const out: SplitLine[] = [];
  let inBlock = false;
  src.split('\n').forEach((raw, i) => {
    let code = '';
    let comment = '';
    let touchedComment = inBlock;
    let j = 0;
    let quote: string | null = null;
    while (j < raw.length) {
      const two = raw.slice(j, j + 2);
      if (inBlock) {
        if (two === '*/') {
          inBlock = false;
          j += 2;
        } else {
          comment += raw[j] ?? '';
          j += 1;
        }
        continue;
      }
      const ch = raw[j] ?? '';
      if (quote !== null) {
        code += ch;
        if (ch === '\\') {
          code += raw[j + 1] ?? '';
          j += 2;
          continue;
        }
        if (ch === quote) quote = null;
        j += 1;
        continue;
      }
      if (ch === "'" || ch === '"' || ch === '`') {
        quote = ch;
        code += ch;
        j += 1;
        continue;
      }
      if (two === '//') {
        comment += raw.slice(j + 2);
        touchedComment = true;
        break;
      }
      if (two === '/*') {
        inBlock = true;
        touchedComment = true;
        j += 2;
        continue;
      }
      code += ch;
      j += 1;
    }
    out.push({ line: i + 1, code, comment, isComment: touchedComment });
  });
  return out;
}

/**
 * The module's default source file: the first `.as` name inside a backtick span in the
 * header, path prefix stripped.
 *
 * The prefix-stripping is not cosmetic. `ogAi.ts`'s header cite is path-prefixed, and a
 * backtick-anchored regex that cannot see past the directory grabs the SECOND name on
 * the line instead — which silently re-points the file that carries the most numeric
 * data rows in `src/config`.
 */
export function headerDefault(src: string): string | null {
  const head = src.split('\n').slice(0, 40).join('\n');
  const re = new RegExp('`[^`]*?(' + FILENAME + ')', 'g');
  return re.exec(head)?.[1] ?? null;
}

/**
 * Every cite on one comment line, in order.
 *
 * Handles the three continuation spellings the corpus actually uses — `File.as:64/68`
 * (colon not repeated), `:66/:70` (repeated), and `, :8` — because a naive
 * `(\S+\.as):(\d+)` captures the first number of a slash list and SILENTLY DROPS the
 * rest, which is a cite that is never checked at all.
 */
export function citesOnLine(comment: string, line: number, headerFile: string | null): Cite[] {
  const out: Cite[] = [];
  let sameLineFile: string | null = null;
  // A cite run: an optional (possibly path-prefixed) filename, then one or more line
  // specs separated by `/` or `,`, each optionally a range.
  const run = new RegExp('(' + PATH_PREFIX + FILENAME + ')?:(\\d+)(?:-(\\d+))?((?:\\s*[/,]\\s*:?\\d+(?:-\\d+)?)*)', 'g');
  let m: RegExpExecArray | null;
  while ((m = run.exec(comment)) !== null) {
    const named = m[1];
    let via: Cite['via'];
    let file: string;
    if (named !== undefined) {
      file = named;
      via = named.includes('/') ? 'path' : 'named';
      sameLineFile = named;
    } else if (sameLineFile !== null) {
      file = sameLineFile;
      via = 'same-line';
    } else if (headerFile !== null) {
      file = headerFile;
      via = 'header';
    } else {
      continue;
    }
    const specs: Array<[number, number]> = [[Number(m[2]), Number(m[3] ?? m[2])]];
    for (const tail of (m[4] ?? '').matchAll(/:?(\d+)(?:-(\d+))?/g)) {
      specs.push([Number(tail[1]), Number(tail[2] ?? tail[1])]);
    }
    for (const [start, end] of specs) {
      out.push({ file, start, end, line, raw: m[0].trim(), via });
    }
  }
  return out;
}

/**
 * Numeric fields, read from the CODE side only.
 *
 * Two spellings: `key: value` inside an object literal, and a bare top-level
 * `export const NAME = value;`. Skips two key names and every non-numeric value:
 * · `line` — `ogAi.ts` records where in `NPCManager.as` each dispatch case sits, so the
 *   value IS a line number and checking it against a window is a category error;
 * · `ai` — likewise the dispatch ordinal.
 * Floats are kept (`scale: 1.2` is a real cited value).
 */
export function numericFields(mod: Module): NumericField[] {
  const SKIP = new Set(['line', 'ai']);
  const out: NumericField[] = [];
  for (const { line, code } of mod.lines) {
    // A bare `export const NAME = 3;` is a field too. Reading only `key: value` left
    // `OG_HUMANOID_FALL_GRAVITY = 3` unchecked under a cite that points at a `break;`.
    const bare = /^\s*(?:export\s+)?const\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?::[^=]+)?=\s*(-?\d+(?:\.\d+)?)\s*;?\s*$/.exec(code);
    if (bare !== null) out.push({ key: bare[1] ?? '', value: Number(bare[2]), line });
    for (const m of code.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(-?\d+(?:\.\d+)?)\s*(?=[,;}\]]|$)/g)) {
      const key = m[1] ?? '';
      if (SKIP.has(key)) continue;
      out.push({ key, value: Number(m[2]), line });
    }
  }
  return out;
}

/**
 * The contiguous run of comment lines immediately above `line`.
 *
 * A line that carries CODE ends the run even when it also carries a comment. The inline
 * form `/** `:97` *\/ zeroBelow: 6,` is one value with its own cite, not part of the
 * docblock above the next one — and without this stop, a nested value inherited the cite
 * of whatever value happened to sit above its object, widening the pass surface for free.
 * `tests/claimcheck.test.ts` caught exactly that.
 */
function commentBlockAbove(lines: SplitLine[], line: number): number[] {
  const out: number[] = [];
  for (let i = line - 2; i >= 0; i -= 1) {
    const l = lines[i];
    if (l === undefined) break;
    if (!l.isComment || l.code.trim() !== '') break;
    out.push(l.line);
  }
  return out;
}

/**
 * A module parsed ONCE.
 *
 * Not a premature optimisation — the first version re-split the whole file and rebuilt the
 * brace map for EVERY numeric field, and `src/config` holds ~17,000 of them across some
 * very large data tables. That made a full run take **two minutes**, which fails the one
 * thing this gate has to be to live in pre-commit: fast. Parsing each file once takes it
 * to a couple of seconds.
 */
export interface Module {
  readonly lines: SplitLine[];
  readonly braces: Map<number, number[]>;
  readonly header: string | null;
}

export function prepare(src: string): Module {
  const lines = splitLines(src);
  const braces = new Map<number, number[]>();
  const stack: number[] = [];
  for (const { line, code } of lines) {
    braces.set(line, [...stack]);
    for (const ch of code) {
      if (ch === '{') stack.push(line);
      else if (ch === '}') stack.pop();
    }
  }
  return { lines, braces, header: headerDefault(src) };
}

/** Every cite in a prepared module. */
export function moduleCites(mod: Module): Cite[] {
  return mod.lines.flatMap((l) => (l.comment === '' ? [] : citesOnLine(l.comment, l.line, mod.header)));
}

/**
 * The cites that govern a value on `line`: its own line, the comment block directly
 * above it, and the comment block above every enclosing object literal.
 */
export function scopeFor(mod: Module, line: number): Cite[] {
  const wanted = new Set<number>([line, ...commentBlockAbove(mod.lines, line)]);
  for (const brace of mod.braces.get(line) ?? []) {
    wanted.add(brace);
    for (const l of commentBlockAbove(mod.lines, brace)) wanted.add(l);
  }
  return [...wanted]
    .sort((a, b) => a - b)
    .flatMap((n) => {
      const l = mod.lines[n - 1];
      return l === undefined || l.comment === '' ? [] : citesOnLine(l.comment, l.line, mod.header);
    });
}

/**
 * Does `value` appear as a literal within `window` lines of the cite's span?
 *
 * The sign is stripped before searching, because the source writes `mcs.y - 60` where
 * the config writes `yOffset: -60` — the minus lives in the operator, not the literal.
 * The trade-off is stated rather than hidden: this makes the check sign-blind, so a
 * config that wrote `+60` where the source means `−60` would pass.
 *
 * Digit boundaries are enforced, so `12` does not match inside `120`.
 */
export function literalNear(
  sourceLines: readonly string[],
  cite: Cite,
  value: number,
  window: number,
): boolean {
  const needle = String(Math.abs(value));
  const from = Math.max(1, cite.start - window);
  const to = Math.min(sourceLines.length, cite.end + window);
  const re = new RegExp(`(?<![0-9.])${needle.replace('.', '\\.')}(?![0-9.])`);
  for (let n = from; n <= to; n += 1) {
    if (re.test(sourceLines[n - 1] ?? '')) return true;
  }
  return false;
}

/**
 * ±0 — a cite names the line its literal is on. MEASURED, not chosen.
 *
 * T2 shipped ±1 (tighter than the kickoff's ±2) and that window was itself the third
 * false-pass hole: `EnemyDeer.as:224`, `EnemyHorse.as:242` and `EnemyStag.as:302` are each
 * exactly one line past their `+ 100`, and ±1 passed all three by construction. Measured
 * over the whole corpus, ±1 → ±0 raised ZERO new value failures and FOUR new per-cite ones:
 * those three real drifts and one correct cross-reference (`EnemyDeer.as:79`, now a CONTEXT
 * entry). Ranges were measured separately at ±1 and raised the same set, so one window
 * serves both — a range's span IS its claim. `--window N` re-measures a wider one.
 */
export const DEFAULT_WINDOW = 0;

/** A value the literal genuinely is not in the source for, with the derivation written out. */
export interface Derived {
  readonly file: string;
  readonly key: string;
  readonly value: number;
  readonly why: string;
}

/**
 * A cite that is CORRECT but does not state a value it governs — a contrast ("NOT the
 * base's `* 2 + 20` (`NPC.as:218`)"), a cross-reference to a value that lives in another
 * file, a twin map, the line of a guard. Named per citing file and cite, with the reason.
 */
export interface ContextCite {
  /** The citing file, repo-relative. */
  readonly file: string;
  /** The cite as `citeKey` spells it: `NPC.as:218` or `EnemyBear.as:42-45`. */
  readonly cite: string;
  readonly why: string;
}

export interface ValueFailure {
  readonly kind: 'LITERAL-ABSENT' | 'NO-VALUE-AT-CITE' | 'STALE-DERIVED' | 'STALE-CONTEXT';
  readonly line: number;
  readonly detail: string;
}

export interface ValueReport {
  readonly checked: number;
  readonly uncited: number;
  readonly failures: ValueFailure[];
  /** Every PASS, for `--all`. */
  readonly passes: NumericField[];
}

/** A cite as it is written in a failure message and keyed in an allow-list: `F.as:12` or `F.as:12-14`. */
export function citeKey(c: Cite): string {
  return `${c.file}:${c.start}${c.end === c.start ? '' : `-${c.end}`}`;
}

/**
 * THE NUMERIC HALF for one module, in two directions. `lookup` returns a cited file's
 * lines, or null when the file does not exist (the existence half reports that; here such
 * a cite simply governs nothing).
 *
 * 1. PER VALUE — the value's literal appears at one of its governing cites.
 * 2. PER CITE — every cite holds at least one of the values it governs.
 *
 * The second direction is the fix for the second false-pass hole. Checked only per value,
 * `fallGravity: 3` passed on the strength of five good cites while the sixth,
 * `EnemyKatana.as:213`, pointed at a `break;`. A per-FILE rule would not have been enough
 * either, and that was measured too: `EnemyDeer.as:224`/`:238` is one run naming one file,
 * and `:238` holds the `100` — so only judging each cite on its own catches `:224`.
 *
 * A CONTEXT cite is exempt from (2) and REMOVED from (1): declaring a cite to be context is
 * declaring it does not state the value, so it must never be the cite that makes one pass.
 * An entry whose cite no longer governs any value in its file is STALE. Deliberately NOT
 * "an entry whose cite now holds a value": a contrast that happens to share a literal with
 * a value it sits beside is still a contrast, and deleting its entry would hand it back the
 * power to vouch for that value — the exact hole the entry closes.
 */
export function checkValues(
  mod: Module,
  rel: string,
  lookup: (c: Cite) => readonly string[] | null,
  window: number,
  derived: readonly Derived[],
  context: readonly ContextCite[],
): ValueReport {
  const failures: ValueFailure[] = [];
  const passes: NumericField[] = [];
  const mine = context.filter((e) => e.file === rel);
  const isContext = (c: Cite): boolean => mine.some((e) => e.cite === citeKey(c));
  const governs = new Map<string, { cite: Cite; values: NumericField[] }>();
  let checked = 0;
  let uncited = 0;
  for (const field of numericFields(mod)) {
    const scoped = scopeFor(mod, field.line).filter((c) => lookup(c) !== null);
    if (scoped.length === 0) {
      uncited += 1;
      continue;
    }
    checked += 1;
    for (const c of scoped) {
      const k = `${c.line}|${citeKey(c)}`;
      const entry = governs.get(k) ?? { cite: c, values: [] };
      entry.values.push(field);
      governs.set(k, entry);
    }
    const cites = scoped.filter((c) => !isContext(c));
    const found = cites.some((c) => literalNear(lookup(c) ?? [], c, field.value, window));
    const isDerived = derived.some((d) => d.file === rel && d.key === field.key && d.value === field.value);
    if (found && isDerived) {
      failures.push({
        kind: 'STALE-DERIVED',
        line: field.line,
        detail: `${field.key} = ${field.value} now PASSES the plain check — delete its DERIVED entry in scripts/gates/claimcheck.ts`,
      });
    }
    if (!found && !isDerived) {
      const named = cites.length === 0 ? 'no cite that is not CONTEXT' : cites.map(citeKey).join(', ');
      failures.push({
        kind: 'LITERAL-ABSENT',
        line: field.line,
        detail: `${field.key} = ${field.value} appears nowhere within ±${window} of ${named}`,
      });
    } else {
      passes.push(field);
    }
  }
  const needed = new Set<string>();
  for (const { cite, values } of governs.values()) {
    if (isContext(cite)) {
      needed.add(citeKey(cite));
      continue;
    }
    if (values.some((v) => literalNear(lookup(cite) ?? [], cite, v.value, window))) continue;
    const shown = [...new Set(values.map((v) => `${v.key}=${v.value}`))];
    failures.push({
      kind: 'NO-VALUE-AT-CITE',
      line: cite.line,
      detail:
        `\`${citeKey(cite)}\` (via ${cite.via}) holds none of the ${shown.length} value(s) it governs within ±${window}: ` +
        `${shown.slice(0, 6).join(', ')}${shown.length > 6 ? ', …' : ''}`,
    });
  }
  for (const e of mine) {
    if (needed.has(e.cite)) continue;
    failures.push({
      kind: 'STALE-CONTEXT',
      line: 0,
      detail: `CONTEXT entry \`${e.cite}\` governs no value in this file any more — the cite is gone or moved. Delete it from scripts/gates/claimcheck.ts`,
    });
  }
  return { checked, uncited, failures, passes };
}
