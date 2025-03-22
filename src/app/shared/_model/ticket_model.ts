export interface Ticket {
    id: number;
    item_name: string;
    item_type: 'PRODUCT' | 'PACKAGE';
    gst: number;
    user_code: string;
    rate: number;
    mrp: string;
    expiry_days: number;
    staff_margin: number;
    group_code: number;
    is_web_display: boolean;
    image1: string;
    coupons: number;
}
