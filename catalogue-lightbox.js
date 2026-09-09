const itemPhotos = Array.from(document.querySelectorAll('#catalogueGrid .item-photo'));
const catLightbox = document.getElementById('catLightbox');
const catLightboxImg = document.getElementById('catLightboxImg');
const catLightboxTitle = document.getElementById('catLightboxTitle');
const catLightboxPrice = document.getElementById('catLightboxPrice');
const catLightboxQty = document.getElementById('catLightboxQty');
const catLightboxClose = document.getElementById('catLightboxClose');
const catLightboxPrev = document.getElementById('catLightboxPrev');
const catLightboxNext = document.getElementById('catLightboxNext');
const catLightboxMinus = document.getElementById('catLightboxMinus');
const catLightboxPlus = document.getElementById('catLightboxPlus');

let currentIndex = 0;
let lastFocused = null;

function getCard(index) {
  return itemPhotos[index].closest('.item-card');
}

function refresh(index) {
  const photo = itemPhotos[index];
  const card = getCard(index);
  catLightboxImg.src = photo.dataset.full;
  catLightboxImg.alt = photo.querySelector('img').alt;
  catLightboxTitle.textContent = card.dataset.name;
  catLightboxPrice.textContent = card.dataset.price || '';
  catLightboxQty.textContent = card.querySelector('.qty-value').textContent;
  currentIndex = index;
}

function openLightbox(index) {
  lastFocused = document.activeElement;
  refresh(index);
  catLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  catLightboxClose.focus();
}

function closeLightbox() {
  catLightbox.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

function showNext() { refresh((currentIndex + 1) % itemPhotos.length); }
function showPrev() { refresh((currentIndex - 1 + itemPhotos.length) % itemPhotos.length); }

function changeQty(delta) {
  const card = getCard(currentIndex);
  const valueEl = card.querySelector('.qty-value');
  const current = parseInt(valueEl.textContent, 10);
  const updated = Math.max(0, current + delta);
  valueEl.textContent = updated;
  catLightboxQty.textContent = updated;
  if (window.refreshCatalogueSummary) window.refreshCatalogueSummary();
}

itemPhotos.forEach((photo, index) => {
  photo.addEventListener('click', () => openLightbox(index));
});

catLightboxClose.addEventListener('click', closeLightbox);
catLightboxNext.addEventListener('click', showNext);
catLightboxPrev.addEventListener('click', showPrev);
catLightboxMinus.addEventListener('click', () => changeQty(-1));
catLightboxPlus.addEventListener('click', () => changeQty(1));

catLightbox.addEventListener('click', (e) => {
  if (e.target === catLightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!catLightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});