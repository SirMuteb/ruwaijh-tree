# أرشيف شجرة الرويجح

Premium Arabic-first interactive lineage website built from the attached PDF.

## Data Rules

- Relationships are father to son only.
- No spouses, mothers, locations, biographies, birth dates, or fabricated relatives are included.
- The structured source data is in `data/family.json`.
- The PDF extraction keeps source coordinates for auditability.

## Run

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:3000`.

## Notes

This workspace installed dependencies with a local npm cache because the default user-level npm cache was not writable in the sandbox. In this Codex environment, Next.js dev/build startup is blocked by Windows returning `EPERM` when Next forks its worker process. TypeScript verification passes with:

```bash
npx tsc --noEmit
```
