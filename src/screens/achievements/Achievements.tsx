import React, {useEffect} from 'react';
import {Observer, observer} from "mobx-react-lite";
import {Button, Divider, Select} from 'antd';
import {v4} from "uuid";

import {AchievementsTable} from './AchievementsTable';
import {Loader} from '../../components/loader/Loader';

import {type, region, newTempAchiement} from '../../constants/Achievements';
import achievementsStore from '../../stores/achievementsStore';

import css from "./Achievements.module.scss"

const Option = Select.Option;

const Achievements = observer(() => {
  const store = achievementsStore;

  useEffect(() => {
    store.fetchAchievements();
  }, []);

  return (
    <Observer>
      {() => (
        <div>
          <div className={"paginateBlock"}>
            <div className={css.stats}>
              <b>{`${store.filteredData.length} `}</b>achievements found
            </div>

            <Divider type="vertical" />

            <div className={css.filtersContainer}>
              <Select className={css.select} defaultValue={type[0]} onChange={(value) => store.handleChangeType(value)}>
                {type.map(item => (
                  <Option value={item} key={v4()}>{item}</Option>
                ))}
              </Select>

              <Select className={css.select} defaultValue={region[0]} onChange={(value) => store.handleChangeRegion(value)}>
                {region.map(item => (
                  <Option value={item} key={v4()}>{item}</Option>
                ))}
              </Select>
            </div>

            <Divider type="vertical" />

            <Button
              type="primary"
              disabled={store.isLoadingCreateNewAch || store.idEditingRow === newTempAchiement.id}
              onClick={() => store.createNewAch()}>
              Create new
            </Button>
          </div>

          {store.isLoading
            ? <Loader />
            : <AchievementsTable dataSource={store.filteredData} />
          }
        </div>
      )}
    </Observer>
  )
})

export default Achievements;
