import Component from '../common/component';
import { QueryParam, WordsQuery } from '../interfaces/types';

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

    if (params) {
      const query = params.map((el) => Object.values(el));
      this.queryObj = Object.fromEntries(query);
    }
  }
}