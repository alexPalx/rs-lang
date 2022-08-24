import Constants from '../common/constants';
import { StatisticsData } from '../interfaces/typesAPI';
import Utils from '../utils/utils';

export default class Statistics {
  public static async get(userId: string): Promise<StatisticsData | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId, 'statistics']), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const content: StatisticsData = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error get statistics');
      return undefined;
    }
  }

  public static async update(
    userId: string,
    statisticsData: StatisticsData
  ): Promise<StatisticsData | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId, 'statistics']), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statisticsData),
      });
      const content: StatisticsData = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error update statistics');
      return undefined;
    }
  }
}
