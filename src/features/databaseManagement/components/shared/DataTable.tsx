import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableAction {
  label: string;
  icon: React.ElementType;
  onClick: (row: any) => void;
  variant?: 'default' | 'destructive';
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  actions?: DataTableAction[];
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  actions = [],
  loading = false,
  emptyMessage = 'No data available',
  onSort
}) => {
  const defaultActions: DataTableAction[] = [
    {
      label: 'View',
      icon: Eye,
      onClick: (row) => console.log('View:', row)
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (row) => console.log('Edit:', row)
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: (row) => console.log('Delete:', row),
      variant: 'destructive'
    }
  ];

  const tableActions = actions.length > 0 ? actions : defaultActions;

  if (loading) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                className={column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}
                onClick={column.sortable ? () => onSort?.(column.key, 'asc') : undefined}
              >
                {column.label}
              </TableHead>
            ))}
            {tableActions.length > 0 && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id || index}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </TableCell>
              ))}
              {tableActions.length > 0 && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {tableActions.map((action, actionIndex) => {
                        const ActionIcon = action.icon;
                        return (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={action.variant === 'destructive' ? 'text-red-600' : ''}
                          >
                            <ActionIcon className="w-4 h-4 mr-2" />
                            {action.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
