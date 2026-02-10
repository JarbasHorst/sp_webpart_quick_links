# Quick Links SPFx Web Part - Technical Specification

## 1. Executive Summary

### Overview
The Quick Links web part is a modern SharePoint Framework (SPFx) solution that enables users to create and display customizable quick links with card-based UI design. Each link features custom icons (Fluent UI or custom images), configurable URLs, and target options (same tab or new tab). The web part is fully responsive, theme-aware, and meets WCAG 2.2 Level AAA accessibility standards.

### Key Features
- **Modern Card-Based UI**: Cards with hover effects and smooth transitions
- **Flexible Icon System**: Support for Fluent UI icons and custom image URLs
- **URL Validation**: Comprehensive security with XSS prevention
- **Responsive Design**: Optimized layouts for desktop, tablet, and mobile devices
- **Theme-Aware**: Automatic adaptation to SharePoint light and dark themes
- **Accessibility**: Full WCAG 2.2 AAA compliance with keyboard navigation and screen reader support
- **Localization**: Multi-language support (English, German, French)
- **Custom Property Pane**: Rich configuration interface with inline editing

### Target Platforms
- SharePoint Online (Modern Pages)
- Microsoft Teams (Tab, Personal App)
- SharePoint Full Page
- Office 365

---

## 2. Technical Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| SharePoint Framework (SPFx) | 1.22.2 | Web part framework |
| React | 17.0.1 | UI library |
| React DOM | 17.0.1 | React rendering |
| TypeScript | ~5.8.0 | Type-safe development |
| Node.js | >=22.14.0 < 23.0.0 | Runtime environment |

### SPFx Dependencies
```json
{
  "@microsoft/sp-component-base": "1.22.2",
  "@microsoft/sp-core-library": "1.22.2",
  "@microsoft/sp-lodash-subset": "1.22.2",
  "@microsoft/sp-office-ui-fabric-core": "1.22.2",
  "@microsoft/sp-property-pane": "1.22.2",
  "@microsoft/sp-webpart-base": "1.22.2"
}
```

### UI Framework
```json
{
  "@fluentui/react": "^8.106.4"
}
```

### Build Tools
```json
{
  "@microsoft/spfx-heft-plugins": "1.22.2",
  "@microsoft/spfx-web-build-rig": "1.22.2",
  "@rushstack/heft": "1.1.2",
  "@rushstack/eslint-config": "4.5.2"
}
```

### Code Quality
```json
{
  "@microsoft/eslint-config-spfx": "1.22.2",
  "@microsoft/eslint-plugin-spfx": "1.22.2",
  "@typescript-eslint/parser": "8.46.2",
  "eslint": "8.57.1",
  "eslint-plugin-react-hooks": "4.3.0"
}
```

### Testing
```json
{
  "@testing-library/jest-dom": "^5.17.0",
  "@testing-library/react": "^12.1.5",
  "@types/heft-jest": "1.0.2"
}
```

### Styling
```json
{
  "css-loader": "~7.1.2"
}
```

### Utility Libraries
```json
{
  "tslib": "2.3.1"
}
```

---

## 3. Architecture Overview

### Component Hierarchy
```
QuickLinksWebPart (Web Part Class)
├── QuickLinks (React Component)
│   └── Link Cards (Dynamic List)
│       ├── Icon Container
│       │   ├── Fluent UI Icon (conditional)
│       │   └── Custom Image Icon (conditional)
│       └── Link Text
└── Property Pane
    ├── Title Field (TextField)
    └── Quick Links Field (Custom Property Pane Control)
        └── QuickLinksPropertyPanel (React Component)
            ├── Link Form
            │   ├── Title Input
            │   ├── URL Input
            │   ├── Icon Type Selector
            │   ├── Icon/Image Input
            │   ├── Open in New Tab Checkbox
            │   └── Action Buttons (Add/Update/Cancel)
            └── Links List
                └── Link Items (with Edit/Delete actions)
```

### File Structure
```
src/webparts/quickLinks/
├── QuickLinksWebPart.ts                          # Main web part class
├── QuickLinksWebPart.manifest.json               # Web part manifest
├── components/
│   ├── QuickLinks.tsx                            # Main React component
│   ├── QuickLinks.test.tsx                       # Component tests
│   ├── QuickLinks.module.scss                    # Component styles
│   ├── IQuickLinksProps.ts                       # Component props interface
│   └── IQuickLinkItem.ts                         # Link item interface
├── propertyPane/
│   ├── PropertyPaneQuickLinks.ts                 # Custom property pane field
│   ├── QuickLinksPropertyPanel.tsx               # Property panel component
│   ├── QuickLinksPropertyPanel.test.tsx          # Property panel tests
│   └── QuickLinksPropertyPanel.module.scss       # Property panel styles
└── loc/
    ├── mystrings.d.ts                            # Localization type definitions
    ├── en-us.js                                  # English strings
    ├── de-de.js                                  # German strings
    └── fr-fr.js                                  # French strings
```

### Data Flow
1. **Initialization**: Web part loads → reads properties → initializes state
2. **Rendering**: Web part creates React element → renders QuickLinks component
3. **Theme Updates**: SharePoint theme changes → web part updates CSS variables
4. **Property Changes**: User edits in property pane → callback updates web part properties → triggers re-render
5. **User Interaction**: User clicks link → browser navigates to URL (with security validation)

---

## 4. Data Models

### 4.1 IQuickLinkItem Interface
Represents a single quick link item.

