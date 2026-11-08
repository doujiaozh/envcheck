import { parseEnv } from '../src/parser';

describe('parseEnv', () => {
  it('parses simple pairs', () => {
    const map = parseEnv('FOO=bar\nBAZ=qux');
    expect(map.get('FOO')?.value).toBe('bar');
    expect(map.get('BAZ')?.value).toBe('qux');
  });
  it('ignores comments and blanks', () => {
    const map = parseEnv('# c\n\nFOO=bar');
    expect(map.size).toBe(1);
  });
  it('supports export prefix', () => {
    expect(parseEnv('export FOO=bar').get('FOO')?.value).toBe('bar');
  });
  it('strips quotes', () => {
    expect(parseEnv('FOO="a b"').get('FOO')?.value).toBe('a b');
  });
  it('marks empty value', () => {
    expect(parseEnv('FOO=').get('FOO')?.hasValue).toBe(false);
  });
  it('handles CRLF', () => {
    const map = parseEnv('FOO=bar\r\nBAZ=qux');
    expect(map.get('FOO')?.value).toBe('bar');
  });
});
