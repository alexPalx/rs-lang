import Content from './content';
import { closeNav, openNav } from '../sidenav';

export default class View {
  public content: Content;

  public hamburger: HTMLElement;

  constructor() {
    this.content = new Content();
    this.hamburger = <HTMLElement>document.getElementById('hamburger');

    this.hamburger.addEventListener('click', () => {
      if (this.hamburger.classList.contains('is-active')) {
        closeNav();
      } else {
        openNav();
      }
      this.hamburger.classList.toggle('is-active');
    });
  }
}
