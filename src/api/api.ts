import Constants from '../common/constants';
import { RequestMethod } from '../interfaces/typesAPI';
import Settings from './settings';
import Statistics from './statistics';
import UserAggregatedWords from './userAggregatedWords';
import Users from './users';
import UserWords from './userWords';
import Words from './words';

export default class API {
  public static words = Words;
  public static users = Users;
  public static userWords = UserWords;
  public static userAggregatedWords = UserAggregatedWords;
  public static statistics = Statistics;
  public static settings = Settings;

  public static async sendRequest<T>(
    url: string,
    method = RequestMethod.GET,
    body: object | undefined = undefined,
    auth = false
  ): Promise<T | undefined> {
    if (auth && !Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(url, {
        method,
        headers: {
          Authorization: auth ? `Bearer ${Constants.UserMetadata?.token}` : '',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const content: T =
        method === RequestMethod.DELETE ? rawResponse.ok : await rawResponse.json();
      return content;
    } catch (err) {
      // TODO: Implement popup
      console.warn(err);
      return undefined;
    }
  }
}
