import Route from 'route-parser';
import Constants from '../common/constants';
import View from '../components/view/view';
import pages from '../pages/pages';

export default class Router {
  private view: View;

  private routes = {
    main: new Route(Constants.routes.main),
    ebook: new Route(Constants.routes.ebook),
    dictionary: new Route(Constants.routes.dictionary),
    games: new Route(Constants.routes.games),
    statistics: new Route(Constants.routes.statistics),
    about: new Route(Constants.routes.about),
  };

  constructor(view: View) {
    this.view = view;
    this.init();
  }

  private init() {
    window.addEventListener('popstate', () => {
      this.render(new URL(window.location.href).pathname);
    });
    document.querySelectorAll('[href^="/"]').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        let target = <Node>e.target;
        if (!(target instanceof HTMLAnchorElement)) {
          target = <Node>target.parentNode;
        }
        const path = new URL((<HTMLAnchorElement>target).href).pathname;
        this.goTo(path);
      });
    });
    this.render(new URL(window.location.href).pathname);
  }

  public render(path: string): void {
    let result = pages.notFound;

    if (this.routes.main.match(path)) {
      result = pages.main;
    } else if (this.routes.ebook.match(path)) {
      result = pages.ebook;
    } else if (this.routes.dictionary.match(path)) {
      result = pages.dictionary;
    } else if (this.routes.games.match(path)) {
      result = pages.games;
    } else if (this.routes.statistics.match(path)) {
      result = pages.statistics;
    } else if (this.routes.about.match(path)) {
      result = pages.about;
    }

    this.view.content.setContent(result);
  }

  public goTo(path: string): void {
    window.history.pushState({ path }, path, path);
    this.render(path);
  }
}
