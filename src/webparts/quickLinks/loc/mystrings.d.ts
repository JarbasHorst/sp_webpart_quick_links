declare interface IQuickLinksWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  // Web Part property pane
  WebPartTitleLabel: string;
  QuickLinksLabel: string;
  // Property pane form labels
  LinkTitleLabel: string;
  LinkTitleDescription: string;
  URLLabel: string;
  URLDescription: string;
  IconTypeLabel: string;
  FluentUIIconOption: string;
  FluentUIIconAriaLabel: string;
  CustomImageURLOption: string;
  CustomImageURLAriaLabel: string;
  IconTypeDescription: string;
  ImageURLLabel: string;
  IconNameLabel: string;
  ImageURLPlaceholder: string;
  IconNamePlaceholder: string;
  ImageURLDescription: string;
  IconNameDescription: string;
  OpenInNewTabLabel: string;
  OpenInNewTabAriaLabel: string;
  // Property pane buttons
  UpdateButton: string;
  UpdateButtonAriaLabel: string;
  CancelButton: string;
  CancelButtonAriaLabel: string;
  AddLinkButton: string;
  AddLinkButtonAriaLabel: string;
  LinkActionsAriaLabel: string;
  LinkActionsAriaLabelFormat: string;
  // Property pane links list
  CurrentLinksLabel: string;
  ConfiguredLinksAriaLabelSingular: string;
  ConfiguredLinksAriaLabelPlural: string;
  OpensInNewTab: string;
  OpensInSameTab: string;
  CustomIcon: string;
  EditLinkTitleFormat: string;
  EditLinkAriaLabelFormat: string;
  DeleteLinkTitleFormat: string;
  DeleteLinkAriaLabelFormat: string;
  EditFormAriaLabel: string;
  AddFormAriaLabel: string;
  // URL validation errors
  URLErrorDangerousScheme: string;
  URLErrorInvalidFormat: string;
  // Component messages
  NoLinksMessage: string;
  OpensInNewTabSuffix: string;
}

declare module 'QuickLinksWebPartStrings' {
  const strings: IQuickLinksWebPartStrings;
  export = strings;
}
