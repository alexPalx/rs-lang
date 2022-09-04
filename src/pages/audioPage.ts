import API from '../api/api';
import Component from '../common/component';
import Constants from '../common/constants';
import Statistics from '../common/statisticsData';
import { QueryParam, WordsQuery } from '../interfaces/types';
import { UserWordConfig, Word } from '../interfaces/typesAPI';
import Router from '../router/router';
import Utils from '../utils/utils';

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
const askWordWrapperHTML = (askWord: string): string => `
  <div class="ask-image"></div>
  <div class="ask-word__container">
    <div class="ask-word__play-container">
      <div class="ask-word__play-icon">
        ${audioIconSVG}
      </div>
    </div>
    <div class="ask-word">${askWord}</div>
  </div>
`;
const answerSign = `
  <div class="answers-series">
    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 
        17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"></path>
      </svg>
  </div>
`;
const answersContainerHTML = ():  string => `
  <div class="answer-variant__container">
    <div class="answer-variant__sign">${answerSign}</div>
    <div class="answer-variant__index"></div>
    <div class="answer-variant__word"></div>
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
const controlKeysHTML = `
  <ul class="control-keys__list">Клавиши управления игрой:
    <li class="control-keys__item">1, 2, 3, 4, 5 - выбрать вариант ответа</li>
    <li class="control-keys__item">пробел - прослушать слово повторно</li>
    <li class="control-keys__item">
      Enter - пропустить слово (будет засчитано как неверный ответ)<br>
      <span class="second-enter-line">или перейти к следующему слову (после выбора варианта ответа)
      </span>
    </li>
  </ul>
`;
const drawResults = (countCorrect: number, countIncorrect: number
  ): string => `
  <h1 class="content-evaluation"></h1>
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

enum CountItems {
  AnswerVariantCountInGameboard = 5,
  MaxPagesIndex = 29,
  WordsPerPage = 20,
  AggregatedWordsPerPage = '3600',
  IndexGroupForDifficultWords = '6'
}
enum Level {
  Low = 0.25,
  Middle = 0.5,
  High = 0.75
}
enum TextColor {
  Main = "lavenderblush",
  Inherit = "inherit",
  IncorrectAnswer = "#ff3131",
  CorrectAnswer = "#74cd59"
}

export default class AudioPage extends Component {
  static level = 0;
  static indexGameMove = 0;
  private static arrayCorrectAnswers: number[] = [];
  private static arrayIncorrectAnswers: number[] = [];
  static collectionWordsFromServer: Word[] = [];
  static arrayOfRandomGameWordsKeys: number[] = [];
  static startGame: () => void;
  static renderDataGameboard: () => void;
  static setValuesKeyboardKeys: (event: KeyboardEvent) => Promise<void>;
  static getNextWord: () => void;
  static getAnswerVariants: (index: number) => void;
  static checkUserAnswer: (target: HTMLElement) => void;
  private static manageButtonSkip: () => void;
  private static audioCorrectAnswer = new Audio('../../assets/audio/correctanswer.mp3');
  private static audioIncorrectAnswer = new Audio('../../assets/audio/incorrectanswer.mp3');
  static showGameResults: () => void;
  private static getResultsContent: (array: number[], element: HTMLDivElement) => void;
  static updateServerData: (word: Word, result: boolean) => Promise<void>;
  private static showCorrectAnswerBoard: (word: Word) => Promise<void>;

  public wrapper: Component;
  public exitWrapper: Component;
  public exitGame: Component;
  public iconLoaderWrapper: Component;
  public iconLoader: Component;
  public audiocallGameContainer: Component;
  public audiocallGameAskContainer: Component;
  public audiocallGamePlayContainer: Component;
  public askDescription: Component;
  public askTitle: Component;
  public askPlayIcon: Component;
  public askWordWrapper: Component;
  public audiocallGameAnswersContainer: Component;
  public audiocallGameButtonContainer: Component;
  public buttonSkip: Component;
  public buttonNext: Component;
  public controlKeysContainer: Component;
  public askPlayAudio: Component;
  public resultsContainer: Component;
  public arrowNext: Component;
  public manageGame: () => Promise<void>;
  public getWordsForGame: () => Promise<void>;
  public getWords: (query: WordsQuery) => Promise<Word[]>;
  public hideLoader: () => void;

