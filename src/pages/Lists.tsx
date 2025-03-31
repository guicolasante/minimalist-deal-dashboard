import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Deal } from '@/lib/types';
import { ColumnDefinition } from '@/components/ColumnSettingsDrawer';
import { defaultColumns } from '@/components/lists/defaultColumns';
import { FilterState } from '@/components/lists/types';
import FilterControls from '@/components/lists/FilterControls';
import DealsList from '@/components/lists/DealsList';
import ActionButtons from '@/components/lists/ActionButtons';

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
        else if (value !== 'all' && deal[key as keyof Deal] !== value) {
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
      </div>
    </div>
  );
};

export default Lists;
