import './sass/main.scss';
import App from './components/app/app';
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

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
