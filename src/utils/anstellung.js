// Wer zählt als angestellt? Lernende sind Arbeitnehmende mit Lehrvertrag: gleich versichert, Lohn mit
// Abzügen. Nur beim Lohnvergleich und beim Mindestlohn gelten sie anders (data/lohnEinordnung.js, lohnCheck.js).
export const istLernend = (finanzen) => finanzen?.employmentType === 'apprentice';
export const istAngestellt = (finanzen) => finanzen?.employmentType === 'employed' || istLernend(finanzen);
// Selbständig erwerbend: «Selbstständig» und «Freiberuflich». Die eine Stelle für diese Frage — vorher
// prüfte der Vorsorge-Rechner nur das eine, der Steuer-Rechner nur das andere (Vortor 10.11.2026).
export const istSelbstaendig = (finanzen) => finanzen?.employmentType === 'selfEmployed' || finanzen?.employmentType === 'freelance';
