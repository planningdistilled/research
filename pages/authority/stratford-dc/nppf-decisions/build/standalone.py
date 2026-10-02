"""Wrap the artifact page (index.html) as a self-contained standalone HTML file."""
import os, sys
from _paths import OUT
HERE = os.path.dirname(os.path.abspath(__file__))
p = open(os.path.join(HERE, 'index.html'), encoding='utf-8').read()
i = p.index('<div class="wrap"')
head, body = p[:i], p[i:]
out = ('<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
       '<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
       + head + '</head>\n<body>\n' + body + '\n</body>\n</html>\n')
dst = os.path.join(sys.argv[1] if len(sys.argv) > 1 else OUT, 'index.html')
open(dst, 'w', encoding='utf-8').write(out)
print(dst, len(out))
