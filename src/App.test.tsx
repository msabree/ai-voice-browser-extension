import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders text with extension name', () => {
  render(<App />);
  const cookieJarText = screen.getByText(/Cookie Jar/i);
  expect(cookieJarText).toBeInTheDocument();
});
