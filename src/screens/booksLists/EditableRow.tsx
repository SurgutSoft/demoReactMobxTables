import React, {useState} from 'react';
import moment from 'moment';
import {Button, Input, Select} from 'antd';
import {v4} from 'uuid';

import {country, grade, status} from '../../constants/BookLists';
import {OwnerCell} from './TableRow';
import {IBookLists} from '../../intarfaces/IBookLists';

import css from './columns.module.scss';

const Option = Select.Option;

interface IProps {
  item: IBookLists;
  isLoading: boolean;
  onSave: (row: IBookLists) => void;
  onCancel: (row: IBookLists) => void;
  onHandleEditRow: (value: string | number | undefined, row: IBookLists, key: keyof IBookLists) => void;
}

export const EditableRow = ({item, isLoading, onSave, onCancel, onHandleEditRow}: IProps) => {
  const [title, setTitle] = useState(item.title);

  const onHnadleEditTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onHandleEditRow(e.target.value, item, 'title')
  }

  const getGradeValue = (val1?: number, val2?: number) => {
    if (val1 && val2) {
      if (val1 === -3 && val2 === 12) return "Any";
      if (val1 === -1) return "Prek - 1"
      if (val1 === val2) return "12+"
      return `${val1} - ${val2}`
    } else {return "Any"}
  }

  return (
    <tr key={item.id}>
      <td><b>{item.id || ""}</b></td>

      <td>
        <Input
          placeholder="Book list title"
          defaultValue={item.id ? item.title : ""}
          onChange={(e) => onHnadleEditTitle(e)}
        />
      </td>

      <td><div>{item.size}</div></td>

      <td>
        {item.id === 0
          ? "RFMS (SA)"
          : <OwnerCell role={item?.owner?.role} />
        }
      </td>

      <td>
        {item.id === 0
          ? "Any"
          : (<Select defaultValue={item.country || country[0]} onChange={(value) => onHandleEditRow(value.toString(), item, 'country')}>
            {country.map(item => (
              <Option value={item} key={v4()}>{item}</Option>
            ))}
          </Select>
          )
        }</td>

      <td>
        {item.id === 0
          ? "Any"
          : (
            <Select className={css.select} defaultValue={getGradeValue(item.minGrade, item.maxGrade)} onChange={(value) => onHandleEditRow(value.toString(), item, 'minGrade')}>
              {grade.map(item => (
                <Option value={item} key={v4()}>{item}</Option>
              ))}
            </Select>
          )
        }
      </td>

      <td>{moment(item.created).format("M/D/YY")}</td>

      <td>
        {item.id === 0
          ? ""
          : (
            <Select className={css.select} defaultValue={item.status} onChange={(value) => onHandleEditRow(value.toString(), item, 'status')}>
              {status.filter(i => i !== 'Any').map(item => (
                <Option value={item} key={v4()}>{item}</Option>
              ))}
            </Select>
          )
        }
      </td>

      <td>
        <div>
          <Button className="cancel-btn" onClick={() => onCancel(item)}>Cancel</Button>
          <Button loading={isLoading} disabled={!title} onClick={() => onSave(item)} type="primary">Save</Button>
        </div>
      </td>

    </tr>
  )
}