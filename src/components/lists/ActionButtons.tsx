
import React from 'react';
import { Download, PlusCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ColumnSettingsDrawer, { ColumnDefinition } from '@/components/ColumnSettingsDrawer';
import FilterPopover from './FilterPopover';

interface ActionButtonsProps {
  columns: ColumnDefinition[];
  showFiltersPopover: boolean;
  setShowFiltersPopover: (show: boolean) => void;
  availableFilterColumns: ColumnDefinition[];
  handleAddFilter: (key: string) => void;
  handleColumnsChange: (newColumns: ColumnDefinition[]) => void;
  handleCreateNewList: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  columns,
  showFiltersPopover,
  setShowFiltersPopover,
  availableFilterColumns,
  handleAddFilter,
  handleColumnsChange,
  handleCreateNewList,
}) => {
  return (
    <div className="flex gap-2">
      <ColumnSettingsDrawer 
        columns={columns}
        onColumnsChange={handleColumnsChange}
      >
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4 text-gray-500" />
          <span>Settings</span>
        </Button>
      </ColumnSettingsDrawer>
      
      <FilterPopover 
        showFiltersPopover={showFiltersPopover}
        setShowFiltersPopover={setShowFiltersPopover}
        availableFilterColumns={availableFilterColumns}
        handleAddFilter={handleAddFilter}
      />
      
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Download className="h-4 w-4 text-gray-500" />
        <span>Export</span>
      </Button>
      
      <Button size="sm" className="flex items-center gap-1" onClick={handleCreateNewList}>
        <PlusCircle className="h-4 w-4" />
        <span>New List</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
