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
  onDelete: (name: string) => void
  isLoading: boolean
}

export default function CookiesTable({ data, onDelete, isLoading }: CookiesTableProps) {
  return (
    <TableContainer sx={{ maxHeight: 500 }} component={Paper}>
      <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell sx={{maxWidth: 200, fontSize: 14}}>Cookie Name</TableCell>
            <TableCell sx={{maxWidth: 200, fontSize: 14}}>Category</TableCell>
            <TableCell sx={{width: 200, fontSize: 14}}>AI Message</TableCell>
            <TableCell sx={{maxWidth: 200, fontSize: 14}}>AI Suggestion</TableCell>
            <TableCell sx={{maxWidth: 200, fontSize: 14}}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((cookie: Cookie) => (
            <TableRow
              key={cookie.cookie_name}
              sx={{ whiteSpace: 'normal',
                wordWrap: 'break-word' }}
            >
              <TableCell sx={{maxWidth: 200, fontSize: 12}}>
                {cookie.cookie_name}
              </TableCell>
              <TableCell sx={{maxWidth: 200, fontSize: 12}}>{cookie.category}</TableCell>
              <TableCell sx={{width: 200, fontSize: 12}}>{cookie.message}</TableCell>
              <TableCell sx={{maxWidth: 200, fontSize: 12}}>{cookie.should_delete ? 'Safe to delete': 'Safe to keep'}</TableCell>
              <TableCell sx={{maxWidth: 200, fontSize: 12}}>
                <Button 
                  sx={{textTransform: 'none', fontSize: 12}}
                  size='small' 
                  disabled={isLoading || !cookie.should_delete} 
                  variant='outlined' 
                  color='warning' 
                  onClick={() => {
                  onDelete(cookie.cookie_name)
                }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
