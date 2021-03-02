import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'antd';
import { EditFilled } from '@ant-design/icons';
import { IConfigs } from '../../intarfaces/IConfigs';
import api from "../../utils/api";

interface Item {
  key: string;
  name: string;
  value: string;
}

interface IProps {
  columns: any,
  dataSource: Array<any>;
  editableCell: React.FC<any>;
  rowKey?: string;
}

export const EditableConfigTable = (props: IProps) => {
  const [form] = Form.useForm();
  const [data, setData] = useState({} as Array<IConfigs>);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    setData(props.dataSource)
  }, [props.dataSource]);

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Item) => {
    form.setFieldsValue({...record});
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const updateData = (name: string, value: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append("value", value)
    api({
      method: 'put',
      url: `/api/v1/admin/config/${name}`,
      data: bodyFormData
    })
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        setData(newData);
        setEditingKey('');
        updateData(item.name, row.value);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    ...props.columns,
    {
      title: '',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <div>
            <Button className="cancel-btn" onClick={cancel}>CANCEL</Button>
            <Button onClick={() => save(record.key)}>SAVE</Button>
          </div>
        ) : (
            <Button className="actions" disabled={editingKey !== ''} onClick={() => edit(record)}>
              <EditFilled />
            </Button>
          );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      {data.length ?
        <Table
          components={{
            body: {
              cell: props.editableCell,
            },
          }}
          dataSource={data}
          columns={mergedColumns}
          pagination={false}
        />
        : <></>
      }
    </Form>
  );
};
