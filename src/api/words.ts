import { WordsQuery } from '../interfaces/types';
import { Word } from '../interfaces/typesAPI';
import Utils from '../utils/utils';
import API from './api';

export default class Words {
  public static async getWords(query: WordsQuery): Promise<Word[] | undefined> {
    const responseData = await API.sendRequest<Word[]>(
      Utils.buildLink(['words'], [`group=${query.group}`, `page=${query.page}`])
    );
    return responseData;
  }

  public static async getWord(id: string): Promise<Word | undefined> {
    const responseData = await API.sendRequest<Word>(Utils.buildLink(['words', id]));
    return responseData;
  }
}
