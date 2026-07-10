/**
 * Config-purity scanner — the safety net behind two non-negotiables:
 *
 *   1. src/core/ contains ZERO numeric literals (every gameplay number lives
 *      in src/config/, named and labeled CONTRACT or INFERRED).
 *   2. Dependency direction: core/ may import only core/ + config/;
 *      config/ may import only config/. Nothing imports Phaser or src/game/
 *      below the game layer. Bare-module imports are banned entirely in
 *      core/ and config/ (framework-free by construction).
 *
 * Implementation notes (hardened per adversarial audit 2026-07-11):
 *   - AST-based (TypeScript compiler API), NOT regex — identifiers like
 *     `mulberry32`, digits inside strings, and comments are never
 *     false-positived; literals in type positions, enum initializers,
 *     template expressions, and default params ARE caught.
 *   - Implicit enum ordinals (`enum E { A, B }`) mint usable numbers with
 *     zero literals — treated as violations in scanned dirs.
 *   - Dynamic import()/require() with a NON-STATIC argument (template with
 *     substitution, concatenation, variable) is FAIL-CLOSED: reported as a
 *     violation rather than silently skipped.
 *   - `import x = require('...')` (import-equals) and triple-slash
 *     `/// <reference path|types>` directives are scanned too.
 *   - listTsFiles covers .ts/.tsx/.mts/.cts; assertOnlyScannableFiles guards
 *     against payload smuggling via extensions the scanner can't parse
 *     (.json, .js, .JSON5, …) — only scannable sources + .md docs may exist
 *     under scanned dirs.
 *   - Known escape hatches this cannot catch (reviewers watch for intent):
 *     `Number('42')`, `parseInt`, `'x'.charCodeAt(...)`, `Infinity`/`NaN`
 *     identifiers, `+true`. Deliberate cheats, not accidental leaks.
 */
import ts from 'typescript';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

export interface LiteralHit {
  file: string;
  line: number;
  col: number;
  text: string;
}

export interface ImportHit {
  file: string;
  line: number;
  specifier: string;
  /** false when the specifier cannot be statically resolved (fail-closed). */
  static: boolean;
}

const SCANNABLE_EXT = ['.ts', '.tsx', '.mts', '.cts'] as const;
/** Files allowed to exist in scanned dirs without being code-scannable. */
const DOC_EXT = ['.md'] as const;

function isScannable(file: string): boolean {
  return SCANNABLE_EXT.some((ext) => file.endsWith(ext));
}

function parse(sourceText: string, fileName: string): ts.SourceFile {
  const kind = fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, kind);
}

/**
 * Every numeric or bigint literal in the source, with location — plus
 * implicit enum ordinals (enum members without a string-literal initializer),
 * which are numbers minted without a literal.
 */
export function scanNumericLiterals(sourceText: string, fileName: string): LiteralHit[] {
  const sf = parse(sourceText, fileName);
  const hits: LiteralHit[] = [];
  const record = (node: ts.Node, text: string): void => {
    const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    hits.push({ file: fileName, line: line + 1, col: character + 1, text });
  };
  const visit = (node: ts.Node): void => {
    if (ts.isNumericLiteral(node) || ts.isBigIntLiteral(node)) {
      record(node, node.getText(sf));
    }
    if (ts.isEnumMember(node) && (!node.initializer || !ts.isStringLiteralLike(node.initializer))) {
      record(node, `implicit/numeric enum ordinal: ${node.name.getText(sf)}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return hits;
}

/**
 * Every module dependency in the source: static imports (incl. type-only),
 * re-exports, dynamic import(), require() calls, import-equals declarations,
 * and triple-slash reference directives (path + types).
 * Non-static dynamic specifiers are reported with static:false.
 */
export function scanImports(sourceText: string, fileName: string): ImportHit[] {
  const sf = parse(sourceText, fileName);
  const hits: ImportHit[] = [];
  const record = (pos: number, specifier: string, isStatic: boolean): void => {
    const { line } = sf.getLineAndCharacterOfPosition(pos);
    hits.push({ file: fileName, line: line + 1, specifier, static: isStatic });
  };
  // Triple-slash directives are trivia, not AST nodes.
  for (const ref of sf.referencedFiles) {
    record(ref.pos, ref.fileName, true);
  }
  for (const ref of sf.typeReferenceDirectives) {
    record(ref.pos, ref.fileName, true);
  }
  const visit = (node: ts.Node): void => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      record(node.getStart(sf), node.moduleSpecifier.text, true);
    }
    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      const expr = node.moduleReference.expression;
      if (ts.isStringLiteralLike(expr)) {
        record(node.getStart(sf), expr.text, true);
      } else {
        record(node.getStart(sf), '<non-static import-equals>', false);
      }
    }
    if (ts.isCallExpression(node)) {
      const isDynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      const isRequire = ts.isIdentifier(node.expression) && node.expression.text === 'require';
      if (isDynamicImport || isRequire) {
        const arg = node.arguments[0];
        // NoSubstitutionTemplateLiteral counts as static; anything else
        // (substitution templates, concatenation, variables) fails closed.
        if (arg && ts.isStringLiteralLike(arg)) {
          record(node.getStart(sf), arg.text, true);
        } else {
          record(node.getStart(sf), `<non-static ${isDynamicImport ? 'import()' : 'require()'}>`, false);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return hits;
}

/**
 * Resolve a relative specifier against its importing file.
 * Returns null for bare specifiers (package imports) — those are judged
 * separately (banned outright in core/ and config/).
 */
export function resolveImportTarget(fromFile: string, specifier: string): string | null {
  if (!specifier.startsWith('./') && !specifier.startsWith('../')) return null;
  return path.resolve(path.dirname(fromFile), specifier);
}

function listAllFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...listAllFiles(full));
    } else {
      out.push(full);
    }
  }
  return out.sort();
}

/** All scannable TypeScript files (.ts/.tsx/.mts/.cts) under a directory, recursively. */
export function listTsFiles(dir: string): string[] {
  return listAllFiles(dir).filter(isScannable);
}

/**
 * Files under `dir` that the scanner cannot parse and that aren't plain docs.
 * Anything returned here is a purity violation: a .json/.js/etc. payload
 * could smuggle numbers or dependencies past the gate.
 */
export function listUnscannableFiles(dir: string): string[] {
  return listAllFiles(dir).filter((f) => !isScannable(f) && !DOC_EXT.some((ext) => f.endsWith(ext)));
}

export function readSource(file: string): string {
  return readFileSync(file, 'utf8');
}
