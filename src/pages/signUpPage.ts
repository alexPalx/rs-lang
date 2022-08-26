import API from '../api/api';
import Component from '../common/component';
import Constants from '../common/constants';
import View from '../components/view/view';
import { CreateUserRequestData } from '../interfaces/typesAPI';
import Router from '../router/router';

export default class AuthPage extends Component {
  private view: View;

  public usernameBlock: Component<HTMLElement>;
  public usernameLabel: Component<HTMLElement>;
  public emailBlock: Component<HTMLElement>;
  public emailLabel: Component<HTMLElement>;
  public passwordBlock: Component<HTMLElement>;
  public passwordLabel: Component<HTMLElement>;
  public inputEmailField: Component<HTMLInputElement>;
  public signUpButton: Component<HTMLButtonElement>;
  public inputPassField: Component<HTMLInputElement>;
  public inputNameField: Component<HTMLInputElement>;

  constructor(parentElement: HTMLElement, view: View) {
    super(parentElement, 'div', 'signup-wrapper');
    this.view = view;

    this.usernameBlock = new Component(this.node, 'div', 'signup-name');
    this.usernameLabel = new Component(this.usernameBlock.node, 'h3', 'signup-name-label', 'Имя:');
    this.inputNameField = new Component<HTMLInputElement>(
      this.usernameBlock.node,
      'input',
      'signup-name-input'
    );
    this.inputNameField.node.type = 'text';
    this.inputNameField.node.placeholder = 'Екатерина';

    this.emailBlock = new Component(this.node, 'div', 'signup-email');
    this.emailLabel = new Component(this.emailBlock.node, 'h3', 'signup-email-label', 'Почта:');
    this.inputEmailField = new Component<HTMLInputElement>(
      this.emailBlock.node,
      'input',
      'signup-email-input'
    );
    this.inputEmailField.node.type = 'email';
    this.inputEmailField.node.placeholder = 'email@example.com';

    this.passwordBlock = new Component(this.node, 'div', 'signup-password');
    this.passwordLabel = new Component(
      this.passwordBlock.node,
      'h3',
      'signup-password-label',
      'Пароль:'
    );
    this.inputPassField = new Component<HTMLInputElement>(
      this.passwordBlock.node,
      'input',
      'signup-password-input'
    );
    this.inputPassField.node.type = 'password';
    this.inputPassField.node.placeholder = '********';

    this.signUpButton = new Component<HTMLButtonElement>(
      this.node,
      'button',
      'button signup-button',
      'Регистрация'
    );

    this.signUpButton.node.onclick = async () => {
      const userInfo: CreateUserRequestData = {
        name: this.inputNameField.node.value,
        email: this.inputEmailField.node.value,
        password: this.inputPassField.node.value,
      };

      const responseData = await API.users.createUser(userInfo);
      if (responseData) {
        this.view.ui.generateAuthBlock();
        Router.goTo(new URL(`http://${window.location.host}/${Constants.routes.signin}`));
      }
    };
  }
}
