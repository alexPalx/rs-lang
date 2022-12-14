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
  public todayStatistic: Component<HTMLElement>;
  public allTimeChartsTitle: Component<HTMLElement>;

  constructor(parentElement: HTMLElement) {
    super(parentElement, 'div', 'statistics-wrapper');

    this.spinnerWrapper = new Component(this.node, 'div', 'spinner-wrapper');
    this.spinner = new Component(this.spinnerWrapper.node, 'div', 'lds-dual-ring');
    this.content = new Component(this.node, 'div', 'statistics-content');

    this.learnedWordsWrapper = new Component(this.content.node);
    this.learnedWordsAllTime = new Component(
      this.learnedWordsWrapper.node,
      'p',
      'statistic-group-title'
    );

    this.todayStatistic = new Component(this.content.node, 'p', 'statistic-group-title');

    this.gamesWrapper = new Component(this.content.node, 'div', 'statistics-games-wrapper');
    this.sprintStreaks = new Component(this.gamesWrapper.node, 'p', 'statistics-sprint-streaks');
    this.audioStreaks = new Component(this.gamesWrapper.node, 'p', 'statistics-audio-streaks');

    this.wordsWrapper = new Component(this.content.node, 'div', 'statistics-words-wrapper');
    this.seenWords = new Component(this.wordsWrapper.node, 'p');
    this.learnedWords = new Component(this.wordsWrapper.node, 'p');

    this.allTimeChartsTitle = new Component(this.node, 'p', 'statistic-group-title');
    this.allTimeChartsTitle.node.style.marginTop = '20px';
    this.seenChartTitle = new Component(this.node, 'p');
    this.seenChart = new Component(this.node, 'div', 'ct-line');
    this.learnedChartTitle = new Component(this.node, 'p');
    this.learnedChart = new Component(this.node, 'div', 'ct-line');

    if (!Constants.UserMetadata) {
      this.spinnerWrapper.destroy();
      this.node.style.marginTop = '30vh';
      this.learnedWordsAllTime.node.textContent =
        '???????????????????? ???????????????? ???????????? ?????? ???????????????????????????????????? ??????????????????????????';
      return;
    }

    const statistics = Statistics.get();
    statistics.then(async (data) => {
      if (data) {
        setTimeout(() => {
          this.seenChartTitle.node.textContent = '?????????? ??????????:';
          this.learnedChartTitle.node.textContent = '?????????????????? ??????????:';
          this.learnedWordsAllTime.node.textContent = data.optional.learnedWordsList
            ? `???????? ??????????????: ${data.optional.learnedWordsList.length}`
            : '???????? ??????????????: 0';

          this.todayStatistic.node.textContent = '???????????????????? ???? ??????????????:';
          const sprintStreak =
            data.optional.sprintStreakPerDay[
              data.optional.sprintStreakPerDay.findIndex((el) => el.date === Statistics.currentDay)
            ]?.streak;
          this.sprintStreaks.node.textContent = sprintStreak
            ? `????????????: ?????????? ?????????????? ??????????: ${sprintStreak}`
            : '????????????: ?????????? ?????????????? ??????????: 0';

          const audioStreak =
            data.optional.audioStreakPerDay[
              data.optional.audioStreakPerDay.findIndex((el) => el.date === Statistics.currentDay)
            ]?.streak;
          this.audioStreaks.node.textContent = audioStreak
            ? `????????????????????: ?????????? ?????????????? ??????????: ${audioStreak}`
            : '????????????????????: ?????????? ?????????????? ??????????: 0';

          const newWords =
            data.optional.newWordsPerDay[
              data.optional.newWordsPerDay.findIndex((el) => el.date === Statistics.currentDay)
            ]?.words;
          this.seenWords.node.textContent = newWords
            ? `?????????? ??????????: ${newWords}`
            : '?????????? ??????????: 0';

          const learnedWords =
            data.optional.learnedWordsPerDay[
              data.optional.learnedWordsPerDay.findIndex((el) => el.date === Statistics.currentDay)
            ]?.words;
          this.learnedWords.node.textContent = learnedWords
            ? `?????????????????? ??????????: ${learnedWords}`
            : '?????????????????? ??????????: 0';

          const months = [
            '????????????',
            '??????????????',
            '??????????',
            '????????????',
            '??????',
            '????????',
            '????????',
            '??????????????',
            '????????????????',
            '??????????????',
            '????????????',
            '??????????????',
          ];

          this.allTimeChartsTitle.node.textContent = '???????????????????? ???? ?????? ??????????:';

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
            seenLabels.unshift('???? ????????????????');
          }

          new Chartist.LineChart(
            this.seenChart.node,
            {
              labels: seenLabels,
              series: [seenChartData],
            },
            {
              height: '20vh',
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
            learnedLabels.unshift('???? ????????????????');
          }

          new Chartist.LineChart(
            this.learnedChart.node,
            {
              labels: learnedLabels,
              series: [learnedChartData],
            },
            {
              height: '20vh',
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
