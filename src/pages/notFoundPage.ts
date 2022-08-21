import Component from '../common/component';

export default class NotFoundPage extends Component {
  public wrapper: Component;

  public content: Component;

  constructor(parentElement: HTMLElement) {
    super(parentElement);
    this.wrapper = new Component(this.node);
    this.content = new Component(this.wrapper.node, 'p', '', 'NotFoundPage');
  }
}
