---
"@mormo_mossaab/geocore-cli": minor
---

`geocore serve` now refuses an empty or blank `--api-key` (including `--api-key` with no value) and exits with an error instead of starting without authentication. This catches a shell variable that expanded to nothing, for example `"$KEY"` in PowerShell, where the environment variable is `$env:KEY`. Leaving `--api-key` out entirely still serves without a key, as before.
