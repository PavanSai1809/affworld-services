export enum Tables {
  users = 'users',
  tasks = 'tasks',
  posts = 'posts',
}

export type QueryOptions = {
  table: Tables;
  column?: string[] | string;
  orderBy?: { [key: string]: unknown };
  where?: {
    [key: string]: unknown;
  };
  whereIn?: {
    [key: string]: unknown;
  };
  orWhere?: {
    [key: string]: unknown;
  };
  update?: {
    [key: string]: unknown;
  };
  insert?:
    | {
        [key: string]: unknown;
      }
    | {
        [key: string]: unknown;
      }[];
  del?: boolean;
  onConflict?: {
    [key: string]: unknown;
  };
  limit?: number;
  offset?: number;
  groupBy?: string | string[];
  count?: string;
  whereRaw?: string;
  whereBetween?: {
    [key: string]: unknown;
  };
  orWhereBetween?: {
    [key: string]: unknown;
  };
  distinctCount?: string | null;
  search?: string;
  whereNot?: {
    [key: string]: unknown;
  };
  sum?: string;
};
