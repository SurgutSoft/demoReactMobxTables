import React, {useEffect} from 'react';
import {Observer, observer} from "mobx-react-lite";
import {Button, Divider, Select} from 'antd';
import {v4} from "uuid";

import {BookListsTable} from './BookListsTable';
import {Loader} from '../../components/loader/Loader';
import {grade, listType, status} from "../../constants/BookLists";
import bookListsStore from '../../stores/bookListsStore';

import css from "./BookLists.module.scss"


const Option = Select.Option;

const BookLists = observer(() => {
  const {
    data,
    isLoading,
    idEditingRow,
    fetchBookLists,
    handleChangeGrade,
    handleChangeStatus,
    handleChangeTypeList,
    createNewBookList,
  } = bookListsStore;

  useEffect(() => {
    fetchBookLists();
  }, []);

  return (
    <Observer>
      {() => (
        <div>
          <div className={"paginateBlock"}>
            <div className={css.stats}>
              <b>{`${data.length} `}</b>lists found
            </div>

            <Divider type="vertical" />

            <div className={css.filtersContainer}>
              <div className={css.block}>
                <div className={css.label}>Status:</div>
                <Select className={css.select} defaultValue={status[0]} onChange={(value) => handleChangeStatus(value.toLowerCase())}>
                  {status.map(item => (
                    <Option value={item} key={v4()}>{item}</Option>
                  ))}
                </Select>
              </div>

              <div className={css.block}>
                <div className={css.label}>Grade:</div>
                <Select className={css.select} defaultValue={grade[0]} onChange={(value) => handleChangeGrade(value)}>
                  {grade.map(item => (
                    <Option value={item} key={v4()}>{item}</Option>
                  ))}
                </Select>
              </div>
            </div>

            <Divider type="vertical" />

            <Button
              type="primary"
              onClick={() => createNewBookList()}
              disabled={idEditingRow !== -1}>
              Create Book list
            </Button>
          </div>

          {isLoading
            ? <Loader />
            : <BookListsTable dataSource={data} />
          }
        </div>

      )}
    </Observer>
  )
})

export default BookLists;
