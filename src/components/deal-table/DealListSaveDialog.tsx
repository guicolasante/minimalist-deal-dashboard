
import React, { useState } from 'react';
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
  const { toast } = useToast();

  const handleSave = () => {
    if (!listName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your list",
        variant: "destructive"
      });
      return;
    }

    onSaveList(listName, currentFilters);
    setListName('');
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
          <DialogTitle>Save Current List</DialogTitle>
          <DialogDescription>
            Create a new list with your current filters and search criteria.
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
              <p className="text-sm font-medium">Current Filters</p>
              <div className="rounded-md bg-gray-50 p-3 text-sm">
                {currentFilters.searchTerm && (
                  <p className="text-muted-foreground">
                    Search: <span className="font-medium text-foreground">{currentFilters.searchTerm}</span>
                  </p>
                )}
                {currentFilters.status && (
                  <p className="text-muted-foreground">
                    Status: <span className="font-medium text-foreground">{currentFilters.status}</span>
                  </p>
                )}
                {currentFilters.assignedTo && (
                  <p className="text-muted-foreground">
                    Assigned To: <span className="font-medium text-foreground">{currentFilters.assignedTo}</span>
                  </p>
                )}
                {currentFilters.minAmount && (
                  <p className="text-muted-foreground">
                    Min Amount: <span className="font-medium text-foreground">${currentFilters.minAmount.toLocaleString()}</span>
                  </p>
                )}
                {currentFilters.stage && (
                  <p className="text-muted-foreground">
                    Stage: <span className="font-medium text-foreground">{currentFilters.stage}</span>
                  </p>
                )}
                {!currentFilters.searchTerm && !currentFilters.status && !currentFilters.assignedTo && 
                 !currentFilters.minAmount && !currentFilters.stage && (
                  <p className="text-muted-foreground">No filters applied</p>
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
