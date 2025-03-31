
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Deal } from '@/lib/types';
import { Filter, Download, PlusCircle, Settings, Search, X } from 'lucide-react';
import ColumnSettingsDrawer, { ColumnDefinition } from '@/components/ColumnSettingsDrawer';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';

// Define FilterState interface - now it's dynamic to handle any column
export interface FilterState {
  [key: string]: any;
}

const defaultColumns: ColumnDefinition[] = [
  { id: '1', name: 'Deal Name', key: 'name', type: 'text', required: true, visible: true, order: 0 },
  { id: '2', name: 'Company', key: 'company', type: 'text', required: true, visible: true, order: 1 },
  { id: '3', name: 'Status', key: 'status', type: 'singleSelect', options: ['Pass', 'Engage', 'OnHold', 'BusinessDD', 'TermSheet', 'Portfolio'], required: true, visible: true, order: 2 },
  { id: '4', name: 'Amount', key: 'amount', type: 'currency', required: true, visible: true, order: 3 },
  { id: '5', name: 'Assigned To', key: 'assignedTo', type: 'text', required: true, visible: true, order: 4 },
  { id: '6', name: 'Date Received', key: 'dateReceived', type: 'date', required: true, visible: true, order: 5 },
  { id: '7', name: 'Week Deals', key: 'weekDeals', type: 'singleSelect', options: ['Yes', 'No'], required: false, visible: true, order: 6 },
  { id: '8', name: 'Sector', key: 'sector', type: 'singleSelect', options: ['Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Real Estate', 'Manufacturing', 'Other'], required: false, visible: true, order: 7 },
];

const Lists = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [columns, setColumns] = useState<ColumnDefinition[]>(() => {
    const savedColumns = localStorage.getItem('dealListColumns');
    return savedColumns ? JSON.parse(savedColumns) : defaultColumns;
  });
  const [showFiltersPopover, setShowFiltersPopover] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Fetch deals data
  const { data: deals, isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const response = await fetch('https://ckcigwfkptzlxiwfhlqr.supabase.co/rest/v1/deals?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrY2lnd2ZrcHR6bHhpd2ZobHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzODMxNDEsImV4cCI6MjA1ODk1OTE0MX0.5NAkagO77hmUEn9pvXR4qQhuka3HR9Vl6ItahF2dCj8',
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrY2lnd2ZrcHR6bHhpd2ZobHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzODMxNDEsImV4cCI6MjA1ODk1OTE0MX0.5NAkagO77hmUEn9pvXR4qQhuka3HR9Vl6ItahF2dCj8'
        }
      });
      return await response.json() as Deal[];
    }
  });

  const handleColumnsChange = (newColumns: ColumnDefinition[]) => {
    setColumns(newColumns);
    localStorage.setItem('dealListColumns', JSON.stringify(newColumns));
  };

  const handleFilterChange = (key: string, value: any) => {
    // If value is "all" or empty, remove the filter
    if (value === 'all' || value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
      
      // Remove from active filters list
      setActiveFilters(prev => prev.filter(filter => filter !== key));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Add to active filters if not already there
      if (!activeFilters.includes(key)) {
        setActiveFilters(prev => [...prev, key]);
      }
    }
  };

  const handleAddFilter = (key: string) => {
    if (!activeFilters.includes(key)) {
      setActiveFilters(prev => [...prev, key]);
    }
    setShowFiltersPopover(false);
  };

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    setActiveFilters(prev => prev.filter(filter => filter !== key));
  };

  // Get unique values for a specific column from the deals data
  const getUniqueValues = (key: keyof Deal) => {
    if (!deals) return [];
    
    const values = deals.map(deal => deal[key]);
    return [...new Set(values)].filter(Boolean);
  };

  // Filter deals based on all active filters
  const filteredDeals = useMemo(() => {
    if (!deals) return [];
    
    return deals.filter(deal => {
      for (const [key, value] of Object.entries(filters)) {
        // For number filters (like amount), handle ranges
        if (key === 'amount' && typeof value === 'number') {
          if (deal.amount < value) return false;
        } 
        // For dates, handle special comparison
        else if (key === 'dateReceived' && value) {
          const dealDate = new Date(deal.dateReceived);
          const filterDate = new Date(value);
          if (dealDate < filterDate) return false;
        }
        // For text and select fields, do exact match
        else if (deal[key as keyof Deal] !== value) {
          return false;
        }
      }
      return true;
    });
  }, [deals, filters]);

  // Available filter columns (exclude columns already being filtered)
  const availableFilterColumns = useMemo(() => {
    return columns
      .filter(col => col.visible && !activeFilters.includes(col.key))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [columns, activeFilters]);

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

  // Handle new list creation
  const handleCreateNewList = () => {
    console.log('Create new list');
    // Implementation for creating a new list would go here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Deal Lists</h1>
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
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4 text-gray-500" />
              <span>Export</span>
            </Button>
            <Button size="sm" className="flex items-center gap-1" onClick={handleCreateNewList}>
              <PlusCircle className="h-4 w-4" />
              <span>New List</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Saved Lists</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading lists...</p>
              ) : filteredDeals && filteredDeals.length > 0 ? (
                <div className="space-y-4">
                  <p>Found {filteredDeals.length} deals matching your filters</p>
                  <div className="border rounded-md divide-y">
                    {filteredDeals.slice(0, 5).map((deal) => (
                      <div key={deal.id} className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{deal.name}</h3>
                          <p className="text-sm text-gray-500">{deal.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${deal.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{deal.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No deals found matching your filters</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Lists;
