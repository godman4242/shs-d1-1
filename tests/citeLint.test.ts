/**
 * GATE L0-A — CITE INTEGRITY.
 *
 * `scripts/gauntlet/citeLint.py` is the deterministic half of the GAUNTLET §0
 * cite lens. §0 says a claim whose cite does not resolve is REFUTED, full stop —
 * and "does the file exist / is the line in range / does the quoted text
 * actually appear there" is a `for` loop, not a judgement call. §2's standing
 * rule is A SCRIPT BEATS A SWARM, so the script runs first and the agent critics
 * spend their budget on the part a script cannot do (does the artifact actually
 * SAY what the claim says it says).
 *
 * These tests are HERMETIC: each builds a throwaway repo in a temp dir, so the
 * gate is re-runnable in a clean clone with no `reference/` study material
 * present. They were watched RED before `citeLint.py` existed, and the
 * chaos-plant (a deliberately fabricated cite) is test `plants a fabricated
 * cite` below.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = join(process.cwd(), 'scripts/gauntlet/citeLint.py');

interface LintClaim {
  id: string;
  artifact_class: string;
  status: string;
  problems: string[];
  notes: string[];
}
interface LintReport {
  summary: {
    total: number;
    resolves: number;
    broken: number;
    quote_unverified: number;
    uncheckable: number;
  };
  claims: LintClaim[];
}

let dir = '';

/** Write a file inside the throwaway repo, creating parents. */
function put(rel: string, body: string): void {
  const abs = join(dir, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body, 'utf8');
}

/** Run citeLint over `claims`, returning the report and the process exit code. */
function lint(claims: unknown[]): { report: LintReport; code: number } {
  const claimsPath = join(dir, 'claims.json');
  const outPath = join(dir, 'citelint.json');
  writeFileSync(claimsPath, JSON.stringify(claims), 'utf8');
  let code = 0;
  try {
    execFileSync('python3', [SCRIPT, claimsPath, '--repo', dir, '--out', outPath], {
      stdio: 'pipe',
      timeout: 60_000,
    });
  } catch (err) {
    code = (err as { status?: number }).status ?? 1;
  }
  return { report: JSON.parse(readFileSync(outPath, 'utf8')) as LintReport, code };
}

