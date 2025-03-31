
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  Filter, 
  ListFilter, 
  MoreHorizontal, 
  PlusCircle, 
  Search, 
  X 
} from 'lucide-react';
import { Deal, DealStatus } from '@/lib/types';
import { MOCK_DEALS, MOCK_USERS } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DealListSaveDialog } from '@/components/deal-table';
import { useToast } from '@/hooks/use-toast';

interface FilterState {
  status: string | null;
  assignedTo: string | null;
  minAmount: number | null;
  stage: string | null;
  sector: string | null;
  weekDeals: string | null;
}

interface SavedList {
  id: string;
  name: string;
  filters: FilterState & { searchTerm?: string };
  isActive?: boolean;
}

const Lists = () => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: null,
    assignedTo: null,
    minAmount: null,
    stage: null,
    sector: null,
    weekDeals: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savedLists, setSavedLists] = useState<SavedList[]>([
    {
      id: '1',
      name: 'All Active Deals',
      filters: {
        status: null,
        assignedTo: null,
        minAmount: null,
        stage: null,
        sector: null,
        weekDeals: null
      },
      isActive: true
    },
    {
      id: '2',
      name: 'High Value Deals',
      filters: {
        status: null,
        assignedTo: null,
        minAmount: 500000,
        stage: null,
        sector: null,
        weekDeals: null
      }
    },
    {
      id: '3',
      name: 'My Assigned Deals',
      filters: {
        status: null,
        assignedTo: 'John Doe',
        minAmount: null,
        stage: null,
        sector: null,
        weekDeals: null
      }
    },
    {
      id: '4',
      name: 'Term Sheets',
      filters: {
        status: null,
        assignedTo: null,
        minAmount: null,
        stage: 'Term Sheet Issued',
        sector: null,
        weekDeals: null
      }
    },
    {
      id: '5',
      name: 'Portfolio Companies',
      filters: {
        status: 'Portfolio',
        assignedTo: null,
        minAmount: null,
        stage: null,
        sector: null,
        weekDeals: null
      }
    }
  ]);
  const { toast } = useToast();

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Pass':
        return 'bg-gray-200 text-gray-700';
      case 'Engage':
        return 'bg-blue-100 text-blue-700';
      case 'OnHold':
        return 'bg-yellow-100 text-yellow-700';
      case 'BusinessDD':
        return 'bg-purple-100 text-purple-700';
      case 'TermSheet':
        return 'bg-orange-100 text-orange-700';
      case 'Portfolio':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const applyFilters = (deal: Deal) => {
    if (
      searchTerm &&
      !deal.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !deal.company.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (filters.status && deal.status !== filters.status) {
      return false;
    }

    if (filters.assignedTo && deal.assignedTo !== filters.assignedTo) {
      return false;
    }

    if (filters.minAmount && deal.amount < filters.minAmount) {
      return false;
    }

    if (filters.stage && deal.stage !== filters.stage) {
      return false;
    }
    
    if (filters.sector && deal.sector !== filters.sector) {
      return false;
    }
    
    if (filters.weekDeals && deal.weekDeals !== filters.weekDeals) {
      return false;
    }

    return true;
  };

  const filteredDeals = deals.filter(applyFilters);

  const handleFilterChange = (name: keyof FilterState, value: string | number | null) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: null,
      assignedTo: null,
      minAmount: null,
      stage: null,
      sector: null,
      weekDeals: null
    });
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(v => v !== null).length + (searchTerm ? 1 : 0);
  };

  const handleSaveList = (name: string, currentFilters: FilterState & { searchTerm?: string }) => {
    const newList: SavedList = {
      id: Date.now().toString(),
      name,
      filters: { 
        ...currentFilters,
        searchTerm
      }
    };
    
    setSavedLists(prev => [newList, ...prev.filter(list => list.id !== '1')]);
    
    toast({
      title: "List saved successfully",
      description: `Your list "${name}" has been added to your saved lists.`
    });
  };

  const selectList = (list: SavedList) => {
    setSavedLists(prev => 
      prev.map(item => ({
        ...item,
        isActive: item.id === list.id
      }))
    );
    
    setFilters({
      status: list.filters.status || null,
      assignedTo: list.filters.assignedTo || null,
      minAmount: list.filters.minAmount || null,
      stage: list.filters.stage || null
    });
    
    setSearchTerm(list.filters.searchTerm || '');
  };

  const deleteList = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const listToDelete = savedLists.find(list => list.id === id);
    
    if (listToDelete) {
      setSavedLists(prev => prev.filter(list => list.id !== id));
      
      toast({
        title: "List deleted",
        description: `"${listToDelete.name}" has been removed from your saved lists.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-crm-lightGray">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-crm-charcoal">Deal Lists</h1>
            <p className="text-muted-foreground">Create and manage filtered lists of deals</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Button 
              variant="outline" 
              className="shadow-sm"
              onClick={() => setSaveDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Save Current List</span>
            </Button>
            
            <Button 
              className="shadow-sm"
              onClick={() => setSaveDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Create New List</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-in">
          <div className="md:col-span-1 space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Saved Lists</CardTitle>
                <CardDescription>Your custom filtered lists</CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="space-y-1">
                  {savedLists.map(list => (
                    <div 
                      key={list.id}
                      className={`p-2 rounded-md text-sm flex items-center cursor-pointer transition-colors ${
                        list.isActive 
                          ? 'bg-crm-blue/10 text-crm-blue font-medium' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => selectList(list)}
                    >
                      <span className="grow">{list.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => selectList(list)}>
                            Apply Filters
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={(e) => deleteList(list.id, e)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 pb-4">
                <Button 
                  variant="outline" 
                  className="w-full text-sm"
                  onClick={() => setSaveDialogOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Create New List</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg font-medium">
                      {savedLists.find(list => list.isActive)?.name || "All Deals"}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Showing {filteredDeals.length} deals
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search deals..."
                        className="pl-9 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className={`relative ${showFilters ? 'bg-gray-100' : ''}`}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4" />
                      {getActiveFilterCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-crm-blue text-white w-4 h-4 rounded-full text-xs flex items-center justify-center">
                          {getActiveFilterCount()}
                        </span>
                      )}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Export to Excel</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSaveDialogOpen(true)}>Save Current View</DropdownMenuItem>
                        <DropdownMenuItem onClick={clearFilters}>Clear All Filters</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              <div className="p-4 bg-gray-50 border-b animate-slide-in">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-gray-500 hover:text-gray-700"
                    onClick={clearFilters}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <Label className="text-xs">Status</Label>
                    <Select
                      value={filters.status || ''}
                      onValueChange={(value) => handleFilterChange('status', value || null)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Engage">Engage</SelectItem>
                        <SelectItem value="OnHold">On Hold</SelectItem>
                        <SelectItem value="BusinessDD">Business DD</SelectItem>
                        <SelectItem value="TermSheet">Term Sheet</SelectItem>
                        <SelectItem value="Portfolio">Portfolio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Assigned To</Label>
                    <Select
                      value={filters.assignedTo || ''}
                      onValueChange={(value) => handleFilterChange('assignedTo', value || null)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All Users" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Users</SelectItem>
                        {MOCK_USERS.map(user => (
                          <SelectItem key={user.id} value={user.name}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Min Amount</Label>
                    <Select
                      value={filters.minAmount?.toString() || ''}
                      onValueChange={(value) => handleFilterChange('minAmount', value ? parseInt(value) : null)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Any Amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Amount</SelectItem>
                        <SelectItem value="100000">$100,000+</SelectItem>
                        <SelectItem value="500000">$500,000+</SelectItem>
                        <SelectItem value="1000000">$1,000,000+</SelectItem>
                        <SelectItem value="5000000">$5,000,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Stage</Label>
                    <Select
                      value={filters.stage || ''}
                      onValueChange={(value) => handleFilterChange('stage', value || null)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All Stages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Stages</SelectItem>
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
                  
                  <div>
                    <Label className="text-xs">Sector</Label>
                    <Select
                      value={filters.sector || ''}
                      onValueChange={(value) => handleFilterChange('sector', value || null)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All Sectors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Sectors</SelectItem>
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
                  
                  <div>
                    <Label className="text-xs">Week Deals</Label>
                    <Select
                      value={filters.weekDeals || ''}
                      onValueChange={(value) => handleFilterChange('weekDeals', value || null)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All Deals" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Deals</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[200px]">Deal Name</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Date Received</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeals.length > 0 ? (
                        filteredDeals.map((deal) => (
                          <TableRow key={deal.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{deal.name}</TableCell>
                            <TableCell>{deal.company}</TableCell>
                            <TableCell>
                              <Badge className={`font-normal ${getStatusBadgeColor(deal.status)}`}>
                                {deal.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(deal.amount)}
                            </TableCell>
                            <TableCell>{deal.assignedTo}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(deal.dateReceived).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            <div className="flex flex-col items-center">
                              <ListFilter className="h-8 w-8 text-gray-400 mb-2" />
                              <p>No deals match your search and filter criteria.</p>
                              <Button 
                                variant="link" 
                                className="mt-1 text-crm-blue"
                                onClick={clearFilters}
                              >
                                Clear all filters
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              
              <CardFooter className="border-t py-4 px-6 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredDeals.length} of {deals.length} deals
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground mr-2">Show:</span>
                  <Button variant="outline" size="sm" className="h-8 flex items-center gap-1">
                    <span>10 per page</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <DealListSaveDialog
          open={saveDialogOpen}
          onOpenChange={setSaveDialogOpen}
          currentFilters={{ ...filters, searchTerm }}
          onSaveList={handleSaveList}
        />
      </main>
    </div>
  );
};

interface LabelProps {
  className?: string;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ className, children }) => {
  return (
    <div className={`mb-1.5 ${className}`}>
      {children}
    </div>
  );
};

export default Lists;
