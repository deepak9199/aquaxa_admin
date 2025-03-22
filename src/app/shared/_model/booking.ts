import { Ticket } from "./ticket_model";

export interface BookingForm {
  name: string;
  address: string;
  phone: string;
  numberOfAdultsChildren: number;
  rate: number
  totalAmount: number;
  coupons: string[];
  sendToWhatsapp: boolean;
  email: string
  specialdate: string
  ticket: Ticket
  
}

export interface CouponRequest {
  intval: number;
  refno: string;
  item_code: number;
  id: number;
  phone: string;
  agent: number;
}