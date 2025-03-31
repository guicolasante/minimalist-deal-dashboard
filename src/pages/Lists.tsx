
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
import { Deal } from '@/lib/types';

// Define FilterState interface
export interface FilterState {
  status: string | null;
  assignedTo: string | null;
  minAmount: number | null;
  stage: string | null;
  sector: string | null;
  weekDeals: string | null;
}

const Lists = () => {
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    assignedTo: null,
    minAmount: null,
    stage: null,
    sector: null,
    weekDeals: null
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Deal Lists</h1>
        
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
