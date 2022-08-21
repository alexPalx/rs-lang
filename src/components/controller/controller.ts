import Constants from '../../common/constants';
import Router from '../../router/router';
import View from '../view/view';

export default class Controller {
  private view: View;

  constructor() {
    this.view = new View();
    if (Constants.UserMetadata) console.warn('logged in user');
    // TODO: rewrite UI with Component
    // this.view.UI...
    Router.view = this.view;
    Router.init();
  }
}
