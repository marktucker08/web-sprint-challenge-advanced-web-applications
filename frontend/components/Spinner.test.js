import Spinner from "./Spinner";
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
test('test if Spinner successfully renders', () => {
  render(<Spinner on={true} />);
  const loading = screen.queryByText(/Please wait.../i);
  expect(loading).toBeInTheDocument();
})

test('test if Spinner successfully renders with false value', () => {
  render(<Spinner on={false} />);
  const loading = screen.queryByText(/Please wait.../i);
  expect(loading).not.toBeInTheDocument();
})