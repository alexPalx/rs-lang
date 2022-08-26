import API from '../api/api';
import Component from '../common/component';
import Constants from '../common/constants';
import View from '../components/view/view';
import { LoginUserRequestData } from '../interfaces/typesAPI';
import Router from '../router/router';

export default class AuthPage extends Component {
  private view: View;
  public inputEmailField: Component<HTMLInputElement>;
  public signInButton: Component<HTMLButtonElement>;
  public inputPassField: Component<HTMLInputElement>;
  public emailLabel: Component<HTMLElement>;
  public passwordLabel: Component<HTMLElement>;
  public emailBlock: Component<HTMLElement>;
  public passwordBlock: Component<HTMLElement>;

  constructor(parentElement: HTMLElement, view: View) {
    super(parentElement, 'div', 'signin-wrapper');
    this.view = view;

    this.emailBlock = new Component(this.node, 'div', 'signin-email');
    this.emailLabel = new Component(this.emailBlock.node, 'h3', 'signin-email-label', 'Почта:');
    this.inputEmailField = new Component<HTMLInputElement>(
      this.emailBlock.node,
      'input',
      'signin-email-input'
    );
    this.inputEmailField.node.type = 'email';
    this.inputEmailField.node.placeholder = 'email@example.com';

    this.passwordBlock = new Component(this.node, 'div', 'signin-password');
    this.passwordLabel = new Component(
      this.passwordBlock.node,
      'h3',
      'signin-password-label',
      'Пароль:'
    );
    this.inputPassField = new Component<HTMLInputElement>(
      this.passwordBlock.node,
      'input',
      'signin-password-input'
    );
    this.inputPassField.node.type = 'password';
    this.inputPassField.node.placeholder = '********';

    this.signInButton = new Component<HTMLButtonElement>(
      this.node,
      'button',
      'button singin-button',
      'Войти'
    );

    this.signInButton.node.onclick = async () => {
      const userInfo: LoginUserRequestData = {
        email: this.inputEmailField.node.value,
        password: this.inputPassField.node.value,
      };
      const response = await API.users.loginUser(userInfo);
      if (response) {
        this.view.ui.generateAuthBlock(true);
        Router.goTo(new URL(`http://${window.location.host}${Constants.LastPage}`));
      }
    };
  }
}
