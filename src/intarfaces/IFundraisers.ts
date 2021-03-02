export interface IFundraisers {
  match: number;
  total: number;
  items: Array<IFundraisersTableData>
}

export interface IQueryParams {
  status?: string;
  country?: string;
  region?: string;
  query?: string;
}

export interface IFundraisersFilter {
  query?: string;
  status?: string;
  country?: string;
  region?: string;
  limit?: number;
  offset?: number;
}

export interface IFundraisersTableData {
  approved: boolean;
  closed: boolean;
  created: number;
  businessModel?: string;
  currency: string;
  end: number;
  id: number;
  location: ILocation;
  members: number;
  name: string;
  owner: IOwner;
  progress: IProgress;
  schoolType: string;
  shareLink: string;
  start: number;
  status: string;
  stripeAccount: IStripeAccount;
  teams: number;
}

interface ILocation {
  country: string;
  currency: string;
  displayCountry: string;
  id: number;
  schoolName: string;
  valid: boolean;
  zip: string;
  state: string;
  city: string;
}

export interface IOwner {
  activeAt?: number;
  avatar?: string;
  role?: string;
  conversationLink?: string;
  createdBy?: number;
  email?: string;
  emailVerified?: boolean;
  events?: []
  firstName?: string;
  id?: number;
  lastName?: string;
  loginLink?: string;
  password?: boolean;
}

interface IProgress {
  booksSum: number;
  donationsCount: number;
  minsSum: number;
  raisedSum: number;
  recordsCount: number;
  where: {}
  with: {}
}

interface IStripeAccount {
  accountId: string;
  created: number;
  email: string;
  livemode: boolean;
  publicKey: string;
  type: string;
  businessModel: string
}
