import { RequestMethod, StatisticsData } from '../interfaces/typesAPI';
import Utils from '../utils/utils';
import API from './api';

export default class Statistics {
  public static async get(userId: string): Promise<StatisticsData | undefined> {
    const responseData = await API.sendRequest<StatisticsData>(
      Utils.buildLink(['users', userId, 'statistics']),
      RequestMethod.GET,
      undefined,
      true
    );
    return responseData;
  }

  public static async update(
    userId: string,
    statisticsData: StatisticsData
  ): Promise<StatisticsData | undefined> {
    const responseData = await API.sendRequest<StatisticsData>(
      Utils.buildLink(['users', userId, 'statistics']),
      RequestMethod.PUT,
      statisticsData,
      true
    );
    return responseData;
  }
}
