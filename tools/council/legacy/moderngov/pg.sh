#!/bin/zsh
# usage: pg.sh FILE 'regex' [context]  -> prints p.N: line for each match (page = PDF page)
f=$1; re=$2; ctx=${3:-0}
awk -v re="$re" -v ctx="$ctx" 'BEGIN{IGNORECASE=1; p=1} { n=gsub(/\f/,""); line=$0; if (n>0) p+=n; buf[NR]=line; pgn[NR]=p; if (line ~ re) { for(i=NR-ctx;i<=NR;i++) if(i>0 && !done[i]) {printf "p.%d:%d: %s\n", pgn[i], i, substr(buf[i],1,230); done[i]=1}; want=NR+ctx } else if (NR<=want && !done[NR]) {printf "p.%d:%d: %s\n", pgn[NR], NR, substr(line,1,230); done[NR]=1} }' "$f"
