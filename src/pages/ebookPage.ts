import { QueryParam, WordsQuery } from '../interfaces/types';
import Component from '../common/component';
import API from '../api/api';
import Router from '../router/router';
import EbookWord from './components/ebookWord';
import { Word } from '../interfaces/typesAPI';
import Constants from '../common/constants';
import Statistics from '../common/statisticsData';

const groupSelect = `<option value="0">Раздел 1</option>
<option value="1">Раздел 2</option>
<option value="2">Раздел 3</option>
<option value="3">Раздел 4</option>
<option value="4">Раздел 5</option>
<option value="5">Раздел 6</option>`;
const MAX_PAGE = '29';
const MIN_PAGE = '0';

export default class EbookPage extends Component {
  public wrapper: Component;
  public controls: Component;
  public group: Component;
  public select: Component<HTMLSelectElement>;
  public pageControlWrapper: Component;
  public pageDown: Component<HTMLAnchorElement>;
  public pageNow: Component;
  public pageUp: Component<HTMLAnchorElement>;
  public gameDropWrapper: Component;
  public gameDropBtn: Component;
  public dropDownContent: Component;
  public contentWrapper: Component;
  public cardsWrapper: Component;
  public spinnerWrapper: Component;
  public lock: Component<HTMLImageElement>;
  public spinner: Component;
  public isPlay: boolean;
  public completedCards: number;
  cards: EbookWord[];

  constructor(parentElement: HTMLElement, params: QueryParam[] | null) {
    super(parentElement, 'div', 'ebook-wrapper');
    this.cards = [];
    this.isPlay = false;
    this.completedCards = 0;
    let queryObj: WordsQuery = { group: '0', page: '0' };
    if (params) {
      const query = params.map((el) => Object.values(el));
      queryObj = Object.fromEntries(query);
    }
    this.wrapper = this;
    this.controls = new Component(this.wrapper.node, 'div', 'controls');
    this.group = new Component(this.controls.node, 'div', 'group-select');
    this.select = new Component(this.group.node, 'select', 'select-classic');
    this.select.node.innerHTML = groupSelect;
    if (Constants.UserMetadata)
      this.select.node.innerHTML += '<option value="6">Сложные слова</option>';

    this.select.node.addEventListener('change', () => {
      const group = this.select.node.value;
      Router.goTo(new URL(`http://${window.location.host}/ebook?group=${group}&page=0`));
    });

    this.select.node.value = queryObj.group;
    this.pageControlWrapper = new Component(this.controls.node, 'div', 'page-controls-wrapper');
    this.pageDown = new Component(this.pageControlWrapper.node, 'a', 'page-down', '←');

    this.pageDown.node.href = `/ebook?group=${queryObj.group}&page=${
      queryObj.page === MIN_PAGE ? queryObj.page : +queryObj.page - 1
    }`;

    this.pageNow = new Component(
      this.pageControlWrapper.node,
      'div',
      'page-now',
      `Страница ${Number(queryObj.page) + 1}`
    );

    this.pageUp = new Component(this.pageControlWrapper.node, 'a', 'page-up', '→');

    this.pageUp.node.href = `/ebook?group=${queryObj.group}&page=${
      queryObj.page === MAX_PAGE ? queryObj.page : +queryObj.page + 1
    }`;
    if (queryObj.group === '6') {
      this.pageControlWrapper.destroy();
    }
    this.gameDropWrapper = new Component(this.controls.node, 'div', 'dropdown');
    this.gameDropBtn = new Component(this.gameDropWrapper.node, 'button', 'dropbtn', 'Мини-Игры');
    this.lock = new Component(this.gameDropBtn.node, 'img', 'lock');
    this.lock.node.src = './assets/svg/lock.svg';
    this.lock.node.classList.add('none');

    this.dropDownContent = new Component(this.gameDropWrapper.node, 'div', 'game-drop-content');
    this.dropDownContent.node.innerHTML = this.setGameLinks(queryObj.group, queryObj.page);

    this.contentWrapper = new Component(this.wrapper.node, 'div', 'content-wrapper');
    this.cardsWrapper = new Component(this.contentWrapper.node, 'div', 'none');
    this.gameDropBtn.node.onclick = () => {
      if (this.completedCards < 20) {
        this.dropDownContent.node.classList.toggle('show');
      }
    };
    this.spinnerWrapper = new Component(this.contentWrapper.node, 'div', 'spinner-wrapper');
    this.spinner = new Component(this.spinnerWrapper.node, 'div', 'lds-dual-ring');
    window.addEventListener('click', (e) => {
      if (!(<HTMLElement>e.target).classList.contains('dropbtn')) {
        this.dropDownContent.node.classList.remove('show');
      }
    });
    const cardsData =
      queryObj.group !== '6'
        ? API.words.getWords(queryObj)
        : API.userAggregatedWords.getWords(
            String(Constants.UserMetadata?.userId),
            undefined,
            queryObj.page,
            '3600',
            '{"$and":[{"userWord.optional.difficult":true}, {"userWord.optional.learned":false}]}'
          );
    cardsData.then(async (data) => {
      if (data) {
        if (Constants.UserMetadata && !Constants.userWords) {
          Constants.userWords = await API.userWords.getWords(Constants.UserMetadata.userId);
        }
        this.addItems(data, queryObj.group);
        setTimeout(() => {
          this.cardsWrapper.node.classList.remove('none');
          this.spinnerWrapper.destroy();
        }, 300);
      }
    });
  }
  addItems(wordscards: Array<Word>, group: string): void {
    this.cards = wordscards.map((card) => {
      const item = new EbookWord(this.cardsWrapper.node, this.wrapper, card, group, {
        startPlay: () => {
          this.cards.map((el) => el.stopPlay());
        },
        incCompleated: () => {
          this.completedCards += 1;
        },
        decCompleated: () => {
          this.completedCards -= 1;
        },
        getCompleatedCount: () => this.completedCards,
        changePageCompleated: () => this.changeCompleated(),
      });
      if (Constants.UserMetadata) {
        setTimeout(() => {
          Statistics.add(card.id, 'seen');
        }, 1000);
      }
      return item;
    });
  }
  setGameLinks(group: string, page: string): string {
    return `<a href="/audio?group=${group}&page=${page}">Аудиовызов</a>
            <a href="/sprint?group=${group}&page=${page}">Спринт</a>`;
  }

  changeCompleated() {
    this.lock.node.classList.toggle('none');
    this.pageNow.node.classList.toggle('compleated');
    this.cardsWrapper.node.classList.toggle('shadow-compleated');
  }
}
