export interface IQuickLinkItem {
  title: string;
  url: string;
  icon: string;
  iconType?: 'fluent' | 'custom'; // Type of icon: fluent for Fluent UI icons, custom for image URLs
  openInNewTab: boolean;
}
