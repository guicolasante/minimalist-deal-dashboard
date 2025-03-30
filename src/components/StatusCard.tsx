
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusCount } from '@/lib/types';

interface StatusCardProps {
  data: StatusCount[];
}

const StatusCard: React.FC<StatusCardProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Deal Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center h-2 bg-gray-100 rounded-full overflow-hidden">
            {data.map((status, index) => (
              <div
                key={index}
                className="h-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${(status.count / total) * 100}%`,
                  backgroundColor: status.color,
                }}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.map((status, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <div className="text-xs">
                  <span className="font-medium">{status.status}</span>
                  <span className="text-muted-foreground ml-1">({status.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
