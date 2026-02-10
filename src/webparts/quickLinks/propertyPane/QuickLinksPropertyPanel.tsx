import * as React from 'react';
import { IQuickLinkItem } from '../components/IQuickLinkItem';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton, DefaultButton, IconButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { Label } from '@fluentui/react/lib/Label';
import { ChoiceGroup } from '@fluentui/react/lib/ChoiceGroup';
import styles from './QuickLinksPropertyPanel.module.scss';
import * as strings from 'QuickLinksWebPartStrings';

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
      return strings.URLErrorDangerousScheme;
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
    return strings.URLErrorInvalidFormat;
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
        <div className={styles.linkForm} role="form" aria-label={editingIndex >= 0 ? strings.EditFormAriaLabel : strings.AddFormAriaLabel}>
          <TextField
            label={strings.LinkTitleLabel}
            value={newLink.title}
            onChange={(_, value) => this.setState({ newLink: { ...newLink, title: value || '' } })}
            required
            aria-required="true"
            description={strings.LinkTitleDescription}
          />
          <TextField
            label={strings.URLLabel}
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
            description={strings.URLDescription}
          />
          <ChoiceGroup
            label={strings.IconTypeLabel}
            selectedKey={newLink.iconType || 'fluent'}
            options={[
              { key: 'fluent', text: strings.FluentUIIconOption, ariaLabel: strings.FluentUIIconAriaLabel },
              { key: 'custom', text: strings.CustomImageURLOption, ariaLabel: strings.CustomImageURLAriaLabel }
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
            {strings.IconTypeDescription}
          </span>
          <TextField
            label={newLink.iconType === 'custom' ? strings.ImageURLLabel : strings.IconNameLabel}
            value={newLink.icon}
            onChange={(_, value) => this.setState({ newLink: { ...newLink, icon: value || this.getDefaultIconValue(newLink.iconType) } })}
            placeholder={newLink.iconType === 'custom' ? strings.ImageURLPlaceholder : strings.IconNamePlaceholder}
            description={newLink.iconType === 'custom' 
              ? strings.ImageURLDescription
              : strings.IconNameDescription}
            aria-label={newLink.iconType === 'custom' ? strings.ImageURLLabel : strings.IconNameLabel}
          />
          <Checkbox
            label={strings.OpenInNewTabLabel}
            checked={newLink.openInNewTab}
            onChange={(_, checked) => this.setState({ newLink: { ...newLink, openInNewTab: !!checked } })}
            ariaLabel={strings.OpenInNewTabAriaLabel}
          />
          <div className={styles.buttonGroup} role="group" aria-label={strings.AddLinkButtonAriaLabel}>
            {editingIndex >= 0 ? (
              <>
                <PrimaryButton 
                  text={strings.UpdateButton}
                  onClick={this.handleUpdateLink} 
                  disabled={!newLink.title || !newLink.url || !!urlError}
                  ariaLabel={strings.UpdateButtonAriaLabel}
                />
                <DefaultButton 
                  text={strings.CancelButton}
                  onClick={this.handleCancelEdit}
                  ariaLabel={strings.CancelButtonAriaLabel}
                />
              </>
            ) : (
              <PrimaryButton 
                text={strings.AddLinkButton}
                onClick={this.handleAddLink} 
                disabled={!newLink.title || !newLink.url || !!urlError}
                ariaLabel={strings.AddLinkButtonAriaLabel}
              />
            )}
          </div>
        </div>

        {/* List of existing links */}
        {links.length > 0 && (
          <div className={styles.linksList}>
            <Label>{strings.CurrentLinksLabel} ({links.length})</Label>
            <div role="list" aria-label={`${links.length} ${strings.ConfiguredLinksAriaLabel}${links.length !== 1 ? 's' : ''}`}>
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
                        {link.openInNewTab ? strings.OpensInNewTab : strings.OpensInSameTab}
                        {iconType === 'custom' && ` • ${strings.CustomIcon}`}
                      </div>
                    </div>
                  </div>
                  <div className={styles.linkActions} role="group" aria-label={strings.LinkActionsAriaLabelFormat.replace('{0}', link.title)}>
                  <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    title={strings.EditLinkTitleFormat.replace('{0}', link.title)}
                    ariaLabel={strings.EditLinkAriaLabelFormat.replace('{0}', link.title)}
                    onClick={() => this.handleEditLink(index)}
                    disabled={editingIndex >= 0}
                    className={styles.iconButton}
                  />
                  <IconButton
                    iconProps={{ iconName: 'Delete' }}
                    title={strings.DeleteLinkTitleFormat.replace('{0}', link.title)}
                    ariaLabel={strings.DeleteLinkAriaLabelFormat.replace('{0}', link.title)}
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
