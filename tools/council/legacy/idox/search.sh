#!/bin/bash
# usage: search.sh <base_url> <jar> <out_prefix> [extra form fields]
BASE="$1"; JAR="$2"; OUT="$3"; shift 3
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
/usr/bin/curl -sS -L -m 90 -A "$UA" -c "$JAR" -b "$JAR" "$BASE/search.do?action=advanced" -o "$OUT.form.html"
CSRF=$(grep -o 'name="_csrf" value="[^"]*"' "$OUT.form.html" | head -1 | sed 's/.*value="//;s/"//')
echo "csrf=$CSRF"
/usr/bin/curl -sS -L -m 90 -A "$UA" -c "$JAR" -b "$JAR" -X POST "$BASE/advancedSearchResults.do?action=firstPage" \
  --data-urlencode "_csrf=$CSRF" \
  --data-urlencode "searchCriteria.caseStatus=" \
  --data-urlencode "date(applicationDecisionStart)=01/09/2026" \
  --data-urlencode "date(applicationDecisionEnd)=17/10/2026" \
  --data-urlencode "searchType=Application" "$@" -o "$OUT.p1.html"
grep -c 'searchresult' "$OUT.p1.html"; grep -o 'Showing [0-9-]* of [0-9]*' "$OUT.p1.html" | head -1
