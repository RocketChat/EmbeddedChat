---
name: "gsd:check-todos"
description: "List pending todos and select one to work on"
tools: ["readFile", "editFiles", "runInTerminal", "listDirectory"]
---

<objective>
List all pending todos, allow selection, load full context for the selected todo, and route to appropriate action.

Enables reviewing captured ideas and deciding what to work on next.
</objective>

<context>
@.gsd/STATE.md
@.gsd/ROADMAP.md
</context>

<process>

<step name="check_exist">
```bash
TODO_COUNT=$(ls .gsd/todos/pending/*.md 2>/dev/null | wc -l | tr -d ' ')
echo "Pending todos: $TODO_COUNT"
```

If count is 0:

```
No pending todos.

Todos are captured during work sessions with /add-todo.md.

---

Would you like to:

1. Continue with current phase (/progress.md)
2. Add a todo now (/add-todo.md)
```

Exit.
</step>

<step name="parse_filter">
Check for area filter in arguments:
- `/check-todos.md` → show all
- `/check-todos.md api` → filter to area:api only
</step>

<step name="list_todos">
```bash
for file in .gsd/todos/pending/*.md; do
  created=$(grep "^created:" "$file" | cut -d' ' -f2)
  title=$(grep "^title:" "$file" | cut -d':' -f2- | xargs)
  area=$(grep "^area:" "$file" | cut -d' ' -f2)
  echo "$created|$title|$area|$file"
done | sort
```

Apply area filter if specified. Display as numbered list:

```
Pending Todos:

1. Add auth token refresh (api, 2d ago)
2. Fix modal z-index issue (ui, 1d ago)
3. Refactor database connection pool (database, 5h ago)

---

Reply with a number to view details, or:
- `/check-todos.md [area]` to filter by area
- `q` to exit
```

Format age as relative time.
</step>

<step name="handle_selection">
Wait for user to reply with a number.

If valid: load selected todo, proceed.
If invalid: "Invalid selection. Reply with a number (1-[N]) or `q` to exit."
</step>

<step name="load_context">
Read the todo file completely. Display:

```
## [title]

**Area:** [area]
**Created:** [date] ([relative time] ago)
**Files:** [list or "None"]

### Problem
[problem section content]

### Solution
[solution section content]
```

If `files` field has entries, read and briefly summarize each.
</step>

<step name="check_roadmap">
```bash
ls .gsd/ROADMAP.md 2>/dev/null && echo "Roadmap exists"
```

If roadmap exists:

1. Check if todo's area matches an upcoming phase
2. Check if todo's files overlap with a phase's scope
3. Note any match for action options
   </step>

<step name="offer_actions">
**If todo maps to a roadmap phase:**

Use HumanAgent MCP (HumanAgent_Chat):

- header: "Action"
- question: "This todo relates to Phase [N]: [name]. What would you like to do?"
- options:
  - "Work on it now" — move to done, start working
  - "Add to phase plan" — include when planning Phase [N]
  - "Brainstorm approach" — think through before deciding
  - "Put it back" — return to list

**If no roadmap match:**

Use HumanAgent MCP (HumanAgent_Chat):

- header: "Action"
- question: "What would you like to do with this todo?"
- options:
  - "Work on it now" — move to done, start working
  - "Create a phase" — /add-phase.md with this scope
  - "Brainstorm approach" — think through before deciding
  - "Put it back" — return to list
    </step>

<step name="execute_action">
**Work on it now:**
```bash
mv ".gsd/todos/pending/[filename]" ".gsd/todos/done/"
```
Update STATE.md todo count. Present problem/solution context. Begin work or ask how to proceed.

**Add to phase plan:**
Note todo reference in phase planning notes. Keep in pending. Return to list or exit.

**Create a phase:**
Display: `/add-phase.md [description from todo]`
Keep in pending. User runs command in fresh context.

**Brainstorm approach:**
Keep in pending. Start discussion about problem and approaches.

**Put it back:**
Return to list_todos step.
</step>

<step name="update_state">
After any action that changes todo count:

```bash
ls .gsd/todos/pending/*.md 2>/dev/null | wc -l
```

Update STATE.md "### Pending Todos" section if exists.
</step>

<step name="git_commit">
If todo was moved to done/, commit the change:

**Check planning config:**

```bash
COMMIT_PLANNING_DOCS=$(cat .gsd/config.json 2>/dev/null | grep -o '"commit_docs"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false' || echo "true")
git check-ignore -q .gsd 2>/dev/null && COMMIT_PLANNING_DOCS=false
```

**If `COMMIT_PLANNING_DOCS=false`:** Skip git operations, log "Todo moved (not committed - commit_docs: false)"

**If `COMMIT_PLANNING_DOCS=true` (default):**

```bash
git add .gsd/todos/done/[filename]
git rm --cached .gsd/todos/pending/[filename] 2>/dev/null || true
[ -f .gsd/STATE.md ] && git add .gsd/STATE.md
git commit -m "$(cat <<'EOF'
docs: start work on todo - [title]

Moved to done/, beginning implementation.
EOF
)"
```

Confirm: "Committed: docs: start work on todo - [title]"
</step>

</process>

<output>
- Moved todo to `.gsd/todos/done/` (if "Work on it now")
- Updated `.gsd/STATE.md` (if todo count changed)
</output>

<anti_patterns>

- Don't delete todos — move to done/ when work begins
- Don't start work without moving to done/ first
- Don't create plans from this command — route to /plan-phase.md or /add-phase.md
  </anti_patterns>

<success_criteria>

- [ ] All pending todos listed with title, area, age
- [ ] Area filter applied if specified
- [ ] Selected todo's full context loaded
- [ ] Roadmap context checked for phase match
- [ ] Appropriate actions offered
- [ ] Selected action executed
- [ ] STATE.md updated if todo count changed
- [ ] Changes committed to git (if todo moved to done/)
      </success_criteria>
