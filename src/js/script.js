const show = value => console.log(value);
let html = document.documentElement;
let body = document.querySelector('body');

// Navigation
{
  
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
        let imageSrc = link.href;
        let imageWebpSrc = link.querySelector('source').srcset;    
        modalImage.src = imageSrc;
        modalSource.src = imageWebpSrc;

        createPopup(galleryModalBlock);

        document.querySelectorAll('.modal__btn').forEach(function(btn) {
          btn.addEventListener('click', function(e) {
            movePopupPhotos(e);
          });
        });

      });
    });

    // Switch photo in popup

    const movePopupPhotos = e => {
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
    if (!open) {
      open = true;
      for (let i = 0; i < bioAddHeight; i++) {
        bioAdd.style.height = `${i}px`;
      }

    } else {
      open = false;
      for (let i = bioAddHeight; i >= 0; i--) {
        bioAdd.style.height = `${i}px`;
      }
    }    
  }

  let bioBtnSlide = document.querySelector('.bio__btn--slide');
  let bioAdd = document.querySelector('.bio__add-text');
  let bioAddHeight = bioAdd.offsetHeight;
  bioAdd.style.height = 0;

  bioBtnSlide.addEventListener('click', function() {
    slideToggle(bioAdd);
  });
}

// Popup bio
{
  let openPopupBtn = document.querySelector('.bio__btn--modal');
  let bioTitle = document.querySelector('.bio__title').cloneNode(true);
  let bioTexts = document.querySelectorAll('.bio__text');
  let popupBlock = document.createElement('div');
  popupBlock.classList = 'bio-popup__block';

  let popupBody = document.createElement('div');
  popupBody.classList = 'bio-popup__body';
  
  popupBlock.appendChild(bioTitle);
  popupBlock.appendChild(popupBody);

  bioTexts.forEach(text => {
    let cloneText = text.cloneNode(true);
    popupBody.appendChild(cloneText);
  });
  
  openPopupBtn.addEventListener('click', e => {
    e.preventDefault();

    createPopup(popupBlock);
  });

  // const closeModal = () => {
  //   let closeBtn = document.querySelector('.modal__close-btn');

  //   document.addEventListener('click', function(e) {
  //     let target = e.target;

  //     if (target !== bioModal && target !== closeBtn) return;

  //     bioModal.classList.remove('modal__overlay--show');
  //     });

  //     window.addEventListener('keydown', e => {
  //     if (e.keyCode === 27) {
  //       bioModal.classList.remove('modal__overlay--show');
  //     }
  //   });
  // }

  // closeModal();
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
    let videos = document.querySelectorAll('.video__item');
    

    videos.forEach(video => {
      video.addEventListener('click', e => {
        e.preventDefault();

        let link = video.querySelector('.video__link');
        let img = video.querySelector('.video__img');
        let btn = video.querySelector('.video__btn');

        let regexp = /https:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)default\.jpg/i;
        let url = img.src;
        let match = url.match(regexp);
        show(url);
        let videoId = match[1];

        let query = '?rel=0&showinfo=0&autoplay=1';
        let videoUrl = `https://www.youtube.com/embed/${videoId}/${query}`;
        
        let iframe = document.createElement('iframe');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('src', videoUrl);
        iframe.classList = 'video__iframe';

        video.removeChild(link);
        video.removeChild(btn);
        video.appendChild(iframe);
      });
    });
  }

  setVideos();

}