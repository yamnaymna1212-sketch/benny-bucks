import json,re,sys
tm=json.load(open(sys.argv[1]));dur=float(sys.argv[2])
def syl(w):
    w=re.sub(r'[^a-z]','',w.lower()) or 'a'
    n=len(re.findall(r'[aeiouy]+',w)); n-= 1 if w.endswith('e') and n>1 else 0
    return max(1,n)
words=[];zero=None
for p in tm:
    ws=p['text'].split();wt=[syl(w)+.35 for w in ws];tot=sum(wt);t=p['start'];L=p['end']-p['start']
    for w,x in zip(ws,wt):
        words.append({"w":w,"s":round(t,3)})
        if w.lower().startswith('zero') and zero is None: zero=t
        t+=L*x/tot
json.dump({"dur":dur,"phrases":tm,"words":words,"zeroAt":round(zero,3)},open('timeline.json','w'),indent=1)
print('zeroAt',zero,'words',len(words))
