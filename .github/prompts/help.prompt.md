---
name: "gsd:help"
description: "Show available GSD commands and usage guide"
---

<objective>
Display the complete GSD command reference.

Output ONLY the reference content below. Do NOT add:

- Project-specific analysis
- Git status or file context
- Next-step suggestions
- Any commentary beyond the reference
  </objective>

<reference>
# GSD Command Reference

**GSD** (Get Stuff Done) creates hierarchical project plans optimized for solo agentic development with Copilot Code.

## Quick Start

1. `/new-project.md` - Initialize project (includes research, requirements, roadmap)
2. `/plan-phase.md 1` - Create detailed plan for first phase
3. `/execute-phase.md 1` - Execute the phase

## Staying Updated

GSD evolves fast. Update periodically:

```bash
npx get-stuff-done-cc@latest
```

## Core Workflow

```
/new-project.md → /plan-phase.md → /execute-phase.md → repeat
```

### Project Initialization

**`/new-project.md`**
Initialize new project through unified flow.

One command takes you from idea to ready-for-planning:

- Deep questioning to understand what you're building
- Optional domain research (spawns 4 parallel researcher agents)
- Requirements definition with v1/v2/out-of-scope scoping
- Roadmap creation with phase breakdown and success criteria

Creates all `.gsd/` artifacts:

- `PROJECT.md` — vision and requirements
- `config.json` — workflow mode (interactive/yolo)
- `research/` — domain research (if selected)
- `REQUIREMENTS.md` — scoped requirements with REQ-IDs
- `ROADMAP.md` — phases mapped to requirements
- `STATE.md` — project memory

Usage: `/new-project.md`

**`/map-codebase.md`**
Map an existing codebase for brownfield projects.

- Analyzes codebase with parallel Explore agents
- Creates `.gsd/codebase/` with 7 focused documents
- Covers stack, architecture, structure, conventions, testing, integrations, concerns
- Use before `/new-project.md` on existing codebases

Usage: `/map-codebase.md`

### Phase Planning

**`/discuss-phase.md <number>`**
Help articulate your vision for a phase before planning.

- Captures how you imagine this phase working
- Creates CONTEXT.md with your vision, essentials, and boundaries
- Use when you have ideas about how something should look/feel

Usage: `/discuss-phase.md 2`

**`/research-phase.md <number>`**
Comprehensive ecosystem research for niche/complex domains.

- Discovers standard stack, architecture patterns, pitfalls
- Creates RESEARCH.md with "how experts build this" knowledge
- Use for 3D, games, audio, shaders, ML, and other specialized domains
- Goes beyond "which library" to ecosystem knowledge

Usage: `/research-phase.md 3`

**`/list-phase-assumptions.md <number>`**
See what Copilot is planning to do before it starts.

- Shows Copilot's intended approach for a phase
- Lets you course-correct if Copilot misunderstood your vision
- No files created - conversational output only

Usage: `/list-phase-assumptions.md 3`

**`/plan-phase.md <number>`**
Create detailed execution plan for a specific phase.

- Generates `.gsd/phases/XX-phase-name/XX-YY-PLAN.md`
- Breaks phase into concrete, actionable tasks
- Includes verification criteria and success measures
- Multiple plans per phase supported (XX-01, XX-02, etc.)

Usage: `/plan-phase.md 1`
Result: Creates `.gsd/phases/01-foundation/01-01-PLAN.md`

### Execution

**`/execute-phase.md <phase-number>`**
Execute all plans in a phase.

- Groups plans by wave (from frontmatter), executes waves sequentially
- Plans within each wave run in parallel via Task tool
- Verifies phase goal after all plans complete
- Updates REQUIREMENTS.md, ROADMAP.md, STATE.md

Usage: `/execute-phase.md 5`

### Quick Mode

**`/quick.md`**
Execute small, ad-hoc tasks with GSD guarantees but skip optional agents.

Quick mode uses the same system with a shorter path:

- Spawns planner + executor (skips researcher, checker, verifier)
- Quick tasks live in `.gsd/quick/` separate from planned phases
- Updates STATE.md tracking (not ROADMAP.md)

Use when you know exactly what to do and the task is small enough to not need research or verification.

Usage: `/quick.md`
Result: Creates `.gsd/quick/NNN-slug/PLAN.md`, `.gsd/quick/NNN-slug/SUMMARY.md`

### Roadmap Management

**`/add-phase.md <description>`**
Add new phase to end of current milestone.

- Appends to ROADMAP.md
- Uses next sequential number
- Updates phase directory structure

Usage: `/add-phase.md "Add admin dashboard"`

