import { EnvMap } from './types';

const LINE_RE = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/;

export function parseEnv(content: string): EnvMap {
  const map: EnvMap = new Map();
  const lines = content.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.charAt(0) === '#') continue;
    const match = LINE_RE.exec(line);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    const first = value.charAt(0);
    if (first === '"') {
      if (value.charAt(value.length - 1) === '"') {
        value = value.slice(1, -1);
      }
    } else if (first === "'") {
      if (value.charAt(value.length - 1) === "'") {
        value = value.slice(1, -1);
      }
    } else {
      const hashIndex = value.indexOf(' #');
      if (hashIndex !== -1) {
        value = value.slice(0, hashIndex).trim();
      }
    }
    map.set(key, { key, value, hasValue: value.length !== 0 });
  }
  return map;
}
