const galleryItems = Array.from(document.querySelectorAll('#projectsGrid .gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxSub = document.getElementById('lightboxSub');
const lightboxCounter = document.getElementById('lightboxCounter');
const closeBtn = document.getElementById('lightboxClose');
const prevBtn = document.getElementById('lightboxPrev');
const nextBtn = document.getElementById('lightboxNext');

let currentIndex = 0;
let lastFocused = null;

function showImage(index) {
  const item = galleryItems[index];
  lightboxImg.src = item.dataset.full;
  lightboxImg.alt = item.querySelector('img').alt;
  lightboxTitle.textContent = item.dataset.title;
  lightboxSub.textContent = item.dataset.sub;
  lightboxCounter.textContent = `${index + 1} / ${galleryItems.length}`;
  currentIndex = index;
}

function openLightbox(index) {
  lastFocused = document.activeElement;
  showImage(index);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

function showNext() {
  showImage((currentIndex + 1) % galleryItems.length);
}

function showPrev() {
  showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
}

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});