import Component from '../../common/component';
import Constants from '../../common/constants';
import { Word } from '../../interfaces/typesAPI';

type TypeOfCallbacks = {
  [key: string]: () => void;
};

export default class EbookWord extends Component {
  public wordCard: Component;
  public leftWrapper: Component;
  public wordImage: Component<HTMLImageElement>;
  public wordMain: Component;
  public wordHeader: Component;
  public playBtn: Component<HTMLImageElement>;
  public starsWrapper: Component;
  public wordTranscription: Component;
  public wordTranslate: Component;
  public textExample: Component;
  public textExampleTranslate: Component;
  public textMeaning: Component;
  public textMeaningTranslate: Component;
  public audio: HTMLAudioElement;
  public authBlock: Component | null;
  public setHardWordWrapper: Component;
  public setStudiedWordWrapper: Component;
  public hardWordTitle: Component;
  public studiedWordTitle: Component;
  public setHardWord: Component<HTMLImageElement> | null;
  public setStudiedWord: Component<HTMLImageElement> | null;

  constructor(parentElement: HTMLElement, card: Word, group: string, actions: TypeOfCallbacks) {
    super(parentElement, 'div', 'word-card');
    const cookie = Constants.UserMetadata;
    let currentTrack = 0;
    this.wordCard = this;
    this.leftWrapper = new Component(this.wordCard.node, 'div', 'left-wrapper');
    this.wordImage = new Component(this.leftWrapper.node, 'img', 'word-img');
    this.starsWrapper = new Component(this.leftWrapper.node, 'div', 'stars-wrapper');
    this.starsWrapper.node.innerHTML = `${'<span class="fa fa-star checked"></span>'.repeat(
      +group + 1
    )}`;
    this.wordImage.node.src = `${Constants.serverURL}/${card.image}`;
    this.wordMain = new Component(this.leftWrapper.node, 'div', 'word-main');
    this.wordHeader = new Component(this.wordMain.node, 'div', 'word-header');

    this.wordTranscription = new Component(
      this.wordHeader.node,
      'div',
      'word-and-transcription',
      `${card.word} - ${card.transcription}`
    );
    this.playBtn = new Component(this.wordTranscription.node, 'img', 'play-btn');
    this.playBtn.node.src = './assets/svg/play-icon.svg';
    this.wordTranslate = new Component(
      this.wordMain.node,
      'div',
      'word-translate',
      `${card.wordTranslate}`
    );

    this.textMeaning = new Component(this.wordMain.node, 'div', 'text-meaning');
    this.textMeaning.node.innerHTML = card.textMeaning;
    this.textMeaningTranslate = new Component(this.wordMain.node, 'div', 'text-meaning-translate');
    this.textMeaningTranslate.node.innerHTML = card.textMeaningTranslate;

    this.textExample = new Component(this.wordMain.node, 'div', 'text-example');
    this.textExample.node.innerHTML = card.textExample;
    this.textExampleTranslate = new Component(this.wordMain.node, 'div', 'text-example-translate');
    this.textExampleTranslate.node.innerHTML = card.textExampleTranslate;
    this.audio = new Audio(`${Constants.serverURL}/${card.audio}`);
    const nextAudio = [
      `${Constants.serverURL}/${card.audioMeaning}`,
      `${Constants.serverURL}/${card.audioExample}`,
    ];
    this.authBlock = null;
    this.setHardWord = null;
    this.setStudiedWord = null;

    this.authBlock = new Component(this.wordCard.node, 'div', 'auth-block');
    this.authBlock.node.classList.add('none');
    this.setHardWordWrapper = new Component(this.authBlock.node, 'div', 'set-hard-word-wrapper');
    this.setHardWord = new Component(this.setHardWordWrapper.node, 'img', 'set-hard-word');
    this.setHardWord.node.src = './assets/svg/hardword.svg';
    this.hardWordTitle = new Component(
      this.setHardWordWrapper.node,
      'div',
      'title',
      'Добавить в Сложные слова'
    );
    this.setStudiedWordWrapper = new Component(
      this.authBlock.node,
      'div',
      'set-studied-word-wrapper'
    );
    this.setStudiedWord = new Component(this.setStudiedWordWrapper.node, 'img', 'set-studied-word');
    this.setStudiedWord.node.src = './assets/svg/graduate.svg';
    this.studiedWordTitle = new Component(
      this.setStudiedWordWrapper.node,
      'div',
      'title',
      'Пометить как изученное'
    );
    if (cookie) {
      this.authBlock.node.classList.remove('none');
    }

    this.playBtn.node.onclick = () => {
      if (this.audio.paused) {
        actions.startPlay();
        this.audio.src = `${Constants.serverURL}/${card.audio}`;
        this.audio.play();
        this.playBtn.node.src = './assets/svg/pause-icon.svg';
      } else {
        this.audio.pause();
        this.playBtn.node.src = './assets/svg/play-icon.svg';
        currentTrack = 0;
      }
    };
    this.audio.onended = () => {
      if (currentTrack < 2) {
        this.audio.src = nextAudio[currentTrack];
        currentTrack += 1;
        this.audio.play();
      } else {
        currentTrack = 0;
        this.playBtn.node.src = './assets/svg/play-icon.svg';
      }
    };
  }
  public stopPlay() {
    if (this.audio.played) {
      this.audio.pause();
      this.playBtn.node.src = './assets/svg/play-icon.svg';
    }
  }
}
