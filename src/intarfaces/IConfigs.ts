import {IEditableCellProps} from "./ICommon";

export interface IConfigs {
  key: string;
  name: string;
  value: string;
}

export interface IEditableConfigCellProps extends IEditableCellProps {
  record: IConfigs;
}