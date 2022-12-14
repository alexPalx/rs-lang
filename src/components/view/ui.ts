import Component from '../../common/component';
import Constants from '../../common/constants';
import Router from '../../router/router';
import { closeNav, openNav } from '../sidenav';
import Footer from './footer';
import NavLink from './navLink';

export default class UI {
  public header: Component;
  public logo: Component<HTMLImageElement>;
  public navMobileWrapper: Component;
  public navLogo: Component<HTMLImageElement>;
  public hamburger: Component;
  private hamburgerLine0: Component;
  private hamburgerLine1: Component;
  private hamburgerLine2: Component;

  public authBlock: Component | undefined;
  public signInButton: Component<HTMLAnchorElement> | undefined;
  public signUpButton: Component<HTMLAnchorElement> | undefined;
  public logOutButton: Component<HTMLButtonElement> | undefined;

  public main: Component;
  public aside: Component;

  public nav: Component;
  public navLinkMain: NavLink;
  public navLinkEbook: NavLink;
  public navLinkGames: NavLink;
  public navLinkStats: NavLink;
  public navLinkAbout: NavLink;

  public mainContent: Component;

  public footer: Component;

  constructor() {
    // ────────── header ────────────────────────────────────────────────────────────────┐
    this.header = new Component(document.body, 'header', 'header');

    this.hamburger = new Component(this.header.node, 'div', 'hamburger openbtn');
    this.hamburger.node.id = 'hamburger';
    this.hamburger.node.onclick = () => {
      if (this.hamburger.node.classList.contains('is-active')) {
        closeNav();
      } else {
        openNav();
      }
      this.hamburger.node.classList.toggle('is-active');
    };
    this.hamburgerLine0 = new Component(this.hamburger.node, 'span', 'line');
    this.hamburgerLine1 = new Component(this.hamburger.node, 'span', 'line');
    this.hamburgerLine2 = new Component(this.hamburger.node, 'span', 'line');

    this.logo = new Component(this.header.node, 'img', 'logo-img');
    this.logo.node.src = './assets/img/logo-white.png';
    this.generateAuthBlock();
    // ───────────────────────────────────────────────────────────────────────────────────┘

    // ────────── main ───────────────────────────────────────────────────────────────────┐
    this.main = new Component(document.body, 'main');
    this.aside = new Component(this.main.node, 'aside');

    this.nav = new Component(this.aside.node, 'nav', 'sidenav');
    this.nav.node.id = 'sidenav';
    this.navMobileWrapper = new Component(this.nav.node, 'div', 'nav-mobile-wrapper');
    this.navLogo = new Component(this.navMobileWrapper.node, 'img', 'nav-logo');
    this.navLogo.node.src = './assets/img/logo-prime.png';
    this.nav.node.onclick = () => {
      if (window.screen.width < 475) {
        closeNav();
        this.hamburger.node.classList.toggle('is-active');
      }
    };
    this.navLinkMain = new NavLink(
      this.nav.node,
      `/${Constants.routes.main}`,
      './assets/svg/house.svg',
      'main-page',
      'Главная'
    );
    this.navLinkEbook = new NavLink(
      this.nav.node,
      `/${Constants.routes.ebook}`,
      './assets/svg/notebook.svg',
      'electronic-book-page',
      'Учебник'
    );
    this.navLinkGames = new NavLink(
      this.nav.node,
      `/${Constants.routes.games}`,
      './assets/svg/game.svg',
      'audio-game-page',
      'Игры'
    );
    this.navLinkStats = new NavLink(
      this.nav.node,
      `/${Constants.routes.statistics}`,
      './assets/svg/menu-statistic.svg',
      'statistics-page',
      'Статистика'
    );
    this.navLinkAbout = new NavLink(
      this.nav.node,
      `/${Constants.routes.about}`,
      './assets/svg/team.svg',
      'sprint-game-page',
      'О команде'
    );

    this.mainContent = new Component(this.main.node, 'div');
    this.mainContent.node.id = 'main';
    // ───────────────────────────────────────────────────────────────────────────────────┘

    // ────────── footer ─────────────────────────────────────────────────────────────────┐
    this.footer = new Footer(document.body);
    // ───────────────────────────────────────────────────────────────────────────────────┘
  }

  public generateAuthBlock(loggedIn = false) {
    this.authBlock?.destroy();

    this.authBlock = new Component(this.header.node, 'div', 'auth-block');

    if (loggedIn) {
      this.logOutButton = new Component(this.authBlock.node, 'button', 'logout', 'Выйти');
      this.logOutButton.node.onclick = () => {
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        Constants.UserMetadata = null;
        const currentLocation = window.location.href
        window.location.href = currentLocation;
      };
    } else {
      this.signInButton = new Component(this.authBlock.node, 'a', 'signin', 'Войти');
      this.signInButton.node.href = `/${Constants.routes.signin}`;
      this.signUpButton = new Component(this.authBlock.node, 'a', 'signup', 'Регистрация');
      this.signUpButton.node.href = `/${Constants.routes.signup}`;
    }

    Router.updateListeners();
  }
}
