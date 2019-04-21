"use strict";

var show = function show(value) {
  return console.log(value);
};

var html = document.documentElement;
var body = document.querySelector('body'); // get window height

var getWindowHeight = function getWindowHeight() {
  return document.documentElement.clientHeight;
}; // Navigation


{
  var setActiveNavItem = function setActiveNavItem(link, section) {
    var sectionPos = section.getBoundingClientRect();

    if (sectionPos.top + 20 > navPos.bottom && sectionPos.top < getWindowHeight() / 2 || sectionPos.bottom > getWindowHeight() / 2 && sectionPos.top < navPos.bottom) {
      link.classList.add('nav__link--active');
    } else {
      link.classList.remove('nav__link--active');
    }
  };

  var nav = document.querySelector('.nav');
  var navLinks = nav.querySelectorAll('.nav__link');
  var navPos = nav.getBoundingClientRect();
  navLinks.forEach(function (link) {
    var anchor = link.getAttribute('href');
    var id = anchor.split('#')[1];
    var section = document.querySelector('#' + id);
    setActiveNavItem(link, section);
    window.addEventListener('scroll', function (e) {
      setActiveNavItem(link, section);
    });
  });
} // Delete modal popup

var removePopup = function removePopup(popup) {
  body.removeChild(popup);
  body.classList.remove('modal-open');
}; // Create modal popup


var createPopup = function createPopup(block) {
  var popupOverlay = document.createElement('div');
  popupOverlay.classList = 'modal__overlay';
  popupOverlay.addEventListener('click', function (e) {
    e.preventDefault();
    var target = e.target;
    if (!target.classList.contains('modal__overlay')) return;
    removePopup(popupOverlay);
  }, true);
  var popupWindow = document.createElement('div');
  popupWindow.classList = 'modal';
  popupOverlay.appendChild(popupWindow);
  var closeBtn = document.createElement('button');
  closeBtn.classList = 'close-btn modal__close-btn';
  closeBtn.setAttribute('type', 'button');
  var btnAllyContent = document.createElement('span');
  btnAllyContent.classList = 'visually-hidden';
  btnAllyContent.innerHTML = 'Zavřít';
  closeBtn.appendChild(btnAllyContent);
  closeBtn.addEventListener('click', function (e) {
    e.preventDefault();
    removePopup(popupOverlay);
  });
  var popupInner = block;
  popupWindow.appendChild(popupInner);
  popupWindow.appendChild(closeBtn);
  body.appendChild(popupOverlay);
  body.classList.add('modal-open'); // Fix in the future!!!

  popupOverlay.style.display = 'flex';
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 27 && body.classList.contains('modal-open')) {
      removePopup(popupOverlay);
    }
  });
}; // Gallery slider


var gallerySlider = function gallerySlider(gallery, props) {
  var windowWidth = document.documentElement.clientWidth;
  var galleryList = gallery.querySelector('.gallery__list');
  var galleryWidth = galleryList.offsetWidth;
  var galleryItems = gallery.querySelectorAll('.gallery__item');
  var itemMargin = parseInt(window.getComputedStyle(galleryItems[0])['margin-right']);
  var itemsCount = props.count || 4;
  var btnPrev = gallery.querySelector('.gallery__btn--prev');
  var btnNext = gallery.querySelector('.gallery__btn--next');

  if (windowWidth < 751) {
    itemsCount = 1;
  } else if (windowWidth < 977) {
    itemsCount = 2;
  } else if (windowWidth < 1183) {
    itemsCount = 3;
  }

  var gap = 30;
  var itemWidth = galleryWidth / itemsCount - gap * (itemsCount - 1) / 3;
  galleryItems.forEach(function (item) {
    item.style.width = "".concat(itemWidth, "px");
  });
  var moving = 0;
  btnPrev.addEventListener('click', function () {
    if (moving >= 0) return;
    btnNext.classList.remove('controls__btn--disabled');
    moving += itemWidth + itemMargin;
    galleryList.style.transform = "translate(".concat(moving, "px)");

    if (moving >= 0) {
      btnPrev.classList.add('controls__btn--disabled');
    }
  });
  btnNext.addEventListener('click', function () {
    if (Math.abs(moving) >= itemWidth * galleryList.children.length + itemMargin * (galleryList.children.length - 1) - galleryWidth) return;
    btnPrev.classList.remove('controls__btn--disabled');
    moving -= itemWidth + itemMargin;
    galleryList.style.transform = "translate(".concat(moving, "px)");

    if (Math.abs(moving) >= itemWidth * galleryList.children.length + itemMargin * (gallery.children.length - 1) - galleryWidth) {
      btnNext.classList.add('controls__btn--disabled');
    }
  });
};

