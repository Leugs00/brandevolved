---
name: plan-for-goal
description: Turn any brief into a structured plan ready to feed /goal, scoped to BrandEvolved's tier structure. Locked sections - Brief / Stack / Scope (Tier + Visuals + Functionality) / Out of Scope / Constraints / Definition of Done / Acceptance Criteria / Verification / Turn Budget / References / Risks. Engine-agnostic (Claude Code + Codex). Outputs a markdown plan file plus a paste-ready /goal one-liner. Triggers on "/plan-for-goal", "plan-for-goal", "plan for goal", "build me a /goal plan", "turn this into a plan".
---

# Plan for Goal (BrandEvolved)

Takes any brief - a feature, a content batch, a client deliverable, a refactor - and turns it into a structured plan you can feed straight into `/goal`. Adapted for the BrandEvolved monorepo (see root `CLAUDE.md`): four scoped areas (`executives/`, `edu/`, `agency/`, `brandtrue-saas/`), each with an owner role and tier-specific rules.

## What this does

Strips fluffy intent down to a single verifiable Definition of Done and the sub-checks that prove it. Locks scope (in + out + constraints), and pins the plan to one BrandEvolved tier so `/goal` doesn't wander across owner boundaries. Names the verification path explicitly. Sets a turn ceiling.

## When to invoke

- You have a brief and want to set it up for autonomous execution
- Before pasting work into `/goal`, `/loop`, or a long agent run
- Triggers: `/plan-for-goal`, `plan-for-goal`, `plan for goal`, `build me a /goal plan`, `turn this into a plan`

## Output format (LOCKED)

**Two things every run:**

1. A markdown file at `{tier}/plans/{slug}_{YYYY-MM-DD}.md` (see File operations below for tier mapping)
2. A copy-paste-ready `/goal` one-liner rendered inline in chat

Section order is locked. 9 core sections, 2 optional. Drop a section only when it's empty. Don't add new sections.

```markdown
# Plan · {Title}

## Brief
[1-2 sentences. Context + outcome. State the goal, not the steps.]

## Stack
- Tool, framework, API, or model that will be used
- One bullet each, name version when load-bearing
- Flag paid APIs that need cost approval

## Scope
**Tier**: {executives | edu | agency | brandtrue-saas} - **Owner**: {role from CLAUDE.md ownership table}

**Visuals**
- [Bullets describing what it looks like - only when the task is visual]

**Functionality**
- [Bullets describing what it does]

For non-visual tasks (refactor, content batch, ops), drop the Visuals sub-header and flatten to bullets under Scope.

## Out of Scope
- Other BrandEvolved tiers/directories not listed in Scope (always - this is the default first bullet)
- Explicit non-goals
- At least 2 bullets total - empty negative space is where /goal burns tokens

## Constraints
- Stay inside the named tier's directory unless the brief explicitly says otherwise
- Kebab-case for all new file and folder names
- Add a README.md to any new top-level folder created
- Never read, log, or surface `executives/finance/` contents unless the brief explicitly requires it
- Never commit `.env`
- What else must hold throughout the work - e.g. single file, no build step, no new deps, brand rules, perf budget

## Definition of Done
[One verifiable sentence. The whole plan funnels here. Phrased so a small evaluator can judge it from the transcript. No vibe words.]

## Acceptance Criteria
- Bulleted sub-checks flowing from DoD
- Each independently verifiable as true / false
- Aim for 5-10 bullets

## Verification
- Exact commands or visual checks /goal will run each turn to produce evidence
- Skip ONLY when DoD is already a literal runnable command

## Turn Budget
Stop after {N} turns, or sooner once the DoD condition holds.

## References
- Links, files, screenshots, prior art (optional - skip if empty)

## Risks / Open Questions
- Known failure modes, judgment calls flagged for the user (optional - skip if empty)
```

## The /goal one-liner

After saving the plan, emit a paste-ready /goal line shaped like:

```
/goal {DoD sentence}, with {top 2-3 acceptance criteria inline}, stop after {N} turns
```

Engine-agnostic. `stop after N turns` reads cleanly for both Claude Code and Codex evaluators.

## Section rules

**Brief** - 1-2 sentences. State the goal, not the steps. No verbs of doing ("we will build...").

