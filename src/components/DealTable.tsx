import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronDown,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  Settings,
} from 'lucide-react';
import { Deal } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import ColumnSettingsDrawer, { ColumnDefinition } from './ColumnSettingsDrawer';
import { useToast } from '@/components/ui/use-toast';

const defaultColumns: ColumnDefinition[] = [
  { id: '1', name: 'Deal Name', key: 'name', type: 'text', required: true, visible: true, order: 0 },
  { id: '2', name: 'Company', key: 'company', type: 'text', required: true, visible: true, order: 1 },
  { id: '3', name: 'Status', key: 'status', type: 'singleSelect', options: ['Pass', 'Engage', 'OnHold', 'BusinessDD', 'TermSheet', 'Portfolio'], required: true, visible: true, order: 2 },
  { id: '4', name: 'Amount', key: 'amount', type: 'currency', required: true, visible: true, order: 3 },
  { id: '5', name: 'Assigned To', key: 'assignedTo', type: 'text', required: true, visible: true, order: 4 },
  { id: '6', name: 'Date Received', key: 'dateReceived', type: 'date', required: true, visible: true, order: 5 },
];

interface DealTableProps {
  deals: Deal[];
  isLoading?: boolean;
  onAddDeal: () => void;
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (id: string) => void;
}

const DealTable: React.FC<DealTableProps> = ({ 
  deals = [],
  isLoading = false,
  onAddDeal,
  onEditDeal,
  onDeleteDeal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState<ColumnDefinition[]>(defaultColumns);
  const { toast } = useToast();

  useEffect(() => {
    const savedColumns = localStorage.getItem('dealTableColumns');
    if (savedColumns) {
      try {
        const parsedColumns = JSON.parse(savedColumns);
        setColumns(parsedColumns);
      } catch (e) {
        console.error('Failed to parse saved columns:', e);
      }
    }
  }, []);

  const handleColumnsChange = (newColumns: ColumnDefinition[]) => {
    setColumns(newColumns);
    localStorage.setItem('dealTableColumns', JSON.stringify(newColumns));
    toast({
      title: "Settings saved",
      description: "Your table configuration has been updated.",
    });
  };

  const filteredDeals = Array.isArray(deals) 
    ? deals.filter((deal) =>
        deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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

  const formatCellValue = (deal: Deal, column: ColumnDefinition) => {
    const value = deal[column.key as keyof Deal];
    
    switch (column.type) {
      case 'currency':
        return typeof value === 'number' ? formatCurrency(value) : value;
      case 'date':
        return typeof value === 'string' 
          ? new Date(value).toLocaleDateString() 
          : value;
      case 'singleSelect':
        return typeof value === 'string' ? (
          <Badge className={`font-normal ${getStatusBadgeColor(value)}`}>
            {value}
          </Badge>
        ) : value;
      default:
        return value;
    }
  };

  const visibleColumns = columns
    .filter(column => column.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="rounded-md border shadow-sm bg-white">
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-crm-charcoal">Active Deals</h2>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search deals..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto justify-between">
              <ColumnSettingsDrawer columns={columns} onColumnsChange={handleColumnsChange}>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span>Settings</span>
                </Button>
              </ColumnSettingsDrawer>

              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4 text-gray-500" />
                <span>Filter</span>
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4 text-gray-500" />
                <span>Export</span>
              </Button>
              
              <Button size="sm" className="flex items-center gap-1" onClick={onAddDeal}>
                <PlusCircle className="h-4 w-4" />
                <span>New Deal</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-sm text-gray-500">Loading deals...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map(column => (
                  <TableHead 
                    key={column.id} 
                    className={column.key === 'amount' ? 'text-right' : ''}
                  >
                    {column.name}
                  </TableHead>
                ))}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal) => (
                  <TableRow key={deal.id} className="hover:bg-gray-50">
                    {visibleColumns.map(column => (
                      <TableCell 
                        key={`${deal.id}-${column.id}`}
                        className={`${column.key === 'amount' ? 'text-right font-medium' : ''}
                                   ${column.key === 'name' ? 'font-medium' : ''}
                                   ${column.key === 'dateReceived' ? 'text-muted-foreground' : ''}`}
                      >
                        {formatCellValue(deal, column)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditDeal(deal)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDeleteDeal(deal.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length + 1} className="text-center py-6 text-muted-foreground">
                    {searchTerm ? 'No deals found. Try adjusting your search.' : 'No deals yet. Add your first deal!'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      
      <div className="p-4 border-t flex justify-between items-center text-sm text-muted-foreground">
        <div>Showing {filteredDeals.length} of {Array.isArray(deals) ? deals.length : 0} deals</div>
        <div className="flex items-center gap-1">
          <span>Show:</span>
          <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1">
            <span>10 per page</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DealTable;