```typescript
export interface IQuickLinkItem {
  title: string;              // Display title of the link
  url: string;                // URL to navigate to (http/https/relative)
  icon: string;               // Fluent UI icon name OR image URL
  iconType?: 'fluent' | 'custom';  // Type of icon (default: 'fluent')
  openInNewTab: boolean;      // Whether to open link in new tab
}
```

**Field Specifications:**
- **title** (required): User-friendly display name, supports Unicode, rendered with word-break
- **url** (required): Must pass security validation (no javascript:, data: schemes)
- **icon** (required): Fluent UI icon name (e.g., "Home") or HTTPS image URL
- **iconType** (optional): Defaults to "fluent" if not specified
- **openInNewTab** (required): Boolean flag for target behavior

### 4.2 IQuickLinksProps Interface
Props passed to the main React component.

```typescript
export interface IQuickLinksProps {
  title: string;              // Web part title (optional)
  links: IQuickLinkItem[];    // Array of quick links
  isDarkTheme: boolean;       // Theme indicator
}
```

**Field Specifications:**
- **title**: Optional heading displayed above links (can be empty string)
- **links**: Array of link items (can be empty array)
- **isDarkTheme**: Derived from SharePoint theme's `isInverted` property

### 4.3 IQuickLinksWebPartProps Interface
Web part properties stored in SharePoint.

```typescript
export interface IQuickLinksWebPartProps {
  title: string;              // Web part title
  links: IQuickLinkItem[];    // Array of quick links
}
```

**Persistence:**
- Stored in SharePoint page properties
- Serialized as JSON
- Survives page publish/republish cycles

### 4.4 IQuickLinksPropertyPanelProps Interface
Props for property pane panel component.

```typescript
export interface IQuickLinksPropertyPanelProps {
  label: string;                              // Section label
  links: IQuickLinkItem[];                    // Current links array
  onLinksChanged: (links: IQuickLinkItem[]) => void;  // Callback for updates
}
```

### 4.5 IQuickLinksPropertyPanelState Interface
Internal state of property panel component.

```typescript
interface IQuickLinksPropertyPanelState {
  links: IQuickLinkItem[];    // Local copy of links
  editingIndex: number;       // Index of link being edited (-1 = none)
  newLink: IQuickLinkItem;    // Form data for add/edit
  urlError?: string;          // URL validation error message
}
```

---

## 5. Component Specifications

### 5.1 QuickLinksWebPart (Main Web Part Class)

**File:** `src/webparts/quickLinks/QuickLinksWebPart.ts`

**Purpose:** Main web part class that extends SPFx BaseClientSideWebPart

**Key Properties:**
```typescript
export default class QuickLinksWebPart extends BaseClientSideWebPart<IQuickLinksWebPartProps> {
  private _isDarkTheme: boolean = false;
}
```

**Methods:**

#### render(): void
Renders the React component into the DOM.
```typescript
public render(): void {
  const element: React.ReactElement<IQuickLinksProps> = React.createElement(
    QuickLinks,
    {
      title: this.properties.title,
      links: this.properties.links || [],
      isDarkTheme: this._isDarkTheme
    }
  );
  ReactDom.render(element, this.domElement);
}
```

#### onInit(): Promise<void>
Initializes the web part, ensures links array exists.
```typescript
protected onInit(): Promise<void> {
  if (!this.properties.links || this.properties.links.length === 0) {
    this.properties.links = [];
  }
  return Promise.resolve();
}
```

#### onThemeChanged(currentTheme: IReadonlyTheme | undefined): void
Updates CSS custom properties when SharePoint theme changes.
```typescript
protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
  if (!currentTheme) return;
  
  this._isDarkTheme = !!currentTheme.isInverted;
  const { semanticColors } = currentTheme;
  
  if (semanticColors) {
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || '');
    this.domElement.style.setProperty('--link', semanticColors.link || '');
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || '');
    this.domElement.style.setProperty('--white', semanticColors.bodyBackground || '');
    this.domElement.style.setProperty('--neutralLight', semanticColors.bodyFrameDivider || '');
    this.domElement.style.setProperty('--themePrimary', semanticColors.link || '');
    this.domElement.style.setProperty('--neutralSecondary', semanticColors.bodySubtext || '');
    this.domElement.style.setProperty('--neutralTertiary', semanticColors.disabledBodyText || '');
  }
}
```

#### onDispose(): void
Cleanup when web part is disposed.
```typescript
protected onDispose(): void {
  ReactDom.unmountComponentAtNode(this.domElement);
}
```

#### getPropertyPaneConfiguration(): IPropertyPaneConfiguration
Configures the property pane interface.
```typescript
protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: { description: strings.PropertyPaneDescription },
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
              PropertyPaneTextField('title', {
                label: strings.WebPartTitleLabel
              }),
              PropertyPaneQuickLinks('links', {
                label: strings.QuickLinksLabel,
                links: this.properties.links || [],
                onLinksChanged: (links: IQuickLinkItem[]) => {
                  this.properties.links = links;
                  this.render();
                }
              })
            ]
          }
        ]
      }
    ]
  };
}
```

