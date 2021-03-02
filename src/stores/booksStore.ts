import {action, makeAutoObservable} from 'mobx';
import {parser} from '../constants/BookLists';
import {IBookLists, IBooks, IQuerySearchBookParams, ISearchBooksFilter} from '../intarfaces/IBookLists';
import {getBooks, setDown, setUp, removeBook, searchBooks, addToList} from "../utils/api";

class BooksStore {
  constructor() {
    makeAutoObservable(this)
  };

  isLoading = false;
  isLoadImportNewBook = false;
  data = {} as IBookLists;
  searchdata: Array<IBooks> = [];
  searchFilters: ISearchBooksFilter = {limit: 30, source: parser[1]};
  queryParams: IQuerySearchBookParams = {};
  isSearchMode: boolean = false;

  @action.bound
  toggleAddBook = (value: boolean) => {
    this.isSearchMode = value;
    this.searchdata = [];
  };

  @action.bound
  setQueryParams = (query: IQuerySearchBookParams) => {
    this.queryParams = {...query};

    if (query.query) {
      this.handleChangeFilters(query.query, 'title');
    }
    if (query.author) {
      this.handleChangeFilters(query.author, 'author');
    }
  }

  @action.bound
  handleChangeFilters = (value: string | number, key: keyof ISearchBooksFilter) => {
    this.searchFilters = {...this.searchFilters, [key]: value}

    if (key === 'title') {
      this.queryParams = {
        ...this.queryParams,
        query: value
      }
    }
    if (key === 'author') {
      this.queryParams = {
        ...this.queryParams,
        author: value,
      }
    }
  };

  @action.bound
  onSearchBooks = async () => {
    this.isLoading = true;

    if (this.searchFilters.title) {
      let isbn: string | undefined = this.searchFilters.title.replace(/\D/g, '');
      this.searchFilters.isbn = isbn.length === 13 ? isbn : undefined;
    }

    const data = await searchBooks(this.searchFilters);
    this.searchdata = data;
    this.isLoading = false;
  };

  @action.bound
  onUp = async (idList: string | number, idBook: string | number) => {
    this.isLoading = true;
    await setUp(idList, idBook);
    this.fetchBooks(idList);
  };

  @action.bound
  onDown = async (idList: string | number, idBook: string | number) => {
    this.isLoading = true;
    await setDown(idList, idBook);
    this.fetchBooks(idList);
  };

  @action.bound
  onRemove = async (idList: string | number, isbn: string | number) => {
    this.isLoading = true;
    await removeBook(idList, isbn);
    this.fetchBooks(idList);
  };

  @action.bound
  onAddNewBookToList = async (idList: string | number, isbn: string | number) => {
    this.isLoadImportNewBook = true;
    await addToList(idList, isbn);
    this.isLoadImportNewBook = false;
    this.toggleAddBook(false);
    this.fetchBooks(idList);
  };

  @action.bound
  fetchBooks = async (id: string | number) => {
    this.isLoading = true;
    const data = await getBooks(id);
    this.data = data;
    this.isLoading = false;
  };
}

export default new BooksStore();