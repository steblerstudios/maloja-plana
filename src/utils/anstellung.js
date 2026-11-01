// Wer zählt als angestellt? Lernende sind Arbeitnehmende mit Lehrvertrag: gleich versichert, Lohn mit
// Abzügen. Nur beim Lohnvergleich und beim Mindestlohn gelten sie anders (data/lohnEinordnung.js, lohnCheck.js).
export const istLernend = (finanzen) => finanzen?.employmentType === 'apprentice';
export const istAngestellt = (finanzen) => finanzen?.employmentType === 'employed' || istLernend(finanzen);
