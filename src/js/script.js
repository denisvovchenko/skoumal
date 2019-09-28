const show = value => console.log(value);

let html = document.documentElement;
let body = document.querySelector('body');

// get window height
const getWindowHeight = () => document.documentElement.clientHeight;

const createElement = (props) => {
  let element = document.createElement(props.element || 'div');

  for (let attr in props.attributes) {
    element.setAttribute(attr, props.attributes[attr]);
  }

  let parent = props.parentElement;

  if (parent) {
    parent.appendChild(element);
  }

  let onclick = props.onclick;

  if (onclick) {
    element.addEventListener('click', onclick);
  }

  return element;
}

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

    if (!section) return;

    setActiveNavItem(link, section);

    window.addEventListener('scroll', e => {
      setActiveNavItem(link, section);
    });
  });
}

// Create modal popup
const createPopup = (block) => {
  let popupOverlay = createElement({
    element: 'div',
    attributes: {
      class: 'modal__overlay',
    },
    onclick(e) {
      e.preventDefault();

      let target = e.target;

      if (!target.classList.contains('modal__overlay')) return;

      popupOverlay.remove();
    }
  });

  let popupWindow = createElement({
    element: 'div',
    attributes: {
      class: 'modal',
    },
    parentElement: popupOverlay,
  });

  let closeBtn = createElement({
    element: 'button',
    attributes: {
      class: 'close-btn modal__close-btn',
      type: 'button'
    },
    parentElement: popupWindow,
    onclick(e) {
      e.preventDefault();

      popupOverlay.remove();
    }
  });

  let btnAllyContent = createElement({
    element: 'span',
    attributes: {
      class: 'visually-hidden',
    },
    parentElement: closeBtn,
  });
  btnAllyContent.innerHTML = 'Zavřít';

  let popupInner = block;

  popupWindow.appendChild(popupInner);
  body.appendChild(popupOverlay);
}

// remove popup
document.addEventListener('keydown', (e) => {
  let photoPopup = document.querySelector('.gallery-popup__block');
  let fullGalleryPopup = document.querySelector('.full-gallery-popup');

  if (!photoPopup && !fullGalleryPopup) {
    return;
  }

  if (e.keyCode === 27) {
    if (photoPopup) {
      photoPopup.closest('.modal__overlay').remove();

    } else if (fullGalleryPopup) {
      show(document.querySelector('.modal__overlay'));
      document.querySelector('.modal__overlay').remove();
    }
  }
});

