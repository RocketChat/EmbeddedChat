---
name: "gsd:plan-phase"
description: "Create detailed execution plan for a phase (PLAN.md) with verification loop"
agent: "📋 GSD Planner"
tools:
  [
    "readFile",
    "editFiles",
    "runInTerminal",
    "listDirectory",
    "textSearch",
    "runSubagent",
    "fetch",
  ]
---

<execution_context>
../instructions/ui-brand.instructions.md
</execution_context>

<objective>
Create executable phase prompts (PLAN.md files) for a roadmap phase with integrated research and verification.

**Default flow:** Research (if needed) → Plan → Verify → Done

**Orchestrator role:** Parse arguments, validate phase, research domain (unless skipped or exists), spawn gsd-planner agent, verify plans with gsd-plan-checker, iterate until plans pass or max iterations reached, present results.

**Why subagents:** Research and planning burn context fast. Verification uses fresh context. User sees the flow between agents in main context.
</objective>

<context>
Phase number: $ARGUMENTS (optional - auto-detects next unplanned phase if not provided)

**Flags:**

- `--research` — Force re-research even if RESEARCH.md exists
- `--skip-research` — Skip research entirely, go straight to planning
- `--gaps` — Gap closure mode (reads VERIFICATION.md, skips research)
- `--skip-verify` — Skip planner → checker verification loop

Normalize phase input in step 2 before any directory lookups.
</context>

<process>

## 1. Validate Environment and Resolve Model Profile

```bash
ls .gsd/ 2>/dev/null
```

**If not found:** Error - user should run `/new-project.md` first.

**Resolve model profile for agent spawning:**

```bash
MODEL_PROFILE=$(cat .gsd/config.json 2>/dev/null | grep -o '"model_profile"[[:space:]]*:[[:space:]]*"[^"]*"' | grep -o '"[^"]*"$' | tr -d '"' || echo "balanced")
```

Default to "balanced" if not set.

**Model lookup table:**

| Agent                | quality | balanced | budget |
| -------------------- | ------- | -------- | ------ |
| gsd-phase-researcher | opus    | sonnet   | haiku  |
| gsd-planner          | opus    | opus     | sonnet |
| gsd-plan-checker     | sonnet  | sonnet   | haiku  |

Store resolved models for use in Task calls below.

## 2. Parse and Normalize Arguments

Extract from $ARGUMENTS:

- Phase number (integer or decimal like `2.1`)
- `--research` flag to force re-research
- `--skip-research` flag to skip research
- `--gaps` flag for gap closure mode
- `--skip-verify` flag to bypass verification loop

**If no phase number:** Detect next unplanned phase from roadmap.

**Normalize phase to zero-padded format:**

```bash
# Normalize phase number (8 → 08, but preserve decimals like 2.1 → 02.1)
if [[ "$PHASE" =~ ^[0-9]+$ ]]; then
  PHASE=$(printf "%02d" "$PHASE")
elif [[ "$PHASE" =~ ^([0-9]+)\.([0-9]+)$ ]]; then
  PHASE=$(printf "%02d.%s" "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}")
fi
```

**Check for existing research and plans:**

```bash
ls .gsd/phases/${PHASE}-*/*-RESEARCH.md 2>/dev/null
ls .gsd/phases/${PHASE}-*/*-PLAN.md 2>/dev/null
```

## 3. Validate Phase

```bash
grep -A5 "Phase ${PHASE}:" .gsd/ROADMAP.md 2>/dev/null
```

**If not found:** Error with available phases. **If found:** Extract phase number, name, description.

## 4. Ensure Phase Directory Exists and Load CONTEXT.md

```bash
# PHASE is already normalized (08, 02.1, etc.) from step 2
PHASE_DIR=$(ls -d .gsd/phases/${PHASE}-* 2>/dev/null | head -1)
if [ -z "$PHASE_DIR" ]; then
  # Create phase directory from roadmap name
  PHASE_NAME=$(grep "Phase ${PHASE}:" .gsd/ROADMAP.md | sed 's/.*Phase [0-9]*: //' | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
  mkdir -p ".gsd/phases/${PHASE}-${PHASE_NAME}"
  PHASE_DIR=".gsd/phases/${PHASE}-${PHASE_NAME}"
fi

# Load CONTEXT.md immediately - this informs ALL downstream agents
CONTEXT_CONTENT=$(cat "${PHASE_DIR}"/*-CONTEXT.md 2>/dev/null)
```

