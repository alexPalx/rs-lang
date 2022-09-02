import Component from '../common/component';
import Statistics from '../common/statisticsData';

export default class StatisticsPage extends Component {
  public spinnerWrapper: Component<HTMLElement>;
  public spinner: Component<HTMLElement>;
  content: Component<HTMLElement>;

  constructor(parentElement: HTMLElement) {
    super(parentElement, 'div', 'statistics-wrapper');
    this.spinnerWrapper = new Component(this.node, 'div', 'spinner-wrapper');
    this.spinner = new Component(this.spinnerWrapper.node, 'div', 'lds-dual-ring');
    this.content = new Component(this.node, 'div', 'statistics-content');

    const statistics = Statistics.get();
    statistics.then(async (data) => {
      if (data) {
        setTimeout(() => {
          this.content.node.innerHTML = `currentDay: ${Statistics.currentDay}<br>`;
          this.content.node.innerHTML += `learnedWords: ${JSON.stringify(data.learnedWords)}<br>
            startDate: ${data.optional.startDate}<br>
            sprintStreakPerDay: ${JSON.stringify(data.optional.sprintStreakPerDay)}<br>
            audioStreakPerDay ${JSON.stringify(data.optional.audioStreakPerDay)}<br>
            newWordsPerDay: ${JSON.stringify(data.optional.newWordsPerDay)}<br>
            learnedWordsPerDay: ${JSON.stringify(data.optional.learnedWordsPerDay)}<br>
            seenWordsPerDay: ${JSON.stringify(data.optional.seenWordsList)}<br>
            learnedWordsList: ${JSON.stringify(data.optional.learnedWordsList)}`;
          this.spinnerWrapper.destroy();
        }, 300);
      }
    });
  }
}
