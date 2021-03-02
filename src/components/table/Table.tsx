import React from "react";
import {Table, Button} from 'antd';

import css from "./Table.module.scss";

// todo типизировать на потом
interface IProps {
  columns: any,
  dataSource: Array<any>;
  handleChangeTable?: (pagination: any, filters: any, sorter: any) => void;
  handleAddMoreData?: () => void;
  isLoadingMore?: boolean;
  rowKey?: string;
  math?: number;
  deletedRowClassName?: any;
}

export function TableBase(props: IProps) {
  return (
    <>
      <Table
        rowKey={props.rowKey}
        rowClassName={(record) => record.status === 'deleted' && props.deletedRowClassName}
        showSorterTooltip={false}
        columns={props.columns}
        dataSource={props.dataSource}
        pagination={false}
        onChange={props.handleChangeTable}
      />

      <Button
        className={css.btnAdd}
        hidden={(props.math && props.math <= 10) || props.dataSource?.length === props.math}
        onClick={props.handleAddMoreData}
        loading={props.isLoadingMore}
        disabled={props.isLoadingMore}
      >
        <span>SHOW MORE</span>
      </Button>
    </>
  )
}
