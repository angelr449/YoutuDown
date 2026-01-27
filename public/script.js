// ===========================
// Configuration
// ===========================

const API_BASE_URL = 'https://youtudown-k4wd.onrender.com/api/youtuDown';

// ===========================
// State Management
// ===========================

let currentVideoInfo = null;
let currentPlaylistInfo = null;
let selectedFormat = null;
let currentLanguage = 'en';
let currentTheme = 'auto';
let currentUrl = '';

// ===========================
// Translations
// ===========================

const translations = {
    en: {
        errors: {
            invalidUrl: 'Please enter a valid YouTube URL',
            fetchFailed: 'Failed to fetch video information. Please try again.',
            downloadFailed: 'Download failed. Please try again.',
            noFormat: 'Please select a quality format',
        },
        duration: 'Duration',
        videos: 'videos',
        estimatedTime: '~30s',
    },
    es: {
        errors: {
            invalidUrl: 'Por favor ingresa una URL de YouTube válida',
            fetchFailed: 'Error al obtener información del video. Inténtalo de nuevo.',
            downloadFailed: 'Descarga fallida. Inténtalo de nuevo.',
            noFormat: 'Por favor selecciona un formato de calidad',
        },
        duration: 'Duración',
        videos: 'videos',
        estimatedTime: '~30s',
    }
};

// ===========================
// Utility Functions
// ===========================

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function isPlaylistUrl(url) {
    return url.includes('list=') || url.includes('/playlist');
}

function isValidYouTubeUrl(url) {
    const patterns = [
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
        /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=.+$/
    ];
    return patterns.some(pattern => pattern.test(url));
}

function getYouTubeVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/,
        /youtube\.com\/embed\/([^&\?\/]+)/,
        /youtube\.com\/v\/([^&\?\/]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}

function getYouTubeThumbnail(url) {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
}

function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function translate(key, lang = currentLanguage) {
    const keys = key.split('.');
    let value = translations[lang];
    
    for (const k of keys) {
        value = value?.[k];
    }
    
    return value || key;
}

