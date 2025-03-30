
import { Deal, DealStatus, StatusCount, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

export const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    name: 'Series A Investment',
    company: 'Tech Innovators Inc.',
    status: 'Engage',
    amount: 500000,
    stage: 'Initial Meeting',
    assignedTo: 'John Doe',
    dateReceived: '2023-10-15',
    dateUpdated: '2023-10-20',
    description: 'Potential investment in AI-driven analytics platform',
    contactName: 'Mike Johnson',
    contactEmail: 'mike@techinnovators.com',
    notes: 'CEO has strong background in machine learning',
  },
  {
    id: '2',
    name: 'Seed Round',
    company: 'Green Energy Solutions',
    status: 'BusinessDD',
    amount: 250000,
    stage: 'Due Diligence',
    assignedTo: 'Jane Smith',
    dateReceived: '2023-09-22',
    dateUpdated: '2023-10-18',
    description: 'Renewable energy storage solution with patented technology',
    contactName: 'Sarah Chen',
    contactEmail: 'sarah@greenenergy.com',
    notes: 'Impressive traction in European markets',
  },
  {
    id: '3',
    name: 'Series B Expansion',
    company: 'HealthTech Global',
    status: 'TermSheet',
    amount: 2000000,
    stage: 'Term Sheet Issued',
    assignedTo: 'John Doe',
    dateReceived: '2023-08-10',
    dateUpdated: '2023-10-05',
    description: 'Expansion of telemedicine platform to Asian markets',
    contactName: 'Dr. Robert Kim',
    contactEmail: 'robert@healthtechglobal.com',
    notes: 'Strong revenue growth in the past two quarters',
  },
  {
    id: '4',
    name: 'Acquisition Deal',
    company: 'LogiTech Systems',
    status: 'OnHold',
    amount: 5000000,
    stage: 'Negotiation',
    assignedTo: 'Jane Smith',
    dateReceived: '2023-07-05',
    dateUpdated: '2023-09-30',
    description: 'Potential acquisition of supply chain management software provider',
    contactName: 'David Miller',
    contactEmail: 'david@logitech.com',
    notes: 'Currently on hold pending market analysis',
  },
  {
    id: '5',
    name: 'Seed Investment',
    company: 'FinTech Disruptors',
    status: 'Pass',
    amount: 150000,
    stage: 'Initial Screening',
    assignedTo: 'John Doe',
    dateReceived: '2023-10-01',
    dateUpdated: '2023-10-10',
    description: 'Blockchain-based payment processing platform',
    contactName: 'Alex Rivera',
    contactEmail: 'alex@fintechdisruptors.com',
    notes: 'Passed due to regulatory concerns in target markets',
  },
  {
    id: '6',
    name: 'Series A Round',
    company: 'Urban Mobility Co.',
    status: 'Portfolio',
    amount: 1200000,
    stage: 'Closed',
    assignedTo: 'Jane Smith',
    dateReceived: '2023-05-20',
    dateUpdated: '2023-08-15',
    description: 'Electric scooter sharing service for urban centers',
    contactName: 'Lisa Wong',
    contactEmail: 'lisa@urbanmobility.com',
    notes: 'Performing above expectations in first markets',
  },
  {
    id: '7',
    name: 'Seed Extension',
    company: 'EdTech Pioneers',
    status: 'Engage',
    amount: 300000,
    stage: 'Follow-up Meeting',
    assignedTo: 'John Doe',
    dateReceived: '2023-09-15',
    dateUpdated: '2023-10-15',
    description: 'AI-powered personalized learning platform',
    contactName: 'James Taylor',
    contactEmail: 'james@edtechpioneers.com',
    notes: 'Strong team with previous exits in education space',
  },
];

export const getStatusCounts = (): StatusCount[] => {
  const statusMap: Record<DealStatus, { count: number; color: string }> = {
    Pass: { count: 0, color: '#8A898C' }, // Gray
    Engage: { count: 0, color: '#33C3F0' }, // Light Blue
    OnHold: { count: 0, color: '#403E43' }, // Dark Gray
    BusinessDD: { count: 0, color: '#1EAEDB' }, // Blue
    TermSheet: { count: 0, color: '#0FA0CE' }, // Darker Blue
    Portfolio: { count: 0, color: '#222222' }, // Charcoal
  };

  MOCK_DEALS.forEach((deal) => {
    if (deal.status in statusMap) {
      statusMap[deal.status].count++;
    }
  });

  return Object.entries(statusMap).map(([status, { count, color }]) => ({
    status: status as DealStatus,
    count,
    color,
  }));
};

export const getTotalDealValue = (): number => {
  return MOCK_DEALS.reduce((sum, deal) => sum + deal.amount, 0);
};

export const getActiveDealsCount = (): number => {
  return MOCK_DEALS.filter(
    (deal) => !['Pass', 'Portfolio'].includes(deal.status)
  ).length;
};

export const getDealsClosedThisMonth = (): number => {
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  
  return MOCK_DEALS.filter(deal => {
    const dealDate = new Date(deal.dateUpdated);
    return dealDate.getMonth() === thisMonth && 
           dealDate.getFullYear() === thisYear && 
           deal.status === 'Portfolio';
  }).length;
};

export const getUpcomingDeadlines = (): Deal[] => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  return MOCK_DEALS.filter(deal => {
    if (deal.status === 'Pass' || deal.status === 'Portfolio') return false;
    
    const dealDate = new Date(deal.dateUpdated);
    return dealDate >= today && dealDate <= nextWeek;
  }).slice(0, 3); // Get only 3 upcoming deadlines
};