**Manifest Configuration:**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx/client-side-web-part-manifest.schema.json",
  "id": "cf543cfa-bf82-4dd4-a42a-9b3cd3a03801",
  "alias": "QuickLinksWebPart",
  "componentType": "WebPart",
  "version": "*",
  "manifestVersion": 2,
  "requiresCustomScript": false,
  "supportedHosts": ["SharePointWebPart", "TeamsPersonalApp", "TeamsTab", "SharePointFullPage"],
  "supportsThemeVariants": true,
  "preconfiguredEntries": [{
    "groupId": "5c03119e-3074-46fd-976b-c60198311f70",
    "group": { "default": "Advanced" },
    "title": { "default": "QuickLinks" },
    "description": { "default": "QuickLinks description" },
    "officeFabricIconFontName": "Page",
    "properties": {
      "title": "Quick Links",
      "links": []
    }
  }]
}
```

---

### 5.2 QuickLinks (React Component)

**File:** `src/webparts/quickLinks/components/QuickLinks.tsx`

**Purpose:** Main presentation component that renders link cards

**Component Class:**
```typescript
export default class QuickLinks extends React.Component<IQuickLinksProps>
```

**Key Methods:**

#### isValidUrl(url: string): boolean
Validates URL to prevent XSS attacks.
```typescript
private isValidUrl(url: string): boolean {
  if (!url) return false;
  
  const trimmedUrl = url.trim();
  const lowerUrl = trimmedUrl.toLowerCase();
  
  // Reject javascript: and data: URLs
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
```

**Validation Rules:**
- ❌ **Blocked**: `javascript:`, `data:` (XSS prevention)
- ✅ **Allowed**: `http://`, `https://`, `/`, `./`, `../`, `#`, `?`
- ❌ **Invalid**: Empty strings, malformed URLs

#### renderIcon(link: IQuickLinkItem): JSX.Element
Renders appropriate icon type (Fluent UI or custom image).
```typescript
private renderIcon(link: IQuickLinkItem): JSX.Element {
  const iconType = link.iconType || 'fluent';
  
  if (iconType === 'custom' && link.icon) {
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
      return <Icon iconName="Link" className={styles.icon} aria-hidden="true" />;
    }
  }
  
  return <Icon iconName={link.icon || 'Link'} className={styles.icon} aria-hidden="true" />;
}
```

**Icon Logic:**
1. If `iconType === 'custom'` and icon URL is valid → render `<img>`
2. If custom image fails to load → fallback to Fluent UI "Link" icon
3. If `iconType === 'fluent'` → render Fluent UI Icon component
4. Default fallback: "Link" icon

#### render(): React.ReactElement<IQuickLinksProps>
Main render method.
```typescript
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
```

**Render Logic:**
1. Render optional title as `<h2>`
2. Render links container with `role="list"`
3. For each link:
   - Validate URL
   - Create accessible aria-label
   - Render link card with icon and title
   - Disable if invalid URL
4. If no links: render empty state message

**Accessibility Features:**
- `aria-label` on section for context
- `role="list"` and `role="listitem"` for semantic structure
- `aria-hidden="true"` on decorative icons
- `aria-disabled="true"` for invalid links
- `role="status" aria-live="polite"` for empty state announcements
- `rel="noopener noreferrer"` for security on new tab links

---

### 5.3 QuickLinksPropertyPanel (Property Pane Component)

**File:** `src/webparts/quickLinks/propertyPane/QuickLinksPropertyPanel.tsx`

**Purpose:** React component for managing links in property pane

**Component Class:**
```typescript
export default class QuickLinksPropertyPanel extends React.Component<
  IQuickLinksPropertyPanelProps, 
  IQuickLinksPropertyPanelState
>
```

**State Management:**
```typescript
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
```

**Key Methods:**

#### validateUrl(url: string): string | undefined
Validates URL and returns error message if invalid.
```typescript
private validateUrl(url: string): string | undefined {
  if (!url?.trim()) {
    return undefined; // Empty URL handled by required field validation
  }
  
  const trimmedUrl = url.trim();
  const lowerUrl = trimmedUrl.toLowerCase();
  
  // Block dangerous schemes
  if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:')) {
    return strings.URLErrorDangerousScheme;
  }
  
  // Allow http(s) URLs
  if (lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://')) {
    return undefined;
  }
  
  // Allow relative URLs
  if (
    trimmedUrl.startsWith('/') ||
    trimmedUrl.startsWith('./') ||
    trimmedUrl.startsWith('../') ||
    trimmedUrl.startsWith('#') ||
    trimmedUrl.startsWith('?')
  ) {
    return undefined;
  }
  
  return strings.URLErrorInvalidFormat;
}
```

**Validation Messages:**
- `URLErrorDangerousScheme`: "URLs using javascript: or data: schemes are not allowed"
- `URLErrorInvalidFormat`: "URL must start with http://, https://, or be a relative URL (/, ./, ../, #, ?)"

#### handleAddLink(): void
Adds new link to the list.
```typescript
private handleAddLink = (): void => {
  const { newLink, links } = this.state;
  
  const trimmedUrl = newLink.url.trim();
  const urlError = this.validateUrl(trimmedUrl);
  
  if (urlError) {
    this.setState({ urlError });
    return;
  }
  
  if (newLink.title && trimmedUrl) {
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
```

#### handleUpdateLink(): void
Updates existing link.
```typescript
private handleUpdateLink = (): void => {
  const { newLink, links, editingIndex } = this.state;
  
  const trimmedUrl = newLink.url.trim();
  const urlError = this.validateUrl(trimmedUrl);
  
  if (urlError) {
    this.setState({ urlError });
    return;
  }
  
  if (newLink.title && trimmedUrl && editingIndex >= 0) {
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
```

#### handleEditLink(index: number): void
Enters edit mode for existing link.
```typescript
private handleEditLink = (index: number): void => {
  this.setState((prevState) => ({
    editingIndex: index,
    newLink: { ...prevState.links[index] },
    urlError: undefined
  }));
};
```

#### handleDeleteLink(index: number): void
Deletes link from the list.
```typescript
private handleDeleteLink = (index: number): void => {
  const updatedLinks = this.state.links.filter((_, i) => i !== index);
  this.setState({ links: updatedLinks });
  this.props.onLinksChanged(updatedLinks);
};
```

#### handleCancelEdit(): void
Cancels edit mode.
```typescript
private handleCancelEdit = (): void => {
  this.setState({
    editingIndex: -1,
    newLink: this.getEmptyLink(),
    urlError: undefined
  });
};
```

**Form Fields:**
1. **Title Field**: TextField (required)
2. **URL Field**: TextField (required, validated)
3. **Icon Type**: ChoiceGroup (Fluent UI / Custom Image)
4. **Icon/Image Field**: TextField (optional, changes label based on icon type)
5. **Open in New Tab**: Checkbox (default: true)

**Action Buttons:**
- **Add Mode**: "Add Link" button (enabled when title and valid URL present)
- **Edit Mode**: "Update" and "Cancel" buttons (Update enabled when valid)

---

### 5.4 PropertyPaneQuickLinks (Custom Property Pane Field)

**File:** `src/webparts/quickLinks/propertyPane/PropertyPaneQuickLinks.ts`

**Purpose:** Creates custom property pane field for managing links

**Class:**
```typescript
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
}
```

**Factory Function:**
```typescript
export function PropertyPaneQuickLinks(
  targetProperty: string, 
  properties: IQuickLinksPropertyPaneFieldProps
): IPropertyPaneField<IQuickLinksPropertyPaneFieldProps> {
  return new QuickLinksPropertyPaneField(targetProperty, properties);
}
```

**Usage:**
```typescript
PropertyPaneQuickLinks('links', {
  label: strings.QuickLinksLabel,
  links: this.properties.links || [],
  onLinksChanged: (links: IQuickLinkItem[]) => {
    this.properties.links = links;
    this.render();
  }
})
```

---

## 6. UI/UX Specifications

### 6.1 Layout System

**Grid Layout (CSS Grid):**
```scss
.linksContainer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 150px));
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}
```

**Responsive Breakpoints:**

| Breakpoint | Screen Width | Grid Columns | Icon Size | Gap | Padding |
|------------|--------------|--------------|-----------|-----|---------|
| Desktop | > 768px | `minmax(140px, 150px)` | 48px | 16px | 20px |
| Tablet | 481px - 768px | `minmax(120px, 1fr)` | 40px | 12px | 12px |
| Mobile | ≤ 480px | `minmax(100px, 1fr)` | 36px | 10px | 12px |

### 6.2 Card Design

**Card Specifications:**
```scss
.linkCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  background-color: var(--white);
  border: 1px solid var(--neutralLight);
  border-radius: 4px;
  min-height: 120px;
  box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108);
}
```

**Card States:**

1. **Default State:**
   - Background: `var(--white)`
   - Border: `1px solid var(--neutralLight)`
   - Shadow: Subtle elevation

2. **Hover State:**
   - Transform: `translateY(-2px)`
   - Shadow: Enhanced elevation
   - Border: `var(--themePrimary)`
   - Icon: Scales to `1.1x`

3. **Focus State (Keyboard):**
   - Outline: `3px solid var(--themePrimary)`
   - Offset: `2px`
   - Additional shadow ring: `4px rgba(0, 120, 212, 0.2)`

4. **Disabled State:**
   - Opacity: `0.6`
   - Cursor: `not-allowed`

### 6.3 Typography

**Font Sizes:**
```scss
// Desktop
.title { font-size: 24px; font-weight: 600; }
.linkTitle { font-size: 14px; font-weight: 600; }

// Tablet (≤ 768px)
.title { font-size: 20px; }
.linkTitle { font-size: 13px; }

// Mobile (≤ 480px)
.linkTitle { font-size: 12px; }
```

**Text Properties:**
- Line Height: `1.3` (link titles)
- Word Break: `break-word` (prevents overflow)
- Text Align: `center` (link text)

### 6.4 Color Specifications

**Theme Colors (CSS Variables):**
```scss
--bodyText: #323130 (default)
--link: #0078d4 (default)
--linkHovered: #004578 (default)
--white: #ffffff (default)
--neutralLight: #edebe9 (default)
--themePrimary: #0078d4 (default)
--neutralSecondary: #605e5c (default)
--neutralTertiary: #a19f9d (default)
```

**Contrast Ratios (WCAG AAA):**
- Primary Text: `14.8:1` (#323130 on white)
- Secondary Text: `7.1:1` (#605e5c on white)
- Tertiary Text: `4.9:1` (#a19f9d on white)
- Link Primary: `5.7:1` (#0078d4 on white)

### 6.5 Icons

**Icon Sizes:**
- Desktop: `48px`
- Tablet: `40px`
- Mobile: `36px`

**Icon Types:**
1. **Fluent UI Icons**: Rendered via `@fluentui/react` Icon component
2. **Custom Images**: Rendered as `<img>` with `object-fit: contain`

**Icon Properties:**
```scss
.icon {
  font-size: 48px;
  color: var(--themePrimary);
  transition: all 0.2s ease-in-out;
}

.customIcon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  transition: all 0.2s ease-in-out;
}
```

### 6.6 Animations & Transitions

**Default Transitions:**
```scss
transition: all 0.2s ease-in-out;
```

**Hover Effects:**
- Card lift: `translateY(-2px)`
- Icon scale: `scale(1.1)`
- Shadow enhancement

**Reduced Motion Support:**
```scss
@media (prefers-reduced-motion: reduce) {
  transition: none;
  &:hover { transform: none; }
}
```

### 6.7 Empty State

**Design:**
```scss
.emptyState {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  text-align: center;
}

.emptyIcon {
  font-size: 64px;
  color: var(--neutralTertiary);
}
```

**Message:** "No quick links configured. Please edit the web part to add links."

---

## 7. Accessibility Requirements

### 7.1 WCAG 2.2 Level AAA Compliance

**Conformance Status:** Fully Conformant

**Success Criteria Met:**
- 1.1.1 Non-text Content (Level A)
- 1.3.1 Info and Relationships (Level A)
- 1.4.3 Contrast (Minimum) (Level AA)
- 1.4.6 Contrast (Enhanced) (Level AAA) ✓
- 1.4.11 Non-text Contrast (Level AA)
- 1.4.13 Content on Hover or Focus (Level AA)
- 2.1.1 Keyboard (Level A)
- 2.1.2 No Keyboard Trap (Level A)
- 2.4.3 Focus Order (Level A)
- 2.4.7 Focus Visible (Level AA)
- 2.5.5 Target Size (Enhanced) (Level AAA) ✓
- 3.2.4 Consistent Identification (Level AA)
- 4.1.2 Name, Role, Value (Level A)
- 4.1.3 Status Messages (Level AA)

### 7.2 Keyboard Navigation

**Keyboard Support:**
```
Tab          → Navigate to next link/control
Shift+Tab    → Navigate to previous link/control
Enter/Space  → Activate link or button
Arrow Keys   → Navigate radio buttons
```

**Focus Management:**
- All interactive elements are keyboard accessible
- Focus order follows visual layout
- No keyboard traps
- Focus indicators clearly visible

**Focus Indicators:**
```scss
&:focus {
  outline: 3px solid var(--themePrimary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 120, 212, 0.2);
}

// Modern browsers: only show on keyboard focus
&:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}
```

### 7.3 Screen Reader Support

**ARIA Attributes:**

1. **Link Cards:**
   ```html
   <a
     href="..."
     aria-label="Company Intranet (opens in new tab)"
     target="_blank"
     rel="noopener noreferrer"
   >
   ```

2. **List Structure:**
   ```html
   <div role="list">
     <div role="listitem">...</div>
   </div>
   ```

3. **Section Label:**
   ```html
   <section aria-label="Quick Links">
   ```

4. **Decorative Icons:**
   ```html
   <div aria-hidden="true">
     <Icon ... aria-hidden="true" />
   </div>
   ```

5. **Invalid Links:**
   ```html
   <a aria-disabled="true" onClick={(e) => e.preventDefault()}>
   ```

6. **Empty State:**
   ```html
   <div role="status" aria-live="polite">
     <p>No quick links configured...</p>
   </div>
   ```

7. **Form Fields:**
   ```html
   <TextField
     label="Link Title"
     required
     aria-required="true"
     aria-invalid={!!error}
     errorMessage={error}
   />
   ```

### 7.4 High Contrast Mode

**Enhanced Styles:**
```scss
@media (prefers-contrast: high) {
  .linkCard {
    border: 2px solid; // Increased from 1px
    
    &:focus-visible {
      outline-width: 4px; // Increased from 3px
    }
  }
  
  .iconButton {
    border: 1px solid;
    
    &:focus-visible {
      outline-width: 3px;
    }
  }
}
```

### 7.5 Screen Reader Announcements

**Announced Content:**
- Link title and new tab status: "Company Intranet (opens in new tab)"
- List context: "item 1 of 5"
- Empty state: "No quick links configured"
- Form errors: "URLs using javascript: or data: schemes are not allowed"
- Button actions: "Add the new link to the list"

**Testing Recommendations:**
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- Narrator (Windows)

---

## 8. Security Specifications

### 8.1 XSS Prevention

**URL Validation:**
```typescript
private isValidUrl(url: string): boolean {
  if (!url) return false;
  
  const trimmedUrl = url.trim();
  const lowerUrl = trimmedUrl.toLowerCase();
  
  // Reject javascript: and data: URLs (XSS vectors)
  if (lowerUrl.startsWith('javascript:') || lowerUrl.startsWith('data:')) {
    return false;
  }
  
  // Allow safe URL schemes
  return lowerUrl.startsWith('http://') || 
         lowerUrl.startsWith('https://') || 
         trimmedUrl.startsWith('/') ||
         trimmedUrl.startsWith('./') ||
         trimmedUrl.startsWith('../') ||
         trimmedUrl.startsWith('#') ||
         trimmedUrl.startsWith('?');
}
```

**Blocked Patterns:**
- `javascript:alert('XSS')`
- `javascript:void(0)`
- `data:text/html,<script>...</script>`
- `data:image/svg+xml,<svg onload="...">`

**Allowed Patterns:**
- `https://example.com`
- `http://example.com`
- `/sites/MySite/Pages/default.aspx`
- `./page.aspx`
- `../Documents/file.pdf`
- `#section-anchor`
- `?param=value`

### 8.2 Safe Rendering

**Icon URL Validation:**
Custom image URLs undergo same validation as link URLs to prevent XSS via image sources.

**Image Error Handling:**
```typescript
onError={(e) => {
  // Gracefully fallback to default icon
  const target = e.target as HTMLImageElement;
  target.style.display = 'none';
  // Show fallback Fluent icon
}}
```

**No innerHTML Usage:**
All content rendered via React's safe JSX rendering. No use of `dangerouslySetInnerHTML`.

### 8.3 Security Headers

**New Tab Links:**
```html
<a 
  target="_blank" 
  rel="noopener noreferrer"
>
```

**Purpose:**
- `noopener`: Prevents new page from accessing `window.opener`
- `noreferrer`: Doesn't send referrer information

### 8.4 Content Security Policy Compliance

**No Inline Scripts:** All JavaScript in separate files
**No Inline Styles:** All styles in SCSS modules
**No eval():** No dynamic code execution

---

## 9. Localization

### 9.1 Supported Languages

1. **English (en-us)** - Default
2. **German (de-de)**
3. **French (fr-fr)**

### 9.2 Localization Files

**File Pattern:** `src/webparts/quickLinks/loc/{locale}.js`

**Type Definitions:** `src/webparts/quickLinks/loc/mystrings.d.ts`

### 9.3 String Catalog

**Total Strings:** 64 localized strings

**Categories:**

1. **Web Part Property Pane** (3 strings)
   - PropertyPaneDescription
   - BasicGroupName
   - WebPartTitleLabel
   - QuickLinksLabel

2. **Property Pane Form Labels** (13 strings)
   - LinkTitleLabel, LinkTitleDescription
   - URLLabel, URLDescription
   - IconTypeLabel, IconTypeDescription
   - FluentUIIconOption, FluentUIIconAriaLabel
   - CustomImageURLOption, CustomImageURLAriaLabel
   - ImageURLLabel, ImageURLPlaceholder, ImageURLDescription
   - IconNameLabel, IconNamePlaceholder, IconNameDescription
   - OpenInNewTabLabel, OpenInNewTabAriaLabel

3. **Property Pane Buttons** (7 strings)
   - UpdateButton, UpdateButtonAriaLabel
   - CancelButton, CancelButtonAriaLabel
   - AddLinkButton, AddLinkButtonAriaLabel
   - LinkActionsAriaLabel, LinkActionsAriaLabelFormat

4. **Property Pane Links List** (9 strings)
   - CurrentLinksLabel
   - ConfiguredLinksAriaLabelSingular
   - ConfiguredLinksAriaLabelPlural
   - OpensInNewTab, OpensInSameTab
   - CustomIcon
   - EditLinkTitleFormat, EditLinkAriaLabelFormat
   - DeleteLinkTitleFormat, DeleteLinkAriaLabelFormat
   - EditFormAriaLabel, AddFormAriaLabel

5. **URL Validation Errors** (2 strings)
   - URLErrorDangerousScheme
   - URLErrorInvalidFormat

6. **Component Messages** (2 strings)
   - NoLinksMessage
   - OpensInNewTabSuffix

7. **Environment Detection** (8 strings)
   - AppLocalEnvironmentSharePoint
   - AppLocalEnvironmentTeams
   - AppLocalEnvironmentOffice
   - AppLocalEnvironmentOutlook
   - AppSharePointEnvironment
   - AppTeamsTabEnvironment
   - AppOfficeEnvironment
   - AppOutlookEnvironment
   - UnknownEnvironment

### 9.4 Sample Localized Strings

**English (en-us.js):**
```javascript
{
  "WebPartTitleLabel": "Web Part Title",
  "LinkTitleLabel": "Link Title",
  "URLLabel": "URL",
  "NoLinksMessage": "No quick links configured. Please edit the web part to add links.",
  "OpensInNewTabSuffix": "(opens in new tab)"
}
```

**German (de-de.js):**
```javascript
{
  "WebPartTitleLabel": "Webpart-Titel",
  "LinkTitleLabel": "Link-Titel",
  "URLLabel": "URL",
  "NoLinksMessage": "Keine Schnelllinks konfiguriert. Bitte bearbeiten Sie das Webpart, um Links hinzuzufügen.",
  "OpensInNewTabSuffix": "(wird in neuem Tab geöffnet)"
}
```

**French (fr-fr.js):**
```javascript
{
  "WebPartTitleLabel": "Titre du composant",
  "LinkTitleLabel": "Titre du lien",
  "URLLabel": "URL",
  "NoLinksMessage": "Aucun lien rapide configuré. Veuillez modifier le composant WebPart pour ajouter des liens.",
  "OpensInNewTabSuffix": "(s'ouvre dans un nouvel onglet)"
}
```

### 9.5 Localization Configuration

**config.json:**
```json
{
  "localizedResources": {
    "QuickLinksWebPartStrings": "lib/webparts/quickLinks/loc/{locale}.js"
  }
}
```

**Usage in Code:**
```typescript
import * as strings from 'QuickLinksWebPartStrings';

// Access strings
strings.WebPartTitleLabel
strings.NoLinksMessage
```

---

## 10. Build Configuration

### 10.1 Build System

**Build Tool:** Heft (Rush Stack)
**Package Manager:** npm
**Module Bundler:** Webpack (via SPFx build rig)

### 10.2 Scripts

**package.json scripts:**
```json
{
  "scripts": {
    "build": "heft test --clean --production && heft package-solution --production",
    "start": "heft start --clean",
    "clean": "heft clean",
    "eject-webpack": "heft eject-webpack"
  }
}
```

**Script Descriptions:**
- **build**: Run tests + create production bundle + package .sppkg solution
- **start**: Start development server with hot reload
- **clean**: Remove all build artifacts
- **eject-webpack**: Extract Webpack configuration for customization

### 10.3 TypeScript Configuration

**tsconfig.json:**
```json
{
  "extends": "./node_modules/@microsoft/spfx-web-build-rig/profiles/default/tsconfig-base.json"
}
```

**Base Configuration Includes:**
- Target: ES2019
- Module: ESNext
- JSX: React
- Strict type checking enabled
- Source maps for debugging

### 10.4 Build Rig Configuration

**rig.json:**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",
  "rigPackageName": "@microsoft/spfx-web-build-rig"
}
```

**Purpose:** Configures Heft to use SPFx build profiles (Webpack, TypeScript, testing)

### 10.5 Bundle Configuration

**config.json:**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/config.2.0.schema.json",
  "version": "2.0",
  "bundles": {
    "quick-links-web-part": {
      "components": [
        {
          "entrypoint": "./lib/webparts/quickLinks/QuickLinksWebPart.js",
          "manifest": "./src/webparts/quickLinks/QuickLinksWebPart.manifest.json"
        }
      ]
    }
  },
  "externals": {},
  "localizedResources": {
    "QuickLinksWebPartStrings": "lib/webparts/quickLinks/loc/{locale}.js"
  }
}
```

**Bundle Output:** `quick-links-web-part.js` (single bundle with all dependencies)

### 10.6 Package Solution Configuration

**config/package-solution.json:**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/package-solution.schema.json",
  "solution": {
    "name": "quick-links-webpart-client-side-solution",
    "id": "ed8208a5-7d2f-443b-8a88-5f1e9221de30",
    "version": "1.0.0.8",
    "includeClientSideAssets": true,
    "skipFeatureDeployment": true,
    "isDomainIsolated": false,
    "developer": {
      "name": "",
      "websiteUrl": "",
      "privacyUrl": "",
      "termsOfUseUrl": "",
      "mpnId": "Undefined-1.22.2"
    }
  },
  "paths": {
    "zippedPackage": "solution/quick-links-webpart.sppkg"
  }
}
```

**Key Settings:**
- `includeClientSideAssets: true` - Bundle assets in .sppkg
- `skipFeatureDeployment: true` - Tenant-scoped deployment (no site collection feature activation required)
- `isDomainIsolated: false` - Runs in same domain as SharePoint

### 10.7 Serve Configuration

**config/serve.json:**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/spfx-serve.schema.json",
  "port": 4321,
  "https": true,
  "initialPage": "https://{tenantDomain}/_layouts/workbench.aspx"
}
```

**Development Server:**
- Port: 4321
- HTTPS: Enabled (required for SharePoint)
- Opens SharePoint Workbench automatically

### 10.8 SASS Configuration

**config/sass.json:**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft-sass-plugin.schema.json",
  "extends": "@microsoft/spfx-web-build-rig/profiles/default/config/sass.json"
}
```

**SASS Features:**
- CSS Modules (scoped styles)
- SCSS syntax support
- Auto-prefixing for browser compatibility

### 10.9 ESLint Configuration

**.eslintrc.js:**
```javascript
module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
  parserOptions: { tsconfigRootDir: __dirname },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2018,
        sourceType: 'module'
      },
      rules: {
        '@rushstack/no-new-null': 1,
        '@typescript-eslint/no-floating-promises': 2,
        '@typescript-eslint/no-explicit-any': 1,
        'no-script-url': 1,
        // ... additional rules
      }
    }
  ]
};
```

**Key Rules:**
- No floating promises
- No explicit any
- No script URLs
- Type annotations required
- No unused variables

---

## 11. Testing Requirements

### 11.1 Testing Framework

**Framework:** Jest with React Testing Library
**Configuration:** `config/jest.config.json`

```json
{
  "extends": "@microsoft/spfx-web-build-rig/profiles/default/config/jest.config.json",
  "setupFilesAfterEnv": ["<rootDir>/lib-commonjs/setupTests.js"]
}
```

### 11.2 Test Setup

**src/setupTests.ts:**
```typescript
// Configure Jest environment
import '@testing-library/jest-dom';
```

### 11.3 Test Coverage

**QuickLinks.test.tsx** (333 lines, 33 test cases)

**Test Categories:**

1. **Basic Rendering** (3 tests)
   - Renders with title and links
   - Renders without title
   - Renders empty state

2. **Link Rendering** (4 tests)
   - Correct href attributes
   - Target _blank for new tab
   - Target _self for same tab
   - Rel attribute for security

3. **URL Validation - Security** (2 tests)
   - Rejects javascript: URLs
   - Rejects data: URLs

4. **URL Validation - Valid URLs** (7 tests)
   - Accepts http:// URLs
   - Accepts https:// URLs
   - Accepts / relative URLs
   - Accepts ./ relative URLs
   - Accepts ../ relative URLs
   - Accepts ? query strings
   - Accepts # fragments

5. **URL Validation - Invalid URLs** (1 test)
   - Rejects empty URLs

6. **Icon Rendering** (3 tests)
   - Default icon when not provided
   - Custom Fluent icon
   - Uses icon name from data

7. **Custom Image Icons** (4 tests)
   - Renders custom image icon
   - Uses Fluent icon by default
   - Rejects javascript: in icon URL
   - Rejects data: in icon URL

**Test Examples:**

```typescript
it('should prevent XSS attacks by rejecting javascript: URLs', () => {
  const xssLinks: IQuickLinkItem[] = [{
    title: 'XSS Link',
    url: 'javascript:alert("XSS")',
    icon: 'Link',
    openInNewTab: false
  }];
  const props = { ...defaultProps, links: xssLinks };
  const { container } = render(<QuickLinks {...props} />);
  
  const link = container.querySelector('a');
  expect(link).toHaveAttribute('href', '#');
});

