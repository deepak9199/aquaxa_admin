export interface saveCustomer {
    cname: string;
    addr: string;
    phone: string;
    dob: string;
    email: string;
}

export interface findCustomer {
    id: number;
    cname: string;
    addr: string;
    phone: string;
    ttype: string;
    dob: string;
    email: string;
}

export interface ClientDetail {
    acname: string;
    type: string;
    address: string;
    dob: string; // Consider using Date type if it's always a date
    doa: string | null;
    loyalty: number;
    id: number;
    gender: string;
    religion: string | null;
    remarks: string | null;
    subtype: string | null;
    phone: string;
    agent: string | null;
    email: string;
    identity_type: string | null;
    identity_no: string | null;
    nation: string | null;
    business_id: number;
    isfound: boolean;
    cdp: number;
    expiry_date: string | null;
}
