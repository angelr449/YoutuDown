# YouTuDown API

## Versión v0.1.0-Beta

Backend para descargar videos de YouTube individualmente. Esta versión permite obtener información detallada de videos y descargarlos en diferentes calidades.

> **Nota:** Las futuras versiones incluirán soporte para playlists y WebSockets para mostrar barras de progreso en tiempo real.

## Características

- ✅ Descarga de videos individuales
- ✅ Extracción de información del video (resolución, duración, formatos disponibles)
- ⏳ Soporte para playlists (próximamente)
- ⏳ WebSockets para barra de progreso (próximamente)

## API Endpoints

### Ruta Base
```
http://localhost:8080/api/youtuDown
```

---

### 1. Obtener Información del Video

**Endpoint:** `GET /api/youtuDown/info`

**Descripción:** Extrae la información del video mediante la URL proporcionada.

**Query Parameters:**
- `url` - URL del video de YouTube

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

**Campos de respuesta:**
- `infoId`: ID único del archivo temporal que contiene la información del video
- `title`: Título del video
- `duration`: Duración en segundos
- `formats`: Array de formatos disponibles
  - `id`: ID del formato de calidad
  - `resolution`: Resolución del video
  - `hasAudio`: Indica si incluye audio
  - `hasVideo`: Indica si incluye video

> **Importante:** El `infoId` es necesario para la descarga. La información se guarda temporalmente en un archivo `.json`.

---

### 2. Descargar Video

**Endpoint:** `POST /api/youtuDown/download`

**Descripción:** Descarga el video en el formato y ubicación especificados.

**Body (JSON):**
```json
{
  "outputPath": "/home/angelrios/Escritorio",
  "filename": "betas.mp4",
  "infoId": "303d77d2-e9e8-4f72-a8ed-429c51d8940d",
  "formatId": "18"
}
```

**Parámetros:**
- `outputPath`: Ruta donde se guardará el video
- `filename`: Nombre del archivo (opcional)
- `infoId`: ID obtenido de la petición `/info`
- `formatId`: ID del formato de calidad deseado

**Respuesta:**
```json
{
    "messege": "download video funcionando"
}
```

---

## Flujo de Uso

1. **Obtener información del video:**
   ```bash
   GET http://localhost:8080/api/youtuDown/info?url=https://youtube.com/watch?v=...
   ```

2. **Guardar el `infoId` de la respuesta**

3. **Seleccionar el `formatId` deseado de los formatos disponibles**

4. **Descargar el video:**
   ```bash
   POST http://localhost:8080/api/youtuDown/download
   Content-Type: application/json

   {
     "outputPath": "/ruta/destino",
     "filename": "mi-video.mp4",
     "infoId": "303d77d2-e9e8-4f72-a8ed-429c51d8940d",
     "formatId": "96"
   }
   ```

## Documentación Completa

Para más detalles y ejemplos de uso, consulta la documentación de Postman:

📄 [Documentación en Postman](https://documenter.getpostman.com/view/47022693/2sBXVkCqEP)

---

## Instalación y Configuración

```bash
# Clonar el repositorio
git clone [https://github.com/angelr449/YoutuDown.git]

# Instalar dependencias
npm install

# Iniciar el servidor
npm start
```

El servidor se ejecutará en `http://localhost:8080`

---

## Licencia

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

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias y mejoras.