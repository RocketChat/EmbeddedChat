---
name: "gsd:update"
description: "Update GSD to latest version via git pull"
tools: ["readFile", "runInTerminal", "fetch"]
---

<objective>
Check for GSD updates, pull if available, and display what changed.

For GitHub Copilot, GSD is distributed via the repository's `.github/` folder. Updates are pulled via git.
</objective>

<process>

<step name="check_remote_changes">
Fetch remote changes and check for updates:

```bash
git fetch origin
git log HEAD..origin/main --oneline 2>/dev/null | head -20
```

**If no changes:**

```
## GSD Update

You're already on the latest version.
```

STOP here if already up to date.
</step>

<step name="show_changes_and_confirm">
**If update available**, show what's new BEFORE updating:

1. Show commit log between current and remote
2. Display preview and ask for confirmation:

```
## GSD Update Available

### What's New
────────────────────────────────────────────────────────────

{commit log}

────────────────────────────────────────────────────────────

⚠️  **Note:** This will pull the latest changes from the repository.

If you've modified any GSD files directly, consider:
- Stashing your changes first (`git stash`)
- Or committing your changes before updating
```

Use HumanAgent MCP (HumanAgent_Chat):

- Question: "Proceed with update?"
- Options:
  - "Yes, update now"
  - "No, cancel"

**If user cancels:** STOP here.
</step>

<step name="run_update">
Pull the latest changes:

```bash
git pull origin main
```

Capture output. If pull fails (conflicts, etc.), show error and suggest resolution.
</step>

<step name="display_result">
Format completion message:

```
╔═══════════════════════════════════════════════════════════╗
║  GSD Updated Successfully                                  ║
╚═══════════════════════════════════════════════════════════╝

Reload VS Code window to pick up the new agents and prompts.

[View full changelog](https://github.com/glittercowboy/get-stuff-done/blob/main/CHANGELOG.md)
```

</step>

</process>

<success_criteria>

- [ ] Remote changes checked correctly
- [ ] Update skipped if already current
- [ ] Changelog displayed BEFORE update
- [ ] User confirmation obtained
- [ ] Git pull executed successfully
- [ ] Restart reminder shown
      </success_criteria>
