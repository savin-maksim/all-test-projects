import { render, screen } from '@testing-library/react';
import ComplexCalc from './ComplexCalc';

test('renders learn react link', () => {
  render(<ComplexCalc />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});