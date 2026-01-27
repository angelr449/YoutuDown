# YouTuDown API

## Versión v0.2.0-Beta

Backend para descargar videos individuales de YouTube y listas de reproducción. Esta versión te permite obtener información detallada de los videos, descargarlos en diferentes calidades y soporta tanto descargas del lado del servidor como del cliente.

## Características

- ✅ Descarga de videos individuales
- ✅ Descarga de listas de reproducción
- ✅ Descargas del lado del servidor (guardar en el servidor)
- ✅ Descargas del lado del cliente (transmitir al usuario)
- ✅ Extracción de información de videos (resolución, duración, formatos disponibles)

## Endpoints de la API

### Ruta Base
```
http://localhost:8080/api/youtuDown
```

---

### 1. Obtener Información del Video

**Endpoint:** `GET /api/youtuDown/info`

**Descripción:** Extrae la información del video utilizando la URL proporcionada.

**Parámetros de Consulta:**
- `url` - URL del video de YouTube

**Ejemplo de Respuesta:**
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

**Campos de Respuesta:**
- `infoId`: ID único del archivo temporal que contiene la información del video
- `title`: Título del video
- `duration`: Duración en segundos
- `formats`: Array de formatos disponibles
  - `id`: ID del formato de calidad
  - `resolution`: Resolución del video
  - `hasAudio`: Indica si incluye audio
  - `hasVideo`: Indica si incluye video

> **Importante:** El `infoId` es requerido para la descarga. La información se guarda temporalmente en un archivo `.json`.

---

### 2. Descargar Video (Lado del Servidor)

**Endpoint:** `POST /api/youtuDown/download`

**Descripción:** Descarga el video en el servidor en el formato y ubicación especificados.

**Body (JSON):**
```json
{
  "outputPath": "/home/usuario/Videos",
  "filename": "mi-video.mp4",
  "infoId": "303d77d2-e9e8-4f72-a8ed-429c51d8940d",
  "formatId": "18"
}
```

**Parámetros:**
- `outputPath`: Ruta donde se guardará el video en el servidor
- `filename`: Nombre del archivo (opcional)
- `infoId`: ID obtenido de la petición `/info`
- `formatId`: ID del formato de calidad deseado

**Respuesta:**
```json
{
    "message": "Video descargado exitosamente en el servidor"
}
```

---

### 3. Descargar Video (Stream al Cliente)

**Endpoint:** `POST /api/youtuDown/download-stream`

**Descripción:** Transmite el video directamente al cliente para descargarlo en el navegador del usuario.

**Query Params:**
- `infoId` - ID obtenido de la petición `/info`
- `formatId` - ID del formato de calidad deseado

**Ejemplo:**
```
POST /api/youtuDown/download-stream?infoId=303d77d2-e9e8-4f72-a8ed-429c51d8940d&formatId=96
```

**Respuesta:**
- Stream binario del archivo de video
- Content-Type: `video/mp4` o `application/octet-stream`
- Header Content-Disposition con el nombre del archivo

---

### 4. Obtener Información de la Lista de Reproducción

**Endpoint:** `GET /api/youtuDown/playlist/info`

**Descripción:** Extrae información de todos los videos en una lista de reproducción de YouTube.

**Parámetros de Consulta:**
- `url` - URL de la lista de reproducción de YouTube

**Ejemplo de Respuesta:**
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

### 5. Descargar Lista de Reproducción (Lado del Servidor)

**Endpoint:** `POST /api/youtuDown/playlist/download`

**Descripción:** Descarga todos los videos de una lista de reproducción en el servidor.

**Body (JSON):**
```json
{
  "playlistId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "outputPath": "/home/usuario/Videos/MiPlaylist",
  "formatId": "18"
}
```

**Parámetros:**
- `playlistId`: ID obtenido de la petición `/playlist/info`
- `outputPath`: Directorio donde se guardarán los videos en el servidor
- `formatId`: ID del formato de calidad deseado para todos los videos

**Respuesta:**
```json
{
    "message": "Descarga de playlist iniciada",
    "totalVideos": 15,
    "downloadedVideos": 15
}
```

---

## Flujo de Uso

### Descargar un Video Individual (Lado del Cliente)

1. **Obtener información del video:**
   ```bash
   GET http://localhost:8080/api/youtuDown/info?url=https://youtube.com/watch?v=...
   ```

2. **Guardar el `infoId` de la respuesta**

3. **Seleccionar el `formatId` deseado de los formatos disponibles**

4. **Descargar en stream al cliente:**
   ```bash
   POST http://localhost:8080/api/youtuDown/download-stream?infoId=303d77d2-e9e8-4f72-a8ed-429c51d8940d&formatId=96
   ```

### Descargar una Lista de Reproducción (Lado del Servidor)

1. **Obtener información de la playlist:**
   ```bash
   GET http://localhost:8080/api/youtuDown/playlist/info?url=https://youtube.com/playlist?list=...
   ```

2. **Guardar el `playlistId` de la respuesta**

3. **Descargar la playlist completa:**
   ```bash
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

Para más detalles y ejemplos de uso, consulta la documentación de Postman:

📄 [Documentación Postman](https://documenter.getpostman.com/view/47022693/2sBXVmeoPz)

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

El servidor se ejecutará en `http://localhost:8080`

---

## Licencia

Licencia MIT

Copyright (c) 2026 angel_r

Por la presente se concede permiso, libre de cargos, a cualquier persona que obtenga una copia
de este software y de los archivos de documentación asociados (el "Software"), a utilizar
el Software sin restricción, incluyendo sin limitación los derechos a usar, copiar, modificar,
fusionar, publicar, distribuir, sublicenciar, y/o vender copias del Software, y a permitir
a las personas a las que se les proporcione el Software a hacer lo mismo, sujeto a las
siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias
o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "COMO ESTÁ", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA,
INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD PARA UN PROPÓSITO
PARTICULAR E INCUMPLIMIENTO. EN NINGÚN CASO LOS AUTORES O PROPIETARIOS DE DERECHOS DE AUTOR
SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, YA SEA EN UNA
ACCIÓN DE CONTRATO, AGRAVIO O CUALQUIER OTRO MOTIVO, DERIVADAS DE, FUERA DE O EN CONEXIÓN
CON EL SOFTWARE O SU USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.

---

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor abre un issue o pull request para sugerencias y mejoras.
