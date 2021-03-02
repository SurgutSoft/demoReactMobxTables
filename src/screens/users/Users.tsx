import React, {useEffect, useState} from 'react';
import {Button, Divider, Input, Select} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import qs from "qs";

import {TableBase} from '../../components/table/Table';
import {columns} from "./Users.columns";
import {Loader} from '../../components/loader/Loader';

import api from "../../utils/api";
import {rols} from "../../constants/Users";

import {IUsers, IUsersFilter, IQueryUsersParams} from "../../intarfaces/IUsers";

import css from "./Users.module.scss"

const {Search} = Input;
const {Option} = Select;

export function Users(history: any) {
  const getQueryParams = (): IUsersFilter => {
    const queryParams = qs.parse(history.location.search.replace('?', '')) as IQueryUsersParams;
    return (
      {
        role: queryParams.role || undefined,
        search: queryParams.search || undefined,
      }
    )
  }

  const [users, setUsers] = useState<IUsers>({} as IUsers);
  const [prmsInputVal, setPrmsInputVal] = useState("");
  const [filters, setFilters] = useState({orderByCreated: true, limit: 10, ...getQueryParams()} as IUsersFilter);
  const [searchParams, setSearchParams] = useState({} as IQueryUsersParams)
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters, searchParams]);

  const fetchUsers = async () => {
    const params = {
      ...filters,
      offset: filters.offset && filters.offset >= 10 ? filters.offset : undefined,
    }

    setLoading(true);
    const data: IUsers = await api({url: "/api/v1/admin/users", params});
    setLoading(false);
    const user: IUsers = {
      match: data.match,
      total: data.total,
      items: params.offset ? [...users.items, ...data.items] : data.items,
    }
    setUsers(user);
  };

  const handleAddMoreData = () => setFilters({...filters, offset: filters.offset ? filters.offset + 10 : 10});

  //todo refactor dry
  const handleSetRole = (value: string) => {
    setFilters({...filters, role: value !== rols[0].name ? value : undefined, offset: undefined});
    setSearchParams({...searchParams, role: value.includes("Any") ? undefined : value});
    const path = {...searchParams, role: value.includes("Any") ? undefined : value};
    history.history.replace(`?${qs.stringify(path)}`);
  }

  const handleSetParametrSearch = (value: string) => {
    setFilters({...filters, search: value ? value : undefined, offset: undefined});
    setSearchParams({...searchParams, search: value.includes("Any") ? undefined : value});
    const path = {...searchParams, search: value.includes("Any") ? undefined : value};
    history.history.replace(`?${qs.stringify(path)}`);
  }

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => setPrmsInputVal(e.target.value);

  //todo any
  const handleChangeTable = (pagination: any, filt: any, sorter: any) => {
    if (sorter.field === "activeAt") {
      setFilters({...filters, orderByActivity: true, orderByCreated: undefined})
    }

    if (sorter.field === "created") {
      setFilters({...filters, orderByActivity: undefined, orderByCreated: true})
    }
  };

  return (
    <div className={css.mainContainer}>
      <div className={"paginateBlock"}>
        <div className={css.stats}>
          {users.match && <span><b>{users.match} match</b> of {users.total}</span>}
        </div>

        <Divider type="vertical" />

        <div>
          <Search
            placeholder="Serach parameter"
            allowClear
            defaultValue={filters.search}
            enterButton={<Button disabled={prmsInputVal === ""}>SEARCH</Button>}
            onChange={handleInputValue}
            onSearch={handleSetParametrSearch}
            prefix={<SearchOutlined />}
          />
        </div>

        <Divider type="vertical" className={css.delimeter} />

        <Select className={css.roleSelect} defaultValue={filters.role || rols[0].name} onChange={handleSetRole}>
          {rols.map(item => (
            <Option value={item.name} key={item.id}>{item.name}</Option>
          ))}
        </Select>
      </div>

      {isLoading && !filters.offset
        ? <Loader />
        : <TableBase
          rowKey={"id"}
          columns={columns({fetchUsers, filters})}
          dataSource={users.items}
          isLoadingMore={isLoading}
          math={users.match}
          handleChangeTable={handleChangeTable}
          handleAddMoreData={handleAddMoreData}
        />
      }
    </div>
  );
}

export default Users;