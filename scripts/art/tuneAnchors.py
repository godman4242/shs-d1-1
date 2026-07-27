"""
THE LOOP (SESSION 20 A6.4) — retrace → regenerate → render → score, over a set of
PLACEMENT variants, until the number stops improving. BUILD-TIME ONLY.

⛔ D1, THE LOAD-BEARING RULE: **PLACEMENT ONLY. NEVER A TRACED OUTLINE.**
A garment's outline is measured from the source and is the most strongly-sourced
data in this repo. Its placement anchor is labelled INFERRED in every shape's own
header — it was always an estimate. So this loop may fit ANCHORS to the source
and is forbidden to move a vertex. Fitting an outline to a score is how a
measurement stops being a test and becomes a mirror.

⭐ IT RANKS ON THE HELD-OUT FRAME, and it REJECTS ANY VARIANT THAT GROWS THE
FIGHTER. Both rules were bought with a wrong answer:
  - ranking on the MEAN crowned "hakama +6", which took the traced frame from
    0.8835 to 0.9164 while making the held-out frame WORSE. A mean will happily
    buy an overfit.
  - the profile score is width/height and therefore SCALE-FREE, so a taller
    fighter costs it nothing. "hakama +15" then won the whole sweep — held-out
    0.8781, and the two frames within 0.0067, which normally reads as "not
    overfitted" — while the render showed trousers slid down the thighs, bare
    skin at the hips and the feet swallowed by the hem, and the figure grew from
    11.3 % to 17.4 % taller than the source. A scale-free score needs a scale
    gate beside it.

⚠️ WHAT THIS CANNOT SEE (kickoff §6 Risk 1): colour, paint order, and a garment
on the wrong slot. It is a net, not a judge — LOOK at renders/dressed.png after
accepting anything. SESSION 20 A6.5 already had one variant that scored plausibly
and rendered a nearly-bare torso.

Run:  python3 scripts/art/tuneAnchors.py            # the standing sweep
      python3 scripts/art/tuneAnchors.py --restore  # put the defaults back
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Every knob is a PLACEMENT anchor. Adding an outline parameter here would break
# D1, and the reviewer of any such change should say so.
SWEEP = [
    # THE DEFINITIVE SWEEP — from the committed baseline, with BOTH guards on:
    # rank on the held-out frame, and reject anything that makes the figure
    # taller. Every knob here is a PLACEMENT anchor; adding an outline parameter
    # would break D1, and the reviewer of such a change should say so.
    ("baseline (committed)", {}, []),
    ("kasa brim 0.50", {"SSHD_BRIM_DOWN_HEAD": "0.50"}, []),
    ("kasa brim 0.55", {"SSHD_BRIM_DOWN_HEAD": "0.55"}, []),
    ("kasa brim 0.65", {"SSHD_BRIM_DOWN_HEAD": "0.65"}, []),
    ("kasa brim 0.70", {"SSHD_BRIM_DOWN_HEAD": "0.70"}, []),
    ("hakama +3", {"SSHD_HAKAMA_ADJ": "3"}, []),
    ("hakama +6", {"SSHD_HAKAMA_ADJ": "6"}, []),
    ("hakama -3", {"SSHD_HAKAMA_ADJ": "-3"}, []),
    ("hakama -6", {"SSHD_HAKAMA_ADJ": "-6"}, []),
    ("collar top-anchored", {"SSHD_ANCHOR_9012": "top"}, []),
    ("obi top-anchored", {"SSHD_ANCHOR_9014": "top"}, []),
    ("gi back to centre", {"SSHD_ANCHOR_9015": "centre"}, []),
]

ALL_IDS = [9001, 9011, 9012, 9014, 9015, 9017, 9019]


def run(cmd, env=None, **kw):
    e = dict(os.environ)
    if env:
        e.update(env)
    return subprocess.run(cmd, cwd=ROOT, env=e, capture_output=True, text=True, **kw)


def apply(env):
    """
    Retrace with `env`, then regenerate EVERY traced shape.

    ⛔ REGENERATING ONLY THE IDS A VARIANT TOUCHES IS A BUG, AND IT SHIPPED ONCE.
    The first run of this sweep did exactly that, so each variant inherited the
    PREVIOUS variant's committed art and every row after the first hakama probe
    was measuring cumulative state. It was caught because two different variants
    — collar and obi — returned byte-identical scores, which two different
    changes cannot. Regenerating all seven is ~2 s and cannot be wrong.
    """
    r = run(["python3", "scripts/art/traceGarment.py"], env)
    if r.returncode != 0:
        raise SystemExit("traceGarment failed:\n" + r.stdout + r.stderr)
    r = run(["npx", "vite-node", "scripts/art/generate.ts", "--"] + [str(i) for i in ALL_IDS])
    if r.returncode != 0:
        raise SystemExit("generate failed:\n" + r.stdout + r.stderr)


def score():
    r = run(["npx", "vite-node", "scripts/art/scorePose.ts"])
    if r.returncode != 0:
        raise SystemExit("scorePose failed:\n" + r.stdout + r.stderr)
    return json.loads(r.stdout.strip().splitlines()[-1])


def restore():
    """Put every shape back to what the DEFAULT anchors produce."""
    apply({})


def main():
    if "--restore" in sys.argv:
        restore()
        print("restored: all garments retraced with the default anchors")
        print(json.dumps(score(), indent=2))
        return

    print("%-22s %8s %8s %8s %7s   %s" % ("variant", "tracing", "HELDOUT", "gap", "height", "verdict"))
    print("-" * 84)
    base = None
    rows = []
    for label, env, _ids in SWEEP:
        apply(env)
        s = score()
        if base is None:
            base = s
        # ⛔ RANK ON THE HELD-OUT FRAME, NOT THE MEAN. The first version of this
        # ranked on the mean and crowned "hakama +6", which took the TRACED frame
        # from 0.8835 to 0.9164 while making the HELD-OUT frame WORSE (0.8472 ->
        # 0.8416). That is the definition of overfitting, and a mean is happy to
        # buy it. A variant that hurts the frame the outfit was never traced from
        # is rejected however good it looks on the one it was.
        d_held = s["heldout"] - base["heldout"]
        d_trace = s["tracing"] - base["tracing"]
        d_h = s["heightStage"] - base["heightStage"]
        taller = d_h > 1e-6
        if label == "baseline":
            verdict = "baseline"
        elif taller:
            # The figure is ALREADY 11 % taller than the source (SP7 defect 2).
            # A variant that adds height is disqualified whatever it scores.
            verdict = "REJECT  grew %+.1f stage px (scale-free score cannot see this)" % d_h
        elif d_held > 1e-6:
            verdict = "BETTER  heldout %+.4f" % d_held
        else:
            verdict = "reject  heldout %+.4f" % d_held
            if d_trace > 1e-6:
                verdict += "  (OVERFIT: traced %+.4f)" % d_trace
        rows.append((label, s, d_held, taller))
        print("%-22s %8.4f %8.4f %8.4f %7.1f   %s"
              % (label, s["tracing"], s["heldout"], s["gap"], s["heightStage"], verdict))

    print("-" * 84)
    eligible = [r for r in rows if not r[3]]
    best = max(eligible, key=lambda r: r[1]["heldout"])
    print("BEST on the HELD-OUT frame: %s  %.4f  (%+0.4f vs baseline)"
          % (best[0], best[1]["heldout"], best[2]))
    print("\nrestoring the defaults — accept a winner by EDITING traceGarment.py, never by env")
    restore()


if __name__ == "__main__":
    main()
