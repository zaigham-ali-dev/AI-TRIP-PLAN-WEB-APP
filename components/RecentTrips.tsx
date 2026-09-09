export interface TripItem {
  id?: string;
  title: string;
  destination?: string;
  dates?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  durationDays?: number;
  amount?: string;
  totalSpent?: number;
  budget?: number;
  progress?: number;
  image?: string;
}