// ===========================
// Theme Management
// ===========================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Remove all theme attributes first
    document.documentElement.removeAttribute('data-theme');
    
    // Set theme attribute if not auto
    if (theme !== 'auto') {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Update button states
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

// ===========================
// Language Management
// ===========================

function initLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-text-en]').forEach(element => {
        element.textContent = element.dataset[`text${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
    });
    
    // Update placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(element => {
        element.placeholder = element.dataset[`placeholder${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// ===========================
// API Functions
// ===========================

async function fetchVideoInfo(url) {
    const response = await fetch(`${API_BASE_URL}/info?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch video info');
    }
    
    return await response.json();
}

async function fetchPlaylistInfo(url) {
    const response = await fetch(`${API_BASE_URL}/playlist/info?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch playlist info');
    }
    
    return await response.json();
}

async function downloadVideo(url, formatId) {
    // CORRECCIÓN: Cambiado de POST a GET
    // La URL se pasa tal cual la recibe del cliente
    // El formatId se obtiene del formato seleccionado
    
    try {
        const response = await fetch(
            `${API_BASE_URL}/download-stream?url=${encodeURIComponent(url)}&formatId=${encodeURIComponent(formatId)}`,
            { method: 'GET' }
        );
        
        if (!response.ok) {
            // Intentar leer el mensaje de error del servidor
            let errorMessage = 'Download failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.details || errorMessage;
            } catch (e) {
                // Si no es JSON, usar el status text
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        return response;
    } catch (error) {
        // Re-throw para que sea manejado por el handler de descarga
        throw error;
    }
}

// ===========================
// UI Update Functions
// ===========================

function showLoading() {
    hideElement(document.getElementById('errorState'));
    hideElement(document.getElementById('videoInfo'));
    hideElement(document.getElementById('playlistInfo'));
    showElement(document.getElementById('loadingState'));
}

function hideLoading() {
    hideElement(document.getElementById('loadingState'));
}

function showError(message) {
    hideLoading();
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    showElement(errorState);
}

function displayVideoInfo(info) {
    currentVideoInfo = info;
    
    const videoInfo = document.getElementById('videoInfo');
    const videoTitle = document.getElementById('videoTitle');
    const videoDuration = document.getElementById('videoDuration');
    const formatOptions = document.getElementById('formatOptions');
    const videoThumbnail = document.getElementById('videoThumbnail');
    
    // Set thumbnail
    const thumbnailUrl = getYouTubeThumbnail(currentUrl);
    if (thumbnailUrl) {
        videoThumbnail.src = thumbnailUrl;
        videoThumbnail.style.display = 'block';
    } else {
        videoThumbnail.style.display = 'none';
    }
    
    videoTitle.textContent = info.title;
    videoDuration.textContent = `${translate('duration')}: ${formatDuration(info.duration)}`;
    
    // Clear and populate formats
    formatOptions.innerHTML = '';
    
    // Filtrar formatos que probablemente estén disponibles
    // Priorizar formatos con audio + video
    const availableFormats = info.formats.filter(format => {
        // Filtrar por resolución conocida si existe
        const resolution = format.resolution || format.quality || '';
        const isValidResolution = /\d+p/.test(resolution) || resolution.includes('Audio');
        
        // Preferir formatos que tengan audio y video juntos
        const hasAudioVideo = format.hasAudio && format.hasVideo;
        
        // Excluir formatos con ID muy alto (usualmente problemáticos)
        const formatIdNum = parseInt(format.id);
        const isReasonableId = isNaN(formatIdNum) || formatIdNum < 600;
        
        return isValidResolution && isReasonableId;
    });
    
    // Si no hay formatos filtrados, mostrar todos
    const formatsToShow = availableFormats.length > 0 ? availableFormats : info.formats;
    
    // Agrupar y ordenar formatos
    const sortedFormats = formatsToShow.sort((a, b) => {
        // Priorizar formatos con audio + video
        if (a.hasAudio && a.hasVideo && !(b.hasAudio && b.hasVideo)) return -1;
        if (!(a.hasAudio && a.hasVideo) && b.hasAudio && b.hasVideo) return 1;
        
        // Luego ordenar por resolución (de mayor a menor)
        const getResolutionValue = (format) => {
            const res = format.resolution || format.quality || '';
            const match = res.match(/(\d+)p/);
            return match ? parseInt(match[1]) : 0;
        };
        
        return getResolutionValue(b) - getResolutionValue(a);
    });
    
    // Limitar a los primeros 10 formatos más relevantes
    const displayFormats = sortedFormats.slice(0, 10);
    
    displayFormats.forEach(format => {
        const formatBtn = document.createElement('button');
        formatBtn.className = 'format-option';
        formatBtn.dataset.formatId = format.id;
        
        // El backend devuelve 'quality' y 'resolution'
        const hasAudioVideo = format.hasAudio && format.hasVideo;
        const quality = format.quality || format.resolution || 'Unknown';
        const ext = format.ext || 'mp4';
        
        // Información adicional (si está disponible)
        let sizeInfo = '';
        if (format.filesize) {
            const sizeMB = (format.filesize / (1024 * 1024)).toFixed(1);
            sizeInfo = ` • ${sizeMB} MB`;
        }
        
        formatBtn.innerHTML = `
            <div class="format-quality">${quality}${sizeInfo}</div>
            <div class="format-details">
                ${hasAudioVideo ? 
                    `<span class="format-badge audio-video">Audio + Video</span>` : 
                    format.hasVideo ? 
                        `<span class="format-badge video-only">Video Only</span>` : 
                        `<span class="format-badge audio-only">Audio Only</span>`
                }
                <span class="format-ext">${ext.toUpperCase()}</span>
            </div>
        `;
        
        formatBtn.addEventListener('click', () => selectFormat(format.id));
        formatOptions.appendChild(formatBtn);
    });
    
    hideLoading();
    showElement(videoInfo);
}

function displayPlaylistInfo(info) {
    currentPlaylistInfo = info;
    
    const playlistInfo = document.getElementById('playlistInfo');
    const playlistTitle = document.getElementById('playlistTitle');
    const playlistCount = document.getElementById('playlistCount');
    const playlistVideosList = document.getElementById('playlistVideosList');
    
    playlistTitle.textContent = info.title;
    playlistCount.textContent = `${info.videos.length} ${translate('videos')}`;
    
    // Clear and populate videos
    playlistVideosList.innerHTML = '';
    info.videos.forEach((video, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'playlist-video-item';
        
        videoItem.innerHTML = `
            <div class="video-number">${index + 1}</div>
            <div class="video-details">
                <div class="video-title">${video.title}</div>
                <div class="video-duration">${formatDuration(video.duration)}</div>
            </div>
            <button class="video-download-btn" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            </button>
        `;
        
        const downloadBtn = videoItem.querySelector('.video-download-btn');
        downloadBtn.addEventListener('click', () => handlePlaylistVideoDownload(index));
        
        playlistVideosList.appendChild(videoItem);
    });
    
    hideLoading();
    showElement(playlistInfo);
}

function selectFormat(formatId) {
    selectedFormat = formatId;
    
    // Update UI
    document.querySelectorAll('.format-option').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.formatId === formatId);
    });
    
    // Enable download button
    document.getElementById('downloadBtn').disabled = false;
}

