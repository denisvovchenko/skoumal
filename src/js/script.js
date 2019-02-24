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