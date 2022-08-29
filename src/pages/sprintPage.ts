import Component from '../common/component';
import Constants from '../common/constants';
import { QueryParam, WordsQuery } from '../interfaces/types';
import { Word } from '../interfaces/typesAPI';
import Router from '../router/router';
import Utils from '../utils/utils';

const answersSeriesHTML = `
  <div class="answers-series">
    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 
        17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"></path>
      </svg>
  </div>
`;
const exitGameHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"
      style="width: 20px; height: 20px;">
    <path d="M.974 0L0 .974 5.026 6 0 11.026.974 12 6 6.974 
      11.026 12l.974-.974L6.974 6 12 .974 11.026 0 6 5.026z">
    </path>
  </svg>
`;

enum GameTime {
  InitialTime = 4,
  TimeForGame = 60
}
enum TextColor {
  LessThan10 = 'yellow',
  LessThan5 = 'red'
}

export default class SprintPage extends Component {
  static level = 0;
  static scoreTotal = 0;
  static correctAnswersSeries = 0;
  static scoreGrowth = 10;
  static indexGameMove = 0;
  private static arrayCorrectAnswers: number[] = [];
  private static arrayIncorrectAnswers: number[] = [];
  static collectionWordsFromServer: (Word)[] = [];
  static arrayOfRandomGameWordsKeys: number[] = [];
  static drawInitialStartPage: () => void;
  static startGame: () => void;
  static renderDataGameboard: () => void;
  static setValuesKeyboardKeys: (event: KeyboardEvent) => void;
  static showGameResults: () => void;
  static checkUserAnswer: (answer: boolean) => void;

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
  public manageGame: () => Promise<void>;
  public getWordsForGame: () => Promise<void>;
  public getWords: (query: WordsQuery) => Promise<Word[]>;
  public hideLoader: () => void;

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

    this.manageGame = async () => {
      SprintPage.scoreTotal = 0;
      SprintPage.correctAnswersSeries = 0;
      SprintPage.scoreGrowth = 10;
      SprintPage.indexGameMove = 0;
      SprintPage.arrayCorrectAnswers = [];
      SprintPage.arrayIncorrectAnswers = [];

      await this.getWordsForGame();
      
      SprintPage.drawInitialStartPage();
    }

    this.getWords = async (query: WordsQuery): Promise<Word[]> => {
      try {
        const rawResponse = await fetch(
          Utils.buildLink(['words'], [`group=${query.group}`, `page=${query.page}`])
        );
        if (!rawResponse.ok) throw new Error('Server error');
        const content: Word[] = await rawResponse.json();
        console.log('2: this.getWords work');
        return content;
      } catch (err) {
        console.error((<Error>err).message);
        throw err;
      }
    }
    // ------ 1
    this.getWordsForGame = async (): Promise<void> => {
      if (SprintPage.collectionWordsFromServer.length === 0) {
        const tempCollectionWords: Promise<Word[]>[] = [];

        for (let i = 0; i <= 29; i += 1) {
          const group = String(SprintPage.level);
          const page = String(i);
          this.queryObj = { group, page };
          tempCollectionWords.push(this.getWords(this.queryObj));
        }
        SprintPage.collectionWordsFromServer = (await Promise.all(tempCollectionWords)).flat();
      }
      const arrayOfWordsKeysFromServer = Object.keys(SprintPage.collectionWordsFromServer);

      console.log('3: getWordsForGame work \n arrayOfWordsKeysFromServer \n 4: норм', 
      arrayOfWordsKeysFromServer);

      while (SprintPage.arrayOfRandomGameWordsKeys.length <
        SprintPage.collectionWordsFromServer.length) {
        
        const keyRandom = arrayOfWordsKeysFromServer
          .splice(Math.floor(Math.random() * arrayOfWordsKeysFromServer.length), 1);

        SprintPage.arrayOfRandomGameWordsKeys.push(+keyRandom);
      }
    }
    // ------ 2
    this.hideLoader = (): void => {
      this.iconLoaderWrapper.node.classList.add('game-hidden');
    }

    SprintPage.drawInitialStartPage = (): void => {
      this.hideLoader();
      this.counterBeforeGame.node.classList.remove('game-hidden');

      let timeToStart = GameTime.InitialTime;
      console.log('5 drawInitialStartPage work', timeToStart);

      const countdownToStart = setInterval(() => {
        if (timeToStart <= GameTime.InitialTime && timeToStart > 0) {
          this.counterBeforeGame.node.innerHTML = `
            <div class="time-to-start">${timeToStart}<span class="circle-time"></span></div>
            <div class="ready">Приготовьтесь</div>
          `;
          timeToStart -= 1;
        } else {
          clearInterval(countdownToStart);
          SprintPage.startGame();
        }
      }, 1000);
      
      console.log('6 countdownToStart', countdownToStart);
      const CONTENT = document.querySelector('.content') as HTMLDivElement;
      const LINK = document.getElementsByTagName('a');
      window.addEventListener('click', function clearCountdown(e) {
        const target = e.target as HTMLElement;
        if (!CONTENT.contains(target) &&
          Array.from(LINK).find((element): boolean => element.contains(target))) 
        {
          clearInterval(countdownToStart);
          window.removeEventListener('click', clearCountdown);
        }
      });
    }
    // ------ 3
    SprintPage.startGame = (): void => {
      
      this.exitGame.node.innerHTML = exitGameHTML;
      this.counterBeforeGame.node.classList.add('game-hidden');
      this.counterBeforeGame.node.innerHTML = '';
      this.sprintGameContainer.node.classList.remove('game-hidden');
  
      let timeToEnd = GameTime.TimeForGame;
      const countdownToEnd = setInterval(() => {
        timeToEnd -= 1;
        this.timerContainer.node.textContent = `${timeToEnd}`;
        if (timeToEnd < 10 && timeToEnd > 5) {
          this.timerContainer.node.style.color = TextColor.LessThan10;
        } else if (timeToEnd <= 5) {
          this.timerContainer.node.style.color = TextColor.LessThan5;
        }
        console.log('7 timeToEnd строка 218', timeToEnd);
      }, 1000);
  
      SprintPage.renderDataGameboard();

      document.addEventListener('keydown', SprintPage.setValuesKeyboardKeys);

      const actionsAfterTimeout = setTimeout(() => {
        if (SprintPage.collectionWordsFromServer.length > 0) {
          clearInterval(countdownToEnd);
          document.removeEventListener('keydown', SprintPage.setValuesKeyboardKeys);
          SprintPage.showGameResults();
        }
      }, 60000);
        
      this.sprintGameButtons.node.addEventListener('click', (e) => {
        const target = e.target as HTMLDivElement;

        if (target.classList.contains('sprint-game__button')) {
          
          const userAnswer = target.className.includes('correct') === true;
          SprintPage.checkUserAnswer(userAnswer);
          
          if (SprintPage.indexGameMove === SprintPage.arrayOfRandomGameWordsKeys.length) {
            clearInterval(countdownToEnd);
            clearTimeout(actionsAfterTimeout);
          }
        }
      });
      
      this.exitGame.node.addEventListener('click', () => {
        Router.goTo(new URL(`http://${window.location.host}/${Constants.routes.games}`));
        clearInterval(countdownToEnd);
        clearTimeout(actionsAfterTimeout);
      });

      const CONTENT = document.querySelector('.content') as HTMLDivElement;
      const LINK = document.getElementsByTagName('a');
      window.addEventListener('click', function changeValuesKeys(e) {
        const target = e.target as HTMLElement;
        if (!CONTENT.contains(target) &&
          Array.from(LINK).find((element): boolean => element.contains(target))) 
        {
          document.removeEventListener('keydown', SprintPage.setValuesKeyboardKeys);
          clearInterval(countdownToEnd);
          clearTimeout(actionsAfterTimeout);
          window.removeEventListener('click', changeValuesKeys);
        }
      });
    }
    // ------ 4
    SprintPage.renderDataGameboard = (): void =>  {

      this.sprintGameCounterScore.node.textContent = `${SprintPage.scoreTotal}`;
      console.log('9 renderDataGameboard work, this.sprintGameCounterScore.node.textContent', 
        this.sprintGameCounterScore.node.textContent);

      const answersSeries = document.querySelectorAll('.answers-series') as NodeListOf<HTMLElement>;
      answersSeries.forEach((item) => {
        const answer = item;
        answer.style.visibility = 'hidden';
      });
      if (SprintPage.correctAnswersSeries < 12) {
        for (let i = 0; i < SprintPage.correctAnswersSeries % 4; i += 1) {
          answersSeries[i].style.visibility = 'visible';
        }
      } else {
        answersSeries[0].style.visibility = 'hidden';
        answersSeries[1].style.visibility = 'visible';
        answersSeries[2].style.visibility = 'hidden';
      }
      if (SprintPage.correctAnswersSeries >= 12) {
        this.reward.node.classList.add('reward-green');
      } else {
        this.reward.node.classList.remove('reward-green');
      }

      this.reward.node.textContent = `+${SprintPage.scoreGrowth}`;
      
      console.log('10 this.reward.node.textContent:', this.reward.node.textContent);
      this.questionWord.node.textContent = SprintPage.collectionWordsFromServer[
        SprintPage.arrayOfRandomGameWordsKeys[SprintPage.indexGameMove]
      ].word;
  
      if (Math.random() > 0.5) {

        this.translateWord.node.textContent = SprintPage.collectionWordsFromServer[
          SprintPage.arrayOfRandomGameWordsKeys[SprintPage.indexGameMove]
        ].wordTranslate;
      } else {

        const indexRandomTranslation = Math.floor(
          Math.random() * SprintPage.collectionWordsFromServer.length
        );
        this.translateWord.node.textContent =
          SprintPage.collectionWordsFromServer[indexRandomTranslation].wordTranslate;
      }
    }
  }
}
