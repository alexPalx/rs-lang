import Constants from '../common/constants';
import { SettingsData } from '../interfaces/typesAPI';
import Utils from '../utils/utils';

export default class Settings {
  public static async get(userId: string): Promise<SettingsData | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId, 'settings']), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const content: SettingsData = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error get settings');
      return undefined;
    }
  }

  public static async update(
    userId: string,
    settingsData: SettingsData
  ): Promise<SettingsData | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId, 'settings']), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });
      const content: SettingsData = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error update settings');
      return undefined;
    }
  }
}
