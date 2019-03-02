const show = value => console.log(value);

const langTogglers = document.querySelectorAll('[data-lang]');

langTogglers.forEach(el => {
  el.addEventListener('click', function(e) {
    e.preventDefault();

    document.documentElement.lang = this.dataset.lang;
  });  
});

let bio = document.querySelector('.bio');
let bioFirstParag = bio.querySelector('p');

bio.querySelector('.bio__descr').style.height = `${bioFirstParag.clientHeight}px`;
bio.style.overflow = 'hidden';

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

  show(imageWidth * gallery.children.length + itemMargin * (gallery.children.length - 1) - galleryWidth);
  
  btnNext.addEventListener('click', () => {
    if (Math.abs(moving) >= imageWidth * gallery.children.length + itemMargin * (gallery.children.length - 1) - galleryWidth) return;

    moving -= imageWidth + itemMargin;

    gallery.style.transform = `translate(${moving}px)`;

    
  show(moving);
  });
}

let gallery = document.querySelector('.gallery__list');

gallerySlider(gallery);

window.addEventListener('resize', () => {
  gallerySlider(gallery);
});

