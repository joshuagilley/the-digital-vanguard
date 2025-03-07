export type User = {
  _id: string;
  email: string;
  articles: ArticleProps[];
  phoneNumber: string;
  userId: string;
  username: string;
  password: string;
  linkedIn: string;
  github: string;
};

export type ArticleProps = {
  articleId: string;
  articleName: string;
  url: string;
  phrase: string;
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

export type EmailResponse = { status: number; text: string };
