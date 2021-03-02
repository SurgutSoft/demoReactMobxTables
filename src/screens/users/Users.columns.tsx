import {Dropdown, Button} from 'antd';
import {Link} from "react-router-dom";
import moment from 'moment'

import {tmAppUrl} from '../../constants/Users';
import {IEvent, IUsersFilter, IUsersTableData} from "../../intarfaces/IUsers";
import {currencyFormat} from "../../utils/index";
import api from "../../utils/api";

import contactIcon from "../../assets/images/contact.svg";
import actionIcon from "../../assets/images/action.svg"
import linkIcon from "../../assets/images/link.svg";
import filterIcon from "../../assets/images/icon-filter.svg";
import defAvatarIcon from "../../assets/avatars/default.png";
import css from "./columns.module.scss"

interface IColumnsProps {
  fetchUsers: () => Promise<void>;
  filters: IUsersFilter;
}

export const columns = (props: IColumnsProps) => {
  return (
    [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (id: string) => <div className={css.idCol}><b>{id}</b></div>
      },
      {
        title: 'PIC',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (url: string) => avatarCell(url),
      },
      {
        title: 'PROFILE NAME',
        dataIndex: 'displayName',
        key: 'displayName',
        render: (text: string, record: IUsersTableData) => profileNameCell(text, record),
      },
      {
        title: 'ROLE',
        dataIndex: 'role',
        key: 'role',
      },
      {
        title: 'FULL NAME',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (txt: string, record: IUsersTableData) => fullNameCell(txt, record),
      },
      {
        title: 'EVENT',
        dataIndex: 'event',
        key: 'event',
        render: (event: IEvent) => eventCell(event),
      },
      {
        title: 'DONATIONS',
        dataIndex: 'donations',
        key: 'donations',
        render: (donations: number, record: IUsersTableData) => donationsCell(donations, record),
      },
      {
        title: 'INTERCOM',
        dataIndex: 'intercom',
        key: 'intercom',
        render: (txt: string, record: IUsersTableData) => intercomCell(txt, record),
      },
      {
        title: 'EMAIL',
        dataIndex: 'email',
        key: 'email',
        render: (txt: string, record: IUsersTableData) => emailCell(txt, record),
      },
      {
        title: 'OAUTH',
        dataIndex: 'oauth',
        key: 'oauth',
        render: (txt: string) => authCell(txt),
      },
      {
        title: 'MANAGED',
        dataIndex: 'isManaged',
        key: 'isManaged',
        render: (txt: boolean, record: IUsersTableData) => managedByCell(txt, record)
      },
      {
        title: sortTitle('ACTIVE', props.filters),
        dataIndex: 'activeAt',
        key: 'activeAt',
        sorter: true,
        render: (time: number) => activeCell(time),
      },
      {
        title: sortTitle('CREATED', props.filters),
        dataIndex: 'created',
        key: 'created',
        sorter: true,
        render: (date: number) => <div className={css.createdCol}>{date ? moment(date).format("M/D/YY") :
          <span className="text-muted">Not active</span>}</div>
      },
      {
        key: 'delete',
        align: 'right',
        className: css.dltCol,
        render: (cell: string, record: IUsersTableData) => (
          record.role === "TM" && !record.donations
            ? (
              <Dropdown overlay={overlayDeleteBtn(record.id, props.fetchUsers)} trigger={['click']}>
                <div className="actions">
                  <img src={actionIcon} alt="img"/>
                </div>
              </Dropdown>
            )
            : null
        )
      }
    ])
}

const avatarCell = (url: string) => (
  <div className={css.avatar}>
    <img src={url || defAvatarIcon} alt="pic"/>
  </div>
);

const profileNameCell = (text: string, record: IUsersTableData) => (
  <div className={css.profileNameCol}>
    <a
      className="hovered cursor-pointer"
      title={`Sign in as ${text}`}
      target="_blank"
      rel="noreferrer"
      href={`${tmAppUrl}${record.loginLink.substring(record.loginLink.indexOf('/log-in'))}`} //todo acess-token
    >
      <span><b>{text}</b></span>&nbsp;
      <img className="link" src={linkIcon} alt="img"></img>
    </a>
  </div>
);

const fullNameCell = (txt: string, record: IUsersTableData) => (
  <div className={css.fullNameColl}>{`${record.firstName} ${record.lastName}`}</div>
)

const eventCell = (event: IEvent) => (
  event?.name
    ? <div className={css.eventCol}>{event?.name}</div>
    : <div className="text-muted">waiting for full registration...</div>
)

const donationsCell = (donations: number, record: IUsersTableData) => {
  const donation = `${currencyFormat(record.event?.currency || "")}${donations}`;

  return (
    <span
      className={donations > 0 ? "hovered cursor-pointer font-weight-bold" : ""}>
      {donations > 0
        ? <Link className={css.donCol} to={`/admin/payments?userId=${record.id}`}>{donation}</Link>
        : donation
      }
    </span>
  )
};

const emailCell = (txt: string, record: IUsersTableData) => (
  <div className={css.emailCol}>
    <div className={css.email}>{record.email}</div>
    {record.emailVerified && (
      <div className={css.verified}>Verified ✓</div>
    )}
  </div>
);

const authCell = (txt: string) => (
  txt
    ? <img className={css.authCol} src={`../../assets/images/${txt}.png`} alt="img"/>
    : ""
);

const managedByCell = (txt: boolean, record: IUsersTableData) => (
  <div className={css.managedCol}>
    {txt
      ? <a href={`/admin/users?search=id%3D${record.isManagedBy.id}`}
           onClick={() => window.location.reload()}>{record.isManagedBy.firstName}</a>
      : <div className="text-muted">None</div>}
  </div>
)

const overlayDeleteBtn = (id: number, fetchData: () => void) => {
  const handleDeleteUser = async () => {
    await api({method: "delete", url: `/api/v1/admin/users/${id}`})
    fetchData();
  }

  return (
    <div>
      <Button className={"deleteBtn"} onClick={handleDeleteUser}>Delete</Button>
    </div>
  )
}

const sortTitle = (title: string, filters: IUsersFilter) => {
  let style;
  if (title === "ACTIVE" && filters.orderByActivity) {
    style = css.active;
  }
  if (title === "CREATED" && filters.orderByCreated) {
    style = css.active;
  }

  return (
    <div className={css.sortCol}>
      <div>{title}</div>
      <img className={style} src={filterIcon} alt="sortImg"/>
    </div>
  )
}

const intercomCell = (txt: string, record: IUsersTableData) => (
  <div className={css.intercomCol}>
    <a
      className="actions contact"
      title="Open conversation (Intercom)"
      href={record.conversationLink}
      target="_blank"
      rel="noreferrer"
    >
      <img src={contactIcon} alt="img"/>
    </a>
  </div>
)

const activeCell = (time: number) => (
  <div className={css.activeCol}>
    {time
      ? <span
        className={moment(time).isSameOrAfter(new Date().getTime(), 'day') ? "text-success" : ""}>{moment(time).fromNow()}</span>
      : <span className="text-muted">Not active</span>}
  </div>
)
