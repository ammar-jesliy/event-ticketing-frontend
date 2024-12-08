export interface Transaction{
    id: string;
    timeStamp: string;
    ticketIds: string[];
    customerId?: string;
    vendorId?: string;
    eventId: string;
    quantity: number;
    pricePerTicket: number;
    totalAmount: number;
    transactionType: string;
}