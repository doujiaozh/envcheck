import * as fs from 'fs';
import * as path from 'path';
import { parseEnv } from './parser';
import { compare } from './compare';
import { formatHuman, formatJson } from './report';

const HELP_LINES = [
  'envcheck - validate .env against .env.example',
  '',
  'Usage:',
  '  envcheck [options]',
  '',
  'Options:',
  '  -e, --example <path>   template file (default: .env.example)',
  '  -f, --file <path>      actual file (default: .env)',
  '  --ignore <keys>        comma-separated keys to ignore',
  '  --allow-extra          allow keys not in template',
  '  --allow-empty          allow empty values',
  '  --json                 JSON output',
  '  -h, --help             show help',
  '  -v, --version          show version'
];
const HELP = HELP_LINES.join('\n') + '\n';

interface CliOptions {
  example: string;
  file: string;
  ignore: string[];
  allowExtra: boolean;
  allowEmpty: boolean;
  json: boolean;
  help: boolean;
  version: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    example: '.env.example',
    file: '.env',
    ignore: [],
    allowExtra: false,
    allowEmpty: false,
    json: false,
    help: false,
    version: false
  };
  const args = argv.slice();
  while (args.length) {
    const arg = args.shift() as string;
    switch (arg) {
      case '-h':
      case '--help':
        opts.help = true;
        break;
      case '-v':
      case '--version':
        opts.version = true;
        break;
      case '-e':
      case '--example':
        opts.example = args.shift() as string;
        break;
      case '-f':
      case '--file':
        opts.file = args.shift() as string;
        break;
      case '--ignore': {
        const raw = args.shift() as string;
        const parts = raw.split(',');
        const keys: string[] = [];
        for (const p of parts) {
          const t = p.trim();
          if (t) keys.push(t);
        }
        opts.ignore = keys;
        break;
      }
      case '--allow-extra':
        opts.allowExtra = true;
        break;
      case '--allow-empty':
        opts.allowEmpty = true;
        break;
      case '--json':
        opts.json = true;
        break;
      default:
        throw new Error('unknown option: ' + arg);
    }
  }
  return opts;
}

export function run(argv: string[]): number {
  let opts: CliOptions;
  try {
    opts = parseArgs(argv);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write('envcheck: ' + msg + '\n\n' + HELP);
    return 2;
  }
  if (opts.help) {
    process.stdout.write(HELP);
    return 0;
  }
  if (opts.version) {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { version: string };
    process.stdout.write(pkg.version + '\n');
    return 0;
  }
  let exampleContent: string;
  let fileContent: string;
  try {
    exampleContent = fs.readFileSync(opts.example, 'utf8');
  } catch (e) {
    process.stderr.write('envcheck: cannot read template ' + opts.example + '\n');
    return 2;
  }
  try {
    fileContent = fs.readFileSync(opts.file, 'utf8');
  } catch (e) {
    process.stderr.write('envcheck: cannot read file ' + opts.file + '\n');
    return 2;
  }
  const result = compare(parseEnv(exampleContent), parseEnv(fileContent), {
    ignore: opts.ignore,
    allowExtra: opts.allowExtra,
    allowEmpty: opts.allowEmpty
  });
  if (opts.json) {
    process.stdout.write(formatJson(result));
  } else {
    process.stdout.write('Checking ' + opts.file + ' against ' + opts.example + '\n\n');
    process.stdout.write(formatHuman(result));
  }
  return result.ok ? 0 : 1;
}
