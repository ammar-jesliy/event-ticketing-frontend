import { User } from "./user";

export interface Customer extends User {
    vipPoints?: number;
    discountRate?: number;
    purchaseRate?: number;
}