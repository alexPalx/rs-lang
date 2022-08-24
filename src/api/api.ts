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
}
