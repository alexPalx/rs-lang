import API from '../api/api';
import Component from '../common/component';
import Constants from '../common/constants';
import { QueryParam, WordsQuery } from '../interfaces/types';
import { Word } from '../interfaces/typesAPI';
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
`
const answersContainerHTML = ():  string => `
  <div class="answer-variant__container">
    <div class="answer-variant__sign">${answerSign}</div>
    <div class="answer-variant__index"></div>
    <div class="answer-variant__word"></div>
  </div>
`

export default class AudioPage extends Component {
  static level = 0;
  static indexGameMove = 0;
  private static arrayCorrectAnswers: number[] = [];
  private static arrayIncorrectAnswers: number[] = [];
  static collectionWordsFromServer: Word[] = [];
  static arrayOfRandomGameWordsKeys: number[] = [];
  static startGame: () => void;

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
    this.audiocallGameAnswersContainer.node.innerHTML = answersContainerHTML().repeat(5);

    this.audiocallGameButtonContainer = new Component(
      this.audiocallGameContainer.node, 'div', 'audiocall-game__button-container'
    );
    this.buttonSkip = new Component(
      this.audiocallGameButtonContainer.node, 'button', 'button-skip', 'НЕ ЗНАЮ'
    );
    this.buttonNext = new Component(
      this.audiocallGameButtonContainer.node, 'button', 'button-next game-hidden');
    this.arrowNext = new Component(this.buttonNext.node, 'span', 'arrow-next', '→');

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
        console.log('2: this.getWords work');
        return content;
      } catch (err) {
        console.error((<Error>err).message);
        throw err;
      }
    };
    // ------ 1
    this.getWordsForGame = async (): Promise<void> => {
      if (AudioPage.collectionWordsFromServer.length === 0) {
        const tempCollectionWords: Promise<Word[]>[] = [];
        
        if (params) {
          const query = params.map((el) => Object.values(el));
          this.queryObj = Object.fromEntries(query);
          tempCollectionWords.push(this.getWords(this.queryObj));
        } else {
          for (let i = 0; i <= 29; i += 1) {
            const group = String(AudioPage.level);
            const page = String(i);
            this.queryObj = { group, page };
            tempCollectionWords.push(this.getWords(this.queryObj));
          }
        }
        AudioPage.collectionWordsFromServer = (await Promise.all(tempCollectionWords)).flat();
      }
      const arrayOfWordsKeysFromServer = Object.keys(AudioPage.collectionWordsFromServer);

      console.log(
        '3: getWordsForGame work \n arrayOfWordsKeysFromServer:',
        arrayOfWordsKeysFromServer
      );
      console.log(
        '4: AudioPage.collectionWordsFromServer:', 
        AudioPage.collectionWordsFromServer
      );

      while (
        AudioPage.arrayOfRandomGameWordsKeys.length < 20 &&
        AudioPage.arrayOfRandomGameWordsKeys.length < 
        AudioPage.collectionWordsFromServer.length
      ) {
        const keyRandom = arrayOfWordsKeysFromServer.splice(
          Math.floor(Math.random() * arrayOfWordsKeysFromServer.length),
          1
        );

        AudioPage.arrayOfRandomGameWordsKeys.push(+keyRandom);
      }
      console.log('5 arrayOfRandomGameWordsKeys:', AudioPage.arrayOfRandomGameWordsKeys)
    };
    // ------ 2
    this.hideLoader = (): void => {
      this.iconLoaderWrapper.node.classList.add('game-hidden');
    };

    // ------ 3
    AudioPage.startGame = (): void => {};


    this.manageGame();
  }
}