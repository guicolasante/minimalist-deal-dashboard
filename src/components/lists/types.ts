
// Define FilterState interface - dynamic to handle any column
export interface FilterState {
  [key: string]: any;
}

// Define a type for filter operators
export type FilterOperator = 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in';

// Define a more structured filter value interface
export interface FilterValue {
  operator: FilterOperator;
  value: any;
  values?: any[]; // For multi-select values
}
