# Dark Mode

## Overview

The Dark Mode feature provides users with an alternative color scheme that uses darker colors for backgrounds and lighter colors for text and interface elements. This feature reduces eye strain in low-light environments, conserves battery life on OLED screens, and offers a visually appealing alternative to the standard light theme. Dark Mode is fully customizable and respects user system preferences.

## Implementation Approach

### CSS Custom Properties
The dark mode implementation uses CSS custom properties (CSS variables) to define theme colors, allowing for easy switching between light and dark themes without duplicating styles.

```css
:root {
  /* Light theme colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent-primary: #0066cc;
  --accent-secondary: #ff6600;
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  /* Dark theme colors */
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #bbbbbb;
  --accent-primary: #4da6ff;
  --accent-secondary: #ff9966;
  --border-color: #333333;
  --shadow-color: rgba(0, 0, 0, 0.3);
}
```

### Theme Switching Mechanism
```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.applyTheme(this.currentTheme);
    this.watchSystemTheme();
  }
  
  getStoredTheme() {
    return localStorage.getItem('theme');
  }
  
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }
  
  watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
  }
}
```

## User Interface Components

### Theme Toggle Button
```html
<button 
  id="theme-toggle" 
  class="theme-toggle" 
  aria-label="Toggle dark mode"
  title="Toggle dark mode"
>
  <svg class="sun-icon" aria-hidden="true" viewBox="0 0 24 24">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.696a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
  <svg class="moon-icon" aria-hidden="true" viewBox="0 0 24 24">
    <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
  </svg>
</button>
```

```css
.theme-toggle {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.sun-icon, .moon-icon {
  width: 20px;
  height: 20px;
  fill: var(--text-primary);
}

[data-theme="dark"] .sun-icon {
  display: none;
}

[data-theme="light"] .moon-icon {
  display: none;
}
```

### Themed Components
```css
/* Card component with theme support */
.card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 16px var(--shadow-color);
}

/* Button component with theme support */
.btn {
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:hover {
  background: var(--accent-secondary);
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

/* Form elements with theme support */
.form-input {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  padding: 0.75rem;
  width: 100%;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.2);
}
```

## System Integration

### Prefers-Color-Scheme Media Query
The implementation respects the user's system preference for dark mode using the `prefers-color-scheme` media query:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-primary: #121212;
    --bg-secondary: #1e1e1e;
    --text-primary: #ffffff;
    --text-secondary: #bbbbbb;
    --accent-primary: #4da6ff;
    --accent-secondary: #ff9966;
    --border-color: #333333;
    --shadow-color: rgba(0, 0, 0, 0.3);
  }
}
```

### Local Storage Persistence
User preferences are stored in localStorage to maintain consistency across sessions:

```javascript
// Save theme preference
localStorage.setItem('theme', 'dark');

// Retrieve theme preference
const savedTheme = localStorage.getItem('theme');

// Clear theme preference (use system default)
localStorage.removeItem('theme');
```

## API Integration

### Theme Preference Endpoint
```
GET /api/v1/user/preferences/theme
```

#### Response
```json
{
  "success": true,
  "theme": "dark",
  "systemPreference": "light"
}
```

### Update Theme Preference
```
PUT /api/v1/user/preferences/theme
```

#### Request Body
```json
{
  "theme": "dark"
}
```

#### Response
```json
{
  "success": true,
  "theme": "dark",
  "message": "Theme preference updated successfully"
}
```

## Accessibility Considerations

### Color Contrast
All theme colors meet WCAG 2.1 AA contrast requirements:
- Text and background: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- Interactive elements: Sufficient contrast for visibility

### Focus Indicators
```css
/* Enhanced focus indicators for dark mode */
:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

