# Contributing to ResumeGap

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork and follow the setup steps in [README.md](README.md)
3. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Workflow

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run ESLint
```

## Submitting Changes

1. Make your changes on a feature branch
2. Ensure `npm run build` passes with no errors
3. Write a clear commit message following [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add export to PDF`
   - `fix: correct ATS keyword matching`
   - `chore: update dependencies`
4. Open a pull request against `main` with a description of what you changed and why

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs. actual behavior
- Browser and OS

## Requesting Features

Open an issue describing the use case. Feature requests with clear motivation are more likely to be picked up.

## Code Style

- TypeScript throughout — no `any` unless absolutely necessary
- Tailwind CSS for styling — no inline styles
- Keep components focused and small
- Server Components for data fetching where possible
