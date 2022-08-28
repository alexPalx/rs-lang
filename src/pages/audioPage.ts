import Component from '../common/component';
import { QueryParam, WordsQuery } from '../interfaces/types';

export default class AudioPage extends Component {
  static level = 0;
  public wrapper: Component;

  public content: Component;

  public queryObj: WordsQuery = { group: '0', page: '0' };

  constructor(parentElement: HTMLElement, params: QueryParam[] | null) {
    super(parentElement);
    this.wrapper = new Component(this.node);
    this.content = new Component(this.wrapper.node, 'div', '');

    if (params) {
      const query = params.map((el) => Object.values(el));
      this.queryObj = Object.fromEntries(query);
    }
  }
}