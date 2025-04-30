
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import DealTable from '@/components/DealTable';
import DealForm from '@/components/DealForm';
import { useToast } from '@/components/ui/use-toast';
import { Deal } from '@/lib/types';
import { fetchDeals, addDeal, updateDeal, deleteDeal } from '@/services/dealService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const Deals = () => {
  const [showDealForm, setShowDealForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | undefined>(undefined);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch deals from Supabase
  const { data: deals = [], isLoading, error, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: fetchDeals,
    retry: 2,
    retryDelay: 1000,
  });

  // Mutation for adding a new deal
  const addDealMutation = useMutation({
    mutationFn: (newDeal: Omit<Deal, 'id'>) => addDeal(newDeal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: "Deal Added",
        description: "The deal has been added successfully.",
      });
      setShowDealForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add deal: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation for updating a deal
  const updateDealMutation = useMutation({
    mutationFn: updateDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: "Deal Updated",
        description: "The deal has been updated successfully.",
      });
      setShowDealForm(false);
      setEditingDeal(undefined);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update deal: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Mutation for deleting a deal
  const deleteDealMutation = useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: "Deal Deleted",
        description: "The deal has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete deal: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle adding or editing a deal
  const handleSaveDeal = (dealData: Partial<Deal>) => {
    if (editingDeal) {
      // Update existing deal
      updateDealMutation.mutate({
        ...editingDeal,
        ...dealData
      } as Deal);
    } else {
      // Add new deal
      addDealMutation.mutate(dealData as Omit<Deal, 'id'>);
    }
  };

  // Open the form for editing a deal
  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setShowDealForm(true);
  };

  // Handle deleting a deal
  const handleDeleteDeal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      deleteDealMutation.mutate(id);
    }
  };

  // Reset the editing state when closing the form
  const handleFormClose = (open: boolean) => {
    if (!open) {
      setEditingDeal(undefined);
    }
    setShowDealForm(open);
  };

  return (
    <div className="min-h-screen bg-crm-lightGray">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-crm-charcoal">Deal Management</h1>
          <p className="text-muted-foreground">View and manage all your business deals</p>
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
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-[250px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-md" />
          </div>
        ) : (
          <div className="animate-slide-in">
            <DealTable 
              deals={deals} 
              isLoading={isLoading}
              onAddDeal={() => handleFormClose(true)}
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
            />
          </div>
        )}
      </main>
      
      <DealForm
        open={showDealForm}
        onOpenChange={handleFormClose}
        initialDeal={editingDeal}
        onSave={handleSaveDeal}
      />
    </div>
  );
};

export default Deals;
