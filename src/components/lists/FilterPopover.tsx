
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ColumnDefinition } from '@/components/ColumnSettingsDrawer';

interface FilterPopoverProps {
  showFiltersPopover: boolean;
  setShowFiltersPopover: (show: boolean) => void;
  availableFilterColumns: ColumnDefinition[];
  handleAddFilter: (key: string) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  showFiltersPopover,
  setShowFiltersPopover,
  availableFilterColumns,
  handleAddFilter,
}) => {
  return (
    <Popover open={showFiltersPopover} onOpenChange={setShowFiltersPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-4 w-4 text-gray-500" />
          <span>Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="space-y-4">
          <h3 className="font-medium">Add Filter</h3>
          <div className="max-h-60 overflow-y-auto">
            {availableFilterColumns.length > 0 ? (
              availableFilterColumns.map(column => (
                <button
                  key={column.id}
                  className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded"
                  onClick={() => handleAddFilter(column.key)}
                >
                  {column.name}
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500">All filters already added</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
