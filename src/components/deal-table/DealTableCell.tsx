
import React from 'react';
import { Deal } from '@/lib/types';
import { ColumnDefinition } from '../ColumnSettingsDrawer';
import DealStatusBadge from './DealStatusBadge';

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
        return typeof value === 'string' ? (
          <DealStatusBadge status={value as any} />
        ) : value;
      default:
        return value;
    }
  };

  return formatCellValue();
};

export default DealTableCell;
