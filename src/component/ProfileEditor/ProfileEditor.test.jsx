/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import ProfileEditor from './ProfileEditor';
import '@testing-library/jest-dom';

describe('ProfileEditor Component', () => {
  afterEach(() => {
    cleanup(); // Clean up the DOM after each test
  });

  it('handles cancel button click', () => {
    const onCancelMock = jest.fn();
    const profile = { name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890' };

    render(<ProfileEditor profile={profile} onSave={jest.fn()} onCancel={onCancelMock} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancelMock).toHaveBeenCalled();
  });

  it('renders ProfileEditor with initial profile data', () => {
    const onSaveMock = jest.fn();
    const onCancelMock = jest.fn();
    const profile = { name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890' };

    render(<ProfileEditor profile={profile} onSave={onSaveMock} onCancel={onCancelMock} />);

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
  });
  
  it('displays validation errors for empty fields', () => {
    const onSaveMock = jest.fn();
    const onCancelMock = jest.fn();
    const profile = { name: '', email: '', phone: '' };
  
    render(<ProfileEditor profile={profile} onSave={onSaveMock} onCancel={onCancelMock} />);
  
    fireEvent.click(screen.getByText('Save'));
  
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it('displays validation errors for invalid email', () => {
    const onSaveMock = jest.fn();
    const onCancelMock = jest.fn();
    const profile = { name: 'John Doe', email: 'invalidemail', phone: '1234567890' };
  
    render(<ProfileEditor profile={profile} onSave={onSaveMock} onCancel={onCancelMock} />);
  
    fireEvent.click(screen.getByText('Save'));
  
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it('displays validation errors for invalid phone number', () => {
    const onSaveMock = jest.fn();
    const onCancelMock = jest.fn();
    const profile = { name: 'John Doe', email: 'john.doe@example.com', phone: '123' };
  
    render(<ProfileEditor profile={profile} onSave={onSaveMock} onCancel={onCancelMock} />);
  
    fireEvent.click(screen.getByText('Save'));
  
    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
    expect(onSaveMock).not.toHaveBeenCalled();
  });

});
