const track = document.getElementById('testimonialTrack');
const dotsWrap = document.getElementById('testimonialDots');
const prevBtn = document.getElementById('tPrev');
const nextBtn = document.getElementById('tNext');

if (track && dotsWrap) {
  const cards = Array.from(track.querySelectorAll('.testimonial-card'));

  // Build one dot per testimonial
  cards.forEach((card, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      const cardRect = card.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const offset = (cardRect.left + cardRect.width / 2) - (trackRect.left + trackRect.width / 2);
      track.scrollTo({ left: track.scrollLeft + offset, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function scrollByCard(direction) {
    const cardWidth = cards[0].getBoundingClientRect().width + 28; // card width + gap
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));

  // Keep the active dot in sync with actual scroll position
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      cards.forEach((card, i) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - trackCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      dots.forEach(d => d.classList.remove('active'));
      dots[closestIndex].classList.add('active');
    }, 100);
  });
}