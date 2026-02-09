import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuickLinks from './QuickLinks';
import { IQuickLinksProps } from './IQuickLinksProps';
import { IQuickLinkItem } from './IQuickLinkItem';

describe('QuickLinks Component', () => {
  const mockLinks: IQuickLinkItem[] = [
    {
      title: 'Test Link 1',
      url: 'https://example.com',
      icon: 'Document',
      openInNewTab: true
    },
    {
      title: 'Test Link 2',
      url: '/relative/path',
      icon: 'Link',
      openInNewTab: false
    }
  ];

  const defaultProps: IQuickLinksProps = {
    title: 'Test Title',
    links: mockLinks,
    isDarkTheme: false
  };

  it('should render the component with title and links', () => {
    render(<QuickLinks {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Link 1')).toBeInTheDocument();
    expect(screen.getByText('Test Link 2')).toBeInTheDocument();
  });

  it('should render without title when title is empty', () => {
    const props = { ...defaultProps, title: '' };
    const { container } = render(<QuickLinks {...props} />);
    
    const titleElement = container.querySelector('h2');
    expect(titleElement).not.toBeInTheDocument();
  });

  it('should render empty state when no links are provided', () => {
    const props = { ...defaultProps, links: [] };
    render(<QuickLinks {...props} />);
    
    expect(screen.getByText(/No quick links configured/i)).toBeInTheDocument();
  });

  it('should render links with correct href attributes', () => {
    const { container } = render(<QuickLinks {...defaultProps} />);
    
    const links = container.querySelectorAll('a');
    expect(links[0]).toHaveAttribute('href', 'https://example.com');
    expect(links[1]).toHaveAttribute('href', '/relative/path');
  });

  it('should render links with target="_blank" when openInNewTab is true', () => {
    const { container } = render(<QuickLinks {...defaultProps} />);
    
    const links = container.querySelectorAll('a');
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render links with target="_self" when openInNewTab is false', () => {
    const { container } = render(<QuickLinks {...defaultProps} />);
    
    const links = container.querySelectorAll('a');
    expect(links[1]).toHaveAttribute('target', '_self');
    expect(links[1]).not.toHaveAttribute('rel');
  });

  it('should prevent XSS attacks by rejecting javascript: URLs', () => {
    const xssLinks: IQuickLinkItem[] = [
      {
        title: 'XSS Link',
        // eslint-disable-next-line no-script-url
        url: 'javascript:alert("XSS")',
        icon: 'Link',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: xssLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '#');
  });

  it('should prevent XSS attacks by rejecting data: URLs', () => {
    const xssLinks: IQuickLinkItem[] = [
      {
        title: 'Data URL',
        url: 'data:text/html,<script>alert("XSS")</script>',
        icon: 'Link',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: xssLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '#');
  });

  it('should accept valid http URLs', () => {
    const httpLinks: IQuickLinkItem[] = [
      {
        title: 'HTTP Link',
        url: 'http://example.com',
        icon: 'Link',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: httpLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', 'http://example.com');
  });

  it('should accept valid https URLs', () => {
    const httpsLinks: IQuickLinkItem[] = [
      {
        title: 'HTTPS Link',
        url: 'https://example.com',
        icon: 'Link',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: httpsLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should accept relative URLs starting with /', () => {
    const relativeLinks: IQuickLinkItem[] = [
      {
        title: 'Relative Link',
        url: '/path/to/page',
        icon: 'Link',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: relativeLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/path/to/page');
  });

  it('should accept relative URLs starting with ./', () => {
    const relativeLinks: IQuickLinkItem[] = [
      {
        title: 'Relative Link',
        url: './page',
        icon: 'Link',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: relativeLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', './page');
  });

  it('should accept relative URLs starting with ../', () => {
    const relativeLinks: IQuickLinkItem[] = [
      {
        title: 'Parent Relative Link',
        url: '../parent/page',
        icon: 'Link',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: relativeLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '../parent/page');
  });

  it('should accept query string URLs starting with ?', () => {
    const queryLinks: IQuickLinkItem[] = [
      {
        title: 'Query String Link',
        url: '?param=value',
        icon: 'Link',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: queryLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '?param=value');
  });

  it('should accept fragment URLs starting with #', () => {
    const fragmentLinks: IQuickLinkItem[] = [
      {
        title: 'Fragment Link',
        url: '#section',
        icon: 'Link',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: fragmentLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '#section');
  });

  it('should reject empty URLs', () => {
    const emptyLinks: IQuickLinkItem[] = [
      {
        title: 'Empty URL',
        url: '',
        icon: 'Link',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: emptyLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '#');
  });

  it('should use default icon when icon is not provided', () => {
    const linksWithoutIcon: IQuickLinkItem[] = [
      {
        title: 'Link without icon',
        url: 'https://example.com',
        icon: '',
        openInNewTab: false
      }
    ];
    const props = { ...defaultProps, links: linksWithoutIcon };
    const { container } = render(<QuickLinks {...props} />);
    
    // The component should render with default 'Link' icon
    expect(container.querySelector('i[data-icon-name="Link"]')).toBeInTheDocument();
  });

  it('should render custom icon when provided', () => {
    const { container } = render(<QuickLinks {...defaultProps} />);
    
    // First link has 'Document' icon
    expect(container.querySelector('i[data-icon-name="Document"]')).toBeInTheDocument();
  });

  it('should render custom image icon when iconType is custom', () => {
    const customIconLinks: IQuickLinkItem[] = [
      {
        title: 'Custom Link',
        url: 'https://example.com',
        icon: 'https://example.com/logo.png',
        iconType: 'custom',
        openInNewTab: true
      }
    ];
    const props = { ...defaultProps, links: customIconLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/logo.png');
    expect(img).toHaveAttribute('alt', 'Custom Link');
  });

  it('should use fluent icon when iconType is not specified', () => {
    const fluentIconLinks: IQuickLinkItem[] = [
      {
        title: 'Fluent Link',
        url: 'https://example.com',
        icon: 'Home',
        openInNewTab: true
      }
    ];
    const props = { ...defaultProps, links: fluentIconLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    expect(container.querySelector('i[data-icon-name="Home"]')).toBeInTheDocument();
  });

  it('should reject custom icon URLs with javascript: protocol', () => {
    const xssIconLinks: IQuickLinkItem[] = [
      {
        title: 'XSS Icon',
        url: 'https://example.com',
        // eslint-disable-next-line no-script-url
        icon: 'javascript:alert("XSS")',
        iconType: 'custom',
        openInNewTab: true
      }
    ];
    const props = { ...defaultProps, links: xssIconLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    // Should fallback to default Fluent icon
    expect(container.querySelector('i[data-icon-name="Link"]')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('should reject custom icon URLs with data: protocol', () => {
    const dataIconLinks: IQuickLinkItem[] = [
      {
        title: 'Data Icon',
        url: 'https://example.com',
        icon: 'data:image/svg+xml,<svg></svg>',
        iconType: 'custom',
        openInNewTab: true
      }
    ];
    const props = { ...defaultProps, links: dataIconLinks };
    const { container } = render(<QuickLinks {...props} />);
    
    // Should fallback to default Fluent icon
    expect(container.querySelector('i[data-icon-name="Link"]')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });
});
