#!/bin/bash
# usage: dl.sh <host> <jar> <path> <outfile>
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
/usr/bin/curl -sS -L -m 120 -A "$UA" -c "$2" -b "$2" "$1$3" -o "$4"
file -b "$4" | cut -c1-60
