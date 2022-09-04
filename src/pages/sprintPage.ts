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
const audioIconSVG = `
  <svg class="audio-icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
          xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 512 512" enable-background="new 0 0 512 512"
          xml:space="preserve">
        <path d="M426.7,256c0-71-43.4-131.8-105-157.5l-16.4,39.4C351.5,
        157.2,384,202.8,384,256c0,53.3-32.5,98.8-78.8,118.1l16.4,39.4
        C383.3,387.8,426.7,327,426.7,256z M341.3,256c0-35.5-21.7-65.9-52.5-78.7l-16.4,
        39.4c15.4,6.4,26.2,21.6,26.2,39.4
        c0,17.7-10.8,32.9-26.2,39.4l16.4,39.4C319.6,321.9,341.3,291.5,
        341.3,256z M354.5,19.7L338,59.1C415.1,91.2,469.3,167.2,469.3,256
        c0,88.7-54.2,164.8-131.3,196.9l16.4,39.4C447,453.7,512,362.5,512,
        256C512,149.5,447,58.3,354.5,19.7z M0,149.3v213.3h85.3
        L234.7,512V0L85.3,149.3H0z"/>
  </svg>
`;

enum CountItems {
  MaxCountCorrectSign = 3,
  MaxPagesIndex = 29,
}
enum GrowthScore {
  Minimal = 10,
  Increased = 20,
  Middle = 40,
  Maximum = 80
}
enum CorrectAnswerSeries {
  Start = 4,
  Middle = 8,
  Super = 12
}
enum Level {
  Low = 0.25,
  Middle = 0.5,
  High = 0.75
}
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
  static scoreGrowth = GrowthScore.Minimal;
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
    this.timerContainer.node.textContent = `${GameTime.TimeForGame}`;
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
    this.row1.node.innerHTML = answersSeriesHTML.repeat(CountItems.MaxCountCorrectSign);
    this.wordVoicing = new Component(this.row1.node, 'div', 'word-voicing');
    this.answersReward = new Component(this.sprintGameContent.node, 'div', 'answers-reward');
    this.reward = new Component(this.answersReward.node, 'span', 'reward');
    this.reward.node.textContent = `+${GrowthScore.Minimal}`;
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

    const FOOTER = document.querySelector('.footer') as HTMLElement;

    this.manageGame = async () => {
      SprintPage.scoreTotal = 0;
      SprintPage.correctAnswersSeries = 0;
      SprintPage.scoreGrowth = GrowthScore.Minimal;
      SprintPage.indexGameMove = 0;
      SprintPage.arrayCorrectAnswers = [];
      SprintPage.arrayIncorrectAnswers = [];

      FOOTER.classList.add('game-hidden');

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
        return content;
      } catch (err) {
        console.error((<Error>err).message);
        throw err;
      }
    };
    // ------ 1
    this.getWordsForGame = async (): Promise<void> => {
      if (SprintPage.collectionWordsFromServer.length === 0) {
        
        if (!Constants.UserMetadata) {
          const tempCollectionWords: Promise<Word[]>[] = [];
          if (params) {
            const query = params.map((el) => Object.values(el));
            this.queryObj = Object.fromEntries(query);
            tempCollectionWords.push(this.getWords(this.queryObj));
          } else {
            for (let i = 0; i <= CountItems.MaxPagesIndex; i += 1) {
              const group = String(SprintPage.level);
              const page = String(i);
              this.queryObj = { group, page };
              tempCollectionWords.push(this.getWords(this.queryObj));
            }
          }
          SprintPage.collectionWordsFromServer = (await Promise.all(tempCollectionWords)).flat();
          
        } else if (Constants.UserMetadata) {
          const tempCollectionWords: Promise<Word[]>[] = [];
          if (params) {
            const query = params.map((el) => Object.values(el));
            this.queryObj = Object.fromEntries(query);
           
            const cardsData =
              this.queryObj.group !== '6'
                ? API.words.getWords(this.queryObj)
                : API.userAggregatedWords.getWords(
                    String(Constants.UserMetadata?.userId),
                    undefined,
                    this.queryObj.page,
                    '3600',
                    '{"$and":[{"userWord.optional.difficult":true}, {"userWord.optional.learned":false}]}'
                  );
            console.log('cardsData', cardsData);
            cardsData.then(async (data) => {
              console.log('data', data);
              if (data) {
                if (Constants.UserMetadata && !Constants.userWords) {
                  Constants.userWords = await API.userWords.getWords(Constants.UserMetadata.userId);
                }
              }
            });
            tempCollectionWords.push(cardsData as Promise<Word[]>);
          } else {
            for (let i = 0; i <= CountItems.MaxPagesIndex; i += 1) {
              const group = String(SprintPage.level);
              const page = String(i);
              this.queryObj = { group, page };
              tempCollectionWords.push(this.getWords(this.queryObj));
            }
          }
          SprintPage.collectionWordsFromServer = (await Promise.all(tempCollectionWords)).flat();
          console.log('SprintPage.collectionWordsFromServer', SprintPage.collectionWordsFromServer);
        }
      }
      const arrayOfWordsKeysFromServer = Object.keys(SprintPage.collectionWordsFromServer);

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

      const countdownToStart = setInterval(() => {
        if (timeToStart <= GameTime.InitialTime && timeToStart > 0) {
          this.counterBeforeGame.node.innerHTML = `
            <div class="time-to-start">${timeToStart}<span class="circle-time"></span></div>
            <div class="ready">Приготовьтесь</div>
            <div class="ready-content">
              <img class="attention-icon" src="'../../assets/svg/attention.svg" alt="Внимание!">
              <div class="ready-text">
                Чтобы отвечать быстрее, используйте клавиши <span class="arrows">◄</span> 
                <span class="arrows">►</span>
              </div>
            </div>
            
          `;
          timeToStart -= 1;
        } else {
          clearInterval(countdownToStart);
          SprintPage.startGame();
        }
      }, 1000);

      const CONTENT = document.querySelector('.content') as HTMLDivElement;
      const LINK = document.getElementsByTagName('a');
      window.addEventListener('click', function clearCountdown(e) {
        const target = e.target as HTMLElement;
        if (
          !CONTENT.contains(target) &&
          Array.from(LINK).find((element): boolean => element.contains(target))
        ) {
          FOOTER.classList.remove('game-hidden');
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
        FOOTER.classList.remove('game-hidden');
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
          FOOTER.classList.remove('game-hidden');
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

      const checkedAnswer = currentWord.wordTranslate === currentTranslate;

      SprintPage.audioCorrectAnswer.pause();
      SprintPage.audioCorrectAnswer.currentTime = 0;
      SprintPage.audioCorrectAnswer.volume = Level.Middle;
      SprintPage.audioIncorrectAnswer.pause();
      SprintPage.audioIncorrectAnswer.currentTime = 0;
      SprintPage.audioIncorrectAnswer.volume = Level.Middle;

      if (userAnswer === checkedAnswer) {
        SprintPage.audioCorrectAnswer.play();
        SprintPage.arrayCorrectAnswers.push(
          SprintPage.arrayOfRandomGameWordsKeys[SprintPage.indexGameMove]
        );
        SprintPage.updateServerData(currentWord, true);
        SprintPage.correctAnswersSeries += 1;

        SprintPage.scoreTotal += SprintPage.scoreGrowth;
        if (SprintPage.correctAnswersSeries === CorrectAnswerSeries.Start)
          SprintPage.scoreGrowth = GrowthScore.Increased;
        if (SprintPage.correctAnswersSeries === CorrectAnswerSeries.Middle)
          SprintPage.scoreGrowth = GrowthScore.Middle;
        if (SprintPage.correctAnswersSeries === CorrectAnswerSeries.Super)
          SprintPage.scoreGrowth = GrowthScore.Maximum;
      } else {
        SprintPage.audioIncorrectAnswer.play();
        SprintPage.arrayIncorrectAnswers.push(
          SprintPage.arrayOfRandomGameWordsKeys[SprintPage.indexGameMove]
        );
        SprintPage.updateServerData(currentWord, false);
        SprintPage.scoreGrowth = GrowthScore.Minimal;
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
      if (evaluationCriteria < Level.Low) {
        contentEvaluation.innerHTML = 'Нужно тренироваться чаще!';
      } else if (evaluationCriteria >= Level.Low && evaluationCriteria < Level.Middle) {
        contentEvaluation.innerHTML = 'Вы можете лучше!';
      } else if (evaluationCriteria >= Level.Middle && evaluationCriteria < Level.High) {
        contentEvaluation.innerHTML = 'Неплохой результат!';
      } else {
        contentEvaluation.innerHTML = 'Отличный результат!';
      }

      const correctList = document.querySelector('.correct-list') as HTMLDivElement;
      SprintPage.arrayCorrectAnswers.forEach((item) => {
        correctList.innerHTML += `
          <li class="word-item">
            <div class="word-audio">
              <audio class="word-audio__play"></audio>
              <span class="word-audio__icon"
              data-choice="${SprintPage.collectionWordsFromServer[item].audio}"
              >${audioIconSVG}</span>
            </div>
            <span class="word-en">${SprintPage.collectionWordsFromServer[item].word}
              &nbsp;${SprintPage.collectionWordsFromServer[item].transcription}</span> - 
              ${SprintPage.collectionWordsFromServer[item].wordTranslate}
          </li>
        `;
        const wordAudioPlay = document.querySelector('.word-audio__play') as HTMLAudioElement;
        
        const wordAudioIconGroup = 
          document.querySelectorAll('.word-audio__icon') as NodeListOf<HTMLElement>;
        
        wordAudioIconGroup.forEach((icon) => {
          const elem = icon;
          elem.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.closest('.word-audio__icon')) {
              wordAudioPlay.src = `
                ${Constants.serverURL}/${(target.closest('.word-audio__icon') as HTMLElement)
                .dataset.choice}
              `;
              wordAudioPlay.pause();
              setTimeout(() => {
                wordAudioPlay.play();
              }, 100);
            }
          });
        });
      });
      const incorrectList = document.querySelector('.incorrect-list') as HTMLDivElement;
      SprintPage.arrayIncorrectAnswers.forEach((item) => {
        incorrectList.innerHTML += `
          <li class="word-item">
            <div class="word-audio">
              <audio class="word-audio__play"></audio>
              <span class="word-audio__icon"
              data-choice="${SprintPage.collectionWordsFromServer[item].audio}"
              >${audioIconSVG}</span>
            </div>
            <span class="word-en">${SprintPage.collectionWordsFromServer[item].word}
              &nbsp;${SprintPage.collectionWordsFromServer[item].transcription}</span> - 
              ${SprintPage.collectionWordsFromServer[item].wordTranslate}
          </li>
        `;
        const wordAudioPlay = document.querySelector('.word-audio__play') as HTMLAudioElement;

        const wordAudioIconGroup =
          document.querySelectorAll('.word-audio__icon') as NodeListOf<HTMLElement>;
        
        wordAudioIconGroup.forEach((icon) => {
          const elem = icon;
          elem.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.closest('.word-audio__icon')) {
              wordAudioPlay.src = `
                ${Constants.serverURL}/${(target.closest('.word-audio__icon') as HTMLElement)
                .dataset.choice}
              `;
              wordAudioPlay.pause();
              setTimeout(() => {
                wordAudioPlay.play();
              }, 100);
            }
          });
        });
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

        if (Constants.UserMetadata && currentWord) Statistics.add(currentWord.wordId, 'seen');

        const userWord = await API.userWords.getWord(Constants.UserMetadata.userId, word.id);
        const wordStore: UserWordConfig = {
          difficulty: '0',
          optional: {
            sprint: ' ',
            sprintWins: ' ',
            sprintLoses: ' ',
            audio: ' ',
            audioWins: ' ',
            audioLoses: ' ',
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
          wordStore.optional.audioWins = userWord.optional!.audioWins;
          wordStore.optional.audioLoses = userWord.optional!.audioLoses;
          wordStore.optional.allGames = userWord.optional!.allGames;

          const wins = String(Number(wordStore.optional.sprintWins || 0) + 1);
          const loses = String(Number(wordStore.optional.sprintLoses || 0) + 1);

          if (isCorrectAnswer && wordStore.optional) {
            wordStore.optional.sprintWins = wins;
            currentWord!.optional!.sprintWins = wins;
            if(Constants.UserMetadata) Statistics.updadeGameStats('sprint', true);
          } else if (!isCorrectAnswer && wordStore.optional) {
            wordStore.optional.sprintLoses = loses;
            currentWord!.optional!.sprintLoses = loses;
            if(Constants.UserMetadata) Statistics.updadeGameStats('sprint', false);
          }
          wordStore.optional.sprint += isCorrectAnswer ? '1' : '0';
          wordStore.optional.allGames += isCorrectAnswer ? '1' : '0';
          if (!wordStore.optional.difficult && wordStore.optional.allGames.slice(-3) === '111') {
            wordStore.optional.learned = true;
            wordStore.optional.difficult = false;
            if (currentWord && currentWord.optional) {
              currentWord.optional.learned = true;
              if(Constants.UserMetadata) Statistics.add(currentWord.wordId, 'learned');
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
              if(Constants.UserMetadata) Statistics.add(currentWord.wordId, 'learned');
            }
          } else {
            wordStore.optional.learned = false;
            if (currentWord && currentWord.optional) {
              currentWord.optional.learned = false;
              if(Constants.UserMetadata) Statistics.remove(currentWord.wordId, 'learned');
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
