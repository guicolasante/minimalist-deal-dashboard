
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface DealTableFooterProps {
  filteredCount: number;
  totalCount: number;
}

const DealTableFooter: React.FC<DealTableFooterProps> = ({
  filteredCount,
  totalCount
}) => {
  return (
    <div className="p-4 border-t flex justify-between items-center text-sm text-muted-foreground">
      <div>Showing {filteredCount} of {totalCount} deals</div>
      <div className="flex items-center gap-1">
        <span>Show:</span>
        <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1">
          <span>10 per page</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DealTableFooter;
