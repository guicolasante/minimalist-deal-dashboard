
import React, { useState } from 'react';
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
import { Filter, Download, PlusCircle, Settings } from 'lucide-react';
import ColumnSettingsDrawer, { ColumnDefinition } from '@/components/ColumnSettingsDrawer';

// Define FilterState interface
export interface FilterState {
  status: string | null;
  assignedTo: string | null;
  minAmount: number | null;
  stage: string | null;
  sector: string | null;
  weekDeals: string | null;
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
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    assignedTo: null,
    minAmount: null,
    stage: null,
    sector: null,
    weekDeals: null
  });
  const [columns, setColumns] = useState<ColumnDefinition[]>(() => {
    const savedColumns = localStorage.getItem('dealListColumns');
    return savedColumns ? JSON.parse(savedColumns) : defaultColumns;
  });

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

  const handleFilterChange = (name: keyof FilterState, value: string | number | null) => {
    // If value is "all", set it to null to clear the filter
    const finalValue = value === 'all' ? null : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  // Get unique values for filters
  const getUniqueValues = (key: keyof Deal) => {
    if (!deals) return [];
    
    const values = deals.map(deal => deal[key]);
    return [...new Set(values)].filter(Boolean);
  };

  // Filter deals
  const filteredDeals = deals?.filter(deal => {
    if (filters.status && deal.status !== filters.status) return false;
    if (filters.assignedTo && deal.assignedTo !== filters.assignedTo) return false;
    if (filters.minAmount && deal.amount < filters.minAmount) return false;
    if (filters.stage && deal.stage !== filters.stage) return false;
    if (filters.sector && deal.sector !== filters.sector) return false;
    if (filters.weekDeals && deal.weekDeals !== filters.weekDeals) return false;
    return true;
  });

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
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4 text-gray-500" />
              <span>Filter</span>
            </Button>
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
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select 
                  onValueChange={(value) => handleFilterChange('status', value)}
                  value={filters.status || "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {getUniqueValues('status').map((status) => (
                      <SelectItem key={status as string} value={status as string}>
                        {status as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Assigned To</label>
                <Select 
                  onValueChange={(value) => handleFilterChange('assignedTo', value)}
                  value={filters.assignedTo || "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {getUniqueValues('assignedTo').map((user) => (
                      <SelectItem key={user as string} value={user as string}>
                        {user as string}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Min Amount</label>
                <Input
                  type="number"
                  placeholder="0"
                  onChange={(e) => handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : null)}
                />
              </div>
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
