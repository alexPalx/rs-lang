export interface Word {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface CreateUserRequestData {
  name: string;
  email: string;
  password: string;
}

export interface CreatedUserResponseData {
  id: string;
  name: string;
  email: string;
}

export interface LoginUserRequestData {
  email: string;
  password: string;
}

export interface UserMetadata {
  token: string;
  userId: string;
}

export interface UserWord {
  userId: string;
  difficulty: string;
  optional?: {};
  wordId: string;
}

export interface UserWordConfig {
  difficulty: string;
  optional?: {};
}

export interface StatisticsData {
  learnedWords: number;
  optional?: {};
}

export interface SettingsData {
  wordsPerDay: number;
  optional: {};
}
