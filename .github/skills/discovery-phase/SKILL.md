---
name: discovery-phase
description: Execute discovery at the appropriate depth level. Produces DISCOVERY.md that informs PLAN.md creation. Supports quick verify, standard, and deep dive depths.
---

<purpose>
Execute discovery at the appropriate depth level.
Produces DISCOVERY.md (for Level 2-3) that informs PLAN.md creation.

Called from plan-phase.md's mandatory_discovery step with a depth parameter.

NOTE: For comprehensive ecosystem research ("how do experts build this"), use /research-phase.md instead, which produces RESEARCH.md.
</purpose>

<depth_levels>
**This workflow supports three depth levels:**

| Level | Name         | Time      | Output                                      | When                                      |
| ----- | ------------ | --------- | ------------------------------------------- | ----------------------------------------- |
| 1     | Quick Verify | 2-5 min   | No file, proceed with verified knowledge    | Single library, confirming current syntax |
| 2     | Standard     | 15-30 min | DISCOVERY.md                                | Choosing between options, new integration |
| 3     | Deep Dive    | 1+ hour   | Detailed DISCOVERY.md with validation gates | Architectural decisions, novel problems   |

**Depth is determined by plan-phase.md before routing here.**
</depth_levels>

<source_hierarchy>
**MANDATORY: Context7 BEFORE Web Search**

Copilot's training data is 6-18 months stale. Always verify.

**Priority Order:**

1. **Context7 MCP FIRST** - Use `use_mcp_tool(context7, ...)` for current library/framework docs
2. **Copilot `fetch` (built-in)** - Use for web search and fetching URLs (no MCP needed)
3. **Exa / Brave Search MCP** - Optional, for deep research when `fetch` insufficient:
   - **Exa MCP** - `use_mcp_tool(exa, web_search_exa)` — AI-native semantic search, code search, company research
   - **Brave Search** - `use_mcp_tool(brave-search, brave_web_search)` — Privacy-first, general queries, news

**Why this order:**

- Context7 has authoritative, current library documentation
- Copilot's `fetch` is built-in and requires no MCP setup
- Exa/Brave are external MCP servers (optional for users who install them)

**Exa Tools (if installed):**

- `web_search_exa` — Search web for any topic, get clean content
- `get_code_context_exa` — Find code from GitHub, Stack Overflow, docs
- `company_research_exa` — Research companies
- `deep_search_exa` — Deep research with query expansion

See ~/.gsd/templates/discovery.md `<discovery_protocol>` for full protocol.
</source_hierarchy>

<process>

<step name="determine_depth">
Check the depth parameter passed from plan-phase.md:
- `depth=verify` → Level 1 (Quick Verification)
- `depth=standard` → Level 2 (Standard Discovery)
- `depth=deep` → Level 3 (Deep Dive)

Route to appropriate level workflow below.
</step>

<step name="level_1_quick_verify">
**Level 1: Quick Verification (2-5 minutes)**

For: Single known library, confirming syntax/version still correct.

**Process:**

1. Resolve library in Context7:

   ```
   use_mcp_tool with server: "context7", tool: "resolve-library-id", arguments: { "libraryName": "[library]" }
   ```

2. Fetch relevant docs:

   ```
   use_mcp_tool with server: "context7", tool: "query-docs", arguments: {
     "libraryId": "[from step 1]",
     "query": "[specific concern]"
   }
   ```

3. Verify:
   - Current version matches expectations
   - API syntax unchanged
   - No breaking changes in recent versions

4. **If verified:** Return to plan-phase.md with confirmation. No DISCOVERY.md needed.

5. **If concerns found:** Escalate to Level 2.

**Output:** Verbal confirmation to proceed, or escalation to Level 2.
</step>

<step name="level_2_standard">
**Level 2: Standard Discovery (15-30 minutes)**

For: Choosing between options, new external integration.

**Process:**

1. **Identify what to discover:**
   - What options exist?
   - What are the key comparison criteria?
   - What's our specific use case?

2. **Context7 for each option:**

   ```
   For each library/framework:
   - use_mcp_tool(context7, resolve-library-id)
   - use_mcp_tool(context7, query-docs) for API and concepts
   ```

3. **Official docs** for anything Context7 lacks (use `fetch` or browser_action).

4. **Web search** for comparisons:
   - "[option A] vs [option B] {current_year}"
   - "[option] known issues"
   - "[option] with [our stack]"
   - Use Copilot's built-in `fetch` tool first
   - If more depth needed and MCP installed:
     - `use_mcp_tool(exa, web_search_exa)` — Best for semantic/conceptual queries
     - `use_mcp_tool(exa, get_code_context_exa)` — Best for code examples
     - `use_mcp_tool(brave-search, brave_web_search)` — Best for news, general queries

5. **Cross-verify:** Any Web Search finding → confirm with Context7/official docs.

6. **Create DISCOVERY.md** using ~/.gsd/templates/discovery.md structure:
   - Summary with recommendation
   - Key findings per option
   - Code examples from Context7
   - Confidence level (should be MEDIUM-HIGH for Level 2)

