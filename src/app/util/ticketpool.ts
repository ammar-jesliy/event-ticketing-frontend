import { Ticket } from "./ticket";

export interface Ticketpool {
    id: string;
    eventId: string;
    maxTicketCapacity: number;
    totalTickets: number;
    ticketSold: number;
    availableTickets: number;
    tickets: Ticket[];
}