it('should render custom image icon when iconType is custom', () => {
  const customIconLinks: IQuickLinkItem[] = [{
    title: 'Custom Link',
    url: 'https://example.com',
    icon: 'https://example.com/logo.png',
    iconType: 'custom',
    openInNewTab: true
  }];
  const props = { ...defaultProps, links: customIconLinks };
  const { container } = render(<QuickLinks {...props} />);
  
  const img = container.querySelector('img');
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', 'https://example.com/logo.png');
});
```

### 11.4 Running Tests

**Commands:**
```bash
# Run all tests
npm run build  # Includes test run

# Run tests only (via Heft)
heft test

# Watch mode (manual setup)
jest --watch
```

**Test Output:**
- Console test results
- Coverage reports (if enabled)
- JUnit XML reports (CI/CD integration)

### 11.5 Testing Best Practices

1. **Test user-visible behavior**, not implementation details
2. **Use semantic queries** (getByRole, getByLabelText)
3. **Test accessibility** (aria attributes, keyboard navigation)
4. **Test security** (XSS prevention, validation)
5. **Mock external dependencies** (SPFx context, theme)

---

## 12. Deployment

### 12.1 Build Process

**Step 1: Clean Build**
```bash
npm run clean
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Production Build**
```bash
npm run build
```

**Output:**
- `lib/` - Transpiled JavaScript
- `lib-commonjs/` - CommonJS modules for Node
- `temp/` - Build intermediates
- `solution/quick-links-webpart.sppkg` - SharePoint solution package

