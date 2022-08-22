import { WordsQuery } from '../interfaces/types';
import { Word } from '../interfaces/typesAPI';
import Utils from '../utils/utils';

export default class Words {
  public static async getWords(query: WordsQuery): Promise<Word[] | undefined> {
    try {
      const rawResponse = await fetch(
        Utils.buildLink(['words'], [`group=${query.group}`, `page=${query.page}`])
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
      const rawResponse = await fetch(Utils.buildLink(['words', id]));
      if (!rawResponse.ok) throw new Error('Server error');
      const content: Word = await rawResponse.json();
      return content;
    } catch (err) {
      console.error((<Error>err).message);
      return undefined;
    }
  }
}
