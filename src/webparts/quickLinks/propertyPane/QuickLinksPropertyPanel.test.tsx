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

  const getUrlInput = (): HTMLInputElement => {
    // Get URL input by its accessible label for better test resilience
    return screen.getByRole('textbox', { name: /URL/i }) as HTMLInputElement;
  };

  // Tests for invalid URLs (missing protocol, not relative)
  it('should mark URL field as invalid when URL has no protocol and is not relative', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter invalid URL (no protocol, not relative)
    fireEvent.change(urlInput, { target: { value: 'www.google.com' } });
    
    // Should mark field as invalid
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('should mark URL field as invalid for javascript: URLs', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter dangerous URL
    // eslint-disable-next-line no-script-url
    fireEvent.change(urlInput, { target: { value: 'javascript:alert("XSS")' } });
    
    // Should mark field as invalid
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('should mark URL field as invalid for data: URLs', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter dangerous URL
    fireEvent.change(urlInput, { target: { value: 'data:text/html,<script>alert("XSS")</script>' } });
    
    // Should mark field as invalid
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
  });

  // Tests for valid absolute URLs
  it('should mark URL field as valid when URL starts with https://', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter valid HTTPS URL
    fireEvent.change(urlInput, { target: { value: 'https://www.google.com' } });
    
    // Should mark field as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should mark URL field as valid when URL starts with http://', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter valid HTTP URL
    fireEvent.change(urlInput, { target: { value: 'http://www.example.com' } });
    
    // Should mark field as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  // Tests for valid relative URLs
  it('should mark URL field as valid for root-relative URLs', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter root-relative URL
    fireEvent.change(urlInput, { target: { value: '/sites/MySite' } });
    
    // Should mark field as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should mark URL field as valid for dot-relative URLs', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter dot-relative URL
    fireEvent.change(urlInput, { target: { value: './page.aspx' } });
    
    // Should mark field as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should mark URL field as valid for parent-relative URLs', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter parent-relative URL
    fireEvent.change(urlInput, { target: { value: '../Documents' } });
    
    // Should mark field as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should mark URL field as valid for fragment URLs', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter fragment URL
    fireEvent.change(urlInput, { target: { value: '#section' } });
    
    // Should mark field as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should mark URL field as valid for query URLs', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter query URL
    fireEvent.change(urlInput, { target: { value: '?param=value' } });
    
    // Should mark field as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  // Button enablement tests
  it('should disable Add button when URL validation fails', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = screen.getByRole('textbox', { name: /Link Title/i });
    const urlInput = getUrlInput();
    
    // Fill in title
    fireEvent.change(titleInput, { target: { value: 'Google' } });
    
    // Enter invalid URL
    fireEvent.change(urlInput, { target: { value: 'www.google.com' } });
    
    // Add button should be disabled - find the actual button element
    const addButton = screen.getByText('Add Link').closest('button');
    expect(addButton).toBeDisabled();
  });

  it('should enable Add button when URL validation passes', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = screen.getByRole('textbox', { name: /Link Title/i });
    const urlInput = getUrlInput();
    const addButton = screen.getByText('Add Link').closest('button');
    
    // Fill in title
    fireEvent.change(titleInput, { target: { value: 'Google' } });
    
    // Enter valid URL
    fireEvent.change(urlInput, { target: { value: 'https://www.google.com' } });
    
    // Add button should be enabled
    expect(addButton).not.toBeDisabled();
  });

  // Add link tests
  it('should not add link when URL is invalid', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = screen.getByRole('textbox', { name: /Link Title/i });
    const urlInput = getUrlInput();
    
    // Fill in form with invalid URL
    fireEvent.change(titleInput, { target: { value: 'Google' } });
    fireEvent.change(urlInput, { target: { value: 'www.google.com' } });
    
    // Try to add (button is disabled, but let's ensure handler works correctly too)
    const addButton = screen.getByText('Add Link').closest('button');
    fireEvent.click(addButton!);
    
    // onLinksChanged should not be called
    expect(mockOnLinksChanged).not.toHaveBeenCalled();
  });

  it('should add link when URL is valid with https://', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = screen.getByRole('textbox', { name: /Link Title/i });
    const urlInput = getUrlInput();
    
    // Fill in form with valid URL
    fireEvent.change(titleInput, { target: { value: 'Google' } });
    fireEvent.change(urlInput, { target: { value: 'https://www.google.com' } });
    
    // Add the link
    const addButton = screen.getByText('Add Link').closest('button');
    fireEvent.click(addButton!);
    
    // onLinksChanged should be called with the new link
    expect(mockOnLinksChanged).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'Google',
        url: 'https://www.google.com'
      })
    ]);
  });

  it('should add link when URL is a relative path', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = screen.getByRole('textbox', { name: /Link Title/i });
    const urlInput = getUrlInput();
    
    // Fill in form with relative URL
    fireEvent.change(titleInput, { target: { value: 'SharePoint Site' } });
    fireEvent.change(urlInput, { target: { value: '/sites/MySite' } });
    
    // Add the link
    const addButton = screen.getByText('Add Link').closest('button');
    fireEvent.click(addButton!);
    
    // onLinksChanged should be called with the new link
    expect(mockOnLinksChanged).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'SharePoint Site',
        url: '/sites/MySite'
      })
    ]);
  });

  // Trimming tests
  it('should clear validation error when URL is corrected', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter invalid URL
    fireEvent.change(urlInput, { target: { value: 'www.google.com' } });
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
    
    // Correct the URL
    fireEvent.change(urlInput, { target: { value: 'https://www.google.com' } });
    
    // Should be marked as valid
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should validate URL with uppercase HTTP', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter URL with uppercase HTTP
    fireEvent.change(urlInput, { target: { value: 'HTTP://www.example.com' } });
    
    // Should be valid (case insensitive)
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should validate URL with uppercase HTTPS', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const urlInput = getUrlInput();
    
    // Enter URL with uppercase HTTPS
    fireEvent.change(urlInput, { target: { value: 'HTTPS://www.example.com' } });
    
    // Should be valid (case insensitive)
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('should accept URL with leading/trailing spaces if valid after trimming', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = screen.getByRole('textbox', { name: /Link Title/i });
    const urlInput = getUrlInput();
    
    // Fill in title
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    
    // Enter URL with spaces but valid protocol
    fireEvent.change(urlInput, { target: { value: '  https://www.google.com  ' } });
    
    // Should be valid and trimmed
    expect(urlInput).toHaveAttribute('aria-invalid', 'false');
    expect(urlInput.value).toBe('https://www.google.com');
  });

  it('should trim URL before storing when adding', () => {
    render(<QuickLinksPropertyPanel {...defaultProps} />);
    
    const titleInput = screen.getByRole('textbox', { name: /Link Title/i });
    const urlInput = getUrlInput();
    
    // Fill in form with URL that has spaces
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    fireEvent.change(urlInput, { target: { value: '  https://example.com  ' } });
    
    // Add the link
    const addButton = screen.getByText('Add Link').closest('button');
    fireEvent.click(addButton!);
    
    // URL should be stored without spaces
    expect(mockOnLinksChanged).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'Test',
        url: 'https://example.com'
      })
    ]);
  });

  // Edit mode tests
  it('should disable Update button when URL validation fails in edit mode', () => {
    const existingLinks: IQuickLinkItem[] = [
      {
        title: 'Existing Link',
        url: 'https://existing.com',
        icon: 'Link',
        openInNewTab: true
      }
    ];

    render(<QuickLinksPropertyPanel {...defaultProps} links={existingLinks} />);
    
    // Click edit button using aria-label
    const editButton = screen.getByLabelText('Edit link: Existing Link');
    fireEvent.click(editButton);
    
    // URL input should now have the existing URL
    const urlInput = getUrlInput();
    expect(urlInput).toHaveValue('https://existing.com');
    
    // Change to invalid URL
    fireEvent.change(urlInput, { target: { value: 'invalid-url.com' } });
    
    // Update button should be disabled
    const updateButton = screen.getByText('Update').closest('button');
    expect(updateButton).toBeDisabled();
  });

  it('should clear validation error when entering edit mode', () => {
    const existingLinks: IQuickLinkItem[] = [
      {
        title: 'Existing Link',
        url: 'https://existing.com',
        icon: 'Link',
        openInNewTab: true
      }
    ];

    render(<QuickLinksPropertyPanel {...defaultProps} links={existingLinks} />);
    
    // First add an invalid URL to create error state
    const urlInput = getUrlInput();
    fireEvent.change(urlInput, { target: { value: 'invalid.com' } });
    
    // Should have error
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
    
    // Click edit button using aria-label
    const editButton = screen.getByLabelText('Edit link: Existing Link');
    fireEvent.click(editButton);
    
    // Error should be cleared and URL field should have existing valid URL
    const urlInputAfterEdit = getUrlInput();
    expect(urlInputAfterEdit).toHaveValue('https://existing.com');
    expect(urlInputAfterEdit).toHaveAttribute('aria-invalid', 'false');
  });

  it('should trim URL before storing when updating', () => {
    const existingLinks: IQuickLinkItem[] = [
      {
        title: 'Existing',
        url: 'https://existing.com',
        icon: 'Link',
        openInNewTab: true
      }
    ];

    render(<QuickLinksPropertyPanel {...defaultProps} links={existingLinks} />);
    
    // Click edit button using aria-label
    const editButton = screen.getByLabelText('Edit link: Existing');
    fireEvent.click(editButton);
    
    // Change URL with spaces
    const urlInput = getUrlInput();
    fireEvent.change(urlInput, { target: { value: '  https://updated.com  ' } });
    
    // Update the link
    const updateButton = screen.getByText('Update').closest('button');
    fireEvent.click(updateButton!);
    
    // URL should be stored without spaces
    expect(mockOnLinksChanged).toHaveBeenCalledWith([
      expect.objectContaining({
        title: 'Existing',
        url: 'https://updated.com'
      })
    ]);
  });
});
