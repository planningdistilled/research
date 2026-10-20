#!/bin/bash
# usage: pages.sh <base_url> <jar> <outdir>   -- fetches paged results with 100 per page
BASE="$1"; JAR="$2"; OUT="$3"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
/usr/bin/curl -sS -L -m 90 -A "$UA" -c "$JAR" -b "$JAR" "$BASE/pagedSearchResults.do?action=page&searchCriteria.page=1&searchCriteria.resultsPerPage=100" -o "$OUT/big1.html"
grep -o -i 'showing[^<]*<[^>]*>[^<]*' "$OUT/big1.html" | head -1; grep -c 'class="searchresult"' "$OUT/big1.html"
for p in 2 3 4 5; do
  /usr/bin/curl -sS -L -m 90 -A "$UA" -c "$JAR" -b "$JAR" "$BASE/pagedSearchResults.do?action=page&searchCriteria.page=$p&searchCriteria.resultsPerPage=100" -o "$OUT/big$p.html"
  n=$(grep -c 'class="searchresult"' "$OUT/big$p.html"); echo "page $p: $n"; [ "$n" = "0" ] && break
done