7. Return to plan-phase.md.

**Output:** `.gsd/phases/XX-name/DISCOVERY.md`
</step>

<step name="level_3_deep_dive">
**Level 3: Deep Dive (1+ hour)**

For: Architectural decisions, novel problems, high-risk choices.

**Process:**

1. **Scope the discovery** using ~/.gsd/templates/discovery.md:
   - Define clear scope
   - Define include/exclude boundaries
   - List specific questions to answer

2. **Exhaustive Context7 research:**
   - All relevant libraries
   - Related patterns and concepts
   - Multiple topics per library if needed

3. **Official documentation deep read:**
   - Architecture guides
   - Best practices sections
   - Migration/upgrade guides
   - Known limitations

4. **Web search for ecosystem context:**
   - How others solved similar problems
   - Production experiences
   - Gotchas and anti-patterns
   - Recent changes/announcements
   - Use Copilot's built-in `fetch` tool first
   - If more depth needed and MCP installed:
     - `use_mcp_tool(exa, deep_search_exa)` — Thorough research with query expansion
     - `use_mcp_tool(exa, company_research_exa)` — When researching vendors/companies
     - `use_mcp_tool(brave-search, brave_web_search)` — News, general queries

5. **Cross-verify ALL findings:**
   - Every Web Search claim → verify with authoritative source
   - Mark what's verified vs assumed
   - Flag contradictions

6. **Create comprehensive DISCOVERY.md:**
   - Full structure from ~/.gsd/templates/discovery.md
   - Quality report with source attribution
   - Confidence by finding
   - If LOW confidence on any critical finding → add validation checkpoints

7. **Confidence gate:** If overall confidence is LOW, present options before proceeding.

8. Return to plan-phase.md.

**Output:** `.gsd/phases/XX-name/DISCOVERY.md` (comprehensive)
</step>

<step name="identify_unknowns">
**For Level 2-3:** Define what we need to learn.

Ask: What do we need to learn before we can plan this phase?

- Technology choices?
- Best practices?
- API patterns?
- Architecture approach?
  </step>

<step name="create_discovery_scope">
Use ~/.gsd/templates/discovery.md.

Include:

- Clear discovery objective
- Scoped include/exclude lists
- Source preferences (official docs, Context7, current year)
- Output structure for DISCOVERY.md
  </step>

<step name="execute_discovery">
Run the discovery:
- Use web search for current info
- Use Context7 MCP for library docs
- Prefer current year sources
- Structure findings per template
</step>

<step name="create_discovery_output">
Write `.gsd/phases/XX-name/DISCOVERY.md`:
- Summary with recommendation
- Key findings with sources
- Code examples if applicable
- Metadata (confidence, dependencies, open questions, assumptions)
</step>

<step name="confidence_gate">
After creating DISCOVERY.md, check confidence level.

If confidence is LOW:
Use HumanAgent MCP (HumanAgent_Chat):

- header: "Low Confidence"
- question: "Discovery confidence is LOW: [reason]. How would you like to proceed?"
- options:
  - "Dig deeper" - Do more research before planning
  - "Proceed anyway" - Accept uncertainty, plan with caveats
  - "Pause" - I need to think about this

If confidence is MEDIUM:
Inline: "Discovery complete (medium confidence). [brief reason]. Proceed to planning?"

If confidence is HIGH:
Proceed directly, just note: "Discovery complete (high confidence)."
</step>

<step name="open_questions_gate">
If DISCOVERY.md has open_questions:

Present them inline:
"Open questions from discovery:

- [Question 1]
- [Question 2]

These may affect implementation. Acknowledge and proceed? (yes / address first)"

If "address first": Gather user input on questions, update discovery.
</step>

<step name="offer_next">
```
Discovery complete: .gsd/phases/XX-name/DISCOVERY.md
Recommendation: [one-liner]
Confidence: [level]

What's next?

1. Discuss phase context (/discuss-phase.md [current-phase])
2. Create phase plan (/plan-phase.md [current-phase])
3. Refine discovery (dig deeper)
4. Review discovery

```

NOTE: DISCOVERY.md is NOT committed separately. It will be committed with phase completion.
</step>

</process>

<success_criteria>
**Level 1 (Quick Verify):**
- Context7 consulted via use_mcp_tool for library/topic
- Current state verified or concerns escalated
- Verbal confirmation to proceed (no files)

**Level 2 (Standard):**
- Context7 consulted for all options
- Web Search findings cross-verified
- DISCOVERY.md created with recommendation
- Confidence level MEDIUM or higher
- Ready to inform PLAN.md creation

**Level 3 (Deep Dive):**
- Discovery scope defined
- Context7 exhaustively consulted
- All Web Search findings verified against authoritative sources
- DISCOVERY.md created with comprehensive analysis
- Quality report with source attribution
- If LOW confidence findings → validation checkpoints defined
- Confidence gate passed
- Ready to inform PLAN.md creation
</success_criteria>
```
