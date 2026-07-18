#!/usr/bin/env bash
#
# sync-check.sh — Pre-merge safety check for upstream sync.
#
# Detects force-push scenarios and evaluates the scope of upstream changes
# BEFORE running `git merge`.  Call this BEFORE every sync.
#
# Usage:
#   bash scripts/sync-check.sh [UPSTREAM_REMOTE] [LOCAL_BRANCH]
#
# Defaults: upstream=netbirdio, branch=i18n-clean
#
# Exit codes:
#   0 — safe to merge (normal sync)
#   1 — force-push detected (use alternative merge strategy)
#   2 — other error
#

set -euo pipefail

UPSTREAM="${1:-netbirdio}"
BRANCH="${2:-i18n-clean}"
UPSTREAM_BRANCH="${UPSTREAM}/main"

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "========================================"
echo "  Upstream Sync Safety Check"
echo "========================================"
echo "  Upstream:  $UPSTREAM_BRANCH"
echo "  Local:     $BRANCH"
echo ""

# 1. Ensure we're on the right branch
CURRENT=$(git branch --show-current)
if [ "$CURRENT" != "$BRANCH" ]; then
  echo -e "${YELLOW}⚠  Not on $BRANCH (current: $CURRENT)${NC}"
fi

# 2. Ensure working tree is clean
if ! git diff --quiet; then
  echo -e "${RED}✗ Working tree is dirty. Please commit or stash changes first.${NC}"
  exit 2
fi

# 3. Fetch upstream
echo "Fetching $UPSTREAM ..."
git fetch "$UPSTREAM"

# 4. Check merge base
MERGE_BASE=$(git merge-base "$BRANCH" "$UPSTREAM_BRANCH" 2>/dev/null || echo "")
if [ -z "$MERGE_BASE" ]; then
  echo -e "${RED}✗ No common ancestor found — branches are unrelated.${NC}"
  echo "  This is likely a force-push or complete rewrite."
  exit 1
fi

MERGE_BASE_MSG=$(git log --oneline "$MERGE_BASE" -1)
echo "  Merge base:  $MERGE_BASE_MSG"

# 5. Detect force-push
IS_INITIAL=$(echo "$MERGE_BASE_MSG" | grep -ci "initial commit" || true)
COMMITS_AHEAD=$(git log --oneline "$BRANCH..$UPSTREAM_BRANCH" | wc -l)
FILES_CHANGED=$(git diff --stat "$BRANCH..$UPSTREAM_BRANCH" | tail -1)

echo "  Commits ahead:  $COMMITS_AHEAD"
echo "  File changes:   $FILES_CHANGED"

if [ "$IS_INITIAL" -gt 0 ]; then
  echo ""
  echo -e "${RED}╔══════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  ⚠ FORCE-PUSH DETECTED                  ║${NC}"
  echo -e "${RED}║  Merge base is the initial commit.       ║${NC}"
  echo -e "${RED}║  Upstream history was rewritten.         ║${NC}"
  echo -e "${RED}╚══════════════════════════════════════════╝${NC}"
  echo ""
  echo "  Recommended strategy:"
  echo "    1. Run:  bash scripts/sync-save-i18n.sh"
  echo "    2. Merge: git merge $UPSTREAM_BRANCH -X theirs --no-edit"
  echo "    3. Run:  bash scripts/sync-restore-i18n.sh"
  exit 1
fi

# 6. Normal sync — check scope
if [ "$COMMITS_AHEAD" -gt 100 ]; then
  echo ""
  echo -e "${YELLOW}⚠  Large update: $COMMITS_AHEAD commits ahead.${NC}"
  echo "  Consider running sync-save-i18n.sh as a precaution."
fi

echo ""
echo -e "${GREEN}✓ Normal sync — safe to merge with:${NC}"
echo "  git merge $UPSTREAM_BRANCH --no-edit"
echo ""
echo "  If conflicts occur (especially in i18n-touched files), use:"
echo "  bash scripts/sync-restore-i18n.sh"
