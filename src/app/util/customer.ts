import { User } from "./user";

export interface Customer extends User {
    isVip: boolean;
    discountRate: number;
    purchaseRate: number;
}