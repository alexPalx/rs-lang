import Constants from '../../common/constants';
import Control from '../../utils/control';

export default class UI extends Control {
  nav: Control<HTMLElement>;

  navButtonToMainPage: Control<HTMLAnchorElement>;

  navButtonEbook: Control<HTMLAnchorElement>;

  navButtonDictionary: Control<HTMLAnchorElement>;

  navButtonGames: Control<HTMLAnchorElement>;

  navButtonStatistics: Control<HTMLAnchorElement>;

  navButtonAbout: Control<HTMLAnchorElement>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'ui');

    this.nav = new Control(this.node, 'nav');

    this.navButtonToMainPage = new Control<HTMLAnchorElement>(this.nav.node, 'a', '', 'Главная');
    this.navButtonToMainPage.node.href = Constants.routes.main;

    this.navButtonEbook = new Control(this.nav.node, 'a', '', 'Учебник');
    this.navButtonEbook.node.href = Constants.routes.ebook;

    this.navButtonDictionary = new Control(this.nav.node, 'a', '', 'Словарь');
    this.navButtonDictionary.node.href = Constants.routes.dictionary;

    this.navButtonGames = new Control(this.nav.node, 'a', '', 'Игры');
    this.navButtonGames.node.href = Constants.routes.games;

    this.navButtonStatistics = new Control(this.nav.node, 'a', '', 'Статистика');
    this.navButtonStatistics.node.href = Constants.routes.statistics;

    this.navButtonAbout = new Control(this.nav.node, 'a', '', 'О команде');
    this.navButtonAbout.node.href = Constants.routes.about;
  }
}
