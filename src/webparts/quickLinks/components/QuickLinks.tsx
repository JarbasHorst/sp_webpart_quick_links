import * as React from 'react';
import styles from './QuickLinks.module.scss';
import type { IQuickLinksProps } from './IQuickLinksProps';
import type { IQuickLinkItem } from './IQuickLinkItem';
import { Icon } from '@fluentui/react/lib/Icon';

export default class QuickLinks extends React.Component<IQuickLinksProps> {
  private isValidUrl(url: string): boolean {
    // Validate URL to prevent XSS attacks
    // Allow only http, https, and relative URLs
    if (!url) return false;
    
    const trimmedUrl = url.trim().toLowerCase();
    
    // Reject javascript: and data: URLs
    if (trimmedUrl.startsWith('javascript:') || trimmedUrl.startsWith('data:')) {
      return false;
    }
    
    // Allow http, https, and relative URLs
    return trimmedUrl.startsWith('http://') || 
           trimmedUrl.startsWith('https://') || 
           trimmedUrl.startsWith('/') ||
           trimmedUrl.startsWith('./') ||
           trimmedUrl.startsWith('../');
  }

  public render(): React.ReactElement<IQuickLinksProps> {
    const { title, links } = this.props;

    return (
      <section className={styles.quickLinks}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.linksContainer}>
          {links && links.length > 0 ? (
            links.map((link, index) => {
              const isValid = this.isValidUrl(link.url);
              const safeUrl = isValid ? link.url : '#';
              
              return (
                <a
                  key={index}
                  href={safeUrl}
                  className={styles.linkCard}
                  target={link.openInNewTab ? '_blank' : '_self'}
                  rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                  onClick={!isValid ? (e) => { e.preventDefault(); } : undefined}
                >
                  <div className={styles.iconContainer}>
                    <Icon iconName={link.icon || 'Link'} className={styles.icon} />
                  </div>
                  <div className={styles.linkText}>
                    <span className={styles.linkTitle}>{link.title}</span>
                  </div>
                </a>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <Icon iconName="Link" className={styles.emptyIcon} />
              <p>No quick links configured. Please edit the web part to add links.</p>
            </div>
          )}
        </div>
      </section>
    );
  }
}
