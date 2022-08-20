import { QueryParam } from '../interfaces/types';
import Control from '../utils/control';

export default class GamesPage extends Control {
  public wrapper: Control;

  public content: Control;

  constructor(parentElement: HTMLElement, params: QueryParam[] | null) {
    super(parentElement);
    this.wrapper = new Control(this.node);
    this.content = new Control(this.wrapper.node, 'p', '', `GamesPage ${JSON.stringify(params)}`);
  }
}
