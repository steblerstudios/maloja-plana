// ============================================================================
// DATE HELPERS
// ============================================================================
export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('de-CH', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
