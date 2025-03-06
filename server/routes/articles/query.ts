export interface IParams {
  id: string;
  aid?: string;
  did?: string;
}

export interface IHeaders {
  "h-Custom": string;
}

export interface IReply {
  200: string;
  302: { url: string };
  "4xx": { error: string };
}

export interface NewArticleBody {
  articleName: string;
  articleSummary: string;
  articleUrl: string;
  imageUrl: string;
}

export interface NewFileBody {
  markdownText: string;
  sortValue: number;
}
