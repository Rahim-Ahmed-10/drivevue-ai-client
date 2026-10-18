import { Car } from './car';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface Booking {
  _id: string;
  id?: string;
  user: string | { _id: string; name?: string; email?: string };
  car: Car;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt?: string;
  updatedAt?: string;
}