// Gallery slider
const gallerySlider = (gallery, props) => {
  let windowWidth = document.documentElement.clientWidth;
  let galleryList = gallery.querySelector('.gallery__list');
  let galleryWidth = galleryList.offsetWidth;
  let galleryItems = gallery.querySelectorAll('.gallery__item');
  let itemMargin = Math.round(parseInt(window.getComputedStyle(galleryItems[0])['margin-right']));

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
  let itemWidth = Math.round((galleryWidth / itemsCount) - (gap * (itemsCount - 1)) / 3);

  galleryItems.forEach((item) => {
    item.style.width = `${itemWidth}px`;
  });

  let moving = 0;

  btnPrev.addEventListener('click', () => {
    moving = Math.round(moving);

    if (moving >= 0) return;

    btnNext.classList.remove('controls__btn--disabled');

    moving += itemWidth + itemMargin;
    galleryList.style.transform = `translate(${moving}px)`;

    if (moving >= 0) {
      btnPrev.classList.add('controls__btn--disabled');
    }
  });

  btnNext.addEventListener('click', () => {
    moving = Math.round(moving);

    let listWidth = itemWidth * (galleryList.children.length - 1) + itemMargin * (galleryList.children.length - 1) - galleryWidth;

    if (Math.abs(moving) > listWidth) return;

    btnPrev.classList.remove('controls__btn--disabled');

    moving -= itemWidth + itemMargin;

    galleryList.style.transform = `translate(${moving}px)`;

    if (Math.abs(moving) >= listWidth) {
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
const imagePopup = function() {
  let galleryModalBlock = createElement({
    element: 'div',
    attributes: {
      class: 'gallery-popup__block'
    }
  });

  let modalPic = createElement({
    element: 'picture',
    attributes: {
      class: 'gallery-popup__pic',
    },
    parentElement: galleryModalBlock,
  });

  let modalSource = createElement({
    element: 'source',
    attributes: {
      srcset: '',
      type: 'image/webp',
    },
    parentElement: modalPic,
  })

  let modalImage = createElement({
    element: 'img',
    attributes: {
      class: 'gallery-popup__img',
    },
    parentElement: modalPic,
  })

  let modalDescr = createElement({
    element: 'p',
    attributes: {
      class: 'gallery-popup__descr',
    },
    parentElement: galleryModalBlock,
  });

  let modalControls = createElement({
    element: 'div',
    attributes: {
      class: 'modal__controls controls',
    },
    parentElement: galleryModalBlock,
  })

  let modalPrevBtn = createElement({
    element: 'button',
    attributes: {
      class: 'modal__btn modal__btn--prev controls__btn controls__btn--prev',
      type: 'button',
    },
    parentElement: modalControls,
  });
  modalPrevBtn.innerHTML = '<span class="visually-hidden">Předchozí</span>';

  let modalNextBtn = createElement({
    element: 'button',
    attributes: {
      class: 'modal__btn modal__btn--next controls__btn controls__btn--next',
      type: 'button',
    },
    parentElement: modalControls,
  });
  modalNextBtn.innerHTML = '<span class="visually-hidden">Dálší</span>';

  let currentElement;

  const setImageLinks = (links) => {
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        currentElement = link.closest('.gallery__item');

        let image = link.querySelector('img');
        let source = link.querySelector('source');

        let imageSrc = getFullSizePath(image.getAttribute('src'));
        let imageSrcset = getFullSizePath(image.getAttribute('srcset'));
        let imageWebpSrc = getFullSizePath(source.getAttribute('srcset'));

        modalImage.setAttribute('src', imageSrc);
        modalImage.setAttribute('srcset', imageSrcset)
        modalSource.setAttribute('srcset', imageWebpSrc);
        modalDescr.textContent = image.getAttribute('alt');

        createPopup(galleryModalBlock);
      });
    });
  }

  let imageLinks = document.querySelectorAll('.gallery__link');

  setImageLinks(imageLinks);

  // convert img src from min-version to full
  const getFullSizePath = (src) => {
    if (!src) return;

    let result = src.replace(/-min/g, '');
    result = result.replace(/min\//g, '');

    return result;
  }

  // Switch photo in popup
  const movePopupPhotos = (e) => {
    let target = e.target;

    if (target.classList.contains('modal__btn--prev') ||
        e.keyCode === 37) {

      if (currentElement.previousElementSibling) {
        currentElement = currentElement.previousElementSibling;

      } else {
        currentElement = currentElement.parentElement.lastElementChild;
      }

      setPopupImage(currentElement);

    } else if (target.classList.contains('modal__btn--next') ||
               e.keyCode === 39) {

      if (currentElement.nextElementSibling) {
        currentElement = currentElement.nextElementSibling;

      } else {
        currentElement = currentElement.parentElement.firstElementChild;
      }

      setPopupImage(currentElement);
    }
  }

  let modalButtons = galleryModalBlock.querySelectorAll('.modal__btn');

  modalButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      movePopupPhotos(e);
    });
  });

  document.addEventListener('keydown', e => {
    let galleryExists = document.querySelector('.gallery-popup__block');

    if ((e.keyCode != 37 && e.keyCode != 39) || !galleryExists) return;

    movePopupPhotos(e);
  });

  const setPopupImage = (currentElement) => {

    let image = currentElement.querySelector('.gallery__img');
    let source = image.previousElementSibling;

    let modalDescrText = image.getAttribute('alt');

    let modalSourceSrcset = getFullSizePath(source.getAttribute('srcset'));
    modalSource.setAttribute('srcset', modalSourceSrcset);

    if (!modalSourceSrcset) {
      modalSourceSrcset = getFullSizePath(source.getAttribute('data-srcset'));
    }

    let modalImageSrcset = getFullSizePath(image.getAttribute('srcset'));
``
    if (!modalImageSrcset) {
      modalImageSrcset = getFullSizePath(image.getAttribute('data-srcset'));
    }

    let modalImageSrc = getFullSizePath(image.getAttribute('src'));

    if (!modalImageSrc) {
      modalImageSrc = getFullSizePath(image.getAttribute('data-src'));
    }

    modalSource.setAttribute('srcset', modalSourceSrcset);
    modalImage.setAttribute('srcset', modalImageSrcset);
    modalImage.setAttribute('src', modalImageSrc);

    modalDescr.textContent = modalDescrText;
  }

  // photo gallery
  {
    let galleryList = document.querySelector('.js-photogallery__list').cloneNode(true);
    let galleryItems = galleryList.querySelectorAll('.js-gallery__item');
    galleryItems.forEach((item) => {
      item.style = '';
    });

    let gallery = createElement({
      element: 'div',
      attributes: {
        class: 'full-gallery-popup'
      }
    });

    gallery.appendChild(galleryList);

    let links = gallery.querySelectorAll('.gallery__link');

    setImageLinks(links);

    let openGalleryBtn = document.querySelector('.js-gallery__open-full-btn');

    openGalleryBtn.addEventListener('click', (e) => {
      e.preventDefault();

      createPopup(gallery);

      // lazy( getLazyImages() );
    });
  }
}

