# YouTuDown API

## Version v1.1.0

Backend for downloading individual YouTube videos and playlists. This version allows you to retrieve detailed video information, download them in different qualities, and supports both server-side and client-side downloads.

## Features

* ✅ Individual video downloads
* ✅ Playlist downloads
* ✅ Server-side downloads (save to server)
* ✅ Client-side downloads (stream to user)
* ✅ Video information extraction (resolution, duration, available formats)

---

## Frontend — Live Consumer Demo

> 🔗 **[angelr449/YoutuDown-Frontend](https://github.com/angelr449/YoutuDown-Frontend)**

This repository includes a handmade frontend built with **React 19 + TypeScript + Vite** that demonstrates how to consume the YoutuDown API in a real application.

It covers the full user flow:

1. Paste a YouTube URL
2. Call `GET /api/youtuDown/info` to retrieve video info and available formats
3. Select a quality/format
4. Trigger `POST /api/youtuDown/download-stream` to stream the video directly to the browser

It is a good starting point if you want to build your own client on top of this API. Check its repository for setup instructions and environment variable configuration.



---

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

* `url` - YouTube video URL

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

* `infoId`: Unique ID of the temporary file containing video information
* `title`: Video title
* `duration`: Duration in seconds
* `formats`: Array of available formats
  * `id`: Quality format ID
  * `resolution`: Video resolution
  * `hasAudio`: Indicates if it includes audio
  * `hasVideo`: Indicates if it includes video

> **Important:** The `infoId` is required for download. Information is temporarily saved in a `.json` file.

---

### 2. Download Video (Server-side)

**Endpoint:** `POST /api/youtuDown/download`

**Description:** Downloads the video to the server in the specified format and location.

**Body (JSON):**

```json
{
  "outputPath": "/home/user/Videos",
  "filename": "my-video.mp4",
  "infoId": "303d77d2-e9e8-4f72-a8ed-429c51d8940d",
  "formatId": "18"
}
```

**Parameters:**

* `outputPath`: Path where the video will be saved on the server
* `filename`: File name (optional)
* `infoId`: ID obtained from the `/info` request
* `formatId`: Desired quality format ID

**Response:**

```json
{
    "message": "Video downloaded successfully to server"
}
```

---

### 3. Download Video (Client-side Stream)

**Endpoint:** `POST /api/youtuDown/download-stream`

**Description:** Streams the video directly to the client for download in the user's browser.

**Query Params:**

* `infoId` - ID obtained from the `/info` request
* `formatId` - Desired quality format ID

**Example:**

```
POST /api/youtuDown/download-stream?infoId=303d77d2-e9e8-4f72-a8ed-429c51d8940d&formatId=96
```

**Response:**

* Binary stream of the video file
* Content-Type: `video/mp4` or `application/octet-stream`
* Content-Disposition header with the filename

---

### 4. Get Playlist Information

**Endpoint:** `GET /api/youtuDown/playlist/info`

**Description:** Extracts information from all videos in a YouTube playlist.

**Query Parameters:**

* `url` - YouTube playlist URL

**Example Response:**

```json
{
    "playlistId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "playlistTitle": "My Favorite Videos",
    "videoCount": 15,
    "videos": [
        {
            "infoId": "video-1-id",
            "title": "First Video",
            "duration": 180,
            "formats": [...]
        },
        {
            "infoId": "video-2-id",
            "title": "Second Video",
            "duration": 240,
            "formats": [...]
        }
    ]
}
```

---

### 5. Download Playlist (Server-side)

**Endpoint:** `POST /api/youtuDown/playlist/download`

**Description:** Downloads all videos from a playlist to the server.

**Body (JSON):**

```json
{
  "playlistId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "outputPath": "/home/user/Videos/MyPlaylist",
  "formatId": "18"
}
```

**Parameters:**

* `playlistId`: ID obtained from the `/playlist/info` request
* `outputPath`: Directory where videos will be saved on the server
* `formatId`: Desired quality format ID for all videos

**Response:**

```json
{
    "message": "Playlist download started",
    "totalVideos": 15,
    "downloadedVideos": 15
}
```

---

## Usage Flow

### Downloading a Single Video (Client-side)

1. **Get video information:**

   ```
   GET http://localhost:8080/api/youtuDown/info?url=https://youtube.com/watch?v=...
   ```

2. **Save the `infoId` from the response**

3. **Select the desired `formatId` from available formats**

4. **Stream download to client:**

   ```
   POST http://localhost:8080/api/youtuDown/download-stream?infoId=303d77d2-e9e8-4f72-a8ed-429c51d8940d&formatId=96
   ```

### Downloading a Playlist (Server-side)

1. **Get playlist information:**

   ```
   GET http://localhost:8080/api/youtuDown/playlist/info?url=https://youtube.com/playlist?list=...
   ```

2. **Save the `playlistId` from the response**

3. **Download entire playlist:**

   ```
   POST http://localhost:8080/api/youtuDown/playlist/download
   Content-Type: application/json

   {
     "playlistId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
     "outputPath": "/destination/path",
     "formatId": "18"
   }
   ```

---

## Full Documentation

For more details and usage examples, check the Postman documentation:

📄 [Postman Documentation](https://documenter.getpostman.com/view/47022693/2sBXVmeoPz)

---

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/angelr449/YoutuDown.git

# Install dependencies
npm install

# Start the server
npm start
```

The server will run on `http://localhost:8080`

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

## Contributing

Contributions are welcome! Please open an issue or pull request for suggestions and improvements.
