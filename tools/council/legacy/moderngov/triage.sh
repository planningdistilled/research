#!/bin/zsh
for f in "$@"; do
  echo "=================== $(basename $f)"
  grep -v '^\s*$' "$f" | head -25 | cut -c1-160
  echo "--- counts: GB=$(grep -ci 'green belt' $f) TR3=$(grep -c 'TR3' $f) CT=$(grep -ci 'connectivity tool' $f) DP3=$(grep -c 'DP3' $f) 'DP3(3)'=$(grep -c 'DP3(3)\|DP3 (3)\|DP3(iii)' $f) AnnexB=$(grep -ci 'annex b' $f) S4=$(grep -c '\bS4\b' $f) S5=$(grep -c '\bS5\b' $f) 'S5(5)'=$(grep -c 'S5(5)\|S5 (5)' $f) washed=$(grep -ci 'washed' $f) 'grey belt'=$(grep -ci 'grey belt' $f) 'NPPF 2026/Aug'=$(grep -ci '2026' $f) 'para 11'=$(grep -ci 'paragraph 11\b\|para 11\b\|11(d)\|11d' $f) GB7=$(grep -c 'GB7' $f) HO11=$(grep -c 'HO11' $f) 'NDMP'=$(grep -ci 'national development management\|NDMP' $f) 'dwelling'=$(grep -ci 'dwelling' $f)"
done