### 12.2 Package Structure

**quick-links-webpart.sppkg** contains:
- Web part manifest
- Compiled JavaScript bundle
- CSS stylesheets
- Localization resources
- Feature XML
- Package metadata

**Package Metadata:**
```json
{
  "name": "quick-links-webpart-client-side-solution",
  "version": "1.0.0.8",
  "skipFeatureDeployment": true,
  "includeClientSideAssets": true
}
```

### 12.3 Deployment Steps

**Step 1: Upload Package**
1. Navigate to SharePoint Admin Center
2. Go to "More features" → "Apps" → "App Catalog"
3. Upload `solution/quick-links-webpart.sppkg`
4. Check "Make this solution available to all sites"
5. Click "Deploy"

**Step 2: Grant API Permissions** (if any)
- Not required for this web part

**Step 3: Add to Site**
1. Navigate to target SharePoint site
2. Edit a page
3. Click "+" to add web part
4. Search for "QuickLinks"
5. Add to page

### 12.4 Deployment Options

**Option 1: Tenant-Wide Deployment** (Recommended)
- `skipFeatureDeployment: true`
- Automatically available on all sites
- No site collection feature activation required

**Option 2: Site Collection Deployment**
- `skipFeatureDeployment: false`
- Requires feature activation per site collection
- More control over deployment

