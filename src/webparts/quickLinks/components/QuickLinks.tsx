import * as React from 'react';
import styles from './QuickLinks.module.scss';
import type { IQuickLinksProps } from './IQuickLinksProps';
import type { IQuickLinkItem } from './IQuickLinkItem';
import { Icon } from '@fluentui/react/lib/Icon';

export default class QuickLinks extends React.Component<IQuickLinksProps> {
  private handleLinkClick = (link: IQuickLinkItem, event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (!link.openInNewTab) {
      event.preventDefault();
      window.location.href = link.url;
    }
  };

  public render(): React.ReactElement<IQuickLinksProps> {
    const { title, links } = this.props;

    return (
      <section className={styles.quickLinks}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.linksContainer}>
          {links && links.length > 0 ? (
            links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className={styles.linkCard}
                target={link.openInNewTab ? '_blank' : '_self'}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={(e) => this.handleLinkClick(link, e)}
              >
                <div className={styles.iconContainer}>
                  <Icon iconName={link.icon || 'Link'} className={styles.icon} />
                </div>
                <div className={styles.linkText}>
                  <span className={styles.linkTitle}>{link.title}</span>
                </div>
              </a>
            ))
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
