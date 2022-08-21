import { UserMetadata } from '../interfaces/typesAPI';

export default class Constants {
  // ────────── for production use only ────────────────────────────────────┐
  // public static serverURL = 'https://my-learnwords.herokuapp.com'; // <──┘

  // ────────── for testing ────────────────────────────────────────────────────────┐
  public static serverURL = 'https://react-learnwords-example.herokuapp.com'; // <──┘
  //                                ↑
  // ────────── Test user ──────────┘
  // name: Екатерина
  // email: catherine-word@gmail.com
  // password: rsLangTestUserPassword
  // id: 630258423dbc0a0015a9395b
  // ────────────────────────────────

  public static userMetadata: UserMetadata | null = null;

  public static routes = {
    main: '',
    ebook: 'ebook',
    dictionary: 'dictionary',
    games: 'games',
    statistics: 'statistics',
    about: 'about',
    signin: 'signin',
    signup: 'signup',
  };
}
