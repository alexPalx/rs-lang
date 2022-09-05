import Component from '../../common/component';

export default class Popup extends Component {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'popup', 'Ошибка!');
    this.node.style.display = 'none';
  }

  public show(): void {
    this.node.style.display = 'block';
  }

  public hide(): void {
    this.node.style.display = 'none';
  }

  public setContent(content: string): void {
    this.node.textContent = content;
  }
}
