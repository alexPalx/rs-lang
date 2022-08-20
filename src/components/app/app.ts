import Controller from '../controller/controller';

export default class App {
  private controller: Controller | undefined;

  init() {
    this.controller = new Controller();
  }
}
