import { CheckResult, CompareOptions, EnvMap } from './types';

export function compare(example: EnvMap, actual: EnvMap, options: CompareOptions): CheckResult {
  const ignore = new Set(options.ignore);
  const missing: string[] = [];
  const extra: string[] = [];
  const empty: string[] = [];

  for (const entry of example) {
    const key = entry[0];
    const expected = entry[1];
    if (ignore.has(key)) continue;
    const found = actual.get(key);
    if (!found) {
      missing.push(key);
      continue;
    }
    if (!options.allowEmpty) {
      if (expected.hasValue) {
        if (!found.hasValue) {
          empty.push(key);
        }
      }
    }
  }

  if (!options.allowExtra) {
    for (const entry of actual) {
      const key = entry[0];
      if (ignore.has(key)) continue;
      if (!example.has(key)) {
        extra.push(key);
      }
    }
  }

  let ok = false;
  if (missing.length === 0) {
    if (extra.length === 0) {
      if (empty.length === 0) {
        ok = true;
      }
    }
  }
  return { missing, extra, empty, ok };
}
