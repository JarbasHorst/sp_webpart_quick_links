# Quick Links Web Part - User Guide

## Overview

The Quick Links web part allows you to create a visually appealing collection of links on your SharePoint pages. Each link is displayed as a card with an icon, making it easy for users to find and access important resources.

![Quick Links Web Part](https://github.com/user-attachments/assets/9b7a5cba-92be-4d50-89d2-7254c4a7b2fb)

## Visual Layout

The web part displays links in a responsive grid layout:

```
┌────────────────────────────────────────────────────────────┐
│  Quick Links                                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │    🏠     │  │    🌐     │  │    ✉     │  │    📄     │ │
│  │   Home   │  │  Intranet │  │   Email  │  │   Docs   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │    👥     │  │    📅     │  │    ⚙     │               │
│  │  People  │  │ Calendar │  │ Settings │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Card Features

Each link card includes:
- **Icon**: Large, colorful icon representing the link (configurable)
- **Title**: Clear, readable text label
- **Hover Effect**: Card elevates and border color changes on hover
- **Click Action**: Opens the URL in the same tab or new tab (configurable)

### Responsive Design

- **Desktop**: 4 cards per row (or as many as fit)
- **Tablet**: 2-3 cards per row
- **Mobile**: 1-2 cards per row

## Configuration Interface

### Property Pane Layout

```
┌─────────────────────────────────┐
│  Quick Links Configuration      │
├─────────────────────────────────┤
│                                  │
│  Web Part Title:                │
│  [My Quick Links        ]       │
│                                  │
│  ─────────────────────────       │
│  Quick Links                    │
│  ─────────────────────────       │
│                                  │
│  Link Title: *                  │
│  [Enter link title      ]       │
│                                  │
│  URL: *                         │
│  [https://...           ]       │
│                                  │
│  Icon Name:                     │
│  [Home                  ]       │
│  💡 Enter Fluent UI icon name   │
│                                  │
│  ☑ Open in new tab              │
│                                  │
│  [  Add Link  ]                 │
│                                  │
│  ─────────────────────────       │
│  Current Links                  │
│  ─────────────────────────       │
│                                  │
│  🏠 Home                         │
│  https://intranet.com           │
│  Opens in new tab               │
│  [ Edit ] [ Delete ]            │
│                                  │
│  📄 Documents                    │
│  https://docs.company.com       │
│  Opens in same tab              │
│  [ Edit ] [ Delete ]            │
│                                  │
└─────────────────────────────────┘
```

## Step-by-Step Configuration Guide

### Step 1: Add the Web Part

1. Navigate to your SharePoint page
2. Click **Edit** (top right corner)
3. Click the **+** icon where you want to add the web part
4. Type "QuickLinks" in the search box
5. Click on the **QuickLinks** web part to add it

### Step 2: Configure the Title

1. Click the **Edit** (pencil) icon on the web part
2. In the property pane, find **Web Part Title**
3. Enter your desired title (e.g., "Quick Links", "Useful Resources", "Important Links")
4. Leave blank if you don't want a title

### Step 3: Add Your First Link

1. In the property pane, scroll to the **Quick Links** section
2. Fill in the form:
   - **Link Title**: Enter a descriptive name (e.g., "Company Intranet")
   - **URL**: Enter the complete URL (e.g., "https://intranet.company.com")
   - **Icon Name**: Enter a Fluent UI icon name (e.g., "Home", "Globe", "Document")
   - **Open in new tab**: Check if you want the link to open in a new browser tab
3. Click **Add Link**

### Step 4: Add More Links

Repeat Step 3 to add additional links. You can add as many links as needed.

### Step 5: Manage Existing Links

**To Edit a Link:**
1. Find the link in the "Current Links" section
2. Click the **Edit** button
3. Modify the fields as needed
4. Click **Update**

**To Delete a Link:**
1. Find the link in the "Current Links" section
2. Click the **Delete** button
3. Confirm the deletion

### Step 6: Publish the Page

1. Once you're satisfied with your quick links, click **Republish** at the top of the page
2. Your quick links are now live!

## Icon Reference

### Popular Icon Names

Here are some commonly used Fluent UI icon names:

**General:**
- `Home` - Home/house icon
- `Link` - Chain link icon (default)
- `Globe` - World/globe icon
- `Info` - Information icon
- `Star` - Star icon
- `Heart` - Heart icon

**Communication:**
- `Mail` - Email/envelope icon
- `Chat` - Chat bubble icon
- `Phone` - Phone icon
- `Video` - Video camera icon

**Documents:**
- `Document` - Single document icon
- `DocumentSet` - Multiple documents icon
- `PDF` - PDF file icon
- `Folder` - Folder icon
- `FolderOpen` - Open folder icon

**People:**
- `People` - Multiple people icon
- `Contact` - Single person icon
- `Group` - Group/team icon
- `ProfileSearch` - Search for person icon

**Calendar & Time:**
- `Calendar` - Calendar icon
- `Clock` - Clock icon
- `DateTime` - Date and time icon
- `EventDate` - Event icon

**Tools:**
- `Settings` - Gear/settings icon
- `Search` - Magnifying glass icon
- `Filter` - Filter icon
- `Chart` - Chart/graph icon
- `Dashboard` - Dashboard icon

**Navigation:**
- `NavigateBack` - Back arrow
- `NavigateForward` - Forward arrow
- `Up` - Up arrow
- `Down` - Down arrow

**Actions:**
- `Add` - Plus sign
- `Edit` - Pencil icon
- `Delete` - Trash can icon
- `Save` - Floppy disk icon

### Finding More Icons

For a complete list of available icons:
1. Visit: https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
2. Browse or search for icons
3. Copy the icon name (without the "Icon" suffix)
4. Use the name in the Icon Name field

**Example:**
- If the icon is listed as "HomeIcon", use "Home"
- If the icon is listed as "GlobalNavButtonIcon", use "GlobalNavButton"

## Tips and Best Practices

### Link Organization

1. **Group Related Links**: Keep similar links together
2. **Limit Number**: 6-12 links is ideal for quick access
3. **Meaningful Titles**: Use clear, concise titles (2-3 words)
4. **Consistent Icons**: Choose icons that clearly represent the link's purpose

### Icon Selection

1. **Be Intuitive**: Choose icons that users will immediately understand
2. **Stay Consistent**: Use similar icon styles throughout
3. **Test Visibility**: Ensure icons are recognizable at all sizes

### URL Best Practices

1. **Use Full URLs**: Always include "https://" or "http://"
2. **Test Links**: Verify all URLs work before publishing
3. **Internal Links**: Use relative URLs for links within your SharePoint site
4. **External Links**: Always set "Open in new tab" for external websites

### Title Guidelines

1. **Optional Title**: The web part title is optional; leave blank for a cleaner look
2. **Clear Context**: Use titles like "Quick Links", "Resources", "Useful Links"
3. **Keep It Short**: 1-3 words is ideal

## Troubleshooting

### Link Doesn't Work

**Problem**: Clicking a link does nothing or shows an error

**Solutions:**
- Verify the URL is complete (includes https://)
- Check for typos in the URL
- Test the URL in a browser first
- Ensure you have permission to access the destination

### Icon Doesn't Appear

**Problem**: Icon shows as a generic symbol or is missing

**Solutions:**
- Verify you're using a valid Fluent UI icon name
- Check spelling and capitalization (e.g., "Home" not "home")
- Try a common icon like "Link" or "Home" to test
- Leave the Icon Name field blank to use the default "Link" icon

### Cards Look Wrong

**Problem**: Layout is broken or cards are misaligned

**Solutions:**
- Clear your browser cache
- Refresh the page
- Try viewing in a different browser
- Check if the page theme is compatible

### Can't Edit Links

**Problem**: Edit button is disabled or doesn't respond

**Solutions:**
- Make sure you have edit permissions on the page
- Cancel any pending edits first
- Refresh the page and try again

## Accessibility

The Quick Links web part is designed with accessibility in mind:

- **Keyboard Navigation**: All links are keyboard accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Theme-aware colors meet WCAG standards
- **Focus Indicators**: Clear visual focus states

## Mobile Experience

The web part is fully responsive:

- **Touch Friendly**: Large tap targets for mobile devices
- **Adaptive Layout**: Grid adjusts to screen size
- **Performance**: Optimized for mobile connections

## Support

For additional help or to report issues, please contact your SharePoint administrator or create an issue in the project repository.
