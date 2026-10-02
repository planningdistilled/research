import re,glob,os,sys
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,HERE)
from verify import norm
from _paths import SRC, PINS, src
texts=[open(f,errors='ignore').read() for f in glob.glob(os.path.join(SRC,'stratford-*.txt'))+[src('gbtp.txt'),src('cs.txt'),src('nppf.txt')]]
texts+= [open(f,errors='ignore').read() for f in glob.glob(PINS+'/60*.txt') if os.path.basename(f)[:7] in {'6011803','6008785','6008167','6005325','6007221','6008539','6006475','6007541','6006637','6010313','6011736','6010471','6006900','6011231','6008314','6009340','6011253'}]
N=[norm(re.sub(r'([a-z%)\'])(\d{1,3})(?=[\s.,;:)])',r'\1',x)) for x in texts]  # strip glued footnote refs
md=open(sys.argv[1]).read()
# quoted strings in body text and blockquotes
qs=[q for l in md.split('\n') if not l.startswith('>') for q in re.findall(r'"([^"\n]+)"',l) if len(q)>=12]
bq=[re.sub(r'^\*\*.*?\*\*\s*','',l[1:].strip()) for l in md.split('\n') if l.startswith('>') and len(l)>3]
bad=0
for q in qs+bq:
    segs=[norm(s) for s in re.split(r'\s*…\s*',q) if len(s.strip())>3]
    segs=[re.sub(r'\[[^\]]*\]','',s).strip() for s in segs]
    ok=all(any(s in n for n in N) for s in segs)
    if not ok:
        bad+=1; print('✗',q[:110])
print(f'{len(qs)+len(bq)-bad}/{len(qs)+len(bq)} quoted fragments found in sources')
