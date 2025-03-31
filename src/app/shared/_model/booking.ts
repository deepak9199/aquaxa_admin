import { Ticket } from './ticket_model';

export interface BookingForm {
  name: string;
  address: string;
  phone: string;
  numberOfAdultsChildren: number;
  rate: number;
  totalAmount: number;
  coupons: string[];
  sendToWhatsapp: boolean;
  email: string;
  specialdate: string;
  ticket: Ticket;
  iscash: 0 | 1;
}

export interface CouponRequest {
  intval: number;
  refno: string;
  item_code: number;
  id: number;
  phone: string;
  agent: number;
  iscash: 0 | 1;
}

export interface BookingList {
  id: number;
  phoneno: string;
  customer_name: string;
  item_name: string;
  issue_date: string;
  coupon_no: string[];
}
