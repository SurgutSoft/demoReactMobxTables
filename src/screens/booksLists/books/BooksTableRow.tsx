import React from 'react';
import {Button, Dropdown, Menu, Popconfirm} from 'antd';

import {IBooks} from '../../../intarfaces/IBookLists';
import booksStore from '../../../stores/booksStore';
import {appLink, bwbLink} from '../../../constants/BookLists';

import actionIcon from '../../../assets/images/action.svg';
import css from './columns.module.scss';
import linkIcon from "../../../assets/images/link.svg";


interface IProps {
  item: IBooks;
  isSearchMode: boolean;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  onAdd?: () => void;
}

export const TableRow = ({item, isSearchMode, onUp, onDown, onRemove, onAdd}: IProps) => {
  const {isLoadImportNewBook} = booksStore;
  return (
    <tr key={item.id}>
      <td><b>{item.id}</b></td>

      <td className={css.coverCol}>
        <img className={css.cover} src={item.image} alt="coverImg" />
      </td>

      <td className={css.descriptionCol}>
        <div>
          <a
            className="hovered cursor-pointer"
            target="_blank"
            rel="noreferrer"
            href={appLink(item.isbn)}
          >
            <b>{item.title}</b> </a>
          &nbsp;<img className="link" src={linkIcon} alt="img"></img>
          <br />
          <p>
            {item.description}
          </p>
          <span className={css.categories}>{item.categories}</span>
        </div>
      </td>

      <td className={css.authorCol}>
        <div>
          <div className={css.author}>{item.author}</div>
          {!isSearchMode && <div className="row-description">{`${item.publisher} (${item.publishedDate})`}</div>}
        </div>
      </td>

      <td><b>{item.isbn}</b></td>

      <td className={css.bwbCol}>
        <div>
          <a className="hovered cursor-pointer" href={bwbLink(item.isbn)} target="_blank" rel="noreferrer"><b>BWB Link</b></a>
        &nbsp;<img className="link" src={linkIcon} alt="img"></img><br />
          {isSearchMode &&
            <>
              <div className={item.bwbBook?.totalNew ? "" : "row-description"}>{`New: ${item.bwbBook?.newPrice} / ${item.bwbBook?.totalNew}`}</div>
              <div className={item.bwbBook?.totalUsed ? "" : "row-description"}>{`Used: ${item.bwbBook?.usedPrice} / ${item.bwbBook?.totalUsed}`}</div>
            </>
          }
        </div>
      </td>

      <td>{item.pageCount}</td>

      <td>
        {isSearchMode
          ? <Button onClick={onAdd}>{isLoadImportNewBook ? "Importing..." : "Add to list"}</Button>
          : <ActionsCell onUp={onUp} onDown={onDown} onRemove={onRemove} />
        }
      </td>
    </tr>
  )
}

//в оригинале так почему-то при Up вызывается на бэке метод down и наоборот для Down
const ActionsCell = ({onUp, onDown, onRemove}: any) => {
  const overlay = () => (
    <Menu>
      <Menu.Item onClick={onDown}>
        Up
      </Menu.Item>
      <Menu.Item onClick={onUp}>
        Down
      </Menu.Item>
      <Menu.Item>
        <Popconfirm title="Do you want to delete it?" onConfirm={onRemove}>
          Remove
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return <Dropdown overlay={overlay()} trigger={['click']}>
    <div className="actions">
      <img src={actionIcon} alt="img" />
    </div>
  </Dropdown>
}
