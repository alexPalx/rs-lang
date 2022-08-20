import Constants from '../../common/constants';
import AboutPage from '../../pages/aboutPage';
import DictionaryPage from '../../pages/dictionaryPage';
import EbookPage from '../../pages/ebookPage';
import GamesPage from '../../pages/gamesPage';
import MainPage from '../../pages/mainPage';
import NotFoundPage from '../../pages/notFoundPage';
import StatisticsPage from '../../pages/statisticsPage';
import Control from '../../utils/control';

export default class Content extends Control {
  public content: Control | undefined;

  constructor() {
    const contentWrapper = document.getElementById('main');
    super(contentWrapper, 'div', 'content');
  }

  public setContent(path: string) {
    if (this.content) this.content.destroy();

    switch (path) {
      case '':
        this.content = new NotFoundPage(this.node);
        break;
      case Constants.routes.main:
        this.content = new MainPage(this.node);
        break;
      case Constants.routes.ebook:
        this.content = new EbookPage(this.node);
        break;
      case Constants.routes.dictionary:
        this.content = new DictionaryPage(this.node);
        break;
      case Constants.routes.games:
        this.content = new GamesPage(this.node);
        break;
      case Constants.routes.statistics:
        this.content = new StatisticsPage(this.node);
        break;
      case Constants.routes.about:
        this.content = new AboutPage(this.node);
        break;

      default:
        break;
    }
  }
}
