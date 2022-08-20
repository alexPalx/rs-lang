import Content from './content';
import UI from './UI';

export default class View {
  public ui: UI;
  
  public content: Content;

  constructor(parentNode: HTMLElement) {
    this.ui = new UI(parentNode);
    this.content = new Content(parentNode);
  }
}
