import { Word } from '../interfaces/types';

export default class API {
  private static url = 'https://my-learnwords.herokuapp.com';

  private static buildLink(path: string[] = [], params: string[] = []): string {
    return `${this.url}${path.length ? `/${path.join('/')}` : ''}${
      params.length ? `?${params.join('&')}` : ''
    }`;
  }

  public static async getWords(group = 0, page = 0): Promise<Word[]> {
    const rawResponse = await (
      await fetch(this.buildLink(['words'], [`group=${group}`, `page=${page}`]))
    ).json();
    const content = await rawResponse.json();
    return content;
  }

  public static async getWord(id: string): Promise<Word> {
    const rawResponse = await (await fetch(this.buildLink(['words', id]))).json();
    const content = await rawResponse.json();
    return content;
  }
}
