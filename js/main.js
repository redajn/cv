let isHoveringMenu = false;

// ----------------Section reveal on scroll
ScrollReveal().reveal('.reveal', {
  distance: '50px',
  duration: 3000,
  origin: 'bottom',
  easing: 'ease',
  interval: 100,
  reset: true
});

const backToTop = document.getElementById('back-to-top');
const mainNav = document.getElementById('main');
const menuArea = document.getElementById('menu-area');

// -----------------Scroll buttons revealing and back to top functionality
window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    backToTop.classList.add('visible');
    if (!isHoveringMenu) {
      mainNav.classList.remove('visible');
      mainNav.classList.add('hidden');
    }
  } else {
    backToTop.classList.remove('visible');
    mainNav.classList.remove('hidden');
    mainNav.classList.add('visible');
  }
});

// -----------------Menu visibility on hover
function showMenu() {
  mainNav.classList.remove('hidden');
  mainNav.classList.add('visible');
}

function hideMenu() {
  if (!isHoveringMenu && window.scrollY > 200) {
    mainNav.classList.remove('visible');
    mainNav.classList.add('hidden');
  }
}

menuArea.addEventListener('mouseenter', () => {
  isHoveringMenu = true;
  showMenu();
});
menuArea.addEventListener('mouseleave', () => {
  isHoveringMenu = false;
  hideMenu();
});
mainNav.addEventListener('mouseenter', () => {
  isHoveringMenu = true;
  showMenu();
});
