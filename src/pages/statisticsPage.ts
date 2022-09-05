import * as Chartist from 'chartist';
import Component from '../common/component';
import Constants from '../common/constants';
import Statistics from '../common/statisticsData';

export default class StatisticsPage extends Component {
  public spinnerWrapper: Component<HTMLElement>;
  public spinner: Component<HTMLElement> | undefined;
  public content: Component<HTMLElement>;
  public gamesWrapper: Component<HTMLElement>;
  public wordsWrapper: Component<HTMLElement>;
  public learnedWordsWrapper: Component<HTMLElement>;
  public learnedWordsAllTime: Component<HTMLElement>;
  public sprintStreaks: Component<HTMLElement>;
  public audioStreaks: Component<HTMLElement>;
  public seenWords: Component<HTMLElement>;
  public learnedWords: Component<HTMLElement>;
  public learnedChart: Component<HTMLElement>;
  public seenChart: Component<HTMLElement>;
  public seenChartTitle: Component<HTMLElement>;
  public learnedChartTitle: Component<HTMLElement>;

  constructor(parentElement: HTMLElement) {
    super(parentElement, 'div', 'statistics-wrapper');

    this.spinnerWrapper = new Component(this.node, 'div', 'spinner-wrapper');
    this.spinner = new Component(this.spinnerWrapper.node, 'div', 'lds-dual-ring');
    this.content = new Component(this.node, 'div', 'statistics-content');

    this.learnedWordsWrapper = new Component(this.content.node);
    this.learnedWordsAllTime = new Component(this.learnedWordsWrapper.node, 'p');

    this.gamesWrapper = new Component(this.content.node, 'div', 'statistics-games-wrapper');
    this.sprintStreaks = new Component(this.gamesWrapper.node, 'p', 'statistics-sprint-streaks');
    this.audioStreaks = new Component(this.gamesWrapper.node, 'p', 'statistics-audio-streaks');

    this.wordsWrapper = new Component(this.content.node, 'div', 'statistics-words-wrapper');
    this.seenWords = new Component(this.wordsWrapper.node, 'p');
    this.learnedWords = new Component(this.wordsWrapper.node, 'p');

    this.seenChartTitle = new Component(this.node, 'p');
    this.seenChart = new Component(this.node, 'div', 'ct-line');
    this.learnedChartTitle = new Component(this.node, 'p');
    this.learnedChart = new Component(this.node, 'div', 'ct-line');

    if (!Constants.UserMetadata) {
      this.spinnerWrapper.destroy();
      this.node.style.marginTop = '30vh';
      this.learnedWordsAllTime.node.textContent =
        'Статистика доступна только для зарегистрированных пользователей';
      return;
    }

    const statistics = Statistics.get();
    statistics.then(async (data) => {
      if (data) {
        setTimeout(() => {
          this.seenChartTitle.node.textContent = 'Новые слова:';
          this.learnedChartTitle.node.textContent = 'Изученные слова:';
          this.learnedWordsAllTime.node.textContent = data.optional.learnedWordsList
            ? `Слов изучено: ${data.optional.learnedWordsList.length}`
            : 'Слов изучено: 0';

          const sprintStreak =
            data.optional.sprintStreakPerDay[
              data.optional.sprintStreakPerDay.findIndex((el) => el.date === Statistics.currentDay)
            ]?.streak;
          this.sprintStreaks.node.textContent = sprintStreak
            ? `Спринт: самая длинная серия: ${sprintStreak}`
            : 'Спринт: самая длинная серия: 0';

          const audioStreak =
            data.optional.audioStreakPerDay[
              data.optional.audioStreakPerDay.findIndex((el) => el.date === Statistics.currentDay)
            ]?.streak;
          this.audioStreaks.node.textContent = audioStreak
            ? `Аудиовызов: самая длинная серия: ${audioStreak}`
            : 'Аудиовызов: самая длинная серия: 0';

          const newWords =
            data.optional.newWordsPerDay[
              data.optional.newWordsPerDay.findIndex((el) => el.date === Statistics.currentDay)
            ]?.words;
          this.seenWords.node.textContent = newWords
            ? `Новые слова за сегодня: ${newWords}`
            : 'Новые слова за сегодня: 0';

          const learnedWords =
            data.optional.learnedWordsPerDay[
              data.optional.learnedWordsPerDay.findIndex((el) => el.date === Statistics.currentDay)
            ]?.words;
          this.learnedWords.node.textContent = learnedWords
            ? `Изученные слова за сегодня: ${learnedWords}`
            : 'Изученные слова за сегодня: 0';

          const months = [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря',
          ];

          let seenWordsCount = 0;
          const seenLabels: string[] = [];
          let seenChartData = <Chartist.Series>(<unknown>data.optional.newWordsPerDay.map(
            (el, i) => {
              seenWordsCount += el.words;
              seenLabels.push(
                `${new Date(el.date).getDate()} ${months[new Date(el.date).getMonth()]}`
              );
              return {
                x: i,
                y: seenWordsCount,
              };
            }
          ));

          if (seenChartData.length > 30) seenChartData = seenChartData.slice(-29);
          if (seenChartData.length < 30) {
            const a = <Chartist.SeriesValue<Chartist.SeriesPrimitiveValue>>(
              (<unknown>{ x: -1, y: 0 })
            );
            seenChartData.unshift(a);
            seenLabels.unshift('До обучения');
          }

          new Chartist.LineChart(
            this.seenChart.node,
            {
              labels: seenLabels,
              series: [seenChartData],
            },
            {
              height: '20vh',
              width: '50vw',
              chartPadding: {
                right: 20,
              },
              axisX: {
                showGrid: true,
                onlyInteger: true,
                showLabel: true,
              },
              axisY: {
                showGrid: true,
                onlyInteger: true,
              },
            }
          );

          const learnedLabels: string[] = [];
          let learnedWordsCount = 0;
          let learnedChartData = <Chartist.Series>(<unknown>data.optional.learnedWordsPerDay.map(
            (el, i) => {
              learnedWordsCount += el.words;
              learnedLabels.push(
                `${new Date(el.date).getDate()} ${months[new Date(el.date).getMonth()]}`
              );
              return {
                x: i,
                y: learnedWordsCount,
              };
            }
          ));

          if (learnedChartData.length > 30) learnedChartData = learnedChartData.slice(-29);
          if (learnedChartData.length < 30) {
            const a = <Chartist.SeriesValue<Chartist.SeriesPrimitiveValue>>(
              (<unknown>{ x: -1, y: 0 })
            );
            learnedChartData.unshift(a);
            learnedLabels.unshift('До обучения');
          }

          new Chartist.LineChart(
            this.learnedChart.node,
            {
              labels: learnedLabels,
              series: [learnedChartData],
            },
            {
              height: '20vh',
              width: '50vw',
              chartPadding: {
                right: 20,
              },
              axisX: {
                showGrid: true,
                onlyInteger: true,
                showLabel: true,
              },
              axisY: {
                showGrid: true,
                onlyInteger: true,
              },
            }
          );
          this.spinnerWrapper.destroy();
        }, 300);
      }
    });
  }
}
