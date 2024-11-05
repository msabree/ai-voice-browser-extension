import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

export interface Cookie {
  cookie_name: string;
  cookie_value: string;
  message: string;
  should_delete: boolean;
  category: string;
  expiration: Date | null;
  origin: string;
}

interface CookiesTableProps {
  data: Cookie[]
}

export default function CookiesTable({ data }: CookiesTableProps) {
  return (
    <TableContainer sx={{ maxHeight: 500 }} component={Paper}>
      <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Cookie Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell sx={{maxWidth: 50}}>AI Message</TableCell>
            <TableCell>AI Suggestion</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((cookie: Cookie) => (
            <TableRow
              key={cookie.cookie_name}
              sx={{ whiteSpace: 'normal',
                wordWrap: 'break-word' }}
            >
              <TableCell sx={{maxWidth: 50}} component="th" scope="row">
                {cookie.cookie_name}
              </TableCell>
              <TableCell>{cookie.category}</TableCell>
              <TableCell sx={{maxWidth: 150}}>{cookie.message}</TableCell>
              <TableCell>{cookie.should_delete ? 'Safe to delete': 'Consider keeping'}</TableCell>
              <TableCell>
                <Button variant='outlined' color='warning'>DELETE</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
