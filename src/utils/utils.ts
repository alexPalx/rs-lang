import Constants from '../common/constants';

export default class Utils {
  public static buildLink(path: string[] = [], params: string[] = []): string {
    return `${Constants.serverURL}${path.length ? `/${path.join('/')}` : ''}${
      params.length ? `?${params.join('&')}` : ''
    }`;
  }
}
