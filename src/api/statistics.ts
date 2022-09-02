import { RequestMethod, StatisticsData } from '../interfaces/typesAPI';
import Utils from '../utils/utils';
import API from './api';

export default class UserStatistics {
  public static async get(userId: string): Promise<StatisticsData | undefined> {
    const responseData = await API.sendRequest<StatisticsData>(
      Utils.buildLink(['users', userId, 'statistics']),
      RequestMethod.GET,
      undefined,
      true
    );
    const returnData = responseData
      ? {
          learnedWords: responseData.learnedWords,
          optional: {
            startDate: responseData.optional.startDate,
            sprintStreakPerDay: JSON.parse(
              <string>(<unknown>responseData.optional.sprintStreakPerDay)
            ),
            audioStreakPerDay: JSON.parse(
              <string>(<unknown>responseData.optional.audioStreakPerDay)
            ),
            newWordsPerDay: JSON.parse(<string>(<unknown>responseData.optional.newWordsPerDay)),
            learnedWordsPerDay: JSON.parse(
              <string>(<unknown>responseData.optional.learnedWordsPerDay)
            ),
            learnedWordsList: JSON.parse(<string>(<unknown>responseData.optional.learnedWordsList)),
            seenWordsList: JSON.parse(<string>(<unknown>responseData.optional.seenWordsList)),
          },
        }
      : undefined;

    return returnData;
  }

  public static async update(
    userId: string,
    statisticsData: StatisticsData
  ): Promise<StatisticsData | undefined> {
    console.warn(statisticsData.optional.newWordsPerDay);
    console.warn(JSON.stringify(statisticsData.optional.newWordsPerDay));
    const responseData = await API.sendRequest<StatisticsData>(
      Utils.buildLink(['users', userId, 'statistics']),
      RequestMethod.PUT,
      {
        learnedWords: statisticsData.learnedWords,
        optional: {
          startDate: statisticsData.optional.startDate,
          sprintStreakPerDay: JSON.stringify(statisticsData.optional.sprintStreakPerDay),
          audioStreakPerDay: JSON.stringify(statisticsData.optional.audioStreakPerDay),
          newWordsPerDay: JSON.stringify(statisticsData.optional.newWordsPerDay),
          learnedWordsPerDay: JSON.stringify(statisticsData.optional.learnedWordsPerDay),
          learnedWordsList: JSON.stringify(statisticsData.optional.learnedWordsList),
          seenWordsList: JSON.stringify(statisticsData.optional.seenWordsList),
        },
      },
      true
    );
    return responseData;
  }
}
