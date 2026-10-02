#!/bin/sh
# SessionStart hook: make the checkout safe to work in and show where things stand.
# Its output is added to the session's context.
ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
cd "$ROOT" || exit 0
PD_ID="noreply@planningdistilled.org"

echo "## planningdistilled/research session check"

# Publication gate on every commit.
if [ "$(git config core.hooksPath)" != ".githooks" ]; then
  git config core.hooksPath .githooks && echo "- enabled the pre-commit gate (core.hooksPath=.githooks)"
fi

# Repo-local Planning Distilled identity, here and in the sibling checkouts.
SITE="${PD_SITE:-$ROOT/../main-site}"
SOURCES="${PD_SOURCES:-$ROOT/../sources}"
for repo in "$ROOT" "$SITE" "$SOURCES"; do
  [ -d "$repo/.git" ] || continue
  if [ "$(git -C "$repo" config --local user.email)" != "$PD_ID" ]; then
    git -C "$repo" config --local user.name "Planning Distilled"
    git -C "$repo" config --local user.email "$PD_ID"
    echo "- set the Planning Distilled git identity in $(basename "$repo")"
  fi
done

# Sibling checkouts.
if [ -d "$SITE/.git" ]; then
  echo "- main-site: $(git -C "$SITE" status -sb | head -1)"
else
  echo "- main-site NOT FOUND at $SITE: builds that publish will fail (clone planningdistilled/main-site beside this repo or set PD_SITE)"
fi
if [ -d "$SOURCES" ]; then
  echo "- sources (private): present"
else
  echo "- sources (private) not found at $SOURCES: guidance quote checks and Stratford note checks will stop; everything else works"
fi
echo "- research: $(git status -sb | head -1)"
[ -d pages/england/nppf-navigator/node_modules ] || echo "- Navigator dependencies not installed: run npm ci in pages/england/nppf-navigator"
command -v pdftotext >/dev/null 2>&1 || echo "- pdftotext (poppler) is missing: the Navigator build and quote checks need it"
command -v uv >/dev/null 2>&1 || echo "- uv is missing: tools are run with uv run"

# Harvest watermarks (stdlib only, so plain python3 is enough).
echo
echo "### Harvest status"
python3 tools/harvest.py status 2>&1 | head -20
exit 0
