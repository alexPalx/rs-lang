import View from '../components/view/view';
import { QueryParam } from '../interfaces/types';

export default class Router {
  private view: View;

  constructor(view: View) {
    this.view = view;
    this.init();
  }

  private init() {
    let url = `${new URL(window.location.href).pathname}${new URL(window.location.href).search}`;
    window.addEventListener('popstate', () => {
      url = `${new URL(window.location.href).pathname}${new URL(window.location.href).search}`;
      this.render(url);
    });
    document.querySelectorAll('[href^="/"]').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        let target = <Node>e.target;
        if (!(target instanceof HTMLAnchorElement)) {
          target = <Node>target.parentNode;
        }
        const path = new URL((<HTMLAnchorElement>target).href);
        this.goTo(path);
      });
    });
    this.render(url);
  }

  public render(path: string): void {
    const page = path.match(/\w+/);
    const queryString = path.split('?')[1];
    const queryParams: QueryParam[] | null = !queryString
      ? null
      : queryString.split('&').map((el) => ({
          param: el.split('=')[0],
          value: el.split('=')[1],
        }));

    this.view.content.setContent(page ? page[0] : '', queryParams);
  }

  public goTo(path: URL): void {
    const pathString = String(path);
    window.history.pushState({ pathString }, pathString, pathString);
    this.render(`${path.pathname}${path.search}`);
  }
}
