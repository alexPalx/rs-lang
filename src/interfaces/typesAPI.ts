export interface Word {
  id: string;
  _id?: string;
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
  optional?: {
    difficult: boolean;
    learned: boolean;
    sprint: string;
    sprintWins: string;
    sprintLoses: string;
    audio: string;
    allGames: string;
  };
  wordId: string;
}

export interface UserWordConfig {
  difficulty: string;
  optional?: {
    difficult?: boolean;
    learned?: boolean;
    sprint?: string;
    sprintWins?: string;
    sprintLoses?: string;
    audio?: string;
    allGames?: string;
  };
}

export interface StatisticsData {
  learnedWords: number;
  optional: {
    startDate: number;
    sprintStreakPerDay: { date: number; streak: number }[];
    audioStreakPerDay: { date: number; streak: number }[];
    newWordsPerDay: { date: number; words: number }[];
    learnedWordsPerDay: { date: number; words: number }[];
    learnedWordsList: string[];
    seenWordsList: string[];
  };
}

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}
