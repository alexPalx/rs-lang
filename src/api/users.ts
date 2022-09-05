import Constants from '../common/constants';
import {
  CreatedUserResponseData,
  CreateUserRequestData,
  LoginUserRequestData,
  RequestMethod,
  UserMetadata,
} from '../interfaces/typesAPI';
import Utils from '../utils/utils';
import API from './api';

export default class Users {
  public static async loginUser(userData: LoginUserRequestData): Promise<UserMetadata | undefined> {
    const responseData = await API.sendRequest<UserMetadata>(
      Utils.buildLink(['signin']),
      RequestMethod.POST,
      userData
    );
    return responseData;
  }

  public static async createUser(
    userData: CreateUserRequestData
  ): Promise<CreatedUserResponseData | undefined> {
    const responseData = await API.sendRequest<CreatedUserResponseData>(
      Utils.buildLink(['users']),
      RequestMethod.POST,
      userData
    );
    return responseData;
  }

  public static async getUser(userId: string): Promise<CreatedUserResponseData | undefined> {
    const responseData = await API.sendRequest<CreatedUserResponseData>(
      Utils.buildLink(['users', userId]),
      RequestMethod.GET,
      undefined,
      true
    );
    return responseData;
  }

  public static async updateUser(
    userId: string,
    userData: LoginUserRequestData
  ): Promise<CreateUserRequestData | undefined> {
    const responseData = await API.sendRequest<CreateUserRequestData>(
      Utils.buildLink(['users', userId]),
      RequestMethod.PUT,
      userData,
      true
    );
    return responseData;
  }

  public static async deleteUser(userId: string): Promise<boolean | undefined> {
    const responseData = await API.sendRequest<boolean>(
      Utils.buildLink(['users', userId]),
      RequestMethod.DELETE,
      undefined,
      true
    );
    return responseData;
  }

  public static async getNewUserToken(userId: string): Promise<UserMetadata | undefined> {
    const responseData = await API.sendRequest<UserMetadata>(
      Utils.buildLink(['users', userId, 'tokens']),
      RequestMethod.GET,
      undefined,
      true
    );

    if (responseData) {
      Constants.UserMetadata = { token: responseData.token, userId: responseData.userId };
    }

    return responseData;
  }
}
