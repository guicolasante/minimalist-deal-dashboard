
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import DealTable from '@/components/DealTable';
import DealForm from '@/components/DealForm';
import { useToast } from '@/components/ui/use-toast';
import { Deal } from '@/lib/types';
import { MOCK_DEALS } from '@/lib/data';

const Deals = () => {
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-crm-charcoal">Deal Management</h1>
          <p className="text-muted-foreground">View and manage all your business deals</p>
        </div>
        
        <div className="animate-slide-in">
          <DealTable onAddDeal={() => setShowDealForm(true)} />
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

export default Deals;
