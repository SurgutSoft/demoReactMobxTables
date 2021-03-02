import React from 'react';
import {Observer} from "mobx-react-lite";

import {EditableRow} from './EditableTableRow';
import {TableRow} from './TableRow';
import {IAchievements} from '../../intarfaces/IAchievements';
import achievementsStore from '../../stores/achievementsStore';

interface IProps {
  dataSource: IAchievements[];
}

export const AchievementsTable = (props: IProps) => {
  const {
    idEditingRow,
    isLoadingImage,
    moveTop,
    moveEnd,
    toggleEditing,
    deleteAch,
    uploadImage,
    handleEditingData,
    onSave,
    toggleCancelEditing,
    isLoadingCreateNewAch,
  } = achievementsStore;

  return (
    <Observer>
      {() => (
        <div className="table-responsive">
          <table className="table">
            <thead>
            <tr>
              <th>IMAGE</th>
              <th>NAME</th>
              <th>GOAL TYPE</th>
              <th>TMs</th>
              <th>GOAL TEXT / DONE TEXT</th>
              <th>EMAIL ID</th>
              <th>GOAL VALUE</th>
              <th>COUNTRY</th>
              <th>GRADE</th>
              <th>PARTNER</th>
              <th>PARTNER TEXT & LINK</th>
              <th></th>
            </tr>
            </thead>

            <tbody>
            {props.dataSource.map(item => (
              item.id === idEditingRow
                ? <EditableRow
                  item={item}
                  key={item.id}
                  isLoadingImage={isLoadingImage}
                  onUploadImage={uploadImage}
                  onHandleEditRow={handleEditingData}
                  onSave={onSave}
                  onCancel={toggleCancelEditing}
                  isLoading={isLoadingCreateNewAch}
                />
                : <TableRow
                  item={item}
                  key={item.id}
                  onEdit={() => toggleEditing(item)}
                  onDelete={() => deleteAch(item.id)}
                  onMoveTop={() => moveTop(item.id)}
                  onMoveEnd={() => moveEnd(item.id)}
                />
            ))}
            </tbody>

          </table>
        </div>
      )}
    </Observer>
  )
}
