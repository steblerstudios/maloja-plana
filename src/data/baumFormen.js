// Wuchsform der Frucht im Raum — das räumliche Gegenstück zu FRUIT_FORM in
// obstgarten.js. Eigene kleine Datei ohne three.js, damit sowohl das Dashboard
// als auch der (nachgeladene) 3D-Baum sie lesen können, ohne dass three.js
// dadurch in die Hauptdatei rutscht.
export const FRUCHT_FORM_3D = {
  apfel: 'rundlich', aprikose: 'rundlich', baumnuss: 'rundlich',
  birne: 'laenglich', zwetschge: 'laenglich', vogelbeere: 'laenglich',
  kirsche: 'beere', heidelbeere: 'beere', hagebutte: 'beere', haselnuss: 'beere',
  traube: 'buschel',
};

export function formFuerFrucht(frucht) {
  return FRUCHT_FORM_3D[frucht] || 'rundlich';
}
