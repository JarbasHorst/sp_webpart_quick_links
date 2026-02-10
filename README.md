# Quick Links Web Part

## Summary

A modern SharePoint Framework (SPFx) web part that allows users to create and display quick links with custom icons, URLs, and target options. This web part features a card-based design with hover effects and supports both light and dark themes.

![Quick Links Web Part Demo](https://github.com/user-attachments/assets/9b7a5cba-92be-4d50-89d2-7254c4a7b2fb)

## Features

- ✨ Modern, card-based UI design with smooth hover effects
- 🔗 Add multiple quick links with custom titles and URLs
- 🎨 Choose from Fluent UI icons for each link
- 🎯 Configure links to open in the same tab or a new tab
- 📝 Customizable web part title
- 🌗 Theme-aware styling (supports light and dark themes)
- 📱 Fully responsive design for mobile and tablet devices
  - **Desktop (> 768px)**: Full-size cards with optimal spacing
  - **Tablet (481px–768px)**: Adaptive cards with adjusted sizing
  - **Mobile (≤ 480px)**: Extra compact layout for small screens
- 🎯 No horizontal scrolling on any screen size
- ⚙️ Easy-to-use property pane for managing links

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.22.2-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

- Node.js v22.14.0 or higher (recommended)
- SharePoint Online environment

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| quick-links-webpart | GitHub Copilot |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.0     | February 9, 2026 | Initial release with full quick links functionality |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- In the command-line run:
  - `npm install`
  - `npm run start` (for local testing)
  - `npm run build` (for production build)

## Usage

### Adding the Web Part to a Page

1. Edit a SharePoint page
2. Click the "+" icon to add a web part
3. Search for "QuickLinks"
4. Add the web part to your page

### Configuring Quick Links

1. Click the **Edit** button (pencil icon) on the web part
2. In the property pane on the right:
   - **Web Part Title**: Enter a title for your quick links section (optional)
   - **Quick Links**: Configure your links

### Adding a Link

In the Quick Links section of the property pane:

1. **Link Title**: Enter the display name for your link
2. **URL**: Enter the full URL (e.g., https://example.com)
3. **Icon Name**: Enter a Fluent UI icon name (e.g., Home, Globe, Mail, Document)
   - Popular icons: Home, Globe, Mail, People, Calendar, Document, Folder, Link, Settings, Info
   - See [Fluent UI Icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons) for all available icons
4. **Open in new tab**: Check this box if you want the link to open in a new browser tab
5. Click **Add Link** to save

### Managing Links

- **Edit**: Click the Edit button next to any link to modify it
- **Delete**: Click the Delete button to remove a link
- Links are displayed in the order they were added

## Features

This web part illustrates the following concepts:

- Building modern SPFx web parts with React and TypeScript
- Creating custom property pane controls for rich configuration experiences
- Using Fluent UI components and icons for consistent Microsoft 365 design
- Implementing responsive grid layouts with CSS Grid and media queries
- Supporting multiple device types (desktop, tablet, mobile)
- Theme-aware styling with CSS custom properties
- Type-safe development with TypeScript interfaces

### Responsive Design

The Quick Links web part is fully responsive and optimized for all screen sizes:

- **Desktop (> 768px)**: Cards use CSS Grid `minmax(140px, 150px)` with 48px icons and 16px gaps; cards typically 140-150px wide but can grow larger on wide screens
- **Tablet (481px–768px)**: Cards use flexible `minmax(120px, 1fr)` with 40px icons and 12px gaps; actual card width adapts to available space
- **Mobile (≤ 480px)**: Cards use flexible `minmax(100px, 1fr)` with 36px icons and 10px gaps; cards expand to fill available width

The layout uses CSS Grid with `auto-fit` and `minmax()` to ensure cards adapt smoothly to any screen width without horizontal scrolling.

## Project Structure

```
src/webparts/quickLinks/
├── components/
│   ├── QuickLinks.tsx              # Main React component
│   ├── QuickLinks.module.scss      # Component styles
│   ├── IQuickLinksProps.ts         # Component props interface
│   └── IQuickLinkItem.ts           # Link item interface
├── propertyPane/
│   ├── PropertyPaneQuickLinks.ts            # Custom property pane field
│   ├── QuickLinksPropertyPanel.tsx          # Property panel React component
│   └── QuickLinksPropertyPanel.module.scss  # Property panel styles
├── QuickLinksWebPart.ts            # Web part class
└── loc/                            # Localization resources
```

## Technologies Used

- **SPFx 1.22.2**: Latest SharePoint Framework
- **React 17**: UI library
- **TypeScript 5.8**: Type-safe development
- **Fluent UI 8**: Microsoft's design system
- **SCSS**: Styling with Sass

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
- [Heft Documentation](https://heft.rushstack.io/)
- [Fluent UI Icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons)