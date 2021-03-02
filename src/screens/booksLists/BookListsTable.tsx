import React from 'react';
import {Observer} from "mobx-react-lite";

import {TableRow} from './TableRow';
import {EditableRow} from './EditableRow';
import {IBookLists} from '../../intarfaces/IBookLists';
import bookListsStore from '../../stores/bookListsStore';

interface IProps {
  dataSource: IBookLists[];
}

export const BookListsTable = (props: IProps) => {
  const {
    idEditingRow,
    isLoadingEdit,
    onCancelEditing,
    onSave,
    onEdit,
    handleEditingData,
    onDelete,
  } = bookListsStore;

  return (
    <Observer>
      {() => (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>SIZE</th>
                <th>OWNER</th>
                <th>COUNTRY</th>
                <th>GRADE</th>
                <th>CREATED</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {props.dataSource.map(item => (
                item.id === idEditingRow
                  ? <EditableRow
                    item={item}
                    key={item.id}
                    isLoading={isLoadingEdit}
                    onSave={onSave}
                    onCancel={onCancelEditing}
                    onHandleEditRow={handleEditingData}
                  />
                  : <TableRow item={item} key={item.id} onDelete={() => onDelete(item.id)} onEdit={() => onEdit(item)}/>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </Observer>
  )
}
