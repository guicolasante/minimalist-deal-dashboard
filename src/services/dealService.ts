
import { supabase } from "@/integrations/supabase/client";
import { Deal, DealStatus } from "@/lib/types";

// Fetch all deals from Supabase
export const fetchDeals = async (): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*');
  
  if (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
  
  // Transform Supabase data to match our Deal interface
  return data.map(deal => ({
    id: deal.id,
    name: deal.name,
    company: deal.company,
    status: deal.status as DealStatus,
    amount: Number(deal.amount),
    stage: deal.stage,
    assignedTo: deal.assigned_to,
    dateReceived: deal.date_received,
    dateUpdated: deal.date_updated,
    description: deal.description || '',
    contactName: deal.contact_name || '',
    contactEmail: deal.contact_email || '',
    notes: deal.notes || ''
  }));
};

// Add a new deal to Supabase
export const addDeal = async (deal: Omit<Deal, 'id'>): Promise<Deal> => {
  const { data, error } = await supabase
    .from('deals')
    .insert({
      name: deal.name,
      company: deal.company,
      status: deal.status,
      amount: deal.amount,
      stage: deal.stage,
      assigned_to: deal.assignedTo,
      description: deal.description,
      contact_name: deal.contactName,
      contact_email: deal.contactEmail,
      notes: deal.notes
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding deal:', error);
    throw error;
  }
  
  // Transform the returned data to match our Deal interface
  return {
    id: data.id,
    name: data.name,
    company: data.company,
    status: data.status as DealStatus,
    amount: Number(data.amount),
    stage: data.stage,
    assignedTo: data.assigned_to,
    dateReceived: data.date_received,
    dateUpdated: data.date_updated,
    description: data.description || '',
    contactName: data.contact_name || '',
    contactEmail: data.contact_email || '',
    notes: data.notes || ''
  };
};

// Update an existing deal in Supabase
export const updateDeal = async (deal: Deal): Promise<Deal> => {
  const { data, error } = await supabase
    .from('deals')
    .update({
      name: deal.name,
      company: deal.company,
      status: deal.status,
      amount: deal.amount,
      stage: deal.stage,
      assigned_to: deal.assignedTo,
      date_updated: new Date().toISOString(),
      description: deal.description,
      contact_name: deal.contactName,
      contact_email: deal.contactEmail,
      notes: deal.notes
    })
    .eq('id', deal.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating deal:', error);
    throw error;
  }
  
  // Transform the returned data to match our Deal interface
  return {
    id: data.id,
    name: data.name,
    company: data.company,
    status: data.status as DealStatus,
    amount: Number(data.amount),
    stage: data.stage,
    assignedTo: data.assigned_to,
    dateReceived: data.date_received,
    dateUpdated: data.date_updated,
    description: data.description || '',
    contactName: data.contact_name || '',
    contactEmail: data.contact_email || '',
    notes: data.notes || ''
  };
};

// Delete a deal from Supabase
export const deleteDeal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
};
