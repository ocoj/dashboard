#!/usr/bin/env bash
#
# sync-restore-i18n.sh — Re-apply i18n patches after upstream merge.
#
# Restores saved i18n state from the latest patch file.  If the patch
# does not apply cleanly, falls back to interactive conflict resolution.
#
# Usage:
#   bash scripts/sync-restore-i18n.sh [PATCH_FILE]
#
# Defaults to the latest saved patch.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PATCH_DIR="$SCRIPT_DIR/i18n-patches"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PATCH_FILE="${1:-$PATCH_DIR/latest.patch}"

if [ ! -f "$PATCH_FILE" ]; then
  echo -e "${RED}✗ No saved patch found at: $PATCH_FILE${NC}"
  echo "  Run sync-save-i18n.sh BEFORE merging upstream."
  exit 2
fi

echo "========================================"
echo "  Restoring i18n State"
echo "========================================"
echo "  Patch: $PATCH_FILE"
echo "  Size:  $(wc -l < "$PATCH_FILE") lines"
echo ""

# 1. Check which i18n files survived the merge
echo "--- Checking i18n file status ---"
STANDALONE_OK=true
for f in "src/i18n/messages/en.ts" "src/i18n/messages/zh.ts" "src/i18n/locale-context.tsx" "src/i18n/trans-text.tsx" "src/i18n/trans-map.tsx" "src/components/ui/LocaleSwitcher.tsx"; do
  if [ -f "$f" ]; then
    echo "  ✓ $f"
  else
    echo -e "  ${RED}✗ $f — MISSING${NC}"
    STANDALONE_OK=false
  fi
done

if ! $STANDALONE_OK; then
  echo ""
  echo "--- Trying to apply patch ---"
  # Try a dry-run first
  if git apply --check "$PATCH_FILE" 2>/dev/null; then
    git apply "$PATCH_FILE"
    echo -e "${GREEN}✓ Patch applied cleanly.${NC}"
  else
    echo -e "${YELLOW}⚠ Patch does not apply cleanly — attempting 3-way merge fallback.${NC}"
    if git apply --3way "$PATCH_FILE" 2>/dev/null; then
      echo -e "${GREEN}✓ Patch applied with 3-way merge.${NC}"
    else
      echo -e "${RED}✗ Patch failed. Manual intervention required.${NC}"
      echo "  Conflicting files:"
      git apply --check "$PATCH_FILE" 2>&1 || true
      exit 3
    fi
  fi
fi

# 2. Verify source patches in upstream files
echo ""
echo "--- Verifying source patches ---"

check_patch() {
  local file="$1"
  local pattern="$2"
  local label="$3"
  if [ -f "$file" ] && grep -q "$pattern" "$file" 2>/dev/null; then
    echo "  ✓ $label"
  else
    echo -e "  ${YELLOW}⚠ $label — needs re-application${NC}"
  fi
}

check_patch "src/layouts/AppLayout.tsx" "LocaleProvider" "AppLayout → LocaleProvider"
check_patch "src/modules/settings/LanguageTab.tsx" "locale-context" "LanguageTab → locale-context"

# 3. Build translation map
echo ""
echo "--- Rebuilding translation map ---"
if node scripts/build-trans-map.js 2>/dev/null; then
  echo -e "${GREEN}✓ Translation map rebuilt.${NC}"
else
  echo -e "${YELLOW}⚠ Could not rebuild trans-map (may be OK if no changes).${NC}"
fi

# 4. TypeScript check
echo ""
echo "--- TypeScript check ---"
if npx tsc --noEmit 2>&1 | tail -3; then
  echo -e "${GREEN}✓ TypeScript compilation passed.${NC}"
else
  echo -e "${RED}✗ TypeScript errors detected — fix before proceeding.${NC}"
  exit 4
fi

echo ""
echo "========================================"
echo -e "${GREEN}  i18n restore complete.${NC}"
echo "========================================"
echo ""
echo "  Next steps:"
echo "    1. npx next build       # verify build"
echo "    2. git add -A && git commit -m 'i18n: restore after upstream sync'"
echo "    3. Deploy and verify in browser"
