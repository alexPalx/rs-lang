import Component from '../../common/component';

export default class Footer extends Component {
  public schoolAndDesc: Component;
  public schoolLink: Component<HTMLAnchorElement>;
  public image: Component<HTMLImageElement>;
  public appDesc: Component;
  public devsWrapper: Component;
  public devsHeading: Component;
  public listsWrapper: Component;

  public dev0List: Component;
  public dev0Name: Component;
  public dev0Git: Component;
  public dev0GitLink: Component<HTMLAnchorElement>;
  public dev0GitImg: Component<HTMLImageElement>;
  public dev0GitNotation: Component;
  public dev0Linked: Component;
  public dev0LinkedLink: Component<HTMLAnchorElement>;
  public dev0LinkedImg: Component<HTMLImageElement>;
  public dev0LinkedNotation: Component;

  public dev1List: Component;
  public dev1Name: Component;
  public dev1Git: Component;
  public dev1GitLink: Component<HTMLAnchorElement>;
  public dev1GitImg: Component<HTMLImageElement>;
  public dev1GitNotation: Component;
  public dev1Linked: Component;
  public dev1LinkedLink: Component<HTMLAnchorElement>;
  public dev1LinkedImg: Component<HTMLImageElement>;
  public dev1LinkedNotation: Component;

  public dev2List: Component;
  public dev2Name: Component;
  public dev2Git: Component;
  public dev2GitLink: Component<HTMLAnchorElement>;
  public dev2GitImg: Component<HTMLImageElement>;
  public dev2GitNotation: Component;
  public dev2Linked: Component;
  public dev2LinkedLink: Component<HTMLAnchorElement>;
  public dev2LinkedImg: Component<HTMLImageElement>;
  public dev2LinkedNotation: Component;

  public year: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'footer', 'footer');
    this.schoolAndDesc = new Component(this.node, 'div', 'school-description');
    this.schoolLink = new Component(this.schoolAndDesc.node, 'a');
    this.schoolLink.node.href = 'https://rs.school/js/';
    this.schoolLink.node.target = '_blank';
    this.image = new Component(this.schoolLink.node, 'img', 'rs-logo');
    this.image.node.src = './assets/svg/rs_school.svg';
    this.image.node.alt = 'rs-logo';
    this.appDesc = new Component(
      this.schoolAndDesc.node,
      'p',
      'description',
      'RS Lang – приложение для изучения иностранных слов, включающее электронный учебник с базой слов для изучения, мини-игры для их повторения, страницу статистики для отслеживания индивидуального прогресса.'
    );
    this.devsWrapper = new Component(this.node, 'div', 'developers');
    this.devsHeading = new Component(this.devsWrapper.node, 'h3', 'dev-heading', 'Разработчики');
    this.listsWrapper = new Component(this.devsWrapper.node, 'div', 'lists-wrapper');

    this.dev0List = new Component(this.listsWrapper.node, 'ul', 'dev-list');
    this.dev0Name = new Component(this.dev0List.node, 'li', 'item', 'Алексей Палюхович');
    this.dev0Git = new Component(this.dev0List.node, 'li', 'item');
    this.dev0GitLink = new Component(this.dev0Git.node, 'a', 'item-link');
    this.dev0GitLink.node.href = 'https://github.com/alexPalx';
    this.dev0GitLink.node.target = '_blank';
    this.dev0GitImg = new Component(this.dev0GitLink.node, 'img', 'social-img');
    this.dev0GitImg.node.src = './assets/svg/github.svg';
    this.dev0GitNotation = new Component(this.dev0GitLink.node, 'p', 'social-name', 'GitHub');

    this.dev0Linked = new Component(this.dev0List.node, 'li', 'item');
    this.dev0LinkedLink = new Component(this.dev0Linked.node, 'a', 'item-link');
    this.dev0LinkedLink.node.href =
      'https://www.linkedin.com/in/%D0%B0%D0%BB%D0%B5%D0%BA%D1%81%D0%B5%D0%B9-undefined-156b77241/';
    this.dev0LinkedLink.node.target = '_blank';
    this.dev0LinkedImg = new Component(this.dev0LinkedLink.node, 'img', 'social-img');
    this.dev0LinkedImg.node.src = './assets/svg/linkedin.svg';
    this.dev0LinkedNotation = new Component(
      this.dev0LinkedLink.node,
      'p',
      'social-name',
      'LinkedIn'
    );

    this.dev1List = new Component(this.listsWrapper.node, 'ul', 'dev-list');
    this.dev1Name = new Component(this.dev1List.node, 'li', 'item', 'Виталий Дреко');
    this.dev1Git = new Component(this.dev1List.node, 'li', 'item');
    this.dev1GitLink = new Component(this.dev1Git.node, 'a', 'item-link');
    this.dev1GitLink.node.href = 'https://github.com/dokahp';
    this.dev1GitLink.node.target = '_blank';
    this.dev1GitImg = new Component(this.dev1GitLink.node, 'img', 'social-img');
    this.dev1GitImg.node.src = './assets/svg/github.svg';
    this.dev1GitNotation = new Component(this.dev1GitLink.node, 'p', 'social-name', 'GitHub');

    this.dev1Linked = new Component(this.dev1List.node, 'li', 'item');
    this.dev1LinkedLink = new Component(this.dev1Linked.node, 'a', 'item-link');
    this.dev1LinkedLink.node.href = 'https://www.linkedin.com/in/vitali-dreko/';
    this.dev1LinkedLink.node.target = '_blank';
    this.dev1LinkedImg = new Component(this.dev1LinkedLink.node, 'img', 'social-img');
    this.dev1LinkedImg.node.src = './assets/svg/linkedin.svg';
    this.dev1LinkedNotation = new Component(
      this.dev1LinkedLink.node,
      'p',
      'social-name',
      'LinkedIn'
    );

    this.dev2List = new Component(this.listsWrapper.node, 'ul', 'dev-list');
    this.dev2Name = new Component(this.dev2List.node, 'li', 'item', 'Сергей Черняк');
    this.dev2Git = new Component(this.dev2List.node, 'li', 'item');
    this.dev2GitLink = new Component(this.dev2Git.node, 'a', 'item-link');
    this.dev2GitLink.node.href = 'https://github.com/atcherdsd';
    this.dev2GitLink.node.target = '_blank';
    this.dev2GitImg = new Component(this.dev2GitLink.node, 'img', 'social-img');
    this.dev2GitImg.node.src = './assets/svg/github.svg';
    this.dev2GitNotation = new Component(this.dev2GitLink.node, 'p', 'social-name', 'GitHub');

    this.dev2Linked = new Component(this.dev2List.node, 'li', 'item');
    this.dev2LinkedLink = new Component(this.dev2Linked.node, 'a', 'item-link');
    this.dev2LinkedLink.node.href = 'https://www.linkedin.com/in/sergei-cherniak/';
    this.dev2LinkedLink.node.target = '_blank';
    this.dev2LinkedImg = new Component(this.dev2LinkedLink.node, 'img', 'social-img');
    this.dev2LinkedImg.node.src = './assets/svg/linkedin.svg';
    this.dev2LinkedNotation = new Component(
      this.dev2LinkedLink.node,
      'p',
      'social-name',
      'LinkedIn'
    );
    this.year = new Component(this.devsWrapper.node, 'p', 'year', '© 2022 - All Rights Reserved');
  }
}