**Stack** - bullet per tool. Name version when load-bearing (Node 20, Godot 4, Python 3.11). Flag any paid API (image gen, video gen, eval API) that triggers a cost-approval gate in your workflow.

**Scope** - Always open with the Tier + Owner line so the agent and the eventual `/goal` run know which directory and owner role this work belongs to. Visuals + Functionality sub-headers when the task is visual (game, UI, deck, site, animation, thumbnail batch). Flat bullets for backend / script / content work. Don't force the split.

**Out of Scope** - at least 2 bullets, always, and the first is always "other tiers/directories not listed in Scope". Most spiraling /goal runs come from undefined negative space. Common cuts: multiplayer, mobile, save-load, accessibility pass, internationalisation, expansions, advanced AI, work in any tier other than the one named in Scope.

**Constraints** - what must hold throughout. Different from Out of Scope - these are rules during the work, not boundaries of the work. The five BrandEvolved-wide rules (tier boundary, kebab-case, README-per-new-folder, finance confidentiality, never commit `.env`) are always present; add task-specific constraints below them.

**Definition of Done** - ONE sentence. Must be judgeable from the transcript. Avoid vibe words ("clean", "good", "polished", "great UX"). Use concrete proof: file exists at path X, command exits 0, count equals N, screenshot matches reference, all rows in table Y are filled.

**Acceptance Criteria** - 5-10 bullets. Each independently true/false. If a criterion is squishy, fix it now. Bad: "looks good on mobile". Good: "renders at 360px width with no horizontal scroll". If the brief creates any new top-level folder, include a bullet for "README.md exists in {new-folder}".

**Verification** - skip when DoD IS a runnable command (`npm test exits 0`). Include when DoD is a state ("game plays end-to-end with no errors") that needs a recipe to prove. Spell out the recipe step by step. This is where the agent's eyes go each turn.

**Turn Budget** - pick a number. Light task 15-25. Medium 30-50. Heavy 60-100. Don't go above 100 without a strong reason. The 500-turn Claude Code safety cap is not a budget.

**References / Risks** - only include when there's something real. Empty sections are noise. Risks should flag known failure modes and judgment calls worth surfacing before the run.

## Voice rules

- No em-dashes. Use `-` with spaces, or a comma
- Plain language, no marketing voice
- Bullets are short noun phrases or short imperatives, not paragraphs
- Match the brief's domain - game / content / code / ops. Don't reflexively use dev framing for content tasks.

## Ambiguity handling

If the brief is missing critical pieces (no clear DoD, no scope boundary, no tier, no verification path), ask ONE tight question before drafting. Common gaps:

- Tier unclear - ask "which area does this belong to: executives, edu, agency, or brandtrue-saas?"
- DoD vague - ask "what does done look like in one sentence?"
- Scope sprawling - ask "what's explicitly NOT in scope?"
- No verification path - ask "how will we know it works?"

One question max, then draft. Never ask for confirmation on minor details the user can redirect in their next turn.

## File operations

- Slug = lowercase, dashes, first 3-5 words of the brief
- Date = today's date, YYYY-MM-DD
- Plan path: `{tier}/plans/{slug}_{YYYY-MM-DD}.md`, where `{tier}` is `executives`, `edu`, `agency`, or `brandtrue-saas` (matches the Tier line in Scope). Create the `plans/` folder if missing - it's a subfolder of an existing tier, not a new top-level folder, so no extra README.md is required for it.
- For cross-tier work owned by the executive workspace, use `executives/plans/`
- Report the file path back to the user when done

## Anti-patterns

- Don't pad sections with filler. Empty section is fine, weak section is not.
- Don't add new sections beyond the locked set
- Don't write DoDs with vibe words ("clean", "polished", "great UX", "feels nice")
- Don't skip Out of Scope - it's load-bearing
- Don't promise external system interactions unless they were explicitly named in the brief
- Don't ask multiple clarifying questions - one or none
- Don't write the plan file to repo root - it always lives under a tier's `plans/` folder

## Reference example

See [`examples/edu-lead-magnet-landing.md`](examples/edu-lead-magnet-landing.md) for a complete worked example: a lead-magnet landing page in `edu/`.
