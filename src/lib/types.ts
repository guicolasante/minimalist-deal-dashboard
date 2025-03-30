
export type DealStatus = 'Pass' | 'Engage' | 'OnHold' | 'BusinessDD' | 'TermSheet' | 'Portfolio';

export interface Deal {
  id: string;
  name: string;
  company: string;
  status: DealStatus;
  amount: number;
  stage: string;
  assignedTo: string;
  dateReceived: string;
  dateUpdated: string;
  description: string;
  contactName: string;
  contactEmail: string;
  notes: string;
}

export interface StatusCount {
  status: DealStatus;
  count: number;
  color: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}
