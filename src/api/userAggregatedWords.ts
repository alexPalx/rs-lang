import { RequestMethod, UserWordConfig, Word } from '../interfaces/typesAPI';
import Utils from '../utils/utils';
import API from './api';

export default class UserAggregatedWords {
  public static async getWords(
    userId: string,
    group?: string,
    page?: string,
    wordsPerPage?: string,
    filter?: string
  ): Promise<Word[] | undefined> {
    const responseData = await API.sendRequest<[{ paginatedResults: Word[] }]>(
      Utils.buildLink(
        ['users', userId, 'aggregatedWords'],
        [group, page, wordsPerPage, filter]
          .map((el, i) => {
            switch (i) {
              case 0:
                return `group=${el}`;
              case 1:
                return `page=${el}`;
              case 2:
                return `wordsPerPage=${el}`;
              case 3:
                return `filter=${el}`;
              default:
                return '';
            }
          })
          .filter((el) => !el.includes('undefined'))
      ),
      RequestMethod.GET,
      undefined,
      true
    );
    const result = responseData ? responseData[0].paginatedResults : undefined;
    if (result) {
      result.map((word) => {
        const correctWord = word;
        correctWord.id = String(correctWord._id);
        delete correctWord._id;
        return correctWord;
      });
    }
    return result;
  }

  public static async getWord(userId: string, wordId: string): Promise<UserWordConfig | undefined> {
    const responseData = await API.sendRequest<UserWordConfig>(
      Utils.buildLink(['users', userId, 'aggregatedWords', wordId]),
      RequestMethod.GET,
      undefined,
      true
    );
    return responseData;
  }
}
