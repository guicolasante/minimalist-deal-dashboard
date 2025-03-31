
import { ColumnDefinition } from '@/components/ColumnSettingsDrawer';

export const defaultColumns: ColumnDefinition[] = [
  { id: '1', name: 'Deal Name', key: 'name', type: 'text', required: true, visible: true, order: 0 },
  { id: '2', name: 'Company', key: 'company', type: 'text', required: true, visible: true, order: 1 },
  { id: '3', name: 'Status', key: 'status', type: 'singleSelect', options: ['Pass', 'Engage', 'OnHold', 'BusinessDD', 'TermSheet', 'Portfolio'], required: true, visible: true, order: 2 },
  { id: '4', name: 'Amount', key: 'amount', type: 'currency', required: true, visible: true, order: 3 },
  { id: '5', name: 'Assigned To', key: 'assignedTo', type: 'text', required: true, visible: true, order: 4 },
  { id: '6', name: 'Date Received', key: 'dateReceived', type: 'date', required: true, visible: true, order: 5 },
  { id: '7', name: 'Week Deals', key: 'weekDeals', type: 'singleSelect', options: ['Yes', 'No'], required: false, visible: true, order: 6 },
  { id: '8', name: 'Sector', key: 'sector', type: 'singleSelect', options: ['Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Real Estate', 'Manufacturing', 'Other'], required: false, visible: true, order: 7 },
];
