import Control from '../utils/control';

export default class MainPage extends Control {
  public wrapper: Control;

  public content: Control;

  constructor(parentElement: HTMLElement, data: { message: string } = { message: 'Main content' }) {
    super(parentElement);
    this.wrapper = new Control(this.node);
    this.content = new Control(this.wrapper.node, 'p', '', data.message);
  }
}
