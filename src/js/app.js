const show = value => console.log(value);

let html = document.documentElement;
let body = document.querySelector('body');

// get window height
const getWindowHeight = () => document.documentElement.clientHeight;

// Navigation
{
  const setActiveNavItem = (link, section) => {
    let sectionPos = section.getBoundingClientRect();

    if ( (sectionPos.top + 20) > navPos.bottom
      && (sectionPos.top) < getWindowHeight() / 2
      || sectionPos.bottom > getWindowHeight() / 2
      && sectionPos.top < navPos.bottom) {
      link.classList.add('nav__link--active');
    } else {
      link.classList.remove('nav__link--active');
    }
  }

  let nav = document.querySelector('.nav');
  let navLinks = nav.querySelectorAll('.nav__link');
  let navPos = nav.getBoundingClientRect();

  navLinks.forEach((link) => {
    let anchor = link.getAttribute('href');
    let id = anchor.split('#')[1];

    let section = document.querySelector('#' + id);

    setActiveNavItem(link, section);

    window.addEventListener('scroll', e => {
      setActiveNavItem(link, section);
    });
  });
}

// Delete modal popup
const removePopup = popup => {
  body.removeChild(popup);
  body.classList.remove('modal-open');
}

// Create modal popup
const createPopup = block => {
  let popupOverlay = document.createElement('div');
  popupOverlay.classList = 'modal__overlay';
  popupOverlay.addEventListener('click', e => {
    e.preventDefault();

    let target = e.target;

    if (!target.classList.contains('modal__overlay')) return;

    removePopup(popupOverlay);
  }, true);

  let popupWindow = document.createElement('div');
  popupWindow.classList = 'modal';
  popupOverlay.appendChild(popupWindow);

  let closeBtn = document.createElement('button');
  closeBtn.classList = 'close-btn modal__close-btn';
  closeBtn.setAttribute('type', 'button');

  let btnAllyContent = document.createElement('span');
  btnAllyContent.classList = 'visually-hidden';
  btnAllyContent.innerHTML = 'Zavřít';
  closeBtn.appendChild(btnAllyContent);
  closeBtn.addEventListener('click', e => {
    e.preventDefault();

    removePopup(popupOverlay);
  });

  let popupInner = block;

  popupWindow.appendChild(popupInner);
  popupWindow.appendChild(closeBtn);
  body.appendChild(popupOverlay);
  body.classList.add('modal-open');

  // Fix in the future!!!
  popupOverlay.style.display = 'flex';

  document.addEventListener('keydown', e => {
    if (e.keyCode === 27 && body.classList.contains('modal-open')) {
      removePopup(popupOverlay);
    }
  });
}

// Gallery slider
const gallerySlider = (gallery, props) => {
  let windowWidth = document.documentElement.clientWidth;
  let galleryList = gallery.querySelector('.gallery__list');
  let galleryWidth = galleryList.offsetWidth;
  let galleryItems = gallery.querySelectorAll('.gallery__item');
  let itemMargin = parseInt(window.getComputedStyle(galleryItems[0])['margin-right']);

  let itemsCount = props.count || 4;
  let btnPrev = gallery.querySelector('.gallery__btn--prev');
  let btnNext = gallery.querySelector('.gallery__btn--next');

  if (windowWidth < 751) {
    itemsCount = 1;
  } else if (windowWidth < 977) {
    itemsCount = 2;
  } else if (windowWidth < 1183) {
    itemsCount = 3;
  }

  let gap = 30;
  let itemWidth = (galleryWidth / itemsCount) - (gap * (itemsCount - 1)) / 3;

  galleryItems.forEach((item) => {
    item.style.width = `${itemWidth}px`;
  });

  let moving = 0;

  btnPrev.addEventListener('click', () => {
    if (moving >= 0) return;

    btnNext.classList.remove('controls__btn--disabled');

    moving += itemWidth + itemMargin;
    galleryList.style.transform = `translate(${moving}px)`;

    if (moving >= 0) {
      btnPrev.classList.add('controls__btn--disabled');
    }
  });

  btnNext.addEventListener('click', () => {
    if (Math.abs(moving) >= itemWidth * galleryList.children.length + itemMargin * (galleryList.children.length - 1) - galleryWidth) return;

    btnPrev.classList.remove('controls__btn--disabled');

    moving -= itemWidth + itemMargin;

    galleryList.style.transform = `translate(${moving}px)`;

    if (Math.abs(moving) >= itemWidth * galleryList.children.length + itemMargin * (gallery.children.length - 1) - galleryWidth) {
      btnNext.classList.add('controls__btn--disabled');
    }
  });
}

