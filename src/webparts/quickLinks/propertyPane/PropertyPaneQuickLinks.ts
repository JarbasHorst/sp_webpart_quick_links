import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
  IPropertyPaneCustomFieldProps
} from '@microsoft/sp-property-pane';
import { IQuickLinkItem } from '../components/IQuickLinkItem';
import QuickLinksPropertyPanel from './QuickLinksPropertyPanel';

export interface IQuickLinksPropertyPaneFieldProps {
  label: string;
  links: IQuickLinkItem[];
  onLinksChanged: (links: IQuickLinkItem[]) => void;
}

export interface IQuickLinksPropertyPaneFieldInternalProps extends IQuickLinksPropertyPaneFieldProps, IPropertyPaneCustomFieldProps {
  targetProperty: string;
}

class QuickLinksPropertyPaneField implements IPropertyPaneField<IQuickLinksPropertyPaneFieldProps> {
  public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
  public targetProperty: string;
  public properties: IQuickLinksPropertyPaneFieldInternalProps;
  private elem: HTMLElement | undefined;

  constructor(targetProperty: string, properties: IQuickLinksPropertyPaneFieldProps) {
    this.targetProperty = targetProperty;
    this.properties = {
      key: `quickLinks_${targetProperty}`,
      ...properties,
      targetProperty,
      onRender: this.onRender.bind(this),
      onDispose: this.onDispose.bind(this)
    };
  }

  public render(): void {
    if (!this.elem) {
      return;
    }

    this.onRender(this.elem);
  }

  private onDispose(element: HTMLElement): void {
    ReactDOM.unmountComponentAtNode(element);
  }

  private onRender(elem: HTMLElement): void {
    if (!this.elem) {
      this.elem = elem;
    }

    const element: React.ReactElement = React.createElement(QuickLinksPropertyPanel, {
      label: this.properties.label,
      links: this.properties.links,
      onLinksChanged: this.properties.onLinksChanged
    });

    ReactDOM.render(element, elem);
  }
}

export function PropertyPaneQuickLinks(targetProperty: string, properties: IQuickLinksPropertyPaneFieldProps): IPropertyPaneField<IQuickLinksPropertyPaneFieldProps> {
  return new QuickLinksPropertyPaneField(targetProperty, properties);
}