var fotoGallery = document.querySelector('.fotogallery-slider');
gallerySlider(fotoGallery, {
  count: 4
});
window.addEventListener('resize', function () {
  gallerySlider(fotoGallery, {
    count: 4
  });
});
var videoGallery = document.querySelector('.video__slider');
gallerySlider(videoGallery, {
  count: 3
});
window.addEventListener('resize', function () {
  gallerySlider(videoGallery, {
    count: 3
  });
}); // Gallery popup

{
  var imagePopup = function imagePopup() {
    var galleryModalBlock = document.createElement('div');
    galleryModalBlock.classList = 'gallery-popup__block';
    var modalPic = document.createElement('picture');
    modalPic.classList = 'gallery-popup__pic';
    galleryModalBlock.appendChild(modalPic);
    var modalSource = document.createElement('source');
    modalSource.srcset = '';
    modalSource.type = 'image/webp';
    modalPic.appendChild(modalSource);
    var modalImage = document.createElement('img');
    modalImage.classList = 'gallery-popup__img';
    modalPic.appendChild(modalImage);
    var modalDescr = document.createElement('p');
    modalDescr.classList = 'gallery-popup__descr';
    galleryModalBlock.appendChild(modalDescr);
    var modalControls = document.createElement('div');
    modalControls.classList = 'modal__controls controls';
    galleryModalBlock.appendChild(modalControls);
    var modalPrevBtn = document.createElement('button');
    modalPrevBtn.classList = 'modal__btn modal__btn--prev controls__btn controls__btn--prev';
    modalPrevBtn.type = 'button';
    modalPrevBtn.innerHTML = '<span class="visually-hidden">Předchozí</span>';
    modalControls.appendChild(modalPrevBtn);
    var modalNextBtn = document.createElement('button');
    modalNextBtn.classList = 'modal__btn modal__btn--next controls__btn controls__btn--next';
    modalNextBtn.type = 'button';
    modalNextBtn.innerHTML = '<span class="visually-hidden">Dálší</span>';
    modalControls.appendChild(modalNextBtn);
    var imageLinks = document.querySelectorAll('.gallery__link');
    var currentElement;
    imageLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        currentElement = link.closest('.gallery__item');
        var imageSrc = getFullSizePath(link.querySelector('img').getAttribute('src'));
        var imageWebpSrc = getFullSizePath(link.querySelector('source').getAttribute('srcset'));
        show(imageSrc);
        modalImage.src = imageSrc;
        modalSource.srcset = imageWebpSrc;
        var image = link.querySelector('.gallery__img');
        modalDescr.textContent = image.alt;
        createPopup(galleryModalBlock);
        document.querySelectorAll('.modal__btn').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            movePopupPhotos(e);
          });
        });
      });
    }); // convert img src from min-version to full

    var getFullSizePath = function getFullSizePath(src) {
      if (html.clientWidth < 768) {
        return src.replace('@1x', '@2x');
      }

      show(src);
      var result = src.replace('-min', '');
      result = result.replace('min/', '');
      result = result.replace('@1x', '');
      return result;
    }; // Switch photo in popup


    var movePopupPhotos = function movePopupPhotos(e) {
      var target = e.target;

      if (target.classList.contains('modal__btn--prev') || e.keyCode === 37) {
        if (!currentElement.previousElementSibling) {
          currentElement = currentElement.parentElement.lastElementChild;
        }

        currentElement = currentElement.previousElementSibling;
        var modalDescrText = currentElement.querySelector('.gallery__img').alt;
        modalSource.srcset = getFullSizePath(currentElement.querySelector('.gallery__img').previousElementSibling.getAttribute('srcset'));
        modalImage.src = getFullSizePath(currentElement.querySelector('.gallery__img').getAttribute('src'));
        modalDescr.textContent = modalDescrText;
      } else if (target.classList.contains('modal__btn--next') || e.keyCode === 39) {
        if (!currentElement.nextElementSibling) {
          currentElement = currentElement.parentElement.firstElementChild;
        }

        currentElement = currentElement.nextElementSibling;
        var _modalDescrText = currentElement.querySelector('.gallery__img').alt;
        modalSource.srcset = getFullSizePath(currentElement.querySelector('.gallery__img').previousElementSibling.getAttribute('srcset'));
        modalImage.src = getFullSizePath(currentElement.querySelector('.gallery__img').getAttribute('src'));
        modalDescr.textContent = _modalDescrText;
      }
    };

    document.addEventListener('keydown', function (e) {
      var galleryExists = document.querySelector('.gallery-popup__block');
      if (e.keyCode != 37 && e.keyCode != 39 || !galleryExists) return;
      movePopupPhotos(e);
    });
  };

  imagePopup();
} // Slide toggle bio

