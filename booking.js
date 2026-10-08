const ITEM_NAMES = {
  'heart-shaped-arch-backdrop': 'Heart Shaped Arch Backdrop',
  'bulb-clear-vase': 'Bulb Clear Vase',
  'single-sten-slant-vase': 'Single Sten Slant Vase',
  'red-carpet': 'Red Carpet',
  'wine-glass': 'Wine Glass',
  'juice-glass': 'Juice Glass',
  'crystal-underplate': 'Crystal Underplate',
  'gold-underplate': 'Gold Underplate',
  'pillar-candle-glass-jar-set-of-3': 'Pillar Candle In Glass Jar (Set Of 3)',
  'welcome-board': 'Welcome Board',
  'plain-welcome-board': 'Plain Welcome Board',
  'mirror-welcome-sign': 'Mirror Welcome Sign',
  'proposal-set-up': 'Proposal Set Up',
  'proposal-full-setup': 'Proposal Full Setup',
  'table-number-number': 'Table Number',
  'table-number-card-option-2': 'Table Number Card (Option 2)',
  'proposal-led-light': 'Proposal LED Light',
  'white-carpet': 'White Carpet'
};

function parseItems(raw) {
  const selections = new Map();

  raw.split(',').forEach(pair => {
    const [slug, quantity, ...extra] = pair.split(':');
    if (extra.length || !Object.hasOwn(ITEM_NAMES, slug) || !/^[1-9]\d*$/.test(quantity || '')) return;

    const qty = Number(quantity);
    if (!Number.isSafeInteger(qty) || qty > 1000) return;
    const total = (selections.get(slug) || 0) + qty;
    if (total <= 1000) selections.set(slug, total);
  });

  return Array.from(selections, ([slug, qty]) => ({ slug, name: ITEM_NAMES[slug], qty }));
}

function renderItems() {
  const params = new URLSearchParams(window.location.search);
  const selections = parseItems(params.get('items') || '');
  const itemsList = document.getElementById('itemsList');
  const itemsRaw = document.getElementById('itemsRaw');
  const editLink = document.getElementById('editSelectionLink');
  const safeRaw = selections.map(({ slug, qty }) => `${slug}:${qty}`).join(',');

  itemsRaw.value = safeRaw;
  if (safeRaw && editLink) {
    editLink.href = `hire-decor-items.html?items=${encodeURIComponent(safeRaw)}`;
  }

  if (!selections.length) {
    const message = document.createElement('p');
    message.className = 'section-sub';
    message.append('No items selected yet — ');
    const catalogueLink = document.createElement('a');
    catalogueLink.href = 'hire-decor-items.html';
    catalogueLink.textContent = 'choose from the catalogue';
    message.append(catalogueLink, '.');
    itemsList.replaceChildren(message);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'choice-grid booking-items';

  selections.forEach(({ name, qty }) => {
    const row = document.createElement('div');
    row.className = 'choice-row booking-item';
    const itemName = document.createElement('span');
    const itemQuantity = document.createElement('strong');
    itemName.textContent = name;
    itemQuantity.textContent = `× ${qty}`;
    row.append(itemName, itemQuantity);
    grid.append(row);
  });

  itemsList.replaceChildren(grid);
}

function setupDeliveryToggle() {
  const collectRadio = document.getElementById('collectRadio');
  const deliveryRadio = document.getElementById('deliveryRadio');
  const deliveryAddressField = document.getElementById('deliveryAddressField');
  const deliveryAddressInput = document.getElementById('deliveryAddress');

  function updateVisibility() {
    const deliverySelected = deliveryRadio.checked;
    deliveryAddressField.hidden = !deliverySelected;
    deliveryAddressInput.required = deliverySelected;
  }

  collectRadio.addEventListener('change', updateVisibility);
  deliveryRadio.addEventListener('change', updateVisibility);
  updateVisibility();
}

renderItems();
setupDeliveryToggle();
