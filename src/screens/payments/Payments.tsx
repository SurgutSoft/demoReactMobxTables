import React, {useEffect} from 'react';
import {Observer} from "mobx-react-lite";
import {Button, DatePicker, Divider, Select} from 'antd';
import paymentsStore from '../../stores/paymentsStore';
import moment from 'moment';
import css from "./Payments.module.scss"
import {Loader} from "../../components/loader/Loader";
import {PaymentsTable} from "./PaymentsTable";
import {useHistory, useLocation} from "react-router-dom";
import {formatAmount} from "../../utils";
import {Chart} from "./PaymentsChart";

const Option = Select.Option;
const {RangePicker} = DatePicker;

const Payments = () => {
  const store = paymentsStore;
  const location = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    store.setFilterByEventId(params.get('eventId') || undefined);
    store.setFilterByUserId(params.get('userId') || undefined);
    store.fetchPayments();
    store.fetchEvents();
    // eslint-disable-next-line
  }, []);

  const handleChangeEventId = (eventId: string) => {
    history.push({search: eventId ? `?eventId=${eventId}` : ''});
    store.setFilterByEventId(eventId);
    store.fetchPayments();
  }
  return (
    <Observer>
      {() => (
        <div>
          <div className="paginateBlock">
            <div>
              <strong>{formatAmount(store.data ? store.data.totalAmount : 0, 'USD')}</strong>
              {' '} / {' '}
              <strong className="accent">{formatAmount(store.data ? store.data.feeAmount : 0, 'USD')}</strong>
            </div>

            <Divider type="vertical"/>

            <div className={css.filtersContainer}>
              <Select className={css.select} placeholder='All active fundraisers'
                      value={store.filter.eventId}
                      onChange={handleChangeEventId}
                      allowClear>
                {store.events.map(event =>
                  (<Option value={`${event.id}`} key={event.id}>{event.name}</Option>)
                )}
              </Select>

            </div>

            <Divider type="vertical"/>

            <RangePicker format={'MM/DD/YYYY'}
                         defaultValue={[moment(store.filter.dateFrom, 'YYYY-MM-DD'), moment()]}
                         allowClear={false} onCalendarChange={store.onIntervalChange}/>

            <Divider type="vertical"/>

            {store.data && <Chart days={store.data.days}/>}

          </div>

          {store.isLoading ?
            <Loader/> :
            <div className="table-responsive">
              {store.data ?
                <PaymentsTable donations={store.data.donations}
                               onBeneficiaryChange={store.changeBeneficiary}/> : ''
              }
            </div>
          }

          <Button
            className="btnAdd"
            onClick={store.fetchMore}
            hidden={!store.isMoreAvailable}
            loading={store.isLoadingMore}
            disabled={store.isLoadingMore}>
            <span>Show more donations</span>
          </Button>
        </div>
      )}
    </Observer>
  )
}


export default Payments;
