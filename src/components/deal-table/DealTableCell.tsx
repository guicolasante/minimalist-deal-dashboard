
import React from 'react';
import { Deal } from '@/lib/types';
import { ColumnDefinition } from '../ColumnSettingsDrawer';
import DealStatusBadge from './DealStatusBadge';
import { Badge } from '@/components/ui/badge';

interface DealTableCellProps {
  deal: Deal;
  column: ColumnDefinition;
}

const DealTableCell: React.FC<DealTableCellProps> = ({ deal, column }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCellValue = () => {
    const value = deal[column.key as keyof Deal];
    
    switch (column.type) {
      case 'currency':
        return typeof value === 'number' ? formatCurrency(value) : value;
      case 'date':
        return typeof value === 'string' 
          ? new Date(value).toLocaleDateString() 
          : value;
      case 'singleSelect':
        // Display status as badge if it's the status field
        if (column.key === 'status' && typeof value === 'string') {
          return <DealStatusBadge status={value as any} />;
        }
        // Display weekDeals as Yes/No badge
        if (column.key === 'weekDeals' && typeof value === 'string') {
          const color = value === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
          return <Badge className={`${color} font-medium`}>{value}</Badge>;
        }
        // For other singleSelect fields just return the value
        return value;
      default:
        return value;
    }
  };

  return formatCellValue();
};

export default DealTableCell;
