'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.getElementsByClassName('btn--scroll-to')[0]

const nav = document.querySelector('.nav');
const header = document.querySelector('header');
const section1 = document.querySelector('#section--1');
const imgTargets = document.querySelectorAll('img[data-src]');

const tab = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');



//const initialCoords = section1.getBoundingClientRect();
///////////////////////////////////////
//MODAL WINDOW

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
//IMPLEMENTING SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function(e){
  const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('Current Scroll X/Y', window.pageXOffset, window.pageYOffset);
  // console.log('Height/Width viewport', document.documentElement.clientHeight, document.documentElement.clientHeight);

  //Scrolling
  //Viewport x/y position + x/y offset
  //window.scrollTo(s1Coords.left + window.pageXOffset, s1Coords.top + window.pageYOffset)

  //Old fashioned way
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset, 
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // });
  section1.scrollIntoView({
    behavior: 'smooth'
  });
});

///////////////////////////////////////
//EVENT DELEGATION

// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     

//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth'
//     });
//   })
// });

//1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();

  //Matching strategy
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    });
  }
})

///////////////////////////////////////
//BUILDING A TABBED ELEMENT

tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab'); //To prevent setting as event the button's child elements
  e.preventDefault();
  if(!clicked) return; //To avoid null value result of clicking anywhere in the tab but not the buttons
  
  //Remove class in all child elements and assign it to clicked element
  tab.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  
  //Activate content
  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

///////////////////////////////////////
//PASSING ARGUMENTS TO EVENT HANDLERS: HOVER EFFECT IN THE NAV BAR

const handleHover = function(e){
  if(e.target.closest('.nav__link')) {
    const hovered = e.target;
    const siblings = hovered.closest('.nav').querySelectorAll('.nav__link');
    const logo = hovered.closest('.nav').querySelector('.nav__logo');

    siblings.forEach(el => {
      if(el !== hovered) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//Passing argument into a handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
//STICKY NAVIGATION
/* Not reccomended due to low performance
window.addEventListener('scroll', function(){
  //If the window scroll is greater than the top initial coords, toggle class
  if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});*/

///////////////////////////////////////
//INTERSECTION SERVER API

const navHeight = nav.getBoundingClientRect().height

//Callback function
const stickyNav = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const navObserver = new IntersectionObserver(stickyNav, {
  //Observer options
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
//Call observer function and pass document section as argument
navObserver.observe(header);

///////////////////////////////////////
//REVEALING ELEMENTS ON THE SCROLL

const allSections = document.querySelectorAll('.section');
const revealSection = function(entries, observer){
  const [entry] = entries;
  //With the target property it is possible to know which section intersected the viewport
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

//It is possible to 
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})
allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
//LAZY LOADING IMAGES

const loadImg = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  //Replace src
  entry.target.setAttribute('src', entry.target.dataset.src);
  //Remove the class once the element is loades
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(function(img){
  imgObserver.observe(img);

});

///////////////////////////////////////
//SLIDER PART1

let curSlide = 0;
const maxSlide = slides.length;

const goToSlide = function(slide) {
  slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
}
const createDots = function(){
  slides.forEach(function(s, i){
    dotContainer.insertAdjacentHTML('beforeend', `<button class = "dots__dot" data-slide = "${i}"></button>`);
  });
};
const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active');
}

createDots();
//0%, 100%, 200%, 300%;
goToSlide(0);
activateDot(0);

const nexSlideRight = function(){
  if(curSlide === maxSlide - 1){
    curSlide = 0;
  } else {
    curSlide++;
  }
  //-100%, 0%, 100%, 200%;
  goToSlide(curSlide);
  activateDot(curSlide);
}
const nexSlideLeft = function(){
  if(curSlide === 0){
    curslide = maxSlide - 1;
  } else {
    curSlide--;
  }
  //100%, 200%, 300%, 400%;
  goToSlide(curSlide);
  activateDot(curSlide);
}

btnSliderRight.addEventListener('click', nexSlideRight);
btnSliderLeft.addEventListener('click', nexSlideLeft);

///////////////////////////////////////
//SLIDER PART2

//Slide with arrows
document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowLeft') nexSlideLeft();
  if(e.key === 'ArrowRight') nexSlideRight();
});

dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    //Destructuring
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

///////////////////////////////////////
//LIFECYCLE DOM ELEMENTS
document.addEventListener('DOMContentLoaded', function(e){
  console.log('HTML parsed and DOM tree built!', e);
});
window.addEventListener('load', function(e){
  console.log('Page fully loaded', e);
});
// window.addEventListener('beforeunload', function(e){
//   //Ask the user to close the tab
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

///////////////////////////////////////
//SELECTING, CREATING AND DELETING ELEMENTS
/*
//Selecting elements
console.log(document.documentElement);
console.log(document.body);
console.log(document.head);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); //Returns an HTML collection, instead of a nodeList, it does update whereas nodeList does not

console.log(document.getElementsByClassName('btn'));

//Creating and inserting elements
//.insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
//message.textContent = 'We used cookies for improved functionality and analytics'
message.innerHTML = 'We used cookies for improved functionality and analytics <button class="btn btn--close-cookies">Got it!</button>'
header.append(message);
//header.prepend(message);  //Only the last message would be prepended since an alelement cannot exist at two places at the same time
                          //Unless we copy it

//header.append(message.cloneNode(true)) //Clone all child elements as well
//These methods insert elements as siblings
//header.before(message);
//header.after(message);

//Delete elements
document.querySelector('.btn--close-cookies').addEventListener('click', function() {
  message.remove();
});

///////////////////////////////////////
//STYLES, ATTRIBUTES AND CLASSES
//This sets inline styles
message.style.backgroundColor = '#37383d'
message.style.width = '120%'

//If we want to display any style it must be inline
console.log(message.style.height);
console.log(message.style.backgroundColor);
//This is a solution
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', '#28b4aa');

const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);

console.log(logo.getAttribute('alt'));
console.log(logo.getAttribute('src'));
logo.setAttribute('alt', 'Minimalist Banklist Logo')

//Data attributes
//Set tag in HTML element data-version-number
console.log(logo.dataset.versionNumber);

//Classes
// logo.classList.add
// logo.classList.remove
// logo.classList.toggle
// logo.classList.contains

//DO NOT USE, it will override previous classes
//logo.className
*/

///////////////////////////////////////
//EVENT PROPAGATION IN PRACTICE
/*
rgb(255, 255, 255)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>`rgb(${randomInt(0,255)}, ${randomInt(0,255)}, ${randomInt(0,255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('Link', e.target, e.currentTarget);

  //Stop propagation
  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('Link', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('Link', e.target, e.currentTarget);
}, true);*/

///////////////////////////////////////
//DOM TRAVERSING
/*
//Going downwards: child
const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);//It provides very single direct child of the element
console.log(h1.children);//It provides very single direct child of the element, HTML collection!
h1.firstElementChild.style.color = 'orangered';
h1.lastElementChild.style.color = 'red';

//Going upwards: parent
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = ('var(--gradient-secondary)'); //Finds a parent element, no matter how far, in the DOM tree

//Going sideways
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

[...h1.parentElement.children].forEach(function(el){
  if(el !== h1) el.style.transform = 'scale(0.5)';
})*/


