import Component from '../../common/component';

export default class NavLink extends Component {
  public image: Component<HTMLImageElement>;
  public text: Component;

  constructor(parentNode: HTMLElement, href: string, imgSrc: string, imgAlt: string, text: string) {
    super(parentNode, 'a');
    (<HTMLAnchorElement>this.node).href = href;
    this.image = new Component(this.node, 'img');
    this.image.node.src = imgSrc;
    this.image.node.alt = imgAlt;
    this.text = new Component(this.node, 'p', '', text);
  }
}
