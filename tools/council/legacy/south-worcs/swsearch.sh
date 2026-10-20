#!/bin/sh
# usage: swsearch.sh <host e.g. plan.wychavon.gov.uk> <tag> <PS2Category> [ApplicationType] [DateIssuedFrom] [DateIssuedTo]
# writes downloads/<tag>_p1.html .. and prints page count
H="$1"; TAG="$2"; CAT="$3"; AT="${4:-}"; FROM="${5:-20/09/2026}"; TO="${6:-17/10/2026}"
S=${SWEEP_WORK:-./work}
D=$S/downloads; JAR=$D/${TAG}.jar; rm -f "$JAR"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
C="/usr/bin/curl -sS -m 90 -A $UA -c $JAR -b $JAR"
/usr/bin/curl -sS -m 90 -A "$UA" -c "$JAR" -b "$JAR" -o "$D/${TAG}_adv.html" "https://$H/Search/Advanced"
TOK=$(grep -o 'name="__RequestVerificationToken" type="hidden" value="[^"]*"' "$D/${TAG}_adv.html" | head -1 | sed 's/.*value="//;s/"$//')
[ -z "$TOK" ] && { echo "no token"; exit 1; }
/usr/bin/curl -sS -m 90 -A "$UA" -c "$JAR" -b "$JAR" -o "$D/${TAG}_post.html" -w "POST %{http_code} -> %{redirect_url}\n" \
  -e "https://$H/Search/Advanced" \
  --data-urlencode "__RequestVerificationToken=$TOK" \
  --data-urlencode "AdvancedSearch=True" \
  --data-urlencode "SearchPlanning=true" --data-urlencode "SearchEnforcement=false" --data-urlencode "SearchTreePreservationOrders=false" \
  --data-urlencode "ApplicationNumber=" --data-urlencode "Address=" --data-urlencode "Ward=" --data-urlencode "Parish=" \
  --data-urlencode "PS2Category=$CAT" --data-urlencode "ApplicationType=$AT" \
  --data-urlencode "DateIssuedFrom=$FROM" --data-urlencode "DateIssuedTo=$TO" \
  --data-urlencode "ExcludeDecidedApps=false" \
  "https://$H/Search/SiteResults"
/usr/bin/curl -sS -m 90 -A "$UA" -c "$JAR" -b "$JAR" -o "$D/${TAG}_p1.html" -w "Results %{http_code} %{size_download}\n" "https://$H/Search/Results"
N=2
while [ $N -le 15 ]; do
  /usr/bin/curl -sS -m 90 -A "$UA" -c "$JAR" -b "$JAR" -L -H "X-Requested-With: XMLHttpRequest" -e "https://$H/Search/Results" -o "$D/${TAG}_p${N}.html" -w "Page $N %{http_code} %{size_download}\n" "https://$H/Search/ResultsPage/$N?module=PLA"
  grep -q 'Display/' "$D/${TAG}_p${N}.html" || { rm -f "$D/${TAG}_p${N}.html"; break; }
  N=$((N+1))
done
