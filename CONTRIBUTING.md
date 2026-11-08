# Contributing

Thanks for your interest. Please follow these steps.

## Workflow

1. Fork the repo.
2. Clone your fork: `git clone git@github.com:YOU/envcheck.git`
3. Create a branch: `git checkout -b feature/your-feature`
4. Install: `npm install`
5. Verify: run `npm run typecheck` then `npm test`
6. Commit and push, then open a Pull Request.

## Commit format

Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

## Requirements

- TypeScript strict mode must pass.
- New behavior needs tests.
- Keep public API backward compatible.

## Pull Request checklist

- [ ] Tests added or updated
- [ ] `npm test` passes
- [ ] `npm run typecheck` passes
