const galleryItems = Array.from(document.querySelectorAll('#projectsGrid .gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');
const closeBtn = document.getElementById('lightboxClose');
const prevBtn = document.getElementById('lightboxPrev');
const nextBtn = document.getElementById('lightboxNext');
const imageWrap = lightbox.querySelector('.lightbox-img-wrap');

let currentIndex = 0;
let lastFocused = null;
let imageRequest = 0;
let swipeStart = null;

function showImage(index, direction = 0) {
  const item = galleryItems[index];
  const request = ++imageRequest;
  const fullImage = new Image();
  let applied = false;

  currentIndex = index;
  lightboxCounter.textContent = `${index + 1} / ${galleryItems.length}`;

  const applyImage = () => {
    if (applied || request !== imageRequest) return;
    applied = true;
    lightboxImg.classList.add('is-entering');
    lightboxImg.dataset.direction = direction < 0 ? 'prev' : 'next';
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector('img').alt;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => lightboxImg.classList.remove('is-entering'));
    });
  };

  fullImage.addEventListener('load', applyImage, { once: true });
  fullImage.addEventListener('error', applyImage, { once: true });
  fullImage.src = item.dataset.full;
  if (fullImage.complete) applyImage();
}

function openLightbox(index) {
  lastFocused = document.activeElement;
  const thumbnail = galleryItems[index].querySelector('img');
  lightboxImg.src = thumbnail.currentSrc || thumbnail.src;
  lightboxImg.alt = thumbnail.alt;
  showImage(index);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeLightbox() {
  imageRequest += 1;
  swipeStart = null;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

function showNext() {
  showImage((currentIndex + 1) % galleryItems.length, 1);
}

function showPrev() {
  showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length, -1);
}

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

imageWrap.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'mouse' || !lightbox.classList.contains('open')) return;
  swipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
});

imageWrap.addEventListener('pointerup', (event) => {
  if (!swipeStart || event.pointerId !== swipeStart.pointerId) return;

  const deltaX = event.clientX - swipeStart.x;
  const deltaY = event.clientY - swipeStart.y;
  swipeStart = null;

  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
  if (deltaX < 0) showNext();
  else showPrev();
});

imageWrap.addEventListener('pointercancel', () => {
  swipeStart = null;
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'Tab') {
    const controls = [closeBtn, prevBtn, nextBtn];
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
