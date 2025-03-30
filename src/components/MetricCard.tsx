
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { MetricCardProps } from '@/lib/types';

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  trend,
  icon
}) => {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-crm-charcoal mb-1">{value}</h3>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            
            {trend && (
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium flex items-center gap-1 ${
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trend.isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {trend.value}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs last month</span>
              </div>
            )}
          </div>
          
          <div className="rounded-full p-2 bg-crm-lightGray text-crm-blue">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
