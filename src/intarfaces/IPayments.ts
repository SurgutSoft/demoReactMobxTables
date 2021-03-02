export interface IPaymentFilter {
  dateFrom: string,
  dateTo: string,
  eventId?: string,
  userId?: string,
  limit: number,
  offset: number
}

export interface IPaymentData {
  days: Array<IDateStats>,
  donations: Array<IDonation>
  feeAmount: number | 0,
  totalAmount: number | 0
}

export interface IDateStats {
  amount: number
  date: string,
  feeAmount: number
}

export interface IDonation {
  event: IEvent,
  payment: IPayment,
  stripeAccount: IStripeAccount,
  stripeCharge: IStripeCharge
}

export interface IEvent {
  id: number,
  name: string,
  currency: string
}

interface IPayment {
  id: number,
  amount: number,
  beneficiary: IBeneficiary,
  created: number
  donorEmail: string,
  donorMessage: string,
  donorName: string,
  memberId: number,
  matchCorp: boolean,
  public: boolean
}

interface IBeneficiary {
  id: number,
  displayName: string,
  role: string
}

interface IStripeAccount {
  displayName: string,
  accountId: string,
  created: number,
  email: string
}

interface IStripeCharge {
  chargeAmount: number,
  feeAmount: number,
  chargeId: string,
}