// Main.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Main from './Main';
import '@testing-library/jest-dom';
import { useWebSocket } from './useWebSocket';

jest.mock('./useWebSocket');

describe('Main component tests', () => {
  beforeEach(() => {
    useWebSocket.mockImplementation(() => {/* Mock implementation based on your custom hook logic */});
  });

  it('renders loading state initially', () => {
    render(<Main socket={{}} />); // Pass a mock socket object
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  // Add more tests here following the strategy overview
});
