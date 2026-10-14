---
"@mormo_mossaab/geocore-cli": patch
---

`geocore init [dir]` now initializes the given directory (creating it if needed) instead of ignoring the argument and initializing the current directory. Unknown arguments, such as a mistyped flag, now fail with an error instead of being silently ignored.
