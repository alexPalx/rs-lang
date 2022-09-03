import API from '../../api/api';
import Component from '../../common/component';
import Constants from '../../common/constants';
import Statistics from '../../common/statisticsData';
import { UserWord, Word } from '../../interfaces/typesAPI';
import WordStatistics from './wordStatistics';

type TypeOfCallbacks = {
  [key: string]: () => void;
};

export default class EbookWord extends Component {
  private cardId: string;
  private difficulty = '0';
  private difficult = false;
  private studied = false;

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
  public authBlock: Component | undefined;
  public setHardWordWrapper: Component | undefined;
  public setStudiedWordWrapper: Component | undefined;
  public hardWordTitle: Component | undefined;
  public studiedWordTitle: Component | undefined;
  public setHardWord: Component<HTMLImageElement> | undefined;
  public setStudiedWord: Component<HTMLImageElement> | undefined;
  public getStatisticsWrapper: Component | undefined;
  public getWordStatistics: Component<HTMLImageElement> | undefined;
  public getWordStatisticsTitle: Component | undefined;

  constructor(
    parentElement: HTMLElement,
    wrapper: Component,
    card: Word,
    group: string,
    actions: TypeOfCallbacks
  ) {
    super(parentElement, 'div', 'word-card');
    this.cardId = card.id;
    if (window.location.search) {
      this.difficulty = String(window.location.search?.matchAll(/group=(\d+)/g).next().value[1]);
    }
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

    if (Constants.UserMetadata) {
      this.authBlock = new Component(this.wordCard.node, 'div', 'auth-block');

      this.setHardWordWrapper = new Component(this.authBlock.node, 'div', 'set-hard-word-wrapper');

      this.setHardWord = new Component(this.setHardWordWrapper.node, 'img', 'set-hard-word');
      this.setHardWord.node.src = './assets/svg/brain.svg';
      this.hardWordTitle = new Component(
        this.setHardWordWrapper.node,
        'div',
        'title',
        'Добавить в Сложные слова'
      );
      this.getStatisticsWrapper = new Component(
        this.authBlock.node,
        'div',
        'get-statistics-wrapper'
      );
      this.getWordStatistics = new Component(
        this.getStatisticsWrapper.node,
        'img',
        'get-word-statistics'
      );
      this.getWordStatistics.node.src = './assets/svg/statistics.svg';
      this.getWordStatisticsTitle = new Component(
        this.getStatisticsWrapper.node,
        'div',
        'title',
        'Статистика по слову'
      );
      this.setStudiedWordWrapper = new Component(
        this.authBlock.node,
        'div',
        'set-studied-word-wrapper'
      );
      this.getStatisticsWrapper.node.onclick = () => {
        if (Constants.userWords) {
          const userWord = Constants.userWords.find((word) => word.wordId === this.cardId);
          if (userWord) {
            const statistics = new WordStatistics(wrapper, card.word, userWord);
            console.log(statistics);
          } else {
            const statistics = new WordStatistics(wrapper, card.word, <UserWord>{});
            console.log(statistics);
          }
        }
      };
      this.setHardWordWrapper.node.onclick = async () => {
        if (!this.studied) {
          this.updateWord(true);
          if (group === '6') {
            this.wordCard.node.classList.add('animate__animated');
            this.wordCard.node.classList.add('animate__backOutDown');
            setTimeout(() => {
              this.wordCard.destroy();
            }, 900);
          }
          if (this.wordCard.node.classList.contains('hard-card')) {
            (<Component>this.hardWordTitle).node.textContent = 'Добавить в Сложные слова';
            this.wordCard.node.classList.remove('hard-card');
          } else {
            (<Component>this.hardWordTitle).node.textContent = 'Убрать из Сложных Слов';

            this.wordCard.node.classList.add('hard-card');
          }
        }
      };
      this.setStudiedWordWrapper.node.onclick = () => {
        if (!this.wordCard.node.classList.contains('studied-card')) {
          this.updateWord(false, true);
          this.wordCard.node.classList.toggle('studied-card');
          (<Component>this.studiedWordTitle).node.textContent = 'Изученное слово';
          this.setHardWordWrapper?.destroy();
        }
        if (group === '6') {
          this.wordCard.node.classList.add('animate__animated');
          this.wordCard.node.classList.add('animate__backOutDown');
          setTimeout(() => {
            this.wordCard.destroy();
          }, 900);
        }
        
      };

      this.setStudiedWord = new Component(
        this.setStudiedWordWrapper.node,
        'img',
        'set-studied-word'
      );
      this.setStudiedWord.node.src = './assets/svg/graduate.svg';
      this.studiedWordTitle = new Component(
        this.setStudiedWordWrapper.node,
        'div',
        'title',
        'Пометить как изученное'
      );

      if (Constants.userWords) {
        const userWord = Constants.userWords.find((word) => word.wordId === this.cardId);
        this.difficult = userWord?.optional?.difficult || this.difficult;
        this.studied = userWord?.optional?.learned || this.studied;
        if (this.difficult) {
          this.setHardWordWrapper?.node.classList.add('difficult');
          this.wordCard.node.classList.add('hard-card');
          this.hardWordTitle.node.textContent = 'Убрать из Сложных Слов';
        }
        if (this.studied) {
          this.setStudiedWordWrapper?.node.classList.add('studied');
          this.wordCard.node.classList.add('studied-card');
          this.studiedWordTitle.node.textContent = 'Изученное слово';
          this.setHardWordWrapper.destroy();
        }
      }
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
  private async updateWord(toggleDifficult = false, toggleLearned = false): Promise<void> {
    if (!Constants.UserMetadata || !Constants.userWords) return;
    // if word doesn't exist
    if (!(Constants.userWords.filter((word) => word.wordId === this.cardId).length !== 0)) {
      const created = await API.userWords.createWord(Constants.UserMetadata.userId, this.cardId, {
        difficulty: this.difficulty,
        optional: { difficult: this.difficult, learned: this.studied },
      });
      if (created) Constants.userWords.push(created);
    }

    const userWord =
      Constants.userWords.find((word) => word.wordId === this.cardId) || <UserWord>{};
    const updated = await API.userWords.updateWord(Constants.UserMetadata.userId, this.cardId, {
      difficulty: this.difficulty,
      optional: {
        ...userWord.optional,
        difficult: toggleDifficult ? !this.difficult : this.difficult,
        learned: toggleLearned ? !this.studied : this.studied,
      },
    });

    if (updated) {
      const localWord = Constants.userWords.filter((word) => word.wordId === this.cardId)[0];

      if (toggleDifficult) {
        this.difficult = !this.difficult;
        this.setHardWordWrapper?.node.classList.toggle('difficult');
        if (localWord.optional) localWord.optional.difficult = this.difficult;
      }
      if (toggleLearned) {
        if(Constants.UserMetadata) Statistics.add(userWord.wordId, 'learned');
        this.studied = !this.studied;
        this.setStudiedWordWrapper?.node.classList.toggle('studied');
        if (localWord.optional) localWord.optional.learned = this.studied;
      }
    }
  }
}
