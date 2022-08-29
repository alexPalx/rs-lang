import Component from '../common/component';
import { QueryParam, WordsQuery } from '../interfaces/types';
import Router from '../router/router';

const answersSeriesHTML = `
  <div class="answers-series">
    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 
        17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"></path>
      </svg>
  </div>
`;

export default class SprintPage extends Component {
  static level = 0;
  public wrapper: Component;
  public exitWrapper: Component;
  public exitGame: Component;
  public iconLoaderWrapper: Component;
  public iconLoader: Component;
  public sprintGameContainer: Component;
  public counterBeforeGame: Component;
  public sprintGameCounter: Component;
  public timerContainer: Component;
  public sprintGameCounterScore: Component;
  public sprintGameContent: Component;
  public row1: Component;
  public wordVoicing: Component;
  public answersReward: Component;
  public reward: Component;
  public rewardText: Component;
  public questionWord: Component;
  public translateWord: Component;
  public sprintGameButtons: Component;
  public sprintWrongButton: Component;
  public sprintCorrectButton: Component;
  public resultsContainer: Component;

  public queryObj: WordsQuery = { group: '0', page: '0' };

  constructor(parentElement: HTMLElement, params: QueryParam[] | null) {
    super(parentElement, 'div', 'sprint-game-wrapper');

    this.wrapper = this;
    this.exitWrapper = new Component(this.wrapper.node, 'div', 'exit-wrapper');
    this.exitGame = new Component(this.exitWrapper.node, 'div', 'exit-game');

    this.iconLoaderWrapper = new Component(this.wrapper.node, 'div', 'icon-loader-wrapper');
    this.iconLoader = new Component(this.iconLoaderWrapper.node, 'div', 'icon-loader');

    this.sprintGameContainer = new Component(this.wrapper.node, 'div', 'sprint-game__container game-hidden');
    
    this.counterBeforeGame = new Component(this.wrapper.node, 'div', 'counter-before-game game-hidden');

    this.sprintGameCounter = new Component(this.sprintGameContainer.node, 'div', 'sprint-game__counter');
    this.timerContainer = new Component(this.sprintGameCounter.node, 'div', 'timer-container');
    this.timerContainer.node.textContent = '60';
    this.sprintGameCounterScore = new Component(this.sprintGameCounter.node, 'div', 'sprint-game-counter__score');
    this.sprintGameCounterScore.node.textContent ='0';

    this.sprintGameContent = new Component(this.sprintGameContainer.node, 'div', 'sprint-game__content');
    this.row1 = new Component(this.sprintGameContent.node, 'div', 'row1');
    this.row1.node.innerHTML = answersSeriesHTML.repeat(3);
    this.wordVoicing = new Component(this.row1.node, 'div', 'word-voicing');
    this.answersReward = new Component(this.sprintGameContent.node, 'div', 'answers-reward');
    this.reward = new Component(this.answersReward.node, 'span', 'reward');
    this.reward.node.textContent = '+10';
    this.rewardText = new Component(this.answersReward.node, 'span', 'reward-text');
    this.rewardText.node.textContent = ` очков за слово`;
    
    this.questionWord = new Component(this.sprintGameContent.node, 'div', 'question-word', '');
    this.translateWord = new Component(this.sprintGameContent.node, 'div', 'translate-word', '');

    this.sprintGameButtons = new Component(this.sprintGameContainer.node, 'div', 'sprint-game__buttons');
    this.sprintWrongButton = new Component(this.sprintGameButtons.node, 'div', 'sprint-game__button wrong-button', 'Неверно');
    this.sprintCorrectButton = new Component(this.sprintGameButtons.node, 'div', 'sprint-game__button correct-button', 'Верно');
    
    this.resultsContainer = new Component(this.wrapper.node, 'div', 'results__container game-hidden');

    if (params) {
      const query = params.map((el) => Object.values(el));
      this.queryObj = Object.fromEntries(query);
      Router.goTo(new URL(`
        http://${window.location.host}/sprint?group=${this.queryObj.group}&page=${
          this.queryObj.page
        }`));
    }
  }
}
