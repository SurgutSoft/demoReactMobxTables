import {IConfigs} from "../../intarfaces/IConfigs";
import css from "./Config.module.scss"

export const columns =
  [
    {
      title: 'PARAMETER NAME',
      dataIndex: 'name',
      key: 'name',
      width: "25%",
      render: (name: string) => <div className={css.parametrColumn}>{name}</div>
    },
    {
      title: 'VALUE',
      dataIndex: 'value',
      key: 'value',
      editable: true,
      render: (_: string, record: IConfigs) => (
        <div className={css.valueColumn}>
          <span className={record?.name.indexOf('text') === -1 ? "" : css.textValue}>{record.value}</span>
        </div>
      )
    }
  ];
