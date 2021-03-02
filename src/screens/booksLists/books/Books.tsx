import React, {useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Observer, observer} from "mobx-react-lite";
import {Button, Divider, Input, Select} from 'antd';
import {v4} from "uuid";

import {Loader} from '../../../components/loader/Loader';
import booksStore from '../../../stores/booksStore';
import {parser} from '../../../constants/BookLists';
import {BooksTable} from './BooksTable';
import {URLS} from '../../../constants/urls';

import css from "./Books.module.scss"
import {IQuerySearchBookParams} from '../../../intarfaces/IBookLists';
import qs from 'qs';


const Option = Select.Option;

const BookLists = observer((history: any) => {
  const {
    data,
    searchdata,
    isLoading,
    isSearchMode,
    queryParams,
    searchFilters,
    setQueryParams,
    fetchBooks,
    toggleAddBook,
    handleChangeFilters,
    onSearchBooks,
  } = booksStore;

  interface ParamTypes {
    id: string;
  }

  const getQueryParams = (): IQuerySearchBookParams => {
    const queryParams = qs.parse(history.location.search.replace('?', '')) as IQuerySearchBookParams;
    history.history.replace(`?${qs.stringify({...queryParams})}`);
    return (
      {
        query: queryParams.query || undefined,
        author: queryParams.author || undefined,
      }
    )
  }

  const {id} = useParams<ParamTypes>();

  useEffect(() => {
    if (window.location.pathname.includes("/add")) {
      toggleAddBook(true);
      console.log(getQueryParams())
      setQueryParams(getQueryParams());
      onSearchBooks();
    }
    fetchBooks(id);
  }, []);

  const onSearch = () => {
    const path: IQuerySearchBookParams = {query: searchFilters.title, author: searchFilters.author};
    history.history.replace(`?${qs.stringify(path)}`);
    onSearchBooks();
  }

  return (
    <Observer>
      {() => (
        <div>
          <div className={"paginateBlock"}>
            <div className={css.stats}>
              <Link className={css.link} to={URLS.BOOKLISTS}>Book lists</Link>&nbsp;
              → <b className={isSearchMode ? css.link : ""} onClick={() => isSearchMode && toggleAddBook(false)}>
                <Link className={!isSearchMode ? css.notActiveLink : css.link} to={`${URLS.BOOKLISTS}/${id}/books`}>{data.title}</Link>
              </b>&nbsp;
              → {!isSearchMode ? `Books (${data.books?.length})` : 'Search results'}
            </div>

            <Divider type="vertical" />

            {!isSearchMode ?
              <Button onClick={() => toggleAddBook(true)}>
                <Link to={`${URLS.BOOKLISTS}/${id}/add`}>Add book</Link>
              </Button>
              : (
                <div className={css.searchBlock}>
                  <Input
                    className={css.titleInput}
                    value={queryParams.query}
                    placeholder="Title or ISBN"
                    onPressEnter={() => onSearch()}
                    onChange={(e) => handleChangeFilters(e.target.value, 'title')}
                  />
                  <Input
                    className={css.authorInput}
                    value={queryParams.author}
                    placeholder="Author"
                    onPressEnter={() => onSearch()}
                    onChange={(e) => handleChangeFilters(e.target.value, 'author')}
                  />
                  <Select className={css.select} value={parser[1]} onChange={(value) => handleChangeFilters(value, 'source')}>
                    {parser.map(item => (
                      <Option value={item} key={v4()}>{item}</Option>
                    ))}
                  </Select>

                  <div className={css.btns}>
                    <Button type="primary" onClick={() => onSearch()}>SEARCH</Button>
                    <Button onClick={() => toggleAddBook(false)}>CANCEL</Button>
                  </div>
                </div>
              )
            }
          </div>

          {isLoading
            ? <Loader />
            : <BooksTable dataSource={data} dataSearch={searchdata} idList={id} isSearchMode={isSearchMode} />
          }
        </div>

      )}
    </Observer>
  )
})

export default BookLists;
