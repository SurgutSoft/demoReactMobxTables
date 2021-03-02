import React from 'react';
import {Dropdown, Menu, Popconfirm} from 'antd';
import actionIcon from '../../assets/images/action.svg';
import {IAchievements} from '../../intarfaces/IAchievements';

import css from './columns.module.scss';
import { DEFAULT_ACHIEVEMENT_EMAIL_ID } from "../../constants/Achievements";

interface IProps {
  item: IAchievements;
  onEdit: () => void;
  onDelete: () => void;
  onMoveTop: () => void;
  onMoveEnd: () => void;
}

export const TableRow = ({item, onEdit, onDelete, onMoveTop, onMoveEnd}: IProps) => {
  return (
    <tr key={item.id}>
      <td><img src={item.imageUrl} alt="img" className={css.imageCol}/></td>

      <td className={css.nameCol}><b>{item.name}</b></td>

      <td>
        <div className={css.goalTypeCol}>{item.goalType}</div>
      </td>

      <td>
        {item.achieved > 0 ? item.achieved : <span className="text-muted">0</span>}
      </td>

      <td>
        <div className={css.goalDoneCol}>
          <div>{item.goalText}</div>
          <div>{item.doneText}</div>
        </div>
      </td>

      <td>
        <div className={css.emailCol}>
          {item.emailTemplateId ?
            <a target="_blank"
              href={`https://djsconsulting.createsend.com/triggered/reports/snapshot/${item.emailTemplateId}`}>Custom</a> :
            <a target="_blank" className="text-muted"
              href={`https://djsconsulting.createsend.com/triggered/reports/snapshot/${DEFAULT_ACHIEVEMENT_EMAIL_ID}`}>Default</a>
          }
        </div>
      </td>

      <td>
        <GoalValueCell goaltype={item.goalType}
                       goalValue={item.goalValue}/>
      </td>

      <td>
        {item.country?.indexOf('Any') ? item.country : <span className="text-muted">Any</span>}
      </td>

      <td>
        <GradeCell minGrade={item.minGrade} maxGrade={item.maxGrade}/>
      </td>

      <td>{item.partnerLogoUrl
        ? <img src={item.partnerLogoUrl} alt="img" className={css.partnerLogoCol}/>
        : <span className="text-muted">Internal</span>}
      </td>

      <td>
        <PartnerTextCell partnerText={item.partnerText}
                         partnerUrl={item.partnerUrl}/>
      </td>

      <td>
        <ActionsCell onEdit={onEdit} onDeleteConfirm={onDelete} onMoveTop={onMoveTop} onMoveEnd={onMoveEnd}/>
      </td>
    </tr>
  )
}

const GoalValueCell = ({goaltype, goalValue}: any) => {
  if (goalValue) {
    switch (goaltype) {
      case "minutes":
        return <b>{goalValue} minutes</b>;
      case "books":
        return <b>{goalValue} books</b>;
      case "views":
        return <b>{goalValue} views</b>;
      case "donations":
        return <b>${goalValue}</b>;
    }
  }
  return <b>Personal goal</b>;
}

const GradeCell = ({minGrade, maxGrade}: any) => {
  let text;
  if (minGrade <= -1 && maxGrade >= 12) {
    text = <span className="text-muted">Any</span>;
  } else {
    if (maxGrade >= 12) {
      text = `${minGrade}+`;
    } else {
      text = `${minGrade}-${maxGrade}`;
    }
  }
  return <>{text}</>;
}

const PartnerTextCell = ({partnerText, partnerUrl}: any) => {
  return <div className={css.partnerTextcol}>
    <div>{partnerText || ""}</div>
    <a
      className={css.partnerLink}
      title="Open conversation (Intercom)"
      href={partnerUrl}
      target="_blank"
      rel="noreferrer"
    >{partnerUrl}</a>
  </div>
}

const ActionsCell = ({onEdit, onDeleteConfirm, onMoveTop, onMoveEnd}: any) => {
  const overlay = () => (
    <Menu>
      <Menu.Item onClick={onMoveTop}>
        Move Top
      </Menu.Item>
      <Menu.Item onClick={onMoveEnd}>
        Move End
      </Menu.Item>
      <Menu.Item onClick={onEdit}>
        Edit
      </Menu.Item>
      <Menu.Item>
        <Popconfirm title="Do you want to delete it?" onConfirm={onDeleteConfirm}>
          Delete
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
  return <Dropdown overlay={overlay()} trigger={['click']}>
    <div className="actions">
      <img src={actionIcon} alt="img"/>
    </div>
  </Dropdown>
}
