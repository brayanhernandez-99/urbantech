function initGallery() {
  var wrappers = document.querySelectorAll('.product-img-wrapper');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox.querySelector('.lightbox-img');
  var lightboxCounter = lightbox.querySelector('.lightbox-counter');
  var currentIndex = 0;
  var currentImages = [];

  wrappers.forEach(function(wrapper) {
    var images = JSON.parse(wrapper.dataset.images);
    var img = wrapper.querySelector('.product-img');
    var prevBtn = wrapper.querySelector('.product-img-arrow--prev');
    var nextBtn = wrapper.querySelector('.product-img-arrow--next');
    var idx = 0;

    function updateCardImg(i) {
      idx = (i + images.length) % images.length;
      img.src = images[idx];
      img.srcset = '';
    }

    prevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      updateCardImg(idx - 1);
    });
    nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      updateCardImg(idx + 1);
    });

    wrapper.addEventListener('click', function() {
      currentImages = images;
      var currentSrc = img.getAttribute('src');
      var matchIdx = images.findIndex(function(u) {
        return currentSrc.indexOf(u) !== -1 || u.indexOf(currentSrc.split('/').pop()) !== -1;
      });
      currentIndex = matchIdx >= 0 ? matchIdx : 0;
      openLightbox(currentIndex);
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = currentImages[currentIndex];
    lightboxImg.srcset = '';
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function navigate(delta) {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + delta + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex];
    lightboxImg.srcset = '';
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
  }

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-arrow--prev').addEventListener('click', function() { navigate(-1); });
  lightbox.querySelector('.lightbox-arrow--next').addEventListener('click', function() { navigate(1); });
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}
