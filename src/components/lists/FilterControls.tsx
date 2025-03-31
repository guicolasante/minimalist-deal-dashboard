
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';
import { ColumnDefinition } from '@/components/ColumnSettingsDrawer';
import { FilterState } from './types';
import { Deal } from '@/lib/types';

interface FilterControlsProps {
  activeFilters: string[];
  filters: FilterState;
  columns: ColumnDefinition[];
  deals: Deal[] | undefined;
  handleFilterChange: (key: string, value: any) => void;
  handleRemoveFilter: (key: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  activeFilters,
  filters,
  columns,
  deals,
  handleFilterChange,
  handleRemoveFilter,
}) => {
  // Get unique values for a specific column from the deals data
  const getUniqueValues = (key: keyof Deal) => {
    if (!deals) return [];
    
    const values = deals.map(deal => deal[key]);
    return [...new Set(values)].filter(Boolean);
  };

  // Generate the appropriate filter input based on column type
  const renderFilterInput = (column: ColumnDefinition) => {
    switch(column.type) {
      case 'singleSelect':
        return (
          <Select 
            onValueChange={(value) => handleFilterChange(column.key, value)}
            value={filters[column.key] || "all"}
          >
            <SelectTrigger>
              <SelectValue placeholder={`All ${column.name}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {column.name}s</SelectItem>
              {getUniqueValues(column.key as keyof Deal).map((value) => (
                <SelectItem key={value as string} value={value as string}>
                  {value as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'currency':
        return (
          <Input
            type="number"
            placeholder={`Min ${column.name}`}
            value={filters[column.key] || ''}
            onChange={(e) => handleFilterChange(column.key, e.target.value ? Number(e.target.value) : '')}
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={filters[column.key] || ''}
            onChange={(e) => handleFilterChange(column.key, e.target.value)}
          />
        );
      
      case 'text':
      default:
        return (
          <Input
            type="text"
            placeholder={`Search ${column.name}`}
            value={filters[column.key] || ''}
            onChange={(e) => handleFilterChange(column.key, e.target.value)}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeFilters.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No filters selected</p>
            <p className="text-xs text-gray-400 mt-1">Click the Filter button to add filters</p>
          </div>
        ) : (
          activeFilters.map(filterKey => {
            const column = columns.find(col => col.key === filterKey);
            if (!column) return null;
            
            return (
              <div key={column.key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium">{column.name}</label>
                  <button 
                    className="text-gray-400 hover:text-gray-600" 
                    onClick={() => handleRemoveFilter(column.key)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                {renderFilterInput(column)}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default FilterControls;