let fotoGallery = document.querySelector('.fotogallery-slider');
gallerySlider(fotoGallery, {count: 4});
window.addEventListener('resize', () => {
  gallerySlider(fotoGallery, {count: 4});
});

let videoGallery = document.querySelector('.video__slider');
gallerySlider(videoGallery, {count: 3});
window.addEventListener('resize', () => {
  gallerySlider(videoGallery, {count: 3});
});

// Gallery popup
{
  const imagePopup = () => {
    let galleryModalBlock = document.createElement('div');
    galleryModalBlock.classList = 'gallery-popup__block';

    let modalPic = document.createElement('picture');
    modalPic.classList = 'gallery-popup__pic';
    galleryModalBlock.appendChild(modalPic);

    let modalSource = document.createElement('source');
    modalSource.srcset = '';
    modalSource.type = 'image/webp';
    modalPic.appendChild(modalSource);

    let modalImage = document.createElement('img');
    modalImage.classList = 'gallery-popup__img';
    modalPic.appendChild(modalImage);

    let modalDescr = document.createElement('p');
    modalDescr.classList = 'gallery-popup__descr';
    galleryModalBlock.appendChild(modalDescr);

    let modalControls = document.createElement('div');
    modalControls.classList = 'modal__controls controls';
    galleryModalBlock.appendChild(modalControls);

    let modalPrevBtn = document.createElement('button');
    modalPrevBtn.classList = 'modal__btn modal__btn--prev controls__btn controls__btn--prev';
    modalPrevBtn.type = 'button';
    modalPrevBtn.innerHTML = '<span class="visually-hidden">Předchozí</span>';
    modalControls.appendChild(modalPrevBtn);

    let modalNextBtn = document.createElement('button');
    modalNextBtn.classList = 'modal__btn modal__btn--next controls__btn controls__btn--next';
    modalNextBtn.type = 'button';
    modalNextBtn.innerHTML = '<span class="visually-hidden">Dálší</span>';
    modalControls.appendChild(modalNextBtn);

    let imageLinks = document.querySelectorAll('.gallery__link');
    let currentElement;

    imageLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();

        currentElement = link.closest('.gallery__item');
        let imageSrc = getFullSizePath(link.querySelector('img').getAttribute('src'));
        let imageWebpSrc = getFullSizePath(link.querySelector('source').getAttribute('srcset'));

        show(imageSrc);
        modalImage.src = imageSrc;
        modalSource.srcset = imageWebpSrc;
        let image = link.querySelector('.gallery__img');
        modalDescr.textContent = image.alt;

        createPopup(galleryModalBlock);

        document.querySelectorAll('.modal__btn').forEach(function(btn) {
          btn.addEventListener('click', function(e) {
            movePopupPhotos(e);
          });
        });

      });
    });

    // convert img src from min-version to full
    const getFullSizePath = (src) => {

      if (html.clientWidth < 768) {
        return src.replace('@1x', '@2x');
      }

      show(src);

      let result = src.replace('-min', '');
      result = result.replace('min/', '');
      result = result.replace('@1x', '');

      return result;
    }

    // Switch photo in popup
    const movePopupPhotos = e => {
      let target = e.target;

      if (target.classList.contains('modal__btn--prev') || e.keyCode === 37) {

        if (!currentElement.previousElementSibling) {
          currentElement = currentElement.parentElement.lastElementChild;
        }

        currentElement = currentElement.previousElementSibling;

        let modalDescrText = currentElement.querySelector('.gallery__img').alt;
        modalSource.srcset = getFullSizePath(currentElement.querySelector('.gallery__img').previousElementSibling.getAttribute('srcset'));
        modalImage.src = getFullSizePath(currentElement.querySelector('.gallery__img').getAttribute('src'));
        modalDescr.textContent = modalDescrText;

      } else if (target.classList.contains('modal__btn--next') || e.keyCode === 39) {

        if (!currentElement.nextElementSibling) {
          currentElement = currentElement.parentElement.firstElementChild;
        }

        currentElement = currentElement.nextElementSibling;

        let modalDescrText = currentElement.querySelector('.gallery__img').alt;

        modalSource.srcset = getFullSizePath(currentElement.querySelector('.gallery__img').previousElementSibling.getAttribute('srcset'));
        modalImage.src = getFullSizePath(currentElement.querySelector('.gallery__img').getAttribute('src'));
        modalDescr.textContent = modalDescrText;
      }
    }

    document.addEventListener('keydown', e => {
      let galleryExists = document.querySelector('.gallery-popup__block');

      if ((e.keyCode != 37 && e.keyCode != 39) || !galleryExists) return;

      movePopupPhotos(e);
    });
  }

  imagePopup();
}

