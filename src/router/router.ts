import View from '../components/view/view';
import { QueryParam } from '../interfaces/types';

export default class Router {
  public static view: View | undefined;

  public static init() {
    let url = `${new URL(window.location.href).pathname}${new URL(window.location.href).search}`;
    window.addEventListener('popstate', () => {
      url = `${new URL(window.location.href).pathname}${new URL(window.location.href).search}`;
      this.render(url);
    });
    this.updateListeners();
    this.render(url);
  }

  public static updateListeners(): void {
    document.querySelectorAll('[href^="/"]').forEach((item) => {
      const element = <HTMLElement>item;
      element.onclick = null;
      element.onclick = (e: Event) => {
        e.preventDefault();
        let target = <Node>e.target;
        if (!(target instanceof HTMLAnchorElement)) {
          target = <Node>target.parentNode;
        }
        const path = new URL((<HTMLAnchorElement>target).href);
        this.goTo(path);
      };
    });
  }

  public static render(path: string): void {
    const page = path.match(/\w+/);
    const queryString = path.split('?')[1];
    const queryParams: QueryParam[] | null = !queryString
      ? null
      : queryString.split('&').map((el) => ({
          param: el.split('=')[0],
          value: el.split('=')[1],
        }));

    this.view?.content.setContent(page ? page[0] : '', queryParams);
    this.updateListeners();
  }

  public static goTo(path: URL): void {
    const pathString = String(path);
    window.history.pushState({ pathString }, pathString, pathString);
    this.render(`${path.pathname}${path.search}`);
  }
}
