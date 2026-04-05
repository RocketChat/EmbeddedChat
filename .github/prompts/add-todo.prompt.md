---
name: "gsd:add-todo"
description: "Capture idea or task as todo from current conversation context"
tools: ["readFile", "editFiles", "runInTerminal", "listDirectory"]
---

<objective>
Capture an idea, task, or issue that surfaces during a GSD session as a structured todo for later work.

Enables "thought → capture → continue" flow without losing context or derailing current work.
</objective>

<context>
@.gsd/STATE.md
</context>

<process>

<step name="ensure_directory">
```bash
mkdir -p .gsd/todos/pending .gsd/todos/done
```
</step>

<step name="check_existing_areas">
```bash
ls .gsd/todos/pending/*.md 2>/dev/null | xargs -I {} grep "^area:" {} 2>/dev/null | cut -d' ' -f2 | sort -u
```

Note existing areas for consistency in infer_area step.
</step>

<step name="extract_content">
**With arguments:** Use as the title/focus.
- `/add-todo.md Add auth token refresh` → title = "Add auth token refresh"

**Without arguments:** Analyze recent conversation to extract:

- The specific problem, idea, or task discussed
- Relevant file paths mentioned
- Technical details (error messages, line numbers, constraints)

Formulate:

- `title`: 3-10 word descriptive title (action verb preferred)
- `problem`: What's wrong or why this is needed
- `solution`: Approach hints or "TBD" if just an idea
- `files`: Relevant paths with line numbers from conversation
  </step>

<step name="infer_area">
Infer area from file paths:

| Path pattern                   | Area       |
| ------------------------------ | ---------- |
| `src/api/*`, `api/*`           | `api`      |
| `src/components/*`, `src/ui/*` | `ui`       |
| `src/auth/*`, `auth/*`         | `auth`     |
| `src/db/*`, `database/*`       | `database` |
| `tests/*`, `__tests__/*`       | `testing`  |
| `docs/*`                       | `docs`     |
| `.gsd/*`                       | `planning` |
| `scripts/*`, `bin/*`           | `tooling`  |
| No files or unclear            | `general`  |

Use existing area from step 2 if similar match exists.
</step>

<step name="check_duplicates">
```bash
grep -l -i "[key words from title]" .gsd/todos/pending/*.md 2>/dev/null
```

If potential duplicate found:

1. Read the existing todo
2. Compare scope

If overlapping, use HumanAgent MCP (HumanAgent_Chat):

- header: "Duplicate?"
- question: "Similar todo exists: [title]. What would you like to do?"
- options:
  - "Skip" — keep existing todo
  - "Replace" — update existing with new context
  - "Add anyway" — create as separate todo
    </step>

<step name="create_file">
```bash
timestamp=$(date "+%Y-%m-%dT%H:%M")
date_prefix=$(date "+%Y-%m-%d")
```

Generate slug from title (lowercase, hyphens, no special chars in FILENAME only).

Write to `.gsd/todos/pending/${date_prefix}-${slug}.md`:

```markdown
---
created: [timestamp]
title: [title]
area: [area]
files:
  - [file:lines]
---

## Problem

[problem description - enough context for future Copilot to understand weeks later]

## Solution

[approach hints or "TBD"]
```

</step>

<step name="update_state">
If `.gsd/STATE.md` exists:

1. Count todos: `ls .gsd/todos/pending/*.md 2>/dev/null | wc -l`
2. Update "### Pending Todos" under "## Accumulated Context"
   </step>

<step name="git_commit">
Commit the todo and any updated state:

**Check planning config:**

```bash
COMMIT_PLANNING_DOCS=$(cat .gsd/config.json 2>/dev/null | grep -o '"commit_docs"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false' || echo "true")
git check-ignore -q .gsd 2>/dev/null && COMMIT_PLANNING_DOCS=false
```

**If `COMMIT_PLANNING_DOCS=false`:** Skip git operations, log "Todo saved (not committed - commit_docs: false)"

**If `COMMIT_PLANNING_DOCS=true` (default):**

```bash
git add .gsd/todos/pending/[filename]
[ -f .gsd/STATE.md ] && git add .gsd/STATE.md
git commit -m "$(cat <<'EOF'
docs: capture todo - [title]

Area: [area]
EOF
)"
```

Confirm: "Committed: docs: capture todo - [title]"
</step>

<step name="confirm">
```
Todo saved: .gsd/todos/pending/[filename]

[title]
Area: [area]
Files: [count] referenced

---

Would you like to:

1. Continue with current work
2. Add another todo
3. View all todos (/check-todos.md)

```
</step>

</process>

<output>
- `.gsd/todos/pending/[date]-[slug].md`
- Updated `.gsd/STATE.md` (if exists)
</output>

<anti_patterns>
- Don't create todos for work in current plan (that's deviation rule territory)
- Don't create elaborate solution sections — captures ideas, not plans
- Don't block on missing information — "TBD" is fine
</anti_patterns>

<success_criteria>
- [ ] Directory structure exists
- [ ] Todo file created with valid frontmatter
- [ ] Problem section has enough context for future Copilot
- [ ] No duplicates (checked and resolved)
- [ ] Area consistent with existing todos
- [ ] STATE.md updated if exists
- [ ] Todo and state committed to git
</success_criteria>
```