**`/insert-phase.md <after> <description>`**
Insert urgent work as decimal phase between existing phases.

- Creates intermediate phase (e.g., 7.1 between 7 and 8)
- Useful for discovered work that must happen mid-milestone
- Maintains phase ordering

Usage: `/insert-phase.md 7 "Fix critical auth bug"`
Result: Creates Phase 7.1

**`/remove-phase.md <number>`**
Remove a future phase and renumber subsequent phases.

- Deletes phase directory and all references
- Renumbers all subsequent phases to close the gap
- Only works on future (unstarted) phases
- Git commit preserves historical record

Usage: `/remove-phase.md 17`
Result: Phase 17 deleted, phases 18-20 become 17-19

### Milestone Management

**`/new-milestone.md <name>`**
Start a new milestone through unified flow.

- Deep questioning to understand what you're building next
- Optional domain research (spawns 4 parallel researcher agents)
- Requirements definition with scoping
- Roadmap creation with phase breakdown

Mirrors `/new-project.md` flow for brownfield projects (existing PROJECT.md).

Usage: `/new-milestone.md "v2.0 Features"`

**`/complete-milestone.md <version>`**
Archive completed milestone and prepare for next version.

- Creates MILESTONES.md entry with stats
- Archives full details to milestones/ directory
- Creates git tag for the release
- Prepares workspace for next version

Usage: `/complete-milestone.md 1.0.0`

### Progress Tracking

**`/progress.md`**
Check project status and intelligently route to next action.

- Shows visual progress bar and completion percentage
- Summarizes recent work from SUMMARY files
- Displays current position and what's next
- Lists key decisions and open issues
- Offers to execute next plan or create it if missing
- Detects 100% milestone completion

Usage: `/progress.md`

### Session Management

**`/resume-work.md`**
Resume work from previous session with full context restoration.

- Reads STATE.md for project context
- Shows current position and recent progress
- Offers next actions based on project state

Usage: `/resume-work.md`

**`/pause-work.md`**
Create context handoff when pausing work mid-phase.

- Creates .continue-here file with current state
- Updates STATE.md session continuity section
- Captures in-progress work context

Usage: `/pause-work.md`

### Debugging

**`/debug.md [issue description]`**
Systematic debugging with persistent state across context resets.

- Gathers symptoms through adaptive questioning
- Creates `.gsd/debug/[slug].md` to track investigation
- Investigates using scientific method (evidence → hypothesis → test)
- Survives `/clear` — run `/debug.md` with no args to resume
- Archives resolved issues to `.gsd/debug/resolved/`

Usage: `/debug.md "login button doesn't work"`
Usage: `/debug.md` (resume active session)

### Todo Management

**`/add-todo.md [description]`**
Capture idea or task as todo from current conversation.

- Extracts context from conversation (or uses provided description)
- Creates structured todo file in `.gsd/todos/pending/`
- Infers area from file paths for grouping
- Checks for duplicates before creating
- Updates STATE.md todo count

Usage: `/add-todo.md` (infers from conversation)
Usage: `/add-todo.md Add auth token refresh`

**`/check-todos.md [area]`**
List pending todos and select one to work on.

- Lists all pending todos with title, area, age
- Optional area filter (e.g., `/check-todos.md api`)
- Loads full context for selected todo
- Routes to appropriate action (work now, add to phase, brainstorm)
- Moves todo to done/ when work begins

Usage: `/check-todos.md`
Usage: `/check-todos.md api`

### User Acceptance Testing

**`/verify-work.md [phase]`**
Validate built features through conversational UAT.

- Extracts testable deliverables from SUMMARY.md files
- Presents tests one at a time (yes/no responses)
- Automatically diagnoses failures and creates fix plans
- Ready for re-execution if issues found

Usage: `/verify-work.md 3`

### Milestone Auditing

**`/audit-milestone.md [version]`**
Audit milestone completion against original intent.

- Reads all phase VERIFICATION.md files
- Checks requirements coverage
- Spawns integration checker for cross-phase wiring
- Creates MILESTONE-AUDIT.md with gaps and tech debt

Usage: `/audit-milestone.md`

**`/plan-milestone-gaps.md`**
Create phases to close gaps identified by audit.

- Reads MILESTONE-AUDIT.md and groups gaps into phases
- Prioritizes by requirement priority (must/should/nice)
- Adds gap closure phases to ROADMAP.md
- Ready for `/plan-phase.md` on new phases

Usage: `/plan-milestone-gaps.md`

### Configuration

**`/settings.md`**
Configure workflow toggles and model profile interactively.

