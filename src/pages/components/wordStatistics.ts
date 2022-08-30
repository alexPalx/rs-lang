import Component from '../../common/component';

export default class WordStatistics extends Component {
  public header: Component;
  public closeBtn: Component;
  public table: Component;

  constructor(parent: Component, word: string) {
    super(parent.node, 'div', 'word-statistics');
    this.header = new Component(this.node, 'h1', 'statistics-header', `Статистика по слову: `);
    this.header.node.innerHTML += `<span class="word-name">${word}</span>`;
    this.closeBtn = new Component(this.node, 'div', 'close-btn');
    this.closeBtn.node.addEventListener('click', () => this.closeStatistics());
    this.table = new Component(this.node, 'table', 'greyGridTable');
    this.table.node.innerHTML = this.drawStatistics();
    
  }
  closeStatistics(): void {
    this.destroy();
  }
  // Параметры переделать, когда будет готова статистика
  drawStatistics(sprintTrue = 0, sprintFalse = 0, audioTrue = 0, audioFalse = 0): string {
    return `
    <thead>
    <tr>
    <th>Мини-игра</th>
    <th>Правильно</th>
    <th>Неправильно</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>Спринт</td><td>${sprintTrue}</td><td>${sprintFalse}</td></tr>
    <tr>
    <td>Аудиовызов</td><td>${audioTrue}</td><td>${audioFalse}</td></tr>
    </tbody>
    </tr>`;
  }
}
