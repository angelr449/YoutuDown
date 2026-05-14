# YouTuDown API

## Versión v1.1.0

Backend para descargar videos individuales de YouTube y playlists completas. Esta versión permite obtener información detallada de los videos, descargarlos en distintas calidades y soporta tanto descargas en el servidor como en el cliente.

## Funcionalidades

* ✅ Descarga de videos individuales
* ✅ Descarga de playlists
* ✅ Descarga en el servidor (guardar en el servidor)
* ✅ Descarga en el cliente (stream al usuario)
* ✅ Extracción de información del video (resolución, duración, formatos disponibles)

---

## Frontend — Demo de Consumo

> 🔗 **[angelr449/YoutuDown-Frontend](https://github.com/angelr449/YoutuDown-Frontend)**

Este repositorio cuenta con un frontend hecho a mano usando **React 19 + TypeScript + Vite** que demuestra cómo consumir la API de YoutuDown en una aplicación real.

Cubre el flujo completo de uso:

1. Pegar una URL de YouTube
2. Llamar a `GET /api/youtuDown/info` para obtener la información del video y los formatos disponibles
3. Seleccionar una calidad/formato
4. Disparar `POST /api/youtuDown/download-stream` para hacer streaming del video directamente al navegador

Es un buen punto de partida si quieres construir tu propio cliente sobre esta API. Consulta su repositorio para instrucciones de instalación y configuración de variables de entorno.



---

## Endpoints del API

### Ruta Base

```
http://localhost:8080/api/youtuDown
```

---

### 1. Obtener Información del Video

**Endpoint:** `GET /api/youtuDown/info`

**Descripción:** Extrae la información del video usando la URL proporcionada.

**Parámetros de Query:**

* `url` - URL del video de YouTube

**Respuesta de ejemplo:**

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

**Campos de la respuesta:**

* `infoId`: ID único del archivo temporal con la información del video
* `title`: Título del video
* `duration`: Duración en segundos
* `formats`: Arreglo de formatos disponibles
  * `id`: ID del formato de calidad
  * `resolution`: Resolución del video
  * `hasAudio`: Indica si incluye audio
  * `hasVideo`: Indica si incluye video

> **Importante:** El `infoId` es necesario para descargar. La información se guarda temporalmente en un archivo `.json`.

---

### 2. Descargar Video (en el Servidor)

**Endpoint:** `POST /api/youtuDown/download`

**Descripción:** Descarga el video en el servidor en el formato y ubicación especificados.

**Body (JSON):**

```json
{
  "outputPath": "/home/user/Videos",
  "filename": "mi-video.mp4",
  "infoId": "303d77d2-e9e8-4f72-a8ed-429c51d8940d",
  "formatId": "18"
}
```

**Parámetros:**

* `outputPath`: Ruta donde se guardará el video en el servidor
* `filename`: Nombre del archivo (opcional)
* `infoId`: ID obtenido del request a `/info`
* `formatId`: ID del formato de calidad deseado

**Respuesta:**

```json
{
    "message": "Video downloaded successfully to server"
}
```

---

### 3. Descargar Video (Stream al Cliente)

**Endpoint:** `POST /api/youtuDown/download-stream`

**Descripción:** Transmite el video directamente al cliente para descarga en el navegador del usuario.

**Parámetros de Query:**

* `infoId` - ID obtenido del request a `/info`
* `formatId` - ID del formato de calidad deseado

**Ejemplo:**

```
POST /api/youtuDown/download-stream?infoId=303d77d2-e9e8-4f72-a8ed-429c51d8940d&formatId=96
```

**Respuesta:**

* Stream binario del archivo de video
* Content-Type: `video/mp4` o `application/octet-stream`
* Header Content-Disposition con el nombre del archivo

---

### 4. Obtener Información de una Playlist

**Endpoint:** `GET /api/youtuDown/playlist/info`

**Descripción:** Extrae la información de todos los videos en una playlist de YouTube.

**Parámetros de Query:**

* `url` - URL de la playlist de YouTube

**Respuesta de ejemplo:**

```json
{
    "playlistId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "playlistTitle": "Mis Videos Favoritos",
    "videoCount": 15,
    "videos": [
        {
            "infoId": "video-1-id",
            "title": "Primer Video",
            "duration": 180,
            "formats": [...]
        },
        {
            "infoId": "video-2-id",
            "title": "Segundo Video",
            "duration": 240,
            "formats": [...]
        }
    ]
}
```

---

### 5. Descargar Playlist (en el Servidor)

**Endpoint:** `POST /api/youtuDown/playlist/download`

**Descripción:** Descarga todos los videos de una playlist en el servidor.

**Body (JSON):**

```json
{
  "playlistId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "outputPath": "/home/user/Videos/MiPlaylist",
  "formatId": "18"
}
```

**Parámetros:**

* `playlistId`: ID obtenido del request a `/playlist/info`
* `outputPath`: Directorio donde se guardarán los videos en el servidor
* `formatId`: ID del formato de calidad deseado para todos los videos

**Respuesta:**

```json
{
    "message": "Playlist download started",
    "totalVideos": 15,
    "downloadedVideos": 15
}
```

---

## Flujo de Uso

### Descargar un Video Individual (al Cliente)

1. **Obtener información del video:**

   ```
   GET http://localhost:8080/api/youtuDown/info?url=https://youtube.com/watch?v=...
   ```

2. **Guardar el `infoId` de la respuesta**

3. **Seleccionar el `formatId` deseado de los formatos disponibles**

4. **Stream de descarga al cliente:**

   ```
   POST http://localhost:8080/api/youtuDown/download-stream?infoId=303d77d2-e9e8-4f72-a8ed-429c51d8940d&formatId=96
   ```

### Descargar una Playlist (en el Servidor)

1. **Obtener información de la playlist:**

   ```
   GET http://localhost:8080/api/youtuDown/playlist/info?url=https://youtube.com/playlist?list=...
   ```

2. **Guardar el `playlistId` de la respuesta**

3. **Descargar la playlist completa:**

   ```
   POST http://localhost:8080/api/youtuDown/playlist/download
   Content-Type: application/json

   {
     "playlistId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
     "outputPath": "/ruta/destino",
     "formatId": "18"
   }
   ```

---

## Documentación Completa

Para más detalles y ejemplos de uso, consulta la documentación en Postman:

📄 [Documentación en Postman](https://documenter.getpostman.com/view/47022693/2sBXVmeoPz)

---

## Instalación y Configuración

```bash
# Clonar el repositorio
git clone https://github.com/angelr449/YoutuDown.git

# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

El servidor correrá en `http://localhost:8080`

---

## Licencia

Licencia MIT — consulta [LICENSE](./LICENSE) para más detalles.

---

## Contribuciones

¡Las contribuciones son bienvenidas! Abre un issue o pull request con tus sugerencias y mejoras.
