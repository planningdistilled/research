#!/bin/sh
# usage: getapp.sh <host> <ref like W/26/01940/PIP>
H="$1"; REF="$2"; ID=$(echo "$REF" | tr '/' '-')
S=${SWEEP_WORK:-./work}
D=$S/downloads/$ID; mkdir -p "$D"; JAR=$S/downloads/app.jar
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
/usr/bin/curl -sS -L -m 90 -A "$UA" -c "$JAR" -b "$JAR" -o "$D/display.html" "https://$H/Planning/Display/$REF"
echo "== $REF https://$H/Planning/Display/$REF"
sed -e 's/<[^>]*>/ /g' -e 's/&amp;/\&/g' "$D/display.html" | tr -s ' \t\n' ' ' | grep -o 'Decision  *[A-Za-z /]*  *Decision Date  *[0-9/]*\|Expected Decision Level  *[A-Za-z]*\|Parish  *[A-Za-z &-]*  *Ward\|Committee Date[^D]\{0,40\}' | head -5
grep -o 'data-disabled-link="[^"]*"' "$D/display.html" | sort -u | sed 's/^data-disabled-link="//;s/"$//;s/&amp;/\&/g' > "$D/links.txt"
sed 's/.*fileName=//' "$D/links.txt" | python3 -I -c 'import sys,urllib.parse;[print(urllib.parse.unquote(l.strip())) for l in sys.stdin]' > "$D/filenames.txt"
cat "$D/filenames.txt" | tr '\n' '|'; echo
while IFS= read -r L; do
  FN=$(echo "$L" | sed 's/.*fileName=//' | python3 -I -c 'import sys,urllib.parse;print(urllib.parse.unquote(sys.stdin.read().strip()))')
  case "$(echo "$FN" | tr 'A-Z' 'a-z')" in
    *delegated*report*|*committee*|*officer*report*|*decision*notice*|*update*)
      OUT="$D/$(echo "$FN" | tr ' /' '__')"
      /usr/bin/curl -sS -L -m 180 -A "$UA" -c "$JAR" -b "$JAR" -e "https://$H/Planning/Display/$REF" -o "$OUT" -w "  got $FN %{http_code} %{size_download} %{content_type}\n" "https://$H$L"
      echo "https://$H$L" >> "$D/downloaded_urls.txt";;
  esac
done < "$D/links.txt"
