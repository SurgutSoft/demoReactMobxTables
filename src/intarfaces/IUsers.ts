export interface IUsers {
  match: number;
  total: number;
  items: Array<IUsersTableData>
}

export interface IUsersTableData {
  activeAt: number;
  avatar: string;
  conversationLink: string;
  created: number;
  createdBy: number;
  displayName: string;
  donations: number;
  email: string;
  emailVerified: boolean;
  event: IEvent,
  firstName: string;
  id: number;
  isManaged: boolean;
  isManagedBy: IManagedBy;
  lastName: string;
  loginLink: string;
  oauth: string;
  password: boolean;
  role: string;
}

export interface IEvent {
  approved: boolean;
  closed: boolean;
  created: number;
  currency: string;
  end: number;
  id: number;
  location: ILocation;
  name: string;
  role: string;
  start: number;
  teamId: number;
  teamMemberId: number;
}

interface ILocation {
  address1: string;
  city: string;
  country: string;
  currency: string;
  displayCountry: string;
  id: number;
  schoolName: string;
  state: string;
  valid: boolean;
  zip: string;
}

export interface IQueryUsersParams {
  role?: string;
  search?: string;
}

export interface IUsersFilter {
  role?: string;
  limit?: number;
  search?: string;
  offset?: number;
  orderByActivity?: boolean;
  orderByCreated?: boolean;
}

export interface ILoading {
  isLoading: boolean;
  isAddition: boolean;
}

interface IManagedBy {
  activeAt: number
  avatar: string;
  created: number;
  createdBy: number;
  displayName: string;
  email: string;
  emailVerified: boolean;
  events: [];
  firstName: string;
  gender: string;
  id: number;
  lastName: string;
  password: boolean;
  role: string;
}
