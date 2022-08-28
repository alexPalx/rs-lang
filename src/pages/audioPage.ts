import Component from '../common/component';
import { QueryParam, WordsQuery } from '../interfaces/types';

export default class AudioPage extends Component {
  static level = 0;
  public wrapper: Component;

  public content: Component;

  constructor(parentElement: HTMLElement, params: QueryParam[] | null) {
    super(parentElement);
    this.wrapper = new Component(this.node);
    this.content = new Component(this.wrapper.node, 'div', '');

    let queryObj: WordsQuery = { group: '0', page: '0' };
    if (params) {
      const query = params.map((el) => Object.values(el));
      queryObj = Object.fromEntries(query);
    }

  }
}