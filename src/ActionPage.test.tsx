import React from 'react';
import { render, screen } from '@testing-library/react';
import ActionPage from './ActionPage';

test('renders text with extension name', () => {
  render(<ActionPage />);
  const name = screen.getByText(/Voice Browser/i);
  expect(name).toBeInTheDocument();
});
