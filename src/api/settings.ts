import { RequestMethod, SettingsData } from '../interfaces/typesAPI';
import Utils from '../utils/utils';
import API from './api';

export default class Settings {
  public static async get(userId: string): Promise<SettingsData | undefined> {
    const responseData = await API.sendRequest<SettingsData>(
      Utils.buildLink(['users', userId, 'settings']),
      RequestMethod.GET,
      undefined,
      true
    );
    return responseData;
  }

  public static async update(
    userId: string,
    settingsData: SettingsData
  ): Promise<SettingsData | undefined> {
    const responseData = await API.sendRequest<SettingsData>(
      Utils.buildLink(['users', userId, 'settings']),
      RequestMethod.PUT,
      settingsData,
      true
    );
    return responseData;
  }
}
