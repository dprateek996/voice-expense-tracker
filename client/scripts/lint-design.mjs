#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const rule = process.argv[2];

const RULES = {
  'no-important': {
    label: 'Disallow !important in client/src',
    pattern: /!important/g,
  },
  'no-hex': {
    label: 'Disallow hex color literals in client/src',
    pattern: /#[0-9A-Fa-f]{3,8}\b/g,
  },
  'no-arbitrary': {
    label: 'Disallow arbitrary px/rem/em/vh/vw utility classes in client/src',
    pattern: /[A-Za-z0-9:_-]+-\[[^\]]*(?:px|rem|em|vh|vw)\]/g,
  },
};

if (!rule || !RULES[rule]) {
  const supported = Object.keys(RULES).join(', ');
  console.error(`Usage: node scripts/lint-design.mjs <${supported}>`);
  process.exit(1);
}

const SOURCE_ROOT = path.resolve(process.cwd(), 'src');
const ALLOWED_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css']);
const IGNORED_SEGMENTS = new Set(['node_modules', 'dist']);

async function collectFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_SEGMENTS.has(entry.name)) {
        return [];
      }
      return collectFiles(fullPath);
    }

    if (ALLOWED_EXTENSIONS.has(path.extname(entry.name))) {
      return [fullPath];
    }

    return [];
  }));

  return nested.flat();
}

function findLine(source, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (source[i] === '\n') {
      line += 1;
    }
  }
  return line;
}

function formatSnippet(source, matchIndex) {
  const start = source.lastIndexOf('\n', matchIndex) + 1;
  const end = source.indexOf('\n', matchIndex);
  return source.slice(start, end === -1 ? source.length : end).trim();
}

async function run() {
  const files = await collectFiles(SOURCE_ROOT);
  const { pattern, label } = RULES[rule];
  const failures = [];

  for (const file of files) {
    const source = await fs.readFile(file, 'utf8');
    const regex = new RegExp(pattern.source, pattern.flags);
    let match = regex.exec(source);

    while (match) {
      const line = findLine(source, match.index);
      failures.push({
        file,
        line,
        snippet: formatSnippet(source, match.index),
      });
      match = regex.exec(source);
    }
  }

  if (failures.length > 0) {
    console.error(`\n${label} failed:\n`);
    failures.forEach(({ file, line, snippet }) => {
      console.error(`${path.relative(process.cwd(), file)}:${line}`);
      console.error(`  ${snippet}`);
    });
    console.error(`\nFound ${failures.length} violation(s).`);
    process.exit(1);
  }

  console.log(`\n${label} passed.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