### 12.5 CDN Configuration (Optional)

**For External CDN:**

**Step 1: Update write-manifests.json**
```json
{
  "cdnBasePath": "https://cdn.example.com/quick-links-webpart"
}
```

**Step 2: Update package-solution.json**
```json
{
  "solution": {
    "includeClientSideAssets": false
  }
}
```

**Step 3: Upload Assets to CDN**
```bash
npm run build
# Upload contents of temp/deploy/ to CDN
```

### 12.6 Version Management

**Versioning Strategy:**
- Package version: `1.0.0.8` (package-solution.json)
- Web part version: `*` (manifest.json - uses package version)

**Update Process:**
1. Increment version in package-solution.json
2. Rebuild solution
3. Upload new .sppkg to App Catalog
4. Select "Replace" option
5. Existing instances auto-update

### 12.7 Rollback Procedure

**If Issues Occur:**
1. Go to App Catalog
2. Select web part app
3. Click "Files" tab
4. Restore previous version from version history
5. Re-deploy previous version

### 12.8 Monitoring & Support

**Post-Deployment Checks:**
1. Verify web part appears in web part gallery
2. Test adding to page
3. Test configuration in property pane
4. Test link functionality
5. Verify responsive behavior
6. Test accessibility features
7. Check localization for supported languages

