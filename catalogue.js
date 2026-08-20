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
  summaryText.innerHTML = `<strong>${totalItems}</strong> item${totalItems === 1 ? '' : 's'} selected`;
}

cards.forEach(card => {
  const minusBtn = card.querySelector('.qty-minus');
  const plusBtn = card.querySelector('.qty-plus');
  const valueEl = card.querySelector('.qty-value');

  minusBtn.addEventListener('click', () => {
    const current = parseInt(valueEl.textContent, 10);
    if (current > 0) {
      valueEl.textContent = current - 1;
      updateSummary();
    }
  });

  plusBtn.addEventListener('click', () => {
    const current = parseInt(valueEl.textContent, 10);
    valueEl.textContent = current + 1;
    updateSummary();
  });
});

continueBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const selections = getSelections();

  if (selections.length === 0) {
    alert('Please select at least one item before continuing.');
    return;
  }

  const itemsParam = selections.map(s => `${s.slug}:${s.qty}`).join(',');
  const url = `hire-decor-items-booking.html?items=${encodeURIComponent(itemsParam)}`;
  window.location.href = url;
});
