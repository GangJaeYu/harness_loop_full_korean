# harness-loop-fullstack-kor

**Korean agent skills for Claude Code & Codex that take a project from requirements to a verified implementation, autonomously, within limits you agree on up front.**

([한국어](README.md)) — The skills and generated documents are written in Korean.

[![version](https://img.shields.io/badge/version-2.1.0-blue)](CHANGELOG.md)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## What it does

Starting from "I want to build this app", the agent writes requirement, technology and design documents, splits the work, sets up verification, and then **keeps implementing, verifying and recovering until the acceptance criteria actually pass.**
You shape the idea, requirements and tech choices with the agent through questions and options, decide the goal, permissions and budget before it starts (and pick the visual design for UI products). Once the loop starts, it runs to the end without asking questions.

- **Completion is proven, not claimed.** Ordered gates `lint → unit → e2e → task_validation`; the last one is run by a separate session that did not write the code.
- **Questions come first, once.** Goal, permissions, budget, prohibitions, default models and what to do on usage limits are agreed before the loop.
- **When stuck, it changes strategy instead of waiting for a human.** After at most three attempts of the same kind of fix, it analyzes and tries a different approach. If it still can't finish, it reports an honest incomplete result with evidence.
- **Independent work runs in parallel.** The agent chooses the number of workers; with Orca it uses worktree workers.

## What changed in 2.0

1.x grew by adding a rule or exception every time a real project hit a problem. The instructions reached 9,699 lines, and the agent spent its effort following procedure instead of judging the situation.
2.0 follows current guidance for writing agent skills and prompts: keep instructions short, state the goal and the hard constraints, and leave the method to the model. It fixes only the overall flow and what must not be broken (gate order, independent validation, up-front agreement).

- Instructions: 9,699 → 1,603 lines (about 83% smaller). In side-by-side runs of the same task it finished faster and used far fewer tokens.
- The plugin was renamed from `harness-loop-fullstack` to `harness-loop-fullstack-kor`.

Agent tooling and models change quickly. This plugin will keep being updated as they do, generally moving toward fewer instructions and more autonomy.

## Install

```text
# Claude Code
/plugin marketplace add GangJaeYu/harness_loop_full_korean
/plugin install harness-loop-fullstack-kor@harness-loop-fullstack-kor
```

```bash
# Codex
codex plugin marketplace add GangJaeYu/harness_loop_full_korean
codex plugin add harness-loop-fullstack-kor@harness-loop-fullstack-kor
```

Pin a version with `GangJaeYu/harness_loop_full_korean@v2.1.0`. Upgrading from 1.x: see [Getting started](docs/getting-started.md#1x에서-옮기기) (Korean).

To call a skill explicitly: `/harness-loop-fullstack-kor:prd-generator ...` (Claude Code) or `$prd-generator ...` (Codex).

## Skills

`idea-brainstorm` → `prd-generator` → `trd-generator` → `architecture-generator` → `plan-generator` → `harness-setup` → `loop-setup`, plus `harness-update`, `loop-update`, `feature-add`, `bug-fix`, `refactor-plan` and `code-to-docs` for ongoing and existing projects. See [docs/skills.md](docs/skills.md) (Korean).

## License

MIT