{
  var open = false;
  var heightChecked = false;
  var initHeight = 0;

  var slideToggle = function slideToggle() {
    var bioBtnTextOpen = 'Read more';
    var bioBtnTextClose = 'Read less';

    if (html.lang == 'cs') {
      bioBtnTextOpen = 'Rozbalit';
      bioBtnTextClose = 'Sbalit';
    }

    if (!open) {
      bioBtn.textContent = bioBtnTextClose;
      open = true;

      for (var i = 0; i < bioAddHeight; i++) {
        bioAdd.style.height = "".concat(i, "px");
      }
    } else {
      bioBtn.textContent = bioBtnTextOpen;
      open = false;

      for (var _i = bioAddHeight; _i >= 0; _i--) {
        bioAdd.style.height = "".concat(_i, "px");
      }
    }
  };

  var bioBtn = document.querySelector('.bio__btn');
  var bioAdd = document.querySelector('.bio__add-text');
  var bioAddHeight;
  setTimeout(function () {
    bioAddHeight = bioAdd.offsetHeight;
    bioAdd.style.height = 0;
  }, 100);
  bioBtn.addEventListener('click', function () {
    slideToggle(bioAdd);
  });

  var relocateParag = function relocateParag() {
    var bioDescr = document.querySelector('.bio__descr');
    var bioDescrAdd = document.querySelector('.bio__add-text');
    var bioParags = document.querySelectorAll('.bio__text');

    if (html.clientWidth < 992) {
      bioDescrAdd.insertBefore(bioParags[1], bioDescrAdd.children[0]);
    } else {
      bioDescr.insertBefore(bioParags[1], bioDescrAdd);
    }
  };

  relocateParag();

  window.onresize = function () {
    relocateParag();
  };
} // Popup cd

{
  var cdBlock = document.querySelector('.cd');
  var cdLinks = cdBlock.querySelectorAll('.cd__link');
  cdLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var cdPopupBlock = document.createElement('div');
      cdPopupBlock.classList = 'cd-popup__block';

      for (var i = 0; i < link.children.length; i++) {
        var node = link.children[i].cloneNode(true);
        cdPopupBlock.appendChild(node);
      }

      ;
      createPopup(cdPopupBlock);
    });
  });
} // Popup pieces

{
  var piecesBlock = document.querySelector('.pieces');
  var piecesBtn = piecesBlock.querySelector('.pieces__btn');
  piecesBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var node = piecesBlock.querySelector('.container').cloneNode(true);
    node.classList = 'pieces-popup__block';
    createPopup(node);
  });
} // Youtube videos

{
  var setVideos = function setVideos() {
    var videos = document.querySelectorAll('.video__media');
    videos.forEach(function (video) {
      // for no youtube videos
      if (video.classList.contains('js-no-script')) return;
      video.addEventListener('click', function (e) {
        e.preventDefault();
        var link = video.querySelector('.video__link');
        var img = video.querySelector('.video__img');
        var btn = video.querySelector('.video__btn');
        var regexp = /https:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)default\.jpg/i;
        var url = img.src;
        var match = url.match(regexp);
        var videoId = match[1];
        var query = '?rel=0&showinfo=0&autoplay=1';
        var videoUrl = "https://www.youtube.com/embed/".concat(videoId, "/").concat(query);
        var iframe = document.createElement('iframe');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('src', videoUrl);
        iframe.classList = 'video__iframe';
        link.remove();
        btn.remove();
        video.appendChild(iframe);
      });
    });
  };

  setVideos();
} // Toggle nav on mobile

{
  var _nav = document.querySelector('.nav');

  var navList = _nav.querySelector('.nav__list');

  var navBtn = _nav.querySelector('.nav__btn');

  var langList = document.querySelector('.lang__list');
  navBtn.addEventListener('click', function (e) {
    e.preventDefault();
    navList.classList.toggle('nav__list--show');
    langList.classList.toggle('lang__list--show');
  });
}