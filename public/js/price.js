document.querySelectorAll('[data-price]').forEach((el) => {
  const raw = (el.getAttribute('data-price') || '').toString();
  const normalized = raw.replace(/[^0-9.-]/g, '');
  const value = Number(normalized);
  if (Number.isNaN(value)) return;
  const formatted = new Intl.NumberFormat('vi-VN').format(Math.round(value));
  el.textContent = `${formatted} VND`;
});
