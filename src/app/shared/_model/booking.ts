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
}