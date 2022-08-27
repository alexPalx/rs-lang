import { UserMetadata, UserWord } from '../interfaces/typesAPI';

export default class Constants {
  // ┌───────── for production use only ───────────────────────────────────┐
  // │ public static serverURL = 'https://my-learnwords.herokuapp.com'; // │
  // └─────────────────────────────────────────────────────────────────────┘
  // ────────── for testing ─────────────────────────────────────────────────────┐
  public static serverURL = 'https://react-learnwords-example.herokuapp.com'; // │
  // ────────────────────────────────────────────────────────────────────────────┘
  // ┌───────── Test user ──────────────┐
  // │ name: Екатерина                  │
  // │ email: catherine-word@gmail.com  │
  // │ password: rsLangTestUserPassword │
  // │ id: 630258423dbc0a0015a9395b     │
  // └──────────────────────────────────┘

  private static cookieLifetime = 14400;

  private static userMetadata: UserMetadata | null = /token/.test(document.cookie)
    ? {
        token: document.cookie
          .split('; ')
          .filter((el) => el.startsWith('token'))
          .join()
          .split('=')[1],
        userId: document.cookie
          .split('; ')
          .filter((el) => el.startsWith('userId'))
          .join()
          .split('=')[1],
      }
    : null;

  public static get UserMetadata(): UserMetadata | null {
    return this.userMetadata;
  }

  public static set UserMetadata(userMetadata: UserMetadata | null) {
    this.userMetadata = userMetadata;
    if (this.userMetadata) {
      document.cookie = `token=${userMetadata?.token}; max-age=${this.cookieLifetime}; `;
      document.cookie = `userId=${userMetadata?.userId}; max-age=${this.cookieLifetime}; `;
    }
  }

  public static routes = {
    main: '',
    ebook: 'ebook',
    games: 'games',
    statistics: 'statistics',
    about: 'about',
    signin: 'signin',
    signup: 'signup',
  };

  public static appName = 'RS-Lang';

  private static lastPage = this.routes.main;

  public static get LastPage(): string {
    return this.lastPage;
  }

  public static set LastPage(value: string) {
    if (!value || value === 'signin' || value === 'signup') return;

    if (Object.values(this.routes).includes(value)) {
      this.lastPage = `/${this.routes[<keyof typeof this.routes>value]}`;
    } else {
      this.lastPage = `/${this.routes.main}`;
    }
  }

  public static userWords: UserWord[] | undefined;
}
