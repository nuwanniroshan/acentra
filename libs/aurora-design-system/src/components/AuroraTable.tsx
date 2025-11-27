import React from 'react';
import { 
  Table, TableProps, 
  TableBody, TableBodyProps, 
  TableCell, TableCellProps, 
  TableContainer, TableContainerProps, 
  TableHead, TableHeadProps, 
  TableRow, TableRowProps,
  TablePagination, TablePaginationProps
} from '@mui/material';

export const AuroraTable: React.FC<TableProps> = (props) => <Table {...props} />;
export const AuroraTableBody: React.FC<TableBodyProps> = (props) => <TableBody {...props} />;
export const AuroraTableCell: React.FC<TableCellProps> = (props) => <TableCell {...props} />;
export const AuroraTableContainer: React.FC<TableContainerProps> = (props) => <TableContainer {...props} />;
export const AuroraTableHead: React.FC<TableHeadProps> = (props) => <TableHead {...props} />;
export const AuroraTableRow: React.FC<TableRowProps> = (props) => <TableRow {...props} />;
export const AuroraTablePagination: React.FC<TablePaginationProps> = (props) => <TablePagination {...props} />;
