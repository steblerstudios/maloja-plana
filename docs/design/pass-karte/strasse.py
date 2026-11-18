import json, sys
def lv95(lat, lon):
    p=(lat*3600-169028.66)/10000; l=(lon*3600-26782.5)/10000
    E=2600072.37+211455.93*l-10938.51*l*p-0.36*l*p*p-44.54*l**3
    N=1200147.07+308807.95*p+3745.25*l*l+76.63*p*p-194.56*l*l*p+119.79*p**3
    return E,N
X0,Y1,R,NN=2771000,1143000,10,400
d=json.load(open(sys.argv[1])); wege=[]; innen=0
for e in d['elements']:
    pts=[]
    for g in e['geometry']:
        E,N=lv95(g['lat'],g['lon']); c=(E-X0)/R; r=(Y1-N)/R
        pts.append([round(c,1),round(r,1)])
        if 0<=c<=NN and 0<=r<=NN: innen+=1
    wege.append(pts)
print('wege',len(wege),'punkte im fenster',innen)
json.dump(wege,open(sys.argv[2],'w'))
