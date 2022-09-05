import Component from '../common/component';
import Router from '../router/router';
import Constants from '../common/constants';
import SprintPage from './sprintPage';

enum GameNames {
  SprintGameName = 'СПРИНТ',
  AudiocallGameName = 'АУДИОВЫЗОВ'
}

const sprintGameConditions = `
  <ul>
    <li>выберите верный перевод слова, выведенного на экран</li>
    <li>игра на время - у вас будет всего 60 секунд </li>
    <li>за ряд ответов без ошибок - бонус</li>
    <li>выберите сложность от 1 до 6 и начните играть!</li>
  </ul>
`;
const audiocallGameConditions = `
  <ul>
    <li>определите значение слова на слух</li>
    <li>время выполнения этого задания не ограничено </li>
    <li>каждое слово можно прослушать повторно</li>
    <li>выберите сложность от 1 до 6 и начните играть!</li>
  </ul>
`;
const drawGameContainerContent = (gameName: string, gameConditions: string): string => `
  <h2 class="level-container__title">${gameName}</h2>
  <div class="level-container__game-conditions">
      ${gameConditions}
  </div>
`;
const levelContainerButtons = `
  <button class="level-buttons__button level-buttons__1">1</button>
  <button class="level-buttons__button level-buttons__2">2</button>
  <button class="level-buttons__button level-buttons__3">3</button>
  <button class="level-buttons__button level-buttons__4">4</button>
  <button class="level-buttons__button level-buttons__5">5</button>
  <button class="level-buttons__button level-buttons__6">6</button>
`;

export default class GamesPage extends Component {
  public wrapper: Component;
  public levelContainer: Component;
  public sprintContainerContent: Component;
  public sprintContainerButtons: Component;
  public contentWrapper: Component;
  public audiocallContainerContent: Component;
  public audiocallContainerButtons: Component;
  public getRandomNumber: (min: number, max: number) => number;

  constructor(parentElement: HTMLElement) {
    super(parentElement, 'div', 'games-wrapper');

    this.wrapper = this;
    this.levelContainer = new Component(this.wrapper.node, 'div', 'level-container');

    this.sprintContainerContent = new Component(
      this.levelContainer.node, 'div', 'sprint-container__content'
    );
    this.sprintContainerContent.node.innerHTML = drawGameContainerContent(
      GameNames.SprintGameName, sprintGameConditions
    );
    this.sprintContainerButtons = new Component(
      this.sprintContainerContent.node, 'div', 'sprint-container__buttons'
    );
    this.sprintContainerButtons.node.innerHTML = levelContainerButtons;

    SprintPage.level = 0;

    this.contentWrapper = new Component(this.wrapper.node, 'div', 'content-wrapper');

    Array.from(this.sprintContainerButtons.node.children).forEach((button) => {
      button.addEventListener('click', () => {
        SprintPage.level = +<String>button.textContent - 1;

        Router.goTo(new URL(`http://${window.location.host}/${Constants.routes.sprint}`));
      });
    });

    this.audiocallContainerContent = new Component(
      this.levelContainer.node, 'div', 'audiocall-container__content'
    );
    this.audiocallContainerContent.node.innerHTML = drawGameContainerContent(
      GameNames.AudiocallGameName, audiocallGameConditions
    );
    this.audiocallContainerButtons = new Component(
      this.audiocallContainerContent.node, 'div', 'audiocall-container__buttons'
    );
    this.audiocallContainerButtons.node.innerHTML = levelContainerButtons;

    this.getRandomNumber = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    
    Array.from(this.audiocallContainerButtons.node.children).forEach((button) => {
      button.addEventListener('click', () => {

        Router.goTo(new URL(
          `http://${window.location.host}/${Constants.routes.audio}`
        ));
      });
    });
  }
}