button:focus-visible {
  box-shadow: 0 0 0 3px var(--accent-primary);
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance Optimization

### CSS Containment
```css
[data-theme] {
  contain: style;
}
```

### Efficient Theme Switching
- Uses CSS custom properties for instant theme changes
- Avoids costly DOM manipulations
- Leverages hardware acceleration for smooth transitions

## Component-Specific Theming

### Map Components
```css
/* Map container theming */
.map-container {
  background: var(--bg-secondary);
}

.map-control {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}

/* Ensure map tiles work well in dark mode */
.leaflet-tile-container img {
  filter: brightness(0.9) contrast(1.1);
}
```

### Chart and Data Visualization
```css
.chart-container {
  background: var(--bg-primary);
}

.chart-axis {
  stroke: var(--text-secondary);
}

.chart-grid {
  stroke: var(--border-color);
}
```

## User Preferences

### Theme Settings Panel
```html
<div class="theme-settings" role="dialog" aria-labelledby="theme-settings-title">
  <h2 id="theme-settings-title">Appearance Settings</h2>
  
  <fieldset>
    <legend>Theme</legend>
    
    <div class="radio-group">
      <input type="radio" id="theme-light" name="theme" value="light">
      <label for="theme-light">Light</label>
    </div>
    
    <div class="radio-group">
      <input type="radio" id="theme-dark" name="theme" value="dark">
      <label for="theme-dark">Dark</label>
    </div>
    
    <div class="radio-group">
      <input type="radio" id="theme-system" name="theme" value="system" checked>
      <label for="theme-system">Use system setting</label>
    </div>
  </fieldset>
  
  <button type="button" class="btn btn-secondary">Save Preferences</button>
</div>
```

### Sync Across Devices
User theme preferences are synchronized across devices when logged in:

```javascript
class CrossDeviceThemeSync {
  async syncTheme() {
    if (this.user.isLoggedIn()) {
      const serverTheme = await this.fetchUserTheme();
      if (serverTheme && serverTheme !== this.getCurrentTheme()) {
        this.applyTheme(serverTheme);
      }
    }
  }
  
  async saveTheme(theme) {
    if (this.user.isLoggedIn()) {
      await this.updateUserTheme(theme);
    }
    localStorage.setItem('theme', theme);
  }
}
```

## Testing

### Visual Regression Testing
- Screenshots of all components in both light and dark modes
- Automated comparison of visual changes
- Testing across different browsers and devices

### Accessibility Testing
- Contrast ratio validation for all color combinations
- Screen reader compatibility testing
- Keyboard navigation verification

### Performance Testing
- Theme switching performance benchmarks
- CSS paint time analysis
- Memory usage monitoring

## Browser Compatibility

### Supported Browsers
- Chrome 69+
- Firefox 62+
- Safari 12.1+
- Edge 79+
- iOS Safari 12.2+
- Android Chrome 69+

### Polyfills for Older Browsers
```javascript
// CSS custom properties polyfill for older browsers
if (!window.CSS || !CSS.supports('color', 'var(--test)')) {
  // Load polyfill
  loadCSSVarsPolyfill();
}
```

## Implementation Best Practices

### CSS Organization
```css
/* Theme variables at the top of the stylesheet */
:root {
  /* Color definitions */
  --color-primary: #0066cc;
  --color-secondary: #ff6600;
  
  /* Background colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  
  /* Text colors */
  --text-primary: #333333;
  --text-secondary: #666666;
}

/* Dark theme overrides */
[data-theme="dark"] {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #bbbbbb;
}

/* Component styles using variables */
.button {
  background: var(--color-primary);
  color: var(--text-primary);
}
```

### JavaScript Integration
```javascript
// Initialize theme manager
const themeManager = new ThemeManager();

// Listen for theme changes
document.addEventListener('themechange', (event) => {
  // Update any JavaScript-dependent elements
  updateChartColors(event.detail.theme);
  updateMapTheme(event.detail.theme);
});

// Theme change event
class ThemeManager {
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme }
    }));
  }
}
```

## Troubleshooting

### Common Issues

1. **Theme Not Applying**
   - Solution: Check CSS custom property definitions
   - Solution: Verify data-theme attribute is set correctly
   - Solution: Ensure CSS is loaded before JavaScript executes

2. **Poor Color Contrast**
   - Solution: Use contrast checking tools
   - Solution: Adjust color values to meet WCAG requirements
   - Solution: Test with various color blindness simulations

3. **Flash of Unstyled Content (FOUC)**
   - Solution: Inline critical theme CSS
   - Solution: Set initial theme in HTML
   - Solution: Use JavaScript to prevent FOUC

### Flash of Unstyled Content Prevention
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <script>
    // Set theme before page load to prevent FOUC
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    document.documentElement.setAttribute('data-theme', initialTheme);
  </script>
</head>
```

## Future Enhancements

### Theme Customization
- User-defined color schemes
- Hue shifting for personalized themes
- Contrast adjustment sliders
- Font size and weight customization

### Advanced Features
- Automatic theme switching based on time of day
- Location-based theme adjustments
- Ambient light sensor integration
- Eye tracking for adaptive themes

### Integration Opportunities
- Calendar app synchronization
- Operating system theme APIs
- Browser extension integration
- Smart home device coordination

## Best Practices

### For Developers
- Use CSS custom properties for all themeable values
- Test themes thoroughly across all components
- Ensure proper color contrast ratios
- Implement smooth transitions between themes
- Respect user system preferences by default

### For Designers
- Create cohesive color palettes for both themes
- Consider the emotional impact of color choices
- Ensure visual hierarchy remains clear in both themes
- Test designs with various vision impairments

### For Product Managers
- Gather user feedback on theme preferences
- Monitor usage analytics for theme adoption
- Plan for accessibility compliance
- Consider localization of theme names and descriptions