import API from '../api/api';
import Component from '../common/component';
import Constants from '../common/constants';
import Statistics from '../common/statisticsData';
import { QueryParam, WordsQuery } from '../interfaces/types';
import { UserWordConfig, Word } from '../interfaces/typesAPI';
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
const drawResults = (scoreFinal: number, countCorrect: number, countIncorrect: number): string => `
  <h1 class="results-title">Итоговый счет: ${scoreFinal}</h1>
  <h2 class="content-evaluation"></h2>
  <div class="results-content">
    <div class="results-content__correct">
      <h3 class="content-title">Верные ответы: ${countCorrect}</h3>
      <ul class="correct-list"></ul>
    </div>
    <div class="results-content__incorrect">
      <h3 class="content-title">Ошибки: ${countIncorrect}</h3>
      <ul class="incorrect-list"></ul>
    </div>
  </div>
`;

enum GameTime {
  InitialTime = 4,
  TimeForGame = 60,
}
enum TextColor {
  LessThan10 = 'yellow',
  LessThan5 = 'red',
}

export default class SprintPage extends Component {
  static level = 0;
  static scoreTotal = 0;
  static correctAnswersSeries = 0;
  static scoreGrowth = 10;
  static indexGameMove = 0;
  private static arrayCorrectAnswers: number[] = [];
  private static arrayIncorrectAnswers: number[] = [];
  static collectionWordsFromServer: Word[] = [];
  static arrayOfRandomGameWordsKeys: number[] = [];
  static drawInitialStartPage: () => void;
  static startGame: () => void;
  private static countdownToEnd: NodeJS.Timer;
  static renderDataGameboard: () => void;
  static setValuesKeyboardKeys: (event: KeyboardEvent) => void;
  static showGameResults: () => void;
  static checkUserAnswer: (answer: boolean) => void;
  private static audioCorrectAnswer = new Audio('../../assets/audio/correctanswer.mp3');
  private static audioIncorrectAnswer = new Audio('../../assets/audio/incorrectanswer.mp3');
  static updateServerData: (word: Word, result: boolean) => Promise<void>;

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

    this.sprintGameContainer = new Component(
      this.wrapper.node,
      'div',
      'sprint-game__container game-hidden'
    );

    this.counterBeforeGame = new Component(
      this.wrapper.node,
      'div',
      'counter-before-game game-hidden'
    );

    this.sprintGameCounter = new Component(
      this.sprintGameContainer.node,
      'div',
      'sprint-game__counter'
    );
    this.timerContainer = new Component(this.sprintGameCounter.node, 'div', 'timer-container');
    this.timerContainer.node.textContent = '60';
    this.sprintGameCounterScore = new Component(
      this.sprintGameCounter.node,
      'div',
      'sprint-game-counter__score'
    );
    this.sprintGameCounterScore.node.textContent = '0';

    this.sprintGameContent = new Component(
      this.sprintGameContainer.node,
      'div',
      'sprint-game__content'
    );
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

    this.sprintGameButtons = new Component(
      this.sprintGameContainer.node,
      'div',
      'sprint-game__buttons'
    );
    this.sprintWrongButton = new Component(
      this.sprintGameButtons.node,
      'div',
      'sprint-game__button wrong-button',
      'Неверно'
    );
    this.sprintCorrectButton = new Component(
      this.sprintGameButtons.node,
      'div',
      'sprint-game__button correct-button',
      'Верно'
    );

    this.resultsContainer = new Component(
      this.wrapper.node,
      'div',
      'results__container game-hidden'
    );

