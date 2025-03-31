import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Deal, DealStatus } from '@/lib/types';
import { MOCK_USERS } from '@/lib/data';

interface DealFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDeal?: Deal;
  onSave: (deal: Partial<Deal>) => void;
}

const DealForm: React.FC<DealFormProps> = ({
  open,
  onOpenChange,
  initialDeal,
  onSave,
}) => {
  const isEditMode = !!initialDeal;
  
  const [formData, setFormData] = useState<Partial<Deal>>(
    initialDeal || {
      name: '',
      company: '',
      status: 'Engage' as DealStatus,
      amount: 0,
      stage: '',
      assignedTo: '',
      description: '',
      contactName: '',
      contactEmail: '',
      notes: '',
      weekDeals: 'No',
      sector: '',
    }
  );

  useEffect(() => {
    if (initialDeal) {
      setFormData(initialDeal);
    } else {
      setFormData({
        name: '',
        company: '',
        status: 'Engage' as DealStatus,
        amount: 0,
        stage: '',
        assignedTo: '',
        description: '',
        contactName: '',
        contactEmail: '',
        notes: '',
        weekDeals: 'No',
        sector: '',
      });
    }
  }, [initialDeal, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, amount: value ? parseInt(value) : 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dealData = {
      ...formData,
      dateReceived: formData.dateReceived || new Date().toISOString().split('T')[0],
      dateUpdated: new Date().toISOString().split('T')[0],
    };
    
    onSave(dealData);
  };

  const generateWeekOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    const startDate = new Date(currentYear, 0, 1);
    const days = Math.floor((currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.ceil(days / 7);
    
    for (let i = 0; i <= 25; i++) {
      const weekNum = currentWeek - i;
      if (weekNum > 0) {
        options.push(`W${weekNum}`);
      }
    }
    
    return options;
  };

  const weekOptions = generateWeekOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the details for this deal.'
              : 'Enter the details for the new business deal.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Deal Name*</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter deal name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company*</Label>
              <Input
                id="company"
                name="company"
                placeholder="Enter company name"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status*</Label>
                <Select
                  name="status"
                  value={formData.status as string}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Engage">Engage</SelectItem>
                    <SelectItem value="OnHold">On Hold</SelectItem>
                    <SelectItem value="BusinessDD">Business DD</SelectItem>
                    <SelectItem value="TermSheet">Term Sheet</SelectItem>
                    <SelectItem value="Portfolio">Portfolio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)*</Label>
                <Input
                  id="amount"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount?.toString() || ''}
                  onChange={handleAmountChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage*</Label>
                <Select
                  name="stage"
                  value={formData.stage}
                  onValueChange={(value) => handleSelectChange('stage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Initial Screening">Initial Screening</SelectItem>
                    <SelectItem value="Initial Meeting">Initial Meeting</SelectItem>
                    <SelectItem value="Follow-up Meeting">Follow-up Meeting</SelectItem>
                    <SelectItem value="Due Diligence">Due Diligence</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Term Sheet Issued">Term Sheet Issued</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To*</Label>
                <Select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onValueChange={(value) => handleSelectChange('assignedTo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_USERS.map((user) => (
                      <SelectItem key={user.id} value={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weekDeals">Week Deals</Label>
                <Select
                  name="weekDeals"
                  value={formData.weekDeals || 'No'}
                  onValueChange={(value) => handleSelectChange('weekDeals', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select
                  name="sector"
                  value={formData.sector || ''}
                  onValueChange={(value) => handleSelectChange('sector', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Consumer">Consumer</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the deal"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  placeholder="Primary contact name"
                  value={formData.contactName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="Contact email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional notes about this deal"
                rows={2}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditMode ? 'Update Deal' : 'Add Deal'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DealForm;
