
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import DealTable from '@/components/DealTable';
import DealForm from '@/components/DealForm';
import MetricCard from '@/components/MetricCard';
import StatusCard from '@/components/StatusCard';
import { useToast } from '@/components/ui/use-toast';
import { Deal } from '@/lib/types';
import {
  getActiveDealsCount,
  getDealsClosedThisMonth,
  getStatusCounts,
  getTotalDealValue,
  getUpcomingDeadlines,
  MOCK_DEALS
} from '@/lib/data';
import { 
  ArrowDown, 
  ArrowRightLeft, 
  Calendar,
  CircleDollarSign, 
  Layers, 
  LucideIcon,
  ClipboardList,
  Clock,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [showDealForm, setShowDealForm] = useState(false);
  const { toast } = useToast();

  const handleAddDeal = (newDeal: Partial<Deal>) => {
    const dealToAdd = {
      ...newDeal,
      id: (deals.length + 1).toString(),
    } as Deal;
    
    setDeals([dealToAdd, ...deals]);
    
    toast({
      title: "Deal Added",
      description: `${newDeal.name} has been added successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-crm-lightGray">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-crm-charcoal">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin User</p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" className="shadow-sm">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Last 30 Days</span>
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
            
            <Button className="shadow-sm" onClick={() => setShowDealForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>New Deal</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-in">
          <MetricCard
            title="Total Active Deals"
            value={getActiveDealsCount()}
            trend={{ value: 12, isPositive: true }}
            icon={<Layers className="h-5 w-5" />}
          />
          
          <MetricCard
            title="Total Deal Value"
            value={`$${(getTotalDealValue() / 1000000).toFixed(1)}M`}
            trend={{ value: 8, isPositive: true }}
            icon={<CircleDollarSign className="h-5 w-5" />}
          />
          
          <MetricCard
            title="Deals Closed This Month"
            value={getDealsClosedThisMonth()}
            trend={{ value: 5, isPositive: false }}
            icon={<ArrowRightLeft className="h-5 w-5" />}
          />
          
          <StatusCard data={getStatusCounts()} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <DealTable onAddDeal={() => setShowDealForm(true)} />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Upcoming Deadlines</CardTitle>
                <CardDescription>Deals requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getUpcomingDeadlines().map((deal) => (
                    <div key={deal.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                      <div className="mt-1">
                        <Clock className="h-5 w-5 text-crm-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{deal.name}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{deal.company}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-normal rounded-sm">
                            {deal.status}
                          </Badge>
                          <span className="text-xs font-medium text-muted-foreground">
                            {new Date(deal.dateUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Recent Activity</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <ClipboardList className="h-4 w-4 text-crm-blue" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">John Doe</span> 
                        <span className="text-muted-foreground"> updated </span>
                        <span className="font-medium">Series A Investment</span>
                      </p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <PlusCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Jane Smith</span> 
                        <span className="text-muted-foreground"> added </span>
                        <span className="font-medium">Seed Extension</span>
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <ArrowRightLeft className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Admin User</span> 
                        <span className="text-muted-foreground"> changed status of </span>
                        <span className="font-medium">Acquisition Deal</span>
                      </p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <DealForm
        open={showDealForm}
        onOpenChange={setShowDealForm}
        onSave={handleAddDeal}
      />
    </div>
  );
};

export default Index;
