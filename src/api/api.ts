import Constants from '../common/constants';
import { WordsQuery } from '../interfaces/types';
import {
  Word,
  LoginUserRequestData,
  CreateUserRequestData,
  UserMetadata,
  CreatedUserResponseData,
} from '../interfaces/typesAPI';

export default class API {
  private static buildLink(path: string[] = [], params: string[] = []): string {
    return `${Constants.serverURL}${path.length ? `/${path.join('/')}` : ''}${
      params.length ? `?${params.join('&')}` : ''
    }`;
  }

  public static async getWords(query: WordsQuery): Promise<Word[] | undefined> {
    try {
      const rawResponse = await fetch(
        this.buildLink(['words'], [`group=${query.group}`, `page=${query.page}`])
      );
      if (!rawResponse.ok) throw new Error('Server error');
      const content: Word[] = await rawResponse.json();
      return content;
    } catch (err) {
      console.error((<Error>err).message);
      return undefined;
    }
  }

  public static async getWord(id: string): Promise<Word | undefined> {
    try {
      const rawResponse = await fetch(this.buildLink(['words', id]));
      if (!rawResponse.ok) throw new Error('Server error');
      const content: Word = await rawResponse.json();
      return content;
    } catch (err) {
      console.error((<Error>err).message);
      return undefined;
    }
  }

  public static async loginUser(user: LoginUserRequestData): Promise<UserMetadata | undefined> {
    try {
      const rawResponse = await fetch(this.buildLink(['signin']), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const content = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('User not found');
      return undefined;
    }
  }

  public static async createUser(
    user: CreateUserRequestData
  ): Promise<CreatedUserResponseData | undefined> {
    try {
      const rawResponse = await fetch(this.buildLink(['users']), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const content = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('User already exists');
      return undefined;
    }
  }
}
