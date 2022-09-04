import Component from '../common/component';
import Constants from '../common/constants';

export default class MainPage extends Component {
  public content: Component<HTMLElement>;
  public title: Component<HTMLElement>;
  public descriptionP1: Component<HTMLElement>;
  public descriptionP2: Component<HTMLElement>;
  public buttonSignUp: Component<HTMLAnchorElement>;
  public buttonSignIn: Component<HTMLAnchorElement>;
  public buttonsBlock: Component<HTMLElement>;

  constructor(parentElement: HTMLElement) {
    super(parentElement, 'div', 'main-wrapper');

    this.title = new Component(this.node, 'h2', 'main-title', 'RSLang');
    this.content = new Component(this.node, 'div', 'main-content');

    this.descriptionP1 = new Component(
      this.content.node,
      'div',
      'main-description-p1',
      'Используй быстрый и эффективный способ изучения английского языка.'
    );
    this.descriptionP2 = new Component(
      this.content.node,
      'div',
      'main-description-p2',
      'Все самые лучшие методики в одном месте.'
    );

    this.buttonsBlock = new Component(this.content.node, 'div', 'main-buttons');

    this.buttonSignUp = new Component(this.buttonsBlock.node, 'a', 'button main-signup-button');
    this.buttonSignUp.node.href = Constants.UserMetadata
      ? `/${Constants.routes.ebook}`
      : `/${Constants.routes.signup}`;
    this.buttonSignUp.node.textContent = Constants.UserMetadata ? 'Учебник' : 'Регистрация';

    this.buttonSignIn = new Component(this.buttonsBlock.node, 'a', 'button main-signin-button');
    this.buttonSignIn.node.href = Constants.UserMetadata
      ? `/${Constants.routes.games}`
      : `/${Constants.routes.signin}`;
    this.buttonSignIn.node.textContent = Constants.UserMetadata ? 'Игры' : 'Войти';
  }
}
