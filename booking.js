const ITEM_NAMES = {
  'chiavari-chairs': 'Chiavari Chairs',
  'round-tables': 'Round Tables',
  'fairy-light-backdrop': 'Fairy Light Backdrop',
  'draping-panels': 'Draping Panels',
  'floral-centrepieces': 'Floral Centrepieces',
  'welcome-sign-stand': 'Welcome Sign Stand'
};

function renderItems() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('items') || '';
  const itemsList = document.getElementById('itemsList');
  const itemsRaw = document.getElementById('itemsRaw');

  itemsRaw.value = raw;

  if (!raw) {
    itemsList.innerHTML = '<p class="section-sub">No items selected yet — <a href="hire-decor-items.html" style="color:var(--gold); font-weight:600;">choose from the catalogue</a>.</p>';
    return;
  }

  const pairs = raw.split(',').map(pair => {
    const [slug, qty] = pair.split(':');
    const name = ITEM_NAMES[slug] || slug;
    return { name, qty };
  });

  const rows = pairs.map(item =>
    `<div class="choice-row" style="justify-content:space-between; cursor:default;">
      <span>${item.name}</span>
      <strong>× ${item.qty}</strong>
    </div>`
  ).join('');

  itemsList.innerHTML = `<div class="choice-grid" style="grid-template-columns:1fr;">${rows}</div>`;
}

function setupDeliveryToggle() {
  const collectRadio = document.getElementById('collectRadio');
  const deliveryRadio = document.getElementById('deliveryRadio');
  const deliveryAddressField = document.getElementById('deliveryAddressField');
  const deliveryAddressInput = document.getElementById('deliveryAddress');

  function updateVisibility() {
    if (deliveryRadio.checked) {
      deliveryAddressField.style.display = 'block';
      deliveryAddressInput.setAttribute('required', 'required');
    } else {
      deliveryAddressField.style.display = 'none';
      deliveryAddressInput.removeAttribute('required');
    }
  }

  collectRadio.addEventListener('change', updateVisibility);
  deliveryRadio.addEventListener('change', updateVisibility);
}

renderItems();
setupDeliveryToggle();
