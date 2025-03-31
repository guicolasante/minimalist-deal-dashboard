
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Deal } from '@/lib/types';
import { ColumnDefinition } from './ColumnSettingsDrawer';
import { useToast } from '@/components/ui/use-toast';
import DealTableHeader from './deal-table/DealTableHeader';
import DealTableActions from './deal-table/DealTableActions';
import DealTableCell from './deal-table/DealTableCell';
import DealTableFooter from './deal-table/DealTableFooter';

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

  const visibleColumns = columns
    .filter(column => column.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="rounded-md border shadow-sm bg-white">
      <DealTableHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddDeal={onAddDeal}
        columns={columns}
        onColumnsChange={handleColumnsChange}
      />
      
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
                        <DealTableCell deal={deal} column={column} />
                      </TableCell>
                    ))}
                    <TableCell>
                      <DealTableActions 
                        deal={deal}
                        onEditDeal={onEditDeal}
                        onDeleteDeal={onDeleteDeal}
                      />
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
      
      <DealTableFooter 
        filteredCount={filteredDeals.length}
        totalCount={Array.isArray(deals) ? deals.length : 0}
      />
    </div>
  );
};

export default DealTable;
