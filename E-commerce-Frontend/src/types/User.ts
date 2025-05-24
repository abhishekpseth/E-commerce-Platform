export interface Address {
  _id?: string;
  name: string;
  mobileNumber: string;
  pinCode: string;
  address: string;
  locality: string;
  district: string;
  state: string;
  addressTag: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}