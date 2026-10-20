#!/bin/zsh
# usage: cal.sh <base-url>  -> prints meetings in Sep/Oct 2026 whose title matches planning
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
base=$1
for m in 9 10; do
  html=$(/usr/bin/curl -sL --max-time 40 -A "$UA" "$base/mgCalendarMonthView.aspx?M=$m&Y=2026&GL=1")
  code=$?
  if [ $code -ne 0 ]; then echo "CURLERR $code $base M=$m"; continue; fi
  if echo "$html" | grep -qi "cloudflare\|Access is denied\|Just a moment"; then echo "BLOCKED $base M=$m"; continue; fi
  # modern.gov calendar: links like ieListDocuments.aspx?CId=..&MId=..  with title attr containing date
  echo "$html" | tr '\n' ' ' | grep -o '<a[^>]*ieListDocuments.aspx?CId=[0-9]*&amp;MId=[0-9]*[^>]*>[^<]*' | sed 's/&amp;/\&/g' | grep -i "planning\|development\|applications\|regulatory" | sed "s#^#M=$m #" 
done