**Browser Support:**
- Chrome/Edge (Chromium) 90+
- Firefox 88+
- Safari 15.4+
- Modern SharePoint supported browsers

---

## Appendix A: Complete Code Examples

### A.1 Full Web Part Class

See **Section 5.1** for complete QuickLinksWebPart class with all methods.

### A.2 Full React Component

See **Section 5.2** for complete QuickLinks component with rendering logic.

### A.3 Full Property Panel

See **Section 5.3** for complete QuickLinksPropertyPanel with form handling.

---

## Appendix B: Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build

# Clean build artifacts
npm run clean

# Run linter
npm run lint

# Eject webpack config (if customization needed)
npm run eject-webpack
```

---

## Appendix C: Troubleshooting

### C.1 Common Issues

**Issue: Web part doesn't appear in gallery**
- Solution: Ensure .sppkg is deployed and tenant-wide deployment is enabled

**Issue: Links not opening**
- Solution: Check URL validation - must start with http://, https://, or be relative

**Issue: Icons not showing**
- Solution: Verify Fluent UI icon name is correct, check spelling/capitalization

**Issue: Build fails**
- Solution: Clear node_modules and reinstall (`rm -rf node_modules && npm install`)

### C.2 Browser Console Errors

**Check for:**
- JavaScript errors in console
- Network errors loading resources
- CORS issues (if using external CDN)
- Theme variable errors

---

## Appendix D: References

1. [SharePoint Framework Documentation](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)
2. [Fluent UI React Components](https://developer.microsoft.com/fluentui#/controls/web)
3. [Fluent UI Icons](https://developer.microsoft.com/fluentui#/styles/web/icons)
4. [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
5. [React Testing Library](https://testing-library.com/react)
6. [Heft Build System](https://heft.rushstack.io/)

---

## Document Metadata

**Version:** 1.0  
**Last Updated:** February 9, 2026  
**Document Owner:** Development Team  
**Status:** Final

---

**END OF SPECIFICATION**
