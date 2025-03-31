
import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Save,
  X 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';

// Column type definitions
export type ColumnType = 'text' | 'number' | 'date' | 'singleSelect' | 'multiSelect' | 'currency';

export interface ColumnDefinition {
  id: string;
  name: string;
  key: string;
  type: ColumnType;
  options?: string[]; // For single/multi select
  required?: boolean;
  visible: boolean;
  order: number;
}

// Form schema for adding/editing columns
const columnFormSchema = z.object({
  name: z.string().min(1, { message: "Column name is required" }),
  key: z.string().min(1, { message: "Key is required" }).regex(/^[a-zA-Z0-9_]+$/, {
    message: "Key can only contain letters, numbers and underscores",
  }),
  type: z.enum(['text', 'number', 'date', 'singleSelect', 'multiSelect', 'currency']),
  options: z.string().optional(),
  required: z.boolean().default(false),
  visible: z.boolean().default(true),
});

interface ColumnSettingsDrawerProps {
  children: React.ReactNode;
  columns: ColumnDefinition[];
  onColumnsChange: (columns: ColumnDefinition[]) => void;
}

const ColumnSettingsDrawer: React.FC<ColumnSettingsDrawerProps> = ({ 
  children, 
  columns,
  onColumnsChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<ColumnDefinition | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof columnFormSchema>>({
    resolver: zodResolver(columnFormSchema),
    defaultValues: {
      name: '',
      key: '',
      type: 'text',
      options: '',
      required: false,
      visible: true,
    },
  });

  const openColumnForm = (column?: ColumnDefinition) => {
    if (column) {
      setEditingColumn(column);
      form.reset({
        name: column.name,
        key: column.key,
        type: column.type,
        options: column.options?.join(','),
        required: column.required || false,
        visible: column.visible,
      });
    } else {
      setEditingColumn(null);
      form.reset({
        name: '',
        key: '',
        type: 'text',
        options: '',
        required: false,
        visible: true,
      });
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = (values: z.infer<typeof columnFormSchema>) => {
    const optionsArray = values.options ? 
      values.options.split(',').map(opt => opt.trim()).filter(opt => opt) : 
      undefined;
    
    if (editingColumn) {
      // Update existing column
      const updatedColumns = columns.map(col => 
        col.id === editingColumn.id ? 
        {
          ...col,
          name: values.name,
          key: values.key,
          type: values.type,
          options: optionsArray,
          required: values.required,
          visible: values.visible,
        } : col
      );
      onColumnsChange(updatedColumns);
      toast({
        title: "Column updated",
        description: `Column "${values.name}" has been updated.`,
      });
    } else {
      // Add new column
      const newColumn: ColumnDefinition = {
        id: Date.now().toString(),
        name: values.name,
        key: values.key,
        type: values.type,
        options: optionsArray,
        required: values.required,
        visible: values.visible,
        order: columns.length,
      };
      onColumnsChange([...columns, newColumn]);
      toast({
        title: "Column added",
        description: `Column "${values.name}" has been added.`,
      });
    }
    
    setIsFormOpen(false);
  };

  const handleDeleteColumn = (columnId: string) => {
    const updatedColumns = columns.filter(col => col.id !== columnId);
    onColumnsChange(updatedColumns);
    toast({
      title: "Column deleted",
      description: "The column has been removed.",
    });
  };

  const handleMoveColumn = (columnId: string, direction: 'up' | 'down') => {
    const columnIndex = columns.findIndex(col => col.id === columnId);
    if (
      (direction === 'up' && columnIndex === 0) || 
      (direction === 'down' && columnIndex === columns.length - 1)
    ) {
      return;
    }

    const newColumns = [...columns];
    const targetIndex = direction === 'up' ? columnIndex - 1 : columnIndex + 1;
    
    // Swap positions
    [newColumns[columnIndex], newColumns[targetIndex]] = 
    [newColumns[targetIndex], newColumns[columnIndex]];
    
    // Update order values
    const orderedColumns = newColumns.map((col, index) => ({
      ...col,
      order: index
    }));
    
    onColumnsChange(orderedColumns);
  };

  const handleToggleVisibility = (columnId: string) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] max-h-[80vh]">
        <div className="px-4 py-4 h-full flex flex-col">
          <DrawerHeader className="px-0">
            <DrawerTitle className="text-xl">Table Settings</DrawerTitle>
            <DrawerDescription>
              Manage table columns, add new fields, and customize your view.
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {columns.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No columns defined. Add your first column to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {columns
                  .sort((a, b) => a.order - b.order)
                  .map((column) => (
                  <div 
                    key={column.id} 
                    className={`border rounded-md p-3 flex items-center justify-between ${!column.visible ? 'opacity-60' : ''}`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{column.name}</h4>
                      <div className="text-sm text-muted-foreground flex gap-2">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                          {column.type}
                        </span>
                        <span className="text-xs">key: {column.key}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleVisibility(column.id)}
                        title={column.visible ? "Hide column" : "Show column"}
                      >
                        <span className={`h-4 w-4 ${column.visible ? 'bg-green-500' : 'bg-gray-300'} rounded-full`}></span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleMoveColumn(column.id, 'up')}
                        disabled={column.order === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleMoveColumn(column.id, 'down')}
                        disabled={column.order === columns.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openColumnForm(column)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete column</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the "{column.name}" column? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => handleDeleteColumn(column.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DrawerFooter className="px-0 pt-2">
            <Button onClick={() => openColumnForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Column
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
      
      {/* Add/Edit Column Form Dialog */}
      <AlertDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {editingColumn ? 'Edit Column' : 'Add New Column'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {editingColumn 
                    ? 'Modify the column properties below.' 
                    : 'Configure your new column.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Column Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Deal Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Display name for the column
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Column Key</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="dealName" 
                          {...field} 
                          disabled={!!editingColumn}
                        />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for this column (can't be changed after creation)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Column Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="singleSelect">Single Select</SelectItem>
                          <SelectItem value="multiSelect">Multi Select</SelectItem>
                          <SelectItem value="currency">Currency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Data type of this column
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {(form.watch('type') === 'singleSelect' || form.watch('type') === 'multiSelect') && (
                  <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Option1, Option2, Option3" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated list of options
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="required"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Required</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="visible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Visible</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingColumn ? 'Save Changes' : 'Add Column'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </Drawer>
  );
};

export default ColumnSettingsDrawer;