/** The single claim in a one-claim report. */
function only(report: LintReport): LintClaim {
  expect(report.claims).toHaveLength(1);
  const [claim] = report.claims;
  if (!claim) throw new Error('citeLint returned no claims');
  return claim;
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'sshd-citelint-'));
  put(
    'reference/decompiled/fake/scripts/Damage.as',
    [
      'package',
      '{',
      '   public class Damage',
      '   {',
      '      public static var MINDAMAGE:int = 1;',
      '      public function getMinDamage() : int',
      '      {',
      '         if(attackerlvl <= 10) return 1 + piercing;',
      '         return attackerlvl / 4 + piercing;',
      '      }',
      '   }',
      '}',
    ].join('\n'),
  );
  put('reference/frames/fake/t708.0.png', 'not-really-a-png');
  put(
    'docs/gauntlet/L0/index/strings.json',
    JSON.stringify({ '750': 'You learnt a new dragon dance step!', '6143': 'Area of Effect Fire Attack' }),
  );
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('citeLint — GATE L0-A', () => {
  it('RESOLVES a claim whose file, line and quote all check out', () => {
    const { report, code } = lint([
      {
        id: 'combat-core/min-damage-floor',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:8-9',
        quote: 'return attackerlvl / 4 + piercing;',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
    expect(only(report).problems).toEqual([]);
    expect(code).toBe(0);
  });

  it('plants a fabricated cite — a path that does not exist is BROKEN', () => {
    const { report, code } = lint([
      {
        id: 'combat-core/invented',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/DoesNotExist.as:12',
        quote: 'whatever',
      },
    ]);
    expect(only(report).status).toBe('BROKEN');
    expect(only(report).problems.join(' ')).toContain('MISSING_PATH');
    expect(code).toBe(1);
  });

  it('catches a line number past end-of-file', () => {
    const { report } = lint([
      {
        id: 'combat-core/off-the-end',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:900-905',
        quote: 'return attackerlvl / 4 + piercing;',
      },
    ]);
    expect(only(report).status).toBe('BROKEN');
    expect(only(report).problems.join(' ')).toContain('LINE_OOR');
  });

  /**
   * SOFT on purpose, and the softness is measured, not assumed. In the real
   * corpus the `quote` field is a prose gloss with verbatim material embedded in
   * it, so demanding a whole-quote match failed 642 of 1,087 real claims. A gate
   * that cries wolf 642 times gets ignored — worse than no gate. So an unlocated
   * quote flags the claim as a PRIORITY TARGET for the agent cite-critics and
   * leaves the kill decision to them, while paths and lines stay hard-fatal.
   */
  it('flags an unlocatable quote as QUOTE_UNVERIFIED, not as a kill', () => {
    const { report, code } = lint([
      {
        id: 'combat-core/misquoted',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:8',
        quote: 'this exact sentence is nowhere in the cited artifact at all',
      },
    ]);
    expect(only(report).status).toBe('QUOTE_UNVERIFIED');
    expect(only(report).problems).toEqual([]);
    expect(only(report).notes.join(' ')).toContain('QUOTE_NOT_LOCATED');
    expect(code).toBe(0);
  });

  /**
   * The real quotes read "Visible in the crop: ... Code side: public static var
   * equipment:Vector.<Item> = new Vector.<Item>(13);" — annotation wrapped around
   * an excerpt. Locating the excerpt inside the gloss is the whole job.
   */
  it('locates a verbatim excerpt embedded in a prose gloss', () => {
    const { report } = lint([
      {
        id: 'combat-core/glossed',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:8-9',
        quote:
          'Visible in the crop: a fighter with nine slot boxes. Code side: ' +
          '"return attackerlvl / 4 + piercing;" (the level-30+ floor), confirming the ladder.',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
  });

  it('expands the glob form agents write for a whole directory of sources', () => {
    const ok = lint([
      {
        id: 'a/glob-hit',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/*.as',
        quote: 'public static var MINDAMAGE:int = 1;',
      },
    ]);
    expect(only(ok.report).status).toBe('RESOLVES');

    const empty = lint([
      { id: 'a/glob-miss', artifact_class: 'A2', cite: 'reference/nowhere/*.as', quote: 'x' },
    ]);
    expect(only(empty.report).status).toBe('BROKEN');
    expect(only(empty.report).problems.join(' ')).toContain('MISSING_PATH');
  });

  it('notes a line number cited inside a binary without killing the claim', () => {
    const { report, code } = lint([
      {
        id: 'ui-hud/line-in-a-png',
        artifact_class: 'A1',
        cite: 'reference/frames/fake/t708.0.png:12',
        quote: '',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
    expect(only(report).notes.join(' ')).toContain('LINE_ON_BINARY');
    expect(code).toBe(0);
  });

  it('tolerates whitespace and line-wrap differences in the quote', () => {
    const { report } = lint([
      {
        id: 'combat-core/rewrapped',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:6-9',
        quote: 'public function getMinDamage() : int   {      if(attackerlvl <= 10) return 1 + piercing;',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
  });

  it('accepts an honest STILL_UNHELD claim with no cite', () => {
    const { report, code } = lint([
      { id: 'economy/no-evidence', artifact_class: 'STILL_UNHELD', cite: '', quote: '' },
    ]);
    expect(only(report).status).toBe('UNCHECKABLE');
    expect(code).toBe(0);
  });

  it('refuses an EMPTY cite on a claim that asserts an artifact class', () => {
    const { report } = lint([{ id: 'economy/bare-assertion', artifact_class: 'A2', cite: '', quote: '' }]);
    expect(only(report).status).toBe('BROKEN');
    expect(only(report).problems.join(' ')).toContain('EMPTY_CITE');
  });

  it('parses the comma and slash multi-line cite forms agents actually write', () => {
    const good = lint([
      {
        id: 'a/commas',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:5,:8,:9',
        quote: 'public static var MINDAMAGE:int = 1;',
      },
    ]);
    expect(only(good.report).status).toBe('RESOLVES');

    const bad = lint([
      {
        id: 'a/slashes',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:5/8/9999',
        quote: 'public static var MINDAMAGE:int = 1;',
      },
    ]);
    expect(only(bad.report).status).toBe('BROKEN');
    expect(only(bad.report).problems.join(' ')).toContain('LINE_OOR');
  });

  it('checks an A1 frame cite for existence but never for a quote', () => {
    const ok = lint([
      {
        id: 'ui-hud/frame-held',
        artifact_class: 'A1',
        cite: 'reference/frames/fake/t708.0.png, crop (900,590)-(1640,960) upscaled x2 LANCZOS',
        quote: 'the HUD chi bar is visibly segmented into four blocks',
      },
    ]);
    expect(only(ok.report).status).toBe('RESOLVES');

    const gone = lint([
      {
        id: 'ui-hud/frame-invented',
        artifact_class: 'A1',
        cite: 'reference/frames/fake/t999.9.png, crop (0,0)-(10,10)',
        quote: 'anything',
      },
    ]);
    expect(only(gone.report).status).toBe('BROKEN');
    expect(only(gone.report).problems.join(' ')).toContain('MISSING_PATH');
  });

  /**
   * A false BROKEN is the dangerous direction: BROKEN auto-refutes under §0, so a
   * parser artifact would destroy a genuine finding. These three guard the forms
   * that produced false MISSING_PATH hits on the real 1,087-claim corpus.
   */
  it('expands the shell brace form agents write for sibling frames', () => {
    put('reference/frames/fake/t1004.800.png', 'x');
    put('reference/frames/fake/t1005.000.png', 'x');
    const { report } = lint([
      {
        id: 'combat-core/brace-pair',
        artifact_class: 'A1',
        cite: 'reference/frames/fake/{t1004.800,t1005.000}.png crop (0,0)-(64,64)',
        quote: '',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
    expect(only(report).problems).toEqual([]);
  });

  it('does not anchor on a mid-path fragment of a longer cited path', () => {
    const { report } = lint([
      {
        id: 'skills-meters/elided-prefix',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:5, and again at .../scripts/Damage.as:8',
        quote: 'public static var MINDAMAGE:int = 1;',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
    expect(only(report).problems.join(' ')).not.toContain('MISSING_PATH');
  });

  it('recovers a path whose line spec carries trailing prose', () => {
    const { report } = lint([
      {
        id: 'economy/spec-with-suffix',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:5ff',
        quote: 'public static var MINDAMAGE:int = 1;',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
    expect(only(report).problems).toEqual([]);
  });

  it('expands a character-class glob over a numbered payload family', () => {
    put('reference/extracted/fakebin/100_a.bin', 'x');
    put('reference/extracted/fakebin/118_b.bin', 'x');
    const { report } = lint([
      {
        id: 'bindata/class-glob',
        artifact_class: 'A2',
        cite: 'counts over reference/extracted/fakebin/1[0-1][0-9]_*.bin',
        quote: '',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
    expect(only(report).problems).toEqual([]);
  });

  it('accepts the frame-range shorthand for an exported sprite', () => {
    put('reference/extracted/fakesprite/Sprite_755/1.png', 'x');
    put('reference/extracted/fakesprite/Sprite_755/5.png', 'x');
    const { report } = lint([
      {
        id: 'ui-hud/frame-range',
        artifact_class: 'A1',
        cite: 'reference/extracted/fakesprite/Sprite_755/1-5.png (5 frames at 4x NEAREST)',
        quote: '',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
    expect(only(report).problems).toEqual([]);
  });

  /**
   * `scripts/§1t51s0§/` in a cite means a package inside a decompiled bundle, not
   * `<repo>/scripts/`. Anchoring on it invented a MISSING_PATH and killed a claim
   * whose other cite was sound, so only the repo's real script subdirectories
   * count as a root.
   */
  it('ignores a bundle-relative scripts/ package that is not a repo path', () => {
    const { report } = lint([
      {
        id: 'actionscript/bundle-relative',
        artifact_class: 'A2',
        cite:
          'reference/decompiled/fake/scripts/Damage.as:5 ' +
          '(plus the obfuscated package scripts/§1t51s0§/§1t51s1§/)',
        quote: 'public static var MINDAMAGE:int = 1;',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
    expect(only(report).problems).toEqual([]);
  });

  it('strips a JSON key subscript that is not part of the filename', () => {
    put('docs/gauntlet/fake/strings.json', '{"4041": "Branch"}');
    const { report } = lint([
      {
        id: 'items/keyed-lookup',
        artifact_class: 'A2',
        cite: 'matched to docs/gauntlet/fake/strings.json["4041"] and again at strings.json[\'195\']',
        quote: '',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
    expect(only(report).problems).toEqual([]);
  });

  it('strips a JSON key subscript even with trailing prose glued to it', () => {
    put('docs/gauntlet/fake/strings.json', '{"83": "Blacksmith"}');
    const { report } = lint([
      {
        id: 'ui-hud/keyed-with-tail',
        artifact_class: 'A2',
        cite: 'docs/gauntlet/fake/strings.json["83"]=\'Blacksmith\' and ["84"]=\'Innkeeper\'',
        quote: '',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
    expect(only(report).problems).toEqual([]);
  });

  it('still anchors on a genuine repo scripts/ path', () => {
    put('scripts/gauntlet/thing.py', 'print("hello")');
    const { report } = lint([
      { id: 'tooling/real-script', artifact_class: 'A3', cite: 'scripts/gauntlet/nope.py', quote: '' },
    ]);
    expect(only(report).status).toBe('BROKEN');
    expect(only(report).problems.join(' ')).toContain('MISSING_PATH');
  });

  it('reports a prose-only cite as UNCHECKABLE rather than silently passing it', () => {
    const { report, code } = lint([
      {
        id: 'art/prose-only',
        artifact_class: 'A3',
        cite: 'byte-check I ran locally, trust me',
        quote: 'it matched',
      },
    ]);
    expect(only(report).status).toBe('UNCHECKABLE');
    expect(only(report).problems.join(' ')).toContain('NO_PARSEABLE_PATH');
    expect(code).toBe(0);
  });

  it('summarises the whole set and exits 1 if any single claim is broken', () => {
    const { report, code } = lint([
      {
        id: 'ok/one',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:5',
        quote: 'public static var MINDAMAGE:int = 1;',
      },
      { id: 'unheld/two', artifact_class: 'STILL_UNHELD', cite: '', quote: '' },
      { id: 'broken/three', artifact_class: 'A2', cite: 'reference/nope/Gone.as:1', quote: 'x' },
      {
        id: 'soft/four',
        artifact_class: 'A2',
        cite: 'reference/decompiled/fake/scripts/Damage.as:5',
        quote: 'a sentence that is definitely not present anywhere in that source file',
      },
    ]);
    expect(report.summary).toMatchObject({
      total: 4,
      resolves: 1,
      broken: 1,
      quote_unverified: 1,
      uncheckable: 1,
    });
    expect(code).toBe(1);
  });
});

/**
 * A KEY LOOKUP IS A CITE, AND IT HAS TO RESOLVE LIKE ONE.
 *
 * The string table is a 2,533-entry JSON map, so a claim points into it by KEY, not by
 * line: `strings.json["6143"]`. Two claims in this corpus wrote that as
 * `strings.json:6143` — a LINE number into a 2,535-line file — and the line check caught
 * both. But the key form was only ever checked for FILE EXISTENCE, so the obvious
 * "correction" (rewrite it as a key lookup) would have moved both to RESOLVES while
 * proving nothing, and a wholly invented string ID would have passed gate L0-A the same
 * way. §0 says a claim whose cite does not resolve is REFUTED, full stop; for a key
 * lookup, resolving means THE KEY IS THERE.
 */
describe('citeLint — key lookups into a JSON artifact', () => {
  it('RESOLVES a key lookup whose key is actually in the table', () => {
    const { report } = lint([
      {
        id: 'rebirth/dragon-dance-line',
        artifact_class: 'A2',
        cite: 'docs/gauntlet/L0/index/strings.json["750"]',
        quote: 'You learnt a new dragon dance step!',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
  });

  it('BREAKS a key lookup whose key is NOT in the table — the file existing proves nothing', () => {
    const { report, code } = lint([
      {
        id: 'rebirth/invented-string-id',
        artifact_class: 'A2',
        cite: 'docs/gauntlet/L0/index/strings.json["999999"]',
        quote: 'a line nobody ever shipped',
      },
    ]);
    expect(only(report).status).toBe('BROKEN');
    expect(only(report).problems.join(' ')).toContain('JSON_KEY_ABSENT');
    expect(code).toBe(1);
  });

  it('names the absent key, so the fix is obvious without re-reading the table', () => {
    const { report } = lint([
      {
        id: 'x/absent',
        artifact_class: 'A2',
        cite: 'docs/gauntlet/L0/index/strings.json["4041"]',
      },
    ]);
    expect(only(report).problems.join(' ')).toContain('4041');
  });

  it('checks EVERY key when a claim cites several', () => {
    const { report } = lint([
      {
        id: 'x/mixed',
        artifact_class: 'A2',
        cite: 'docs/gauntlet/L0/index/strings.json["750"] + docs/gauntlet/L0/index/strings.json["31337"]',
      },
    ]);
    expect(only(report).status).toBe('BROKEN');
    expect(only(report).problems.join(' ')).toContain('31337');
  });

  it("accepts either quote style — ['195'] is the same lookup as [\"195\"]", () => {
    const { report } = lint([
      {
        id: 'quests-story/single-quoted-key',
        artifact_class: 'A2',
        cite: "docs/gauntlet/L0/index/strings.json['750']",
        quote: 'You learnt a new dragon dance step!',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
  });

  /**
   * A NEGATIVE-EXISTENCE CITE IS NOT A BROKEN ONE.
   *
   * "the web build calls getString(960) and 960 is NOT in the table" is a finding whose
   * whole content is an absence, and the honest way to cite it is to name the key that
   * is not there. Treating that as BROKEN auto-refutes a true claim under §0 — and the
   * judging packets tell critics that BROKEN means "already proven wrong mechanically,
   * do not re-litigate", so the finding would die without anyone looking. The claim has
   * to SAY it is asserting absence; an unmarked absent key stays fatal.
   */
  it('accepts an absent key the cite itself marks as absent — that is the finding', () => {
    const { report } = lint([
      {
        id: 'string-table/id-960-is-absent',
        artifact_class: 'A2',
        cite: 'docs/gauntlet/L0/index/strings.json["960"] (absent) and ["750"] present',
      },
    ]);
    expect(only(report).status).not.toBe('BROKEN');
    expect(only(report).notes.join(' ')).toContain('JSON_KEY_ABSENT_AS_CLAIMED');
  });

  it('still BREAKS an absent key the cite does not mark — silence is not an assertion', () => {
    const { report } = lint([
      {
        id: 'string-table/id-960-unmarked',
        artifact_class: 'A2',
        cite: 'docs/gauntlet/L0/index/strings.json["960"] proves the caption text',
      },
    ]);
    expect(only(report).status).toBe('BROKEN');
    expect(only(report).problems.join(' ')).toContain('JSON_KEY_ABSENT');
  });

  it('scopes the absence marker to the key it follows — one marked key does not excuse another', () => {
    const { report } = lint([
      {
        id: 'string-table/one-marked-one-not',
        artifact_class: 'A2',
        cite: 'docs/gauntlet/L0/index/strings.json["960"] (absent), and docs/gauntlet/L0/index/strings.json["31337"] carries the caption',
      },
    ]);
    expect(only(report).status).toBe('BROKEN');
    expect(only(report).problems.join(' ')).toContain('31337');
    expect(only(report).notes.join(' ')).toContain('960');
  });

  it('leaves a plain path with no subscript alone — this check is opt-in by syntax', () => {
    const { report } = lint([
      {
        id: 'x/whole-file',
        artifact_class: 'A2',
        cite: 'docs/gauntlet/L0/index/strings.json',
        quote: 'You learnt a new dragon dance step!',
      },
    ]);
    expect(only(report).status).toBe('RESOLVES');
  });
});
