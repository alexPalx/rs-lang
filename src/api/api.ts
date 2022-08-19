import { Word, ExistingUser, NewUser } from '../interfaces/types';

export default class API {
  private static url = 'https://my-learnwords.herokuapp.com';

  private static buildLink(path: string[] = [], params: string[] = []): string {
    return `${this.url}${path.length ? `/${path.join('/')}` : ''}${
      params.length ? `?${params.join('&')}` : ''
    }`;
  }

  public static async getWords(group = 0, page = 0): Promise<Word[] | undefined> {
    try {
      const rawResponse = await fetch(this.buildLink(['word'], [`group=${group}`, `page=${page}`]));
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

  public static async loginUser(user: ExistingUser): Promise<void> {
    const rawResponse = await fetch(this.buildLink(['signin']), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const content = await rawResponse.json();

    return content
  }

  public static async createUser(user: NewUser): Promise<void> {
    const rawResponse = await fetch(this.buildLink(['users']), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const content = await rawResponse.json();
    
    return content
  }
}
