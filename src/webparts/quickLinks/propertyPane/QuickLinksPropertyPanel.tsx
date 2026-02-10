import * as React from 'react';
import { IQuickLinkItem } from '../components/IQuickLinkItem';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton, DefaultButton, IconButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { Label } from '@fluentui/react/lib/Label';
import { ChoiceGroup } from '@fluentui/react/lib/ChoiceGroup';
import styles from './QuickLinksPropertyPanel.module.scss';

export interface IQuickLinksPropertyPanelProps {
  label: string;
  links: IQuickLinkItem[];
  onLinksChanged: (links: IQuickLinkItem[]) => void;
}

interface IQuickLinksPropertyPanelState {
  links: IQuickLinkItem[];
  editingIndex: number;
  newLink: IQuickLinkItem;
  urlError?: string;
}

export default class QuickLinksPropertyPanel extends React.Component<IQuickLinksPropertyPanelProps, IQuickLinksPropertyPanelState> {
  constructor(props: IQuickLinksPropertyPanelProps) {
    super(props);
    this.state = {
      links: props.links || [],
      editingIndex: -1,
      newLink: this.getEmptyLink(),
      urlError: undefined
    };
  }

  private getEmptyLink(): IQuickLinkItem {
    return {
      title: '',
      url: '',
      icon: 'Link',
      iconType: 'fluent',
      openInNewTab: true
    };
  }

  private getDefaultIconValue(iconType: 'fluent' | 'custom' | undefined): string {
    return iconType === 'custom' ? '' : 'Link';
  }

  private validateUrl(url: string): string | undefined {
    // Validate URL to match runtime component validation
    // Allow http, https, relative URLs, but reject dangerous schemes
    if (!url?.trim()) {
      return undefined; // Empty URL will be caught by required field validation
    }
    
    const trimmedUrl = url.trim();
    const lowerUrl = trimmedUrl.toLowerCase();
    
    // Explicitly block dangerous schemes (XSS prevention)
    // eslint-disable-next-line no-script-url
    if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:')) {
      return 'URLs using javascript: or data: schemes are not allowed';
    }
    
    // Allow http(s) URLs
    if (lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://')) {
      return undefined;
    }
    
    // Allow relative URLs (to match runtime component behavior)
    // Root/path-relative: /path
    // Dot-relative: ./path, ../path
    // Fragment-only: #anchor
    // Query-only: ?query
    if (
      trimmedUrl.startsWith('/') ||
      trimmedUrl.startsWith('./') ||
      trimmedUrl.startsWith('../') ||
      trimmedUrl.startsWith('#') ||
      trimmedUrl.startsWith('?')
    ) {
      return undefined;
    }
    