**CRITICAL:** Store `CONTEXT_CONTENT` now. It must be passed to:

- **Researcher** — constrains what to research (locked decisions vs Copilot's discretion)
- **Planner** — locked decisions must be honored, not revisited
- **Checker** — verifies plans respect user's stated vision
- **Revision** — context for targeted fixes

If CONTEXT.md exists, display: `Using phase context from: ${PHASE_DIR}/*-CONTEXT.md`

## 5. Handle Research

**If `--gaps` flag:** Skip research (gap closure uses VERIFICATION.md instead).

**If `--skip-research` flag:** Skip to step 6.

**Check config for research setting:**

```bash
WORKFLOW_RESEARCH=$(cat .gsd/config.json 2>/dev/null | grep -o '"research"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false' || echo "true")
```

**If `workflow.research` is `false` AND `--research` flag NOT set:** Skip to step 6.

**Otherwise:**

Check for existing research:

```bash
ls "${PHASE_DIR}"/*-RESEARCH.md 2>/dev/null
```

**If RESEARCH.md exists AND `--research` flag NOT set:**

- Display: `Using existing research: ${PHASE_DIR}/${PHASE}-RESEARCH.md`
- Skip to step 6

**If RESEARCH.md missing OR `--research` flag set:**

Display stage banner:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► RESEARCHING PHASE {X}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ Spawning researcher...
```

Proceed to spawn researcher

### Spawn gsd-phase-researcher

Gather additional context for research prompt:

```bash
# Get phase description from roadmap
PHASE_DESC=$(grep -A3 "Phase ${PHASE}:" .gsd/ROADMAP.md)

# Get requirements if they exist
REQUIREMENTS=$(cat .gsd/REQUIREMENTS.md 2>/dev/null | grep -A100 "## Requirements" | head -50)

# Get prior decisions from STATE.md
DECISIONS=$(grep -A20 "### Decisions Made" .gsd/STATE.md 2>/dev/null)

# CONTEXT_CONTENT already loaded in step 4
```

Fill research prompt and spawn:

```markdown
<objective>
Research how to implement Phase {phase_number}: {phase_name}

Answer: "What do I need to know to PLAN this phase well?"
</objective>

<phase_context>
**IMPORTANT:** If CONTEXT.md exists below, it contains user decisions from /discuss-phase.md.

- **Decisions section** = Locked choices — research THESE deeply, don't explore alternatives
- **Copilot's Discretion section** = Your freedom areas — research options, make recommendations
- **Deferred Ideas section** = Out of scope — ignore completely

{context_content}
</phase_context>

<additional_context>
**Phase description:**
{phase_description}

**Requirements (if any):**
{requirements}

**Prior decisions from STATE.md:**
{decisions}
</additional_context>

<output>
Write research findings to: {phase_dir}/{phase}-RESEARCH.md
</output>
```

```
Task(
  prompt="First, read .github/agents/gsd-phase-researcher.agent.md for your role and instructions.\n\n" + research_prompt,
  subagent_type="general-purpose",
  model="{researcher_model}",
  description="Research Phase {phase}"
)
```

### Handle Researcher Return

**`## RESEARCH COMPLETE`:**

- Display: `Research complete. Proceeding to planning...`
- Continue to step 6

**`## RESEARCH BLOCKED`:**

- Display blocker information
- Offer: 1) Provide more context, 2) Skip research and plan anyway, 3) Abort
- Wait for user response

## 6. Check Existing Plans

```bash
ls "${PHASE_DIR}"/*-PLAN.md 2>/dev/null
```

**If exists:** Offer: 1) Continue planning (add more plans), 2) View existing, 3) Replan from scratch. Wait for response.

## 7. Read Context Files

Read and store context file contents for the planner agent. The `@` syntax does not work across Task() boundaries - content must be inlined.

