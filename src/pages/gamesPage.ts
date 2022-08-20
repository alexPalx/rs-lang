import { QueryParam } from '../interfaces/types';
import Component from '../common/component';

export default class GamesPage extends Component {
  public wrapper: Component;

  public content: Component;

  constructor(parentElement: HTMLElement, params: QueryParam[] | null) {
    super(parentElement);
    this.wrapper = new Component(this.node);
    this.content = new Component(this.wrapper.node, 'p', '', `GamesPage ${JSON.stringify(params)}`);
  }
}
