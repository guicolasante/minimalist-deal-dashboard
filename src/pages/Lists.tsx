
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Deal } from '@/lib/types';
import { ColumnDefinition } from '@/components/ColumnSettingsDrawer';
import { defaultColumns } from '@/components/lists/defaultColumns';
import { FilterState, FilterValue } from '@/components/lists/types';
import FilterControls from '@/components/lists/FilterControls';
import DealsList from '@/components/lists/DealsList';
import ActionButtons from '@/components/lists/ActionButtons';
import { fetchDeals } from '@/services/dealService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const Lists = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [columns, setColumns] = useState<ColumnDefinition[]>(() => {
    const savedColumns = localStorage.getItem('dealListColumns');
    return savedColumns ? JSON.parse(savedColumns) : defaultColumns;
  });
  const [showFiltersPopover, setShowFiltersPopover] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Fetch deals data using the service
  const { data: deals, isLoading, error, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: fetchDeals,
    retry: 2,
    retryDelay: 1000,
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
      
      // Keep the filter in the active filters list but with no value
      // This way the user can still see and interact with the filter
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

  // Filter deals based on all active filters
  const filteredDeals = useMemo(() => {
    if (!deals) return [];
    
    return deals.filter(deal => {
      for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === '') continue;
        
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
        // For single-select values, exactly match the selected value
        else if (typeof value === 'string' && value !== 'all') {
          // Fix: We need to explicitly check the deal property against the filter value
          const dealValue = deal[key as keyof Deal];
          if (dealValue !== value) {
            return false;
          }
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
          <ActionButtons 
            columns={columns}
            showFiltersPopover={showFiltersPopover}
            setShowFiltersPopover={setShowFiltersPopover}
            availableFilterColumns={availableFilterColumns}
            handleAddFilter={handleAddFilter}
            handleColumnsChange={handleColumnsChange}
            handleCreateNewList={handleCreateNewList}
          />
        </div>
        
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <p>Failed to load deals. Please try again later.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-fit" 
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <FilterControls 
              activeFilters={activeFilters}
              filters={filters}
              columns={columns}
              deals={deals}
              handleFilterChange={handleFilterChange}
              handleRemoveFilter={handleRemoveFilter}
            />
            
            <DealsList 
              isLoading={isLoading}
              filteredDeals={filteredDeals}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Lists;
