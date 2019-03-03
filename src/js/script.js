const show = value => console.log(value);

// Gallery slider

const gallerySlider = (gallery) => {
  let windowWidth = document.documentElement.clientWidth;
  let galleryWidth = gallery.offsetWidth;
  let galleryItem = gallery.querySelector('.gallery__item');
  let itemMargin = parseInt(window.getComputedStyle(galleryItem)['margin-right']);
  let images = gallery.querySelectorAll('.gallery__img');
  let imagesCount;
  let btnPrev = document.querySelector('.gallery__btn--prev');
  let btnNext = document.querySelector('.gallery__btn--next');
  
  if (windowWidth >= 1200) {
    imagesCount = 4;
  } else if (windowWidth >= 992) {
    imagesCount = 3;
  } else if (windowWidth >= 768) {
    imagesCount = 2;
  } else {
    imagesCount = 1;
  }
  
  let gap = 30;
  let imageWidth = (galleryWidth / imagesCount) - (gap * (imagesCount - 1)) / 3;

  images.forEach((el) => {
    el.style.width = `${imageWidth}px`;
  });

  let moving = 0;

  btnPrev.addEventListener('click', () => {
    if (moving >= 0) return;
    
    moving += imageWidth + itemMargin;
    gallery.style.transform = `translate(${moving}px)`;
    
  });
  
  btnNext.addEventListener('click', () => {
    if (Math.abs(moving) >= imageWidth * gallery.children.length + itemMargin * (gallery.children.length - 1) - galleryWidth) return;

    moving -= imageWidth + itemMargin;

    gallery.style.transform = `translate(${moving}px)`;
  });
}

let gallery = document.querySelector('.gallery__list');
let galleryImages = gallery.querySelectorAll('.gallery__img');


gallerySlider(gallery);

window.addEventListener('resize', () => {
  gallerySlider(gallery);
});

// Gallery popup

const imagePopup = () => {
  let imageLinks = document.querySelectorAll('.gallery__link');
  let modalOverlay = document.querySelector('.modal__overlay');
  let modal = document.querySelector('.gallery__modal');
  let currentElement;
  let modalImage = modal.querySelector('.modal__img');

  imageLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      currentElement = link.closest('.gallery__item');
      show(currentElement);
      let imageSrc = link.href;
      modalOverlay.classList.add('modal__overlay--show');      
      modalImage.src = imageSrc;
    });
  });

  // Close modal 

  const closeModal = () => {
    let closeBtn = document.querySelector('.modal__close-btn');
    let modalOverlay = document.querySelector('.modal__overlay');

    document.addEventListener('click', function(e) {
      let target = e.target;

      if (target !== modalOverlay && target !== closeBtn) return;

      modalOverlay.classList.remove('modal__overlay--show');
    });

    window.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        modalOverlay.classList.remove('modal__overlay--show');
      }
    });
  }

  closeModal();

  // Switch photo in popup

  const movePopupPhotos = (e) => {
    let target = e.target;
      
    if (target.classList.contains('modal__btn--prev') || e.keyCode === 37) {
      
      if (!currentElement.previousElementSibling) {
        currentElement = currentElement.parentElement.lastElementChild;
      }

      currentElement = currentElement.previousElementSibling;

      modalImage.src = currentElement.querySelector('.gallery__link').href;

    } else if (target.classList.contains('modal__btn--next') || e.keyCode === 39) {

      if (!currentElement.nextElementSibling) {
        currentElement = currentElement.parentElement.firstElementChild;
      }

      currentElement = currentElement.nextElementSibling;

      modalImage.src = currentElement.querySelector('.gallery__link').href;
    }
  }

  document.querySelectorAll('.modal__btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      movePopupPhotos(e);
    });
  });

  document.addEventListener('keydown', e => {
    movePopupPhotos(e);
  });
  
}

imagePopup();



