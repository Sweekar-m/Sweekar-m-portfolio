import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio hero and interactive work section', () => {
  render(<App />);
  expect(screen.getByText(/building intelligent systems/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /selected systems/i })).toBeInTheDocument();
});
