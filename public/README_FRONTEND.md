# YouTuDown Frontend

A minimalist, modern frontend for the YouTuDown API built with vanilla HTML, CSS, and JavaScript.

## Features

✨ **Clean & Minimalist Design**
- Inspired by YouTube, Discord, and WhatsApp aesthetics
- Smooth animations and transitions
- Responsive design for all devices

🎨 **Theme System**
- Light mode (neutral colors)
- Dark mode (YouTube/Discord/WhatsApp inspired)
- Auto mode (follows system preference)
- Persistent theme selection

🌍 **Bilingual Support**
- English and Spanish
- Instant language switching
- Persistent language selection

📥 **Download Features**
- Individual video downloads
- Playlist support with per-video downloads
- Quality format selection
- Download progress indication
- Automatic file naming

## Setup

### Prerequisites

- YouTuDown API running on `http://localhost:8080`
- Modern web browser

### Installation

1. Clone or download the frontend files:
   - `index.html`
   - `styles.css`
   - `script.js`

2. Update the API URL if needed in `script.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api/youtuDown';
   ```

3. Open `index.html` in your browser or serve it with a local server:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js (http-server)
   npx http-server -p 3000
   
   # Using PHP
   php -S localhost:3000
   ```

4. Access the frontend at `http://localhost:3000`

## Usage

### Downloading Individual Videos

1. **Paste URL**: Enter a YouTube video URL in the input field
2. **Analyze**: Click the "Analyze" button to fetch video information
3. **Select Quality**: Choose your preferred quality format from the available options
4. **Download**: Click the "Download" button to start the download

### Downloading Playlists

1. **Paste URL**: Enter a YouTube playlist URL
2. **Analyze**: The interface will automatically detect it's a playlist
3. **View Videos**: Browse through all videos in the playlist
4. **Download**: Click the download button next to any video to download it individually

## Configuration

### Changing API URL

Edit `script.js` and update the API base URL:

```javascript
const API_BASE_URL = 'http://your-api-url:port/api/youtuDown';
```

### Customizing Theme Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --accent-primary: #1a73e8; /* Change primary accent color */
    --bg-primary: #ffffff;     /* Change background color */
    /* ... more variables ... */
}
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## CORS Configuration

If you encounter CORS issues, make sure your API server has CORS enabled:

```javascript
// Express.js example
const cors = require('cors');
app.use(cors());
```

## File Structure

```
frontend/
├── index.html      # Main HTML structure
├── styles.css      # All styles and themes
├── script.js       # Application logic
└── README.md       # This file
```

## Features in Detail

### Theme System
- **Light Mode**: Clean, neutral color scheme perfect for daytime use
- **Dark Mode**: Comfortable dark theme inspired by popular apps
- **Auto Mode**: Automatically switches based on system preference

### Language Support
- Seamless switching between English and Spanish
- All UI elements are translated
- Settings persist across sessions

### Download Progress
- Visual feedback during downloads
- Estimated time display
- Smooth progress animations

## Troubleshooting

### "Failed to fetch video information"
- Ensure the API server is running
- Check the API URL in `script.js`
- Verify the YouTube URL is valid

### "Download failed"
- Check your internet connection
- Verify the selected format is available
- Ensure the API has proper permissions

### CORS Errors
- Enable CORS on your API server
- Use a CORS browser extension for development
- Serve the frontend from the same origin as the API

## License

Same as YouTuDown API - MIT License

## Credits

Created by angel_r

Fonts:
- DM Sans by Google Fonts
- JetBrains Mono by JetBrains
