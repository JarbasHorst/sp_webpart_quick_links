import * as React from 'react';
import styles from './QuickLinks.module.scss';
import type { IQuickLinksProps } from './IQuickLinksProps';
import { Icon } from '@fluentui/react/lib/Icon';

export default class QuickLinks extends React.Component<IQuickLinksProps> {
  private isValidUrl(url: string): boolean {
    // Validate URL to prevent XSS attacks
    // Allow only http, https, and relative URLs
    if (!url) return false;
    
    const trimmedUrl = url.trim();
    const lowerUrl = trimmedUrl.toLowerCase();
    
    // Reject javascript: and data: URLs
    // eslint-disable-next-line no-script-url
    if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:')) {
      return false;
    }
    
    // Allow http, https, relative URLs, and same-page fragments/queries
    return lowerUrl.startsWith('http://') || 
           lowerUrl.startsWith('https://') || 
           trimmedUrl.startsWith('/') ||
           trimmedUrl.startsWith('./') ||
           trimmedUrl.startsWith('../') ||
           trimmedUrl.startsWith('#') ||
           trimmedUrl.startsWith('?');
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
                  {...(!isValid && { onClick: (e) => { e.preventDefault(); } })}
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