- Toggle researcher, plan checker, verifier agents
- Select model profile (quality/balanced/budget)
- Updates `.gsd/config.json`

Usage: `/settings.md`

**`/set-profile.md <profile>`**
Quick switch model profile for GSD agents.

- `quality` — Opus everywhere except verification
- `balanced` — Opus for planning, Sonnet for execution (default)
- `budget` — Sonnet for writing, Haiku for research/verification

Usage: `/set-profile.md budget`

### Utility Commands

**`/help.md`**
Show this command reference.

**`/update.md`**
Update GSD to latest version with changelog preview.

- Shows installed vs latest version comparison
- Displays changelog entries for versions you've missed
- Highlights breaking changes
- Confirms before running install
- Better than raw `npx get-stuff-done-cc`

Usage: `/update.md`

**`/join-discord.md`**
Join the GSD Discord community.

- Get help, share what you're building, stay updated
- Connect with other GSD users

Usage: `/join-discord.md`

## Files & Structure

```
.gsd/
├── PROJECT.md            # Project vision
├── ROADMAP.md            # Current phase breakdown
├── STATE.md              # Project memory & context
├── config.json           # Workflow mode & gates
├── todos/                # Captured ideas and tasks
│   ├── pending/          # Todos waiting to be worked on
│   └── done/             # Completed todos
├── debug/                # Active debug sessions
│   └── resolved/         # Archived resolved issues
├── codebase/             # Codebase map (brownfield projects)
│   ├── STACK.md          # Languages, frameworks, dependencies
│   ├── ARCHITECTURE.md   # Patterns, layers, data flow
│   ├── STRUCTURE.md      # Directory layout, key files
│   ├── CONVENTIONS.md    # Coding standards, naming
│   ├── TESTING.md        # Test setup, patterns
│   ├── INTEGRATIONS.md   # External services, APIs
│   └── CONCERNS.md       # Tech debt, known issues
└── phases/
    ├── 01-foundation/
    │   ├── 01-01-PLAN.md
    │   └── 01-01-SUMMARY.md
    └── 02-core-features/
        ├── 02-01-PLAN.md
        └── 02-01-SUMMARY.md
```

## Workflow Modes

Set during `/new-project.md`:

**Interactive Mode**

- Confirms each major decision
- Pauses at checkpoints for approval
- More guidance throughout

**YOLO Mode**

- Auto-approves most decisions
- Executes plans without confirmation
- Only stops for critical checkpoints

Change anytime by editing `.gsd/config.json`

## Planning Configuration

Configure how planning artifacts are managed in `.gsd/config.json`:

**`planning.commit_docs`** (default: `true`)

- `true`: Planning artifacts committed to git (standard workflow)
- `false`: Planning artifacts kept local-only, not committed

When `commit_docs: false`:

- Add `.gsd/` to your `.gitignore`
- Useful for OSS contributions, client projects, or keeping planning private
- All planning files still work normally, just not tracked in git

**`planning.search_gitignored`** (default: `false`)

- `true`: Add `--no-ignore` to broad ripgrep searches
- Only needed when `.gsd/` is gitignored and you want project-wide searches to include it

Example config:

```json
{
  "planning": {
    "commit_docs": false,
    "search_gitignored": true
  }
}
```

## Common Workflows

**Starting a new project:**

```
/new-project.md        # Unified flow: questioning → research → requirements → roadmap
/clear
/plan-phase.md 1       # Create plans for first phase
/clear
/execute-phase.md 1    # Execute all plans in phase
```

**Resuming work after a break:**

```
/progress.md  # See where you left off and continue
```

**Adding urgent mid-milestone work:**

```
/insert-phase.md 5 "Critical security fix"
/plan-phase.md 5.1
/execute-phase.md 5.1
```

**Completing a milestone:**

```
/complete-milestone.md 1.0.0
/clear
/new-milestone.md  # Start next milestone (questioning → research → requirements → roadmap)
```

**Capturing ideas during work:**

```
/add-todo.md                    # Capture from conversation context
/add-todo.md Fix modal z-index  # Capture with explicit description
/check-todos.md                 # Review and work on todos
/check-todos.md api             # Filter by area
```

**Debugging an issue:**

```
/debug.md "form submission fails silently"  # Start debug session
# ... investigation happens, context fills up ...
/clear
/debug.md                                    # Resume from where you left off
```

## Getting Help

- Read `.gsd/PROJECT.md` for project vision
- Read `.gsd/STATE.md` for current context
- Check `.gsd/ROADMAP.md` for phase status
- Run `/progress.md` to check where you're up to
  </reference>
