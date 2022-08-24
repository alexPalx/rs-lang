import Constants from '../common/constants';
import {
  CreatedUserResponseData,
  CreateUserRequestData,
  LoginUserRequestData,
  UserMetadata,
} from '../interfaces/typesAPI';
import Utils from '../utils/utils';

export default class Users {
  public static async loginUser(userData: LoginUserRequestData): Promise<UserMetadata | undefined> {
    try {
      const rawResponse = await fetch(Utils.buildLink(['signin']), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const content: UserMetadata = await rawResponse.json();
      Constants.UserMetadata = { token: content.token, userId: content.userId };
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error loginUser');
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
      console.warn('error createUser');
      return undefined;
    }
  }

  public static async getUser(userId: string): Promise<CreatedUserResponseData | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId]), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const content: CreatedUserResponseData = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error getUser');
      return undefined;
    }
  }

  public static async updateUser(
    userId: string,
    userData: LoginUserRequestData
  ): Promise<CreateUserRequestData | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId]), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          body: JSON.stringify(userData),
        },
      });
      const content: CreateUserRequestData = await rawResponse.json();
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error updateUser');
      return undefined;
    }
  }

  public static async deleteUser(userId: string): Promise<boolean | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId]), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return rawResponse.ok;
    } catch {
      // TODO: Implement popup
      console.warn('error deleteUser');
      return undefined;
    }
  }

  public static async getNewUserToken(userId: string): Promise<UserMetadata | undefined> {
    if (!Constants.UserMetadata) return undefined;
    try {
      const rawResponse = await fetch(Utils.buildLink(['users', userId, 'tokens']), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Constants.UserMetadata?.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const content: UserMetadata = await rawResponse.json();
      Constants.UserMetadata = { token: content.token, userId: content.userId };
      return content;
    } catch {
      // TODO: Implement popup
      console.warn('error getNewUserToken');
      return undefined;
    }
  }
}
