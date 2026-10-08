const cards = document.querySelectorAll('.item-card');
const summaryText = document.getElementById('summaryText');
const continueBtn = document.getElementById('continueBtn');

function getSelections() {
  const selections = [];
  cards.forEach(card => {
    const qty = parseInt(card.querySelector('.qty-value').textContent, 10);
    if (qty > 0) {
      selections.push({ slug: card.dataset.slug, name: card.dataset.name, qty });
    }
  });
  return selections;
}

function updateSummary() {
  const selections = getSelections();
  const totalItems = selections.reduce((sum, s) => sum + s.qty, 0);
  const count = document.createElement('strong');
  count.textContent = totalItems;
  summaryText.replaceChildren(count, ` item${totalItems === 1 ? '' : 's'} selected`);
}
window.refreshCatalogueSummary = updateSummary;

function prefillFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('items');
  if (!raw) return;

  const pairs = raw.split(',').map(pair => {
    const [slug, qty] = pair.split(':');
    return { slug, qty: /^[1-9]\d*$/.test(qty || '') ? Number(qty) : 0 };
  });

  pairs.forEach(({ slug, qty }) => {
    const card = Array.from(cards).find(c => c.dataset.slug === slug);
    if (card && Number.isSafeInteger(qty) && qty > 0) {
      card.querySelector('.qty-value').textContent = Math.min(qty, 1000);
    }
  });

  updateSummary();
}

cards.forEach(card => {
  const minusBtn = card.querySelector('.qty-minus');
  const plusBtn = card.querySelector('.qty-plus');
  const valueEl = card.querySelector('.qty-value');
  minusBtn.setAttribute('aria-label', `Decrease ${card.dataset.name} quantity`);
  plusBtn.setAttribute('aria-label', `Increase ${card.dataset.name} quantity`);

  minusBtn.addEventListener('click', () => {
    const current = parseInt(valueEl.textContent, 10);
    if (current > 0) {
      valueEl.textContent = current - 1;
      updateSummary();
    }
  });

  plusBtn.addEventListener('click', () => {
    const current = parseInt(valueEl.textContent, 10);
    valueEl.textContent = Math.min(current + 1, 1000);
    updateSummary();
  });
});

continueBtn.addEventListener('click', () => {
  const selections = getSelections();

  if (selections.length === 0) {
    alert('Please select at least one item before continuing.');
    return;
  }

  const itemsParam = selections.map(s => `${s.slug}:${s.qty}`).join(',');
  const url = `hire-decor-items-booking.html?items=${encodeURIComponent(itemsParam)}`;
  window.location.href = url;
});

prefillFromUrl();
