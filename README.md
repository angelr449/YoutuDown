# YouTuDown API

## Version v0.1.0-Beta

Backend for downloading individual YouTube videos. This version allows you to retrieve detailed video information and download them in different qualities.

> **Note:** Future versions will include playlist support and WebSockets for real-time progress bars.

## Features

- ✅ Individual video downloads
- ✅ Video information extraction (resolution, duration, available formats)
- ⏳ Playlist support (coming soon)
- ⏳ WebSockets for progress bar (coming soon)

## API Endpoints

### Base Route
```
http://localhost:8080/api/youtuDown
```

---

### 1. Get Video Information

**Endpoint:** `GET /api/youtuDown/info`

**Description:** Extracts video information using the provided URL.

**Query Parameters:**
- `url` - YouTube video URL

**Example Response:**
```json
{
    "infoId": "303d77d2-e9e8-4f72-a8ed-429c51d8940d",
    "title": "Sono Bisque Doll wa Koi wo Suru 「 AMV 」- Señorita 💖",
    "duration": 195,
    "formats": [
        {
            "id": "91",
            "resolution": "144p",
            "hasAudio": true,
            "hasVideo": true
        },
        {
            "id": "18",
            "resolution": "360p",
            "hasAudio": true,
            "hasVideo": true
        },
        {
            "id": "95",
            "resolution": "720p",
            "hasAudio": true,
            "hasVideo": true
        },
        {
            "id": "96",
            "resolution": "1080p",
            "hasAudio": true,
            "hasVideo": true
        }
    ]
}
```

**Response Fields:**
- `infoId`: Unique ID of the temporary file containing video information
- `title`: Video title
- `duration`: Duration in seconds
- `formats`: Array of available formats
  - `id`: Quality format ID
  - `resolution`: Video resolution
  - `hasAudio`: Indicates if it includes audio
  - `hasVideo`: Indicates if it includes video

> **Important:** The `infoId` is required for download. Information is temporarily saved in a `.json` file.

---

### 2. Download Video

**Endpoint:** `POST /api/youtuDown/download`

**Description:** Downloads the video in the specified format and location.

**Body (JSON):**
```json
{
  "outputPath": "/home/angelrios/Escritorio",
  "filename": "betas.mp4",
  "infoId": "303d77d2-e9e8-4f72-a8ed-429c51d8940d",
  "formatId": "18"
}
```

**Parameters:**
- `outputPath`: Path where the video will be saved
- `filename`: File name (optional)
- `infoId`: ID obtained from the `/info` request
- `formatId`: Desired quality format ID

**Response:**
```json
{
    "messege": "download video funcionando"
}
```

---

## Usage Flow

1. **Get video information:**
   ```bash
   GET http://localhost:8080/api/youtuDown/info?url=https://youtube.com/watch?v=...
   ```

2. **Save the `infoId` from the response**

3. **Select the desired `formatId` from available formats**

4. **Download the video:**
   ```bash
   POST http://localhost:8080/api/youtuDown/download
   Content-Type: application/json

   {
     "outputPath": "/destination/path",
     "filename": "my-video.mp4",
     "infoId": "303d77d2-e9e8-4f72-a8ed-429c51d8940d",
     "formatId": "96"
   }
   ```

## Full Documentation

For more details and usage examples, check the Postman documentation:

📄 [Postman Documentation](https://documenter.getpostman.com/view/47022693/2sBXVkCqEP)

---

## Installation and Setup

```bash
# Clone the repository
git clone [https://github.com/angelr449/YoutuDown.git]

# Install dependencies
npm install

# Start the server
npm start
```

The server will run on `http://localhost:8080`

---

## License

MIT License

Copyright (c) 2026 angel_r

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Contributing

Contributions are welcome! Please open an issue or pull request for suggestions and improvements.