```bash
# Read required files
STATE_CONTENT=$(cat .gsd/STATE.md)
ROADMAP_CONTENT=$(cat .gsd/ROADMAP.md)

# Read optional files (empty string if missing)
REQUIREMENTS_CONTENT=$(cat .gsd/REQUIREMENTS.md 2>/dev/null)
# CONTEXT_CONTENT already loaded in step 4
RESEARCH_CONTENT=$(cat "${PHASE_DIR}"/*-RESEARCH.md 2>/dev/null)

# Gap closure files (only if --gaps mode)
VERIFICATION_CONTENT=$(cat "${PHASE_DIR}"/*-VERIFICATION.md 2>/dev/null)
UAT_CONTENT=$(cat "${PHASE_DIR}"/*-UAT.md 2>/dev/null)
```

## 8. Spawn gsd-planner Agent

Display stage banner:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PLANNING PHASE {X}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ Spawning planner...
```

Fill prompt with inlined content and spawn:

```markdown
<planning_context>

**Phase:** {phase_number}
**Mode:** {standard | gap_closure}

**Project State:**
{state_content}

**Roadmap:**
{roadmap_content}

**Requirements (if exists):**
{requirements_content}

**Phase Context (if exists):**

IMPORTANT: If phase context exists below, it contains USER DECISIONS from /discuss-phase.md.

- **Decisions** = LOCKED — honor these exactly, do not revisit or suggest alternatives
- **Copilot's Discretion** = Your freedom — make implementation choices here
- **Deferred Ideas** = Out of scope — do NOT include in this phase

{context_content}

**Research (if exists):**
{research_content}

**Gap Closure (if --gaps mode):**
{verification_content}
{uat_content}

</planning_context>

<downstream_consumer>
Output consumed by /execute-phase.md
Plans must be executable prompts with:

- Frontmatter (wave, depends_on, files_modified, autonomous)
- Tasks in XML format
- Verification criteria
- must_haves for goal-backward verification
  </downstream_consumer>

<quality_gate>
Before returning PLANNING COMPLETE:

- [ ] PLAN.md files created in phase directory
- [ ] Each plan has valid frontmatter
- [ ] Tasks are specific and actionable
- [ ] Dependencies correctly identified
- [ ] Waves assigned for parallel execution
- [ ] must_haves derived from phase goal
      </quality_gate>
```

```
Task(
  prompt="First, read .github/agents/gsd-planner.agent.md for your role and instructions.\n\n" + filled_prompt,
  subagent_type="general-purpose",
  model="{planner_model}",
  description="Plan Phase {phase}"
)
```

## 9. Handle Planner Return

Parse planner output:

**`## PLANNING COMPLETE`:**

- Display: `Planner created {N} plan(s). Files on disk.`
- If `--skip-verify`: Skip to step 13
- Check config: `WORKFLOW_PLAN_CHECK=$(cat .gsd/config.json 2>/dev/null | grep -o '"plan_check"[[:space:]]*:[[:space:]]*[^,}]*' | grep -o 'true\|false' || echo "true")`
- If `workflow.plan_check` is `false`: Skip to step 13
- Otherwise: Proceed to step 10

**`## CHECKPOINT REACHED`:**

- Present to user, get response, spawn continuation (see step 12)

**`## PLANNING INCONCLUSIVE`:**

- Show what was attempted
- Offer: Add context, Retry, Manual
- Wait for user response

## 10. Spawn gsd-plan-checker Agent

