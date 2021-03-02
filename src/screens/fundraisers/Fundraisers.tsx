import React, {useEffect, useState} from 'react';
import {Button, Divider, Input, Modal, Select} from "antd";
import {v4} from "uuid";
import qs from "qs";

import {Loader} from '../../components/loader/Loader';
import {TableBase} from '../../components/table/Table';
import {columns, modalText, okText, params} from "./Fundraisers.columns";
import api from "../../utils/api";
import {cities, countries, region, states, status} from "../../constants/Fundraisers";
import {IFundraisers, IFundraisersFilter, IQueryParams} from '../../intarfaces/IFundraisers';

import css from './Fundraisers.module.scss'
import {SearchOutlined} from "@ant-design/icons";

const Option = Select.Option;
const {Search} = Input;

function Fundraisers(history: any) {
  const getQueryParams = (): IQueryParams => {
    const queryParams = qs.parse(history.location.search.replace('?', '')) as IQueryParams;
    return (
      {
        status: queryParams.status || undefined,
        country: queryParams.country || undefined,
        region: queryParams.region || undefined,
      }
    )
  }

  const [fundraisers, setFundraisers] = useState<IFundraisers>({} as IFundraisers);
  const [filters, setFilters] = useState({limit: 10, ...getQueryParams()} as IFundraisersFilter);
  const [isLoading, setLoading] = useState(false);
  const [regions, setRegions] = useState([] as Array<string>);
  const [searchParams, setSearchParams] = useState({} as IQueryParams)
  const [isShowModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  useEffect(() => {
    fetchFundraisers();
    // eslint-disable-next-line
  }, [filters, searchParams]);

  const fetchFundraisers = async () => {
    const params: IFundraisersFilter = {
      ...filters,
      offset: filters.offset && filters.offset >= 10 ? filters.offset : undefined,
      status: filters.status?.includes("any") ? undefined : filters.status?.toLowerCase(),
      country: filters.country?.includes("any") ? undefined : filters.country?.toLowerCase(),
      region: filters.region?.includes("any") ? undefined : filters.region?.toLowerCase(),
      query: filters.query,
    }

    setLoading(true);
    const data: IFundraisers = await api({url: "/api/v1/admin/events", params});
    setLoading(false);
    const fundraiser: IFundraisers = {
      match: data.match,
      total: data.total,
      items: params.offset ? [...fundraisers.items, ...data.items] : data.items,
    }
    setFundraisers(fundraiser);
  };

  const handleAddMoreData = () => setFilters({...filters, offset: filters.offset ? filters.offset + 10 : 10});

  //todo refactor 
  const handleSetStatus = async (value: string) => {
    setSearchParams({...searchParams, status: value.includes("Any") ? undefined : value.toLowerCase()});
    setFilters({...filters, status: value.toLowerCase(), offset: undefined})

    const path = {...searchParams, status: value.includes("Any") ? undefined : value}
    history.history.replace(`?${qs.stringify(path)}`);
  }

  const handleSetCountry = async (value: string) => {
    setSearchParams({...searchParams, country:  value});
    setFilters({...filters, country: value, offset: undefined});

    const data = await api({url: `/api/v1/locations/regions?country=${value}`});
    setRegions(data);

    const path = {...searchParams, country: value}
    history.history.replace(`?${qs.stringify(path)}`);
  }


  const handleQuerySearch = (value: string) => {
    setSearchParams({...searchParams, query: value, });
    setFilters({...filters, query: value, offset: undefined})
    const path = {...searchParams, query: value,}
    history.history.replace(`?${qs.stringify(path)}`);
  }

  const handleSetRegion = (value: string) => {
    setSearchParams({...searchParams, region: value.includes("Any") ? undefined : value.toLowerCase()});
    setFilters({...filters, region: value.toLowerCase(), offset: undefined})

    const path = {...searchParams, region: value.includes("Any") ? undefined : value}
    history.history.replace(`?${qs.stringify(path)}`);
  }

  const showModal = () => {
    setShowModal(true);
  };

  const handleOk = (params: { id: number; field: string; value: boolean, action: string }) => {
    setShowModal(false);
    params.field !== 'delete' ? handleUpdateStatus(params) : handleDeleteStatus(params.id);

    const editedFund = fundraisers;
    const indexEditedRow = fundraisers.items.findIndex(item => item.id === params.id)
    editedFund.items[indexEditedRow].status = `${params.action}d`;
    setFundraisers(editedFund);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleUpdateStatus = async (params: { id: number; field: string; value: boolean }) => {
    const bodyFormData = new FormData();
    bodyFormData.append(params.field, `${params.value}`)
    await api({
      method: "put",
      url: `/api/v1/events/${params.id}`,
      data: bodyFormData
    })
    const data = {...fundraisers};

    // @ts-ignore: 
    data.items.find(item => item.id === params.id)[params.field] = params.value;
    setFundraisers(data);
  }

  const handleDeleteStatus = async (id: number) => {
    await api({method: "delete", url: `/api/v1/events/${id}`})
  }

  return (
    <div className={css.mainContainer}>
      <div className={"paginateBlock"}>
        <div>
          {fundraisers.match && <span><b>{fundraisers.match} match</b> of {fundraisers.total}</span>}
        </div>

        <Divider type="vertical"/>

        <div>
          <Search
            placeholder="Serach parameter"
            allowClear
            defaultValue={filters.query}
            enterButton={<Button disabled={searchQuery === ""}>SEARCH</Button>}
            onChange={onQueryChange}
            onSearch={handleQuerySearch}
            prefix={<SearchOutlined/>}
          />
        </div>

        <Divider type="vertical"/>

        <Select className={css.select} defaultValue={filters.status || status[0].name} onChange={handleSetStatus}>
          {status.map(item => (
            <Option value={item.name} key={item.id}>{item.name}</Option>
          ))}
        </Select>

        <Divider type="vertical"/>

        <Select className={css.select} placeholder={"Any country"} defaultValue={filters.country} allowClear={true} onChange={handleSetCountry}>
          {countries.map(country => (
            <Option value={country} key={country}>{country}</Option>
          ))}
        </Select>

        <Divider type="vertical"/>

        <Select
          className={css.select}
          defaultValue={filters.region || region.name}
          onChange={handleSetRegion}
          disabled={!filters.country || filters.country.includes('any')}
        >
          {filters.country === "US"
            ? <Option value={states[0].name}>{states[0].name}</Option>
            : <Option value={cities[0].name}>{states[0].name}</Option>
          }
          {regions?.map(item => (item &&
            <Option value={item} key={v4()}>{item}</Option>
          ))}
        </Select>
      </div>

      {isLoading && !filters.offset
        ? <Loader/>
        : <TableBase
          rowKey={"id"}
          columns={columns({fetchFundraisers, showModal})}
          dataSource={fundraisers.items}
          isLoadingMore={isLoading}
          math={fundraisers.match}
          deletedRowClassName={css.rowDeleted}
          handleAddMoreData={handleAddMoreData}
        />
      }

      <Modal visible={isShowModal} okText={okText} onOk={() => handleOk(params)} onCancel={handleCancel}>
        {modalText}
      </Modal>
    </div>
  )
}

export default Fundraisers;