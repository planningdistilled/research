#!/bin/sh
# print a text file with [pN] page markers, blank lines dropped, whitespace squeezed; optional start/end page
F="$1"; A="${2:-1}"; B="${3:-999}"
sed 's/  */ /g' "$F" | awk -v a="$A" -v b="$B" 'BEGIN{p=1} /\f/{p++; sub(/\f/,"")} { if (p>=a && p<=b && $0 !~ /^ *$/) print "[p" p "] " $0 }'
