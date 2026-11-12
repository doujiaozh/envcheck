# envcheck

Validate `.env` against `.env.example`. Reports missing, extra, and empty keys. Non-zero exit code for CI.

## Install

    npm install -g envcheck

## Quick start

Run in your project root:

    envcheck

It reads `.env.example` and `.env`, compares them, and prints the result.

Exit code 0 on success, 1 on mismatch, 2 on usage error.

## Rules

- `KEY=value` in `.env.example` means the key is required and non-empty.
- `KEY=` in `.env.example` means the key is optional.
- Extra keys in `.env` are errors by default.

## Options
- `--fix`: append missing keys to file
- `-e, --example <path>`: template file, default `.env.example`
- `-f, --file <path>`: actual file, default `.env`
- `--ignore <keys>`: comma-separated keys to ignore
- `--allow-extra`: allow keys not in template
- `--allow-empty`: allow empty values
- `--json`: JSON output
- `-h, --help`: show help
- `-v, --version`: show version

## CI usage

    npx envcheck

## Library usage

    const { parseEnv, compare } = require('envcheck');
    const result = compare(parseEnv(example), parseEnv(actual), {
      ignore: [], allowExtra: false, allowEmpty: false,
    });
    if (!result.ok) process.exit(1);

## Development

    npm install
    npm test
    npm run typecheck
    npm run build

## License

MIT
