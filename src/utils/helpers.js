// ============================================================================
// DATE HELPERS
// ============================================================================
export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('de-CH', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// ============================================================================
// PRINT HELPERS
// ============================================================================
export function openPrintWindow(html) {
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    return;
  }
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'maloja-plana-' + new Date().toISOString().split('T')[0] + '.html';
  a.click();
  URL.revokeObjectURL(url);
}
