#!/bin/zsh
# usage: docs.sh <base-url> <CId> <MId> -> lists agenda items and document links
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
base=$1; cid=$2; mid=$3
html=$(/usr/bin/curl -sL --max-time 60 -A "$UA" "$base/ieListDocuments.aspx?CId=$cid&MId=$mid")
echo "$html" | tr '\n' ' ' | sed 's/<\/li>/\n/g; s/<\/tr>/\n/g' | grep -o 'href="[^"]*documents/[sg][0-9]*/[^"]*"[^>]*>[^<]*\|<p class="mgSubTitleTxt[^"]*">[^<]*\|<h3[^>]*>[^<]*\|mgAiTitleTxt[^>]*>[^<]*' | sed 's/&amp;/\&/g; s/&#32;/ /g; s/&#47;/\//g; s/&#39;/'"'"'/g' | cut -c1-220
