import './sass/main.scss';
import Controller from './components/controller/controller';
import { closeNav, openNav } from './components/sidenav';

const controller = new Controller();
const hamburger = document.getElementById('hamburger');

hamburger?.addEventListener('click', () => {
  if (hamburger.classList.contains('is-active')) {
    closeNav();
  } else {
    openNav();
  }
  hamburger.classList.toggle('is-active');
});

