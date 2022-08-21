import API from '../api/api';
import Component from '../common/component';
import { LoginUserRequestData } from '../interfaces/typesAPI';

export default class AuthPage extends Component {
  public content: Component;
  public inputEmailField: Component<HTMLInputElement>;
  public signInButton: Component<HTMLButtonElement>;
  public inputPassField: Component<HTMLInputElement>;

  constructor(parentElement: HTMLElement) {
    super(parentElement);

    this.content = new Component(this.node, 'div', '');

    this.inputEmailField = new Component<HTMLInputElement>(this.content.node, 'input', '');
    this.inputEmailField.node.type = 'email';
    this.inputEmailField.node.placeholder = 'email@example.com';

    this.inputPassField = new Component<HTMLInputElement>(this.content.node, 'input', '');
    this.inputPassField.node.type = 'password';
    this.inputPassField.node.placeholder = '********';

    this.signInButton = new Component<HTMLButtonElement>(
      this.content.node,
      'button',
      'button',
      'Войти'
    );

    this.signInButton.node.onclick = async () => {
      const userInfo: LoginUserRequestData = {
        email: this.inputEmailField.node.value,
        password: this.inputPassField.node.value,
      };
      API.loginUser(userInfo);
    };
  }
}
