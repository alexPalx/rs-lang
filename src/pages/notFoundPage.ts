import Component from '../common/component';

export default class NotFoundPage extends Component {
  public wrapper: Component;

  public image404: Component<HTMLImageElement>;
  public heading: Component;
  public text: Component;
  public goBackBtn: Component<HTMLAnchorElement>;
  constructor(parentElement: HTMLElement) {
    super(parentElement, 'div', 'wrapper-404');
    this.wrapper = this;
    this.image404 = new Component(this.wrapper.node, 'img', 'image-404');
    this.image404.node.src = './assets/img/404.png';
    this.heading = new Component(this.wrapper.node, 'h1', 'heading-404', 'Oops!');
    this.text = new Component(this.wrapper.node, 'p', 'text-404', 'Страница не найдена');
    this.goBackBtn = new Component(this.wrapper.node, 'a', 'go-back-404', 'Вернуться на главную');
    this.goBackBtn.node.href = '/';
  }
}
