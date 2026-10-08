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

const miniGallery = document.getElementById('miniGallery');
const miniGalleryTitle = document.getElementById('miniGalleryTitle');
const miniGalleryGrid = document.getElementById('miniGalleryGrid');
const miniGalleryClose = document.getElementById('miniGalleryClose');

let activeImages = [];   // the navigable set for the lightbox currently open
let activeIndex = 0;
let lightboxLastFocused = null;
let miniGalleryLastFocused = null;

function getVariations(photo) {
  const raw = photo.dataset.images;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < 2) return null;
    const card = photo.closest('.item-card');
    return parsed.map(v => ({ src: v.src, alt: v.alt, label: v.label, card }));
  } catch (e) {
    return null;
  }
}

function buildDefaultSet() {
  // one entry per catalogue item, using each item's primary photo
  return itemPhotos.map(photo => ({
    src: photo.dataset.full,
    alt: photo.querySelector('img').alt,
    card: photo.closest('.item-card')
  }));
}

function refreshLightbox() {
  const item = activeImages[activeIndex];
  catLightboxImg.src = item.src;
  catLightboxImg.alt = item.alt;
  catLightboxTitle.textContent = item.card.dataset.name;
  catLightboxPrice.textContent = item.card.dataset.price || '';
  catLightboxQty.textContent = item.card.querySelector('.qty-value').textContent;
  catLightboxMinus.setAttribute('aria-label', `Decrease ${item.card.dataset.name} quantity`);
  catLightboxPlus.setAttribute('aria-label', `Increase ${item.card.dataset.name} quantity`);
}

function openLightboxWithSet(set, index) {
  activeImages = set;
  activeIndex = index;
  refreshLightbox();
  catLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  catLightboxClose.focus();
}

function closeLightbox() {
  catLightbox.classList.remove('open');
  document.body.style.overflow = '';
  if (lightboxLastFocused) lightboxLastFocused.focus();
}

function showNext() {
  activeIndex = (activeIndex + 1) % activeImages.length;
  refreshLightbox();
}
function showPrev() {
  activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
  refreshLightbox();
}

function changeQty(delta) {
  const card = activeImages[activeIndex].card;
  const valueEl = card.querySelector('.qty-value');
  const current = parseInt(valueEl.textContent, 10);
  const updated = Math.max(0, current + delta);
  valueEl.textContent = updated;
  catLightboxQty.textContent = updated;
  if (window.refreshCatalogueSummary) window.refreshCatalogueSummary();
}

// ---------- Mini gallery (variations of one product) ----------
function openMiniGallery(photo, variations) {
  miniGalleryLastFocused = document.activeElement;
  const card = photo.closest('.item-card');
  miniGalleryTitle.textContent = card.dataset.name;
  miniGalleryGrid.innerHTML = '';

  variations.forEach((v, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mini-gallery-thumb';
    const image = document.createElement('img');
    image.src = v.src;
    image.alt = v.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    btn.append(image);
    if (v.label) {
      const label = document.createElement('span');
      label.className = 'thumb-label';
      label.textContent = v.label;
      btn.append(label);
    }
    btn.addEventListener('click', () => {
      closeMiniGallery();
      lightboxLastFocused = photo;
      openLightboxWithSet(variations, i);
    });
    miniGalleryGrid.appendChild(btn);
  });

  miniGallery.classList.add('open');
  document.body.style.overflow = 'hidden';
  miniGalleryClose.focus();
}

function closeMiniGallery() {
  miniGallery.classList.remove('open');
  document.body.style.overflow = '';
  if (miniGalleryLastFocused) miniGalleryLastFocused.focus();
}

itemPhotos.forEach((photo) => {
  photo.addEventListener('click', () => {
    const variations = getVariations(photo);
    if (variations) {
      openMiniGallery(photo, variations);
    } else {
      lightboxLastFocused = photo;
      const set = buildDefaultSet();
      const index = itemPhotos.indexOf(photo);
      openLightboxWithSet(set, index);
    }
  });
});

miniGalleryClose.addEventListener('click', closeMiniGallery);
miniGallery.addEventListener('click', (e) => {
  if (e.target === miniGallery) closeMiniGallery();
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
  if (e.key === 'Escape' && miniGallery.classList.contains('open')) {
    closeMiniGallery();
    return;
  }
  if (miniGallery.classList.contains('open') && e.key === 'Tab') {
    const controls = [miniGalleryClose, ...miniGalleryGrid.querySelectorAll('button')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
    return;
  }
  if (!catLightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'Tab') {
    const controls = [catLightboxClose, catLightboxPrev, catLightboxNext, catLightboxMinus, catLightboxPlus];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
