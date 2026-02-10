import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuickLinksPropertyPanel from './QuickLinksPropertyPanel';
import { IQuickLinkItem } from '../components/IQuickLinkItem';

describe('QuickLinksPropertyPanel URL Validation', () => {
  const mockOnLinksChanged = jest.fn();

  const defaultProps = {
    label: 'Quick Links',
    links: [] as IQuickLinkItem[],
    onLinksChanged: mockOnLinksChanged
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getUrlInput = (container: HTMLElement): HTMLInputElement => {
    // Get the URL textfield specifically - it's the second textbox
    const textboxes = container.querySelectorAll('input[type="text"]');
    return textboxes[1] as HTMLInputElement;
  };

  it('should mark URL field as invalid when URL does not start with http:// or https://', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput(container);
    
    // Enter invalid URL
    fireEvent.change(urlInput, { target: { value: 'www.google.com' } });
    
    // Should mark field as invalid
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('should mark URL field as valid when URL starts with https://', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput(container);
    
    // Enter valid HTTPS URL
    fireEvent.change(urlInput, { target: { value: 'https://www.google.com' } });
    
    // Should mark field as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should mark URL field as valid when URL starts with http://', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput(container);
    
    // Enter valid HTTP URL
    fireEvent.change(urlInput, { target: { value: 'http://www.example.com' } });
    
    // Should mark field as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should disable Add button when URL validation fails', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    const urlInput = getUrlInput(container);
    
    // Fill in title
    fireEvent.change(titleInput, { target: { value: 'Google' } });
    
    // Enter invalid URL
    fireEvent.change(urlInput, { target: { value: 'www.google.com' } });
    
    // Add button should be disabled - find the actual button element
    const addButton = screen.getByText('Add Link').closest('button');
    expect(addButton).toBeDisabled();
  });

  it('should enable Add button when URL validation passes', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    const urlInput = getUrlInput(container);
    const addButton = screen.getByText('Add Link');
    
    // Fill in title
    fireEvent.change(titleInput, { target: { value: 'Google' } });
    
    // Enter valid URL
    fireEvent.change(urlInput, { target: { value: 'https://www.google.com' } });
    
    // Add button should be enabled
    expect(addButton).not.toBeDisabled();
  });

  it('should not add link when URL is invalid', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    const urlInput = getUrlInput(container);
    const addButton = screen.getByText('Add Link');
    
    // Fill in form with invalid URL
    fireEvent.change(titleInput, { target: { value: 'Google' } });
    fireEvent.change(urlInput, { target: { value: 'www.google.com' } });
    
    // Try to add (button is disabled, but let's ensure handler works correctly too)
    fireEvent.click(addButton);
    
    // onLinksChanged should not be called
    expect(mockOnLinksChanged).not.toHaveBeenCalled();
  });

  it('should add link when URL is valid with https://', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    const urlInput = getUrlInput(container);
    const addButton = screen.getByText('Add Link');
    
    // Fill in form with valid URL
    fireEvent.change(titleInput, { target: { value: 'Google' } });
    fireEvent.change(urlInput, { target: { value: 'https://www.google.com' } });
    
    // Add the link
    fireEvent.click(addButton);
    
    // onLinksChanged should be called with the new link
    expect(mockOnLinksChanged).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'Google',
        url: 'https://www.google.com'
      })
    ]);
  });

  it('should add link when URL is valid with http://', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    const urlInput = getUrlInput(container);
    const addButton = screen.getByText('Add Link');
    
    // Fill in form with valid URL
    fireEvent.change(titleInput, { target: { value: 'Example' } });
    fireEvent.change(urlInput, { target: { value: 'http://www.example.com' } });
    
    // Add the link
    fireEvent.click(addButton);
    
    // onLinksChanged should be called with the new link
    expect(mockOnLinksChanged).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'Example',
        url: 'http://www.example.com'
      })
    ]);
  });

  it('should clear validation error when URL is corrected', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput(container);
    
    // Enter invalid URL
    fireEvent.change(urlInput, { target: { value: 'www.google.com' } });
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
    
    // Correct the URL
    fireEvent.change(urlInput, { target: { value: 'https://www.google.com' } });
    
    // Should be marked as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should validate URL with uppercase HTTP', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput(container);
    
    // Enter URL with uppercase HTTP
    fireEvent.change(urlInput, { target: { value: 'HTTP://www.example.com' } });
    
    // Should be valid (case insensitive)
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should validate URL with uppercase HTTPS', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput(container);
    
    // Enter URL with uppercase HTTPS
    fireEvent.change(urlInput, { target: { value: 'HTTPS://www.example.com' } });
    
    // Should be valid (case insensitive)
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should show validation error for URL with leading/trailing spaces but no protocol', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput(container);
    
    // Enter URL with spaces
    fireEvent.change(urlInput, { target: { value: '  www.google.com  ' } });
    
    // Should be marked as invalid
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('should accept URL with leading/trailing spaces if protocol is present', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput(container);
    
    // Enter URL with spaces but valid protocol
    fireEvent.change(urlInput, { target: { value: '  https://www.google.com  ' } });
    
    // Should be valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should show validation error for URLs starting with ftp://', () => {
    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput(container);
    
    // Enter FTP URL
    fireEvent.change(urlInput, { target: { value: 'ftp://ftp.example.com' } });
    
    // Should be marked as invalid (only http/https allowed)
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('should disable Update button when URL validation fails in edit mode', () => {
    const existingLinks: IQuickLinkItem[] = [
      {
        title: 'Existing Link',
        url: 'https://existing.com',
        icon: 'Link',
        openInNewTab: true
      }
    ];

    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} links={existingLinks} />);
    
    // Click edit button
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);
    
    // URL input should now have the existing URL
    const urlInput = getUrlInput(container);
    expect(urlInput).toHaveValue('https://existing.com');
    
    // Change to invalid URL
    fireEvent.change(urlInput, { target: { value: 'invalid-url.com' } });
    
    // Update button should be disabled - find the actual button element
    const updateButton = screen.getByText('Update').closest('button');
    expect(updateButton).toBeDisabled();
  });

  it('should clear validation error when edit is cancelled', () => {
    const existingLinks: IQuickLinkItem[] = [
      {
        title: 'Existing Link',
        url: 'https://existing.com',
        icon: 'Link',
        openInNewTab: true
      }
    ];

    const { container } = render(<QuickLinksPropertyPanel {...defaultProps} links={existingLinks} />);
    
    // Click edit button
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);
    
    // Change to invalid URL
    const urlInput = getUrlInput(container);
    fireEvent.change(urlInput, { target: { value: 'invalid.com' } });
    
    // Should be marked as invalid
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
    
    // Cancel edit
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Should clear the form - get URL input again after cancel
    const urlInputAfterCancel = getUrlInput(container);
    expect(urlInputAfterCancel.value).toBe('');
  });
});
