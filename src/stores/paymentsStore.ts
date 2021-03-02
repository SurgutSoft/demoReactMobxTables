import {action, computed, makeAutoObservable} from 'mobx';
import {apiClient} from "../utils/api";
import moment from "moment";
import {IDonation, IPaymentData, IPaymentFilter} from "../intarfaces/IPayments";
import {IEvent} from "../intarfaces/IPayments";

const DEFAULT_LIMIT = 20;

class PaymentsStore {

  isLoading: boolean = false;
  isLoadingMore: boolean = false;

  data?: IPaymentData;
  events: Array<IEvent> = [];

  filter: IPaymentFilter = {
    dateFrom: moment().subtract(3, 'months').format('YYYY-MM-DD'),
    dateTo: moment().format('YYYY-MM-DD'),
    eventId: undefined,
    limit: DEFAULT_LIMIT,
    offset: 0
  }

  constructor() {
    makeAutoObservable(this)
  }

  setFilterByEventId(eventId: string | undefined) {
    this.filter.eventId = eventId;
  }

  setFilterByUserId(userId: string | undefined) {
    this.filter.userId = userId;
  }


  @action.bound
  fetchPayments = async () => {
    this.isLoading = true;
    this.data = await apiClient.getPayments(this.filter);
    this.isLoading = false;
  }

  @action.bound
  fetchEvents = async () => {
    const data = await apiClient.getFundraisers({status: 'fundraising', limit: 50});
    this.events = data.items;
  }

  @action.bound
  fetchMore = async () => {
    this.isLoadingMore = true;
    this.filter.offset += DEFAULT_LIMIT;
    const data = await apiClient.getPayments(this.filter);
    if (this.data && data )
      this.data.donations = this.data.donations.concat(data.donations);
    this.isLoadingMore = false;
  }

  @action.bound
  changeBeneficiary = async (newBeneficiaryId: number, donation: IDonation) => {
    await apiClient.updateBeneficiary(donation.payment.id, newBeneficiaryId);
    this.fetchPayments();
  }

  @computed
  get isMoreAvailable() {
    return this.data?.donations && this.data?.donations.length % DEFAULT_LIMIT === 0;
  }

  onIntervalChange = (dates: any) => {
    if (!dates) return;
    if (dates[0]) this.filter.dateFrom = dates[0].format('YYYY-MM-DD');
    if (dates[1]) this.filter.dateTo = dates[1].format('YYYY-MM-DD');
    this.fetchPayments();
  }


}

export default new PaymentsStore();
