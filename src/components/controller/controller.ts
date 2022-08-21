import Router from '../../router/router';
import View from '../view/view';

export default class Controller {
  private view: View;

  constructor() {
    this.view = new View();
    Router.view = this.view;
    Router.init();
  }
}
