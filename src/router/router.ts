import Route from 'route-parser';
import Constants from '../common/constants';
import View from '../components/view/view';

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
    let result = '';

    const routes = Object.entries(this.routes);

    for (let i = 0; i < routes.length; i += 1) {
      if (routes[i][1].match(path)) {
        result = path;
        break;
      }
    }

    this.view.content.setContent(result);
  }

  public goTo(path: string): void {
    window.history.pushState({ path }, path, path);
    this.render(path);
  }
}