Display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► VERIFYING PLANS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ Spawning plan checker...
```

Read plans for the checker:

```bash
# Read all plans in phase directory
PLANS_CONTENT=$(cat "${PHASE_DIR}"/*-PLAN.md 2>/dev/null)

# CONTEXT_CONTENT already loaded in step 4
# REQUIREMENTS_CONTENT already loaded in step 7
```

Fill checker prompt with inlined content and spawn:

```markdown
<verification_context>

**Phase:** {phase_number}
**Phase Goal:** {goal from ROADMAP}

**Plans to verify:**
{plans_content}

**Requirements (if exists):**
{requirements_content}

**Phase Context (if exists):**

IMPORTANT: If phase context exists below, it contains USER DECISIONS from /discuss-phase.md.
Plans MUST honor these decisions. Flag as issue if plans contradict user's stated vision.

- **Decisions** = LOCKED — plans must implement these exactly
- **Copilot's Discretion** = Freedom areas — plans can choose approach
- **Deferred Ideas** = Out of scope — plans must NOT include these

{context_content}

</verification_context>

<expected_output>
Return one of:

- ## VERIFICATION PASSED — all checks pass
- ## ISSUES FOUND — structured issue list
  </expected_output>
```

```
Task(
  prompt=checker_prompt,
  subagent_type="gsd-plan-checker",
  model="{checker_model}",
  description="Verify Phase {phase} plans"
)
```

## 11. Handle Checker Return

**If `## VERIFICATION PASSED`:**

- Display: `Plans verified. Ready for execution.`
- Proceed to step 13

**If `## ISSUES FOUND`:**

- Display: `Checker found issues:`
- List issues from checker output
- Check iteration count
- Proceed to step 12

## 12. Revision Loop (Max 3 Iterations)

Track: `iteration_count` (starts at 1 after initial plan + check)

**If iteration_count < 3:**

Display: `Sending back to planner for revision... (iteration {N}/3)`

Read current plans for revision context:

```bash
PLANS_CONTENT=$(cat "${PHASE_DIR}"/*-PLAN.md 2>/dev/null)
# CONTEXT_CONTENT already loaded in step 4
```

Spawn gsd-planner with revision prompt:

```markdown
<revision_context>

**Phase:** {phase_number}
**Mode:** revision

**Existing plans:**
{plans_content}

**Checker issues:**
{structured_issues_from_checker}

**Phase Context (if exists):**

IMPORTANT: If phase context exists, revisions MUST still honor user decisions.

{context_content}

</revision_context>

<instructions>
Make targeted updates to address checker issues.
Do NOT replan from scratch unless issues are fundamental.
Revisions must still honor all locked decisions from Phase Context.
Return what changed.
</instructions>
```

```
Task(
  prompt="First, read .github/agents/gsd-planner.agent.md for your role and instructions.\n\n" + revision_prompt,
  subagent_type="general-purpose",
  model="{planner_model}",
  description="Revise Phase {phase} plans"
)
```

- After planner returns → spawn checker again (step 10)
- Increment iteration_count

**If iteration_count >= 3:**

Display: `Max iterations reached. {N} issues remain:`

- List remaining issues

Offer options:

1. Force proceed (execute despite issues)
2. Provide guidance (user gives direction, retry)
3. Abandon (exit planning)

Wait for user response.

## 13. Present Final Status

Route to `<offer_next>`.

</process>

<offer_next>
Output this markdown directly (not as a code block):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GSD ► PHASE {X} PLANNED ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Phase {X}: {Name}** — {N} plan(s) in {M} wave(s)

| Wave | Plans  | What it builds |
| ---- | ------ | -------------- |
| 1    | 01, 02 | [objectives]   |
| 2    | 03     | [objective]    |

Research: {Completed | Used existing | Skipped}
Verification: {Passed | Passed with override | Skipped}

───────────────────────────────────────────────────────────────

## ▶ Next Up

**Execute Phase {X}** — run all {N} plans

/execute-phase.md {X}

<sub>/clear first → fresh context window</sub>

───────────────────────────────────────────────────────────────

**Also available:**

- cat .gsd/phases/{phase-dir}/\*-PLAN.md — review plans
- /plan-phase.md {X} --research — re-research first

───────────────────────────────────────────────────────────────
</offer_next>

<success_criteria>

- [ ] .gsd/ directory validated
- [ ] Phase validated against roadmap
- [ ] Phase directory created if needed
- [ ] CONTEXT.md loaded early (step 4) and passed to ALL agents
- [ ] Research completed (unless --skip-research or --gaps or exists)
- [ ] gsd-phase-researcher spawned with CONTEXT.md (constrains research scope)
- [ ] Existing plans checked
- [ ] gsd-planner spawned with context (CONTEXT.md + RESEARCH.md)
- [ ] Plans created (PLANNING COMPLETE or CHECKPOINT handled)
- [ ] gsd-plan-checker spawned with CONTEXT.md (verifies context compliance)
- [ ] Verification passed OR user override OR max iterations with user decision
- [ ] User sees status between agent spawns
- [ ] User knows next steps (execute or review)
      </success_criteria>