function showDownloadProgress(title) {
    const progressSection = document.getElementById('downloadProgress');
    const downloadingTitle = document.getElementById('downloadingTitle');
    
    downloadingTitle.textContent = title;
    showElement(progressSection);
    
    // Animate progress bar
    const progressFill = progressSection.querySelector('.progress-fill');
    progressFill.style.width = '100%';
}

function hideDownloadProgress() {
    const progressSection = document.getElementById('downloadProgress');
    hideElement(progressSection);
    
    // Reset progress
    const progressFill = progressSection.querySelector('.progress-fill');
    progressFill.style.width = '0%';
}

function resetUI() {
    // Clear state
    currentVideoInfo = null;
    currentPlaylistInfo = null;
    selectedFormat = null;
    currentUrl = '';
    
    // Clear input
    document.getElementById('urlInput').value = '';
    
    // Hide all sections
    hideElement(document.getElementById('videoInfo'));
    hideElement(document.getElementById('playlistInfo'));
    hideElement(document.getElementById('errorState'));
    hideElement(document.getElementById('downloadProgress'));
    
    // Enable analyze button
    document.getElementById('analyzeBtn').disabled = false;
}

// ===========================
// Event Handlers
// ===========================

async function handleAnalyze() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();
    
    // Validate URL
    if (!url) {
        showError(translate('errors.invalidUrl'));
        return;
    }
    
    if (!isValidYouTubeUrl(url)) {
        showError(translate('errors.invalidUrl'));
        return;
    }
    
    // Store the URL
    currentUrl = url;
    
    // Disable button during fetch
    document.getElementById('analyzeBtn').disabled = true;
    
    showLoading();
    
    try {
        if (isPlaylistUrl(url)) {
            const info = await fetchPlaylistInfo(url);
            displayPlaylistInfo(info);
        } else {
            const info = await fetchVideoInfo(url);
            displayVideoInfo(info);
        }
    } catch (error) {
        console.error('Error fetching info:', error);
        showError(translate('errors.fetchFailed'));
        document.getElementById('analyzeBtn').disabled = false;
    }
}

