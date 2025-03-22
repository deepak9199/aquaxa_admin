export interface BookingForm {
    name: string;
    address: string;
    phone: number;
    numberOfAdultsChildren: number;
    rate:number
    totalAmount: number;
    bookingDate: string; // Use string for easier binding with date inputs
    coupons: string[];
    sendToWhatsapp: boolean;
  }