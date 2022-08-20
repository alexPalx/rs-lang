import Control from '../utils/control';

export default class GamesPage extends Control {
  public wrapper: Control;

  public content: Control;

  constructor(
    parentElement: HTMLElement,
    data: { message: string } = { message: 'Games content' }
  ) {
    super(parentElement);
    this.wrapper = new Control(this.node);
    this.content = new Control(this.wrapper.node, 'p', '', data.message);
  }
}
