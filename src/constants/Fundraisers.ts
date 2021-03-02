export const FundStatus = {
  UNAPPROVED: "unapproved",
  FUNDRAISING: "fundraising",
  APPROVED: "approved",
  PREPARING: "preparing",
  CLOSED: "closed",
  DELETED: "deleted",
}

export const status = [
  {
    name: "Any status",
    id: 0,
  },
  {
    name: "Preparing",
    id: 1,
  },
  {
    name: "Fundraising",
    id: 2,
  },
  {
    name: "Closed",
    id: 3,
  },
  {
    name: "Deleted",
    id: 4,
  },
];

export const region = {
  name: 'Any State/City',
  region: null
};

export const states = [
  {
    name: 'Any State',
    region: null
  }
];

export const cities = [
  {
    name: 'Any City',
    region: null
  }
];

export const countries = ["US", "UK", "CA", "AU"]