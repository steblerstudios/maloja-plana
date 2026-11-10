import glob, json, sys
src, out = sys.argv[1], sys.argv[2]
X0, Y1, R, W, H = 2768000, 1144000, 20, 500, 300
s=[0.0]*(W*H); n=[0]*(W*H)
for f in glob.glob(src+'/*.xyz'):
    with open(f) as fh:
        next(fh)
        for z in fh:
            x,y,v = z.split(); c=int((float(x)-X0)//R); r=int((Y1-float(y))//R)
            if 0<=c<W and 0<=r<H: s[r*W+c]+=float(v); n[r*W+c]+=1
z=[round(a/b,1) if b else None for a,b in zip(s,n)]
lz=[v for v in z if v is not None]
i=max(range(len(z)), key=lambda k: z[k] or 0)
print('leer', z.count(None), 'min', min(lz), 'max', max(lz), 'bei', X0+(i%W)*R, Y1-(i//W)*R)
json.dump({'w':W,'h':H,'r':R,'x0':X0,'y1':Y1,'z':z}, open(out,'w'))
