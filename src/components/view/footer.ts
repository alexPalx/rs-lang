import Component from '../../common/component';

export default class Footer extends Component {
  public image: Component<HTMLImageElement>;
  public devsWrapper: Component;
  public dev0: Component<HTMLAnchorElement>;
  public dev1: Component<HTMLAnchorElement>;
  public dev2: Component<HTMLAnchorElement>;
  public year: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'footer', 'footer');
    this.image = new Component(this.node, 'img', 'rs-logo');
    this.image.node.src = './assets/svg/rs_school.svg';
    this.image.node.alt = 'rs-logo';
    this.devsWrapper = new Component(this.node, 'div', 'developers');

    this.dev0 = new Component(this.devsWrapper.node, 'a', '', 'Алексей Палюхович');
    this.dev0.node.href = 'https://github.com/alexPalx';
    this.dev0.node.target = '_blank';
    this.dev1 = new Component(this.devsWrapper.node, 'a', '', 'Виталий Дреко');
    this.dev1.node.href = 'https://github.com/dokahp';
    this.dev1.node.target = '_blank';
    this.dev2 = new Component(this.devsWrapper.node, 'a', '', 'Сергей Черняк');
    this.dev2.node.href = 'https://github.com/atcherdsd';
    this.dev2.node.target = '_blank';

    this.year = new Component(this.node, 'p', '', '2022');
  }
}