  public queryObj: WordsQuery = { group: '0', page: '0' };

  constructor(parentElement: HTMLElement, params: QueryParam[] | null) {
    super(parentElement, 'div', 'audiocall-game-wrapper');
    this.wrapper = this;

    this.exitWrapper = new Component(this.wrapper.node, 'div', 'exit-wrapper');
    this.exitGame = new Component(this.exitWrapper.node, 'div', 'exit-game');

    this.iconLoaderWrapper = new Component(this.wrapper.node, 'div', 'icon-loader-wrapper');
    this.iconLoader = new Component(this.iconLoaderWrapper.node, 'div', 'icon-loader');

    this.audiocallGameContainer = new Component(
      this.wrapper.node, 'div', 'audiocall-game__container game-hidden'
    );

    this.audiocallGameAskContainer = new Component(
      this.audiocallGameContainer.node, 'div', 'audiocall-game__ask-container'
    );
    this.audiocallGamePlayContainer = new Component(
      this.audiocallGameAskContainer.node, 'div', 'audiocall-game__play-container'
    );
    this.askDescription = new Component(
      this.audiocallGamePlayContainer.node, 'div', 'ask-description'
    );
    this.askTitle = new Component(this.askDescription.node, 'h1', 'ask-title');
    this.askPlayIcon = new Component(this.askDescription.node, 'div', 'ask-play-icon');
    this.askPlayIcon.node.innerHTML = audioIconSVG;

    this.askWordWrapper = new Component(
      this.audiocallGameAskContainer.node, 'div', 'ask-word__wrapper'
    );
    this.askWordWrapper.node.innerHTML = askWordWrapperHTML('');

    this.audiocallGameAnswersContainer = new Component(
      this.audiocallGameContainer.node, 'div', 'audiocall-game__answers-container'
    );
    this.audiocallGameAnswersContainer.node.innerHTML =
      answersContainerHTML().repeat(CountItems.AnswerVariantCountInGameboard);

    this.audiocallGameButtonContainer = new Component(
      this.audiocallGameContainer.node, 'div', 'audiocall-game__button-container'
    );
    this.buttonSkip = new Component(
      this.audiocallGameButtonContainer.node, 'button', 'button-skip', 'НЕ ЗНАЮ'
    );
    this.buttonNext = new Component(
      this.audiocallGameButtonContainer.node, 'button', 'button-next game-hidden');
    this.arrowNext = new Component(this.buttonNext.node, 'span', 'arrow-next', '→');
    
    this.controlKeysContainer = new Component(
      this.audiocallGameContainer.node, 'div', 'control-keys__container'
    );
    this.controlKeysContainer.node.innerHTML = controlKeysHTML;

    this.askPlayAudio = new Component(
      this.audiocallGameContainer.node, 'audio', 'ask-play__audio'
    );

    this.resultsContainer = new Component(
      this.wrapper.node, 'div', 'results__container game-hidden'
    );

    const FOOTER = document.querySelector('.footer') as HTMLElement;

    this.manageGame = async () => {
      
      AudioPage.indexGameMove = 0;
      AudioPage.arrayCorrectAnswers = [];
      AudioPage.arrayIncorrectAnswers = [];
      AudioPage.arrayOfRandomGameWordsKeys = [];

      FOOTER.classList.add('game-hidden');

      if (Constants.UserMetadata && !Constants.userWords) {
        Constants.userWords = await API.userWords.getWords(Constants.UserMetadata.userId);
      }

      await this.getWordsForGame();
      AudioPage.startGame();
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

      if (AudioPage.collectionWordsFromServer.length === 0) {
        if (!Constants.UserMetadata) {
          const tempCollectionWords: Promise<Word[]>[] = [];
          if (params) {
            const query = params.map((el) => Object.values(el));
            this.queryObj = Object.fromEntries(query);
            tempCollectionWords.push(this.getWords(this.queryObj));
          } else {
            for (let i = 0; i <= CountItems.MaxPagesIndex; i += 1) {
              const group = String(AudioPage.level);
              const page = String(i);
              this.queryObj = { group, page };
              tempCollectionWords.push(this.getWords(this.queryObj));
            }
          }
          AudioPage.collectionWordsFromServer = (await Promise.all(tempCollectionWords)).flat();
          
        } else if (Constants.UserMetadata) {
          const tempCollectionWords: Promise<Word[]>[] = [];
          if (params) {
            const query = params.map((el) => Object.values(el));
            this.queryObj = Object.fromEntries(query);
           
            const cardsData =
              this.queryObj.group !== CountItems.IndexGroupForDifficultWords
                ? API.words.getWords(this.queryObj)
                : API.userAggregatedWords.getWords(
                String(Constants.UserMetadata?.userId),
                undefined,
                this.queryObj.page,
                CountItems.AggregatedWordsPerPage,
                '{"$and":[{"userWord.optional.difficult":true}, {"userWord.optional.learned":false}]}'
                );
            cardsData.then(async (data) => {
              if (data) {
                if (Constants.UserMetadata && !Constants.userWords) {
                  Constants.userWords = await API.userWords.getWords(Constants.UserMetadata.userId);
                }
              }
            });
            tempCollectionWords.push(cardsData as Promise<Word[]>);
          } else {
            for (let i = 0; i <= CountItems.MaxPagesIndex; i += 1) {
              const group = String(AudioPage.level);
              const page = String(i);
              this.queryObj = { group, page };
              tempCollectionWords.push(this.getWords(this.queryObj));
            }
          }
          AudioPage.collectionWordsFromServer = (await Promise.all(tempCollectionWords)).flat();
        }
      }
      const arrayOfWordsKeysFromServer = Object.keys(AudioPage.collectionWordsFromServer);

      while (
        AudioPage.arrayOfRandomGameWordsKeys.length < CountItems.WordsPerPage &&
        AudioPage.arrayOfRandomGameWordsKeys.length < 
        AudioPage.collectionWordsFromServer.length
      ) {
        const keyRandom = arrayOfWordsKeysFromServer.splice(
          Math.floor(Math.random() * arrayOfWordsKeysFromServer.length),
          1
        );

        AudioPage.arrayOfRandomGameWordsKeys.push(+keyRandom);
      }
    };
    // ------ 2
    this.hideLoader = (): void => {
      this.iconLoaderWrapper.node.classList.add('game-hidden');
    };

    // ------ 3
    AudioPage.startGame = (): void => {
      this.exitGame.node.innerHTML = exitGameHTML;
      
      this.hideLoader();
      if (AudioPage.arrayOfRandomGameWordsKeys.length > 4) {
        this.audiocallGameContainer.node.classList.remove('game-hidden');

        AudioPage.renderDataGameboard();

        document.addEventListener('keydown', AudioPage.setValuesKeyboardKeys);

        this.exitGame.node.addEventListener('click', () => {
          Router.goTo(new URL(`http://${window.location.host}/${Constants.routes.games}`));
          FOOTER.classList.remove('game-hidden');
          AudioPage.collectionWordsFromServer = [];
        });

        const CONTENT = document.querySelector('.content') as HTMLDivElement;
        const LINK = document.getElementsByTagName('a');
        window.addEventListener('click', function changeValuesKeys(e) {
          const target = e.target as HTMLElement;
          if (
            !CONTENT.contains(target) &&
            Array.from(LINK).find((element): boolean => element.contains(target))
          ) {
            document.removeEventListener('keydown', AudioPage.setValuesKeyboardKeys);
            FOOTER.classList.remove('game-hidden');
            AudioPage.collectionWordsFromServer = [];
            window.removeEventListener('click', changeValuesKeys);
          }
        });
      }
      else {
        this.wrapper.node.innerHTML = `
          <div class='words-enough'>
            Недостаточно слов для игры.<br>
            Вернитесь на страницу учебника и добавьте слова для изучения<br>
            Минимальное количество необходимых для данной игры слов - 5
          </div>
        `;
      }
    };

// ------ 4
    AudioPage.renderDataGameboard = (): void => {

      this.askTitle.node.innerHTML = `
        Слово ${AudioPage.indexGameMove + 1} из ${AudioPage.arrayOfRandomGameWordsKeys.length}
      `;
      AudioPage.getAnswerVariants(
        AudioPage.arrayOfRandomGameWordsKeys[AudioPage.indexGameMove]
      );
      
      this.buttonSkip.node.addEventListener('click', AudioPage.manageButtonSkip);
      this.buttonNext.node.addEventListener('click', AudioPage.getNextWord);

      this.audiocallGameAnswersContainer.node.addEventListener('click', async (event) => {
        const target = event.target as HTMLElement;

        if (target.closest('.answer-variant__container')) {
          AudioPage.checkUserAnswer(target.closest('.answer-variant__container') as HTMLElement);
          this.buttonSkip.node.classList.add('game-hidden');
          this.buttonNext.node.classList.remove('game-hidden');
          this.buttonNext.node.setAttribute("disabled", "disabled");
          setTimeout(() => {
            this.buttonNext.node.removeAttribute("disabled");
          }, 500);
        }
      });
      
      document.addEventListener('keydown', AudioPage.setValuesKeyboardKeys);
    }

    // ------ 5
    const ANSWER_VARIANTS_GROUP = document.querySelectorAll('.answer-variant__word');

    AudioPage.getAnswerVariants = (index: number): void => {

      const someArray: number[] = [];
      someArray.push(index);
      while (someArray.length < CountItems.AnswerVariantCountInGameboard) {
        const random = Math.floor(
          Math.random() * AudioPage.collectionWordsFromServer.length
        );
        if (!someArray.includes(random))
          someArray.push(random);
      }
      const mixedArray: number[] = [];
      while (someArray.length) {
        
        const key = someArray.splice(Math.floor(Math.random() * someArray.length), 1);
        mixedArray.push(+key);
      }

      const answerVariantIndexes = document.querySelectorAll('.answer-variant__index');

      for (let i = 0; i < ANSWER_VARIANTS_GROUP.length; i += 1) {
        ANSWER_VARIANTS_GROUP[i].textContent = 
          AudioPage.collectionWordsFromServer[mixedArray[i]].wordTranslate;
        answerVariantIndexes[i].textContent = `${i + 1}.`;
      }
      
      AudioPage.audioCorrectAnswer.pause();
      AudioPage.audioCorrectAnswer.currentTime = 0;
      AudioPage.audioCorrectAnswer.volume = Level.Low;
      AudioPage.audioIncorrectAnswer.pause();
      AudioPage.audioIncorrectAnswer.currentTime = 0;
      AudioPage.audioIncorrectAnswer.volume = Level.Low;

      (this.askPlayAudio.node as HTMLAudioElement).src = `
        ${Constants.serverURL}/${AudioPage.collectionWordsFromServer[index].audio}
      `;
      (this.askPlayAudio.node as HTMLAudioElement).play();
      this.askPlayIcon.node.addEventListener('click', () => 
        (this.askPlayAudio.node as HTMLAudioElement).play()
      );
    }

    // ------ 6
    const ANSWER_VARIANT_CONTAINERS = document.querySelectorAll('.answer-variant__container');

    AudioPage.manageButtonSkip = (): void => {
      ANSWER_VARIANT_CONTAINERS.forEach((elem) => {
        const item = elem as HTMLElement;
        item.classList.add('answer-disabled');
      });
      this.buttonNext.node.classList.remove('game-hidden');
      this.buttonSkip.node.classList.add('game-hidden');
      
      const index = AudioPage.arrayOfRandomGameWordsKeys[AudioPage.indexGameMove];
      AudioPage.showCorrectAnswerBoard(AudioPage.collectionWordsFromServer[index]);
      
      const correctAnswer = AudioPage.collectionWordsFromServer[index].wordTranslate;
      
      ANSWER_VARIANTS_GROUP.forEach((elem) => {
        const item = elem as HTMLElement;
        if (item.textContent === correctAnswer)
          item.style.color = TextColor.Main;
      });
      AudioPage.audioIncorrectAnswer.play();
      AudioPage.arrayIncorrectAnswers.push(index);
      AudioPage.updateServerData(AudioPage.collectionWordsFromServer[index], false);
    };

    AudioPage.getNextWord = (): void => {
      AudioPage.indexGameMove += 1;
      if (AudioPage.indexGameMove < AudioPage.arrayOfRandomGameWordsKeys.length) {
        AudioPage.getAnswerVariants(
          AudioPage.arrayOfRandomGameWordsKeys[AudioPage.indexGameMove]
        );
        this.askTitle.node.innerHTML = `
          Слово ${AudioPage.indexGameMove + 1} из ${AudioPage.arrayOfRandomGameWordsKeys.length}
        `;
        ANSWER_VARIANT_CONTAINERS.forEach((elem) => {
          const item = elem;
          item.classList.remove('answer-disabled');
        });
        ANSWER_VARIANTS_GROUP.forEach((elem) => {
          const item = elem as HTMLElement;
          item.style.color = TextColor.Inherit;
        });
        const answerVariantSigns = document.querySelectorAll('.answer-variant__sign');
        answerVariantSigns.forEach((elem) => {
          const item = elem as HTMLElement;
          item.style.visibility = "hidden";
        })
        this.buttonNext.node.classList.add('game-hidden');
        this.buttonSkip.node.classList.remove('game-hidden');
      } else {
        this.buttonNext.node.setAttribute("disabled", "disabled");
        document.removeEventListener('keydown', AudioPage.setValuesKeyboardKeys);
        AudioPage.showGameResults();
      }
      this.audiocallGamePlayContainer.node.classList.remove('game-hidden');
      this.askWordWrapper.node.style.visibility = "hidden";
    }
    // ------ 7

    AudioPage.setValuesKeyboardKeys = async (event: KeyboardEvent): Promise<void> => {
      
      if (+event.key >= 1 && +event.key <= CountItems.AnswerVariantCountInGameboard 
          && !ANSWER_VARIANT_CONTAINERS[+event.key - 1].classList.contains('answer-disabled')) {
        AudioPage.checkUserAnswer(ANSWER_VARIANT_CONTAINERS[+event.key - 1] as HTMLElement);
        this.buttonNext.node.classList.remove('game-hidden');
        this.buttonSkip.node.classList.add('game-hidden');
        this.buttonNext.node.setAttribute("disabled", "disabled");
          setTimeout(() => {
            this.buttonNext.node.removeAttribute("disabled");
          }, 500);
      }  
      if (event.code === 'Enter'
          && this.buttonSkip.node.classList.contains('game-hidden')) {
        setTimeout(() => {
          AudioPage.getNextWord();
        }, 500);
      } else if (event.code === 'Enter' 
          && this.buttonNext.node.classList.contains('game-hidden')) {
        AudioPage.manageButtonSkip();
      }
      if (event.key === ' ') {
        event.preventDefault();
        await (this.askPlayAudio.node as HTMLAudioElement).play();
      }
    }

    // ------ 8
    AudioPage.checkUserAnswer = async (target: HTMLElement): Promise<void> => {
      ANSWER_VARIANT_CONTAINERS.forEach((elem) => {
        const item = elem;
        item.classList.add('answer-disabled');
      });
      const currentAnswerVariant = target.lastElementChild!.textContent as string;
      const currentAnswerText = target.lastElementChild as HTMLElement;

      const index = AudioPage.arrayOfRandomGameWordsKeys[AudioPage.indexGameMove];
      const correctAnswer = AudioPage.collectionWordsFromServer[index].wordTranslate;
      
      if (currentAnswerVariant === correctAnswer) {
        const currentTarget = target.firstElementChild as HTMLElement;
        currentTarget.style.visibility = "visible";
        currentAnswerText.style.color = TextColor.Main;
        AudioPage.arrayCorrectAnswers.push(index);
        await AudioPage.audioCorrectAnswer.play();
        await AudioPage.updateServerData(AudioPage.collectionWordsFromServer[index], true);
      } else {
        currentAnswerText.style.color = TextColor.IncorrectAnswer;
        AudioPage.arrayIncorrectAnswers.push(index);
        await AudioPage.audioIncorrectAnswer.play();
        await AudioPage.updateServerData(AudioPage.collectionWordsFromServer[index], false);
        ANSWER_VARIANTS_GROUP.forEach((elem) => {
          const item = elem as HTMLElement;
          if (item.innerHTML === correctAnswer) {
            item.style.color = TextColor.CorrectAnswer;
          }
        })
      }
      await AudioPage.showCorrectAnswerBoard(
        AudioPage.collectionWordsFromServer[index]
      );
    }

    // ------ 9
    AudioPage.showCorrectAnswerBoard = async (word: Word): Promise<void> => {

      this.audiocallGamePlayContainer.node.classList.add('game-hidden');
      this.askWordWrapper.node.style.visibility = "visible";
      this.askWordWrapper.node.innerHTML = askWordWrapperHTML(word.word);
      const askImage = document.querySelector('.ask-image') as HTMLElement;
      askImage.style.backgroundImage = `url("${Constants.serverURL}/${word.image}")`;

      const askWordPlayIcon = document.querySelector('.ask-word__play-icon') as HTMLElement;
      askWordPlayIcon.addEventListener('click', () => 
        (this.askPlayAudio.node as HTMLAudioElement).play()
      );
    }
    // ------ 10
    AudioPage.showGameResults = (): void => {

      this.audiocallGameContainer.node.classList.add('game-hidden');
      this.resultsContainer.node.classList.remove('game-hidden');
      const countCorrectAnswers = AudioPage.arrayCorrectAnswers.length;
      const countIncorrectAnswers = AudioPage.arrayIncorrectAnswers.length;
      this.resultsContainer.node.innerHTML = 
        drawResults(countCorrectAnswers, countIncorrectAnswers);
      
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
      
      AudioPage.getResultsContent(
        AudioPage.arrayCorrectAnswers, document.querySelector('.correct-list')!
      );
      AudioPage.getResultsContent(
        AudioPage.arrayIncorrectAnswers, document.querySelector('.incorrect-list')!
      );
  
      AudioPage.collectionWordsFromServer = [];
    }

    AudioPage.getResultsContent = (array: number[], element: HTMLDivElement): void => {
      array.forEach((item) => {
        const block = element;
        block.innerHTML += `
          <li class="word-item">
            <div class="word-audio">
              <audio class="word-audio__play"></audio>
              <span class="word-audio__icon"
              data-choice="${AudioPage.collectionWordsFromServer[item].audio}"
              >${audioIconSVG}</span>
            </div>
            <span class="word-en">${AudioPage.collectionWordsFromServer[item].word}
            &nbsp;${AudioPage.collectionWordsFromServer[item].transcription}</span> - 
            ${AudioPage.collectionWordsFromServer[item].wordTranslate}
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
    }
    // ------ 11
    AudioPage.updateServerData = async (word: Word, isCorrectAnswer: boolean): Promise<void> => {
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
          wordStore.optional.audioWins = userWord.optional!.audioWins;
          wordStore.optional.audioLoses = userWord.optional!.audioLoses;
          wordStore.optional.audio = userWord.optional!.audio;
          wordStore.optional.allGames = userWord.optional!.allGames;

          const wins = String(Number(wordStore.optional.audioWins || 0) + 1);
          const loses = String(Number(wordStore.optional.audioWins || 0) + 1);

          if (isCorrectAnswer && wordStore.optional) {
            wordStore.optional.audioWins = wins;
            currentWord!.optional!.audioWins = wins;
            if(Constants.UserMetadata) Statistics.updadeGameStats('audio', true);
          } else if (!isCorrectAnswer && wordStore.optional) {
            wordStore.optional.audioLoses = loses;
            currentWord!.optional!.audioLoses = loses;
            if(Constants.UserMetadata) Statistics.updadeGameStats('audio', false);
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
    }

    this.manageGame();
  }
}