    this.manageGame = async () => {
      SprintPage.scoreTotal = 0;
      SprintPage.correctAnswersSeries = 0;
      SprintPage.scoreGrowth = 10;
      SprintPage.indexGameMove = 0;
      SprintPage.arrayCorrectAnswers = [];
      SprintPage.arrayIncorrectAnswers = [];

      if (Constants.UserMetadata && !Constants.userWords) {
        Constants.userWords = await API.userWords.getWords(Constants.UserMetadata.userId);
      }

      await this.getWordsForGame();

      SprintPage.drawInitialStartPage();
    };

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
    };
    // ------ 1
    this.getWordsForGame = async (): Promise<void> => {
      if (SprintPage.collectionWordsFromServer.length === 0) {
        const tempCollectionWords: Promise<Word[]>[] = [];
        if (params) {
          const query = params.map((el) => Object.values(el));
          this.queryObj = Object.fromEntries(query);
          tempCollectionWords.push(this.getWords(this.queryObj));
        } else {
          for (let i = 0; i <= 29; i += 1) {
            const group = String(SprintPage.level);
            const page = String(i);
            this.queryObj = { group, page };
            tempCollectionWords.push(this.getWords(this.queryObj));
          }
        }
        SprintPage.collectionWordsFromServer = (await Promise.all(tempCollectionWords)).flat();
      }
      const arrayOfWordsKeysFromServer = Object.keys(SprintPage.collectionWordsFromServer);

      console.log(
        '3: getWordsForGame work \n arrayOfWordsKeysFromServer \n 4: норм',
        arrayOfWordsKeysFromServer
      );

      while (
        SprintPage.arrayOfRandomGameWordsKeys.length < SprintPage.collectionWordsFromServer.length
      ) {
        const keyRandom = arrayOfWordsKeysFromServer.splice(
          Math.floor(Math.random() * arrayOfWordsKeysFromServer.length),
          1
        );

        SprintPage.arrayOfRandomGameWordsKeys.push(+keyRandom);
      }
    };
    // ------ 2
    this.hideLoader = (): void => {
      this.iconLoaderWrapper.node.classList.add('game-hidden');
    };

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

      console.log('6 countdownToStart', timeToStart);
      const CONTENT = document.querySelector('.content') as HTMLDivElement;
      const LINK = document.getElementsByTagName('a');
      window.addEventListener('click', function clearCountdown(e) {
        const target = e.target as HTMLElement;
        if (
          !CONTENT.contains(target) &&
          Array.from(LINK).find((element): boolean => element.contains(target))
        ) {
          clearInterval(countdownToStart);
          SprintPage.collectionWordsFromServer = [];
          window.removeEventListener('click', clearCountdown);
        }
      });
    };
    // ------ 3
    SprintPage.startGame = (): void => {
      this.exitGame.node.innerHTML = exitGameHTML;
      this.counterBeforeGame.node.classList.add('game-hidden');
      this.counterBeforeGame.node.innerHTML = '';
      this.sprintGameContainer.node.classList.remove('game-hidden');

      let timeToEnd = GameTime.TimeForGame;
      SprintPage.countdownToEnd = setInterval(() => {
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
          clearInterval(SprintPage.countdownToEnd);
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
            clearInterval(SprintPage.countdownToEnd);
            clearTimeout(actionsAfterTimeout);
          }
        }
      });

      this.exitGame.node.addEventListener('click', () => {
        Router.goTo(new URL(`http://${window.location.host}${Constants.LastPage}`));
        clearInterval(SprintPage.countdownToEnd);
        clearTimeout(actionsAfterTimeout);
        SprintPage.collectionWordsFromServer = [];
      });

      const CONTENT = document.querySelector('.content') as HTMLDivElement;
      const LINK = document.getElementsByTagName('a');
      window.addEventListener('click', function changeValuesKeys(e) {
        const target = e.target as HTMLElement;
        if (
          !CONTENT.contains(target) &&
          Array.from(LINK).find((element): boolean => element.contains(target))
        ) {
          document.removeEventListener('keydown', SprintPage.setValuesKeyboardKeys);
          clearInterval(SprintPage.countdownToEnd);
          clearTimeout(actionsAfterTimeout);
          SprintPage.collectionWordsFromServer = [];
          window.removeEventListener('click', changeValuesKeys);
        }
      });
    };
    // ------ 4
    SprintPage.renderDataGameboard = (): void => {
      this.sprintGameCounterScore.node.textContent = `${SprintPage.scoreTotal}`;
      console.log(
        '9 renderDataGameboard work, this.sprintGameCounterScore.node.textContent',
        this.sprintGameCounterScore.node.textContent
      );

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
      this.questionWord.node.textContent =
        SprintPage.collectionWordsFromServer[
          SprintPage.arrayOfRandomGameWordsKeys[SprintPage.indexGameMove]
        ].word;

      if (Math.random() > 0.5) {
        this.translateWord.node.textContent =
          SprintPage.collectionWordsFromServer[
            SprintPage.arrayOfRandomGameWordsKeys[SprintPage.indexGameMove]
          ].wordTranslate;
      } else {
        const indexRandomTranslation = Math.floor(
          Math.random() * SprintPage.collectionWordsFromServer.length
        );
        this.translateWord.node.textContent =
          SprintPage.collectionWordsFromServer[indexRandomTranslation].wordTranslate;
      }
    };
    // ------ 5
    SprintPage.setValuesKeyboardKeys = (event: KeyboardEvent): void => {
      if (event.code === 'ArrowRight') {
        if (event.repeat) return;
        SprintPage.checkUserAnswer(true);
      }
      if (event.code === 'ArrowLeft') {
        if (event.repeat) return;
        SprintPage.checkUserAnswer(false);
      }
    };
    // ------ 6
    SprintPage.checkUserAnswer = (userAnswer: boolean): void => {
      const currentWord =
        SprintPage.collectionWordsFromServer[
          SprintPage.arrayOfRandomGameWordsKeys[SprintPage.indexGameMove]
        ];
      const currentTranslate = this.translateWord.node.textContent;

      console.log('11 проверка checkUserAnswer: currentWord', currentWord);
      console.log('11 проверка checkUserAnswer: currentTranslate', currentTranslate);

      const checkedAnswer = currentWord.wordTranslate === currentTranslate;

      SprintPage.audioCorrectAnswer.pause();
      SprintPage.audioCorrectAnswer.currentTime = 0;
      SprintPage.audioIncorrectAnswer.pause();
      SprintPage.audioIncorrectAnswer.currentTime = 0;

      if (userAnswer === checkedAnswer) {
        SprintPage.audioCorrectAnswer.play();
        SprintPage.arrayCorrectAnswers.push(
          SprintPage.arrayOfRandomGameWordsKeys[SprintPage.indexGameMove]
        );
        SprintPage.updateServerData(currentWord, true);
        SprintPage.correctAnswersSeries += 1;

        SprintPage.scoreTotal += SprintPage.scoreGrowth;
        if (SprintPage.correctAnswersSeries === 4) SprintPage.scoreGrowth = 20;
        if (SprintPage.correctAnswersSeries === 8) SprintPage.scoreGrowth = 40;
        if (SprintPage.correctAnswersSeries === 12) SprintPage.scoreGrowth = 80;
      } else {
        SprintPage.audioIncorrectAnswer.play();
        SprintPage.arrayIncorrectAnswers.push(
          SprintPage.arrayOfRandomGameWordsKeys[SprintPage.indexGameMove]
        );
        SprintPage.updateServerData(currentWord, false);
        SprintPage.scoreGrowth = 10;
        SprintPage.correctAnswersSeries = 0;
      }

      SprintPage.indexGameMove += 1;

      if (SprintPage.indexGameMove === SprintPage.arrayOfRandomGameWordsKeys.length) {
        clearInterval(SprintPage.countdownToEnd);
        SprintPage.showGameResults();
        document.removeEventListener('keydown', SprintPage.setValuesKeyboardKeys);
      } else {
        SprintPage.renderDataGameboard();
      }
    };
    // ------ 7
    SprintPage.showGameResults = (): void => {
      this.sprintGameContainer.node.classList.add('game-hidden');
      this.resultsContainer.node.classList.remove('game-hidden');
      const countCorrectAnswers = SprintPage.arrayCorrectAnswers.length;
      const countIncorrectAnswers = SprintPage.arrayIncorrectAnswers.length;
      this.resultsContainer.node.innerHTML = drawResults(
        SprintPage.scoreTotal,
        countCorrectAnswers,
        countIncorrectAnswers
      );

      const contentEvaluation = document.querySelector('.content-evaluation') as HTMLHeadingElement;
      let evaluationCriteria;
      if (countCorrectAnswers + countIncorrectAnswers > 0) {
        evaluationCriteria = countCorrectAnswers / (countCorrectAnswers + countIncorrectAnswers);
      } else {
        evaluationCriteria = 0;
      }
      if (evaluationCriteria < 0.25) {
        contentEvaluation.innerHTML = 'Нужно тренироваться чаще!';
      } else if (evaluationCriteria >= 0.25 && evaluationCriteria < 0.5) {
        contentEvaluation.innerHTML = 'Вы можете лучше!';
      } else if (evaluationCriteria >= 0.5 && evaluationCriteria < 0.75) {
        contentEvaluation.innerHTML = 'Неплохой результат!';
      } else {
        contentEvaluation.innerHTML = 'Отличный результат!';
      }

      const correctList = document.querySelector('.correct-list') as HTMLDivElement;
      SprintPage.arrayCorrectAnswers.forEach((item) => {
        correctList.innerHTML += `
          <li class="word-item"><span class="word-en">${SprintPage.collectionWordsFromServer[item].word}
            &nbsp;${SprintPage.collectionWordsFromServer[item].transcription}</span> - 
            ${SprintPage.collectionWordsFromServer[item].wordTranslate}
          </li>
        `;
      });
      const incorrectList = document.querySelector('.incorrect-list') as HTMLDivElement;
      SprintPage.arrayIncorrectAnswers.forEach((item) => {
        incorrectList.innerHTML += `
          <li class="word-item"><span class="word-en">${SprintPage.collectionWordsFromServer[item].word}
            &nbsp;${SprintPage.collectionWordsFromServer[item].transcription}</span> - 
            ${SprintPage.collectionWordsFromServer[item].wordTranslate}
          </li>
        `;
      });

      SprintPage.collectionWordsFromServer = [];
    };
    // ------ 8
    SprintPage.updateServerData = async (word: Word, isCorrectAnswer: boolean): Promise<void> => {
      if (Constants.UserMetadata) {
        if (
          Constants.userWords &&
          !(Constants.userWords.filter((userWord) => userWord.wordId === word.id).length !== 0)
        ) {
          const created = await API.userWords.createWord(Constants.UserMetadata.userId, word.id, {
            difficulty: String(word.group),
            optional: { difficult: false, learned: false },
          });
          if (created) Constants.userWords.push(created);
        }

        const currentWord = Constants.userWords!.find((w) => w.wordId === word.id);

        if (currentWord) Statistics.add(currentWord.wordId, 'seen');

        const userWord = await API.userWords.getWord(Constants.UserMetadata.userId, word.id);
        const wordStore: UserWordConfig = {
          difficulty: '0',
          optional: {
            sprint: ' ',
            sprintWins: ' ',
            sprintLoses: ' ',
            audio: ' ',
            allGames: ' ',
            learned: false,
            difficult: false,
          },
        };

        if (userWord && wordStore.optional) {
          wordStore.difficulty = userWord.difficulty;
          wordStore.optional.difficult = userWord.optional!.difficult;
          wordStore.optional.sprint = userWord.optional!.sprint;
          wordStore.optional.sprintWins = userWord.optional!.sprintWins;
          wordStore.optional.sprintLoses = userWord.optional!.sprintLoses;
          wordStore.optional.audio = userWord.optional!.audio;
          wordStore.optional.allGames = userWord.optional!.allGames;

          const wins = String(Number(wordStore.optional.sprintWins || 0) + 1);
          const loses = String(Number(wordStore.optional.sprintLoses || 0) + 1);

          if (isCorrectAnswer && wordStore.optional) {
            wordStore.optional.sprintWins = wins;
            currentWord!.optional!.sprintWins = wins;
            Statistics.updadeGameStats('sprint', true);
          } else if (!isCorrectAnswer && wordStore.optional) {
            wordStore.optional.sprintLoses = loses;
            currentWord!.optional!.sprintLoses = loses;
            Statistics.updadeGameStats('sprint', false);
          }
          wordStore.optional.sprint += isCorrectAnswer ? '1' : '0';
          wordStore.optional.allGames += isCorrectAnswer ? '1' : '0';
          if (!wordStore.optional.difficult && wordStore.optional.allGames.slice(-3) === '111') {
            wordStore.optional.learned = true;
            wordStore.optional.difficult = false;
            if (currentWord && currentWord.optional) {
              currentWord.optional.learned = true;
              Statistics.add(currentWord.wordId, 'learned');
            }
          } else if (
            wordStore.optional.difficult &&
            wordStore.optional.allGames.slice(-6) === '111111'
          ) {
            wordStore.optional.learned = true;
            wordStore.optional.difficult = false;
            currentWord!.optional!.learned = true;
            if (currentWord && currentWord.optional) {
              currentWord.optional.learned = true;
              Statistics.add(currentWord.wordId, 'learned');
            }
          } else {
            wordStore.optional.learned = false;
            if (currentWord && currentWord.optional) {
              currentWord.optional.learned = false;
              Statistics.remove(currentWord.wordId, 'learned');
            }
          }
          await API.userWords.updateWord(Constants.UserMetadata.userId, word.id, wordStore);
        } else if (wordStore.optional) {
          wordStore.optional.sprint += isCorrectAnswer ? '1' : '0';
          wordStore.optional.allGames += isCorrectAnswer ? '1' : '0';
          wordStore.optional.learned = false;
          currentWord!.optional!.sprint += isCorrectAnswer ? '1' : '0';
          currentWord!.optional!.allGames += isCorrectAnswer ? '1' : '0';
          currentWord!.optional!.learned = false;
          await API.userWords.createWord(Constants.UserMetadata.userId, word.id, wordStore);
        }
      }
    };

    this.manageGame();
  }
}
