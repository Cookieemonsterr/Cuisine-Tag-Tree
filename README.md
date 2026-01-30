# 🍽️ Professional Cuisine & Tag Selector Demo

A production-ready web application for managing cuisine and tag selections with advanced features.

## ✨ Features

### Core Functionality

- ✅ **Smart Hierarchy**: Select up to 3 cuisines → automatically filter related tags (max 6) and subpage tags (max 2)
- ✅ **Intelligent Filtering**: Tags dynamically update based on cuisine selection
- ✅ **Real-time Validation**: Prevents exceeding selection limits with friendly notifications

### Advanced Features

- 🔍 **Search Across All Data**: Search cuisines and tags in real-time
- 📊 **Analytics Dashboard**: View completion percentage and category breakdown
- 💾 **Auto-Save**: Automatically saves your selections to browser storage
- 📤 **Export/Import**: Download selections as JSON or import previously saved data
- ⚙️ **Customizable Limits**: Adjust max cuisines, tags, and subpage tags
- 🎨 **Dark Mode**: Toggle dark mode for comfortable viewing
- 📋 **Live Preview**: See JSON export in real-time
- 🔔 **Toast Notifications**: Get instant feedback for all actions
- 💻 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

1. **Open the App**
   - Open `index.html` in your web browser
   - No installation needed, no dependencies to install

2. **Select Cuisines**
   - Click on up to 3 cuisine buttons
   - Filter by category using the filter chips (Arabic, Asian, Indian, etc.)
   - Or search by name in the search box

3. **View Related Tags**
   - Once you select cuisines, tags automatically filter
   - Only shows tags associated with your selected cuisines
   - Select up to 6 tags from the available options

4. **Choose Subpage Tags**
   - Select up to 2 subpage tags related to your cuisines
   - These are pre-categorized food items specific to each cuisine

5. **View Results**
   - Click the **Preview** tab to see your selections
   - View the JSON export ready to copy
   - **Analytics** tab shows completion percentage and breakdown

6. **Export Your Data**
   - Click **Export** button in sidebar to download JSON
   - Or view in Preview tab and copy JSON directly

7. **Import Previous Work**
   - Click **Import** button to upload previously saved JSON file
   - Your selections will be restored

## 📱 Navigation

### Sidebar Menu

- **Selector** - Main selection interface
- **Preview** - View selections and JSON export
- **Analytics** - Statistics and progress tracking
- **Settings** - Customize limits and preferences
- **Export** - Download current selections
- **Import** - Load previous selections
- **Clear** - Reset all selections

### Settings Available

- Adjust max cuisines (1-10)
- Adjust max tags (1-20)
- Adjust max subpage tags (1-10)
- Toggle auto-save
- Toggle category grouping
- Enable dark mode

## 🎯 Use Cases

### For Partners/Restaurants

- Easily configure which cuisines and tags apply to their offerings
- Export as JSON for API integration
- Save multiple configurations and import later

### For Platform Managers

- Test different cuisine/tag combinations
- Export configurations for bulk import
- Track selection patterns with analytics

## 📊 Data Structure

The app includes comprehensive data:

- **30+ Cuisines** across multiple categories (Arabic, Asian, Indian, European, American)
- **100+ Tags** with categorization (Deals, Food, Beverages, Desserts, etc.)
- **40+ Subpage Tags** for detailed categorization

Each cuisine has:

- Name and category
- Associated food tags
- Associated subpage tags

## 🔄 Keyboard Shortcuts

- **Ctrl/Cmd + F** - Open search
- **Esc** - Close modals

## 💾 Local Storage

Your selections are automatically saved to browser storage if auto-save is enabled. They persist even after closing the browser!

## 🔌 Integration

### Export Format

```json
{
  "cuisines": [
    {
      "id": 25,
      "name": "Arabic",
      "category": "Arabic"
    }
  ],
  "tags": [
    {
      "id": 596,
      "name": "Arabic",
      "category": "Cuisine"
    }
  ],
  "subpageTags": [
    {
      "id": 2,
      "name": "Shawarma"
    }
  ],
  "timestamp": "2024-01-23T10:30:00.000Z"
}
```

Use this JSON format to integrate with your backend API.

## 🎨 Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
  --primary-color: #ff6b35;
  --secondary-color: #004e89;
  --accent-color: #1ac8ed;
  /* ... more colors */
}
```

### Data

Edit `enhanced-data.js` to:

- Add more cuisines
- Modify cuisine-tag relationships
- Change tag categories
- Update subpage tags

## 🐛 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 Files Structure

```
cuisine-tag-demo/
├── index.html           # Main HTML structure
├── enhanced-app.js      # Application logic
├── enhanced-data.js     # Cuisine & tag data
└── styles.css           # Styling & responsive design
```

## 🚀 Deployment

Perfect for:

- Internal dashboard
- Partner onboarding tool
- Admin panel feature
- Configuration management tool

Simply copy all files to any web server and it works!

## 💡 Tips & Tricks

1. **Search is powerful**: Type to search across all cuisines and tags
2. **Filter by category**: Use filter chips to narrow down cuisines
3. **Batch operations**: Import/export to manage multiple configurations
4. **Analytics insight**: Check completion % to understand selection patterns
5. **Settings flexibility**: Adjust limits based on your needs

## 🤝 Support

If you need to:

- Add more data: Edit `enhanced-data.js`
- Change styling: Modify `styles.css`
- Add features: Extend `enhanced-app.js`

All code is well-commented and organized!

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Production Ready ✅
