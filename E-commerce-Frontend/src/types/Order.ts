export interface Order {
  orderID: number;
  address: string;
  paymentMethod: string;
  productListSize: number;
  status: string;
  totalAmount: number;
  _id: string;
  createdAt: string;
}

export interface AdminOrder {
  orderID: number;
  address: string;
  paymentMethod: string;
  productListSize: number;
  status: string;
  totalAmount: number;
  riderID: string;
  riderName: string;
  riderPhoneNumber: string;
  userID: {
    _id: string;
    name: string;
  }
  _id: string;
  createdAt: string;
}

export interface RiderOrder {
  orderID: number;
  address: string;
  paymentMethod: string;
  productListSize: number;
  status: string;
  totalAmount: number;
  userID: {
    _id: string;
    name: string;
  }
  _id: string;
  createdAt: string;
}