    // All other formats are invalid
    return 'URL must start with http://, https://, or be a relative URL (/, ./, ../, #, ?)';
  }

  private handleAddLink = (): void => {
    const { newLink, links } = this.state;
    
    // Trim and validate URL before adding
    const trimmedUrl = newLink.url.trim();
    const urlError = this.validateUrl(trimmedUrl);
    
    if (urlError) {
      this.setState({ urlError });
      return;
    }
    
    if (newLink.title && trimmedUrl) {
      // Store the link with trimmed URL
      const linkToAdd = { ...newLink, url: trimmedUrl };
      const updatedLinks = [...links, linkToAdd];
      this.setState({
        links: updatedLinks,
        newLink: this.getEmptyLink(),
        urlError: undefined
      });
      this.props.onLinksChanged(updatedLinks);
    }
  };

  private handleUpdateLink = (): void => {
    const { newLink, links, editingIndex } = this.state;
    
    // Trim and validate URL before updating
    const trimmedUrl = newLink.url.trim();
    const urlError = this.validateUrl(trimmedUrl);
    
    if (urlError) {
      this.setState({ urlError });
      return;
    }
    
    if (newLink.title && trimmedUrl && editingIndex >= 0) {
      // Store the link with trimmed URL
      const linkToUpdate = { ...newLink, url: trimmedUrl };
      const updatedLinks = [...links];
      updatedLinks[editingIndex] = linkToUpdate;
      this.setState({
        links: updatedLinks,
        editingIndex: -1,
        newLink: this.getEmptyLink(),
        urlError: undefined
      });
      this.props.onLinksChanged(updatedLinks);
    }
  };

  private handleDeleteLink = (index: number): void => {
    const updatedLinks = this.state.links.filter((_, i) => i !== index);
    this.setState({ links: updatedLinks });
    this.props.onLinksChanged(updatedLinks);
  };

  private handleEditLink = (index: number): void => {
    this.setState((prevState) => ({
      editingIndex: index,
      newLink: { ...prevState.links[index] },
      urlError: undefined // Clear any stale error when entering edit mode
    }));
  };

  private handleCancelEdit = (): void => {
    this.setState({
      editingIndex: -1,
      newLink: this.getEmptyLink(),
      urlError: undefined
    });
  };

  public render(): React.ReactElement<IQuickLinksPropertyPanelProps> {
    const { label } = this.props;
    const { links, newLink, editingIndex, urlError } = this.state;

    return (
      <div className={styles.quickLinksPropertyPanel}>
        <Label>{label}</Label>
        
        {/* Form for adding/editing links */}
        <div className={styles.linkForm} role="form" aria-label={editingIndex >= 0 ? "Edit quick link" : "Add new quick link"}>
          <TextField
            label="Link Title"
            value={newLink.title}
            onChange={(_, value) => this.setState({ newLink: { ...newLink, title: value || '' } })}
            required
            aria-required="true"
            description="Enter a descriptive title for the link"
          />
          <TextField
            label="URL"
            value={newLink.url}
            onChange={(_, value) => {
              const url = value ? value.trim() : '';
              const error = this.validateUrl(url);
              this.setState({ 
                newLink: { ...newLink, url },
                urlError: error
              });
            }}
            required
            aria-required="true"
            aria-invalid={!!urlError}
            errorMessage={urlError}
            description="Enter the full URL (e.g., https://example.com) or a relative URL"
          />
          <ChoiceGroup
            label="Icon Type"
            selectedKey={newLink.iconType || 'fluent'}
            options={[
              { key: 'fluent', text: 'Fluent UI Icon', ariaLabel: 'Use Fluent UI icon' },
              { key: 'custom', text: 'Custom Image URL', ariaLabel: 'Use custom image from URL' }
            ]}
            onChange={(_, option) => this.setState({ 
              newLink: { 
                ...newLink, 
                iconType: option?.key as 'fluent' | 'custom',
                icon: this.getDefaultIconValue(option?.key as 'fluent' | 'custom')
              } 
            })}
            aria-describedby="icon-type-description"
          />
          <span id="icon-type-description" className={styles.visuallyHidden}>
            Choose between a Fluent UI icon or a custom image for this link
          </span>
          <TextField
            label={newLink.iconType === 'custom' ? 'Image URL' : 'Icon Name'}
            value={newLink.icon}
            onChange={(_, value) => this.setState({ newLink: { ...newLink, icon: value || this.getDefaultIconValue(newLink.iconType) } })}
            placeholder={newLink.iconType === 'custom' ? 'https://example.com/logo.png' : 'Link'}
            description={newLink.iconType === 'custom' 
              ? 'Enter a full URL to an image (e.g., https://example.com/logo.png)' 
              : 'Enter a Fluent UI icon name (e.g., Home, Globe, Mail, Document)'}
            aria-label={newLink.iconType === 'custom' ? 'Custom image URL' : 'Fluent UI icon name'}
          />
          <Checkbox
            label="Open in new tab"
            checked={newLink.openInNewTab}
            onChange={(_, checked) => this.setState({ newLink: { ...newLink, openInNewTab: !!checked } })}
            ariaLabel="Open link in a new browser tab"
          />
          <div className={styles.buttonGroup} role="group" aria-label="Link actions">
            {editingIndex >= 0 ? (
              <>
                <PrimaryButton 
                  text="Update" 
                  onClick={this.handleUpdateLink} 
                  disabled={!newLink.title || !newLink.url || !!urlError}
                  ariaLabel="Update the link with new information"
                />
                <DefaultButton 
                  text="Cancel" 
                  onClick={this.handleCancelEdit}
                  ariaLabel="Cancel editing and discard changes"
                />
              </>
            ) : (
              <PrimaryButton 
                text="Add Link" 
                onClick={this.handleAddLink} 
                disabled={!newLink.title || !newLink.url || !!urlError}
                ariaLabel="Add the new link to the list"
              />
            )}
          </div>
        </div>

        {/* List of existing links */}
        {links.length > 0 && (
          <div className={styles.linksList}>
            <Label>Current Links ({links.length})</Label>
            <div role="list" aria-label={`${links.length} configured quick link${links.length !== 1 ? 's' : ''}`}>
            {links.map((link, index) => {
              const iconType = link.iconType || 'fluent';
              return (
                <div key={index} className={styles.linkItem} role="listitem">
                  <div className={styles.linkInfo}>
                    {iconType === 'custom' && link.icon ? (
                      <img src={link.icon} alt="" role="presentation" className={styles.linkIcon} />
                    ) : (
                      <Icon iconName={link.icon || 'Link'} className={styles.linkIcon} aria-hidden="true" />
                    )}
                    <div className={styles.linkDetails}>
                      <div className={styles.linkTitle}>{link.title}</div>
                      <div className={styles.linkUrl}>{link.url}</div>
                      <div className={styles.linkTarget}>
                        {link.openInNewTab ? 'Opens in new tab' : 'Opens in same tab'}
                        {iconType === 'custom' && ' • Custom icon'}
                      </div>
                    </div>
                  </div>
                  <div className={styles.linkActions} role="group" aria-label={`Actions for ${link.title}`}>
                  <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    title={`Edit ${link.title}`}
                    ariaLabel={`Edit link: ${link.title}`}
                    onClick={() => this.handleEditLink(index)}
                    disabled={editingIndex >= 0}
                    className={styles.iconButton}
                  />
                  <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    title={`Delete ${link.title}`}
                    ariaLabel={`Delete link: ${link.title}`}
                    onClick={() => this.handleDeleteLink(index)}
                    disabled={editingIndex >= 0}
                    className={styles.iconButton}
                  />
                </div>
              </div>
            );
            })}
            </div>
          </div>
        )}
      </div>
    );
  }
}
