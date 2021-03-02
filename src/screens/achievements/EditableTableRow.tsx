import React from 'react';
import { Button, Input, InputNumber, Select, Upload } from 'antd';
import { IAchievements } from '../../intarfaces/IAchievements';

import css from './columns.module.scss';
import { goalType, partner, region } from '../../constants/Achievements';
import { v4 } from 'uuid';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';

interface IProps {
  item: IAchievements;
  isLoadingImage: boolean;
  onUploadImage: (file: any, row: IAchievements) => Promise<void>;
  onHandleEditRow: (value: string | number | undefined, row: IAchievements, key: keyof IAchievements) => void;
  onSave: (row: IAchievements) => void;
  onCancel: (row: IAchievements) => void;
  isLoading: boolean;
}

const Option = Select.Option;

export const EditableRow = ({
                              item,
                              isLoadingImage,
                              isLoading,
                              onUploadImage,
                              onHandleEditRow,
                              onSave,
                              onCancel
                            }: IProps) => {

  return (
    <tr key={v4()} className={css.editing}>
      <td className={css.verticalAlign}>
        <div>
          <Upload
            name="file"
            multiple={false}
            showUploadList={false}
            customRequest={({file}) => onUploadImage(file, item)}>
            <Button>
              <div className={css.upload}>
                {isLoadingImage ? <LoadingOutlined/> : <UploadOutlined/>}
                <span>&nbsp;Upload</span>
              </div>
            </Button>
          </Upload>
        </div>
      </td>

      <td className={css.verticalAlign}>
        <div>
          <Input defaultValue={item.name}
                 placeholder="Name"
                 onChange={(e) => onHandleEditRow(e.target.value, item, 'name')}/>
        </div>
      </td>

      <td className={css.verticalAlign}>
        <Select
          className={css.editGoalType}
          defaultValue={item.goalType || goalType[0]}
          onChange={(value) => onHandleEditRow(value, item, 'goalType')}
        >
          {goalType.map(item => (
            <Option value={item} key={v4()}>{item}</Option>
          ))}
        </Select>
      </td>

      <td></td>
      <td>
        <div className={css.editGoalText}>
          <Input defaultValue={item.goalText} placeholder="Goal text"
                 onChange={(e) => onHandleEditRow(e.target.value, item, 'goalText')}/>
          <Input defaultValue={item.doneText} placeholder="Done text"
                 onChange={(e) => onHandleEditRow(e.target.value, item, 'doneText')}/>
          <Input defaultValue={item.emailTemplateId} placeholder="Email ID"
                 onChange={(e) => onHandleEditRow(e.target.value, item, 'emailTemplateId')}/>

        </div>
      </td>

      <td>

      </td>


      <td className={css.verticalAlign}>
        <InputNumber
          defaultValue={item.goalValue}
          min={0}
          placeholder="Personal goal"
          onChange={(value) => onHandleEditRow(value, item, 'goalValue')}/>
      </td>

      <td className={css.verticalAlign}>
        <Select
          className={css.editRegion}
          defaultValue={item.country || region[0]}
          onChange={(value) => onHandleEditRow(value, item, 'country')}
        >
          {region.map(item => (
            <Option value={item} key={v4()}>{item}</Option>
          ))}
        </Select>
      </td>

      <td className={css.verticalAlign}>
        <div className={css.editGrade}>
          <InputNumber
            className={css.grade}
            max={12} min={-1}
            defaultValue={item.minGrade}
            placeholder="Any"
            onChange={(value) => onHandleEditRow(value, item, 'minGrade')}
          />
          <InputNumber
            className={css.grade}
            max={12} min={-1}
            defaultValue={item.maxGrade}
            placeholder="Any"
            onChange={(value) => onHandleEditRow(value, item, 'maxGrade')}
          />
        </div>
      </td>

      <td className={css.verticalAlign}>
        <Select
          className={css.editPartner}
          defaultValue={partner.find(i => i.url === item.partnerLogoUrl)?.value || partner[0].value}
          onChange={(value) => onHandleEditRow(partner.find(it => it.value === value)?.url, item, 'partnerLogoUrl')}
        >
          {partner.map(item => (
            <Option value={item.value} key={v4()}>{item.value}</Option>
          ))}
        </Select>
      </td>

      <td>
        <div className={css.editPartnerTextLink}>
          <Input defaultValue={item.partnerText} placeholder="Partner text"
                 onChange={(e) => onHandleEditRow(e.target.value, item, 'partnerText')}/>
          <Input defaultValue={item.partnerUrl} placeholder="Partner link"
                 onChange={(e) => onHandleEditRow(e.target.value, item, 'partnerUrl')}/>
        </div>
      </td>

      <td>
        <div className={css.blockOperations}>
          <Button className={css.btns} type="primary" loading={isLoading} onClick={() => onSave(item)}>Save</Button>
          <Button className={css.btns} disabled={isLoading} onClick={() => onCancel(item)}>Cancel</Button>
        </div>
      </td>
    </tr>
  )
}
