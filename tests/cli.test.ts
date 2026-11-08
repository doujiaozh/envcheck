import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { run } from '../src/cli';

function setup(example: string, actual: string): string[] {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'envcheck-'));
  const ex = path.join(dir, '.env.example');
  const ac = path.join(dir, '.env');
  fs.writeFileSync(ex, example);
  fs.writeFileSync(ac, actual);
  return ['-e', ex, '-f', ac];
}

describe('run', () => {
  it('returns 0 on match', () => {
    expect(run(setup('FOO=bar\n', 'FOO=bar\n'))).toBe(0);
  });
  it('returns 1 on missing', () => {
    expect(run(setup('FOO=bar\nBAZ=qux\n', 'FOO=bar\n'))).toBe(1);
  });
  it('returns 1 on empty', () => {
    expect(run(setup('FOO=bar\n', 'FOO=\n'))).toBe(1);
  });
  it('returns 2 on missing file', () => {
    expect(run(['-e', '/nope/.env.example', '-f', '/nope/.env'])).toBe(2);
  });
  it('returns 0 on help', () => {
    expect(run(['--help'])).toBe(0);
  });
});
