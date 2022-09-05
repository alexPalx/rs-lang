import Component from '../../common/component';
import { UserWord } from '../../interfaces/typesAPI';

export default class WordStatistics extends Component {
  private wordData: UserWord;
  public header: Component;
  public closeBtn: Component;
  public table: Component;

  constructor(parent: Component, word: string, wordData: UserWord) {
    super(parent.node, 'div', 'word-statistics');
    this.wordData = wordData;
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
 
  drawStatistics(): string {
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
    <td>Спринт</td><td>${this.wordData.optional?.sprintWins || 0}</td><td>${
      this.wordData.optional?.sprintLoses || 0
    }</td></tr>
    <tr>
    <td>Аудиовызов</td><td>${this.wordData.optional?.audioWins || 0}</td><td>${this.wordData.optional?.audioLoses || 0}</td></tr>
    </tbody>
    </tr>`;
  }
}
