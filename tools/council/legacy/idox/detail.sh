#!/bin/bash
# usage: detail.sh <base> <jar> <outdir> <keyVal> <tag>
BASE="$1"; JAR="$2"; OUT="$3"; KV="$4"; TAG="$5"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
mkdir -p "$OUT/$TAG"
for tab in summary details documents; do
  /usr/bin/curl -sS -L -m 90 -A "$UA" -c "$JAR" -b "$JAR" "$BASE/applicationDetails.do?activeTab=$tab&keyVal=$KV" -o "$OUT/$TAG/$tab.html"
done
