import React from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, Menu, Popconfirm} from 'antd';
import moment from 'moment';

import {IBookLists} from '../../intarfaces/IBookLists';
import {gradeDisplay} from '../../utils';

import css from './columns.module.scss';
import actionIcon from '../../assets/images/action.svg';
import {URLS} from '../../constants/urls';


interface IProps {
  item: IBookLists;
  onEdit: () => void;
  onDelete: () => void;
}

export const TableRow = ({item, onEdit, onDelete}: IProps) => {
  return (
    <tr key={item.id}>
      <td><b>{item.id}</b></td>

      <td className={item.status === 'archived' ? css.rowDeleted : ""}>
        <Link className={css.titleCol} to={`${URLS.BOOKLISTS}/${item.id}/books`}>{item.title}</Link>
      </td>

      <td><b>{item.size}</b></td>

      <td><OwnerCell role={item?.owner?.role} /> </td>

      <td>{item.country || "Any"}</td>

      <td>{gradeDisplay(item.minGrade, item.maxGrade)}</td>

      <td>{moment(item.created).format("M/D/YY")}</td>

      <td className={css.statusColumn}>
        <label className={getStatusStyle(item.status)}>
          <b>{item.status}</b>
        </label>
      </td>

      <td>
        <ActionsCell onEdit={onEdit} onDeleteConfirm={onDelete} size={item.size} />
      </td>
    </tr>
  )
}

export const OwnerCell = ({role}: any) => (
  <>
    {role === 'SA'
      ? <span>RFMS (SA)</span>
      : <span>{role}</span>
    }
  </>
)

const ActionsCell = ({onEdit, onDeleteConfirm, size}: any) => {
  const overlay = () => (
    <Menu>
      <Menu.Item onClick={onEdit}>
        Edit
      </Menu.Item>
      <Menu.Item disabled={!!size}>
        <Popconfirm title="Do you want to delete it?" onConfirm={onDeleteConfirm}>
          Delete
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

export const getStatusStyle = (status?: string) => {
  switch (status) {
    case 'draft': return css.draft;
    case 'published': return css.published;
    case 'archived': return css.archived;
  }
}