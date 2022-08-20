import Control from '../utils/control';

export default class NotFoundPage extends Control {
  public wrapper: Control;

  public title: Control;

  public content: Control;

  constructor(
    parentElement: HTMLElement,
    error: { name: number; message: string } = { name: 404, message: 'Not Found' }
  ) {
    super(parentElement);
    this.wrapper = new Control(this.node);
    this.title = new Control(this.wrapper.node, 'h2', '', String(error.name));
    this.content = new Control(this.wrapper.node, 'p', '', error.message);
  }
}
