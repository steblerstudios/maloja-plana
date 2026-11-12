import glob, json, sys
out = sys.argv[1]; ordner = sys.argv[2:]
X0, Y1, R, W, H = 2760000, 1144000, 25, 720, 520
s=[0.0]*(W*H); n=[0]*(W*H)
for o in ordner:
    for f in glob.glob(o+'/*.xyz'):
        with open(f) as fh:
            next(fh)
            for z in fh:
                x,y,v = z.split(); c=int((float(x)-X0)//R); r=int((Y1-float(y))//R)
                if 0<=c<W and 0<=r<H: s[r*W+c]+=float(v); n[r*W+c]+=1
z=[round(a/b,1) if b else None for a,b in zip(s,n)]
leer=z.count(None); lz=[v for v in z if v is not None]; tief=min(lz)
z=[tief if v is None else v for v in z]   # fehlende Kacheln (Südostecke) tief setzen, liegen ausserhalb des Blicks
print('leer', leer, 'min', tief, 'max', max(lz))
json.dump({'w':W,'h':H,'r':R,'x0':X0,'y1':Y1,'z':z}, open(out,'w'))
