import { CheckResult } from './types';

const isTTY = process.stdout.isTTY === true;
const noColor = Boolean(process.env.NO_COLOR);
const enabled = isTTY ? !noColor : false;

function wrap(code: string): (s: string) => string {
  return function (s: string): string {
    return enabled ? '\x1b[' + code + 'm' + s + '\x1b[0m' : s;
  };
}

const c = {
  red: wrap('31'),
  green: wrap('32'),
  yellow: wrap('33'),
  dim: wrap('2'),
  bold: wrap('1')
};

export function formatHuman(result: CheckResult): string {
  if (result.ok) {
    return c.green('OK') + ' envcheck passed\n';
  }
  const lines: string[] = [];
  if (result.missing.length) {
    lines.push(c.red(c.bold('Missing variables')));
    for (const key of result.missing) lines.push('  - ' + key);
    lines.push('');
  }
  if (result.empty.length) {
    lines.push(c.yellow(c.bold('Empty variables')));
    for (const key of result.empty) lines.push('  - ' + key);
    lines.push('');
  }
  if (result.extra.length) {
    lines.push(c.yellow(c.bold('Extra variables')));
    for (const key of result.extra) lines.push('  - ' + key);
    lines.push('');
  }
  return lines.join('\n');
}

export function formatJson(result: CheckResult): string {
  return JSON.stringify(result, null, 2) + '\n';
}
