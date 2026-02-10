import * as React from 'react';
import styles from './QuickLinks.module.scss';
import type { IQuickLinksProps } from './IQuickLinksProps';
import type { IQuickLinkItem } from './IQuickLinkItem';
import { Icon } from '@fluentui/react/lib/Icon';
import * as strings from 'QuickLinksWebPartStrings';

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

  private renderIcon(link: IQuickLinkItem): JSX.Element {
    const iconType = link.iconType || 'fluent';
    
    if (iconType === 'custom' && link.icon) {
      // Validate custom icon URL to prevent XSS
      const isValidIconUrl = this.isValidUrl(link.icon);
      if (isValidIconUrl) {
        return (
          <>
            <img 
              src={link.icon} 
              alt="" 
              role="presentation"
              className={styles.customIcon}
              onError={(e) => {
                // Fallback to default icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallbackIcon = parent.querySelector('.ms-Icon') as HTMLElement;
                  if (fallbackIcon) {
                    fallbackIcon.style.display = 'inline-block';
                  }
                }
              }}
            />
            <Icon iconName="Link" className={styles.icon} style={{ display: 'none' }} aria-hidden="true" />
          </>
        );
      } else {
        // Invalid custom icon URL, fallback to default Link icon
        return <Icon iconName="Link" className={styles.icon} aria-hidden="true" />;
      }
    }
    
    // Default to Fluent UI icon
    return <Icon iconName={link.icon || 'Link'} className={styles.icon} aria-hidden="true" />;
  }

  public render(): React.ReactElement<IQuickLinksProps> {
    const { title, links } = this.props;

    return (
      <section className={styles.quickLinks} aria-label={title || 'Quick Links'}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.linksContainer} role="list">
          {links && links.length > 0 ? (
            links.map((link, index) => {
              const isValid = this.isValidUrl(link.url);
              const safeUrl = isValid ? link.url : '#';
              
              // Create accessible label for the link
              // Include "opens in new tab" in aria-label to avoid duplication with aria-describedby
              const ariaLabel = link.openInNewTab 
                ? `${link.title} ${strings.OpensInNewTabSuffix}` 
                : link.title;
              
              return (
                <div key={index} role="listitem">
                  <a
                    href={safeUrl}
                    className={styles.linkCard}
                    target={link.openInNewTab ? '_blank' : '_self'}
                    rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                    aria-label={ariaLabel}
                    {...(!isValid && { 
                      onClick: (e) => { e.preventDefault(); },
                      'aria-disabled': 'true'
                    })}
                  >
                    <div className={styles.iconContainer} aria-hidden="true">
                      {this.renderIcon(link)}
                    </div>
                    <div className={styles.linkText}>
                      <span className={styles.linkTitle}>{link.title}</span>
                    </div>
                  </a>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState} role="status" aria-live="polite">
              <Icon iconName="Link" className={styles.emptyIcon} aria-hidden="true" />
              <p>{strings.NoLinksMessage}</p>
            </div>
          )}
        </div>
      </section>
    );
  }
}
