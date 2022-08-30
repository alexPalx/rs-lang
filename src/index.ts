import './sass/main.scss';
import 'animate.css';
import App from './components/app/app';

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
