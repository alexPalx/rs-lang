import Content from './content';
import UI from './ui';

export default class View {
  public ui: UI;
  public content: Content;

  constructor() {
    this.ui = new UI();
    this.content = new Content(this);
  }
}
