import React, {useEffect, useState} from 'react';
import {Form, Input} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import {v4} from 'uuid';

import {EditableConfigTable} from '../../components/table/EditableConfigTable';
import {columns} from "./Config.columns";
import {Loader} from '../../components/loader/Loader';

import {IEditableConfigCellProps, IConfigs} from '../../intarfaces/IConfigs';
import api from "../../utils/api";

import css from "./Config.module.scss"

function Config() {
  const [isLoading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Array<IConfigs>>([]);
  const [filteredDataSource, setFilteredDataSource] = useState<Array<IConfigs>>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await api({url: "/api/v1/admin/config"});
    const items = []
    for (let key of Object.keys(data)) {
      items.push({name: key, value: data[key], key: v4()})
    }
    setLoading(false);
    setDataSource(items);
    setFilteredDataSource(items);
  }

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const filteredData = dataSource.filter(item => item.name.includes(e.target.value));
      setFilteredDataSource(filteredData);
    } else {
      setFilteredDataSource(dataSource)
    }
  }

  const EditableCell: React.FC<IEditableConfigCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = record?.name.indexOf('text') === -1 ? <Input /> : <Input.TextArea rows={7} />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{margin: 0}}
          >
            {inputNode}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  return (
    <div className={css.mainContainer}>
      <div className={"paginateBlock"}>
        <Input
          className={css.searchInput}
          placeholder="Search parameter"
          prefix={<SearchOutlined />}
          onChange={handleChangeFilter}
        />
      </div>

      {!isLoading ?
        <EditableConfigTable
          columns={columns}
          dataSource={filteredDataSource}
          editableCell={EditableCell}
        />
        : <Loader />
      }
    </div>
  )
}

export default Config;