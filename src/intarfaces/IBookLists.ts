import {IOwner} from "./IFundraisers";

export interface IBookLists {
  books?: IBooks[];
  country?: string;
  created?: number;
  id: number;
  maxGrade?: number;
  minGrade?: number;
  owner?: IOwner;
  size?: number
  status: 'published' | 'draft' | 'archived';
  title: string;
  type?: string;
};

export interface IBookListFilters {
  type?: string;
  status?: string;
  minGrade?: number;
  maxGrade?: number;
}

export interface IBooks {
  author: string;
  bwbBook?: IBwbBook;
  bwbLink: string;
  id: number;
  image: string;
  isbn: string;
  lists: [];
  pageCount: number;
  description?: string;
  categories?: string;
  publishedDate: string;
  publisher: string;
  title: string;
}

export interface ISearchBooksFilter {
  title?: string;
  source: string;
  author?: string;
  isbn?: string;
  limit: number;
}

export interface IBwbBook {
  newPrice: string;
  totalNew: number;
  totalUsed: number;
  url: string;
  usedPrice: string;
}

export interface IQuerySearchBookParams {
  query?: string | number;
  author?: string | number;
}
