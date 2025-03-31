
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterState {
  status: string | null;
  assignedTo: string | null;
  minAmount: number | null;
  stage: string | null;
  searchTerm?: string;
}

interface DealListSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: FilterState;
  onSaveList: (name: string, filters: FilterState) => void;
}

const DealListSaveDialog: React.FC<DealListSaveDialogProps> = ({
  open,
  onOpenChange,
  currentFilters,
  onSaveList
}) => {
  const [listName, setListName] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<keyof FilterState, boolean>>({
    searchTerm: !!currentFilters.searchTerm,
    status: !!currentFilters.status,
    assignedTo: !!currentFilters.assignedTo,
    minAmount: !!currentFilters.minAmount,
    stage: !!currentFilters.stage
  });
  const { toast } = useToast();

  // Reset filter states when dialog opens or currentFilters change
  useEffect(() => {
    if (open) {
      setSelectedFilters({
        searchTerm: !!currentFilters.searchTerm,
        status: !!currentFilters.status,
        assignedTo: !!currentFilters.assignedTo,
        minAmount: !!currentFilters.minAmount,
        stage: !!currentFilters.stage
      });
    }
  }, [open, currentFilters]);

  const handleFilterToggle = (filterKey: keyof FilterState) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const handleSave = () => {
    if (!listName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your list",
        variant: "destructive"
      });
      return;
    }

    // Create filtered version of currentFilters based on selected checkboxes
    const filteredFilters = Object.keys(selectedFilters).reduce((acc, key) => {
      const filterKey = key as keyof FilterState;
      return {
        ...acc,
        [filterKey]: selectedFilters[filterKey] ? currentFilters[filterKey] : null
      };
    }, {} as FilterState);

    onSaveList(listName, filteredFilters);
    setListName('');
    setSelectedFilters({
      searchTerm: false,
      status: false,
      assignedTo: false,
      minAmount: false,
      stage: false
    });
    onOpenChange(false);
    
    toast({
      title: "List saved",
      description: `Your list "${listName}" has been saved successfully.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Custom List</DialogTitle>
          <DialogDescription>
            Create a new list with selected filters and search criteria.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="listName" className="text-sm font-medium">
                List Name
              </label>
              <Input
                id="listName"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Enter a name for your list"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Select Filters to Include</p>
              <div className="rounded-md bg-gray-50 p-3 space-y-3">
                {/* Render filter options even when no active filters */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-search"
                    checked={selectedFilters.searchTerm}
                    onCheckedChange={() => handleFilterToggle('searchTerm')}
                    disabled={!currentFilters.searchTerm}
                  />
                  <label htmlFor="filter-search" className={`text-sm cursor-pointer flex-1 ${!currentFilters.searchTerm ? 'text-muted-foreground opacity-70' : ''}`}>
                    <span className="text-muted-foreground">Search:</span>{' '}
                    <span className="font-medium text-foreground">{currentFilters.searchTerm || 'Not set'}</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-status"
                    checked={selectedFilters.status}
                    onCheckedChange={() => handleFilterToggle('status')}
                    disabled={!currentFilters.status}
                  />
                  <label htmlFor="filter-status" className={`text-sm cursor-pointer flex-1 ${!currentFilters.status ? 'text-muted-foreground opacity-70' : ''}`}>
                    <span className="text-muted-foreground">Status:</span>{' '}
                    <span className="font-medium text-foreground">{currentFilters.status || 'Not set'}</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-assigned"
                    checked={selectedFilters.assignedTo}
                    onCheckedChange={() => handleFilterToggle('assignedTo')}
                    disabled={!currentFilters.assignedTo}
                  />
                  <label htmlFor="filter-assigned" className={`text-sm cursor-pointer flex-1 ${!currentFilters.assignedTo ? 'text-muted-foreground opacity-70' : ''}`}>
                    <span className="text-muted-foreground">Assigned To:</span>{' '}
                    <span className="font-medium text-foreground">{currentFilters.assignedTo || 'Not set'}</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-amount"
                    checked={selectedFilters.minAmount}
                    onCheckedChange={() => handleFilterToggle('minAmount')}
                    disabled={!currentFilters.minAmount}
                  />
                  <label htmlFor="filter-amount" className={`text-sm cursor-pointer flex-1 ${!currentFilters.minAmount ? 'text-muted-foreground opacity-70' : ''}`}>
                    <span className="text-muted-foreground">Min Amount:</span>{' '}
                    <span className="font-medium text-foreground">
                      {currentFilters.minAmount ? `$${currentFilters.minAmount.toLocaleString()}` : 'Not set'}
                    </span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-stage"
                    checked={selectedFilters.stage}
                    onCheckedChange={() => handleFilterToggle('stage')}
                    disabled={!currentFilters.stage}
                  />
                  <label htmlFor="filter-stage" className={`text-sm cursor-pointer flex-1 ${!currentFilters.stage ? 'text-muted-foreground opacity-70' : ''}`}>
                    <span className="text-muted-foreground">Stage:</span>{' '}
                    <span className="font-medium text-foreground">{currentFilters.stage || 'Not set'}</span>
                  </label>
                </div>
                
                {!currentFilters.searchTerm && !currentFilters.status && !currentFilters.assignedTo && 
                 !currentFilters.minAmount && !currentFilters.stage && (
                  <p className="text-muted-foreground italic">No filters currently applied. Set filters in the main view first.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DealListSaveDialog;
