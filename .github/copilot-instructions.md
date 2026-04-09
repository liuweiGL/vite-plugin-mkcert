# Copilot Commit Message Rules

Use these rules whenever creating git commit messages in this repository.

## Required Format

`<type>(<scope>): <subject>`

Optional body:

- blank line after header
- explain what changed and why
- keep line length around 100 chars

## Allowed Types

- feat: add a new feature
- fix: fix a bug
- docs: documentation only
- style: formatting only, no logic change
- perf: performance improvement
- refactor: code restructuring without feature/bug change
- build: build system or dependency updates
- ci: CI workflow updates
- chore: maintenance changes not affecting src behavior
- revert: revert a previous commit

## Scope Rules

- Scope is required.
- Prefer concrete module scopes, such as:
  - plugin
  - playground

## Subject Rules

- Use imperative mood: add, fix, refactor, remove, update.
- Be specific and concise.
- Do not end with a period.
- Use lowercase unless a proper noun is required.

## Breaking Changes

If a commit introduces a breaking change, include in footer:

`BREAKING CHANGE: <description>`

## AI Behavior Requirements

- Commit only related changes in one commit.
- Make commit message match the real staged files.
- Do not use vague headers like "update" or "fix issue".
- Prefer feat/fix/refactor/perf over chore when behavior changes.

## Repository Context

This repository uses semantic-release. Commit message quality affects release notes.
