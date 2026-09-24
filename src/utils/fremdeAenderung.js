// K116 · Hat ein ANDERER Maloja-Tab den gespeicherten Stand geändert?
//
// Das `storage`-Ereignis kommt nur in den übrigen Tabs desselben Ursprungs an, nie im
// schreibenden selbst. Zählt nur, was das Auto-Save dieses Tabs sonst überschriebe:
// die Angaben und die Dokumentliste. `key === null` heisst `localStorage.clear()`.
// Einstellungen (Sprache, Thema, …) und das Lösch-Signal zählen nicht — das Lösch-
// Signal hat seinen eigenen Weg in main.jsx.
export const istFremdeAenderung = (key) =>
  key === 'or5_data' || key === 'or5_docs' || key === null;
