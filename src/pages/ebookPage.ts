import { QueryParam, WordsQuery } from '../interfaces/types';
import Component from '../common/component';
import API from '../api/api';
import Router from '../router/router';

const groupSelect = `<option value="0">Раздел 1</option>
<option value="1">Раздел 2</option>
<option value="2">Раздел 3</option>
<option value="3">Раздел 4</option>
<option value="4">Раздел 5</option>
<option value="5">Раздел 6</option>`;
const MAX_PAGE = '29';
const MIN_PAGE = '0';
const gameLinks = `<a href="/games/audio">Аудиовызов</a>
<a href="/games/sprint">Спринт</a>`;

export default class EbookPage extends Component {
  public wrapper: Component;
  public controls: Component;
  public group: Component;
  public select: Component;
  public pageControlWrapper: Component;
  public pageDown: Component;
  public pageNow: Component;
  public pageUp: Component;
  public gameDropWrapper: Component;
  public gameDropBtn: Component;
  public dropDownContent: Component;

  constructor(parentElement: HTMLElement, params: QueryParam[] | null) {
    super(parentElement, 'div', 'ebook-wrapper');
    let queryObj: WordsQuery = { group: '0', page: '0' };
    if (params) {
      const query = params.map((el) => Object.values(el));
      queryObj = Object.fromEntries(query);
      console.log(queryObj);
    }
    this.wrapper = this;
    this.controls = new Component(this.wrapper.node, 'div', 'controls');
    this.group = new Component(this.controls.node, 'div', 'group-select');
    this.select = new Component(this.group.node, 'select', 'select-classic');
    this.select.node.innerHTML = groupSelect;

    this.select.node.addEventListener('change', () => {
      const group = (<HTMLSelectElement>this.select.node).value;
      Router.goTo(new URL(`http://${window.location.host}/ebook?group=${group}&page=0`));
    });

    (<HTMLSelectElement>this.select.node).value = queryObj.group;
    this.pageControlWrapper = new Component(this.controls.node, 'div', 'page-controls-wrapper');
    this.pageDown = new Component(this.pageControlWrapper.node, 'a', 'page-down', '←');

    (<HTMLAnchorElement>this.pageDown.node).href = `/ebook?page=${
      queryObj.page === MIN_PAGE ? queryObj.page : +queryObj.page - 1
    }&group=${queryObj.group}`;

    this.pageNow = new Component(
      this.pageControlWrapper.node,
      'div',
      'page-now',
      `Страница ${Number(queryObj.page) + 1}`
    );

    this.pageUp = new Component(this.pageControlWrapper.node, 'a', 'page-up', '→');

    (<HTMLAnchorElement>this.pageUp.node).href = `/ebook?page=${
      queryObj.page === MAX_PAGE ? queryObj.page : +queryObj.page + 1
    }&group=${queryObj.group}`;

    this.gameDropWrapper = new Component(this.controls.node, 'div', 'dropdown');
    this.gameDropBtn = new Component(this.gameDropWrapper.node, 'button', 'dropbtn', 'Мини-Игры');
    this.dropDownContent = new Component(this.gameDropWrapper.node, 'div', 'game-drop-content');
    this.dropDownContent.node.innerHTML = gameLinks;

    this.gameDropBtn.node.onclick = () => {
      this.dropDownContent.node.classList.toggle("show");
    }
    window.onclick = (e) => {
      if (!(<HTMLElement>e.target).classList.contains('dropbtn')) {
        this.dropDownContent.node.classList.remove('show');
      }
        
    }
    const cardsData = API.getWords(queryObj);
    cardsData.then((data) => {
      console.log(data);
    });
  }
}
