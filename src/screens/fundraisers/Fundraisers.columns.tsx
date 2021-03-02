import {Link} from "react-router-dom";
import moment from 'moment'
import {Button, Dropdown} from 'antd';

import {FundStatus} from '../../constants/Fundraisers';
import {IFundraisersTableData} from '../../intarfaces/IFundraisers';
import {currencyFormat} from "../../utils/index";
import {getDate} from '../../utils/index';

import actionIcon from "../../assets/images/action.svg";
import contactIcon from "../../assets/images/contact.svg";
import mapMarkerIcon from "../../assets/images/map-marker.svg";
import linkIcon from "../../assets/images/link.svg";
import mapMarkerOutlineIcon from "../../assets/images/map-marker-outline.svg";
import defAvatarIcon from "../../assets/avatars/default.png";

import css from "./columns.module.scss"


interface IColumnsProps {
  fetchFundraisers: () => Promise<void>;
  showModal: () => void;
}

export const columns = (props: IColumnsProps) => {
  return (
    [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (cell: string) => <div className={css.idCol}><b>{cell}</b></div>
      },
      {
        title: 'FUNDRAISER NAME',
        dataIndex: 'name',
        key: 'name',
        render: (cell: string, record: IFundraisersTableData) => fundraiserNameCell(cell, record),
      },
      {
        title: 'SCHOOL',
        dataIndex: 'schoolType',
        key: 'schoolType',
        render: (cell: string, record: IFundraisersTableData) => schoolCell(cell, record)
      },
      {
        title: 'EVENT ADMIN',
        dataIndex: 'eventAdmin',
        key: 'eventAdmin',
        render: (cell: string, record: IFundraisersTableData) => eventAdminCell(cell, record)
      },
      {
        title: 'INTERCOM',
        dataIndex: 'INTERCOM',
        key: 'INTERCOM',
        render: (cell: string, record: IFundraisersTableData) => intercomCell(cell, record),
      },
      {
        title: 'FUNDRAISING',
        dataIndex: 'FUNDRAISING',
        key: 'FUNDRAISING',
        render: (cell: number, record: IFundraisersTableData) => fundraisingCell(cell, record),
      },
      {
        title: 'MODEL',
        dataIndex: 'MODEL',
        key: 'MODEL',
        render: (cell: number, record: IFundraisersTableData) => <>{record.businessModel}</>,
      },
      {
        title: 'TEAMS',
        dataIndex: 'TEAMS',
        key: 'teams',
        render: (cell: number, record: IFundraisersTableData) => teamsCell(cell, record)
      },
      {
        title: 'MEMBERS',
        dataIndex: 'MEMBERS',
        key: 'MEMBERS',
        render: (cell: number, record: IFundraisersTableData) => membersCell(cell, record)
      },
      {
        title: 'MINUTES',
        dataIndex: 'MINUTES',
        key: 'MINUTES',
        render: (cell: number, record: IFundraisersTableData) => minutesCell(cell, record)
      },
      {
        title: 'BOOKS',
        dataIndex: 'BOOKS',
        key: 'BOOKS',
        render: (cell: number, record: IFundraisersTableData) => booksCell(cell, record)
      },
      {
        title: 'ACTIVE',
        dataIndex: 'ACTIVE',
        key: 'ACTIVE',
        render: (cell: number, record: IFundraisersTableData) => activeCell(cell, record)
      },
      {
        title: 'CREATED',
        dataIndex: 'CREATED',
        key: 'CREATED',
        render: (cell: number, record: IFundraisersTableData) => createdCell(cell, record)
      },
      {
        title: 'STATUS',
        dataIndex: 'STATUS',
        key: 'STATUS',
        render: (cell: string, record: IFundraisersTableData) => statusCell(cell, record)
      },
      {
        key: 'delete',
        align: 'right',
        className: css.dltCol,
        render: (cell: string, record: IFundraisersTableData) => (
          record.status !== FundStatus.DELETED
            ? (
              <Dropdown overlay={overlayDeleteBtn(record, props)} trigger={['click']}>
                <div className="actions">
                  <img src={actionIcon} alt="img"/>
                </div>
              </Dropdown>
            )
            : null
        )
      },
    ]
  )
};

export let modalText = <></>;
export let params: { id: number, field: string, value: boolean, action: string };
export let okText = "Ok";

const setModalText = (action: string) => (
  modalText = (
    <div className={css.modal}>
      <div>{`Are you sure you want to ${action} fundraiser?`}</div>
      <div>{'You cannot undo this!!!'}</div>
    </div>
  )
)

const overlayDeleteBtn = (record: IFundraisersTableData, props: IColumnsProps) => {
  const actionsFundraisers = (id: number, index: number, value: boolean, action: string, field: string): any => {
    setModalText(action);
    okText = action;
    props.showModal();
    params = {
      id,
      field,
      value,
      action
    };
  };

  const deleteFundraisers = (id: number, index: number, action: string): any => {
    setModalText(action);
    okText = action;
    props.showModal();
    params = {
      id,
      field: action,
      value: true,
      action
    }
  }

  return (
    <div>
      {record.closed && <Button className={"deleteBtn"}
                                onClick={() => actionsFundraisers(record.id, record.id, false, 'open', 'closed')}>Open</Button>}
      {!record.closed && record.approved && <Button className={"deleteBtn"}
                                                    onClick={() => actionsFundraisers(record.id, record.id, false, 'unapprove', 'approved')}>Unapprove</Button>}
      {!record.approved && <Button className={"deleteBtn"}
                                   onClick={() => actionsFundraisers(record.id, record.id, true, 'approve', 'approved')}>Approve</Button>}
      {!record.closed && record.approved && <Button className={"deleteBtn"}
                                                    onClick={() => actionsFundraisers(record.id, record.id, true, 'close', 'closed')}>Close</Button>}
      {(!record.approved || record.closed) &&
      <Button className={"deleteBtn"} onClick={() => deleteFundraisers(record.id, record.id, 'delete')}>Delete</Button>}
    </div>
  )
}