// Slide toggle bio
{
  let open = false;
  let heightChecked = false;
  let initHeight = 0;

  const slideToggle = () => {

    let bioBtnTextOpen = 'Read more';
    let bioBtnTextClose = 'Read less';

    if (html.lang == 'cs') {
      bioBtnTextOpen = 'Rozbalit'
      bioBtnTextClose = 'Sbalit';
    }

    if (!open) {
      bioBtn.textContent = bioBtnTextClose;
      open = true;

      for (let i = 0; i < bioAddHeight; i++) {
        bioAdd.style.height = `${i}px`;
      }

    } else {
      bioBtn.textContent = bioBtnTextOpen;
      open = false;
      for (let i = bioAddHeight; i >= 0; i--) {
        bioAdd.style.height = `${i}px`;
      }
    }
  }

  let bioBtn = document.querySelector('.bio__btn');
  let bioAdd = document.querySelector('.bio__add-text');
  let bioAddHeight;

  setTimeout(() => {
    bioAddHeight = bioAdd.offsetHeight;
    bioAdd.style.height = 0;
  }, 100);

  bioBtn.addEventListener('click', function() {
    slideToggle(bioAdd);
  });

  const relocateParag = () => {
    let bioDescr = document.querySelector('.bio__descr');
    let bioDescrAdd = document.querySelector('.bio__add-text');
    let bioParags = document.querySelectorAll('.bio__text');

    if (html.clientWidth < 992) {
      bioDescrAdd.insertBefore(bioParags[1], bioDescrAdd.children[0]);
    } else {
      bioDescr.insertBefore(bioParags[1], bioDescrAdd);
    }
  }

  relocateParag();

  window.onresize = () => {
    relocateParag();
  }
}

// Popup cd
{
  let cdBlock = document.querySelector('.cd');
  let cdLinks = cdBlock.querySelectorAll('.cd__link');

  cdLinks.forEach((link) => {
    link.addEventListener('click', e => {
      e.preventDefault();

      let cdPopupBlock = document.createElement('div');
      cdPopupBlock.classList = 'cd-popup__block';

      for (let i = 0; i < link.children.length; i++) {
        let node = link.children[i].cloneNode(true);
        cdPopupBlock.appendChild(node);
      };

      createPopup(cdPopupBlock);
    });
  })

}

// Popup pieces
{
  let piecesBlock = document.querySelector('.pieces');
  let piecesBtn = piecesBlock.querySelector('.pieces__btn');
  piecesBtn.addEventListener('click', e => {
    e.preventDefault();

    let node = piecesBlock.querySelector('.container').cloneNode(true);
    node.classList = 'pieces-popup__block';

    createPopup(node);
  });
}

// Youtube videos
{
  const setVideos = () => {
    let videos = document.querySelectorAll('.video__media');

    videos.forEach(video => {

      // for no youtube videos
      if (video.classList.contains('js-no-script')) return;

      video.addEventListener('click', e => {
        e.preventDefault();

        let link = video.querySelector('.video__link');
        let img = video.querySelector('.video__img');
        let btn = video.querySelector('.video__btn');

        let regexp = /https:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)default\.jpg/i;
        let url = img.src;
        let match = url.match(regexp);
        let videoId = match[1];

        let query = '?rel=0&showinfo=0&autoplay=1';
        let videoUrl = `https://www.youtube.com/embed/${videoId}/${query}`;

        let iframe = document.createElement('iframe');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('src', videoUrl);
        iframe.classList = 'video__iframe';

        link.remove();
        btn.remove();
        video.appendChild(iframe);
      });
    });
  }

  setVideos();

}

// Toggle nav on mobile
{
  let nav = document.querySelector('.nav');
  let navList = nav.querySelector('.nav__list');
  let navBtn = nav.querySelector('.nav__btn');
  let langList = document.querySelector('.lang__list');

  navBtn.addEventListener('click', e => {
    e.preventDefault();

    navList.classList.toggle('nav__list--show');
    langList.classList.toggle('lang__list--show');
  })
}
