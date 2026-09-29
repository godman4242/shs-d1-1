/**
 * CHAOS PLANTS — THE CLOUD GUARD (owner ruling 2026-09-29, the cloud lane).
 *
 * Applied and judged by `npm run chaos` (`scripts/gates/chaos.ts`). Each entry disarms ONE
 * rule of `scripts/cloud/guard-reference.sh`, the only thing standing between the study-only
 * corpus a cloud session unpacks and GitHub; `tests/cloudGuard.test.ts` must go red.
 *
 * PROVENANCE. All four written here, at the guard, and watched red on the session that
 * wrote them — marked `reauthored:`.
 */
import type { ChaosPlant } from '../scripts/gates/chaosPlant.ts';

const FILE = 'scripts/cloud/guard-reference.sh';
const TESTS = ['tests/cloudGuard.test.ts'];

export const PLANTS: ChaosPlant[] = [
  {
    name: 'cloud guard: the pre-commit check looks for a folder that never exists',
    file: FILE,
    find: "bad=$(git diff --cached --name-only | grep '^reference/' | head -5)",
    replace: "bad=$(git diff --cached --name-only | grep '^reference-disarmed/' | head -5)",
    tests: TESTS,
    note: 'reauthored:2026-09-29 — a staged corpus file would be committed, then pushed with the next ship',
  },
  {
    name: 'cloud guard: the pre-push scan of each commit matches nothing',
    file: FILE,
    find: `if git diff-tree --root --no-commit-id --name-only -r "$c" | grep -q '^reference/'; then`,
    replace: `if git diff-tree --root --no-commit-id --name-only -r "$c" | grep -q '^reference-disarmed/'; then`,
    tests: TESTS,
    note: 'reauthored:2026-09-29 — the bundle\'s cloud-reference branch could be pushed whole',
  },
  {
    name: 'cloud guard: an unwalkable remote range waves the push on (fail-open)',
    file: FILE,
    find: 'commits=$(git rev-list "$roid..$loid" 2>/dev/null) || { echo "❌ cannot walk $roid..$loid: push refused (fetch first)" >&2; exit 1; }',
    replace: 'commits=$(git rev-list "$roid..$loid" 2>/dev/null) || true',
    tests: TESTS,
    note: 'reauthored:2026-09-29 — a stale remote tip would read as "nothing to scan": the silent zero',
  },
  {
    name: 'cloud guard: a cloud session may push main',
    file: FILE,
    find: 'if [ "${CLAUDE_CODE_REMOTE:-}" = true ] && [ "$rref" = refs/heads/main ]; then',
    replace: 'if [ "${CLAUDE_CODE_REMOTE:-}" = true ] && [ "$rref" = refs/heads/never ]; then',
    tests: TESTS,
    note: 'reauthored:2026-09-29 — a cloud commit would reach main before the full-corpus re-gate',
  },
];
