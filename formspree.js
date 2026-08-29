// ---------- Build the popup once, shared by every form on the page ----------
const popupOverlay = document.createElement('div');
popupOverlay.className = 'form-popup-overlay';
popupOverlay.innerHTML = `
  <div class="form-popup" role="alertdialog" aria-modal="true" aria-labelledby="formPopupTitle">
    <button type="button" class="form-popup-close" aria-label="Close">&times;</button>
    <div class="popup-icon"></div>
    <h3 id="formPopupTitle"></h3>
    <p></p>
  </div>
`;
document.body.appendChild(popupOverlay);

const popup = popupOverlay.querySelector('.form-popup');
const popupIcon = popupOverlay.querySelector('.popup-icon');
const popupTitle = popupOverlay.querySelector('h3');
const popupMessage = popupOverlay.querySelector('p');
const popupClose = popupOverlay.querySelector('.form-popup-close');
let lastFocused = null;

function showPopup(type, title, message) {
  lastFocused = document.activeElement;
  popup.classList.remove('success', 'error');
  popup.classList.add(type);
  popupIcon.textContent = type === 'success' ? '✓' : '!';
  popupTitle.textContent = title;
  popupMessage.textContent = message;
  popupOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  popupClose.focus();
}

function closePopup() {
  popupOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

popupClose.addEventListener('click', closePopup);
popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) closePopup();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && popupOverlay.classList.contains('open')) closePopup();
});

// ---------- Wire up every form on the page ----------
document.querySelectorAll('form.ajax-form').forEach(form => {
  const successTitle = form.dataset.successTitle || 'Thank You';
  const successMessage = form.dataset.successMessage || "Your submission has been sent — we'll be in touch shortly.";
  const errorTitle = form.dataset.errorTitle || 'Something Went Wrong';
  const errorMessage = form.dataset.errorMessage || 'Please try again, or contact us directly.';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      if (response.ok) {
        showPopup('success', successTitle, successMessage);
        form.reset();
      } else {
        showPopup('error', errorTitle, errorMessage);
      }
    } catch (err) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showPopup('error', errorTitle, errorMessage);
    }
  });
});
