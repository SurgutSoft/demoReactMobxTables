import {IBookLists} from "../../intarfaces/IBookLists";
import css from "./column.module.scss"

export const columns =
  [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'NAME',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'SIZE',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'OWNER',
      dataIndex: 'title',
      key: 'title',
      render: (_: string, rec: IBookLists) => ownerCell(_, rec)
    },
    {
      title: 'COUNTRY',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'GRADE',
      dataIndex: 'gradeDisplay',
      key: 'gradeDisplay',
    },
    {
      title: 'CREATED',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
    }
  ];

const ownerCell = (_: string, rec: IBookLists) => (
  <>
    {rec?.owner?.role === 'SA'
      ? <span>RFMS (SA)</span>
      : <span>{rec?.owner?.role}</span>
    }
  </>
)
