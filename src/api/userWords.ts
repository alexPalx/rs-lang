import { RequestMethod, UserWord, UserWordConfig } from '../interfaces/typesAPI';
import Utils from '../utils/utils';
import API from './api';

export default class UserWords {
  public static async getWords(userId: string): Promise<UserWord[] | undefined> {
    const responseData = await API.sendRequest<UserWord[]>(
      Utils.buildLink(['users', userId, 'words']),
      RequestMethod.GET,
      undefined,
      true
    );
    return responseData;
  }

  public static async createWord(
    userId: string,
    wordId: string,
    wordConfig: UserWordConfig
  ): Promise<UserWord | undefined> {
    const responseData = await API.sendRequest<UserWord>(
      Utils.buildLink(['users', userId, 'words', wordId]),
      RequestMethod.POST,
      wordConfig,
      true
    );
    return responseData;
  }

  public static async getWord(userId: string, wordId: string): Promise<UserWord | undefined> {
    const responseData = await API.sendRequest<UserWord>(
      Utils.buildLink(['users', userId, 'words', wordId]),
      RequestMethod.GET,
      undefined,
      true
    );
    return responseData;
  }

  public static async updateWord(
    userId: string,
    wordId: string,
    wordConfig: UserWordConfig
  ): Promise<UserWord | undefined> {
    const responseData = await API.sendRequest<UserWord>(
      Utils.buildLink(['users', userId, 'words', wordId]),
      RequestMethod.PUT,
      wordConfig,
      true
    );
    return responseData;
  }

  public static async deleteWord(userId: string, wordId: string): Promise<boolean | undefined> {
    const responseData = await API.sendRequest<boolean>(
      Utils.buildLink(['users', userId, 'words', wordId]),
      RequestMethod.DELETE,
      undefined,
      true
    );
    return responseData;
  }
}
