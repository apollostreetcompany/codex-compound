#!/usr/bin/env bash
set -euo pipefail

DEFAULT_REPO_URL="https://github.com/apollostreetcompany/codex-compound.git"

log() {
  printf '%s\n' "$*"
}

fail() {
  printf 'bootstrap error: %s\n' "$*" >&2
  exit 1
}

expand_home_path() {
  case "$1" in
    "~")
      printf '%s\n' "$HOME"
      ;;
    "~/"*)
      printf '%s/%s\n' "$HOME" "${1#~/}"
      ;;
    *)
      printf '%s\n' "$1"
      ;;
  esac
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "missing required command: $1"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECKOUT_ROOT=""
if [[ -f "${SCRIPT_DIR}/../package.json" && -f "${SCRIPT_DIR}/../src/index.ts" ]]; then
  CHECKOUT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
fi

CODEX_HOME="$(expand_home_path "${CODEX_HOME:-$HOME/.codex}")"
CODEX_COMPOUND_REPO_URL="${CODEX_COMPOUND_REPO_URL:-$DEFAULT_REPO_URL}"
CODEX_COMPOUND_DIR="$(expand_home_path "${CODEX_COMPOUND_DIR:-${XDG_DATA_HOME:-$HOME/.local/share}/codex-compound}")"
SKIP_BUN_INSTALL="${SKIP_BUN_INSTALL:-0}"
CODEX_COMPOUND_REF="${CODEX_COMPOUND_REF:-}"

if [[ -n "${CODEX_COMPOUND_ROOT:-}" ]]; then
  REPO_ROOT="$(expand_home_path "${CODEX_COMPOUND_ROOT}")"
elif [[ -n "$CHECKOUT_ROOT" ]]; then
  REPO_ROOT="$CHECKOUT_ROOT"
else
  REPO_ROOT=""
fi

require_command bun

if [[ -n "$REPO_ROOT" ]]; then
  [[ -d "$REPO_ROOT" ]] || fail "CODEX_COMPOUND_ROOT does not exist: $REPO_ROOT"
  [[ -f "$REPO_ROOT/package.json" ]] || fail "missing package.json in repo root: $REPO_ROOT"
  [[ -f "$REPO_ROOT/src/index.ts" ]] || fail "missing src/index.ts in repo root: $REPO_ROOT"
  if [[ -n "$CODEX_COMPOUND_REF" ]]; then
    log "Using existing checkout at $REPO_ROOT"
    log "Ignoring CODEX_COMPOUND_REF because CODEX_COMPOUND_ROOT/current checkout was selected"
  else
    log "Using existing checkout at $REPO_ROOT"
  fi
else
  require_command git
  mkdir -p "$(dirname "$CODEX_COMPOUND_DIR")"

  if [[ -d "$CODEX_COMPOUND_DIR/.git" ]]; then
    log "Updating Codex-Compound checkout at $CODEX_COMPOUND_DIR"
    git -C "$CODEX_COMPOUND_DIR" fetch --tags origin
  elif [[ -e "$CODEX_COMPOUND_DIR" ]]; then
    fail "CODEX_COMPOUND_DIR exists but is not a git checkout: $CODEX_COMPOUND_DIR"
  else
    log "Cloning Codex-Compound into $CODEX_COMPOUND_DIR"
    git clone "$CODEX_COMPOUND_REPO_URL" "$CODEX_COMPOUND_DIR"
  fi

  if [[ -n "$CODEX_COMPOUND_REF" ]]; then
    log "Checking out requested ref: $CODEX_COMPOUND_REF"
    git -C "$CODEX_COMPOUND_DIR" fetch --tags origin "$CODEX_COMPOUND_REF" || true
    git -C "$CODEX_COMPOUND_DIR" checkout "$CODEX_COMPOUND_REF"
  else
    CURRENT_BRANCH="$(git -C "$CODEX_COMPOUND_DIR" symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
    if [[ -n "$CURRENT_BRANCH" ]]; then
      log "Fast-forwarding checkout on branch $CURRENT_BRANCH"
      git -C "$CODEX_COMPOUND_DIR" pull --ff-only origin "$CURRENT_BRANCH"
    fi
  fi

  REPO_ROOT="$CODEX_COMPOUND_DIR"
fi

if [[ "$SKIP_BUN_INSTALL" == "1" ]]; then
  log "Skipping bun install because SKIP_BUN_INSTALL=1"
else
  log "Installing Bun dependencies in $REPO_ROOT"
  (
    cd "$REPO_ROOT"
    bun install --frozen-lockfile
  )
fi

mkdir -p "$CODEX_HOME"

log "Installing compound-engineering into $CODEX_HOME"
(
  cd "$REPO_ROOT"
  bun run src/index.ts convert ./plugins/compound-engineering --to codex --codex-home "$CODEX_HOME"
)

log "Installed Codex-Compound into $CODEX_HOME"
log "Available prompts include /prompts:ce-plan and /prompts:ce-brainstorm"
