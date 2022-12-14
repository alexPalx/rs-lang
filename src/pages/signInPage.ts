import API from '../api/api';
import Component from '../common/component';
import Constants from '../common/constants';
import Statistics from '../common/statisticsData';
import Popup from '../components/view/popup';
import View from '../components/view/view';
import { LoginUserRequestData } from '../interfaces/typesAPI';
import Router from '../router/router';

export default class AuthPage extends Component {
  private view: View;
  public popup: Popup;
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

    this.popup = new Popup(this.node);
    this.popup.hide();

    this.emailBlock = new Component(this.node, 'div', 'signin-email');
    this.emailLabel = new Component(this.emailBlock.node, 'h3', 'signin-email-label', 'Почта:');
    this.inputEmailField = new Component<HTMLInputElement>(
      this.emailBlock.node,
      'input',
      'signin-email-input'
    );
    this.inputEmailField.node.type = 'email';
    this.inputEmailField.node.placeholder = 'email@example.com';
    this.inputEmailField.node.required = true;

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
    this.inputPassField.node.required = true;

    this.signInButton = new Component<HTMLButtonElement>(
      this.node,
      'button',
      'button signin-button',
      'Войти'
    );

    this.signInButton.node.onclick = async () => {
      if (!this.inputEmailField.node.value) {
        this.inputEmailField.node.focus();
        this.popup.show();
        this.popup.setContent('Пожалуйста, введите вашу почту');
        return;
      }
      if (!this.inputPassField.node.value) {
        this.inputPassField.node.focus();
        this.popup.show();
        this.popup.setContent('Пожалуйста, введите ваш пароль');
        return;
      }
      const userInfo: LoginUserRequestData = {
        email: this.inputEmailField.node.value,
        password: this.inputPassField.node.value,
      };
      const response = await API.users.loginUser(userInfo);
      if (response) {
        Constants.UserMetadata = { token: response.token, userId: response.userId };
        this.view.ui.generateAuthBlock(true);
        Router.goTo(new URL(`http://${window.location.host}${Constants.LastPage}`));
        Statistics.init();
      } else {
        this.popup.show();
        this.popup.setContent('Неверная почта или пароль');
      }
    };
  }
}