imagePopup();

// Slide toggle bio
{
  // const relocateParag = () => {
  //   let bioDescr = document.querySelector('.bio__descr');
  //   let bioDescrAdd = document.querySelector('.bio__add-text');
  //   let bioParags = document.querySelectorAll('.bio__text');

  //   if (html.clientWidth < 992) {
  //     bioDescrAdd.insertBefore(bioParags[1], bioDescrAdd.children[0]);
  //   } else {
  //     bioDescr.insertBefore(bioParags[1], bioDescrAdd);
  //   }
  // }

  // relocateParag();

  // window.onresize = () => {
  //   relocateParag();
  // }

  // let open = false;
  // let heightChecked = false;
  // let initHeight = 0;

  // const slideToggle = () => {

  //   let bioBtnTextOpen = 'Read more';
  //   let bioBtnTextClose = 'Read less';

  //   if (html.lang == 'cs') {
  //     bioBtnTextOpen = 'Rozbalit'
  //     bioBtnTextClose = 'Sbalit';
  //   }

  //   if (!open) {
  //     bioBtn.textContent = bioBtnTextClose;
  //     open = true;

  //     for (let i = 0; i < bioAddHeight; i++) {
  //       bioAdd.style.height = `${i}px`;
  //     }

  //   } else {
  //     bioBtn.textContent = bioBtnTextOpen;
  //     open = false;
  //     for (let i = bioAddHeight; i >= 0; i--) {
  //       bioAdd.style.height = `${i}px`;
  //     }
  //   }
  // }

  // let bioBtn = document.querySelector('.bio__btn');
  // let bioAdd = document.querySelector('.bio__add-text');

  // let bioAddClone = bioAdd.cloneNode(true);

  // body.appendChild(bioAddClone);
  // bioAddClone.style.height = 'auto';
  // bioAddClone.style.width = bioAdd.parentElement.offsetWidth + 'px';
  // let bioAddHeight = bioAddClone.offsetHeight;
  // bioAddClone.remove();

  // if (bioBtn) {
  //   bioBtn.addEventListener('click', function() {
  //     slideToggle(bioAdd);
  //   });
  // }
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
