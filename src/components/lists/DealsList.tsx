
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Deal } from '@/lib/types';

interface DealsListProps {
  isLoading: boolean;
  filteredDeals: Deal[];
}

const DealsList: React.FC<DealsListProps> = ({
  isLoading,
  filteredDeals,
}) => {
  return (
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
  );
};

export default DealsList;
