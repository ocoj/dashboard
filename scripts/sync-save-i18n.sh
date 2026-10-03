#!/usr/bin/env bash
#
# sync-save-i18n.sh — Save current i18n state before upstream merge.
#
# Captures all i18n-related changes as a git patch so they can be
# re-applied after merging upstream code.  This protects against
# both normal conflicts and force-push scenarios.
#
# Usage:
#   bash scripts/sync-save-i18n.sh
#
# Output:
#   scripts/i18n-patches/YYYYMMDD-HHMMSS.patch
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PATCH_DIR="$SCRIPT_DIR/i18n-patches"
mkdir -p "$PATCH_DIR"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PATCH_FILE="$PATCH_DIR/$TIMESTAMP.patch"

# Files and directories that are part of the i18n layer.
# These are OUR additions that upstream does not have.
I18N_FILES=(
  "src/i18n/"
  "src/components/ui/LocaleSwitcher.tsx"
)

# Lines added to upstream files (AppLayout, LanguageTab, etc.) are harder
# to capture automatically.  For now, we save:
#   1. Our standalone i18n files (they survive merge as orphan files)
#   2. The minimal source patches in known files

echo "Saving i18n state to: $PATCH_FILE"

# Save our i18n file changes as a diff from the last merge
# (i.e., everything we changed since the merge base)
MERGE_BASE=$(git merge-base HEAD "netbirdio/main" 2>/dev/null || echo "HEAD~1")

# Generate patch for i18n-only files
git diff "$MERGE_BASE" -- "${I18N_FILES[@]}" > "$PATCH_FILE" 2>/dev/null || true

# Also capture known patched upstream files
PATCHED_FILES=(
  "src/layouts/AppLayout.tsx"
  "src/modules/settings/LanguageTab.tsx"
)
for f in "${PATCHED_FILES[@]}"; do
  if git diff "$MERGE_BASE" -- "$f" >> "$PATCH_FILE" 2>/dev/null; then
    :
  fi
done

PATCH_SIZE=$(wc -l < "$PATCH_FILE" 2>/dev/null || echo 0)
echo "  Patch size: $PATCH_SIZE lines"

if [ "$PATCH_SIZE" -eq 0 ]; then
  echo "  ⚠  Empty patch — no i18n changes detected."
  rm -f "$PATCH_FILE"
else
  echo "  ✓ Saved."
fi

# Also save a "last known good" symlink for easy restore
ln -sf "$(basename "$PATCH_FILE")" "$PATCH_DIR/latest.patch" 2>/dev/null || true

echo ""
echo "After merge, restore with:"
echo "  bash scripts/sync-restore-i18n.sh"
