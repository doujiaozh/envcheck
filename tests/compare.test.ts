import { parseEnv } from '../src/parser';
import { compare } from '../src/compare';

const defaults = { ignore: [] as string[], allowExtra: false, allowEmpty: false };

describe('compare', () => {
  it('passes on match', () => {
    const r = compare(parseEnv('FOO=bar'), parseEnv('FOO=bar'), defaults);
    expect(r.ok).toBe(true);
  });
  it('detects missing', () => {
    const r = compare(parseEnv('FOO=bar\nBAZ=qux'), parseEnv('FOO=bar'), defaults);
    expect(r.missing).toEqual(['BAZ']);
  });
  it('detects extra', () => {
    const r = compare(parseEnv('FOO=bar'), parseEnv('FOO=bar\nX=1'), defaults);
    expect(r.extra).toEqual(['X']);
  });
  it('allowExtra bypasses extra', () => {
    const r = compare(parseEnv('FOO=bar'), parseEnv('FOO=bar\nX=1'), { ignore: [], allowExtra: true, allowEmpty: false });
    expect(r.ok).toBe(true);
  });
  it('detects empty when required', () => {
    const r = compare(parseEnv('FOO=bar'), parseEnv('FOO='), defaults);
    expect(r.empty).toEqual(['FOO']);
  });
  it('allowEmpty bypasses empty', () => {
    const r = compare(parseEnv('FOO=bar'), parseEnv('FOO='), { ignore: [], allowExtra: false, allowEmpty: true });
    expect(r.ok).toBe(true);
  });
  it('respects ignore', () => {
    const r = compare(parseEnv('FOO=bar\nS=1'), parseEnv('FOO=bar\nS=2\nX=3'), { ignore: ['S', 'X'], allowExtra: false, allowEmpty: false });
    expect(r.ok).toBe(true);
  });
});
