export type User = {
  _id: string;
  email: string;
  articles: ArticleProps[];
  phoneNumber: string;
  userId: string;
  username: string;
  linkedIn: string;
  github: string;
};

export type ArticleProps = {
  articleId: string;
  articleName: string;
  url: string;
  tag: string;
  articleDetails: string[];
  summary: string;
  userId: string;
};

export type Status =
  | "info"
  | "warning"
  | "success"
  | "error"
  | "loading"
  | undefined;

export interface EmailProps {
  name: string;
  email: string;
  linkedIn: string;
  github: string;
  message: string;
}

export interface EmailResponse {
  status: number;
  text: string;
}

export interface PortfolioResponse {
  articleId: string;
  articleName: string;
  date: string;
  email: string;
  github: string;
  linkedIn: string;
  phoneNumber: string;
  tag: string;
  summary: string;
  url: string;
  userId: string;
  username: string;
  picture: string;
}
