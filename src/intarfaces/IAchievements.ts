import {IEditableCellProps} from "./ICommon";

export interface IAchievements {
  doneText: string;
  goalText: string;
  goalType: string;
  goalValue?: number;
  achieved: number;
  id: number
  emailTemplateId?: string;
  imageUrl: string;
  maxGrade: number;
  minGrade: number;
  modifiedAt?: number;
  name: string
  country?: string;
  partnerLogoUrl?: string;
  partnerText?: string;
  partnerUrl?: string;
  isValid?: boolean;
};

export interface INewAchievements {
  name: string,
  goalType: string,
  goalText: string,
  doneText: string,
  imageUrl: string,
  goalValue: number,
}

export interface IAchievementsFilters {
  type?: string;
  country?: string;
};

export interface IEditableAchievementsCellProps extends IEditableCellProps {
  record: IAchievements;
}
