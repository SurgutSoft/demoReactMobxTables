import {IBookLists} from "../intarfaces/IBookLists";

export const listType = ['recommended', 'wishlist', 'bookshelf', 'completed', 'custom'];
export const status = ['Any','Draft','Published','Archived'];
export const grade = ['Any','PreK - 1', '1 - 3','3 - 5','5 - 8','8 - 11','12+'];
export const country = ['Any', 'US', 'UK'];
export const parser = ['BWB_DUMP', 'BWB_PARSER', 'GOOGLE'];

export const newBookList: IBookLists = {
  id: 0,
  title: "",
  status: "draft",
  size: 0,
  country: "Any",
  minGrade: -3,
  maxGrade: 12,
  owner: {
    role: "SA"
  }
}

export const appLink = (isbn: string) => `https://${window.location.hostname.startsWith('dev') ? 'dev-' : ''}app.readformyschool.com/books/${isbn}`;
// book.link = `https://books.google.ru/books?id=${book.externalId}`;
export const bwbLink = (isbn: string) => `https://www.betterworldbooks.com/product/detail/-${isbn}`;
export const isbnLink = (isbn: string) => `https://isbnsearch.org/isbn/${isbn}`;
