import React from 'react';
import {Observer} from "mobx-react-lite";

import {TableRow} from './BooksTableRow';
import {IBookLists, IBooks} from '../../../intarfaces/IBookLists';
import booksStore from '../../../stores/booksStore';

interface IProps {
  dataSource: IBookLists;
  dataSearch: IBooks[];
  isSearchMode: boolean;
  idList: string;
}

export const BooksTable = (props: IProps) => {
  const {
    onDown,
    onUp,
    onRemove,
    onAddNewBookToList,
  } = booksStore;

  return (
    <Observer>
      {() => (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>COVER</th>
                <th>DESCRIPTION</th>
                <th>AUTHOR</th>
                <th>ISBN</th>
                <th>BWB</th>
                <th>PAGES</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {!props.isSearchMode ?
                props.dataSource.books?.map(item => (
                  <TableRow
                    item={item}
                    key={item.id}
                    isSearchMode={props.isSearchMode}
                    onUp={() => onUp(props.idList, item.id)}
                    onDown={() => onDown(props.idList, item.id)}
                    onRemove={() => onRemove(props.idList, item.isbn)}
                  />
                ))
                : props.dataSearch.map(item => (
                  <TableRow
                    item={item}
                    key={item.id}
                    isSearchMode={props.isSearchMode}
                    onUp={() => onUp(props.idList, item.id)}
                    onDown={() => onDown(props.idList, item.id)}
                    onRemove={() => onRemove(props.idList, item.isbn)}
                    onAdd={() => onAddNewBookToList(props.idList, item.isbn)}
                  />
                ))
              }
            </tbody>

          </table>
        </div>
      )}
    </Observer>
  )
}
