import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  // Test 1: Component renders without crashing
  test('renders without crashing', () => {
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  // Test 2: Header and navigation elements
  test('renders header with logo and navigation', () => {
    expect(screen.getAllByLabelText(/little lemon restaurant logo/i)).toHaveLength(2);
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Reservations')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  // Test 3: Hero section content
  test('renders hero section with correct content', () => {
    expect(screen.getByRole('heading', { name: /little lemon/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/charming neighborhood bistro/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reserve a table/i })).toBeInTheDocument();
    expect(screen.getByAltText(/interior of little lemon restaurant/i)).toBeInTheDocument();
  });

  // Test 4: Features section
  test('renders features section with three feature cards', () => {
    expect(screen.getByText('Fresh Ingredients')).toBeInTheDocument();
    expect(screen.getByText('Traditional Recipes')).toBeInTheDocument();
    expect(screen.getByText('Cozy Atmosphere')).toBeInTheDocument();
    
    const featureImages = screen.getAllByRole('img');
    // Should have hero image + 3 feature images + 2 logo images = 6 total
    expect(featureImages).toHaveLength(6);
  });

  // Test 5: Booking form presence
  test('renders booking form with all required fields', () => {
    expect(screen.getByRole('heading', { name: /reserve your table/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reservation date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reservation time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reserve table/i })).toBeInTheDocument();
  });

  // Test 6: Footer content
  test('renders footer with copyright and contact information', () => {
    expect(screen.getByText(/© 2024 little lemon restaurant/i)).toBeInTheDocument();
    expect(screen.getByText(/123 mediterranean ave/i)).toBeInTheDocument();
  });
});

describe('Booking Form Functionality', () => {
  let user;
  
  beforeEach(() => {
    user = userEvent.setup();
    render(<App />);
  });

  // Test 7: Form validation - required fields
  test('shows validation errors for empty required fields', async () => {
    const submitButton = screen.getByRole('button', { name: /reserve table/i });
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/time is required/i)).toBeInTheDocument();
      expect(screen.getByText(/number of guests is required/i)).toBeInTheDocument();
    });
  });

  // Test 8: Email validation
  test('validates email format', async () => {
    const emailInput = screen.getByLabelText(/email address/i);
    
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByRole('button', { name: /reserve table/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  // Test 9: Phone validation
  test('validates phone number format', async () => {
    const phoneInput = screen.getByLabelText(/phone number/i);
    
    await user.type(phoneInput, 'abc123');
    await user.click(screen.getByRole('button', { name: /reserve table/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument();
    });
  });

  // Test 10: Successful form submission
  test('submits form successfully with valid data', async () => {
    // Fill out all required fields
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '1234567890');
    
    // Set date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await user.type(screen.getByLabelText(/reservation date/i), dateString);
    
    await user.selectOptions(screen.getByLabelText(/reservation time/i), '19:00');
    await user.selectOptions(screen.getByLabelText(/number of guests/i), '2');
    
    await user.click(screen.getByRole('button', { name: /reserve table/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/thank you! your reservation has been submitted successfully/i)).toBeInTheDocument();
    });
  });

  // Test 11: Form reset after submission
  test('resets form after successful submission', async () => {
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    
    // Fill out form
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '1234567890');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await user.type(screen.getByLabelText(/reservation date/i), dateString);
    
    await user.selectOptions(screen.getByLabelText(/reservation time/i), '19:00');
    await user.selectOptions(screen.getByLabelText(/number of guests/i), '2');
    
    await user.click(screen.getByRole('button', { name: /reserve table/i }));
    
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });
});

describe('Accessibility Features', () => {
  beforeEach(() => {
    render(<App />);
  });

  // Test 12: ARIA labels and roles
  test('has proper ARIA labels and roles', () => {
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/little lemon restaurant logo/i)).toHaveLength(2);
  });

  // Test 13: Form accessibility
  test('form has proper accessibility attributes', () => {
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    
    expect(nameInput).toHaveAttribute('aria-invalid', 'false');
    expect(emailInput).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  // Test 14: Error messages have proper ARIA attributes
  test('error messages have proper ARIA attributes', async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /reserve table/i });
    
    await user.click(submitButton);
    
    await waitFor(() => {
      const nameError = screen.getByText(/name is required/i);
      expect(nameError).toHaveAttribute('role', 'alert');
    });
  });
});

describe('Responsive Design', () => {
  // Test 15: Mobile menu functionality
  test('mobile menu toggle works', async () => {
    const user = userEvent.setup();
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    render(<App />);
    
    const menuToggle = screen.getByLabelText(/toggle navigation menu/i);
    expect(menuToggle).toBeInTheDocument();
    
    await user.click(menuToggle);
    expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
    
    await user.click(menuToggle);
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('User Interactions', () => {
  // Test 16: CTA button scrolls to booking form
  test('CTA button scrolls to booking form', async () => {
    const user = userEvent.setup();
    
    // Mock scrollIntoView
    const mockScrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;
    
    render(<App />);
    
    const ctaButton = screen.getByRole('button', { name: /reserve a table/i });
    await user.click(ctaButton);
    
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});