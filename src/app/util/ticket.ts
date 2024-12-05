export interface Ticket {
  id: string;
  ticketNumber?: string;
  eventId: string;
  customerId?: string;
  vendorId: string;
  price: number;
  available: boolean;
  purchasedDate?: string;
}
