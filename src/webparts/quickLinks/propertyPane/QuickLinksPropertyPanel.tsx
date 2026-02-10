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
    // URL must start with http:// or https://
    if (!url) {
      return undefined; // Empty URL will be caught by required validation
    }
    
    const trimmedUrl = url.trim();
    const lowerUrl = trimmedUrl.toLowerCase();
    
    if (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://')) {
      return 'URL must start with http:// or https://';
    }
    
    return undefined;
  }

  private handleAddLink = (): void => {
    const { newLink, links } = this.state;
    const urlError = this.validateUrl(newLink.url);
    
    if (urlError) {
      this.setState({ urlError });
      return;
    }
    
    if (newLink.title && newLink.url) {
      const updatedLinks = [...links, newLink];
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
    const urlError = this.validateUrl(newLink.url);
    
    if (urlError) {
      this.setState({ urlError });
      return;
    }
    
    if (newLink.title && newLink.url && editingIndex >= 0) {
      const updatedLinks = [...links];
      updatedLinks[editingIndex] = newLink;
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
      newLink: { ...prevState.links[index] }
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
        <div className={styles.linkForm}>
          <TextField
            label="Link Title"
            value={newLink.title}
            onChange={(_, value) => this.setState({ newLink: { ...newLink, title: value || '' } })}
            required
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
            errorMessage={urlError}
          />
          <ChoiceGroup
            label="Icon Type"
            selectedKey={newLink.iconType || 'fluent'}
            options={[
              { key: 'fluent', text: 'Fluent UI Icon' },
              { key: 'custom', text: 'Custom Image URL' }
            ]}
            onChange={(_, option) => this.setState({ 
              newLink: { 
                ...newLink, 
                iconType: option?.key as 'fluent' | 'custom',
                icon: this.getDefaultIconValue(option?.key as 'fluent' | 'custom')
              } 
            })}
          />
          <TextField
            label={newLink.iconType === 'custom' ? 'Image URL' : 'Icon Name'}
            value={newLink.icon}
            onChange={(_, value) => this.setState({ newLink: { ...newLink, icon: value || this.getDefaultIconValue(newLink.iconType) } })}
            placeholder={newLink.iconType === 'custom' ? 'https://example.com/logo.png' : 'Link'}
            description={newLink.iconType === 'custom' 
              ? 'Enter a full URL to an image (e.g., https://example.com/logo.png)' 
              : 'Enter a Fluent UI icon name (e.g., Home, Globe, Mail, Document)'}
          />
          <Checkbox
            label="Open in new tab"
            checked={newLink.openInNewTab}
            onChange={(_, checked) => this.setState({ newLink: { ...newLink, openInNewTab: !!checked } })}
          />
          <div className={styles.buttonGroup}>
            {editingIndex >= 0 ? (
              <>
                <PrimaryButton text="Update" onClick={this.handleUpdateLink} disabled={!newLink.title || !newLink.url || !!urlError} />
                <DefaultButton text="Cancel" onClick={this.handleCancelEdit} />
              </>
            ) : (
              <PrimaryButton text="Add Link" onClick={this.handleAddLink} disabled={!newLink.title || !newLink.url || !!urlError} />
            )}
          </div>
        </div>

        {/* List of existing links */}
        {links.length > 0 && (
          <div className={styles.linksList}>
            <Label>Current Links</Label>
            {links.map((link, index) => {
              const iconType = link.iconType || 'fluent';
              return (
                <div key={index} className={styles.linkItem}>
                  <div className={styles.linkInfo}>
                    {iconType === 'custom' && link.icon ? (
                      <img src={link.icon} alt={link.title} className={styles.linkIcon} />
                    ) : (
                      <Icon iconName={link.icon || 'Link'} className={styles.linkIcon} />
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
                  <div className={styles.linkActions}>
                  <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    title="Edit"
                    ariaLabel="Edit link"
                    onClick={() => this.handleEditLink(index)}
                    disabled={editingIndex >= 0}
                    className={styles.iconButton}
                  />
                  <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    title="Delete"
                    ariaLabel="Delete link"
                    onClick={() => this.handleDeleteLink(index)}
                    disabled={editingIndex >= 0}
                    className={styles.iconButton}
                  />
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    );
  }
}
