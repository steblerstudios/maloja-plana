import glob, json, sys
src, out = sys.argv[1], sys.argv[2]
X0, Y1, R, N = 2771000, 1143000, 10, 400
s=[0.0]*(N*N); n=[0]*(N*N)
for f in glob.glob(src+'/*.xyz'):
    with open(f) as fh:
        next(fh)
        for z in fh:
            x,y,v = z.split(); c=int((float(x)-X0)//R); r=int((Y1-float(y))//R)
            if 0<=c<N and 0<=r<N: s[r*N+c]+=float(v); n[r*N+c]+=1
z=[round(a/b,1) if b else None for a,b in zip(s,n)]
print('leer', z.count(None), 'min', min(v for v in z if v), 'max', max(v for v in z if v))
json.dump({'n':N,'r':R,'x0':X0,'y1':Y1,'z':z}, open(out,'w'))