const fundraiserNameCell = (cell: string, record: IFundraisersTableData) => (
  <div className={css.fundrNameCol}>
    <a
      className="hovered cursor-pointer"
      title='Open Donation page'
      target="_blank"
      rel="noreferrer"
      href={record.shareLink}
    >
      <span>{cell}</span>&nbsp;
      <img className="link" src={linkIcon} alt="img"></img>
    </a>
    <div className="row-description">{getDate(record.end)}</div>
  </div>
)

const schoolCell = (cell: string, record: IFundraisersTableData) => (
  <div className={css.schoolCol}>
    <div className={css.locationIcon}>
      {record.location.valid
        ? <img className={css.markerIcon} src={mapMarkerIcon} alt="img"/>
        : <img className={css.markerIcon} src={mapMarkerOutlineIcon} alt="img"/>
      }
    </div>

    <div>
      {record.location.valid
        ? <a
          className="hovered cursor-pointer"
          title="Open Donation page"
          target="_blank"
          rel="noreferrer"
          href={`https://www.google.ru/maps/search/${record.location.schoolName},${record.location.zip} ${record.location.country}`}
        >
          {record.location.schoolName}
        </a>
        : <span>{record.location.schoolName}</span>
      }
      <div className="row-description">
        {record.schoolType ? record.schoolType + " | " : ""}
        {record.location.state ? record.location.state : record.location.city}
        {`${record.location.zip}, ${record.location.country}`}
      </div>
    </div>
  </div>
)

const eventAdminCell = (cell: string, record: IFundraisersTableData) => (
  <div className={css.adminEventCol}>
    <div className={css.avatar}>
      <img src={record.owner.avatar || defAvatarIcon} alt="pic"/>
    </div>

    <div className={css.adminInfo}>
      <div>
        <a
          className="hovered cursor-pointer"
          title="Sign in as this user"
          target="_blank"
          rel="noreferrer"
          href={record.owner.loginLink}>
          {record.owner.firstName
            ? <b>{`${record.owner.firstName} ${record.owner.lastName}`}</b>
            : <b>No name</b>
          }
          &nbsp;<img className="link" src={linkIcon} alt="img"></img>
        </a>
      </div>
      <div className="row-description">{record.owner.email}</div>
    </div>
  </div>
)

const intercomCell = (cell: string, record: IFundraisersTableData) => (
  <div className={css.intercomCol}>
    <a
      className="actions contact"
      title="Open conversation (Intercom)"
      href={record.owner.conversationLink}
      target="_blank"
      rel="noreferrer"
    >
      <img src={contactIcon} alt="img"/>
    </a>
  </div>
)

const fundraisingCell = (cell: number, record: IFundraisersTableData) => {
  const fundraising = record.stripeAccount
    ? `${currencyFormat(record.currency || "")}${record.progress.raisedSum}`
    : <div className={css.empty}>no Stripe</div>;

  return (
    <span
      className={record.progress.raisedSum > 0 ? "hovered cursor-pointer font-weight-bold" : ""}>
      {record.progress.raisedSum > 0
        ? <Link className={css.donCol} to={`/admin/payments?eventId=${record.id}`}>{fundraising}</Link>
        : fundraising
      }
    </span>
  )
};

const teamsCell = (cell: number, record: IFundraisersTableData) => (
  <div className={!record.teams ? css.empty : ""}>{record.teams}</div>
)

const membersCell = (cell: number, record: IFundraisersTableData) => (
  <div className={!record.members ? css.empty : ""}>{record.members}</div>
)

const minutesCell = (cell: number, record: IFundraisersTableData) => (
  <div className={!record.progress.minsSum ? css.empty : ""}>{record.progress.minsSum}</div>
)

const booksCell = (cell: number, record: IFundraisersTableData) => (
  <div className={!record.progress.booksSum ? css.empty : ""}>{record.progress.booksSum}</div>
)

const activeCell = (cell: number, record: IFundraisersTableData) => (
  <div className={css.activeCol}>
    {record.owner.activeAt
      ? <span
        className={moment(record.owner.activeAt).isSameOrAfter(new Date().getTime(), 'day') ? "text-success" : ""}>{moment(record.owner.activeAt).fromNow()}</span>
      : <span className="text-muted">Not active</span>}
  </div>
)

const createdCell = (cell: number, record: IFundraisersTableData) => (
  <div>
    {record.created
      ? moment(record.created).format("M/D/YY")
      : <span className="text-muted">Not active</span>
    }
  </div>
)

const statusCell = (cell: string, record: IFundraisersTableData) => {
  const getStatusCell = () => {
    switch (record.status) {
      case FundStatus.APPROVED:
        return css.approved;
      case FundStatus.FUNDRAISING:
        return css.fundraising;
      case FundStatus.PREPARING:
        return css.preparing;
      case FundStatus.UNAPPROVED:
        return css.unapproved;
      default:
        return css.closed;
    }
  }

  return (
    <div className={css.status}>
      <div className={getStatusCell()}>{record.status}</div>
    </div>
  )
}
