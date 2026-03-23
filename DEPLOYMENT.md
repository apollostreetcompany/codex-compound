# DEPLOYMENT.md - Codex-Compound

## Current Deployment Posture
- This repository is currently a local development baseline copied from upstream and not yet deployed under a new release flow.
- No application server or port-binding runtime is required for the current scaffolding bead.
- Existing upstream GitHub workflows were imported but have not yet been revalidated for the new repo identity.

## Local Validation Commands
- `make install`
- `make test`
- `make release-validate`
- `make validate`

## Assumptions
- Bun is the primary runtime/package manager for the imported CLI.
- Codex and OpenClaw support will be the first-class validated surfaces.
- UNCONFIRMED: release automation and CI requirements after the repo is renamed and trimmed.

## Rollback
- Current rollback path is git-based only: revert the active branch or reset to the import/scaffold commit once one exists.
