import './sass/main.scss';
import { closeNav, openNav } from './components/sidenav';

const hamburger = document.getElementById('hamburger');

hamburger?.addEventListener('click', () => {
  if (hamburger.classList.contains('is-active')) {
    closeNav();
  } else {
    openNav();
  }
  hamburger.classList.toggle('is-active');
});

