import API from '../api/api';
import { StatisticsData } from '../interfaces/typesAPI';
import Constants from './constants';

export default class Statistics {
  public static learnedWords: number = 0;
  public static startDate: number | undefined;
  public static currentDay: number;
  public static sprintStreakPerDay: { date: number; streak: number }[];
  public static audioStreakPerDay: { date: number; streak: number }[];
  public static newWordsPerDay: { date: number; words: number }[];
  public static learnedWordsPerDay: { date: number; words: number }[];
  public static learnedWordsList: string[];
  public static seenWordsList: string[];

  public static async init(): Promise<void> {
    if (!Constants.UserMetadata) return;
    const date = new Date();
    this.currentDay = Number(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    const data = await this.get();
    if (!data?.optional.startDate) this.startDate = this.currentDay;
    if (data) {
      this.learnedWords = data.learnedWords;
      this.sprintStreakPerDay = data.optional.sprintStreakPerDay;
      this.audioStreakPerDay = data.optional.audioStreakPerDay;
      this.newWordsPerDay = data.optional.newWordsPerDay;
      this.learnedWordsPerDay = data.optional.learnedWordsPerDay;
      this.learnedWordsList = data.optional.learnedWordsList;
      this.seenWordsList = data.optional.seenWordsList;
    }

    this.update();
  }

  public static async get(): Promise<StatisticsData | undefined> {
    if (!Constants.UserMetadata) return undefined;
    const statisticsData = await API.statistics.get(Constants.UserMetadata.userId);
    const statistics: StatisticsData = statisticsData
      ? {
          learnedWords: this.learnedWords,
          optional: {
            startDate: <number>statisticsData.optional.startDate,
            sprintStreakPerDay: statisticsData.optional.sprintStreakPerDay,
            audioStreakPerDay: statisticsData.optional.audioStreakPerDay,
            newWordsPerDay: statisticsData.optional.newWordsPerDay,
            learnedWordsPerDay: statisticsData.optional.learnedWordsPerDay,
            seenWordsList: statisticsData.optional.seenWordsList,
            learnedWordsList: statisticsData.optional.learnedWordsList,
          },
        }
      : {
          learnedWords: this.learnedWords,
          optional: {
            startDate: <number>this.startDate,
            sprintStreakPerDay: [{ date: this.currentDay, streak: 0 }],
            audioStreakPerDay: [{ date: this.currentDay, streak: 0 }],
            newWordsPerDay: [{ date: this.currentDay, words: 0 }],
            learnedWordsPerDay: [{ date: this.currentDay, words: 0 }],
            learnedWordsList: [],
            seenWordsList: [],
          },
        };
    return statistics;
  }

  public static async updadeGameStats(game: 'sprint' | 'audio', isWin: boolean): Promise<void> {
    if (game === 'sprint') {
      if (this.currentDay === this.sprintStreakPerDay[this.sprintStreakPerDay.length - 1].date)
        this.sprintStreakPerDay[this.sprintStreakPerDay.length - 1].streak =
          this.sprintStreakPerDay[this.sprintStreakPerDay.length - 1].streak * Number(isWin) +
          Number(isWin);
      else this.sprintStreakPerDay.push({ date: this.currentDay, streak: Number(isWin) });
    } else if (game === 'audio') {
      if (this.currentDay === this.audioStreakPerDay[this.audioStreakPerDay.length - 1].date)
        this.audioStreakPerDay[this.audioStreakPerDay.length - 1].streak +=
          this.audioStreakPerDay[this.audioStreakPerDay.length - 1].streak * Number(isWin) +
          Number(isWin);
      else this.audioStreakPerDay.push({ date: this.currentDay, streak: Number(isWin) });
    }

    this.update();
  }

  public static add(wordId: string, list: 'seen' | 'learned'): void {
    const lastLearnedLength = this.learnedWordsList.length;
    const lastNewWordsLength = this.seenWordsList.length;

    if (list === 'learned' && !this.learnedWordsList.includes(wordId)) {
      this.learnedWordsList.push(wordId);
      if (!this.learnedWordsPerDay.find((word) => word.date === this.currentDay))
        this.learnedWordsPerDay.push({ date: this.currentDay, words: 0 });
      this.learnedWordsPerDay[
        this.learnedWordsPerDay.findIndex((word) => word.date === this.currentDay)
      ].words += this.learnedWordsList.length - lastLearnedLength;
    } else if (list === 'seen' && !this.seenWordsList.includes(wordId)) {
      this.seenWordsList.push(wordId);
      if (!this.newWordsPerDay.find((word) => word.date === this.currentDay))
        this.newWordsPerDay.push({ date: this.currentDay, words: 0 });
      this.newWordsPerDay[
        this.newWordsPerDay.findIndex((word) => word.date === this.currentDay)
      ].words += this.seenWordsList.length - lastNewWordsLength;
    }

    this.update();
  }

  public static remove(wordId: string, list: 'seen' | 'learned'): void {
    const lastLearnedLength = this.learnedWordsList.length;
    const lastNewWordsLength = this.seenWordsList.length;

    if (list === 'learned' && this.learnedWordsList.includes(wordId)) {
      this.learnedWordsList = this.learnedWordsList.filter((el) => el !== wordId);
      if (!this.learnedWordsPerDay.find((word) => word.date === this.currentDay))
        this.learnedWordsPerDay.push({ date: this.currentDay, words: 0 });
      this.learnedWordsPerDay[
        this.learnedWordsPerDay.findIndex((word) => word.date === this.currentDay)
      ].words += this.learnedWordsList.length - lastLearnedLength;
    } else if (list === 'seen' && this.seenWordsList.includes(wordId)) {
      this.learnedWordsList = this.learnedWordsList.filter((el) => el !== wordId);
      if (!this.newWordsPerDay.find((word) => word.date === this.currentDay))
        this.newWordsPerDay.push({ date: this.currentDay, words: 0 });
      this.newWordsPerDay[
        this.newWordsPerDay.findIndex((word) => word.date === this.currentDay)
      ].words += this.seenWordsList.length - lastNewWordsLength;
    }

    this.update();
  }

  private static async update(): Promise<void> {
    if (!Constants.UserMetadata) return;
    const statisticsData = await this.get();
    if (statisticsData) {
      statisticsData.learnedWords = this.learnedWords;
      statisticsData.optional.startDate = <number>this.startDate;
      statisticsData.optional.sprintStreakPerDay = this.sprintStreakPerDay;
      statisticsData.optional.audioStreakPerDay = this.audioStreakPerDay;
      statisticsData.optional.newWordsPerDay = this.newWordsPerDay;
      statisticsData.optional.learnedWordsPerDay = this.learnedWordsPerDay;
      statisticsData.optional.learnedWordsList = this.learnedWordsList;
      statisticsData.optional.seenWordsList = this.seenWordsList;
      API.statistics.update(Constants.UserMetadata.userId, statisticsData).then(console.dir);
    }
  }
}
