export type QueryParam = { param: string; value: string };

export interface WordsQuery {
  group: string;
  page: string;
}

export interface DevInfo {
  imageSrc: string;
  name: string;
  github: string;
  position: string;
  completedTasks: string[];
}
