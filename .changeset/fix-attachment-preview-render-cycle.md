---
'@embeddedchat/react': patch
---

Move attachment preview URL creation to useEffect with URL.revokeObjectURL cleanup to prevent render-cycle memory leaks and UI freezes
