import Constants from '../common/constants';
import {
  CreatedUserResponseData,
  CreateUserRequestData,
  LoginUserRequestData,
  UserMetadata,
} from '../interfaces/typesAPI';
import Utils from '../utils/utils';

export default class Users {
  public static async loginUser(user: LoginUserRequestData): Promise<UserMetadata | undefined> {
    try {
      const rawResponse = await fetch(Utils.buildLink(['signin']), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const content: UserMetadata = await rawResponse.json();
      Constants.UserMetadata = { token: content.token, userId: content.userId };
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
      const rawResponse = await fetch(Utils.buildLink(['users']), {
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
