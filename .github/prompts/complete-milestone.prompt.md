---
name: "gsd:complete-milestone"
description: "Archive completed milestone and prepare for next version"
tools: ["readFile", "editFiles", "runInTerminal"]
---

<objective>
Mark milestone {{version}} complete, archive to milestones/, and update ROADMAP.md and REQUIREMENTS.md.

Purpose: Create historical record of shipped version, archive milestone artifacts (roadmap + requirements), and prepare for next milestone.
Output: Milestone archived (roadmap + requirements), PROJECT.md evolved, git tagged.
</objective>

<execution_context>
**Load these files NOW (before proceeding):**

- ../skills/complete-milestone/SKILL.md (main workflow)
- @.gsd/templates/milestone-archive.md (archive template)
  </execution_context>

<context>
**Project files:**
- `.gsd/ROADMAP.md`
- `.gsd/REQUIREMENTS.md`
- `.gsd/STATE.md`
- `.gsd/PROJECT.md`

**User input:**

- Version: {{version}} (e.g., "1.0", "1.1", "2.0")
  </context>

<process>

**Follow complete-milestone.md workflow:**

0. **Check for audit:**
   - Look for `.gsd/v{{version}}-MILESTONE-AUDIT.md`
   - If missing or stale: recommend `/audit-milestone.md` first
   - If audit status is `gaps_found`: recommend `/plan-milestone-gaps.md` first
   - If audit status is `passed`: proceed to step 1

   ```markdown
   ## Pre-flight Check

   {If no v{{version}}-MILESTONE-AUDIT.md:}
   ⚠ No milestone audit found. Run `/audit-milestone.md` first to verify
   requirements coverage, cross-phase integration, and E2E flows.

   {If audit has gaps:}
   ⚠ Milestone audit found gaps. Run `/plan-milestone-gaps.md` to create
   phases that close the gaps, or proceed anyway to accept as tech debt.

   {If audit passed:}
   ✓ Milestone audit passed. Proceeding with completion.
   ```

1. **Verify readiness:**
   - Check all phases in milestone have completed plans (SUMMARY.md exists)
   - Present milestone scope and stats
   - Wait for confirmation

2. **Gather stats:**
   - Count phases, plans, tasks
   - Calculate git range, file changes, LOC
   - Extract timeline from git log
   - Present summary, confirm

3. **Extract accomplishments:**
   - Read all phase SUMMARY.md files in milestone range
   - Extract 4-6 key accomplishments
   - Present for approval

4. **Archive milestone:**
   - Create `.gsd/milestones/v{{version}}-ROADMAP.md`
   - Extract full phase details from ROADMAP.md
   - Fill milestone-archive.md template
   - Update ROADMAP.md to one-line summary with link

5. **Archive requirements:**
   - Create `.gsd/milestones/v{{version}}-REQUIREMENTS.md`
   - Mark all v1 requirements as complete (checkboxes checked)
   - Note requirement outcomes (validated, adjusted, dropped)
   - Delete `.gsd/REQUIREMENTS.md` (fresh one created for next milestone)

6. **Update PROJECT.md:**
   - Add "Current State" section with shipped version
   - Add "Next Milestone Goals" section
   - Archive previous content in `<details>` (if v1.1+)

7. **Commit and tag:**
   - Stage: MILESTONES.md, PROJECT.md, ROADMAP.md, STATE.md, archive files
   - Commit: `chore: archive v{{version}} milestone`
   - Tag: `git tag -a v{{version}} -m "[milestone summary]"`
   - Ask about pushing tag

8. **Offer next steps:**
   - `/new-milestone.md` — start next milestone (questioning → research → requirements → roadmap)

</process>

<success_criteria>

- Milestone archived to `.gsd/milestones/v{{version}}-ROADMAP.md`
- Requirements archived to `.gsd/milestones/v{{version}}-REQUIREMENTS.md`
- `.gsd/REQUIREMENTS.md` deleted (fresh for next milestone)
- ROADMAP.md collapsed to one-line entry
- PROJECT.md updated with current state
- Git tag v{{version}} created
- Commit successful
- User knows next steps (including need for fresh requirements)
  </success_criteria>

<critical_rules>

- **Load workflow first:** Read complete-milestone.md before executing
- **Verify completion:** All phases must have SUMMARY.md files
- **User confirmation:** Wait for approval at verification gates
- **Archive before deleting:** Always create archive files before updating/deleting originals
- **One-line summary:** Collapsed milestone in ROADMAP.md should be single line with link
- **Context efficiency:** Archive keeps ROADMAP.md and REQUIREMENTS.md constant size per milestone
- **Fresh requirements:** Next milestone starts with `/new-milestone.md` which includes requirements definition
  </critical_rules>
