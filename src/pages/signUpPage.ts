import API from '../api/api';
import Component from '../common/component';
import { CreateUserRequestData } from '../interfaces/typesAPI';

export default class AuthPage extends Component {
  public content: Component;
  public inputEmailField: Component<HTMLInputElement>;
  public signUpButton: Component<HTMLButtonElement>;
  public inputPassField: Component<HTMLInputElement>;
  public inputNameField: Component<HTMLInputElement>;

  constructor(parentElement: HTMLElement) {
    super(parentElement);

    this.content = new Component(this.node, 'div', '');

    this.inputNameField = new Component<HTMLInputElement>(this.content.node, 'input', '');
    this.inputNameField.node.type = 'text';
    this.inputNameField.node.placeholder = 'Екатерина';

    this.inputEmailField = new Component<HTMLInputElement>(this.content.node, 'input', '');
    this.inputEmailField.node.type = 'email';
    this.inputEmailField.node.placeholder = 'email@example.com';

    this.inputPassField = new Component<HTMLInputElement>(this.content.node, 'input', '');
    this.inputPassField.node.type = 'password';
    this.inputPassField.node.placeholder = '********';

    this.signUpButton = new Component<HTMLButtonElement>(
      this.content.node,
      'button',
      'button',
      'Регистрация'
    );

    this.signUpButton.node.onclick = async () => {
      const userInfo: CreateUserRequestData = {
        name: this.inputNameField.node.value,
        email: this.inputEmailField.node.value,
        password: this.inputPassField.node.value,
      };

      const responseData = await API.createUser(userInfo);
      if (responseData) console.log(responseData);
    };
  }
}