async function handleDownload() {
    if (!selectedFormat) {
        showError(translate('errors.noFormat'));
        return;
    }
    
    if (!currentVideoInfo || !currentUrl) {
        return;
    }
    
    // Disable download button
    document.getElementById('downloadBtn').disabled = true;
    
    showDownloadProgress(currentVideoInfo.title);
    
    try {
        // Intentar con el formato seleccionado
        let response;
        try {
            response = await downloadVideo(currentUrl, selectedFormat);
        } catch (firstError) {
            console.warn('Primer intento falló, intentando con formato genérico mp4:', firstError);
            
            // Si falla, intentar con formato genérico 'mp4'
            try {
                response = await downloadVideo(currentUrl, 'mp4');
            } catch (secondError) {
                // Si también falla, intentar con 'best'
                console.warn('Formato mp4 falló, intentando con best:', secondError);
                response = await downloadVideo(currentUrl, 'best');
            }
        }
        
        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'video.mp4';
        
        if (contentDisposition) {
            // Intentar diferentes formatos de filename
            // Formato 1: filename="nombre.mp4"
            let match = contentDisposition.match(/filename="([^"]+)"/);
            if (match) {
                filename = match[1];
            } else {
                // Formato 2: filename=nombre.mp4 (sin comillas)
                match = contentDisposition.match(/filename=([^;]+)/);
                if (match) {
                    filename = match[1].trim();
                }
            }
        }
        
        // Create blob and download
        const blob = await response.blob();
        
        // Verificar que el blob tenga contenido
        if (blob.size === 0) {
            throw new Error('Downloaded file is empty');
        }
        
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
        
        // Hide progress and show success
        setTimeout(() => {
            hideDownloadProgress();
            document.getElementById('downloadBtn').disabled = false;
        }, 1000);
        
    } catch (error) {
        console.error('Download error:', error);
        hideDownloadProgress();
        
        // Mostrar un mensaje de error más específico
        const errorMsg = error.message || translate('errors.downloadFailed');
        showError(`${translate('errors.downloadFailed')} - ${errorMsg}`);
        
        document.getElementById('downloadBtn').disabled = false;
    }
}

async function handlePlaylistVideoDownload(videoIndex) {
    if (!currentPlaylistInfo || !currentPlaylistInfo.videos[videoIndex]) {
        return;
    }
    
    const video = currentPlaylistInfo.videos[videoIndex];
    
    // Get all download buttons
    const downloadBtns = document.querySelectorAll('.video-download-btn');
    const currentBtn = downloadBtns[videoIndex];
    
    // Disable current button
    currentBtn.disabled = true;
    currentBtn.style.opacity = '0.5';
    
    showDownloadProgress(video.title);
    
    try {
        // Construir la URL del video individual
        const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
        
        // Usar el mejor formato disponible (usualmente el último es la mejor calidad)
        const bestFormat = video.formats[video.formats.length - 1];
        
        // Descargar con la URL completa y el formatId
        const response = await downloadVideo(videoUrl, bestFormat.id);
        
        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `${video.title}.mp4`;
        
        if (contentDisposition) {
            // Intentar diferentes formatos de filename
            // Formato 1: filename="nombre.mp4"
            let match = contentDisposition.match(/filename="([^"]+)"/);
            if (match) {
                filename = match[1];
            } else {
                // Formato 2: filename=nombre.mp4 (sin comillas)
                match = contentDisposition.match(/filename=([^;]+)/);
                if (match) {
                    filename = match[1].trim();
                }
            }
        }
        
        // Create blob and download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
        
        // Hide progress
        setTimeout(() => {
            hideDownloadProgress();
            currentBtn.disabled = false;
            currentBtn.style.opacity = '1';
        }, 1000);
        
    } catch (error) {
        console.error('Download error:', error);
        hideDownloadProgress();
        showError(translate('errors.downloadFailed'));
        currentBtn.disabled = false;
        currentBtn.style.opacity = '1';
    }
}

// ===========================
// Event Listeners
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme and language
    initTheme();
    initLanguage();
    
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });
    
    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    
    // Analyze button
    document.getElementById('analyzeBtn').addEventListener('click', handleAnalyze);
    
    // Enter key on input
    document.getElementById('urlInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAnalyze();
        }
    });
    
    // Download button
    document.getElementById('downloadBtn').addEventListener('click', handleDownload);
    
    // Reset buttons
    document.getElementById('resetBtn').addEventListener('click', resetUI);
    document.getElementById('resetBtnPlaylist').addEventListener('click', resetUI);
    
    // Retry button
    document.getElementById('retryBtn').addEventListener('click', () => {
        hideElement(document.getElementById('errorState'));
        document.getElementById('analyzeBtn').disabled = false;
    });
});
