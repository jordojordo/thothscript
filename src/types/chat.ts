export interface UserMessage {
  id: number;
  author: string;
  event?: string;
  input: string;
}

export interface SystemOutput {
  message?: string | { [key: string]: any };
  content?: string;
  event?: string;
  error?: object;
}

export interface SystemMessage {
  id: number;
  author: string;
  output: SystemOutput
  error?: object;
}
