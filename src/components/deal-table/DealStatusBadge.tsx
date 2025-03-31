
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DealStatus } from '@/lib/types';

interface DealStatusBadgeProps {
  status: DealStatus;
}

const DealStatusBadge: React.FC<DealStatusBadgeProps> = ({ status }) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Pass':
        return 'bg-gray-200 text-gray-700';
      case 'Engage':
        return 'bg-blue-100 text-blue-700';
      case 'OnHold':
        return 'bg-yellow-100 text-yellow-700';
      case 'BusinessDD':
        return 'bg-purple-100 text-purple-700';
      case 'TermSheet':
        return 'bg-orange-100 text-orange-700';
      case 'Portfolio':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Badge className={`font-normal ${getStatusBadgeColor(status)}`}>
      {status}
    </Badge>
  );
};

export default DealStatusBadge;
