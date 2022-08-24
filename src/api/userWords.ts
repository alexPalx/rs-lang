import Constants from '../common/constants';
import { UserWord, UserWordConfig } from '../interfaces/typesAPI';
import Utils from '../utils/utils';

export default class UserWords {
  public static async getWords(userId: string): Promise<UserWord[] | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId, 'words']), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const content: UserWord[] = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error getUserWords');
      return undefined;
    }
  }

  public static async createWord(
    userId: string,
    wordId: string,
    wordConfig: UserWordConfig
  ): Promise<UserWord | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId, 'words', wordId]), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordConfig),
      });
      const content: UserWord = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error getUserWords');
      return undefined;
    }
  }

  public static async getWord(userId: string, wordId: string): Promise<UserWord | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId, 'words', wordId]), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const content: UserWord = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error getUserWord');
      return undefined;
    }
  }

  public static async updateWord(
    userId: string,
    wordId: string,
    wordConfig: UserWordConfig
  ): Promise<UserWord | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId, 'words', wordId]), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordConfig),
      });
      const content: UserWord = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error getUserWord');
      return undefined;
    }
  }

  public static async deleteWord(userId: string, wordId: string): Promise<boolean | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId, 'words', wordId]), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return rawResponse.ok;
    } catch {
      // TODO: Implement popup
      console.warn('error getUserWord');
      return undefined;
    }
  }
}
