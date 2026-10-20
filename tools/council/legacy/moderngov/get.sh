#!/bin/zsh
# usage: get.sh <outdir> <url> <outname>
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
mkdir -p "$1"
/usr/bin/curl -sL --max-time 180 -A "$UA" -o "$1/$3" "$2"
printf '%s %s %s\n' "$(stat -f %z "$1/$3")" "$(file -b "$1/$3" | cut -c1-30)" "$1/$3"
