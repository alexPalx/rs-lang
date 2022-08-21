import Router from '../../router/router';
import View from '../view/view';

export default class Controller {
  private view: View;

  private router: Router;

  constructor() {
    this.view = new View();
    this.router = new Router(this.view);
  }
}