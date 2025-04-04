export interface IParams {
  id: string;
  aid?: string;
  did?: string;
  dtag?: string;
}

export interface IHeaders {
  "h-Custom": string;
  Authorization: string;
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
  tag: string;
}

export interface NewFileBody {
  markdownText: string;
  sortValue: number;
}

export interface TagBody {
  tags: string[];
  tagId: string;
}
