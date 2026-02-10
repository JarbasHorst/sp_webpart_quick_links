// Mock localized strings for tests - must be before other imports
jest.mock('QuickLinksWebPartStrings', () => ({
  PropertyPaneDescription: 'Description',
  BasicGroupName: 'Group Name',
  DescriptionFieldLabel: 'Description Field',
  AppLocalEnvironmentSharePoint: 'The app is running on your local environment as SharePoint web part',
  AppLocalEnvironmentTeams: 'The app is running on your local environment as Microsoft Teams app',
  AppLocalEnvironmentOffice: 'The app is running on your local environment in office.com',
  AppLocalEnvironmentOutlook: 'The app is running on your local environment in Outlook',
  AppSharePointEnvironment: 'The app is running on SharePoint page',
  AppTeamsTabEnvironment: 'The app is running in Microsoft Teams',
  AppOfficeEnvironment: 'The app is running in office.com',
  AppOutlookEnvironment: 'The app is running in Outlook',
  UnknownEnvironment: 'The app is running in an unknown environment',
  // Web Part property pane
  WebPartTitleLabel: 'Web Part Title',
  QuickLinksLabel: 'Quick Links',
  // Property pane form labels
  LinkTitleLabel: 'Link Title',
  LinkTitleDescription: 'Enter a descriptive title for the link',
  URLLabel: 'URL',
  URLDescription: 'Enter the full URL (e.g., https://example.com) or a relative URL',
  IconTypeLabel: 'Icon Type',
  FluentUIIconOption: 'Fluent UI Icon',
  FluentUIIconAriaLabel: 'Use Fluent UI icon',
  CustomImageURLOption: 'Custom Image URL',
  CustomImageURLAriaLabel: 'Use custom image from URL',
  IconTypeDescription: 'Choose between a Fluent UI icon or a custom image for this link',
  ImageURLLabel: 'Image URL',
  IconNameLabel: 'Icon Name',
  ImageURLPlaceholder: 'https://example.com/logo.png',
  IconNamePlaceholder: 'Link',
  ImageURLDescription: 'Enter a full URL to an image (e.g., https://example.com/logo.png)',
  IconNameDescription: 'Enter a Fluent UI icon name (e.g., Home, Globe, Mail, Document)',
  OpenInNewTabLabel: 'Open in new tab',
  OpenInNewTabAriaLabel: 'Open link in a new browser tab',
  // Property pane buttons
  UpdateButton: 'Update',
  UpdateButtonAriaLabel: 'Update the link with new information',
  CancelButton: 'Cancel',
  CancelButtonAriaLabel: 'Cancel editing and discard changes',
  AddLinkButton: 'Add Link',
  AddLinkButtonAriaLabel: 'Add the new link to the list',
  LinkActionsAriaLabel: 'Form actions',
  LinkActionsAriaLabelFormat: 'Actions for {0}',
  // Property pane links list
  CurrentLinksLabel: 'Current Links',
  ConfiguredLinksAriaLabel: 'configured quick link',
  OpensInNewTab: 'Opens in new tab',
  OpensInSameTab: 'Opens in same tab',
  CustomIcon: 'Custom icon',
  EditLinkTitleFormat: 'Edit {0}',
  EditLinkAriaLabelFormat: 'Edit link: {0}',
  DeleteLinkTitleFormat: 'Delete {0}',
  DeleteLinkAriaLabelFormat: 'Delete link: {0}',
  EditFormAriaLabel: 'Edit quick link',
  AddFormAriaLabel: 'Add new quick link',
  // URL validation errors
  URLErrorDangerousScheme: 'URLs using javascript: or data: schemes are not allowed',
  URLErrorInvalidFormat: 'URL must start with http://, https://, or be a relative URL (/, ./, ../, #, ?)',
  // Component messages
  NoLinksMessage: 'No quick links configured. Please edit the web part to add links.',
  OpensInNewTabSuffix: '(opens in new tab)'
}), { virtual: true });

import { initializeIcons } from '@fluentui/react/lib/Icons';

// Initialize Fluent UI icons for tests
initializeIcons();

