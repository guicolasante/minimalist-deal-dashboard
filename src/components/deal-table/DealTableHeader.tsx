
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, PlusCircle, Settings } from 'lucide-react';
import ColumnSettingsDrawer, { ColumnDefinition } from '../ColumnSettingsDrawer';

interface DealTableHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddDeal: () => void;
  columns: ColumnDefinition[];
  onColumnsChange: (columns: ColumnDefinition[]) => void;
}

const DealTableHeader: React.FC<DealTableHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onAddDeal,
  columns,
  onColumnsChange
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold text-crm-charcoal">Active Deals</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search deals..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto justify-between">
            <ColumnSettingsDrawer columns={columns} onColumnsChange={onColumnsChange}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings className="h-4 w-4 text-gray-500" />
                <span>Settings</span>
              </Button>
            </ColumnSettingsDrawer>

            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4 text-gray-500" />
              <span>Filter</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4 text-gray-500" />
              <span>Export</span>
            </Button>
            
            <Button size="sm" className="flex items-center gap-1" onClick={onAddDeal}>
              <PlusCircle className="h-4 w-4" />
              <span>New Deal</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealTableHeader;
